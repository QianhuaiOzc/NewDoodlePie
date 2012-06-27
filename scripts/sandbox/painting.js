Core.registerModule("painting", function(sandBox) {
	var container = sandBox.container, backgroundImg = new Image(), pieCanvas = null;

	return {
		
		init: function() {
			sandBox.show(container);
			backgroundImg.src = "images/fill-background.png"
			pieCanvas = new PieCanvas(container, {"background": backgroundImg, "touchable": sandBox.touchable()});
			sandBox.listen( { "undo": pieCanvas.undo ,
				"reset": pieCanvas.reset,
				"colorChange": pieCanvas.changeColor,
				"brushSizeChange": pieCanvas.changeSize,
				"check": this.check} );
		},

		check: function() {
			sandBox.notify({"type": "fillFinish"});
			var imageUrl = pieCanvas.getImageURL();
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