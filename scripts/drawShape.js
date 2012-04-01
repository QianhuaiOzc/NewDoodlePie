(function () {

    var main;
    var canvases = new Array(2);

    function init(options) {
        main = options.main;
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

        var undo = function() {}
        var reset = function() {}
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

        var isDone = false;
        var isDrawing = false;

        $(frontCanvas).mousedown(function(e) {
            if(isDone == false) {
                isDrawing = true;
                currPath = {
                    color: currColor,
                    size: currSize,
                    points: [ {
                        x: e.offsetX,
                        y: e.offsetY
                    } ]
                };
            }
        });

        $(frontCanvas).mouseup(function(e) {
            isDone = true;
            isDrawing = false;
            pathes.push(currPath);
            currPath = null;
            repaintBack();
        });

        $(frontCanvas).mousemove(function(e) {
            if(isDrawing == true) {
                // push the point to the pathes
                currPath.points.push( {
                    x: e.offsetX,
                    y: e.offsetY
                } );
                repaintFront();
            }
        });

        $(frontCanvas).mouseleave(function(e) {
            isDone = true;
            repaintBack();
        });

        var repaintFront = function() {
            frontCtx.fillStyle = "rgba(255, 255, 255, 0)";
            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);

            frontCtx.beginPath();
            frontCtx.strokeStyle = "#" + currPath.color;
            frontCtx.lineWidth = currPath.size;
            frontCtx.lineJoin = "round";

            frontCtx.moveTo(currPath.points[0].x, currPath.points[0].y);

            for(var i = 0; i < currPath.points.length; i++) {
                frontCtx.lineTo(currPath.points[i].x, currPath.points[i].y);
            }
            frontCtx.stroke();
            frontCtx.closePath();
            frontCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
        };

        var repaintBack = function() {
            
        };

        var reset = function() {
            
        }
    }

    function dispose() {
        main = null;
    }

    modules["drawShape"] = {
        init: init,
        dispose: dispose
    }
})();
