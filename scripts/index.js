$.extend($.support, { touch: "ontouchend" in document });
$(document).ready(function () {
    if($.support.touch) {
        document.body.addEventListener("touchmove", function(e) {
            e.preventDefault();
        }, false);
        document.body.addEventListener("touchstart", function(evt) {
            evt.preventDefault();
        }, false);   
    }
    Core.start("container");
	// T.init({appkey:801156747});   
});