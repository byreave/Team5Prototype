import Planet from "./Planet.js";
import Moon from "./Moon.js";
import PlanetGenerator from "./PlanetGenerator.js";
export default class Level {
    constructor(scene) {
        this.scene = scene;
        this.planets = new Array();
        this.moons = new Map();
        this.centerPoint;
        this.exits = new Array();
        this.levels = new Array();
        this.planetGen = new PlanetGenerator(scene);
    }

    createPlanetsFormJson(file) {
        var data = this.scene.cache.json.get(file);
        for (var p of data.planets) {
            var x = p.x;
            var y = p.y;
            var displayWidth = p.displayWidth;
            var displayHeight = p.displayHeight;
            var radius = p.radius + Math.floor(Math.random() * p.radiusSpan);
            var name = p.name;
            var texture = p.texture;
            if (p.isTextureRandom) {
                texture = this.planetGen.texturePack[Math.floor(Math.random() * this.texturePack.length)];
            }
            this.planets.push(this.planetGen.GenerateOnePlanet(x, y, radius, texture, name));
        }
        for (var m of data.moons) {
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
            this.moons[moon.sprite] = orbit;//use sprite instead of moon because it's easier to tell 
        }
    }
}
