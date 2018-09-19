import Planet from "./Planet.js";
import Moon from "./Moon.js";
import PlanetGenerator from "./PlanetGenerator.js";
import Exit from "./Exit.js";
export default class Level {
    constructor(scene, pos) {
        this.scene = scene;
        this.name;
        this.planets = new Array();
        this.moons = new Map();
        this.exits = new Array();
        this.levelWidth = 1920;
        this.levelHeight = 1080;
        this.centerPoint = pos;
        //this.levels = new Array();
        this.planetGen = new PlanetGenerator(scene);
        //Topology of levels
        this.levelUp = null;
        this.levelLeft = null;
        this.levelRight = null;
        this.levelDown = null;

        this.exitsUp = null;
        this.exitsDown = null;
        this.exitsLeft = null;
        this.exitsRight = null;

    }

    createPlanetsFormJson(file) {
        var data = this.scene.cache.json.get(file);
        this.name = data.name;
        for (var i in data.planets) {
            var p = data.planets[i];
            var x = p.x;
            var y = p.y;
            var displayWidth = p.displayWidth;
            var displayHeight = p.displayHeight;
            var radius = p.radius + Math.floor(Math.random() * p.radiusSpan);
            var name = p.name;
            var texture = p.texture;
            if (p.isTextureRandom) {
                texture = this.planetGen.texturePack[Math.floor(Math.random() * this.planetGen.texturePack.length)];
            }
            this.planets.push(this.planetGen.GenerateOnePlanet(x + this.centerPoint.x, y + this.centerPoint.y, radius, texture, name));
        }
        for (var i in data.moons) {
            var m = data.moons[i];
            var orbit;
            for (var p of this.planets) {
                if (m.orbit == p.name) {
                    orbit = p;
                    break;
                }
            }
            var name = m.name;
            var texture = m.texture;
            var isGolden = m.isGolden;
            var speed = m.speed;
            if (m.isTextureRandom) {
                texture = this.planetGen.moonTexturePack[Math.floor(Math.random() * this.texturePack.length)];
            }
            var startPos = m.startPos;
            if (m.isStartPosRandom)
                startPos = Math.random() * Math.PI * 2;
            var isCCW = m.isCCW;
            if (m.isCCWRandom) {
                if (Math.floor(Math.random() * 2) == 0) {
                    isCCW = true;
                } else {
                    isCCW = false;
                }
            }

            var moon = new Moon(this.scene, orbit, startPos, isCCW, texture, name, speed, isGolden);
            this.moons.set(moon.sprite, moon);//use sprite to tell the moon object, it's easier to tell collision object
        }
        //Exits
        //Up
        if (data.exits.up.On == true && (this.levelUp == null || this.levelUp.exitsDown == null)) { //two levels share an exit, check
            this.exitsUp = new Exit(this.scene, this, 'up', data.exits.up.PlanetTexture, data.exits.up.PlanetRadius, data.exits.up.MoonTexture, data.exits.up.isCCW);
            this.moons.set(this.exitsUp.moon.sprite, this.exitsUp.moon);
            this.exits.push(this.exitsUp);
        } else if (this.levelUp != null && this.levelUp.exitsDown != null) {
            this.exitsUp = this.levelUp.exitsDown;
            this.moons.set(this.exitsUp.moon.sprite, this.exitsUp.moon);
            this.exits.push(this.exitsUp);
        }
        //Down
        if (data.exits.down.On == true && (this.levelDown == null || this.levelDown.exitsUp == null)) {
            this.exitsDown = new Exit(this.scene, this, 'down', data.exits.down.PlanetTexture, data.exits.down.PlanetRadius, data.exits.down.MoonTexture, data.exits.down.isCCW);
            this.moons.set(this.exitsDown.moon.sprite, this.exitsDown.moon);
            this.exits.push(this.exitsDown);
        } else if (this.levelDown != null && this.levelDown.exitsUp != null) {
            this.exitsDown = this.levelDown.exitsUp;
            this.moons.set(this.exitsDown.moon.sprite, this.exitsDown.moon);
            this.exits.push(this.exitsDown);
        }
        //Left left
        if (data.exits.left.On == true && (this.levelLeft == null || this.levelLeft.exitsRight == null)) {
            this.exitsLeft = new Exit(this.scene, this, 'left', data.exits.left.PlanetTexture, data.exits.left.PlanetRadius, data.exits.left.MoonTexture, data.exits.left.isCCW);
            this.moons.set(this.exitsLeft.moon.sprite, this.exitsLeft.moon);
            this.exits.push(this.exitsLeft);
        } else if (this.levelLeft != null && this.levelLeft.exitsRight != null) {
            this.exitsLeft = this.levelLeft.exitsRight;
            this.moons.set(this.exitsLeft.moon.sprite, this.exitsLeft.moon);
            this.exits.push(this.exitsLeft);
        }
        //Right right
        if (data.exits.right.On == true && (this.levelRight == null || this.levelRight.exitsLeft == null)) {
            this.exitsRight = new Exit(this.scene, this, 'right', data.exits.right.PlanetTexture, data.exits.right.PlanetRadius, data.exits.right.MoonTexture, data.exits.right.isCCW);
            this.moons.set(this.exitsRight.moon.sprite, this.exitsRight.moon);
            this.exits.push(this.exitsRight);
        } else if (this.levelRight != null && this.levelRight.exitsLeft != null) {
            this.exitsRight = this.levelRight.exitsLeft;
            this.moons.set(this.exitsRight.moon.sprite, this.exitsRight.moon);
            this.exits.push(this.exitsRight);
        }
    }

    update(delta) {
        //planets
        for (var p of this.planets) {
            p.update(delta);
        }
        //moons
        for (var m of this.moons.values()) {
            m.OrbitUpdate(delta);
        }

        for (var e of this.exits) {
            e.update(delta);
        }
    }
    destroy() {
        for (var p of this.planets) {
            p.destroy();
        }
        this.planets.splice(0, this.planets.length);
        //moons
        for (var m of this.moons.values()) {
            if (m.isExit == false)
                m.destroy();
        }
        this.moons.clear();
        this.exits.splice(0, this.exits.length);
        this.exitsUp = null;
        this.exitsDown = null;
        this.exitsLeft = null;
        this.exitsRight = null;

    }
}
