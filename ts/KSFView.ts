/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/> 
/// <reference path="KSFInfo.ts"/>

var $, jQuery;
$ = jQuery = require('jquery');


interface Observer { 
     reflectData(); 
} 

class Arrow extends Phaser.Sprite {
    game:Phaser.Game;
    // position:MyPoint;
    theta:number;
    public constructor(game:Phaser.Game, arrow:string) { 
        super(game, 0, 0, arrow);
        this.game = game;
        // this.anchor.x = 0;
        this.anchor.y = 0;
    }

    public update() { 
    }
} 
class KSFView implements Observer{
    game:Phaser.Game;
    arrowSize:number = 16;
    ksfinfo:KSFInfo = null;
    index2Coord:object = {};
    index2Column:object = {};
    columns:number = 1;
    coord2index:object = {};
    selBegin:number = 0;
    selEnd:number = 0;
    selector:Phaser.Graphics;
    arrows:Phaser.Group;
    lines:Phaser.Group;
    cops:Phaser.Group;
    selections:Phaser.Group; 
    public reflectData() {
        $('#ksf-title').attr("value", this.ksfinfo.title);
        $('#ksf-bpm').attr("value", this.ksfinfo.bpm1);
        $('#ksf-tickcount').attr("value", this.ksfinfo.tickCount);
        $('#ksf-starttime').attr("value", this.ksfinfo.startTime); 

        this.redraw();
    }

    public getCurrentPosition() {
        // get current position = cur / total
    }

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 
            'ksf-view', 
            { preload: this.preload, create:this.create,
                update:this.update });

    }
    public preload = () => {
        this.game.load.image('1', 'img/1.png'); 
        this.game.load.image('3', 'img/3.png'); 
        this.game.load.image('5', 'img/5.png'); 
        this.game.load.image('7', 'img/7.png'); 
        this.game.load.image('9', 'img/9.png'); 
        this.game.load.image('cop', 'img/cop.png'); 
        this.game.load.image('selcop', 'img/cop2.png'); 
    } 
    public create = () => {
        // this.game.add.existing(b);
        this.game.stage.backgroundColor = '#FFFFFF';

        this.selections = this.game.add.group();
        this.lines = this.game.add.group();
        this.arrows = this.game.add.group();
        this.cops = this.game.add.group();
    }
    public update = () => {
    }
    public resize = () => {
        if(this.ksfinfo != null) {
            this.redraw();
        }
    }

    public keyUp = (e) => {
        var ksfViewDom = $('#ksf-view')[0];
        var maxScrollLeft = ksfViewDom.scrollWidth - ksfViewDom.clientWidth;

        if(e.key == "ArrowDown") {
            var changeIndex;
            if(e.shiftKey == true) {
                changeIndex = this.selEnd;
            }
            else{
                changeIndex = this.selBegin;
            }
            changeIndex++;

            if(e.shiftKey == true) {
                this.selEnd = changeIndex;
            }
            else{
                this.selBegin = changeIndex;
                this.selEnd = this.selBegin;
            }
            this.drawSelection();
        }
        if(e.key == "ArrowUp") {
            var changeIndex;
            if(e.shiftKey == true) {
                changeIndex = this.selEnd;
            }
            else{
                changeIndex = this.selBegin;
            }
            changeIndex--;

            if(e.shiftKey == true) {
                this.selEnd = changeIndex;
            }
            else{
                this.selBegin = changeIndex;
                this.selEnd = this.selBegin;
            }
            this.drawSelection();
        }
        if(e.key == "ArrowLeft") {
            var changeIndex;
            if(e.shiftKey == true) {
                changeIndex = this.selEnd;
            }
            else{
                changeIndex = this.selBegin;
            }

            var prevY = this.index2Coord[changeIndex].y;
            var prevX = this.index2Coord[changeIndex].x;
            var minDiffY = 9999999;
            var goalIndex = changeIndex;

            for(let i=changeIndex - 1; i>=0;i--) {
                var diffY = Math.abs(this.index2Coord[i].y - prevY);
                if(this.index2Coord[i].x != prevX){
                    if(minDiffY > diffY) {
                        minDiffY = diffY; 
                        goalIndex = i;
                    }
                    else{ 
                        break;
                    } 
                } 
            }
            if(e.shiftKey == true) {
                this.selEnd = goalIndex;
            }
            else{
                this.selBegin = goalIndex;
                this.selEnd = this.selBegin;
            }
            this.drawSelection();
        }
        if(e.key == "ArrowRight") {
            var changeIndex;
            if(e.shiftKey == true) {
                changeIndex = this.selEnd;
            }
            else{
                changeIndex = this.selBegin;
            }

            var prevY = this.index2Coord[changeIndex].y;
            var prevX = this.index2Coord[changeIndex].x;
            var minDiffY = 9999999;
            var goalIndex = changeIndex;

            for(let i=changeIndex + 1; i<this.ksfinfo.steps.length; i++) {
                var diffY = Math.abs(this.index2Coord[i].y - prevY);
                if(this.index2Coord[i].x != prevX){
                    if(minDiffY > diffY) {
                        minDiffY = diffY; 
                        goalIndex = i;
                    }
                    else{ 
                        break;
                    } 
                } 
            }
            if(e.shiftKey == true) {
                this.selEnd = goalIndex;
            }
            else{
                this.selBegin = goalIndex;
                this.selEnd = this.selBegin;
            }
            this.drawSelection();
        } 
        // console.log(this.selEnd, "..", this.index2Column[this.selEnd], "/", this.columns);
        console.log(e);
        var prevScrollLeft = $('#ksf-view').scrollLeft();
        while( this.index2Coord[this.selEnd].x + this.arrowSize * 11 > prevScrollLeft + ksfViewDom.clientWidth ) {
            $('#ksf-view').scrollLeft($('#ksf-view').scrollLeft() + 1);
            prevScrollLeft = $('#ksf-view').scrollLeft(); 
        }

        prevScrollLeft = $('#ksf-view').scrollLeft();
        while( this.index2Coord[this.selEnd].x < prevScrollLeft) {
            $('#ksf-view').scrollLeft($('#ksf-view').scrollLeft() - 1);
            prevScrollLeft = $('#ksf-view').scrollLeft();
        } 
    }

    public redraw = () => {
        this.arrows.removeAll();
        this.lines.removeAll(); 
        this.cops.removeAll();
        this.selections.removeAll();
        // this.game.world.removeAll();
        var xCount = this.drawKSF();
        this.drawLines(xCount);
        this.selector = this.game.add.graphics(0, 0);
        // this.selector.blendMode = PIXI.blendModes.NORM;
        this.selections.add(this.selector);
        this.drawSelection();
        this.game.scale.setGameSize(this.game.scale.width, $( window ).height() - 170);
        // this.selector.lineStyle(10, 0xFF0000, 0.8);
    }

    public drawLine = (x, y, color) => { 
        x += this.arrowSize;
        let line = new Phaser.Line(x, y, x + this.arrowSize * 10, y);
        let graphicsLine = new Phaser.Graphics(this.game, 0, 0);
        this.lines.add(graphicsLine);

        graphicsLine.clear();
        graphicsLine.lineStyle(1, color, 1);
        graphicsLine.moveTo(line.start.x, line.start.y);
        graphicsLine.lineTo(line.end.x, line.end.y);
        graphicsLine.endFill(); 
    }

    public drawArrow = (x, y, unitStep) => {
        x += this.arrowSize;
        let offsetToArrow = {
            0:'1',
            1:'7',
            2:'5',
            3:'9',
            4:'3',
            5:'1',
            6:'7',
            7:'5',
            8:'9',
            9:'3'};
        for(let offset=0; offset<unitStep.length; offset++) {
            if(unitStep[offset] == '1' || unitStep[offset] == '4' || 0) {
                let arrow:Arrow = new Arrow(this.game, offsetToArrow[offset]);
                this.arrows.add( arrow ); 
                arrow.position.x = x + offset * this.arrowSize;
                arrow.position.y = y; 
            }
        } 
    }

    public drawCOP = (x, y, unitCOP) => {
        if(unitCOP.length >= 1){
            // let cop = new Phaser.Sprite(
            this.cops.add(this.game.add.sprite(x, y, 'cop'));
        }
    }


    public drawLines(xCount) {
        var numberOfEachRow = Math.floor(this.game.scale.height / this.arrowSize / 4);
        numberOfEachRow--;
        var lineCount = numberOfEachRow * xCount;
        console.log(numberOfEachRow);

        var x, y;
        x = 0;
        y = 4 * this.arrowSize;
        for(let i=1; i<=lineCount; i++){
            if(i % 4 == 0){
                this.drawLine(x, y, 0xff0000);
            }
            else{
                this.drawLine(x, y, 0xffaddb);
            }
            y += 4 * this.arrowSize;
            if(i % numberOfEachRow == 0){
                y = 4 * this.arrowSize;
                x += this.arrowSize * 11;
            }
        }
    }
    public drawKSF() { 
        var xCount = 1;
        var y = 0;
        var x = 0;
        var tickCount = this.ksfinfo.tickCount;
        var yMargin = 64.0 / tickCount;
        console.log(yMargin);

        let steps:any = this.ksfinfo.steps;
        console.log("step length = ", steps.length);

        // 64 / n tick

        for(let i=0; i<steps.length; i++) {
            let unitStep = steps[i].unitStep;
            if(i == steps.length - 1){
                console.log(unitStep);
            }
            let unitCOP = steps[i].unitCOP;
            if(y + 4 * this.arrowSize >= this.game.scale.height - this.arrowSize) {
                // this.drawLine2(x, y);
                // this.drawLine(x, y);
                y = 0;
                x += this.arrowSize * 11;
                xCount++;
            } 
            else{ 
            } 
            this.index2Column[i] = xCount;
            this.index2Coord[i] = {x:x, y:y};
            this.coord2index[JSON.stringify({x:x, y:y})] = i;
            this.drawArrow(x, y, unitStep);
            this.drawCOP(x, y, unitCOP);
            // this.drawLine(x, this.game.scale.height);

            let newTick = this.ksfinfo.getTickCount(unitCOP);
            if(newTick != -1){
                yMargin = 64.0 / newTick;
                tickCount = newTick;
            }
            y += yMargin; 
        } 
        console.log("x : ", x);
        console.log(this.coord2index);
        this.game.scale.setGameSize(x + this.arrowSize * 11, this.game.scale.height); 
        return this.columns = xCount;
    }

    public drawSelection() {
        let steps:any = this.ksfinfo.steps;
        this.selector.clear();
        this.selector.beginFill(0xaacbff, 1); 
        var begin, end;
        if(this.selBegin <= this.selEnd) {
            begin = this.selBegin;
            end = this.selEnd;
        }
        else{
            begin = this.selEnd;
            end = this.selBegin;
        }
        for(let i=begin; i<=end; i++){
            var x = this.index2Coord[i].x + this.arrowSize;
            var y = this.index2Coord[i].y;
            this.selector.drawRect(x, y, this.arrowSize * 10, this.arrowSize);
        }

        this.selector.endFill();

    }
    public setKSF(ksfinfo : KSFInfo) {
        this.ksfinfo = ksfinfo; 
        this.selBegin = 0;
    } 
}

