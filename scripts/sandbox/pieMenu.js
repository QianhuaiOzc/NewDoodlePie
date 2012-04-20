Core.registerModule("pieMenu", function(sandBox) {
	var container = null;
	var saveDiv = null, guessDiv = null, fillDiv = null, blackboardDiv = null, magicDiv = null, pieDiv = null;
	var isShow = false;

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

			// pieDiv.addEventListener("click", this.toggleMenu);
			pieDiv.onclick = this.toggleMenu;
			// pieDiv.addEventListener("touchstart", this.toggleMenu);

			sandBox.addClass(blackboardDiv, "disable");
			sandBox.addClass(magicDiv, "disable");
			sandBox.addClass(fillDiv, "disable");

			pieDiv.addEventListener("click", this.toggleMenu);
			//saveDiv.addEventListener("click", this.notifySave);
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
				
			// saveDiv.addEventListener("click", this.notifySave);
			saveDiv.onclick = this.notifySave;
			if(sandBox.touchable()) {
	           	// saveDiv.addEventListener("touchstart", this.notifySave);
	           	saveDiv.ontouchstart = this.notifySave;
	           	pieDiv.ontouchstart = this.toggleMenu;
	       	}

	       	sandBox.listen({"currentLevel": this.updateMenu()});

		},

		updateMenu: function() {
			var parent = this;
			return function(level) {
				if(level >= 2) {
					sandBox.removeClass(fillDiv, "disable");
					fillDiv.onclick = parent.notifyPainting;
					fillDiv.ontouchstart = parent.notifyPainting;
					// fillDiv.addEventListener("click", parent.notifyPainting);
					// fillDiv.addEventListener("touchstart", parent.notifyPainting);
				}
				if(level >= 3) {
					sandBox.removeClass(blackboardDiv, "disable");
					blackboardDiv.onclick = parent.notifyBlackboard;
					blackboardDiv.ontouchstart = parent.notifyBlackboard;
					// blackboardDiv.addEventListener("click", parent.notifyBlackboard);
					// blackboardDiv.addEventListener("touchstart", parent.notifyBlackboard);
				}
				if(level >= 4) {
					sandBox.removeClass(magicDiv, "disable");
				}
				console.log(level);	
			};
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