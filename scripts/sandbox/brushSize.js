Core.registerModule("brushSize", function(sandBox) {
	var brushSizes = [
            { name: "l", value: 20 },
            { name: "m", value: 10 },
            { name: "s", value: 5 }
        ];
    var container = null;
	return {

		init: function() {
			var container = sandBox.container;
			sandBox.show(container);
			sandBox.addClass(container, "brushSize");

			for(var i = 0; i < brushSizes.length; i++) {
				var brush = brushSizes[i];
				var brushDiv = sandBox.createElement("div");
				brushDiv.setAttribute("brushsize", brush.value);
				brushDiv.setAttribute("brushname", brush.name);
				sandBox.addClass(brushDiv, "brush");
				sandBox.css(brushDiv, "left", (60+i*45));

				container.appendChild(brushDiv);

				brushDiv.onclick = this.onclick();
			}

			sandBox.css(container, "background-image", "url(images/brush-l.png)");

			sandBox.notify( {
				"type": "brushSizeChange",
				"data": brushSizes[0].value
			} );
		},

		onclick: function() {
			var parent = this;
			return function(evt) {
				var target = evt.target;
				var brushName = target.getAttribute("brushname");
				console.log("brushName " + brushName);
				sandBox.css(sandBox.container, "background-image", "url(images/brush-" + brushName + ".png)");

				sandBox.notify({
					"type": "brushSizeChange",
					"data": target.getAttribute("brushsize")
				});
			}
		},

		destroy: function() {
			sandBox.hide(container);
		}
	};
});