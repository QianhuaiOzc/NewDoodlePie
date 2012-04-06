(function () {

    var container;
    var canvas;

    function init() {
        container = $("#main");

        canvas = $("<canvas></canvas>").appendTo(container);
        canvas.css({
            position: "absolute",
            overflow: "hidden",
            top: "50%",
            left: "50%",
            "z-index": 10
        });
        canvas.attr({
            "width": 512,
            "height": 384 
        });

        var ctx = canvas.get(0).getContext("2d");

        var pieImage = new Image();
        pieImage.src = "images/pie.png";
        var magicImage = new Image();
        var paintImage = new Image();
        var guessImage = new Image();
        var saveImage = new Image();
        var boardImage = new Image();
        
        var isOpenMenu = false;
        var downPoint;
        var upPoint;

        canvas.mousedown(function(e) {
            downPoint = {
                x: e.offsetX,
                y: e.offsetY
            };        
            
            //alert("x: " + downPoint.x + ", y: " + downPoint.y);
        });

        canvas.mouseup(function(e) {
            upPoint = {
                x: e.offsetX,
                y: e.offsetY
            };
            
        });

        var paintPie = function() {
            ctx.fillStyle = "rgba(255, 255, 255, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(pieImage, 200, 195, pieImage.width, pieImage.height);
        };

        setTimeout(paintPie, 100);
    }

    function dispose() {
        container = null;
        canvas = null;
    }

    modules["menu"] = {
        init: init,
        dispose: dispose
    }
})();
