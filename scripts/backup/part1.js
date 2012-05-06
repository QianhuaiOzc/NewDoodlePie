(function () {

    var main;
    var mainCanvas;
    var context;
    var paint = false;
    var startX;
    var startY;
    var curColor;
    var curShape;
    var curSize;
    var crayonTextureImage = new Image();
    var hasChange = false;
    var valid = false;
    crayonTextureImage.src = "images/crayon-texture.png"

    // shape list
    var shapeList = [ 'rectangle', 'triangle', 'circle' ]; 
    var shapeTop = -15;
    var shapeFirstLeft = 320;
    var shapeSpacing = 50;
    var shapeHeight = 117;
    var shapeWidth = 117;

    function init() {
        main = $("#main");
        main.empty();

        // canvas
        mainCanvas = $("<canvas></canvas>").appendTo(main);
        mainCanvas.css({
            position: "absolute",
            //border: "1px solid red",
            left: 132,
            top: 120
        });

        mainCanvas.attr({
            width: 800,
            height: 600
        });

        var colorSelected = function (color) {
            curColor = color;
        };
        var sizeSelected = function(size) {
            curSize = size;
        }

        $.crayon({
            main: main,
            colorSelected: colorSelected,
            sizeSelected: sizeSelected
        });
        context = mainCanvas[0].getContext('2d');

        mainCanvas.mousedown(function(e) {
            startX = e.offsetX;
            startY = e.offsetY;
            paint = true;
        });

        mainCanvas.mouseup(function(e) {
            paint = false;
            if(hasChange == false && valid == true) {
                nextStep();
            }
            /*
            if(hasChange == false && valid == true) {
                var showImg = "images/" + curShape + "/" + Math.ceil(Math.random() * 3);
                var showImgColor = showImg + "-color.png";
                var img = new Image();
                img.src = showImgColor;
                hasChange = true;
                setTimeout(function() {
                    clearCanvas();
                    context.drawImage(img, 0, 0);
                }, 1000);
                setTimeout(function() {
                    game.shapeUsed(curShape);
                    game.loadModule('part2', showImg+".png");
                }, 2000);
            }
            */
        });

        mainCanvas.mousemove(function(e) {
            if(paint == true) {
                clearCanvas();
                context.strokeStyle = curColor;
                context.lineWidth = curSize;
                var curX = e.offsetX;
                var curY = e.offsetY;
                if (curX - startX < 10 || curY - startY < 10) {
                    valid = true;
                }
                if (curShape == 'rectangle') {
                    var width = curX - startX;
                    var height = curY - startY;
                    context.strokeRect(startX, startY, curX - startX, curY - startY);
                } else if (curShape == 'circle') {
                    drawEllipse(context, startX, startY, (curX - startX), (curY - startY));
                } else if (curShape == 'triangle') {
                    context.beginPath();
                    context.moveTo((curX + startX)/2, startY);
                    context.lineTo(curX, curY);
                    context.lineTo(startX, curY);
                    context.closePath();
                }
                context.stroke();
                //context.restore();
                context.globalAlpha = 0.5;
                context.drawImage(crayonTextureImage, 0, 0, crayonTextureImage.width, crayonTextureImage.height);
            }
        });

        mainCanvas.mouseleave(function(e) {
            paint = false;
            if(hasChange == false && valid == true) {
                nextStep();
            }
        });

        var shapeDivList = [];
        var select = function(shapeDiv) {
            for(var i = 0; i < shapeDivList.length; i++) {
                shapeDivList[i].css({"top": shapeTop});
            }
            shapeDiv.css({
                "top": shapeTop + 30 
            });
            curShape = shapeDiv.attr('shape');
        };
        for (var i = 0; i < shapeList.length; i++) {
            var shape = shapeList[i];

            var shapeDiv = $('<div></div>').appendTo(main);
            shapeDiv.attr('shape', shape);
            shapeDiv.css({
                "position": "absolute",
                "background": "url('images/shape/"+shapeList[i]+".png') no-repeat",
                "top": shapeTop,
                "height": shapeHeight,
                "width": shapeWidth,
                "left": shapeFirstLeft + i * (shapeWidth + shapeSpacing)
            });

            shapeDiv.click(function() {
                select($(this)); 
            });
            shapeDivList.push(shapeDiv);
        }
        select(shapeDivList[0]);
    }

    function drawEllipse(ctx, x, y, w, h) {
        var kappa = .5522848;
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.closePath();
        ctx.stroke();
    }

    function nextStep() {
                var showImg = "images/" + curShape + "/" + Math.ceil(Math.random() * 3);
                var showImgColor = showImg + "-color.png";
                var img = new Image();
                img.src = showImgColor;
                hasChange = true;
                setTimeout(function() {
                    clearCanvas();
                    context.drawImage(img, 0, 0);
                }, 1000);
                setTimeout(function() {
                    game.shapeUsed(curShape);
                    game.loadModule('part2', showImg+".png");
                }, 2000);
    }

    function clearCanvas() {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, mainCanvas.attr("width"), mainCanvas.attr("height")); // Fill in the canvas with white
    }

    function dispose() {
        main = null;
        mainCanvas = null;
    }

    modules["part1"] = {
        init: init,
        dispose: dispose
    }
})();
