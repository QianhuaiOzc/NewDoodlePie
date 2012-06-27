Core.registerModule("drawPicture", function(sandBox, backgroundImgSrc) {
	
	var container = sandBox.container, textureImage = new Image(), backgroundImg = new Image(),
		stampList = ["ball", "flower", "heart", "music", "star"], stampImgs = [],
		pieCanvas = null;

	return {
		
		init: function() {
			sandBox.show(container);

			textureImage.src = "images/crayon-texture.png";
			backgroundImg.src = backgroundImgSrc + ".png"

			for(var i = 0; i < stampList.length; i++) {
	            var stampImage = new Image();
	            var imgPath = stampList[i];
	            stampImage.src = "images/stamps/"+imgPath+"1.png";
	            stampImgs[imgPath] = stampImage;
	        }

			pieCanvas = new PieCanvas(container, {"texture": textureImage, "background": backgroundImg, "stamps": stampImgs, "touchable": sandBox.touchable()});
			sandBox.listen( { "undo": pieCanvas.undo,
				"reset": pieCanvas.reset,
				"stampChange": pieCanvas.changeStamp,
				"colorChange": pieCanvas.changeColor,
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
			sandBox.ignore("save");
		}
	};
});