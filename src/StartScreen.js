import { Scene } from 'phaser';
export default class StartScreen extends Phaser.Scene {
    constructor() {
        super();
        Phaser.Scene.call(this, {key: 'start'});
    }
    preload() {
        this.load.image('StartScreen', 'assets/startscreen.png');
        this.load.bitmapFont('d_p', 'assets/font.png', 'assets/font.fnt');
    }

    create() {
        this.add.image(960, 540, 'StartScreen');
        // this.add.bitmapText(850, 450, 'd_p', "Credits: \n\nEngineers: \nByreave Luo, \nMit Doshi. \n\nTech-Art:\nSpencer Wang. \n\nArt:\nDani Powers. \n\nProducer:\nLis Moberly. ", 18, 1);
        this.add.bitmapText(800, 540, 'd_p', "Press Start", 25, 1);
        // console.log(this.input.keyboard.createCursorKeys());
        this.input.once('pointerdown', function (event) {
            // console.log(event);
            // if(event.key)
            this.scene.start('game');
        }, this);
    }

    update(timestep, delta) {
    }
}