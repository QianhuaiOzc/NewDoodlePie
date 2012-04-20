Core.registerModule("pieMenu", function(sandBox) {
	var container = null;
	var saveDiv = null, guessDiv = null, fillDiv = null, blackboardDiv = null, magicDiv = null, pieDiv = null;
	var isShow = false;
	var imageDrawed = 0, fillFinished = false, guessFinished = false;

	var hideAll = function() {
		sandBox.hide(saveDiv);
		sandBox.hide(guessDiv);
		sandBox.hide(blackboardDiv);
		sandBox.hide(magicDiv);
		sandBox.hide(fillDiv);
	};

	var showAll = function() {
		sandBox.show(saveDiv);
		sandBox.show(guessDiv);
		sandBox.show(fillDiv);
		sandBox.show(blackboardDiv);
		sandBox.show(magicDiv);
	};

	var refreshLevel = function() {
		
	};

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
			hideAll();

			sandBox.addClass(blackboardDiv, "disable");
			sandBox.addClass(magicDiv, "disable");
			sandBox.addClass(fillDiv, "disable");

			pieDiv.addEventListener("click", this.toggleMenu);
			saveDiv.addEventListener("click", this.notifySave);
			//fillDiv.addEventListener("click", this.notifyPainting);
			//blackboardDiv.addEventListener("click", this.notifyBlackboard);
			guessDiv.addEventListener("click", this.notifyGuess);

			if(sandBox.touchable()) {
	           	pieDiv.addEventListener("touchstart", this.toggleMenu);
	           	saveDiv.addEventListener("touchstart", this.notifySave);
				//fillDiv.addEventListener("touchstart", this.notifyPainting);
				//blackboardDiv.addEventListener("touchstart", this.notifyBlackboard);
				guessDiv.addEventListener("touchstart", this.notifyGuess);	
	        }

	        sandBox.listen( {"finishedDraw": this.finishedDraw} );
	        sandBox.listen( {"fillComplete": this.fillComplete} );
	        sandBox.listen( {"guessComplete": this.guessComplete} );
		},

		finishedDraw: function() {
			imageDrawed++;
			refreshLevel();
		},

		fillComplete: function() {
			fillFinished = true;
			refreshLevel();	
		},

		guessComplete: function() {
			guessFinished = true;
			refreshLevel();
		},

		notifySave: function() {
			sandBox.notify( {
				"type": "save"
			} );
		},

		notifyPainting: function() {
			sandBox.notify({
				"type": "openPainting"
			});
		},

		notifyBlackboard: function() {
			sandBox.notify({
				"type": "openBlackboard"
			});
		},

		notifyGuess: function() {
			sandBox.notify({
				"type": "openGuess"
			});
		},

		toggleMenu: function() {
			if(isShow == true) {
				hideAll();
				isShow = false;
			} else {
				showAll();
				isShow = true;
			}	
		},

		destroy: function() {
			sandBox.hide(container);
		}
	};
});