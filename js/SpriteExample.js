class SpriteExample {
    constructor() {
        this.elapsedTime = 0;
        this.lastCreatedTime = 0;
        this.afterCreating = false;
        this.preload = () => {
            this.game.load.image('bullet', 'img/bullet.png');
            console.log(this.game.time);
        };
        this.update = () => {
            this.elapsedTime += this.game.time.desiredFpsMult;
            if (this.elapsedTime - this.lastCreatedTime > 1) {
                var b = new Bullet(this.game);
                this.game.add.existing(b);
                this.lastCreatedTime = this.elapsedTime;
            }
        };
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'ksf-view', { preload: this.preload, create: this.create,
            update: this.update });
        this.elapsedTime = 0;
        console.log("elapsedTime", this.elapsedTime);
    }
    create() {
        console.log(this, "at create");
    }
}
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}
class MyPoint {
    constructor() {
    }
}
class Bullet extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, 'bullet');
        this.game = game;
        this.randomAngle = randomRange(0, 3.14 * 2);
        this.velocity = randomRange(80, 160);
        this.position.x = 400 + Math.cos(this.randomAngle) * 400;
        this.position.y = 300 + Math.sin(this.randomAngle) * 400;
        this.theta = 3.14 + this.randomAngle;
    }
    update() {
        this.position.x += Math.cos(this.theta) * this.velocity * this.game.time.desiredFpsMult;
        this.position.y += Math.sin(this.theta) * this.velocity * this.game.time.desiredFpsMult;
        if (1000 <= this.position.x || this.position.x <= -300) {
            this.destroy();
        }
    }
}
