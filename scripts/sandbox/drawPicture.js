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
	var hasCheck = false;

	var repaintFront = function() {
		var ctx = frontCtx;
        ctx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
        if(!currentPath || currentPath.stamp) {
          	ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
           	return ;
        }
        sandBox.drawAPath(ctx, currentPath);
        ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
        
	};

	var repaintBack = function() {
		var ctx = backCtx, localPathes = pathes;
		ctx.clearRect(0, 0, backCanvas.width, backCanvas.height);
		ctx.globalAlpha = 0.4;
		ctx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);
		ctx.globalAlpha = 1;
		for(var i = 0; i < pathes.length; i++) {
			var path = localPathes[i];

			if(path && path.stamp) {
                var stampImg = stampImgs[path.stamp];
                ctx.drawImage(stampImg, path.X - stampImg.width/2, path.Y - stampImg.height/2);
            } else if(path) {
	            sandBox.drawAPath(ctx, path);
            }
		}

		// ctx.globalAlpha = 0.4;
		// ctx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);
		// ctx.globalAlpha = 1;
	};

	var paintBackIncr = function() {
		var ctx = backCtx;
		if(currentPath && currentPath.stamp) {
			var stampImg = stampImgs[currentPath.stamp];
			ctx.drawImage(stampImg, currentPath.X - stampImg.width/2, currentPath.Y - stampImg.height/2);
		} else if(currentPath) {
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

			frontCanvas.onmousedown = this.drawStart;
			frontCanvas.onmouseup = this.drawStop;
			frontCanvas.onmouseout = this.drawStop;
			frontCanvas.onmousemove = this.drawing;

			if(sandBox.touchable()) {
				frontCanvas.addEventListener("touchstart", this.drawStart);
				frontCanvas.addEventListener("touchmove", this.drawing);
				frontCanvas.addEventListener("touchend", this.drawStop);
			}

			sandBox.listen( { "undo": this.undo,
				"reset": this.reset,
				"stampChange": this.stampChange,
				"colorChange": this.colorChange,
				"brushSizeChange": this.brushSizeChange,
				"check": this.check} );

			setInterval(repaintBack, 100);
			setInterval(repaintFront, 50);
		},

		drawStart: function(evt) {
			if(currentStamp) {
				currentPath = {
					stamp: currentStamp,
					X: evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX,
					Y: evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY
				};
			} else {
				isDrawing = true;
				currentPath = {
					color: currentColor,
					size: currentSize,
					points: [ {
						X: evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX,
						Y: evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY
					} ],
					stamp: null
				};
			}
		},

		drawStop: function(evt) {
			if(currentStamp) {
				if(currentPath != null) {
					pathes.push(currentPath);	
				}
			} else if(isDrawing == true) {
				isDrawing = false;
				pathes.push(currentPath);
			}
			paintBackIncr();
			currentPath = null;
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
			}
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
			pathes.pop();
			repaintBack();
		},

		reset: function() {
			pathes.length = 0;
			repaintBack();
		},

		check: function() {
			if(hasCheck === false) {
				sandBox.notify({"type": "finishOnePic"});
				hasCheck = true;
			}
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
			clearInterval(frontIntervalId);
			clearInterval(backIntervalId);
			sandBox.ignore("save");
		}
	};
});