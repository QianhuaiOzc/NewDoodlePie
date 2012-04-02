(function () {

    var main;
    var save;
    var imgs = [];
    var stampsList = [ "ball", "flower", "heart", "music", "star" ];

    function init() {
        main = $("#main");
        main.empty();

        var showImg = arguments[0];

        var strokeImg = new Image();
        strokeImg.src = showImg;

        for(var i = 0; i < stampsList.length; i++) {
            var img = new Image();
            var imgPath = stampsList[i];
            img.src = "images/stamps/"+stampsList[i]+"1.png";
            imgs[imgPath] = img;
        }
        // canvas
        var mainCanvas = $("<canvas></canvas>").appendTo(main);
        mainCanvas.css({
            position: "absolute",
            // border: "1px solid red",
            left: 132,
            top: 120,
            "z-index": 2
        });

        mainCanvas.attr({
            "width": 800,
            "height": 600
        });

        var historyCanvas = $("<canvas></canvas>").appendTo(main);
        historyCanvas.css({
            position: "absolute",
            left: 132,
            top: 120,
            "z-index": 1
        });
        historyCanvas.attr({
            "width": 800,
            "height": 600
        });
        var historyContext = historyCanvas.get(0).getContext("2d");

        var crayonTextureImage = new Image();
        crayonTextureImage.src = "images/crayon-texture.png"

        var canvas = mainCanvas.get(0);
        var context = canvas.getContext("2d");

        var currColor;
        var currSize;
        var currStamp;
        var drawing = false;

        var pathes = [];
        var currPath;

        var undo = function () {
            if (pathes.length > 0) {
                pathes.pop();
            }

            repaint();
        }

        var reset = function () {
            pathes.length = 0;
            repaint();
        } 

        var sizeSelected = function (size) {
            currSize = size;
        };

        var colorSelected = function (color) {
            currColor = color;
        };

        $.crayon({
            main: main,
            colorSelected: colorSelected,
            sizeSelected: sizeSelected,
            undo: undo,
            reset: reset
        });

        var stampSelected = function(stamp) {
            currStamp = stamp;
        }
        $.stamp({main: main, stampSelected: stampSelected});

        mainCanvas.mousedown(function (ev) {
            if(currStamp != null) {
                pathes.push({
                    stamp: currStamp,
                    x: ev.offsetX,
                    y: ev.offsetY
                });
            } else {
                drawing = true;
                currPath = {
                    color: currColor,
                    size: currSize,
                    points: [ {
                        x: ev.offsetX,
                        y: ev.offsetY
                    } ]
                };
                //pathes.push(currPath);
            }
            //repaint();
        });

        mainCanvas.mouseup(function (ev) {
            drawing = false;
            pathes.push(currPath);
            currPath = null;
            repaint();
        });

        mainCanvas.mouseleave(function(ev) {
            drawing = false;
            pathes.push(currPath);
            repaint();
        });

        mainCanvas.mousemove(function (ev) {
            if (!drawing) return;

            currPath.points.push({
                x: ev.offsetX,
                y: ev.offsetY
            });

            //repaint();
            currRepaint();
        });

        save = $("#save");
        save.live("click", function () {
            game.imagePainted();

            try {
                var dataUrl = canvas.toDataURL("image/png");
                window.open(dataUrl);
            } catch (ex) {
                console.log(ex);
            }
        });

        var currRepaint = function() {

            context.fillStyle = "rgba(255, 255, 255, 0)";
            //context.fillRect(0, 0, canvas.width, canvas.height);
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.strokeStyle = "#" + currPath.color;
            context.lineWidth = currPath.size;
            context.lineJoin = "round";

            context.moveTo(currPath.points[0].x, currPath.points[0].y);
            for (var j = 1; j < currPath.points.length; j++) {
                context.lineTo(currPath.points[j].x, currPath.points[j].y);
            }

            context.stroke();
            context.closePath();
            context.drawImage(crayonTextureImage, 0, 0, crayonTextureImage.width, crayonTextureImage.height);
        }

        var repaint = function () {

            historyContext.fillStyle = '#ffffff'; // Work around for Chrome
            historyContext.fillRect(0, 0, canvas.width, canvas.height); // Fill in the canvas with white
            //historyContext.clearRect(0, 0, historyCanvas.width, historyCanvas.height);

            for (var i = 0; i < pathes.length; i++) {
                var path = pathes[i];
                if(!path.stamp) {

                    historyContext.beginPath();
                    historyContext.strokeStyle = "#" + path.color;
                    historyContext.lineWidth = path.size;
                    historyContext.lineJoin = "round";

                    historyContext.moveTo(path.points[0].x, path.points[0].y);

                    for (var j = 1; j < path.points.length; j++) {
                        historyContext.lineTo(path.points[j].x, path.points[j].y);
                    }

                    historyContext.stroke();
                    historyContext.closePath();
                } else {
                    var stampImg = imgs[path.stamp];
                    context.drawImage(stampImg, path.x - stampImg.width / 2, path.y - stampImg.height/2);
                }
            }

            historyContext.globalAlpha = 0.5;
            historyContext.drawImage(strokeImg, 0, 0);
            //historyContext.drawImage(crayonTextureImage, 0, 0, crayonTextureImage.width, crayonTextureImage.height);
            
            historyContext.globalAlpha = 1;
        };

        window.setTimeout(repaint, 100);
    }

    function dispose() {
        main = null;

        save.die();
        save;
    }

    modules["part2"] = {
        init: init,
        dispose: dispose
    }
})();
