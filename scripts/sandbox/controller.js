Core.registerModule("controller", function(sandBox) {
	
	var moduleMap = {
		"start": ["drawShape", "crayon", "brushSize", "home"],
		"drawShape": ["drawShape", "crayon", "brushSize"],
		"drawPicture": ["drawPicture", "crayon", "brushSize", "undo", "pieMenu", "stamp"],
		"painting": ["painting", "crayon", "brushSize", "undo", "pieMenu"],
		"blackboard": ["blackboard", "chalk", "brushSize", "undo", "pieMenu"]
	};
	var currentModule = null;

	return {
		init: function() {
			var startModules = moduleMap["start"];
			for(var i = 0; i < startModules.length; i++) {
				Core.start(startModules[i]);
			}
			currentModule = "start";

			sandBox.listen({"drawShapeFinish": this.drawShapeFinish});
			sandBox.listen({"openPainting": this.openPainting});
			sandBox.listen({"home": this.home});
			sandBox.listen({"openBlackboard": this.openBlackboard});
		},

		drawShapeFinish: function(evtObj) {
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
			
		},
		
		destroy: function() {}
	};
});