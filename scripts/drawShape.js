(function () {

    var main;
    var recognizer;
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

    function init(options) {
        main = options.main;
        recognizer = new DollarRecognizer();
        $("#pieMenu").hide();
        
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

        var sizeSelected = function(size) {
            currSize = size;
        }
        var colorSelected = function(color) {
            currColor = color;
        }
        $.crayon({
            main: main,
            colorSelected: colorSelected,
            sizeSelected: sizeSelected
        });

        var isDone = false;
        var isDrawing = false;
        var isPaint = false;
        var result;

        $(frontCanvas).mousedown(function(e) {
            if(isDone == false) {
                isDrawing = true;
                currPath = {
                    color: currColor,
                    size: currSize,
                    points: [ {
                        X: e.offsetX,
                        Y: e.offsetY
                    } ]
                };
            }
        });

        $(frontCanvas).mouseup(function(e) {
            isDone = true;
            isDrawing = false;
            if(isPaint == false) {
                pathes.push(currPath);
                result = recognizer.Recognize(currPath.points, true);
                currPath = null;
                repaintBack();
            }
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
            if(isPaint === false && isDrawing === true) {
                isDone = true;
                isDrawing = false;
                pathes.push(currPath);
                result = recognizer.Recognize(currPath.points, true);
                currPath = null;
                repaintBack();
            }
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
            frontCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
        };

        var repaintBack = function() {
            if(isPaint == false && isDone == true) {
                isPaint = true;
                var num = Math.floor(Math.random() * 3);
                var shape = shapeGroup[result.Name];
                var img = new Image();
                var src = "images/pictures/"+shape+"/"+num;
                img.src = src+"-color.png";
                backCtx.drawImage(img, 0, 0, img.width, img.height);
                var id = setInterval(function() {
                    if(img.complete) {
                        backCtx.drawImage(img, 0, 0, img.width, img.height);
                        
                        clearInterval(id);

                        setTimeout(function() {
                            game.loadModule("drawPicture", src);
                        }, 2000);
                    }
                }, 50);
            }
        };

    }

    function dispose() {
        main = null;
        recognizer = null;
    }

    modules["drawShape"] = {
        init: init,
        dispose: dispose
    }
})();
