Core.registerModule("painting", function(sandBox) {
	var container = null;
	var frontCanvas = null, backCanvas = null;
	var frontCtx = null, backCtx = null;
	var currentPath = null, currentColor = null, currentSize = null;
	var pathes = [];
	var isDrawing = false;
	var backgroundImg = null;

	var repaintFront = function() {
			var ctx = frontCtx;
			ctx.fillStyle = "rgba(255, 255, 255, 0)";
            ctx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);

            if(currentPath) {
	            sandBox.drawAPath(ctx, currentPath);
            }
		};

	var repaintBack = function() {
			var ctx = backCtx, localPathes = pathes;
			ctx.clearRect(0, 0, backCanvas.width, backCanvas.height);

			for(var i = 0; i < pathes.length; i++) {
				var path = localPathes[i];
				sandBox.drawAPath(ctx, path);
			}

			backCtx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);
		};

	var paintBackIncr = function() {
			if(currentPath) {
				var ctx = backCtx, points = currentPath.points;
				sandBox.drawAPath(ctx, currentPath);	
			}
		};
	
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

			frontCanvas.onmousedown = this.drawStart;
			frontCanvas.onmouseup = this.drawStop;
			frontCanvas.onmouseout = this.drawStop;
			frontCanvas.onmousemove = this.drawing;

			if(sandBox.touchable()) {
				frontCanvas.addEventListener("touchstart", this.drawStart);
				frontCanvas.addEventListener("touchmove", this.drawing);
				frontCanvas.addEventListener("touchend", this.drawStop);
			}

			sandBox.listen( { "undo": this.undo } );
			sandBox.listen( { "reset": this.reset } );
			sandBox.listen( { "colorChange": this.colorChange } );
			sandBox.listen( { "brushSizeChange": this.brushSizeChange } );
			sandBox.listen( { "save": this.save } );

			setInterval(repaintBack, 100);
			setInterval(repaintFront, 50);
		},

		drawStart: function(evt) {
			isDrawing = true;
			currentPath = {
				color: currentColor,
				size: currentSize,
				points: [ {
					X: evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX,
					Y: evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY
				} ]
			};
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
				repaintFront();
			}
		},

		drawStop: function(evt) {
			if(isDrawing == true) {
				isDrawing = false;
				pathes.push(currentPath);
			}
			paintBackIncr();
			currentPath = null;
		},

		colorChange: function(color) {
			currentColor = color;
		},

		brushSizeChange: function(size) {
			currentSize = size;
		},

		undo: function() {
			pathes.pop();
			repaintBack();
			
		},

		reset: function() {
			pathes.length = 0;
			repaintBack();
		},

		save: function() {
			try {
                var dataUrl = backCanvas.toDataURL("image/png");
                window.open(dataUrl);
            } catch (ex) {
                console.log(ex);
            }
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
		}
	};
});