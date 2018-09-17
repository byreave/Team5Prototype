import Planet from "./Planet.js";
import Moon from "./Moon.js";
import Level from "./Level.js";
export default class Exit {
    constructor(scene, level, direction, PlanetTexture, PlanetRadius, MoonTexture, isCCW) {
        this.scene = scene;
        this.x;
        this.y;
        this.pos;
        this.level = level
        this.direction = direction;
        if (direction == 'up') {
            this.x = level.centerPoint.x;
            this.y = level.centerPoint.y - level.levelHeight / 2;
            this.pos = 3 * Math.PI / 2;
        }
        else if (direction == 'down') {
            this.x = level.centerPoint.x;
            this.y = level.centerPoint.y + level.levelHeight / 2;
            this.pos = Math.PI / 2;
        }
        else if (direction == 'left') {
            this.x = level.centerPoint.x - level.levelWidth / 2;
            this.y = level.centerPoint.y;
            this.pos = 0;
        }
        else if (direction == 'right') {
            this.x = level.centerPoint.x + level.levelWidth / 2;
            this.y = level.centerPoint.y;
            this.pos = Math.PI;
        }
        this.planet = new Planet(this.scene, this.x, this.y, PlanetRadius, level.name + direction + "exit", PlanetTexture);
        this.moon = new Moon(this.scene, this.planet, this.pos, isCCW, MoonTexture, level.name + direction + "exitMoon");
        this.moon.isExit = true;
        this.moon.exit = this;
        this.moon.isOrbiting = false;
    }

    update(delta) {
        this.planet.update(delta);
        this.moon.OrbitUpdate(delta);
    }
}