Core.registerModule("blackboardCanvas", function(sandBox) {
	var container = null;
	var frontCanvas = null, backCanvas = null;
	var frontCtx = null, backCtx = null;
	var currentPath = null, currentColor = null, currentSize = null;
	var pathes = [];
	var isDrawing = false;
	
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


			frontCanvas.onmousedown = this.mouseDown();
			frontCanvas.onmouseup = this.mouseLeave();
			frontCanvas.onmouseout = this.mouseLeave();
			frontCanvas.onmousemove = this.mouseMove();

			sandBox.listen( { "undo": this.undo() } );
			sandBox.listen( { "reset": this.reset() } );
			sandBox.listen( { "chalkChange": this.colorChange } );
			sandBox.listen( { "brushSizeChange": this.brushSizeChange } );
			sandBox.listen( { "save": this.save } );

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
			};
		},

		mouseLeave: function() {
			var parent = this;
			return function(e) {
				if(isDrawing == true) {
					isDrawing = false;
					pathes.push(currentPath);
				}
				parent.paintBackIncr();
				currentPath = null;
				parent.repaintFront();
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
				parent.repaintFront();
			};
		},

		reset: function() {
			var parent = this;
			return function() {
				pathes.length = 0;
				parent.repaintBack();
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
		},

		paintBackIncr: function() {
			if(currentPath) {
				backCtx.beginPath();
				backCtx.strokeStyle = "#" + currentPath.color;
				backCtx.lineWidth = currentPath.size;
				backCtx.lineCap = "round";
				backCtx.lineJoin = "round";
				backCtx.moveTo(currentPath.points[0].X, currentPath.points[0].Y);
				for(var i = 0; i < currentPath.points.length; i++) {
					backCtx.lineTo(currentPath.points[i].X, currentPath.points[i].Y);
				}
				backCtx.stroke();
				backCtx.closePath();		
			}
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
		}
	};
});