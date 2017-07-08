"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const COPEditor = require('electron').remote.require('./COPEditor');
const main = require('electron').remote.require('./main');
require('jquery-ui-dist/jquery-ui.js');
class Arrow extends Phaser.Sprite {
    constructor(game, arrow) {
        super(game, 0, 0, arrow);
        this.game = game;
        this.anchor.y = 0;
    }
    update() {
    }
}
class KSFView {
    constructor() {
        this.arrowSize = 16;
        this.ksfinfo = null;
        this.index2Coord = {};
        this.index2Column = {};
        this.columns = 1;
        this.coord2index = {};
        this.selBegin = 0;
        this.selEnd = 0;
        this.copState = false;
        this.preload = () => {
            this.game.load.image('1', 'img/1.png');
            this.game.load.image('3', 'img/3.png');
            this.game.load.image('5', 'img/5.png');
            this.game.load.image('7', 'img/7.png');
            this.game.load.image('9', 'img/9.png');
            this.game.load.image('cop', 'img/cop.png');
            this.game.load.image('selcop', 'img/cop2.png');
        };
        this.create = () => {
            this.game.stage.backgroundColor = '#FFFFFF';
            this.selections = this.game.add.group();
            this.lines = this.game.add.group();
            this.arrows = this.game.add.group();
            this.cops = this.game.add.group();
        };
        this.update = () => {
        };
        this.resize = () => {
            if (this.ksfinfo != null) {
                this.redraw();
            }
        };
        this.keyUp = (e) => {
            var ksfViewDom = $('#ksf-view')[0];
            var maxScrollLeft = ksfViewDom.scrollWidth - ksfViewDom.clientWidth;
            var tid = null;
            console.log(e);
            if (e.key.includes("Arrow")) {
                if (e.key == "ArrowDown") {
                    var changeIndex;
                    if (e.shiftKey == true) {
                        changeIndex = this.selEnd;
                    }
                    else {
                        changeIndex = this.selBegin;
                    }
                    changeIndex++;
                    if (e.shiftKey == true) {
                        this.selEnd = changeIndex;
                    }
                    else {
                        this.selBegin = changeIndex;
                        this.selEnd = this.selBegin;
                    }
                    this.drawSelection();
                }
                if (e.key == "ArrowUp") {
                    var changeIndex;
                    if (e.shiftKey == true) {
                        changeIndex = this.selEnd;
                    }
                    else {
                        changeIndex = this.selBegin;
                    }
                    changeIndex--;
                    if (e.shiftKey == true) {
                        this.selEnd = changeIndex;
                    }
                    else {
                        this.selBegin = changeIndex;
                        this.selEnd = this.selBegin;
                    }
                    this.drawSelection();
                }
                if (e.key == "ArrowLeft") {
                    var changeIndex;
                    if (e.shiftKey == true) {
                        changeIndex = this.selEnd;
                    }
                    else {
                        changeIndex = this.selBegin;
                    }
                    var prevY = this.index2Coord[changeIndex].y;
                    var prevX = this.index2Coord[changeIndex].x;
                    var minDiffY = 9999999;
                    var goalIndex = changeIndex;
                    for (let i = changeIndex - 1; i >= 0; i--) {
                        var diffY = Math.abs(this.index2Coord[i].y - prevY);
                        if (this.index2Coord[i].x != prevX) {
                            if (minDiffY > diffY) {
                                minDiffY = diffY;
                                goalIndex = i;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (e.shiftKey == true) {
                        this.selEnd = goalIndex;
                    }
                    else {
                        this.selBegin = goalIndex;
                        this.selEnd = this.selBegin;
                    }
                    this.drawSelection();
                }
                if (e.key == "ArrowRight") {
                    var changeIndex;
                    if (e.shiftKey == true) {
                        changeIndex = this.selEnd;
                    }
                    else {
                        changeIndex = this.selBegin;
                    }
                    var prevY = this.index2Coord[changeIndex].y;
                    var prevX = this.index2Coord[changeIndex].x;
                    var minDiffY = 9999999;
                    var goalIndex = changeIndex;
                    for (let i = changeIndex + 1; i < this.ksfinfo.steps.length; i++) {
                        var diffY = Math.abs(this.index2Coord[i].y - prevY);
                        if (this.index2Coord[i].x != prevX) {
                            if (minDiffY > diffY) {
                                minDiffY = diffY;
                                goalIndex = i;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (e.shiftKey == true) {
                        this.selEnd = goalIndex;
                    }
                    else {
                        this.selBegin = goalIndex;
                        this.selEnd = this.selBegin;
                    }
                    this.drawSelection();
                }
                (() => {
                    var prevScrollLeft = $('#ksf-view').scrollLeft();
                    var goalScrollValue = prevScrollLeft;
                    while (this.index2Coord[this.selEnd].x + this.arrowSize * 11 > goalScrollValue + ksfViewDom.clientWidth) {
                        goalScrollValue++;
                    }
                    $('#ksf-view').scrollLeft(goalScrollValue);
                })();
                (() => {
                    var prevScrollLeft = $('#ksf-view').scrollLeft();
                    var goalScrollValue = prevScrollLeft;
                    while (this.index2Coord[this.selEnd].x < goalScrollValue) {
                        goalScrollValue--;
                    }
                    $('#ksf-view').scrollLeft(goalScrollValue);
                })();
            }
            else if (e.key == "End") {
            }
            else if (e.key == " ") {
                $('#dialog').modal({
                    closable: true,
                    onApprove: () => {
                        var t = $('#modal_cop').val();
                        var arrayT = t.split('\n');
                        console.log(arrayT);
                        this.ksfinfo.setCOPwithIndex(this.selEnd, arrayT);
                        console.log(this.ksfinfo.steps);
                        return false;
                    },
                    onHidden: function () {
                    },
                }).modal('show');
                $('#dialog').keydown(function (e) {
                    e.stopPropagation();
                    console.log(e);
                });
            }
        };
        this.redraw = () => {
            this.game.scale.setGameSize(this.game.scale.width, $(window).height() - 170);
            this.arrows.removeAll();
            this.lines.removeAll();
            this.cops.removeAll();
            this.selections.removeAll();
            var xCount = this.drawKSF();
            this.drawLines(xCount);
            this.selector = this.game.add.graphics(0, 0);
            this.selections.add(this.selector);
            this.drawSelection();
        };
        this.drawLine = (x, y, color) => {
            x += this.arrowSize;
            let line = new Phaser.Line(x, y, x + this.arrowSize * 10, y);
            let graphicsLine = new Phaser.Graphics(this.game, 0, 0);
            this.lines.add(graphicsLine);
            graphicsLine.clear();
            graphicsLine.lineStyle(1, color, 1);
            graphicsLine.moveTo(line.start.x, line.start.y);
            graphicsLine.lineTo(line.end.x, line.end.y);
            graphicsLine.endFill();
        };
        this.drawArrow = (x, y, unitStep) => {
            x += this.arrowSize;
            let offsetToArrow = {
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
            for (let offset = 0; offset < unitStep.length; offset++) {
                if (unitStep[offset] == '1' || unitStep[offset] == '4' || 0) {
                    let arrow = new Arrow(this.game, offsetToArrow[offset]);
                    this.arrows.add(arrow);
                    arrow.position.x = x + offset * this.arrowSize;
                    arrow.position.y = y;
                }
            }
        };
        this.drawCOP = (x, y, unitCOP) => {
            if (unitCOP.length >= 1) {
                this.cops.add(this.game.add.sprite(x, y, 'cop'));
            }
        };
        this.game = new Phaser.Game(800, 1000, Phaser.AUTO, 'ksf-view', { preload: this.preload, create: this.create,
            update: this.update });
        $('#main-view').keydown(this.keyUp);
    }
    reflectData() {
        $('#ksf-title').attr("value", this.ksfinfo.title);
        $('#ksf-bpm').attr("value", this.ksfinfo.bpm1);
        $('#ksf-tickcount').attr("value", this.ksfinfo.tickCount);
        $('#ksf-starttime').attr("value", this.ksfinfo.startTime);
        this.redraw();
    }
    getCurrentPosition() {
    }
    drawLines(xCount) {
        var numberOfEachRow = Math.floor(this.game.scale.height / this.arrowSize / 4);
        numberOfEachRow--;
        var lineCount = numberOfEachRow * xCount;
        var x, y;
        x = 0;
        y = 4 * this.arrowSize;
        for (let i = 1; i <= lineCount; i++) {
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
    }
    drawKSF() {
        var xCount = 1;
        var y = 0;
        var x = 0;
        var tickCount = this.ksfinfo.tickCount;
        var yMargin = 32.0 / tickCount;
        console.log(yMargin);
        let steps = this.ksfinfo.steps;
        var numberOfEachRow = Math.floor(this.game.scale.height / this.arrowSize / 4);
        console.log(numberOfEachRow);
        for (let i = 0; i < steps.length; i++) {
            let unitStep = steps[i].unitStep;
            if (i == steps.length - 1) {
            }
            let unitCOP = steps[i].unitCOP;
            if (y >= (numberOfEachRow - 1) * this.arrowSize * 4) {
                console.log("y = ", y);
                y = 0;
                x += this.arrowSize * 11;
                xCount++;
            }
            else {
            }
            this.index2Column[i] = xCount;
            this.index2Coord[i] = { x: x, y: y };
            this.coord2index[JSON.stringify({ x: x, y: y })] = i;
            this.drawArrow(x, y, unitStep);
            this.drawCOP(x, y, unitCOP);
            let newTick = this.ksfinfo.getTickCount(unitCOP);
            if (newTick != -1) {
                yMargin = 64.0 / newTick;
                tickCount = newTick;
            }
            y += yMargin;
        }
        this.game.scale.setGameSize(x + this.arrowSize * 11, this.game.scale.height);
        return this.columns = xCount;
    }
    drawSelection() {
        let steps = this.ksfinfo.steps;
        this.selector.clear();
        this.selector.beginFill(0xaacbff, 1);
        var begin, end;
        if (this.selBegin <= this.selEnd) {
            begin = this.selBegin;
            end = this.selEnd;
        }
        else {
            begin = this.selEnd;
            end = this.selBegin;
        }
        for (let i = begin; i <= end; i++) {
            var x = this.index2Coord[i].x + this.arrowSize;
            var y = this.index2Coord[i].y;
            this.selector.drawRect(x, y, this.arrowSize * 10, this.arrowSize);
        }
        this.selector.endFill();
    }
    loadKSF(ksfinfo) {
        this.ksfinfo = ksfinfo;
        this.redraw();
        this.drawSelection();
    }
    setKSF(ksfinfo) {
        this.ksfinfo = ksfinfo;
        this.selBegin = 0;
    }
}
exports.KSFView = KSFView;
