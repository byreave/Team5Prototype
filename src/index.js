import "phaser";
import SceneA from "./SceneA.js";
var config = {
<<<<<<< HEAD
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    },
    scene: SceneA
=======
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        y: 30
      }
    }
  },
  scene: SceneA
>>>>>>> b3908406098525a803b911877d3c324b505aa63a
};

var game = new Phaser.Game(config);
