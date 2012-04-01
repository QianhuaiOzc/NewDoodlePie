var shapesToUse = [ "triangle", "rectangle", "circle" ];
var imagePainted = 0;
var guessFinished = false;
var fillFinished = false;

var refreshLevel = function () {
    if (game.level == 1) {
        if (guessFinished && imagePainted >= 3 && shapesToUse.length <= 1) {
            game.level = 2;

            $("#fill").removeClass("disable").click(function () {
                toggleMenu();
                game.loadModule("fill");
            });

            $("#blackboard").removeClass("disable").lightBox().click(function () {
                toggleMenu();
            });

            $("#magic").removeClass("disable").lightBox().click(function () {
                toggleMenu();
            });
        }
    } else if (game.level == 2) {
        if (fillFinished && imagePainted >= 5 && shapesToUse.length <= 0) {
            game.level == 3;
        }
    }
}

var game = {
    level: 1,

    init: function(main) {
        this._main = main;
        this._frontCanvas = $("<canvas></canvas>").appendTo(main);
        this._backCanvas = $("<canvas></canvas>").appendTo(main);
        this._frontCanvas.css({
            position: "absolute",
            left: 132,
            top: 120,
            "z-index": 2
        });
        this._frontCanvas.attr({
            width: 800,
            height: 600
        });
        this._backCanvas.css({
            position: "absolute",
            left: 132,
            top: 120,
            "z-index": 1
        });
        this._backCanvas.attr({
            width: 800,
            height: 600
        });
        this.loadModule("drawShape");
    },

    loadModule: function (name, args) {
        if (this._currModule) {
            this._currModule.dispose();
        }

        this._currModule = modules[name];
        this._currModule.init({
            main: this._main,
            frontCanvas: this._frontCanvas,
            backCanvas: this._backCanvas,
            argument: args
        });
    },

    shapeUsed: function (name) {
        var index = shapesToUse.indexOf(name);
        if (index >= 0) {
            shapesToUse.splice(index, 1);
            refreshLevel();
        }
    },

    imagePainted: function () {
        imagePainted++;
        refreshLevel();
    },

    guessFinished: function () {
        guessFinished = true;
        refreshLevel();
    },

    fillFinished: function () {
        fillFinished = true;
        refreshLevel();
    }
}

var modules = { };
