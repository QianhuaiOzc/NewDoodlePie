var Core = (function() {

	/**
	 * store obj of module
	 * obj: {
	 * 		{string} creator, 
	 * 		{object} instance, 
	 * 		{SandBox} sandBox, 
	 * 		{function(data:object)} events
	 * }
	 * 
	 * creator: function for creating instance of module
	 * instance: instance of module
	 * sandBox: sandBox used by module
	 * events: events registered by module
	 */
	var modules = {}, events = {};

	return {
		/**
		 * register module by moduleName and its creator function,
		 * but do not start
		 * 
		 * @param {string} moduleName 
		 * 		module name and also the DOM container id
		 * 		of this module
		 * 
		 * @param {function(sandBox:SandBox, ...)} creator
		 * 		function for creating the module
		 * 
		 */
		registerModule: function(moduleName, creator) {
			if(!moduleName || !creator) {
				this.log("Core.registerModule: module name and creator");
				return ;
			}

			if(modules[moduleName]) {
				this.log("Core.registerModule: module '" + moduleName + "' is already existed");
			}

			module = modules[moduleName] = {
				creator: creator,
				instance: null,
				sandBox: new SandBox(this, moduleName),
				events: []
			};

			if(module.sandBox.container) {
				module.sandBox.container.style.display = "none";
			}
		},
		
		/**
		 * start module which have been registered and have not been started,
		 * invoke creator of module and init function of module instance
		 * 
		 * @param {string} moduleName
		 * 		module name
		 * @param {...*} varArgs
		 * 		extra parameters should be passed to creator if is necessary
		 */
		start: function(moduleName, varArgs) {
			var module = modules[moduleName];
			if(!module) {
				this.log("Core.start: module '" + moduleName + "' has not been registered");
				return ;
			}

			if(module.instance) {
				this.log("Core.start: module '" + moduleName + "' has been started before");
				return ;
			}

			var args = [];
			args.push(module.sandBox);
			for(var i = 1, arg; arg = arguments[i]; i++) {
				args.push(arg);
			}

			module.instance = module.creator.apply(this, args);
			module.instance.init();
		},
		/**
		 * stop module which have already been started,
		 * invoke destroy function of module instance and ignore all events
		 * registered by this module
		 * 
		 * @param {string} moduleName
		 * 		module name
		 */
		stop: function(moduleName) {
			var module = modules[moduleName];
			if(!module || !module.instance) {
				return ;
			}

			module.instance.destroy();

			for(var evt in module.events) {
				this.unregisterEvent(moduleName, evt);
			}

			module.instance = null;
		},
		/**
		 * start all modules if the module has not been started before
		 * 
		 * @param {object} extraParams
		 * 		extra parameters should be passed to 
		 * 		module specified by moduleName
		 * 		extraParams: {{string} moduleName: {Array} params}
		 */
		startAll: function(extraParams) {
			for(var moduleName in modules) {
				var module = modules[moduleName];
				if(module && module.instance) {
					continue ;
				}

				var args = [],
					extra = extraParams ? extraParams[moduleName] : undefined;

				args.push(moduleName);
				if(extra) {
					for(var i = 0, t; t = extra[i]; i++) {
						args.push(t);
					}
				}

				this.start.apply(this, args);
			}
		},
		/**
		 * stop all modules
		 */
		stopAll: function() {
			for(var moduleName in modules) {
				this.stop(moduleName);
			}
		},
		/**
		 * register event of module
		 * 
		 * @param {string} moduleName
		 * 		module name
		 * @param {string} evt
		 * 		event name
		 * @param {function(data:object)} fn
		 *		function to be invoked when this event is triggered 		
		 */
		registerEvent: function(moduleName, evt, fn) {
			var module = modules[moduleName];
			if(!module || !module.instance) {
				this.log("Core.registerEvent: module '" + moduleName + "' does not exist");
				return ;
			}

			var oldFn = module.events[evt];
			if(oldFn) {
				this.unregisterEvent(moduleName, evt);
			}

			module.events[evt] = fn;
			var fns = events[evt];
			if(!fns) {
				fns = [];
				events[evt] = fns;
			}
			fns.push(fn);
		},
		/**
		 * unregister event of module
		 * 
		 * @param {string} moduleName
		 * 		module name
		 * @param {string} evt
		 * 		event name
		 */
		unregisterEvent: function(moduleName, evt) {
			var module = modules[moduleName];
			if(!module || !module.instance) {
				this.log("Core.unregisterEvent: module '" + moduleName + "' does not exist");
				return ;
			}

			var fn = module.events[evt], fns = events[evt];

			if(fn && fns) {
				for(var i = 0, tmpFn; tmpFn = fns[i]; i++) {
					if(tmpFn == fn) {
						fns.splice(i, 1);
						break;
					}
				}
				if(fns.length == 0) {
					delete events[evt];
				}
			}

			delete module.events[evt];
		},
		/**
		 * trigger event
		 * 
		 * @param {object} evtObj
		 * 		evtObj: {{string} type, {object} data}
		 * 				type: event name
		 * 				data: parameter should be passed to event function
		 */
		triggerEvent: function(evtObj) {
			var type = evtObj.type, data = evtObj.data;

			if(!type) {
				this.log("Core.triggerEvent: please specify the type of event");
				return ;
			}

			var fns = events[type];
			if(!fns) {
				return ;
			}

			for(var i = 0, fn; fn = fns[i]; i++) {
				fn(data);
			}
		},

		/**
		 * log
		 * 
		 * @param msg log message
		 */
		log: function(msg) {
			console.log("LOG [ " + msg + " ]");
		}
	};
})();

(function($) {
	var globalData = {};

	var SandBox = function(core, moduleName) {
		if(!moduleName) {
			core.log("SandBox.constructor: module name should be defined");
			return ;
		}

		this.moduleName = moduleName;
		this.container = this.find("#" + moduleName);
		this.core = core;
	};

	/**
	 * get/set global data
	 * if value is defined, set data, or get data
	 * 
	 * @param {string} name
	 * 		data name
	 * @param {object} value
	 * 		data value
	 * 
	 * @returns {object|undefined}
	 */
	SandBox.prototype.data = function(name, value) {
		if(typeof value != "undefined") {
			globalData[name] = value;
		} else {
			return globalData[name];
		}
	};

	/**
	 * remove global data
	 * 
	 * @param {string} name
	 * 		data name
	 */
	SandBox.prototype.removeData = function(name) {
		delete globalData[name];
	};

	/**
	 * notify event registered by events
	 * 
	 * @param {string} evtObj
	 * @see Core.triggerEvent
	 */
	SandBox.prototype.notify = function(evtObj) {
		this.core.triggerEvent(evtObj);
	};

	/**
	 * listen events
	 * 
	 * @param {object} evts 
	 * 		{{string} eventName: {function(data:object) fn}}
	 */
	SandBox.prototype.listen = function(evts) {
		for(var evt in evts) {
			this.core.registerEvent(this.moduleName, evt, evts[evt]);
		}
	};

	/**
	 * ignore events
	 * @param {Array.<string>} evts
	 * 		events' name
	 */
	SandBox.prototype.ignore = function(evts) {
		for(var i = 0, evt; evt = evts[i]; i++) {
			this.core.unregisterEvent(this.moduleName, evt);
		}
	};

	/**
	 * find one DOM element
	 * 
	 * @param {string} selector
	 * @param {DOMElement} ctx
	 * 		context
	 * 
	 * @returns {DOMElement}
	 */
	SandBox.prototype.find = function(selector, ctx) {
		ctx = ctx || document;
		return $(selector, ctx)[0];
	};

	/**
	 * query DOM elements
	 * 
	 * @param {string} selector
	 * @param {DOMElement} ctx
	 * 		context
	 * 
	 * @returns {Array.<DOMElement>}
	 */
	SandBox.prototype.query = function(selector, ctx) {
		ctx = ctx || document;
		return $(selector, ctx);
	};

	/**
	 * add class to DOM element
	 * 
	 * @param {DOMElement} elem
	 * @param {string} className
	 */
	SandBox.prototype.addClass = function(elem, className) {
		$(elem).addClass(className);
	};

	/**
	 * remove class of DOM element
	 * 
	 * @param {DOMElement} elem
	 * @param {string} className
	 */
	SandBox.prototype.removeClass = function(elem, className) {
		$(elem).removeClass(className);
	};

	/**
	 * check if DOM element has specified class
	 * 
	 * @param {DOMElement} elem
	 * @param {string} className
	 */
	SandBox.prototype.hasClass = function(elem, className) {
		return $(elem).hasClass(className);
	};

	/**
	 * set dom element's style.display as ""
	 * 
	 * @param {DOMElement} elem
	 */
	SandBox.prototype.show = function(elem) {
		elem.style.display = "";
	};

	/**
	 * set dom element's style.display as "none"
	 * 
	 * @param {DOMElement} elem
	 */
	SandBox.prototype.hide = function(elem) {
		elem.style.display = "none";
	};

	/**
	 * the same as document.createElement
	 * 
	 * @param {string} tagName
	 */
	SandBox.prototype.createElement = function(tagName) {
		// this.core.log("Create element '" + tagName + "'");
		return $("<"+tagName+"></"+tagName+">").get(0);
	};

	SandBox.prototype.css = function(elem, name, value) {
		$(elem).css(name, value);
	}

	/**
	 * get cookie by name
	 * 
	 * @param {string} name
	 * @returns {string} value of cookie
	 */
	SandBox.prototype.getCookie = function(first_argument) {};

	/**
	 * set cookie by name and value
	 * 
	 * @param {string} name
	 * @param {string} value
	 */
	SandBox.prototype.setCookie = function(first_argument) {};

	/**
	 * remove cookie by name
	 * 
	 * @param {string} name
	 */
	SandBox.prototype.removeCookie = function(first_argument) {};

	/**
	 * trim string
	 * 
	 * @param {string} str
	 * @returns {string}
	 */
	SandBox.prototype.trim = function(str) {
		return str.trim();
	};

	this.SandBox = SandBox;
	
})(jQuery);

Core.registerModule("controller", function(sandBox) {
	
	var moduleMap = {
		"start": ["drawShape", "crayon", "brushSize", "home"],
		"drawShape": ["drawShape", "crayon", "brushSize"],
		"drawPicture": ["drawPicture", "crayon", "brushSize", "undo", "pieMenu", "stamp"],
		"painting": ["painting", "crayon", "brushSize", "undo", "pieMenu"],
		"blackboard": ["blackboard", "chalk", "brushSize", "undo", "pieMenu"]
	};
	var currentModule = null;

	return {
		init: function() {
			var startModules = moduleMap["start"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
			currentModule = "start";

			sandBox.listen({"drawShapeFinish": this.drawShapeFinish});
			sandBox.listen({"openPainting": this.openPainting});
			sandBox.listen({"home": this.home});
			sandBox.listen({"openBlackboard": this.openBlackboard});
		},

		drawShapeFinish: function(evtObj) {
			var nextModule = evtObj.nextModule;
			var data = evtObj.data;
			var stopModules = moduleMap["drawShape"];
			for(var i = 0; i < stopModules.length; i++) {
				Core.stop(stopModules[i]);
			}
			var startModules = moduleMap[nextModule];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i], data);
			}
			currentModule = nextModule;
		},

		openPainting: function() {
			var stopModules = moduleMap[currentModule];
			for(var i = 0; i < stopModules.length; i++) {
				Core.stop(stopModules[i]);
			}
			var startModules = moduleMap["painting"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
			currentModule = "painting";
		},

		home: function() {
			var stopModules = moduleMap[currentModule];
			for(var i = 0; i < stopModules.length; i++) {
				Core.stop(stopModules[i]);
			}
			var startModules = moduleMap["drawShape"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
			currentModule = "drawShape";
		}, 

		openBlackboard: function() {
			
		},
		
		destroy: function() {}
	};
});

Core.registerModule("home", function(sandBox) {
	
	var container = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);

			container.onclick = function() {
				sandBox.notify({
					"type": "home"
				});
			}
		},
		destroy: function() {}
	};
});

Core.registerModule("pieMenu", function(sandBox) {
	var container = null;
	var saveDiv = null, guessDiv = null, fillDiv = null, blackboardDiv = null, magicDiv = null, pieDiv = null;
	var isShow = false;
	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			saveDiv = sandBox.find("#save");
			guessDiv = sandBox.find("#guess");
			fillDiv = sandBox.find("#fill");
			blackboardDiv = sandBox.find("#blackboard");
			magicDiv = sandBox.find("#magic");
			pieDiv = sandBox.find("#pie");
			sandBox.hide(saveDiv);
			sandBox.hide(guessDiv);
			sandBox.hide(blackboardDiv);
			sandBox.hide(magicDiv);
			sandBox.hide(fillDiv);

			pieDiv.onclick = function() {
				if(isShow == true) {
					sandBox.hide(saveDiv);
					sandBox.hide(guessDiv);
					sandBox.hide(blackboardDiv);
					sandBox.hide(magicDiv);
					sandBox.hide(fillDiv);
					isShow = false;
				} else {
					sandBox.show(saveDiv);
					sandBox.show(guessDiv);
					sandBox.show(fillDiv);
					sandBox.show(blackboardDiv);
					sandBox.show(magicDiv);
					isShow = true;
				}
			};

			saveDiv.onclick = function() {
				sandBox.notify( {
					"type": "save"
				} );
			};

			fillDiv.onclick = function() {
				sandBox.notify({
					"type": "openPainting"
				});
			};

			blackboardDiv.onclick = function() {
				sandBox.notify({
					"type": "openBlackboard"
				});
			}
		},

		destroy: function() {
			sandBox.hide(container);
		}
	};
});

Core.registerModule("drawShape", function(sandBox) {
	var container = null;
	var frontCanvas = null, backCanvas = null;
	var frontCtx = null, backCtx = null;
	var currentColor = null, currentSize = null, currentPath = null;
	var pathes = [];
	var isDrawing = false, isDone = false, isPaint = false;
	var textureImage = null;
	var shapeGroup = {
        "triangle": "triangle",
        "x": "triangle",
        "check": "triangle",
        "caret": "triangle",
        "v": "triangle",
        "delete": "triangle",
        "circle":"circle",
        "rectangle": "rectangle",
        "left square bracket": "rectangle",
        "right square bracket": "rectangle",
        "star": "star",
        "zig-zag": "spiral",
        "arrow": "spiral",
        "left curly brace": "spiral",
        "right curly brace": "spiral",
        "pigtail": "spiral"
    };
    var recognizer = null, result = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			frontCanvas = sandBox.createElement("canvas");
			sandBox.addClass(frontCanvas, "frontCanvas");
			frontCanvas.setAttribute("width", "800px");
			frontCanvas.setAttribute("height", "600px");
			backCanvas = sandBox.createElement("canvas");
			sandBox.addClass(backCanvas, "backCanvas");
			backCanvas.setAttribute("width", "800px");
			backCanvas.setAttribute("height", "600px");
			container.appendChild(frontCanvas);
			container.appendChild(backCanvas);

			frontCtx = frontCanvas.getContext("2d");
			backCtx = backCanvas.getContext("2d");

			textureImage = new Image();
			textureImage.src = "images/crayon-texture.png";

			recognizer = new DollarRecognizer();

			frontCanvas.onmousedown = this.mouseDown();
			frontCanvas.onmouseup = this.mouseLeave();
			frontCanvas.onmouseout = this.mouseLeave();
			frontCanvas.onmousemove = this.mouseMove();

			sandBox.listen({ "colorChange": this.colorChange });
			sandBox.listen({ "brushSizeChange" : this.brushSizeChange });
		},

		mouseDown: function() {

			return function(e) {
				if(isDone == false) {
					isDrawing = true;
					currentPath = {
						color: currentColor,
						size: currentSize,
						points: [ {
							X: e.offsetX,
							Y: e.offsetY
						} ]	
					};
				}
			// console.log("frontCanvas mouse down");
			};
		},

		mouseLeave: function() {
			var parent = this;
			return function(e) {
				if(isPaint == false && isDrawing == true) {
					isDone = true;
					isDrawing = false;
					pathes.push(currentPath);
					result = recognizer.Recognize(currentPath.points, true);
					parent.repaintBack();
				}	
			};
			// console.log("frontCanvas mouse leave");
		},

		mouseMove: function() {
			var parent = this;
			return function(e) {
				if(isDrawing == true) {
					currentPath.points.push( {
						X: e.offsetX,
						Y: e.offsetY
					} );
					parent.repaintFront();
				}
			};
			// console.log("frontCanvas mouse move");
		},

		colorChange: function(color) {
			currentColor = color;
			// console.log("color change: " + color);
		},

		brushSizeChange: function(size) {
			currentSize = size;
			// console.log("brush size change: " + size);
		},
		
		repaintFront: function() {
			frontCtx.fillStyle = "rgba(255, 255, 255, 0)";
            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);

            frontCtx.beginPath();
            frontCtx.strokeStyle = "#" + currentPath.color;
            frontCtx.lineWidth =  currentPath.size;
            frontCtx.lineJoin = "round";
            frontCtx.lineCap = "round";

            frontCtx.moveTo(currentPath.points[0].X, currentPath.points[0].Y);

            for(var i = 0; i < currentPath.points.length; i++) {
                frontCtx.lineTo(currentPath.points[i].X, currentPath.points[i].Y);
            }
            frontCtx.stroke();
            frontCtx.closePath();
            frontCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
			// console.log("repaintFront");
		},

		repaintBack: function() {
			if(isPaint == false && isDone == true) {
                isPaint = true;
                var num = Math.floor(Math.random() * 3);
                var shape = shapeGroup[result.Name];
                var img = new Image();
                var src = "images/pictures/"+shape+"/"+num;
                img.src = src+"-color.png";
                var id = setInterval(function() {
                    if(img.complete) {
                        backCtx.drawImage(img, 0, 0, img.width, img.height);
                        
                        clearInterval(id);

                        setTimeout(function() {
                            sandBox.notify({
                            	"type": "drawShapeFinish",
                            	"data": {
                            		"nextModule": "drawPicture",
                            		"data": src
                            	}
                            });
                        }, 2000);
                    }
                }, 50);
            }
			// console.log("repaintBack result: " + result.Name);	
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
			// delete frontCanvas;
			// delete backCanvas;
			// delete frontCtx;
			// delete backCtx;
			// delete currentColor; 
			// delete currentSize; 
			// delete currentPath;
			// delete pathes;
			// delete isDrawing; 
			// delete isDone;
			// delete isPaint;
			// delete textureImage;
			// delete shapeGroup;
		 //    delete recognizer;
   //  		delete result;
    		// console.log("destroy drawShape");
		}
	}
});

Core.registerModule("drawPicture", function(sandBox, backgroundImgSrc) {
	var container = null;
	var frontCanvas = null, backCanvas = null;
	var frontCtx = null, backCtx = null;
	var currentPath = null, currentColor = null, currentSize = null, currentStamp = null;
	var pathes = [];
	var textureImage = null;
	var isDrawing = false;
	var backgroundImg = null;
	var stampList = ["ball", "flower", "heart", "music", "star"], stampImgs = [];
	
	return {
		
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			frontCanvas = sandBox.createElement("canvas");
			sandBox.addClass(frontCanvas, "frontCanvas");
			frontCanvas.setAttribute("width", "800px");
			frontCanvas.setAttribute("height", "600px");
			backCanvas = sandBox.createElement("canvas");
			sandBox.addClass(backCanvas, "backCanvas");
			backCanvas.setAttribute("width", "800px");
			backCanvas.setAttribute("height", "600px");
			container.appendChild(frontCanvas);
			container.appendChild(backCanvas);

			frontCtx = frontCanvas.getContext("2d");
			backCtx = backCanvas.getContext("2d");

			textureImage = new Image();
			textureImage.src = "images/crayon-texture.png";

			backgroundImg = new Image();
			backgroundImg.src = backgroundImgSrc + ".png"

			for(var i = 0; i < stampList.length; i++) {
	            var stampImage = new Image();
	            var imgPath = stampList[i];
	            stampImage.src = "images/stamps/"+stampList[i]+"1.png";
	            stampImgs[imgPath] = stampImage;
	        }

			frontCanvas.onmousedown = this.mouseDown();
			frontCanvas.onmouseup = this.mouseLeave();
			frontCanvas.onmouseout = this.mouseLeave();
			frontCanvas.onmousemove = this.mouseMove();

			sandBox.listen( { "undo": this.undo() } );
			sandBox.listen( { "reset": this.reset() } );
			sandBox.listen( { "stampChange": this.stampChange } );
			sandBox.listen( { "colorChange": this.colorChange } );
			sandBox.listen( { "brushSizeChange": this.brushSizeChange } );
			sandBox.listen( { "save": this.save } );

			setTimeout(this.repaintFront, 50);
			setTimeout(this.repaintBack, 50);
		},

		mouseDown: function() {

			return function(e) {
				if(currentStamp) {
					currentPath = {
						stamp: currentStamp,
						X: e.offsetX,
						Y: e.offsetY
					};
				} else {
					isDrawing = true;
					currentPath = {
						color: currentColor,
						size: currentSize,
						points: [ {
							X: e.offsetX,
							Y: e.offsetY	
						} ],
						stamp: null
					};
				}
				// console.log(currentPath);
			};
		},

		mouseLeave: function() {
			var parent = this;
			return function(e) {
				if(currentStamp) {
					if(currentPath != null) {
						pathes.push(currentPath);	
					}
				} else if(isDrawing == true) {
					isDrawing = false;
					pathes.push(currentPath);
				}
				currentPath = null;
				parent.repaintFront();
				parent.repaintBack();
				// console.log(pathes);
			};
			
		},

		mouseMove: function() {
			var parent = this;
			return function(e) {
				if(isDrawing == true) {
					currentPath.points.push( {
						X: e.offsetX,
						Y: e.offsetY
					} );
					parent.repaintFront();
					// console.log(currentPath);
				}
			};
		},

		colorChange: function(color) {
			currentColor = color;
		},

		brushSizeChange: function(size) {
			currentSize = size;
		},

		stampChange: function(stamp) {
			currentStamp = stamp;
		},

		undo: function() {
			var parent = this;
			return function() {
				pathes.pop();
				parent.repaintBack();
				// console.log("undo");
			};
		},

		reset: function() {
			var parent = this;
			return function() {
				pathes.length = 0;
				parent.repaintBack();
				// console.log("reset");
			};
		},

		save: function() {
			try {
				backCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
                var dataUrl = backCanvas.toDataURL("image/png");
                window.open(dataUrl);
            } catch (ex) {
                console.log(ex);
            }
		},
		
		repaintFront: function() {
			frontCtx.fillStyle = "rgba(255, 255, 255, 0)";
            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);

            if(!currentPath || currentPath.stamp) {
            	frontCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
            	return ;
            }

            frontCtx.beginPath();
            frontCtx.strokeStyle = "#" + currentPath.color;
            frontCtx.lineWidth =  currentPath.size;
            frontCtx.lineJoin = "round";
            frontCtx.lineCap = "round";

            frontCtx.moveTo(currentPath.points[0].X, currentPath.points[0].Y);

            for(var i = 0; i < currentPath.points.length; i++) {
                frontCtx.lineTo(currentPath.points[i].X, currentPath.points[i].Y);
            }
            frontCtx.stroke();
            frontCtx.closePath();
            frontCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
			// console.log("repaintFront");
		},

		repaintBack: function() {
			backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);

			for(var i = 0; i < pathes.length; i++) {
				var path = pathes[i];

				if(path && path.stamp) {
                    var stampImg = stampImgs[path.stamp];
                    backCtx.drawImage(stampImg, path.X - stampImg.width/2, path.Y - stampImg.height/2);
                } else if(path) {
		    backCtx.beginPath();
                    backCtx.strokeStyle = "#" + path.color;
                    backCtx.lineWidth = path.size;
                    backCtx.lineCap = "round";
                    backCtx.lineJoin = "round";
                    backCtx.moveTo(path.points[0].X, path.points[0].Y);

                    for(var j = 1; j < path.points.length; j++) {
            	        backCtx.lineTo(path.points[j].X, path.points[j].Y);
                    }

                    backCtx.stroke();
                    backCtx.closePath();

                }
			}

			backCtx.globalAlpha = 0.4;
			backCtx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);
			backCtx.globalAlpha = 1;
			// console.log("repaintBack result: " + result.Name);	
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
		}
	};
});

Core.registerModule("crayon", function(sandBox) {
	
	var container = null;

	var colorList = [
        "ffcd9a",
        "fc0400",
        "ff852e",
        "fec900",
        "d1f800",
        "47d329",
        "29d4a3",
        "29b0d2",
        "2859cf",
        "986ad7",
        "c7bbbb",
        "000000",
        "ffffff"
    ];

    var divPenList = [], selectedDivPen = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);

			for (var i = 0; i < colorList.length; i++) {
	            var color = colorList[i];

	            var divPen = sandBox.createElement("div");
	            divPen.setAttribute("color", color);
	            sandBox.addClass(divPen, "crayonPen");
	            sandBox.addClass(divPen, "unselected");
	            sandBox.css(divPen, "top", (4+i*53));
	            sandBox.css(divPen, "background-image", "url(images/crayon-pens/" + i + "_" + color + ".png)");
	            container.appendChild(divPen);
	            divPenList.push(divPen);
	            divPen.onclick = this.onclick();
	        }
	        selectedDivPen = divPenList[0];

	        sandBox.listen( { "stampChange": this.clearColor } );
	        sandBox.removeClass(selectedDivPen, "unselected");
	        sandBox.addClass(selectedDivPen, "selected");
	        sandBox.notify( {
	        	"type": "colorChange",
	        	"data": colorList[0]
	        } );
		},

		onclick: function() {
			var parent = this;
			return function(evt) {
				var selectedDiv = evt.target;
				if (selectedDivPen) {
					sandBox.removeClass(selectedDivPen, "selected");
					sandBox.addClass(selectedDivPen, "unselected");
	            }

            	selectedDivPen = selectedDiv;

	            sandBox.removeClass(selectedDivPen, "unselected");
	            sandBox.addClass(selectedDivPen, "selected");

				sandBox.notify({
		          	"type": "colorChange", 
		           	"data": selectedDiv.getAttribute("color")
		        });	
			};
		},

		clearColor: function(stamp) {
			if(stamp != null) {
				sandBox.removeClass(selectedDivPen, "selected");
				sandBox.addClass(selectedDivPen, "unselected");
				console.log("clear color");	
			}
		},

		destroy: function() {
			sandBox.hide(container);
			for(var i = 0; i < divPenList.length; i++) {
				container.removeChild(divPenList[i]);
			}
		}
	};
});

Core.registerModule("stamp", function(sandBox) {
	var container = null;
	var stampsList = [ "ball", "flower", "heart", "music", "star" ];
	var stampDivList = [], selectedStamp = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			sandBox.addClass(container, "stampList");

			for (var i = 0; i < stampsList.length; i++) {
                var stamp = stampsList[i];

                var stampDiv = sandBox.createElement("div");
                sandBox.addClass(stampDiv, "stamp");
                sandBox.addClass(stampDiv, "unselected");
                sandBox.css(stampDiv, "left", (65 + i * 116));
                sandBox.css(stampDiv, "background", "url(images/stamps/"+stamp+".png) no-repeat");
                stampDiv.setAttribute("stamp", stamp);
                container.appendChild(stampDiv);
    				
                stampDivList.push(stampDiv);
                stampDiv.onclick = this.onclick();
            }

            sandBox.listen( { "colorChange" : this.clearStamp } );
		},

		onclick: function() {
			var parent = this;
			return function(evt) {
				var targetStamp = evt.target;

				if(selectedStamp) {
					sandBox.removeClass(selectedStamp, "selected");
					sandBox.addClass(selectedStamp, "unselected");
				}

				selectedStamp = targetStamp;

				sandBox.removeClass(selectedStamp, "unselected");
				sandBox.addClass(selectedStamp, "selected");

				sandBox.notify({
					"type": "stampChange",
					"data": targetStamp.getAttribute("stamp")
				});
			};
		},

		clearStamp: function() {
			console.log("clear stamp");

			if(selectedStamp) {
				sandBox.removeClass(selectedStamp, "selected");
				sandBox.addClass(selectedStamp, "unselected");
			}

			sandBox.notify({
				"type": "stampChange",
				"data": null
			});
		},

		destroy: function() {
			sandBox.hide(container);
			for(var i = 0; i < stampDivList.length; i++) {
				container.removeChild(stampDivList[i]);
			}
		}
	};
});

Core.registerModule("brushSize", function(sandBox) {
	var brushSizes = [
            { name: "l", value: 20 },
            { name: "m", value: 10 },
            { name: "s", value: 5 }
        ];
    var container = null;
    var brushSizeDivList = [];
	return {

		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			sandBox.addClass(container, "brushSize");

			for(var i = 0; i < brushSizes.length; i++) {
				var brush = brushSizes[i];
				var brushDiv = sandBox.createElement("div");
				brushDiv.setAttribute("brushsize", brush.value);
				brushDiv.setAttribute("brushname", brush.name);
				sandBox.addClass(brushDiv, "brush");
				sandBox.css(brushDiv, "left", (60+i*45));

				container.appendChild(brushDiv);
				brushSizeDivList.push(brushDiv);
				brushDiv.onclick = this.onclick();
			}

			sandBox.css(container, "background-image", "url(images/brush-l.png)");

			sandBox.notify( {
				"type": "brushSizeChange",
				"data": brushSizes[0].value
			} );
		},

		onclick: function() {
			var parent = this;
			return function(evt) {
				var target = evt.target;
				var brushName = target.getAttribute("brushname");
				console.log("brushName " + brushName);
				sandBox.css(sandBox.container, "background-image", "url(images/brush-" + brushName + ".png)");

				sandBox.notify({
					"type": "brushSizeChange",
					"data": target.getAttribute("brushsize")
				});
			}
		},

		destroy: function() {
			sandBox.hide(container);
			for(var i = 0; i < brushSizeDivList.length; i++) {
				container.removeChild(brushSizeDivList[i]);
			}
		}
	};
});

Core.registerModule("undo", function(sandBox) {
	
	var container = null;
	var undoDiv = null, resetDiv = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			sandBox.addClass(container, "undoContainer");

			undoDiv = sandBox.createElement("div");
			sandBox.addClass(undoDiv, "undo");

			resetDiv = sandBox.createElement("div");
			sandBox.addClass(resetDiv, "reset");

			container.appendChild(undoDiv);
			container.appendChild(resetDiv);

			undoDiv.onclick = function(e) {
				sandBox.notify({
					"type": "undo"
				});
			};

			resetDiv.onclick = function(e) {
				sandBox.notify({
					"type": "reset"		
				});
			};
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(undoDiv);
			container.removeChild(resetDiv);
		}
	};
});

Core.registerModule("painting", function(sandBox) {
	var container = null;
	var frontCanvas = null, backCanvas = null;
	var frontCtx = null, backCtx = null;
	var currentPath = null, currentColor = null, currentSize = null;
	var pathes = [];
	var isDrawing = false;
	var backgroundImg = null;
	
	return {
		
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			frontCanvas = sandBox.createElement("canvas");
			sandBox.addClass(frontCanvas, "frontCanvas");
			frontCanvas.setAttribute("width", "800px");
			frontCanvas.setAttribute("height", "600px");
			backCanvas = sandBox.createElement("canvas");
			sandBox.addClass(backCanvas, "backCanvas");
			backCanvas.setAttribute("width", "800px");
			backCanvas.setAttribute("height", "600px");
			container.appendChild(frontCanvas);
			container.appendChild(backCanvas);

			frontCtx = frontCanvas.getContext("2d");
			backCtx = backCanvas.getContext("2d");

			backgroundImg = new Image();
			backgroundImg.src = "images/fill-background.png"

			frontCanvas.onmousedown = this.mouseDown();
			frontCanvas.onmouseup = this.mouseLeave();
			frontCanvas.onmouseout = this.mouseLeave();
			frontCanvas.onmousemove = this.mouseMove();

			sandBox.listen( { "undo": this.undo() } );
			sandBox.listen( { "reset": this.reset() } );
			sandBox.listen( { "colorChange": this.colorChange } );
			sandBox.listen( { "brushSizeChange": this.brushSizeChange } );
			sandBox.listen( { "save": this.save } );

			setTimeout(this.repaintBack, 50);
		},

		mouseDown: function() {

			return function(e) {
					isDrawing = true;
					currentPath = {
						color: currentColor,
						size: currentSize,
						points: [ {
							X: e.offsetX,
							Y: e.offsetY	
						} ]
					};
				// console.log(currentPath);
			};
		},

		mouseLeave: function() {
			var parent = this;
			return function(e) {
				if(isDrawing == true) {
					isDrawing = false;
					pathes.push(currentPath);
				}
				currentPath = null;
				parent.repaintFront();
				parent.repaintBack();
				// console.log(pathes);
			};
			
		},

		mouseMove: function() {
			var parent = this;
			return function(e) {
				if(isDrawing == true) {
					currentPath.points.push( {
						X: e.offsetX,
						Y: e.offsetY
					} );
					parent.repaintFront();
					// console.log(currentPath);
				}
			};
		},

		colorChange: function(color) {
			currentColor = color;
		},

		brushSizeChange: function(size) {
			currentSize = size;
		},

		undo: function() {
			var parent = this;
			return function() {
				pathes.pop();
				parent.repaintBack();
				// console.log("undo");
			};
		},

		reset: function() {
			var parent = this;
			return function() {
				pathes.length = 0;
				parent.repaintBack();
				// console.log("reset");
			};
		},

		save: function() {
			try {
                var dataUrl = backCanvas.toDataURL("image/png");
                window.open(dataUrl);
            } catch (ex) {
                console.log(ex);
            }
		},
		
		repaintFront: function() {
			frontCtx.fillStyle = "rgba(255, 255, 255, 0)";
            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);

            if(currentPath) {
            	frontCtx.beginPath();
	            frontCtx.strokeStyle = "#" + currentPath.color;
	            frontCtx.lineWidth =  currentPath.size;
	            frontCtx.lineJoin = "round";
	            frontCtx.lineCap = "round";

	            frontCtx.moveTo(currentPath.points[0].X, currentPath.points[0].Y);

	            for(var i = 0; i < currentPath.points.length; i++) {
	                frontCtx.lineTo(currentPath.points[i].X, currentPath.points[i].Y);
	            }
	            frontCtx.stroke();
	            frontCtx.closePath();
            }
            
			// console.log("repaintFront");
		},

		repaintBack: function() {
			backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);

			for(var i = 0; i < pathes.length; i++) {
				var path = pathes[i];

				
		    	backCtx.beginPath();
                    backCtx.strokeStyle = "#" + path.color;
                    backCtx.lineWidth = path.size;
                    backCtx.lineCap = "round";
                    backCtx.lineJoin = "round";
                    backCtx.moveTo(path.points[0].X, path.points[0].Y);

                    for(var j = 1; j < path.points.length; j++) {
            	        backCtx.lineTo(path.points[j].X, path.points[j].Y);
                    }

                    backCtx.stroke();
                    backCtx.closePath();

                
			}

			backCtx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);

			// console.log("repaintBack result: " + result.Name);	
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
		}
	};
});

Core.registerModule("blackboard", function(sandBox) {
	var container = null;

	return {
		init: function() {}, 
		destroy: function() {}
	};
});

Core.registerModule("chalk", function(sandBox) {
	var container = null;

	return {
		init: function() {}, 
		destroy: function() {}
	};
});