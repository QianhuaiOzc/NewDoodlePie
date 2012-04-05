Core.registerModule("crayon", function(sandBox) {
	
	var container = null;

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

    var divPenList = [], selectedDivPen = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);

			for (var i = 0; i < colorList.length; i++) {
	            var color = colorList[i];

	            var divPen = sandBox.createElement("div");
	            divPen.setAttribute("color", color);
	            sandBox.addClass(divPen, "crayonPen");
	            sandBox.addClass(divPen, "unselected");
	            sandBox.css(divPen, "top", (4+i*53));
	            sandBox.css(divPen, "background-image", "url(images/crayon-pens/" + i + "_" + color + ".png)");
	            container.appendChild(divPen);
	            divPenList.push(divPen);
	            divPen.onclick = this.onclick();
	            if(sandBox.touchable()) {
	            	divPen.addEventListener("touchstart", this.touchStart());
	        	}
	        }
	        selectedDivPen = divPenList[0];

	        sandBox.listen( { "stampChange": this.clearColor } );
	        sandBox.removeClass(selectedDivPen, "unselected");
	        sandBox.addClass(selectedDivPen, "selected");
	        sandBox.notify( {
	        	"type": "colorChange",
	        	"data": colorList[0]
	        } );
		},

		onclick: function() {
			var parent = this;
			return function(evt) {
				var selectedDiv = evt.target;
				if (selectedDivPen) {
					sandBox.removeClass(selectedDivPen, "selected");
					sandBox.addClass(selectedDivPen, "unselected");
	            }

            	selectedDivPen = selectedDiv;

	            sandBox.removeClass(selectedDivPen, "unselected");
	            sandBox.addClass(selectedDivPen, "selected");

				sandBox.notify({
		          	"type": "colorChange", 
		           	"data": selectedDiv.getAttribute("color")
		        });	
			};
		},

		touchStart: function() {
			var parent = this;
			return function(evt) {
				var selectedDiv = evt.target;
				if (selectedDivPen) {
					sandBox.removeClass(selectedDivPen, "selected");
					sandBox.addClass(selectedDivPen, "unselected");
	            }

            	selectedDivPen = selectedDiv;

	            sandBox.removeClass(selectedDivPen, "unselected");
	            sandBox.addClass(selectedDivPen, "selected");

				sandBox.notify({
		          	"type": "colorChange", 
		           	"data": selectedDiv.getAttribute("color")
		        });	
			};
		},

		clearColor: function(stamp) {
			if(stamp != null) {
				sandBox.removeClass(selectedDivPen, "selected");
				sandBox.addClass(selectedDivPen, "unselected");
				// console.log("clear color");	
			}
		},

		destroy: function() {
			sandBox.hide(container);
			for(var i = 0; i < divPenList.length; i++) {
				container.removeChild(divPenList[i]);
			}
		}
	};
});