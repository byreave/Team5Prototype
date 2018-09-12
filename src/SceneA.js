
import Player from "./Player.js";
import Planet from "./Planet.js";
import * as dat from "dat.gui"
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
    }

    create ()
    {
        var star1, star2;
        this.add.image(400, 300, 'sky');
        var gui = new dat.GUI();
        var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
        var circle = new Phaser.Geom.Circle(200, 300, 50)
        star1 = this.physics.add.image(400, 300, 'star',null, {frictionAir: 0, isStatic:true});
        star2 = this.physics.add.image(400, 400, 'star',null, {frictionAir: 0, ignoreGravity: true});
        this.player = new Player(this, 200, 300);
        this.planet1 = new Planet(this, 200, 400, 50);
        this.moon = new Moon(this, this.planet1, 0.0);
        this.moon.setSpeed(0.005);
        this.moon.setOrbiting(true);
        var f1 = gui.addFolder('Test');
        f1.add(this.moon.sprite.body.velocity, "x").listen();
        f1.add(this.moon.sprite.body.velocity, "y").listen();
        f1.add(this.moon, "angle").listen();

        f1.open();
        graphics.strokeCircleShape(circle);
    }

    update (timestep, delta)
    {
        this.player.update();
        this.moon.OrbitUpdate(delta);
    }
}