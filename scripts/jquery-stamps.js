(function ($) {
    var stampsList = [ "ball", "flower", "heart", "music", "star" ];

    var stampTop = 35;
    var stampFirstLeft = 65;
    var stampSpacing = 10;
    var stampHeight = 109;
    var stampWidth = 106;

    var bgLeft = 180;
    var bgTop = -50;
    var bgWidth = 736;
    var bgHeight = 188;

    $.stamp = function(options) {
        var main = options.main;

        var stampDivList = [];
        var selectedStamp;

        var select = function(stampDiv) {
            for(var i = 0; i < stampDivList.length; i++) {
                stampDivList[i].css({"top": stampTop});
            }
            var stamp = stampDiv.attr('stamp');
            if (stamp != selectedStamp) {
                stampDiv.css({"top": stampTop + 20});
                selectedStamp = stamp;
            } else {
                stampDiv.css({"top": stampTop});
                selectedStamp = null;
            }
            options.stampSelected(selectedStamp); 
        }
        
        var bgDiv = $("<div></div>").appendTo(main);
        bgDiv.css({
            "position": "absolute",
            "background": "url('images/stamps/background.png') no-repeat",
            "top": bgTop,
            "height": bgHeight,
            "width": bgWidth,
            "left": bgLeft
        });
        for (var i = 0; i < stampsList.length; i++) {
            var stamp = stampsList[i];

            var stampDiv = $('<div></div>').appendTo(bgDiv);
            stampDiv.attr('stamp', stamp);
            stampDiv.css({
                "position": "absolute",
                "background": "url('images/stamps/"+stamp+".png') no-repeat",
                "top": stampTop,
                "height": stampHeight,
                "width": stampWidth,
                "left": stampFirstLeft + i * (stampWidth + stampSpacing)
            });

            stampDiv.click(function(e) {
                //console.log(obj);
                select($(this));
            });

            stampDivList.push(stampDiv);
        }
    }
     
 
})(jQuery);
