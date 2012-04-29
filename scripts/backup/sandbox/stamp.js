Core.registerModule("stamp", function(sandBox) {
	var container = null;
	var stampsList = [ "ball", "flower", "heart", "music", "star" ];
	var stampDivList = [], selectedStamp = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			sandBox.addClass(container, "stampList");

			for (var i = 0; i < stampsList.length; i++) {
                var stamp = stampsList[i];

                var stampDiv = sandBox.createElement("div");
                sandBox.addClass(stampDiv, "stamp");
                sandBox.addClass(stampDiv, "unselected");
                sandBox.css(stampDiv, "left", (65 + i * 116));
                sandBox.css(stampDiv, "background", "url(images/stamps/"+stamp+".png) no-repeat");
                stampDiv.setAttribute("stamp", stamp);
                container.appendChild(stampDiv);
    				
                stampDivList.push(stampDiv);
                stampDiv.onclick = this.onclick();
                if(sandBox.touchable()) {
	            	stampDiv.addEventListener("touchstart", this.touchStart());
	        	}
            }

            sandBox.listen( { "colorChange" : this.clearStamp } );
		},

		onclick: function() {
			var parent = this;
			return function(evt) {
				var targetStamp = evt.target;

				if(selectedStamp) {
					sandBox.removeClass(selectedStamp, "selected");
					sandBox.addClass(selectedStamp, "unselected");
				}

				selectedStamp = targetStamp;

				sandBox.removeClass(selectedStamp, "unselected");
				sandBox.addClass(selectedStamp, "selected");

				sandBox.notify({
					"type": "stampChange",
					"data": targetStamp.getAttribute("stamp")
				});
			};
		},

		touchStart: function() {
			var parent = this;
			return function(evt) {
				var targetStamp = evt.target;

				if(selectedStamp) {
					sandBox.removeClass(selectedStamp, "selected");
					sandBox.addClass(selectedStamp, "unselected");
				}

				selectedStamp = targetStamp;

				sandBox.removeClass(selectedStamp, "unselected");
				sandBox.addClass(selectedStamp, "selected");

				sandBox.notify({
					"type": "stampChange",
					"data": targetStamp.getAttribute("stamp")
				});
			};
		},
		clearStamp: function() {
			// console.log("clear stamp");

			if(selectedStamp) {
				sandBox.removeClass(selectedStamp, "selected");
				sandBox.addClass(selectedStamp, "unselected");
			}

			sandBox.notify({
				"type": "stampChange",
				"data": null
			});
		},

		destroy: function() {
			sandBox.hide(container);
			for(var i = 0; i < stampDivList.length; i++) {
				container.removeChild(stampDivList[i]);
			}
		}
	};
});