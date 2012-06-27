/*
 * option: {
 *     texture: Image,
 *     background: Image,
 * 	   stamps: {stampName0: stampImage0, .., stampNameN: stampImageN},
 * 	   touchable: boolean,
 * 	   blackground_alpha: 0.0-1.0
 * }
*/
function PieCanvas(container, options) {
	var obj = new Object(), hasTexture = false, hasBackground = false, useStamp = false,
		textureImage = null, backgroundImage = null, stamps = null, blackground_alpha = 0.4,
		canvasFragment = document.createDocumentFragment(),
		status = {
			isDrawing: false,
			currentPath: null,
			undo: [],
			interval: null,
			currentColor: null,
			currentSize: 20,
			currentStamp: null,
			hasCheck: false
		},
		canvases = {
			bCanvas: document.createElement("canvas"),
			mCanvas: document.createElement("canvas"),
			fCanvas: document.createElement("canvas")
		}, eventCanvas = canvases["fCanvas"],
		contextes = {
			bCtx: canvases["bCanvas"].getContext("2d"),
			mCtx: canvases["mCanvas"].getContext("2d"),
			fCtx: canvases["fCanvas"].getContext("2d")
		},
		fn = {
			paintFrontCanvas: function() {
				var ctx = contextes["fCtx"], canvas = canvases["fCanvas"], currentPath = status.currentPath;
		        ctx.clearRect(0, 0, canvas.width, canvas.height);
		        if(!currentPath) {
		           	return ;
		        }
		        fn.drawAStroke(ctx, currentPath);
		        if(hasTexture) {
			        ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
		        }
			},
			paintMiddleCanvas: function() {
				var ctx = contextes["mCtx"], 
					canvas = canvases["mCanvas"], 
					undo = status.undo, length = undo.length;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
		        for(var i = 0; i < length; i++) {
			        fn.drawAStroke(ctx, undo[i]);
				}
				if(hasTexture) {
					ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
				}
			},
			paintBackCanvas: function(line_path) {
				fn.drawAStroke(contextes["bCtx"], line_path);
			},
			drawAStroke: function(ctx, line_path) {
				var stampImg = null;
				if(useStamp && line_path.stamp) { 
					stampImg = stamps[line_path.stamp];
                	ctx.drawImage(stampImg, line_path.X - stampImg.width/2, line_path.Y - stampImg.height/2);
				} else {
					var i = 0, points = line_path.points, length = points.length;
					ctx.beginPath();
					ctx.strokeStyle = "#" + line_path.color;
					ctx.lineWidth = line_path.size;
					ctx.lineJoin = "round";
					ctx.lineCap = "round";
					for(; i < length; i+=1) {
			            ctx.lineTo(points[i].X, points[i].Y);
			        }
			        ctx.stroke();
			        ctx.closePath();
		    	}
			},
			drawBackgroundImage: function(ctx, img, alpha) {
				ctx.globalAlpha = alpha;
				ctx.drawImage(img, 0, 0, img.width, img.height);
				ctx.globalAlpha = 1.0;
			},
		},
		drawStart = function(evt) {
			if(!status.currentStamp) {
				status.isDrawing = true;
				status.currentPath = {
					color: status.currentColor,
					size: status.currentSize,
					points: [ {
						X: evt.changedTouches ? evt.changedTouches[0].pageX - canvases.fCanvas.offsetLeft : evt.offsetX,
						Y: evt.changedTouches ? evt.changedTouches[0].pageY - canvases.fCanvas.offsetTop : evt.offsetY
					} ],
					stamp: null
				};
				status.interval = setInterval(fn.paintFrontCanvas, 50);
			}
		},
		drawing = function(evt) {
			evt.preventDefault();
			if(status.isDrawing) {
				status.currentPath.points.push({
					X: evt.changedTouches ? evt.changedTouches[0].pageX - canvases.fCanvas.offsetLeft : evt.offsetX,
					Y: evt.changedTouches ? evt.changedTouches[0].pageY - canvases.fCanvas.offsetTop : evt.offsetY
				});
			}
		},
		drawStop = function(evt) {
			var undo = status.undo, shiftToBCanvas = null;
			if(useStamp && status.currentStamp && evt.type !== "mouseout") {
				status.currentPath = {
					stamp: status.currentStamp,
					X: evt.changedTouches ? evt.changedTouches[0].pageX - canvases.fCanvas.offsetLeft : evt.offsetX,
					Y: evt.changedTouches ? evt.changedTouches[0].pageY - canvases.fCanvas.offsetTop : evt.offsetY
				}
			} else if(status.isDrawing) {
				status.isDrawing = false;
				clearInterval(status.interval);
			}
			if(undo.length >= 5) {
				shiftToBCanvas = undo.shift();
				fn.paintBackCanvas(shiftToBCanvas);
			}
			undo.push(status.currentPath);
			fn.paintMiddleCanvas();
			status.currentPath = null;
			fn.paintFrontCanvas();
		};
	if(options.texture) {
		textureImage = options.texture;
		hasTexture = true;
	}
	if(options.background) {
		backgroundImage = options.background;
		hasBackground = true;
		if(options.blackground_alpha) {
			blackground_alpha = options.blackground_alpha;
		}
	}
	if(options.stamps) {
		stamps = options.stamps;
		useStamp = true;
	}

	eventCanvas.addEventListener("mousedown", drawStart, false);
	eventCanvas.addEventListener("mousemove", drawing, false);
	eventCanvas.addEventListener("mouseup", drawStop, false);
	// eventCanvas.addEventListener("mouseout", drawStop, false);
	if(options.touchable) {
		eventCanvas.addEventListener("touchstart", drawStart, false);
		eventCanvas.addEventListener("touchmove", drawing, false);
		eventCanvas.addEventListener("touchend", drawStop, false);
	}

	for (canvas in canvases) {
		canvases[canvas].setAttribute("width", 800);
		canvases[canvas].setAttribute("height", 600);
		canvases[canvas].setAttribute("id", canvas);
		canvasFragment.appendChild(canvases[canvas]);
		canvases[canvas].className = "canvas";
	}
	container.appendChild(canvasFragment);
	canvasFragment = null;

	if(hasBackground) {
		backgroundImage.onload = function() {
			fn.drawBackgroundImage(contextes["bCtx"], backgroundImage, blackground_alpha);
		}
	}
	if(hasTexture) {
		textureImage.onload = function() {
			fn.drawBackgroundImage(contextes["fCtx"], textureImage, 1.0);
		}
	}

	obj.undo = function() {
		if(status.undo.length > 0) {
			status.undo.pop();
			fn.paintMiddleCanvas();
		}
	};
	obj.reset = function() {
		var backCanvas = canvases["bCanvas"], backCtx = contextes["bCtx"];
		status.undo.length = 0;
		fn.paintMiddleCanvas();
		backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
		if(hasBackground) {
			fn.drawBackgroundImage(contextes["bCtx"], backgroundImage, blackground_alpha);
		}
		if(hasTexture) {
			fn.drawBackgroundImage(contextes["fCtx"], textureImage, 1.0);
		}
	};
	obj.getImageURL = function() {
		var imageData = contextes["bCtx"].getImageData(0, 0, canvases.bCanvas.width, canvases.bCanvas.height),
			saveCanvas = document.createElement("canvas"), saveCtx = saveCanvas.getContext("2d"),
			undo = status.undo, i = 0, length = undo.length, imageUrl = null;
		saveCanvas.setAttribute("width", 800);
		saveCanvas.setAttribute("height", 600);
		saveCanvas.style.marginTop = "-1000px";
		saveCtx.putImageData(imageData, 0, 0);
		for(; i < length; i += 1) {
		    fn.drawAStroke(saveCtx, undo[i]);
		}
		if(hasTexture) {
			fn.drawBackgroundImage(saveCtx, textureImage, 1.0);
		}
		imageUrl = saveCanvas.toDataURL("image/png");
			saveCanvas = null;
		return imageUrl;
	};
	obj.changeColor = function(newColor) {
		status.currentColor = newColor;
	};
	obj.changeSize = function(newSize) {
		status.currentSize = newSize;
	};
	obj.changeStamp = function(newStamp) {
		status.currentStamp = newStamp;
	};
	obj.check = function() {
		status.hasCheck = true;
	}
	obj.hasCheck = function() {
		return status.hasCheck;
	}
	return obj;
}