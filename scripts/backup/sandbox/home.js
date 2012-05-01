Core.registerModule("home", function(sandBox) {
	
	var container = null;
	var title = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);

			container.onclick = function() {
				sandBox.notify({
					"type": "home"
				});
			}

			if(sandBox.touchable()) {
				container.addEventListener("touchstart", function(evt) {
					sandBox.notify({
						"type": "home"
					});
				});
			}
		},
		destroy: function() {}
	};
});