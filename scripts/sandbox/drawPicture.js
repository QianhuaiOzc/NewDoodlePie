Core.registerModule("drawPicture", function(sandBox) {
	var container = null;
	var frontCanvas = null, backCanvas = null;
	var frontCtx = null, backCtx = null;
	var currentPath = null, currentColor = null, currentSize = null, currentStamp = null;
	var pathes = [];
	var textureImage = null;
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

			textureImage = new Image();
			textureImage.src = "images/crayon-texture.png";

			frontCanvas.onmousedown = this.mouseDown();
			frontCanvas.onmouseup = this.mouseLeave();
			frontCanvas.onmouseout = this.mouseLeave();
			frontCanvas.onmousemove = this.mouseMove();

			sandBox.listen( {"stampChange": this.stampChange } );
			sandBox.listen( { "colorChange": this.colorChange } );
			sandBox.listen( { "brushSizeChange": this.brushSizeChange } );
		},

		mouseDown: function() {

			return function(e) {
				
			// console.log("frontCanvas mouse down");
			};
		},

		mouseLeave: function() {
			var parent = this;
			return function(e) {
				
			};
			// console.log("frontCanvas mouse leave");
		},

		mouseMove: function() {
			var parent = this;
			return function(e) {
				
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

		stampChange: function(stamp) {
			currentStamp = stamp;
			console.log("stamp change: " + stamp);
		},
		
		repaintFront: function() {
			/*
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
            */
			// console.log("repaintFront");
		},

		repaintBack: function() {
			/*
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
                            Core.stop("drawShape");
                            Core.start("drawPicture");
                        }, 2000);
                    }
                }, 50);
            }
            */
			// console.log("repaintBack result: " + result.Name);	
		},

		destroy: function() {
			sandBox.hide(container);
		}
	};
});