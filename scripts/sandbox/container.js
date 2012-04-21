Core.registerModule("container", function(sandBox) {
	var container = null;
	var moduleMap = {
		"start": ["drawShape", "crayon", "brushSize", "home"],
		"drawShape": ["drawShape", "crayon", "brushSize"],
		"drawPicture": ["drawPicture", "crayon", "brushSize", "undo", "pieMenu", "stamp"],
		"painting": ["painting", "crayon", "brushSize", "undo", "pieMenu"],
		"blackboard": ["blackboardCanvas", "chalk", "brushSize", "undo", "pieMenu"],
		"game": ["game", "pieMenu"]
	};
	var currentModule = null;
	var level = 1, drawFinished = 0, picFinished = 0, 
		fillFinished = false, guessFinished = false, bboardFinished = false;

	var moduleSwitch = function(newModule, oldModule, data) {
		if(oldModule == "blackboard") {
			sandBox.removeClass(container, "blackboard");
			sandBox.addClass(container, "normal");
			var title = sandBox.find("#title");
			sandBox.show(title);
		}
		var stopModules = moduleMap[oldModule];
		var oldLength = stopModules.length;
		for(var i = 0; i < oldLength; i++) {
			Core.stop(stopModules[i]);
		}
		var startModules = moduleMap[newModule];
		var newLength = startModules.length;
		for(var i = 0; i < newLength; i++) {
			Core.start(startModules[i], data);
		}
		currentModule = newModule;
		sandBox.notify({"type": "currentLevel", "data": level});
	};

	var updateLevel = function() {
		if(drawFinished >= 2 && picFinished >= 3 && guessFinished == true) {
			level = 2;
			sandBox.notify({"type": "currentLevel", "data": level});
		}
		if(drawFinished >= 3 && picFinished >= 5 && fillFinished == true) {
			level = 3;
			sandBox.notify({"type": "currentLevel", "data": level});
		}
		if(level == 3 && drawFinished >= 4 && bboardFinished == true) {
			level = 4;
			sandBox.notify({"type": "currentLevel", "data": level});
		}
	};

	return {
		init: function() {
			container = sandBox.container;
			sandBox.addClass(container, "normal");
			sandBox.show(container);
			var startModules = moduleMap["start"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
			currentModule = "start";

			sandBox.listen({"drawShapeFinish": this.drawShapeFinish});
			sandBox.listen({"openPainting": this.openPainting});
			sandBox.listen({"home": this.home});
			sandBox.listen({"openBlackboard": this.openBlackboard});
			sandBox.listen({"openGuess": this.openGuess});
			sandBox.listen({"gameFinish": this.gameFinish});
			sandBox.listen({"finishOnePic": this.incrPic});
			sandBox.listen({"fillFinish": this.finishFill});
			sandBox.listen({"blackboardFinish": this.finishBlackboard});
		},

		finishBlackboard: function() {
			bboardFinished = true;
			updateLevel();
		},

		finishFill: function() {
			fillFinished = true;
			updateLevel();
		},

		incrPic: function() {
			picFinished++;
			updateLevel();
		},

		openGuess: function(evtObj) {
			moduleSwitch("game", currentModule);
		},

		drawShapeFinish: function(evtObj) {
			var nextModule = evtObj.nextModule;
			var data = evtObj.data;
			drawFinished++;
			updateLevel();
			moduleSwitch(nextModule, "drawShape", data);
		},

		openPainting: function() {
			moduleSwitch("painting", currentModule);
		},

		home: function() {
			moduleSwitch("drawShape", currentModule);
		}, 

		openBlackboard: function() {
			moduleSwitch("blackboard", currentModule);
			sandBox.removeClass(container, "normal");
			sandBox.addClass(container, "blackboard");
			var title = sandBox.find("#title");
			sandBox.hide(title);
		},
		
		gameFinish: function() {
			guessFinished = true;
			moduleSwitch("drawShape", currentModule);
			updateLevel();
		},

		destroy: function() {}
	};
});