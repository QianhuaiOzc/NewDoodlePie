(function ($) {

    var colorList = [
        "ffcd9a",
        "fc0400",
        "ff852e",
        "fec900",
        "d1f800",
        "47d329",
        "29d4a3",
        "29b0d2",
        "2859cf",
        "986ad7",
        "c7bbbb",
        "000000",
        "ffffff"
    ];

    var penFirstTop = 4;
    var penHeight = 49;
    var penWidth = 238;
    var penSpacing = 4;
    var penUnselectedLeft = -138;
    var penSelectedLeft = -100;

    var brushTop = 15;
    var brushFirstLeft = 60;
    var brushHeight = 30;
    var brushWidth = 30;
    var brushSpacing = 15;

    $.crayon = function (options) {
        var main = options.main;

        // brush sizes
        var divBrushSize = $("<div> <div></div> <div></div> <div></div> </div>").appendTo(main);
        divBrushSize.css({
            position: "absolute",
            width: 222,
            height: 75,
            left: 0,
            top: 690,
            "z-index": 3
        });

        var brushSizes = [
            { name: "l", value: 20 },
            { name: "m", value: 10 },
            { name: "s", value: 5 }
        ];

        var selectSize = function (size) {
            divBrushSize.css({
                "background-image": "url(images/brush-" + size.name + ".png)"
            });

            options.sizeSelected(size.value);
        };

        divBrushSize.children().each(function (index) {
            $(this).css({
                position: "absolute",
                // border: "1px solid red",
                width: brushWidth,
                height: brushHeight,
                top: brushTop,
                left: brushFirstLeft + index * (brushWidth + brushSpacing)
            });

            $(this).click((function (size) {
                return function () {
                    selectSize(size);
                };
            })(brushSizes[index]));
        })

        selectSize(brushSizes[0]);

        // undo
        var divUndo = $("<div></div>").appendTo(main);
        divUndo.css({
            position: "absolute",
            width: 83,
            height: 62,
            // border: "1px solid red",
            "background-image": "url(images/undo.png)",
            top: 700,
            left: 210,
            "z-index": 3
        });

        divUndo.click(options.undo);

        // reset
        var divReset = $("<div></div>").appendTo(main);
        divReset.css({
            position: "absolute",
            width: 83,
            height: 62,
            // border: "1px solid red",
            "background-image": "url(images/reset.png)",
            top: 700,
            left: 298,
            "z-index": 3
        });

        divReset.click(options.reset);

        // pens
        var divPenList = [];
        var selectedDivPen;

        var select = function (divPen) {
            if (selectedDivPen) {
                selectedDivPen.css("left", penUnselectedLeft);
            }

            selectedDivPen = divPen;

            divPen.css("left", penSelectedLeft);

            var color = divPen.attr("color");
            options.colorSelected(color);
        }

        for (var i = 0; i < colorList.length; i++) {
            var color = colorList[i];

            var divPen = $("<div></div>").appendTo(main);
            divPen.attr("color", color);
            divPen.css({
                "position": "absolute",
                // "background-color": "#" + color,
                "background-image": "url(images/crayon-pens/" + i + "_" + color + ".png)",
                "top": penFirstTop + i * ( penHeight + penSpacing),
                "height": penHeight,
                "width": penWidth,
                "left": penUnselectedLeft
            });

            divPen.click(function () {
                select($(this));
            });

            divPenList.push(divPen);
        }

        select(divPenList[0]);
    }

})(jQuery);
