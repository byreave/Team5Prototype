import { Scene } from 'phaser';
export default class SceneB extends Phaser.Scene {
    constructor() {
        super();
        Phaser.Scene.call(this, { key: 'end' });
    }
    preload() {
        this.load.image('EndScreen', 'assets/endscreen.png');
        this.load.bitmapFont('d_p', 'assets/font.png', 'assets/font.fnt');
    }

    create() {
        this.add.image(960, 540, 'EndScreen');
        // this.add.bitmapText(100, 450, 'd_p', "Credits: \n\nEngineers: \nByreave Luo, \nMit Doshi. \n\nTech-Art:\nSpencer Wang. \n\nArt:\nDani Powers. \n\nProducer:\nLis Moberly. ", 18, 1);
        this.add.bitmapText(1500, 950, 'd_p', "Press Start", 25, 1);
        // console.log(this.input.keyboard.createCursorKeys());
        this.input.once('pointerdown', function (event) {
            // console.log(event);
            // if(event.key)
            // this.scene.pause('end');
            // this.start = this.scene.get('game');
            // this.start.scene.restart();
            this.scene.start('game');
        }, this);
    }

    update(timestep, delta) {
    }
}