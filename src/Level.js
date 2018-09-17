import Planet from "./Planet.js";
import Moon from "./Moon.js";
import PlanetGenerator from "./PlanetGenerator.js";
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

            var moon = new Moon(this.scene, orbit, startPos, isCCW, texture, name);
            this.moons.set(moon.sprite, moon);//use sprite to tell the moon object, it's easier to tell collision object
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
    }
}
