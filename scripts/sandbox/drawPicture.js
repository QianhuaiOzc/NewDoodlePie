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
	var backIntervalId = null, frontIntervalId = null;
	
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

			if(sandBox.touchable()) {
				frontCanvas.addEventListener("touchstart", this.touchStart());
				frontCanvas.addEventListener("touchmove", this.touchMove());
				frontCanvas.addEventListener("touchend", this.touchEnd());
			}

			sandBox.listen( { "undo": this.undo() } );
			sandBox.listen( { "reset": this.reset() } );
			sandBox.listen( { "stampChange": this.stampChange } );
			sandBox.listen( { "colorChange": this.colorChange } );
			sandBox.listen( { "brushSizeChange": this.brushSizeChange } );
			sandBox.listen( { "save": this.save } );

			setInterval(this.repaintBack, 100);
			setInterval(this.repaintFront, 50);
		},

		touchStart: function() {
			var parent = this;
			return function(evt) {
				if(currentStamp) {
					currentPath = {
						stamp: currentStamp,
						X: evt.targetTouches[0].pageX - frontCanvas.offsetLeft,
						Y: evt.targetTouches[0].pageY - frontCanvas.offsetTop
					};
				} else {
					isDrawing = true;
					currentPath = {
						color: currentColor,
						size: currentSize,
						points: [ {
							X: evt.targetTouches[0].pageX - frontCanvas.offsetLeft,
							Y: evt.targetTouches[0].pageY - frontCanvas.offsetTop
						} ],
						stamp: null
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
				}
			};
		},

		touchEnd: function() {
			var parent = this;
			return function(evt) {
				if(currentStamp) {
					if(currentPath != null) {
						pathes.push(currentPath);	
					}
				} else if(isDrawing == true) {
					isDrawing = false;
					pathes.push(currentPath);
				}
				parent.paintBackIncr();
				currentPath = null;
				// parent.repaintFront();
			};
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
				parent.paintBackIncr();
				currentPath = null;
				// parent.repaintFront();
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
				backCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
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

            if(!currentPath || currentPath.stamp) {
            	ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
            	return ;
            }
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
            ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
		},

		repaintBack: function() {
			var ctx = backCtx, localPathes = pathes;
			ctx.clearRect(0, 0, backCanvas.width, backCanvas.height);

			for(var i = 0; i < pathes.length; i++) {
				var path = localPathes[i];

				if(path && path.stamp) {
                    var stampImg = stampImgs[path.stamp];
                    ctx.drawImage(stampImg, path.X - stampImg.width/2, path.Y - stampImg.height/2);
                } else if(path) {
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
			}

			ctx.globalAlpha = 0.4;
			ctx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);
			ctx.globalAlpha = 1;
		},

		paintBackIncr: function() {
			var ctx = backCtx;
			if(currentPath && currentPath.stamp) {
				var stampImg = stampImgs[currentPath.stamp];
				ctx.drawImage(stampImg, currentPath.X - stampImg.width/2, currentPath.Y - stampImg.height/2);
			} else if(currentPath) {
				var points = currentPath.points;
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
			clearInterval(frontIntervalId);
			clearInterval(backIntervalId);
		}
	};
});