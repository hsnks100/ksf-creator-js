var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var $ = require('jquery');
var Arrow = (function (_super) {
    __extends(Arrow, _super);
    function Arrow(game, arrow) {
        var _this = _super.call(this, game, 0, 0, arrow) || this;
        _this.game = game;
        _this.anchor.y = 0;
        return _this;
    }
    Arrow.prototype.update = function () {
    };
    return Arrow;
}(Phaser.Sprite));
var KSFView = (function () {
    function KSFView() {
        var _this = this;
        this.arrowSize = 16;
        this.ksfinfo = null;
        this.index2Coord = {};
        this.coord2index = {};
        this.selectedIndex = 0;
        this.preload = function () {
            _this.game.load.image('1', 'img/1.png');
            _this.game.load.image('3', 'img/3.png');
            _this.game.load.image('5', 'img/5.png');
            _this.game.load.image('7', 'img/7.png');
            _this.game.load.image('9', 'img/9.png');
            _this.game.load.image('cop', 'img/cop.png');
            _this.game.load.image('selcop', 'img/cop2.png');
        };
        this.update = function () {
        };
        this.resize = function () {
            if (_this.ksfinfo != null) {
                var xCount = _this.drawKSF();
                _this.drawLines(xCount);
            }
            _this.game.scale.setGameSize(_this.game.scale.width, $(window).height() - 100);
        };
        this.drawLine = function (x, y, color) {
            x += _this.arrowSize;
            var line = new Phaser.Line(x, y, x + _this.arrowSize * 10, y);
            var graphicsLine = _this.game.add.graphics(0, 0);
            graphicsLine.clear();
            graphicsLine.lineStyle(1, color, 1);
            graphicsLine.moveTo(line.start.x, line.start.y);
            graphicsLine.lineTo(line.end.x, line.end.y);
            graphicsLine.endFill();
        };
        this.drawArrow = function (x, y, unitStep) {
            x += _this.arrowSize;
            var offsetToArrow = {
                0: '1',
                1: '7',
                2: '5',
                3: '9',
                4: '3',
                5: '1',
                6: '7',
                7: '5',
                8: '9',
                9: '3'
            };
            for (var offset = 0; offset < unitStep.length; offset++) {
                if (unitStep[offset] == '1' || unitStep[offset] == '4' || 0) {
                    var arrow = new Arrow(_this.game, offsetToArrow[offset]);
                    _this.game.add.existing(arrow);
                    arrow.position.x = x + offset * _this.arrowSize;
                    arrow.position.y = y;
                }
            }
        };
        this.drawCOP = function (x, y, unitCOP) {
            if (unitCOP.length >= 1) {
                _this.game.add.sprite(x, y, 'cop');
            }
        };
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'ksf-view', { preload: this.preload, create: this.create,
            update: this.update });
    }
    KSFView.prototype.create = function () {
        this.game.stage.backgroundColor = '#FFFFFF';
    };
    KSFView.prototype.drawLines = function (xCount) {
        var numberOfEachRow = Math.floor(this.game.scale.height / this.arrowSize / 4);
        numberOfEachRow--;
        var lineCount = numberOfEachRow * xCount;
        console.log(numberOfEachRow);
        var x, y;
        x = 0;
        y = 4 * this.arrowSize;
        for (var i = 1; i <= lineCount; i++) {
            if (i % 4 == 0) {
                this.drawLine(x, y, 0xff0000);
            }
            else {
                this.drawLine(x, y, 0xffaddb);
            }
            y += 4 * this.arrowSize;
            if (i % numberOfEachRow == 0) {
                y = 4 * this.arrowSize;
                x += this.arrowSize * 11;
            }
        }
    };
    KSFView.prototype.drawKSF = function () {
        this.game.world.removeAll();
        var xCount = 1;
        var y = 0;
        var x = 0;
        var tickCount = this.ksfinfo.tickCount;
        var yMargin = 64.0 / tickCount;
        console.log(yMargin);
        var steps = this.ksfinfo.steps;
        console.log("step length = ", steps.length);
        for (var i = 0; i < steps.length; i++) {
            var unitStep = steps[i].unitStep;
            if (i == steps.length - 1) {
                console.log(unitStep);
            }
            var unitCOP = steps[i].unitCOP;
            if (y + 4 * this.arrowSize >= this.game.scale.height - this.arrowSize) {
                y = 0;
                x += this.arrowSize * 11;
                xCount++;
            }
            else {
            }
            this.index2Coord[i] = { x: x, y: y };
            this.drawArrow(x, y, unitStep);
            this.drawCOP(x, y, unitCOP);
            var newTick = this.ksfinfo.getTickCount(unitCOP);
            if (newTick != -1) {
                yMargin = 64.0 / newTick;
                tickCount = newTick;
            }
            y += yMargin;
        }
        console.log("x : ", x);
        this.game.scale.setGameSize(x + this.arrowSize * 11, this.game.scale.height);
        return xCount;
    };
    KSFView.prototype.loadKSF = function (ksfinfo) {
        this.ksfinfo = ksfinfo;
        var xCount = this.drawKSF();
        this.drawLines(xCount);
        var steps = this.ksfinfo.steps;
        for (var i = 0; i < steps.length; i++) {
            this.drawLine(this.index2Coord[i].x, this.index2Coord[i].y, 0x00ff00);
        }
    };
    return KSFView;
}());
