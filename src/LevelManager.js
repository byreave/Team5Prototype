import Level from "./Level.js";
import "phaser"
export default class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.currentLevel;
        this.levels = new Array();
        this.levelWidth = 1920;
        this.levelHeight = 1080;

        this.levelJSON = ['StartLevel', 'level1'];
    }

    //Initial level
    createALevelAt(pos, json) {
        var newLevel = new Level(this.scene, pos);
        newLevel.createPlanetsFormJson(json);
        this.levels.push(newLevel);
        this.currentLevel = newLevel;
        this.createLevelAround(newLevel);
        this.scene.player.level = newLevel;
    }
    createLevelAround(centerLevel) {
        if (centerLevel.levelUp == null) {
            var newLevel = new Level(this.scene, centerLevel.pos + new Phaser.Math.Vector2(0, -this.levelHeight));
            newLevel.createPlanetsFormJson(this.getRandomLevelFile());
            centerLevel.levelUp = newLevel;
            this.levels.push(newLevel);
        }
        if (centerLevel.levelDown == null) {
            var newLevel = new Level(this.scene, centerLevel.pos + new Phaser.Math.Vector2(0, this.levelHeight));
            newLevel.createPlanetsFormJson(this.getRandomLevelFile());
            centerLevel.levelDown = newLevel;
            this.levels.push(newLevel);
        }
        if (centerLevel.levelLeft == null) {
            var newLevel = new Level(this.scene, centerLevel.pos + new Phaser.Math.Vector2(-this.levelWidth, 0));
            newLevel.createPlanetsFormJson(this.getRandomLevelFile());
            centerLevel.levelLeft = newLevel;
            this.levels.push(newLevel);
        }
        if (centerLevel.levelRight == null) {
            var newLevel = new Level(this.scene, centerLevel.pos + new Phaser.Math.Vector2(this.levelWidth, 0));
            newLevel.createPlanetsFormJson(this.getRandomLevelFile());
            centerLevel.levelRight = newLevel;
            this.levels.push(newLevel);
        }
    }

    //0 up 1 down 2 left 3 right
    switchLevel(direction) {
        if (direction == 0) {
            this.currentLevel = this.currentLevel.levelUp;
            this.createLevelAround(this.currentLevel);
            this.scene.player.level = this.currentLevel;
            //TO DO Camera Move:

        }
        else if (direction == 1) {
            this.currentLevel = this.currentLevel.levelUp;
            this.createLevelAround(this.currentLevel);
            this.scene.player.level = this.currentLevel;

        }
        else if (direction == 2) {
            this.currentLevel = this.currentLevel.levelLeft;
            this.createLevelAround(this.currentLevel);
            this.scene.player.level = this.currentLevel;

        }
        else if (direction == 3) {
            this.currentLevel = this.currentLevel.levelRight;
            this.createLevelAround(this.currentLevel);
            this.scene.player.level = this.currentLevel;

        }
    }

    getRandomLevelFile() {
        return this.levelJSON[Math.floor(Math.random() * this.levelJSON.length)];
    }
}