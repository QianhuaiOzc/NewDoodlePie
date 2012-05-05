Core.registerModule("undo", function(sandBox) {
	
	var container = null;
	var undoDiv = null, resetDiv = null;

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			sandBox.addClass(container, "undoContainer");

			undoDiv = sandBox.createElement("div");
			sandBox.addClass(undoDiv, "undo");

			resetDiv = sandBox.createElement("div");
			sandBox.addClass(resetDiv, "reset");

			container.appendChild(undoDiv);
			container.appendChild(resetDiv);

			undoDiv.onclick = function(e) {
				sandBox.notify({
					"type": "undo"
				});
			};

			resetDiv.onclick = function(e) {
				sandBox.notify({
					"type": "reset"		
				});
			};

			if(sandBox.touchable()) {
	           	undoDiv.addEventListener("touchstart", function(evt) {
	           		sandBox.notify({
						"type": "undo"
					});
	           	});
	           	resetDiv.addEventListener("touchstart", function(evt) {
	           		sandBox.notify({
						"type": "reset"		
					});
	           	});
	        }
		},

		destroy: function() {
			sandBox.hide(container);
			container.removeChild(undoDiv);
			container.removeChild(resetDiv);
		}
	};
});