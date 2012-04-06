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

			if(sandBox.touchable()) {
				frontCanvas.addEventListener("touchstart", this.touchStart());
				frontCanvas.addEventListener("touchmove", this.touchMove());
				frontCanvas.addEventListener("touchend", this.touchEnd());
			}

			sandBox.listen({ "colorChange": this.colorChange });
			sandBox.listen({ "brushSizeChange" : this.brushSizeChange });
		},

		touchStart: function() {
			var parent = this;
			return function(evt) {
				if(isDone == false) {
					isDrawing = true;
					currentPath = {
						color: currentColor,
						size: currentSize,
						points: [{
							X: evt.targetTouches[0].pageX - frontCanvas.offsetLeft,
							Y: evt.targetTouches[0].pageY - frontCanvas.offsetTop
						}]
					};
				}
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
				if(isPaint == false && isDrawing == true) {
					isDone = true;
					isDrawing = false;
					pathes.push(currentPath);
					result = recognizer.Recognize(currentPath.points, true);
					parent.repaintBack();
				}	
			};
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
		
		repaintFront: function() {
			var ctx = frontCtx, points = currentPath.points;
			ctx.fillStyle = "rgba(255, 255, 255, 0)";
            ctx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);

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
            ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
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
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
		}
	}
});