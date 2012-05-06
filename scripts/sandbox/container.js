Core.registerModule("container", function(sandBox) {
	var container = null;
	var moduleMap = {
		"start": ["info", "drawShape", "crayon", "brushSize", "home", "pieMenu"],
		"drawShape": ["drawShape", "crayon", "brushSize", "pieMenu"],
		"drawPicture": ["drawPicture", "crayon", "brushSize", "undo", "pieMenu", "stamp"],
		"painting": ["painting", "crayon", "brushSize", "undo", "pieMenu"],
		"blackboard": ["blackboardCanvas", "chalk", "brushSize", "undo", "pieMenu"],
		"solo": ["solo", "crayon", "brushSize", "undo", "pieMenu", "stamp"],
		"magic": ["kaleidoscope", "crayon", "brushSize", "pieMenu","magicType","undo"],
		"game": ["game", "pieMenu"]
	};
	var currentModule = null;
	var stateInfo = {
		level: 1, drawFinished: 0, picFinished: 0, fillFinished: false, guessFinished: false, bboardFinished: false,
		firstDate: null
	};

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
		sandBox.notify({"type": "currentLevel", "data": stateInfo.level});
	};

	var updateLevel = function() {
		var si = stateInfo;
		if(si.drawFinished >= 2 && si.picFinished >= 3 && si.guessFinished == true) {
			si.level = 2;
		}
		if(si.drawFinished >= 3 && si.picFinished >= 5 && si.fillFinished == true) {
			si.level = 3;
		}
		if(si.level == 3 && si.drawFinished >= 7 && si.bboardFinished == true) {
			si.level = 4;
		}
		// console.log("save");
		sandBox.notify({"type": "currentLevel", "data": si.level});
		localStorage.setItem("state", JSON.stringify(si));
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
			// currentModule = "drawShape";

			currentModule = "start";

			var oldLevel = localStorage.getItem("state");
			if(oldLevel != null) {
				stateInfo = JSON.parse(oldLevel);
			}
			sandBox.notify({"type": "currentLevel", "data": stateInfo.level});
			sandBox.listen({"drawShapeFinish": this.drawShapeFinish,
				"openPainting": this.openPainting,
				"home": this.home,
				"openBlackboard": this.openBlackboard,
				"openGuess": this.openGuess,
				"openMagic":this.openMagic,
				"gameFinish": this.gameFinish,
				"finishOnePic": this.incrPic,
				"fillFinish": this.finishFill,
				"openSolo": this.openSolo,
				"blackboardFinish": this.finishBlackboard});
		},

		finishBlackboard: function() {
			stateInfo.bboardFinished = true;
			updateLevel();
		},

		finishFill: function() {
			stateInfo.fillFinished = true;
			updateLevel();
		},

		incrPic: function() {
			stateInfo.picFinished++;
			updateLevel();
		},

		openGuess: function(evtObj) {
			moduleSwitch("game", currentModule);
		},

		openMagic: function(evtObj) {
			moduleSwitch("magic", currentModule);
		},

		drawShapeFinish: function(evtObj) {
			var nextModule = evtObj.nextModule;
			var data = evtObj.data;
			stateInfo.drawFinished++;
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
			stateInfo.guessFinished = true;
			moduleSwitch("drawShape", currentModule);
			updateLevel();
		},

		openSolo: function() {
			moduleSwitch("solo", currentModule);
		},

		destroy: function() {}
	};
});