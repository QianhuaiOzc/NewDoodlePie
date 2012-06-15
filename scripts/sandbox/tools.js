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

			if(sandBox.touchable()) {
	           	undoDiv.addEventListener("touchstart", function(evt) {
	           		sandBox.notify({
						"type": "undo"
					});
	           	});
	           	resetDiv.addEventListener("touchstart", function(evt) {
	           		sandBox.notify({
						"type": "reset"		
					});
	           	});
	        }
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(undoDiv);
			container.removeChild(resetDiv);
		}
	};
});

Core.registerModule("home", function(sandBox) {
	
	var container = null;
	var title = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);

			container.onclick = function() {
				sandBox.notify({
					"type": "home"
				});
			}

			if(sandBox.touchable()) {
				container.addEventListener("touchstart", function(evt) {
					sandBox.notify({
						"type": "home"
					});
				});
			}
		},
		destroy: function() {}
	};
});

Core.registerModule("magicType", function(sandBox) {
	var container = null;
	var typeList = [ "triangle", "rectangle", "circle"];
	var typeDivList = [], selectedType = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			sandBox.addClass(container, "stampList");

			for (var i = 0,len = typeList.length; i < len; i++) {

                var type = typeList[i];

                var typeDiv = sandBox.createElement("div");

                sandBox.addClass(typeDiv, "stamp");
                sandBox.addClass(typeDiv, "unselected");
                // sandBox.css(typeDiv, "left", (65 + i * 116));
                sandBox.css(typeDiv, "left", (100 + i * 200));
                sandBox.css(typeDiv, "background", "url(images/magic/"+type+".png) no-repeat");
                typeDiv.setAttribute("magicType", type);
                container.appendChild(typeDiv);
    				
                typeDivList.push(typeDiv);
                typeDiv.onclick = this.doSelect();
                if(sandBox.touchable()) {
	            	typeDiv.addEventListener("touchstart", this.doSelect());
	        	}
            }

		},

		doSelect: function() {
			var parent = this;
			return function(evt) {
				var targetType = evt.target;

				if(selectedType) {
					sandBox.removeClass(selectedType, "selected");
					sandBox.addClass(selectedType, "unselected");
				}

				selectedType = targetType;

				sandBox.removeClass(selectedType, "unselected");
				sandBox.addClass(selectedType, "selected");

				sandBox.notify({
					"type": "changeDrawMagicType",
					"data": targetType.getAttribute("magicType")
				});
			};
		},

		destroy: function() {
			sandBox.hide(container);
			for(var i = 0; i < typeDivList.length; i++) {
				container.removeChild(typeDivList[i]);
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
				if(sandBox.touchable()) {
	            	brushDiv.addEventListener("touchstart", this.touchStart());
	        	}
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

		touchStart: function() {
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
			};
		},

		destroy: function() {
			sandBox.hide(container);
			for(var i = 0; i < brushSizeDivList.length; i++) {
				container.removeChild(brushSizeDivList[i]);
			}
		}
	};
});

Core.registerModule("info", function(sandBox) {
	var container = null;

	var stateBtn = null, checkBtn = null, shadowDiv = null, stateCloBtn = null, checkCloBtn = null;
	var stateDiv = null, checkDiv = null;
	var taskUL = null, sina = null, tencent = null;

	var mask = function(content) {
		container.appendChild(shadowDiv);
		sandBox.addClass(shadowDiv, "sd");
	}

	var showState = function() {
		mask();
		var state = JSON.parse(localStorage.getItem("state"));
		var level = state.level;	

		var levelDiv = sandBox.find("#level", stateDiv);
		if (level != 4) {
			levelDiv.innerText = "Level " + level + " Challenge"	
		} else {
			levelDiv.innerText = "Congratulation! You have finished All!"
		}
		

		var tasks = createTaskDivList(state);
		var i = 0, length = tasks.length;
		for(; i < length; i++) {
			taskUL.appendChild(tasks[i]);
		}

		stateDiv.style.display = "block";
	};
	var showCheck = function() {
		mask();
		checkDiv.style.display = "block";
		sandBox.notify({"type": "check"});
	};
	var disappear = function() {
		sandBox.removeClass(shadowDiv, "sd");
		stateDiv.style.display = "none";

		var children = taskUL.childNodes, i = children.length - 1;
		for(; i > 0; i--) {
			taskUL.removeChild(children[i]);
		}
		checkDiv.style.display = "none";
	};

	var hideCheckBtn = function() {
		sandBox.hide(checkBtn);
	};

	var showCheckBtn = function() {
		sandBox.show(checkBtn);
	};

	var createTaskDivList = function(state) {
		var taskList = [];
		var drawShape = sandBox.createElement("li");
		var drawPict = sandBox.createElement("li");
		switch (state.level) {
			case 1: 
				drawShape.innerText = "You have finished " + (state.drawFinished > 2 ? 2 : state.drawFinished) + " of 2 shapes!";
				drawPict.innerText = "You have finished " + state.picFinished + " of 3 pictures!";
				var guess = sandBox.createElement("li");
				if(state.guessFinished === true) {
					guess.innerText = "You have finished the guess!";
				} else {
					guess.innerText = "You have not finish the guess!";
				}
				taskList.push(drawShape);
				taskList.push(drawPict);
				taskList.push(guess);
				break;
			case 2: 
				drawShape.innerText = "You have finished " + (state.drawFinished > 3 ? 3 : state.drawFinished) + " of 3 shapes!";
				drawPict.innerText = "You have finished " + state.picFinished + " of 5 pictures!";
				var fill = sandBox.createElement("li");
				if(state.fillFinished === true) {
					fill.innerText = "You have finished the fill!";
				} else {
					fill.innerText = "You have not finished the fill!";
				}
				taskList.push(drawShape);
				taskList.push(drawPict);
				taskList.push(fill);
				break;
			case 3: 
				drawShape.innerText = "You have finished " + (state.drawFinished > 4 ? 4 : state.drawFinished) + " of 4 shapes!";
				drawPict.innerText = "You have finished " + state.picFinished + " of 7 pictures!";
				var blackboard = sandBox.createElement("li");
				if(state.bboardFinished === true) {
					blackboard.innerText = "You have finished the blackboard!";
				} else {
					blackboard.innerText = "You have not finished the blackboard!";
				}
				taskList.push(drawShape);
				taskList.push(drawPict);
				taskList.push(blackboard);
				break;
			default :
		}
		return taskList;
	}

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			stateBtn = sandBox.find("#help");
			checkBtn = sandBox.find("#finish");
			shadowDiv = sandBox.createElement("div");

			stateDiv = sandBox.find("#state");
			stateDiv.style.display = "none";
			checkDiv = sandBox.find("#check");
			checkDiv.style.display = "none";

			sina = sandBox.find("#sina");
			sina.onclick = function(evt) {
				evt.preventDefault();
				disappear();
				sandBox.notify({"type": "share"});
			}

			tencent = sandBox.find("#tencent");
			tencent.onclick = function(evt) {
				evt.preventDefault();
				sandBox.notify({"type": "share"});
			}

			stateCloBtn = sandBox.find(".closeBtn", stateDiv);
			stateCloBtn.onclick = disappear;

			checkCloBtn = sandBox.find(".closeBtn", checkDiv);
			checkCloBtn.onclick = disappear;

			taskUL = sandBox.find("#tasks", stateDiv);

			stateBtn.onclick = showState;
			stateBtn.addEventListener("touchstart", showState);

			checkBtn.onclick = showCheck;
			checkBtn.addEventListener("touchstart", showCheck);

			shadowDiv.onclick = disappear;
			shadowDiv.addEventListener("touchstart", disappear);

			sandBox.listen({"hideCheckBtn": hideCheckBtn, "showCheckBtn": showCheckBtn});
		},



		destroy: function() {
			sandBox.hide(container);
			stateBtn.removeEventListener("touchstart", showState);
			checkBtn.removeEventListener("touchstart", showCheck);
			shadowDiv.removeEventListener("touchstart", disappear);
		}
	};
});

Core.registerModule("crayons", function(sandBox) {
	var container = null, selectedNode = null;

	var Events = {
		click: function(evt) {
			var target = evt.target.parentNode;
			if(target.nodeName === "LI") {
				if(selectedNode != null) {
					selectedNode.className = "";
				}
				selectedNode = target;
				target.className = "selected";
				var color = target.getAttribute("id").substring(1);
				sandBox.notify({"type": "colorChange", "data": color});
			}
		},

		clearColor: function(data) {
			if(selectedNode != null && data !== null) {
				selectedNode.className = "";
				selectedNode = null;
			}
		}
	};

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);

			var childNodes = container.childNodes;
			var i = 0, length = childNodes.length;
			for(; i < length; i++) {
				if(sandBox.hasClass(childNodes[i], "selected")) {
					selectedNode = childNodes[i];
					var color = selectedNode.getAttribute("id").substring(1);
					sandBox.notify({"type": "colorChange", "data": color});
					break;
				}
			}

			container.addEventListener("click", Events.click, false);
			container.addEventListener("touchstart", Events.click, false);
			sandBox.listen( { "stampChange" : Events.clearColor } );
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeEventListener("click", Events.click);
			container.removeEventListener("touchstart", Events.click);
		}
	};
});

Core.registerModule("stamps", function(sandBox) {

	var container = null, selectedNode = null;

	var Events = {
		click: function(evt) {
			var target = evt.target;
			if(target.nodeName === "LI") {
				if(selectedNode != null) {
					selectedNode.className = "";
				}
				selectedNode = target;
				selectedNode.className = "selected";
				var stamp = selectedNode.getAttribute("id");
				sandBox.notify({
					"type": "stampChange",
					"data": stamp
				});
			}
		},

		clearStamp: function(data) {
			if(selectedNode != null) {
				selectedNode.className = "";
				selectedNode = null;
				sandBox.notify({ "type": "stampChange", "data": null });
			}
		}
	}

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);

			container.addEventListener("click", Events.click, false);
			container.addEventListener("touchstart", Events.click, false);
			sandBox.listen( { "colorChange" : Events.clearStamp } );
		},
		destroy: function() {
			sandBox.hide(container);
			container.removeEventListener("click", Events.click);
			container.removeEventListener("touchstart", Events.click);
		}
	};
});

Core.registerModule("chalk", function(sandBox) {
	var container = null, selectedNode = null;

	var Events = {
		click: function(evt) {
			var target = evt.target;
			if(target.nodeName === "LI") {
				if(selectedNode != null) {
					selectedNode.className = "";
				}
				selectedNode = target;
				target.className = "selected";
				var color = target.getAttribute("id").substring(1);
				sandBox.notify({"type": "chalkChange", "data": color});
			}
		}
	};

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);


			var childNodes = container.childNodes;
			var i = 0, length = childNodes.length;
			for(; i < length; i++) {
				if(sandBox.hasClass(childNodes[i], "selected")) {
					selectedNode = childNodes[i];
					var color = selectedNode.getAttribute("id").substring(1);
					sandBox.notify({"type": "chalkChange", "data": color});
					break;
				}
			}

			container.addEventListener("click", Events.click, false);
			container.addEventListener("touchstart", Events.click, false);
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeEventListener("click", Events.click);
			container.removeEventListener("touchstart", Events.click);
		}
	};
});