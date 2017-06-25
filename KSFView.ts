/// <reference path="node_modules/phaser/typescript/phaser.d.ts"/> 
/// <reference path="KSFInfo.ts"/>

// class KSFView {
    // constructor() {
        // this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'ksf-view', { preload: this.preload, create: this.create });
    // }

    // game: Phaser.Game;

    // public preload () {
        // console.log("newlog", this.game);
        // this.game.load.image('logo', 'phaser.png');
    // }

    // public create() {
        // var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        // logo.anchor.setTo(0.5, 0.5);
        // // new KSFInfo('asdasd');
    // }
    // public loadKSF(ksf : KSFInfo) {
        // console.log(ksf); 
    // } 
// }


class KSFView {
    elapsedTime:number = 0;
    lastCreatedTime:number = 0;
    game: Phaser.Game;
    afterCreating : boolean = false;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 
            'ksf-view', 
            { preload: this.preload, create:this.create,
                update:this.update });

        this.elapsedTime = 0;
        console.log("elapsedTime", this.elapsedTime);
    }
    public preload = () => {
        this.game.load.image('bullet', 'img/bullet.png'); 
        console.log(this.game.time);
        // this.game.load.image('logo', 'phaser.png');
    } 
    public create() {
        console.log(this, "at create");
    }
    public update = () => {
        this.elapsedTime += this.game.time.desiredFpsMult;
        if (this.elapsedTime - this.lastCreatedTime > 1){
            var b = new Bullet(this.game);
            this.game.add.existing(b);
            this.lastCreatedTime = this.elapsedTime; 
        } 
    }
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}
class MyPoint {
    public x:number;
    public y:number;
    constructor() {
    }
}
class Bullet extends Phaser.Sprite {
    // Phaser.Sprite.call(this, game, 0, 0, 'bullet');
    velocity:number;
    randomAngle:number;
    game:Phaser.Game;
    // position:MyPoint;
    theta:number;
    public constructor(game:Phaser.Game) { 
        super(game, 0, 0, 'bullet');
        this.game = game;
        this.randomAngle= randomRange(0, 3.14*2);
        this.velocity= randomRange(80, 160); 
        this.position.x = 400 + Math.cos(this.randomAngle) * 400;
        this.position.y = 300 + Math.sin(this.randomAngle) * 400;
        this.theta= 3.14 + this.randomAngle;
    }

    public update() {
        this.position.x += Math.cos(this.theta) * this.velocity * this.game.time.desiredFpsMult;
        this.position.y += Math.sin(this.theta) * this.velocity * this.game.time.desiredFpsMult;

        if(1000 <= this.position.x || this.position.x <= -300){
            this.destroy();
        }
    }
}










