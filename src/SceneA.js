
import Player from "./Player.js";
import Planet from "./Planet.js";
import * as dat from "dat.gui"
import PlanetGenerator from "./PlanetGenerator.js"
import Moon from "./Moon.js";
    
export default class SceneA extends Phaser.Scene {
    constructor() {
      super();
      this.level = 0;
    }

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        //this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        //this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });

        // Read sprites from the atlas
        this.load.atlas('gems', '_LocalAssets/gems.png', '_LocalAssets/gems.json');
    }

    create ()
    {
        // TEMP: paint gems animation on screen
        this.anims.create({
            key: 'diamond',
            frames: this.anims.generateFrameNames('gems', {prefix:'diamond_', end: 15, zeroPad: 4}),
            repeat: -1
        });
        
        this.planets = new Array();
        this.add.image(400, 300, 'sky');
        var gui = new dat.GUI();
        this.player = new Player(this, 0, 0);
        this.planetGenerator = new PlanetGenerator(this);
        this.planetGenerator.AutoGenerateAScreen();
        //for(var i = 0; i < 5; i ++)
        //{
        //    this.planets.push(new Planet(this, 150 + 110 * i, 50, 50, "Planet" + i.toString()));
        //}
        //this.moon1 = new Moon(this, this.planet1, 0.0);
        //this.moon1.setOrbiting(true);
        var f1 = gui.addFolder('Test');
        f1.add(this.player.sprite.body.velocity, "x").listen();
        f1.add(this.player.sprite.body.velocity, "y").listen();
        f1.add(this.player.sprite, "x").listen();
        f1.add(this.player.sprite, "y").listen();

        f1.add(this.player, "angle").listen();
        f1.add(this.player, "isCCW").listen();

        f1.open();
        this.cameras.main.setBounds(0, 0, 3200, 600);

        console.log(this);
        

        this.add.sprite(400, 100, 'gems').play('diamond');
    }

    update (timestep, delta)
    {
        this.player.update(delta);
        this.player.orbitUpdate(delta);
        //this.moon1.OrbitUpdate(delta);
        for(var p of this.planets)
        {
            p.update(delta);
        }
        this.cameras.main.scrollX = this.player.sprite.x - 400;
    }
}