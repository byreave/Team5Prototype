import Planet from "./Planet.js";
import Moon from "./Moon.js";
import Level from "./Level.js";
export default class Exit {
    constructor(scene, level, direction, PlanetTexture, PlanetRadius, MoonTexture, isCCW) {
        this.scene = scene;
        this.x;
        this.y;
        if (direction == 'up') {
            this.x = level.centerPoint.x
            this.y = level.centerPoint.y - level.levelHeight;
        }
        else if (direction == 'down') {
            this.x = level.centerPoint.x;
            this.y = level.centerPoint.y + level.levelHeight;
        }
        else if (direction == 'left') {
            this.x = level.centerPoint.x - level.levelWidth;
            this.y = level.centerPoint.y;
        }
        else if (direction == 'right') {
            this.x = level.centerPoint.x + levelWidth;
            this.y = level.centerPoint.y;
        }
        this.planet = new Planet(this.scene, this.x, this.y, PlanetRadius, Level.name + direction + "exit", PlanetTexture);
        this.moon = new Moon(this.scene, this.planet, 0, isCCW, MoonTexture, Level.name + direction + "exitMoon");
    }

    update(delta) {
        this.planet.update(delta);
        this.moon.OrbitUpdate(delta);
    }
}