Core.registerModule("drawPicture", function(sandBox, backgroundImgSrc) {
	
	var frontCanvas = null, backCanvas = null;
	var frontCtx = null, backCtx = null;

	var currentPath = null, currentColor = null, currentSize = null, currentStamp = null;

	var pathes = [];
	var textureImage = null;
	var isDrawing = false;
	var backgroundImg = null;
	var stampList = ["ball", "flower", "heart", "music", "star"], stampImgs = [];
	var backIntervalId = null, frontIntervalId = null;
	var hasCheck = false;



	var repaintFront = function() {
		var ctx = frontCtx;
        ctx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
        if(!currentPath || currentPath.stamp) {
          	ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
           	return ;
        }
        sandBox.drawAPath(ctx, currentPath);
        ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
        
	};

	var repaintBack = function() {
		var ctx = backCtx, localPathes = pathes;
		ctx.clearRect(0, 0, backCanvas.width, backCanvas.height);
		for(var i = 0; i < pathes.length; i++) {
			var path = localPathes[i];

			if(path && path.stamp) {
                var stampImg = stampImgs[path.stamp];
                ctx.drawImage(stampImg, path.X - stampImg.width/2, path.Y - stampImg.height/2);
            } else if(path) {
	            sandBox.drawAPath(ctx, path);
            }
		}
		ctx.globalAlpha = 0.4;
		ctx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);
		ctx.globalAlpha = 1;
	};

	var paintBackIncr = function() {
		var ctx = backCtx;
		if(currentPath && currentPath.stamp) {
			var stampImg = stampImgs[currentPath.stamp];
			ctx.drawImage(stampImg, currentPath.X - stampImg.width/2, currentPath.Y - stampImg.height/2);
		} else if(currentPath) {
			sandBox.drawAPath(ctx, currentPath);	
		}
	};

	var container = sandBox.container,
		canvases = {
			bCanvas: sandBox.createElement("canvas"),
			mCanvas: sandBox.createElement("canvas"),
			fCanvas: sandBox.createElement("canvas")
		},
		contextes = {
			bCtx: canvases["bCanvas"].getContext("2d"),
			mCtx: canvases["mCanvas"].getContext("2d"),
			fCtx: canvases["fCanvas"].getContext("2d")
		},
		status = {
			isDrawing: false,
			currentPath: null,
			undo: [],
			interval: null,
			currentColor: null,
			currentSize: 20,
			currentStamp: null
		},
		handlers = {
			drawStart: function(evt) {
				evt.preventDefault();
				if(status.currentStamp) {
				} else {
					status.isDrawing = true;
					status.currentPath = {
						color: status.currentColor,
						size: status.currentSize,
						points: [ {
							X: evt.changedTouches ? evt.changedTouches[0].pageX - canvases.fCanvas.offsetLeft : evt.offsetX,
							Y: evt.changedTouches ? evt.changedTouches[0].pageY - canvases.fCanvas.offsetTop : evt.offsetY
						} ],
						stamp: null
					};
					status.interval = setInterval(fns.paintFrontCanvas, 50);
				}
			},
			drawing: function(evt) { 
				evt.preventDefault();
				if(status.isDrawing) {
					status.currentPath.points.push({
						X: evt.changedTouches ? evt.changedTouches[0].pageX - canvases.fCanvas.offsetLeft : evt.offsetX,
						Y: evt.changedTouches ? evt.changedTouches[0].pageY - canvases.fCanvas.offsetTop : evt.offsetY
					});
				}
			},
			drawStop: function(evt) { 
				var undo = status.undo, shiftToBCanvas = null;
				if(status.isDrawing) {
					status.isDrawing = false;
					if(undo.length >= 5) {
						shiftToBCanvas = undo.shift();
						fns.paintBackCanvas(shiftToBCanvas);
					}
					undo.push(status.currentPath);
					fns.paintMiddleCanvas();
					status.currentPath = null;
					clearInterval(status.interval);
					fns.paintFrontCanvas();
				}
			}
		},
		fns = {
			paintFrontCanvas: function() {
				var ctx = contextes["fCtx"], canvas = canvases["fCanvas"], currentPath = status.currentPath;
		        ctx.clearRect(0, 0, canvas.width, canvas.height);
		        if(!currentPath) {
		           	return ;
		        }
		        fns.drawALine(ctx, currentPath);
		        ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
			},
			paintMiddleCanvas: function() {
				var ctx = contextes["mCtx"], 
					canvas = canvases["mCanvas"], 
					undo = status.undo, length = undo.length;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
		        for(var i = 0; i < length; i++) {
			        fns.drawALine(ctx, undo[i]);
				}
				ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
			},
			paintBackCanvas: function(line_path) {
				fns.drawALine(contextes["bCtx"], line_path);
			},
			drawALine: function(ctx, line_path) {
				var points = line_path.points,
					length = points.length, i = 0;
				ctx.beginPath();
				ctx.strokeStyle = "#" + line_path.color;
				ctx.lineWidth = line_path.size;
				ctx.lineJoin = "round";
				ctx.lineCap = "round";
				for(; i < length; i+=1) {
		            ctx.lineTo(points[i].X, points[i].Y);
		        }
		        ctx.stroke();
		        ctx.closePath();
			}
		};

	return {
		
		init: function() {
			var i = 1,
				eventCanvas = canvases["fCanvas"];
			sandBox.show(container);
			for(c in canvases) {
				canvases[c].setAttribute("width", 800);
				canvases[c].setAttribute("height", 600);
				canvases[c].setAttribute("id", c);
				canvases[c].style.zIndex = i++;
				container.appendChild(canvases[c]);
				sandBox.addClass(canvases[c], "canvas");
			}

			eventCanvas.addEventListener("mousedown", handlers.drawStart, false);
			eventCanvas.addEventListener("mousemove", handlers.drawing, false);
			eventCanvas.addEventListener("mouseup", handlers.drawStop, false);
			eventCanvas.addEventListener("mouseout", handlers.drawStop, false);
			if(sandBox.touchable()) {
				eventCanvas.addEventListener("touchstart", handlers.drawStart, false);
				eventCanvas.addEventListener("touchmove", handlers.drawing, false);
				eventCanvas.addEventListener("touchend", handlers.drawStop, false);
			}

			frontCanvas = sandBox.createElement("canvas");
			sandBox.addClass(frontCanvas, "frontCanvas");
			frontCanvas.setAttribute("width", "800px");
			frontCanvas.setAttribute("height", "600px");
			backCanvas = sandBox.createElement("canvas");
			sandBox.addClass(backCanvas, "backCanvas");
			backCanvas.setAttribute("width", "800px");
			backCanvas.setAttribute("height", "600px");
			// container.appendChild(frontCanvas);
			// container.appendChild(backCanvas);

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

			frontCanvas.onmousedown = this.drawStart;
			frontCanvas.onmouseup = this.drawStop;
			frontCanvas.onmouseout = this.drawStop;
			frontCanvas.onmousemove = this.drawing;


			if(sandBox.touchable()) {
				frontCanvas.addEventListener("touchstart", this.drawStart, false);
				frontCanvas.addEventListener("touchmove", this.drawing, false);
				frontCanvas.addEventListener("touchend", this.drawStop, false);
			}

			sandBox.listen( { "undo": this.undo,
				"reset": this.reset,
				"stampChange": this.stampChange,
				"colorChange": this.colorChange,
				"brushSizeChange": this.brushSizeChange,
				"check": this.check,
				"share": this.share} );
			backgroundImg.onload = function() {
				repaintBack();	
			}
			setInterval(repaintFront, 50);
		},

		drawStart: function(evt) {
			if(currentStamp) {
			} else {
				isDrawing = true;
				currentPath = {
					color: currentColor,
					size: currentSize,
					points: [ {
						X: evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX,
						Y: evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY
					} ],
					stamp: null
				};
			}
		},

		drawStop: function(evt) {
			if(currentStamp) {
				if(evt.type != "mouseout") {
					currentPath = {
						stamp: currentStamp,
						X: evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX,
						Y: evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY
					};
					pathes.push(currentPath);	
				}
			} else if(isDrawing == true) {
				isDrawing = false;
				pathes.push(currentPath);
			}
			paintBackIncr();
			currentPath = null;
		},

		drawing: function(evt) {
			if(evt.preventDefault) {
				evt.preventDefault();	
			}
			if(isDrawing == true) {
				currentPath.points.push( {
					X: evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX,
					Y: evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY
				} );
			}
		},

		colorChange: function(color) {
			status.currentColor = color;
		},

		brushSizeChange: function(size) {
			status.currentSize = size;
		},

		stampChange: function(stamp) {
			status.currentStamp = stamp;
		},

		undo: function() {
			pathes.pop();
			repaintBack();
		},

		reset: function() {
			pathes.length = 0;
			repaintBack();
		},

		check: function() {
			if(hasCheck === false) {
				sandBox.notify({"type": "finishOnePic"});
				hasCheck = true;
			}
		},

		share: function(opts) {
			backCtx.globalAlpha = 0.5;
			backCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
			var url = backCanvas.toDataURL("image/png");
			console.log(opts);
			// sandBox.saveImageFile(url, function(imageUrl) {});
		},

		destroy: function() {
			sandBox.hide(container);
			for(c in canvases) {
				container.removeChild(canvases[c]);
				canvases[c] = null;
			}
			canvases = null;
			clearInterval(frontIntervalId);
			clearInterval(backIntervalId);
			sandBox.ignore("save");
		}
	};
});