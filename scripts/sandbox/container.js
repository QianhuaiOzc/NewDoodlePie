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
			var stopModules = moduleMap[currentModule];
			for(var i = 0; i < stopModules.length; i++) {
				Core.stop(stopModules[i]);
			}
			var startModules = moduleMap["game"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
			currentModule = "game";
		},

		drawShapeFinish: function(evtObj) {
			sandBox.removeClass(container, "blackboard");
			sandBox.addClass(container, "normal");
			var nextModule = evtObj.nextModule;
			var data = evtObj.data;
			var stopModules = moduleMap["drawShape"];
			for(var i = 0; i < stopModules.length; i++) {
				Core.stop(stopModules[i]);
			}
			var startModules = moduleMap[nextModule];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i], data);
			}
			currentModule = nextModule;
		},

		openPainting: function() {
			sandBox.removeClass(container, "blackboard");
			sandBox.addClass(container, "normal");
			var stopModules = moduleMap[currentModule];
			for(var i = 0; i < stopModules.length; i++) {
				Core.stop(stopModules[i]);
			}
			var startModules = moduleMap["painting"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
			currentModule = "painting";
		},

		home: function() {
			sandBox.removeClass(container, "blackboard");
			sandBox.addClass(container, "normal");
			var stopModules = moduleMap[currentModule];
			for(var i = 0; i < stopModules.length; i++) {
				Core.stop(stopModules[i]);
			}
			var startModules = moduleMap["drawShape"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
			currentModule = "drawShape";
		}, 

		openBlackboard: function() {
			var stopModules = moduleMap[currentModule];
			for(var i = 0; i < stopModules.length; i++) {
				Core.stop(stopModules[i]);
			}
			var startModules = moduleMap["blackboard"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
			sandBox.removeClass(container, "normal");
			sandBox.addClass(container, "blackboard");
			currentModule = "blackboard";
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