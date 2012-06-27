Core.registerModule("solo", function(sandBox) {
	var container = sandBox.container, textureImage = new Image(),
		stampList = ["ball", "flower", "heart", "music", "star"], stampImgs = [],
		pieCanvas = null;

	return {
		
		init: function() {
			sandBox.show(container);

			textureImage.src = "images/crayon-texture.png";

			for(var i = 0; i < stampList.length; i++) {
	            var stampImage = new Image();
	            var imgPath = stampList[i];
	            stampImage.src = "images/stamps/"+stampList[i]+"1.png";
	            stampImgs[imgPath] = stampImage;
	        }

	        pieCanvas = new PieCanvas(container, {"texture": textureImage, "stamps": stampImgs, "touchable": sandBox.touchable()});

			sandBox.listen( { "undo": pieCanvas.undo,
				"reset": pieCanvas.reset,
				"colorChange": pieCanvas.changeColor,
				"stampChange": pieCanvas.changeStamp,
				"brushSizeChange": pieCanvas.changeSize,
				"check": this.check } );
		},

		check: function() {
			var imageUrl = pieCanvas.getImageURL();
			sandBox.saveImageFile(imageUrl, function(imageUrl) {
				sandBox.notify({"type": "imageSave", "data": imageUrl});
			});
		},

		destroy: function() {
			sandBox.hide(container);
			container.innerHTML = "";
			pieCanvas = null;
			sandBox.ignore("save");
		}
	};
});