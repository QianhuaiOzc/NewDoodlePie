Core.registerModule("pieMenu", function(sandBox) {
	var container = null;
	var saveDiv = null, guessDiv = null, fillDiv = null, blackboardDiv = null, magicDiv = null, pieDiv = null;
	var isShow = false;
	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			saveDiv = sandBox.find("#save");
			guessDiv = sandBox.find("#guess");
			fillDiv = sandBox.find("#fill");
			blackboardDiv = sandBox.find("#blackboard");
			magicDiv = sandBox.find("#magic");
			pieDiv = sandBox.find("#pie");
			sandBox.hide(saveDiv);
			sandBox.hide(guessDiv);
			sandBox.hide(blackboardDiv);
			sandBox.hide(magicDiv);
			sandBox.hide(fillDiv);

			pieDiv.onclick = function() {
				if(isShow == true) {
					sandBox.hide(saveDiv);
					sandBox.hide(guessDiv);
					sandBox.hide(blackboardDiv);
					sandBox.hide(magicDiv);
					sandBox.hide(fillDiv);
					isShow = false;
				} else {
					sandBox.show(saveDiv);
					sandBox.show(guessDiv);
					sandBox.show(fillDiv);
					sandBox.show(blackboardDiv);
					sandBox.show(magicDiv);
					isShow = true;
				}
			};

			saveDiv.onclick = function() {
				sandBox.notify( {
					"type": "save"
				} );
			};

			fillDiv.onclick = function() {
				Core.stopAll();
				Core.start("painting");
				Core.start("crayon");
				Core.start("brushSize");
				Core.start("undo");
				Core.start("pieMenu");
			}
		},

		destroy: function() {
			sandBox.hide(container);
		}
	};
});