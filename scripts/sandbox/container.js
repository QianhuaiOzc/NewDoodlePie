Core.registerModule("container", function(sandBox) {
	var container = null;
	var moduleMap = {
		"start": ["drawShape", "crayon", "brushSize", "home"],
		"drawShape": ["drawShape", "crayon", "brushSize"],
		"drawPicture": ["drawPicture", "crayon", "brushSize", "undo", "pieMenu", "stamp"],
		"painting": ["painting", "crayon", "brushSize", "undo", "pieMenu"],
		"blackboard": ["blackboardCanvas", "chalk", "brushSize", "undo", "pieMenu"],
		"game": ["game"]
	};
	var currentModule = null;

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
		},

		openGuess: function(evtObj) {
			moduleSwitch("game", currentModule);
		},

		drawShapeFinish: function(evtObj) {
			var nextModule = evtObj.nextModule;
			var data = evtObj.data;
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
			var stopModules = moduleMap[currentModule];
			for(var i = 0; i < stopModules.length; i++) {
				Core.stop(stopModules[i]);
			}
			var startModules = moduleMap["drawShape"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
		},

		destroy: function() {}
	};
});