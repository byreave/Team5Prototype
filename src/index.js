import 'phaser';
import SceneA from './SceneA.js';
import SceneB from './SceneB.js';
import StartScreen from './StartScreen.js';
const config = {
    type: Phaser.AUTO,
    // active: true,
	width: 1920,
	height: 1080,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: {
				scale: 0
			}
		}
	},
    scene: [StartScreen,SceneA, SceneB] 
};

// const configEnd = {
//     type: Phaser.AUTO,
//     // active: false,
// 	width: 1920,
// 	height: 1080,
// 	physics: {
// 		default: 'arcade',
// 		arcade: {
// 			debug: true,
// 			gravity: {
// 				scale: 0
// 			}
// 		}
//     },
// 	scene: SceneB
// }


var game = new Phaser.Game(config);

