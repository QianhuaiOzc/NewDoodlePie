Core.registerModule("pieMenu", function(sandBox) {
	var container = null;
	var soloDiv = null, guessDiv = null, fillDiv = null, blackboardDiv = null, magicDiv = null, pieDiv = null;
	var isShow = false;

	var hideAll = function() {
		sandBox.hide(soloDiv);
		sandBox.hide(guessDiv);
		sandBox.hide(blackboardDiv);
		sandBox.hide(magicDiv);
		sandBox.hide(fillDiv);
	};

	var showAll = function() {
		sandBox.show(soloDiv);
		sandBox.show(guessDiv);
		sandBox.show(fillDiv);
		sandBox.show(blackboardDiv);
		sandBox.show(magicDiv);
	};

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			soloDiv = sandBox.find("#soloBtn");
			guessDiv = sandBox.find("#guess");
			fillDiv = sandBox.find("#fill");
			blackboardDiv = sandBox.find("#blackboard");
			magicDiv = sandBox.find("#magic");
			pieDiv = sandBox.find("#pie");
			hideAll();

			sandBox.addClass(blackboardDiv, "disable");
			sandBox.addClass(magicDiv, "disable");
			sandBox.addClass(fillDiv, "disable");
			
			guessDiv.onclick = this.notifyGuess;	
			pieDiv.onclick = this.toggleMenu;
			soloDiv.onclick = this.notifySolo;
			magicDiv.onclick = this.notifyMagic;
			if(sandBox.touchable()) {
	           	soloDiv.addEventListener("touchstart", this.notifySolo);
	           	pieDiv.addEventListener("touchstart", this.toggleMenu);
	           	guessDiv.addEventListener("touchstart", this.notifyGuess);
	           	magicDiv.addEventListener("touchstart", this.notifyMagic);
	        }

	       	sandBox.listen({"currentLevel": this.updateMenu()});

		},

		updateMenu: function() {
			var parent = this;
			return function(level) {
				if(level >= 2) {
					sandBox.removeClass(fillDiv, "disable");
					fillDiv.onclick = parent.notifyPainting;
					fillDiv.addEventListener("touchstart", parent.notifyPainting);
				}
				if(level >= 3) {
					sandBox.removeClass(blackboardDiv, "disable");
					blackboardDiv.onclick = parent.notifyBlackboard;
					blackboardDiv.addEventListener("touchstart", parent.notifyBlackboard);
				}
				if(level >= 4) {
					sandBox.removeClass(magicDiv, "disable");
				}
			};
		},

		guessComplete: function() {
			guessFinished = true;
			refreshLevel();
		},

		notifySolo: function() {
			sandBox.notify({
				"type": "openSolo"
			});
		},

		notifyPainting: function() {
			sandBox.notify({
				"type": "openPainting"
			});
		},

		notifyMagic: function() {
			sandBox.notify({
				"type": "openMagic"
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
			soloDiv.removeEventListener("touchstart", this.notifySolo);
	        pieDiv.removeEventListener("touchstart", this.toggleMenu);
	        guessDiv.removeEventListener("touchstart", this.notifyGuess);
	        fillDiv.removeEventListener("touchstart", parent.notifyPainting);
	        blackboardDiv.removeEventListener("touchstart", parent.notifyBlackboard);

		}
	};
});