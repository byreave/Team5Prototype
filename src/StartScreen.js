import { Scene } from 'phaser';
export default class StartScreen extends Phaser.Scene {
	constructor() {
		super();
		Phaser.Scene.call(this, { key: 'start' });
	}
	preload() {
		this.load.image('startScreen_BG', 'assets/space.png');
		this.load.bitmapFont('d_p', 'assets/font.png', 'assets/font.fnt');

		this.load.atlas('gameTitle', 'assets/GameTitle.png', 'assets/GameTitle.json');
	}

	create() {
		// Create animation resources here
		this.anims.create({
			key: 'gameTitle',
			frames: this.anims.generateFrameNames('gameTitle', {
				prefix: 'GameTitle_',
				end: 141,
				zeroPad: 4
			}),
			repeat: -1
		});

		this.add.image(960, 540, 'startScreen_BG');

		this.add.sprite(960, 300, 'gameTitle').play('gameTitle', true, 0);
		// this.add.bitmapText(850, 450, 'd_p', "Credits: \n\nEngineers: \nByreave Luo, \nMit Doshi. \n\nTech-Art:\nSpencer Wang. \n\nArt:\nDani Powers. \n\nProducer:\nLis Moberly. ", 18, 1);
		this.add.bitmapText(800, 540, 'd_p', 'Press Start', 25, 1);
		// console.log(this.input.keyboard.createCursorKeys());
		this.input.once(
			'pointerdown',
			function(event) {
				// console.log(event);
				// if(event.key)
				this.scene.start('game');
			},
			this
		);
	}

	update(timestep, delta) {}
}
