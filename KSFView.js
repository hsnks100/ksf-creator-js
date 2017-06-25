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
var KSFView = (function () {
    function KSFView() {
        var _this = this;
        this.elapsedTime = 0;
        this.lastCreatedTime = 0;
        this.afterCreating = false;
        this.preload = function () {
            _this.game.load.image('bullet', 'img/bullet.png');
            console.log(_this.game.time);
        };
        this.update = function () {
            _this.elapsedTime += _this.game.time.desiredFpsMult;
            if (_this.elapsedTime - _this.lastCreatedTime > 1) {
                var b = new Bullet(_this.game);
                _this.game.add.existing(b);
                _this.lastCreatedTime = _this.elapsedTime;
            }
        };
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'ksf-view', { preload: this.preload, create: this.create,
            update: this.update });
        this.elapsedTime = 0;
        console.log("elapsedTime", this.elapsedTime);
    }
    KSFView.prototype.create = function () {
        console.log(this, "at create");
    };
    return KSFView;
}());
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}
var MyPoint = (function () {
    function MyPoint() {
    }
    return MyPoint;
}());
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(game) {
        var _this = _super.call(this, game, 0, 0, 'bullet') || this;
        _this.game = game;
        _this.randomAngle = randomRange(0, 3.14 * 2);
        _this.velocity = randomRange(80, 160);
        _this.position.x = 400 + Math.cos(_this.randomAngle) * 400;
        _this.position.y = 300 + Math.sin(_this.randomAngle) * 400;
        _this.theta = 3.14 + _this.randomAngle;
        return _this;
    }
    Bullet.prototype.update = function () {
        this.position.x += Math.cos(this.theta) * this.velocity * this.game.time.desiredFpsMult;
        this.position.y += Math.sin(this.theta) * this.velocity * this.game.time.desiredFpsMult;
        if (1000 <= this.position.x || this.position.x <= -300) {
            this.destroy();
        }
    };
    return Bullet;
}(Phaser.Sprite));
//# sourceMappingURL=KSFView.js.map