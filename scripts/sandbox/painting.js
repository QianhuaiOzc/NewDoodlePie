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

			if(sandBox.touchable()) {
				frontCanvas.addEventListener("touchstart", this.touchStart());
				frontCanvas.addEventListener("touchmove", this.touchMove());
				frontCanvas.addEventListener("touchend", this.touchEnd());
			}

			sandBox.listen( { "undo": this.undo() } );
			sandBox.listen( { "reset": this.reset() } );
			sandBox.listen( { "colorChange": this.colorChange } );
			sandBox.listen( { "brushSizeChange": this.brushSizeChange } );
			sandBox.listen( { "save": this.save } );

			setTimeout(this.repaintBack, 50);
		},

		touchStart: function() {
			var parent = this;
			return function(evt) {
				isDrawing = true;
					currentPath = {
						color: currentColor,
						size: currentSize,
						points: [ {
							X: evt.targetTouches[0].pageX - frontCanvas.offsetLeft,
						Y: evt.targetTouches[0].pageY - frontCanvas.offsetTop
						} ]
					};
			};
		},

		touchMove: function() {
			var parent = this;
			return function(evt) {
				evt.preventDefault();
				if(isDrawing == true) {
					currentPath.points.push( {
						X: evt.targetTouches[0].pageX - frontCanvas.offsetLeft,
						Y: evt.targetTouches[0].pageY - frontCanvas.offsetTop
					} );
					parent.repaintFront();
				}
			};
		},

		touchEnd: function() {
			var parent = this;
			return function(evt) {
				var p = parent;
				if(isDrawing == true) {
					isDrawing = false;
					pathes.push(currentPath);
				}
				p.paintBackIncr();
				currentPath = null;
				p.repaintBack();
			};
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
				var p = parent;
				if(isDrawing == true) {
					isDrawing = false;
					pathes.push(currentPath);
				}
				p.paintBackIncr();
				currentPath = null;
				p.repaintBack();
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
			var ctx = frontCtx;
			ctx.fillStyle = "rgba(255, 255, 255, 0)";
            ctx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);

            if(currentPath) {
            	var points = currentPath.points;
            	ctx.beginPath();
	            ctx.strokeStyle = "#" + currentPath.color;
	            ctx.lineWidth =  currentPath.size;
	            ctx.lineJoin = "round";
	            ctx.lineCap = "round";

	            ctx.moveTo(points[0].X, points[0].Y);

	            for(var i = 0; i < points.length; i++) {
	                ctx.lineTo(points[i].X, points[i].Y);
	            }
	            ctx.stroke();
	            ctx.closePath();
            }
		},

		repaintBack: function() {
			var ctx = backCtx, localPathes = pathes;
			ctx.clearRect(0, 0, backCanvas.width, backCanvas.height);

			for(var i = 0; i < pathes.length; i++) {
				var path = localPathes[i];
				var points = path.points;

				
		    	ctx.beginPath();
                ctx.strokeStyle = "#" + path.color;
                ctx.lineWidth = path.size;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.moveTo(points[0].X, points[0].Y);

                for(var j = 1; j < points.length; j++) {
            		ctx.lineTo(points[j].X, points[j].Y);
                }

                ctx.stroke();
                ctx.closePath();
			}

			backCtx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);
		},

		paintBackIncr: function() {
			if(currentPath) {
				var ctx = backCtx, points = currentPath.points;
				ctx.beginPath();
				ctx.strokeStyle = "#" + currentPath.color;
				ctx.lineWidth = currentPath.size;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.moveTo(points[0].X, points[0].Y);
				for(var i = 0; i < points.length; i++) {
					ctx.lineTo(points[i].X, points[i].Y);
				}
				ctx.stroke();
				ctx.closePath();		
			}
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
		}
	};
});