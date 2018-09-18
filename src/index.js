import 'phaser';
import SceneA from './SceneA.js';
var config = {
	type: Phaser.AUTO,
	width: 1920,
	height: 1080,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: {
				scale: 0
			}
		}
	},
	scene: SceneA
};

var game = new Phaser.Game(config);
