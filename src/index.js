import 'phaser';
import SceneA from "./SceneA.js"
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade:{
            debug: true,
            gravity:{
                y:30
            }
        }
    },
    scene: SceneA
};

var game = new Phaser.Game(config);

