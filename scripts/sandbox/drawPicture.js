Core.registerModule("drawPicture", function(sandBox, backgroundImgSrc) {
	var container = null;
	var frontCanvas = null, backCanvas = null;
	var frontCtx = null, backCtx = null;
	var currentPath = null, currentColor = null, currentSize = null, currentStamp = null;
	var pathes = [];
	var textureImage = null;
	var isDrawing = false;
	var backgroundImg = null;
	var stampList = ["ball", "flower", "heart", "music", "star"], stampImgs = [];
	
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

			backgroundImg = new Image();
			backgroundImg.src = backgroundImgSrc + ".png"

			for(var i = 0; i < stampList.length; i++) {
	            var stampImage = new Image();
	            var imgPath = stampList[i];
	            stampImage.src = "images/stamps/"+stampList[i]+"1.png";
	            stampImgs[imgPath] = stampImage;
	        }

			frontCanvas.onmousedown = this.mouseDown();
			frontCanvas.onmouseup = this.mouseLeave();
			frontCanvas.onmouseout = this.mouseLeave();
			frontCanvas.onmousemove = this.mouseMove();

			sandBox.listen( { "undo": this.undo() } );
			sandBox.listen( { "reset": this.reset() } );
			sandBox.listen( { "stampChange": this.stampChange } );
			sandBox.listen( { "colorChange": this.colorChange } );
			sandBox.listen( { "brushSizeChange": this.brushSizeChange } );
		},

		mouseDown: function() {

			return function(e) {
				if(currentStamp) {
					currentPath = {
						stamp: currentStamp,
						X: e.offsetX,
						Y: e.offsetY
					};
				} else {
					isDrawing = true;
					currentPath = {
						color: currentColor,
						size: currentSize,
						points: [ {
							X: e.offsetX,
							Y: e.offsetY	
						} ],
						stamp: null
					};
				}
				console.log(currentPath);
			};
		},

		mouseLeave: function() {
			var parent = this;
			return function(e) {
				if(currentStamp) {
					if(currentPath != null) {
						pathes.push(currentPath);	
					}
				} else if(isDrawing == true) {
					isDrawing = false;
					pathes.push(currentPath);
				}
				currentPath = null;
				parent.repaintFront();
				parent.repaintBack();
				// console.log(pathes);
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
					// console.log(currentPath);
				}
			};
		},

		colorChange: function(color) {
			currentColor = color;
		},

		brushSizeChange: function(size) {
			currentSize = size;
		},

		stampChange: function(stamp) {
			currentStamp = stamp;
		},

		undo: function() {
			var parent = this;
			return function() {
				pathes.pop();
				parent.repaintBack();
				// console.log("undo");
			};
		},

		reset: function() {
			var parent = this;
			return function() {
				pathes.length = 0;
				parent.repaintBack();
				// console.log("reset");
			};
		},
		
		repaintFront: function() {
			frontCtx.fillStyle = "rgba(255, 255, 255, 0)";
            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);

            if(!currentPath || currentPath.stamp) {
            	frontCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
            	return ;
            }

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
			backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);

			for(var i = 0; i < pathes.length; i++) {
				var path = pathes[i];

				if(path && path.stamp) {
                    var stampImg = stampImgs[path.stamp];
                    backCtx.drawImage(stampImg, path.X - stampImg.width/2, path.Y - stampImg.height/2);
                } else if(path) {
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
			}

			backCtx.globalAlpha = 0.4;
			backCtx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);
			backCtx.globalAlpha = 1;
			// console.log("repaintBack result: " + result.Name);	
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
		}
	};
});