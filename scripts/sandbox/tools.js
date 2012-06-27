Core.registerModule("undoModule", function(sandBox) {
	
	var container = sandBox.container, undoDiv = sandBox.find("#undo"), resetDiv = sandBox.find("#reset");

	return {
		init: function() {
			sandBox.show(container);
			container.addEventListener("click", this.notify, false);
			container.addEventListener("touchstart", this.notify, false);
		},

		notify: function(evt) {
			if(evt.target.id === "undo") {
				sandBox.notify({ "type": "undo" });
			} else if(evt.target.id === "reset") {
				sandBox.notify({ "type": "reset" });
			}
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeEventListener("click", this.notify);
			container.removeEventListener("touchstart", this.notify);
		}
	};
});

Core.registerModule("home", function(sandBox) {
	var container = sandBox.container;
	return {
		init: function() {
			sandBox.show(container);

			container.addEventListener("click", this.notify, false);
			container.addEventListener("touchstart", this.notify, false);
		},
		notify: function() {
			sandBox.notify({ "type": "home" });
		},
		destroy: function() {
			sandBox.hide(container);
			container.removeEventListener("click", this.notify);
			container.removeEventListener("touchstart", this.notify);
		}
	};
});

Core.registerModule("crayons", function(sandBox) {
	var container = sandBox.container, selectedNode = null;

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

	var container = sandBox.container, selectedNode = null;

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
	var container = sandBox.container, selectedNode = null;

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
				brushDiv.onclick = this.selectBrushSize();
				if(sandBox.touchable()) {
	            	brushDiv.addEventListener("touchstart", this.selectBrushSize());
	        	}
			}

			sandBox.css(container, "background-image", "url(images/brush-l.png)");

			sandBox.notify( {
				"type": "brushSizeChange",
				"data": brushSizes[0].value
			} );
		},

		selectBrushSize: function() {
			var parent = this;
			return function(evt) {
				var target = evt.target;
				var brushName = target.getAttribute("brushname");
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

