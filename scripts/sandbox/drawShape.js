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
    var imageNumber = {
    	"triangle": 5,
    	"circle": 10,
    	"rectangle": 6,
    	"spiral": 0,
    	"star": 0
    };
    var recognizer = null, result = null;

    var repaintFront = function() {
    	var ctx = frontCtx, points = currentPath.points;
		ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
       	sandBox.drawAPath(ctx, currentPath);
        ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
    };

    var repaintBack = function() {
    	if(isPaint == false && isDone == true) {
            isPaint = true;
            var shape = shapeGroup[result.Name];
            var num = Math.floor(Math.random() * imageNumber[shape]);
            console.log("shape: " + shape + "\nnum: " + num);
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

			textureImage = new Image();
			textureImage.src = "images/crayon-texture.png";

			recognizer = new DollarRecognizer();

			frontCanvas.onmousedown = this.drawStart;
			frontCanvas.onmouseup = this.drawStop;
			frontCanvas.onmouseout = this.drawStop;
			frontCanvas.onmousemove = this.drawing;

			if(sandBox.touchable()) {
				frontCanvas.addEventListener("touchstart", this.drawStart);
				frontCanvas.addEventListener("touchmove", this.drawing);
				frontCanvas.addEventListener("touchend", this.drawStop);
			}

			sandBox.listen({ "colorChange": this.colorChange,
				"brushSizeChange" : this.brushSizeChange });
		},

		drawStart: function(evt) {
			if(isDone == false) {
				isDrawing = true;
				currentPath = {
					color: currentColor,
					size: currentSize,
					points: [ {
						X: evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX,
						Y: evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY
					} ]	
				};
			}	
		},

		drawStop: function(evt) {
			if(isPaint == false && isDrawing == true) {
				isDone = true;
				isDrawing = false;
				pathes.push(currentPath);
				result = recognizer.Recognize(currentPath.points, true);
				repaintBack();
			}		
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

		colorChange: function(color) {
			currentColor = color;
		},

		brushSizeChange: function(size) {
			currentSize = size;
		},
		
		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
		}
	}
});