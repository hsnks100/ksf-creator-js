"use strict";
var ksfinfo_1 = require("./ksfinfo");
var KSFView = (function () {
    function KSFView() {
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'ksf-view', { preload: this.preload, create: this.create });
    }
    KSFView.prototype.preload = function () {
        console.log("gagme", this.game);
        this.game.load.image('logo', 'phaser.png');
    };
    KSFView.prototype.create = function () {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        new ksfinfo_1.KSFInfo('asdasd');
    };
    KSFView.prototype.loadKSF = function (ksf) {
    };
    return KSFView;
}());
window.onload = function () {
    var game = new KSFView();
    global.ksfView = game;
};
module.exports = KSFView;
//# sourceMappingURL=ksf-view.js.map