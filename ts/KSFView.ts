/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/> 
/// <reference path="KSFInfo.ts"/>

var $ = require('jquery');

class Arrow extends Phaser.Sprite {
    game:Phaser.Game;
    // position:MyPoint;
    theta:number;
    public constructor(game:Phaser.Game, arrow:string) { 
        super(game, 0, 0, arrow);
        this.game = game;
    }

    public update() {

        // if(false) {
            // this.destroy();
        // }
    }
} 
class KSFView {
    game:Phaser.Game;
    arrowSize:number = 16;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 
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
    public create() {
        // this.game.add.existing(b);
        this.game.stage.backgroundColor = '#FFFFFF';
    }
    public update = () => {
    }
    public resize = () => {
        this.game.scale.setGameSize(this.game.scale.width, $( window ).height() - 100);
    }

    public drawLine = (x, y) => {
        x += this.arrowSize;
        let line = new Phaser.Line(x, y, x + this.arrowSize * 10, y);
        let graphicsLine = this.game.add.graphics(0, 0);
        graphicsLine.clear();
        graphicsLine.lineStyle(1, 0xff0000, 1);
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
            if(unitStep[offset] == '1') {
                let arrow:Arrow = new Arrow(this.game, offsetToArrow[offset]);
                this.game.add.existing(arrow);

                arrow.position.x = x + offset * this.arrowSize;
                arrow.position.y = y; 
            }
        } 
    }

    public drawCOP = (x, y, unitCOP) => {
        if(unitCOP.length >= 1){
            // let cop = new Phaser.Sprite(
            this.game.add.sprite(x, y, 'cop');
        }
    }

    public loadKSF(ksfinfo : KSFInfo) {
        console.log(ksfinfo);


        var y = 0;
        var x = 0;
        var yMargin = this.arrowSize;
        var tickCount = ksfinfo.tickCount;

        let steps:any = ksfinfo.steps;

        for(let i=0; i<steps.length; i++){
            let unitStep = steps[i].unitStep;
            let unitCOP = steps[i].unitCOP;
            if( i % tickCount == 0 && y != 0) { 
                this.drawLine(x, y);
            }
            this.drawArrow(x, y, unitStep);
            this.drawCOP(x, y, unitCOP);
            y += this.arrowSize;

            if(y + tickCount * this.arrowSize > this.game.scale.height) {
                this.drawLine(x, y);
                y = 0;
                x += this.arrowSize * 11;
            } 
        } 
        this.game.scale.setGameSize(x, this.game.scale.height); 
    }
}

