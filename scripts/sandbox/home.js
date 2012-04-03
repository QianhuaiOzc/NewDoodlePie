Core.registerModule("home", function(sandBox) {
	
	var container = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);

			container.onclick = function() {
				sandBox.notify({
					"type": "home"
				});
			}
		},
		destroy: function() {}
	};
});