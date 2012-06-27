Core.registerModule("blackboardCanvas", function(sandBox) {
	var container = sandBox.container, blackboardBg = new Image(), pieCanvas = null;

	return {
		
		init: function() {
			sandBox.show(container);

			blackboardBg.src = "images/blackboard/blackboard-canvas-bg.jpg";

			pieCanvas = new PieCanvas(container, {"background": blackboardBg, "touchable": sandBox.touchable(), "blackground_alpha": 1.0});

			sandBox.listen( { "undo": pieCanvas.undo,
				"reset": pieCanvas.reset,
				"chalkChange": pieCanvas.changeColor,
				"brushSizeChange": pieCanvas.changeSize,
				"check": this.check} );

		},

		check: function() {
			var imageUrl = pieCanvas.getImageURL();
			if(pieCanvas.hasCheck() === false) {
				sandBox.notify({"type": "finishOnePic"});
				pieCanvas.check();
			}
			sandBox.saveImageFile(imageUrl, function(imageUrl) {
				sandBox.notify({"type": "imageSave", "data": imageUrl});
			});
		},

		destroy: function() {
			sandBox.hide(container);
			container.innerHTML = "";
			pieCanvas = null;
		}
	};
});