(function () {

    var main;
    var img;

    function init(options) {
        main = options.main;
        //console.log(options.argument);
        img = new Image();
        img.src = options.argument + ".png";
        
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

        var undo = function() {};
        var reset = function() {};
        var sizeSelected = function(size) {
            currSize = size;
        }
        var colorSelected = function(color) {
            currColor = color;
        }
        $.crayon({
            main: main,
            colorSelected: colorSelected,
            sizeSelected: sizeSelected,
            undo: undo,
            reset: reset
        });

        var isDrawing = false;

        $(frontCanvas).mousedown(function(e) {
            isDrawing = true;
            currPath = {
                color: currColor,
                size: currSize,
                points: [ {
                    X: e.offsetX,
                    Y: e.offsetY
                } ]
            };
        });

        $(frontCanvas).mouseup(function(e) {
            isDrawing = false;
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

            frontCtx.moveTo(currPath.points[0].X, currPath.points[0].Y);

            for(var i = 0; i < currPath.points.length; i++) {
                frontCtx.lineTo(currPath.points[i].X, currPath.points[i].Y);
            }
            frontCtx.stroke();
            frontCtx.closePath();
            frontCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
        };

        var repaintBack = function() {
            backCtx.drawImage(img, 0, 0, img.width, img.height);
        };

        setTimeout(function() {
            frontCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);        
        }, 50);
        setTimeout(repaintBack, 100);

    }

    function dispose() {
        main = null;
        img = null;
    }

    modules["drawPicture"] = {
        init: init,
        dispose: dispose
    }
})();
