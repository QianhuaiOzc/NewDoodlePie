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
                            // Core.stop("drawShape");
                            Core.stopAll();
                            Core.start("drawPicture", src);
                            Core.start("pieMenu");
                            Core.start("crayon");
        					Core.start("brushSize");
                            Core.start("stamp");
                            Core.start("undo");
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