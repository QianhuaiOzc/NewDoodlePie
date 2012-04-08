Core.registerModule("chalk", function(sandBox) {
	var container = null;
	var chalkList = ["dfdfdf", "96d0d1", "a4efbc", "f1e08f", "f87cd6", "ff7863"];
	var divChalkList = [], selectedChalk = null;
	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);

			for (var i = 0; i < chalkList.length; i++) {
	            var color = chalkList[i];

	            var divPen = sandBox.createElement("div");
	            divPen.setAttribute("chalkcolor", color);
	            sandBox.addClass(divPen, "chalkPen");
	            sandBox.addClass(divPen, "unselected");
	            sandBox.css(divPen, "top", (150+i*80));
	            sandBox.css(divPen, "background-image", "url(images/blackboard/" + i + "_" + color + ".png)");
	            container.appendChild(divPen);
	            divChalkList.push(divPen);
	            divPen.onclick = this.onclick();
	            if(sandBox.touchable()) {
	            	divPen.addEventListener("touchstart", this.touchStart());
	        	}
	        }

	        selectedChalk = divChalkList[0];
	        sandBox.removeClass(selectedChalk, "unselected");
	        sandBox.addClass(selectedChalk, "selected");
	        sandBox.notify({
	        	"type": "chalkChange",
	        	"data": selectedChalk.getAttribute("chalkcolor")
	        });
		},

		onclick: function() {
			var parent = this;
			return function(evt) {
				var chalkPenDiv = evt.target;
				if(selectedChalk) {
					sandBox.removeClass(selectedChalk, "selected");
					sandBox.addClass(selectedChalk, "unselected");
				}

				selectedChalk = chalkPenDiv;

				sandBox.removeClass(selectedChalk, "unselected");
				sandBox.addClass(selectedChalk, "selected");

				sandBox.notify({
					"type": "chalkChange",
					"data": chalkPenDiv.getAttribute("chalkcolor")
				});
			};
		},

		touchStart: function() {
			var parent = this;
			return function(evt) {
				var chalkPenDiv = evt.target;
				if(selectedChalk) {
					sandBox.removeClass(selectedChalk, "selected");
					sandBox.addClass(selectedChalk, "unselected");
				}

				selectedChalk = chalkPenDiv;

				sandBox.removeClass(selectedChalk, "unselected");
				sandBox.addClass(selectedChalk, "selected");

				sandBox.notify({
					"type": "chalkChange",
					"data": chalkPenDiv.getAttribute("chalkcolor")
				});
			};
		},

		destroy: function() {
			sandBox.hide(container);
			for(var i = 0; i < divChalkList.length; i++) {
				container.removeChild(divChalkList[i]);
			}
		}
	};
});