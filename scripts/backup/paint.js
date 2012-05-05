(function () {

    var main;
    var imgs = [];
    var stampsList = [ "ball", "flower", "heart", "music", "star" ];

    function init(options) {
        main = options.main;
        for(var i = 0; i < stampsList.length; i++) {
            var stampImage = new Image();
            var imgPath = stampsList[i];
            stampImage.src = "images/stamps/"+stampsList[i]+"1.png";
            imgs[imgPath] = stampImage;
        }
        $("#pieMenu").show();
        
        var frontCanvas = options.frontCanvas.get(0);
        var backCanvas = options.backCanvas.get(0);
        var frontCtx = frontCanvas.getContext("2d");
        var backCtx = backCanvas.getContext("2d");
        var textureImage = new Image();
        textureImage.src = "images/crayon-texture.png"

        var currColor;
        var currSize;
        var pathes = [];
        var currPath;
        var currStamp;

        var undo = function() {
            if(pathes.length > 0) {
                pathes.pop();
            }
            repaintBack();
        };
        var reset = function() {
            pathes.length = 0;
            repaintBack();
        };
        var sizeSelected = function(size) {
            currSize = size;
        }
        var colorSelected = function(color) {
            currColor = color;
        }
        var stampSelected = function(stamp) {
            currStamp = stamp;
        }
        $.crayon({
            main: main,
            colorSelected: colorSelected,
            sizeSelected: sizeSelected,
            undo: undo,
            reset: reset,
            stampSelected: stampSelected
        });

        var isDrawing = false;

        $(frontCanvas).mousedown(function(e) {
            if(currStamp) {
                currPath = {
                    stamp: currStamp,
                    X: e.offsetX,
                    Y: e.offsetY
                };
            } else {
                isDrawing = true;
                currPath = {
                    color: currColor,
                    size: currSize,
                    points: [ {
                        X: e.offsetX,
                        Y: e.offsetY
                    } ],
                    stamp: null
                };
            }
        });

        $(frontCanvas).mouseup(function(e) {
            isDrawing = false;
            pathes.push(currPath);
            repaintBack();
        });

        $(frontCanvas).mousemove(function(e) {
            if(isDrawing == true) {
                currPath.points.push( {
                    X: e.offsetX,
                    Y: e.offsetY
                } );
                repaintFront();
            }
        });

        $(frontCanvas).mouseleave(function(e) {
            isDrawing = false;
            pathes.push(currPath);
            repaintBack();
        });

        var touchCanvas = $(frontCanvas).Touchable();
        touchCanvas.bind("touchablemove", function(e, touch) {
            //console.log(touch);
        });
        touchCanvas.bind("touchableend", function(e, touch) {
            //console.log(touch);
        });
        touchCanvas.bind("tap", function(e, touch) {
            //console.log(touch);
        });

        frontCanvas.addEventListener("touchstart", function(e) {
        });

        frontCanvas.addEventListener("touchmove", function(e) {

        });

        frontCanvas.addEventListener("touchend", function(e) {});

        var repaintFront = function() {
            frontCtx.fillStyle = "rgba(255, 255, 255, 0)";
            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
            var lineImg = new Image();

            frontCtx.beginPath();
            frontCtx.strokeStyle = "#" + currPath.color;
            frontCtx.lineWidth = currPath.size;
            frontCtx.lineJoin = "round";
            frontCtx.lineCap = "round";

            frontCtx.moveTo(currPath.points[0].X, currPath.points[0].Y);

            for(var i = 0; i < currPath.points.length; i++) {
                frontCtx.lineTo(currPath.points[i].X, currPath.points[i].Y);
            }
            frontCtx.stroke();
            frontCtx.closePath();
//            frontCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
        };

        var repaintBack = function() {
            backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);

            for(var i = 0; i < pathes.length; i++) {
                var path = pathes[i];
                
                if(path && path.stamp) {
                    var stampImg = imgs[path.stamp];
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
            //backCtx.globalAlpha = 0.4;
            //backCtx.drawImage(img, 0, 0, img.width, img.height);
            //backCtx.globalAlpha = 1;
        };

        setTimeout(repaintBack, 100);

    }

    function dispose() {
        main = null;
        imgs = null;
    }

    modules["paint"] = {
        init: init,
        dispose: dispose
    }
})();
