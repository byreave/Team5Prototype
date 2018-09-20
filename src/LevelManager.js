import Level from './Level.js';
import 'phaser';
export default class LevelManager {
	constructor(scene) {
		this.scene = scene;
		this.currentLevel;
		this.levels = new Array();
		this.levelWidth = 1920;
		this.levelHeight = 1080;
		this.moveTo = null;
		this.levelJSON = [ 'StartLevel', 'level1', 'level2', 'level3' ];
	}

	//Initial level
	createALevelAt(pos, json) {
		var newLevel = new Level(this.scene, pos);
		newLevel.createPlanetsFormJson(json);
		this.levels.push(newLevel);
		this.currentLevel = newLevel;
		// TEMP: temp cancel surronding level generation
		this.createLevelAround(newLevel);
		this.scene.player.level = newLevel;
		// TEMP: temp land on first moon
		this.scene.player.land(this.scene.tempMoonSprite);
	}
	createLevelAround(centerLevel) {
		if (centerLevel.levelUp == null) {
			var newLevel = new Level(
				this.scene,
				new Phaser.Math.Vector2(centerLevel.centerPoint.x, centerLevel.centerPoint.y - this.levelHeight)
			);
			newLevel.levelDown = centerLevel;
			newLevel.createPlanetsFormJson(this.getRandomLevelFile());
			centerLevel.levelUp = newLevel;
			this.levels.push(newLevel);
		}
		if (centerLevel.levelDown == null) {
			var newLevel = new Level(
				this.scene,
				new Phaser.Math.Vector2(centerLevel.centerPoint.x, centerLevel.centerPoint.y + this.levelHeight)
			);
			newLevel.levelUp = centerLevel;
			newLevel.createPlanetsFormJson(this.getRandomLevelFile());
			centerLevel.levelDown = newLevel;
			this.levels.push(newLevel);
		}
		if (centerLevel.levelLeft == null) {
			var newLevel = new Level(
				this.scene,
				new Phaser.Math.Vector2(centerLevel.centerPoint.x - this.levelWidth, centerLevel.centerPoint.y)
			);
			newLevel.levelRight = centerLevel;
			newLevel.createPlanetsFormJson(this.getRandomLevelFile());
			centerLevel.levelLeft = newLevel;
			this.levels.push(newLevel);
		}
		if (centerLevel.levelRight == null) {
			var newLevel = new Level(
				this.scene,
				new Phaser.Math.Vector2(centerLevel.centerPoint.x + this.levelWidth, centerLevel.centerPoint.y)
			);
			newLevel.levelLeft = centerLevel;
			newLevel.createPlanetsFormJson(this.getRandomLevelFile());
			centerLevel.levelRight = newLevel;
			this.levels.push(newLevel);
		}
	}

	//para exit for change its direction
	switchLevel(direction, exit) {
		console.log(this);
		if (direction == 'up') {
			//delete other levels to keep levels at 5
			//down
			this.deleteLevelsExcept('up');
			this.currentLevel = this.currentLevel.levelUp;
			this.createLevelAround(this.currentLevel);
			this.scene.player.level = this.currentLevel;
			exit.direction = 'down';
			console.log('changed to upper level');
			//TO DO Camera Move:
			this.moveTo = 'up';
		} else if (direction == 'down') {
			this.deleteLevelsExcept('down');
			this.currentLevel = this.currentLevel.levelDown;
			this.createLevelAround(this.currentLevel);
			this.scene.player.level = this.currentLevel;
			exit.direction = 'up';
			this.moveTo = 'down';
		} else if (direction == 'left') {
			this.deleteLevelsExcept('left');
			this.currentLevel = this.currentLevel.levelLeft;
			this.createLevelAround(this.currentLevel);
			this.scene.player.level = this.currentLevel;
			exit.direction = 'right';
			this.moveTo = 'left';
		} else if (direction == 'right') {
			this.deleteLevelsExcept('right');
			this.currentLevel = this.currentLevel.levelRight;
			this.createLevelAround(this.currentLevel);
			this.scene.player.level = this.currentLevel;
			exit.direction = 'left';
			this.moveTo = 'right';
		}
		console.log(this.currentLevel);
	}

	getRandomLevelFile() {
		return this.levelJSON[Math.floor(Math.random() * this.levelJSON.length)];
	}

	deleteLevelsExcept(direction) {
		var index;
		if (direction != 'down') {
			index = this.levels.indexOf(this.currentLevel.levelDown);
			if (index !== -1) this.levels.splice(index, 1);
			this.currentLevel.levelDown.destroy();
			delete this.currentLevel.levelDown;
			this.currentLevel.levelDown = null;
		}
		if (direction != 'up') {
			index = this.levels.indexOf(this.currentLevel.levelUp);
			if (index !== -1) this.levels.splice(index, 1);
			this.currentLevel.levelUp.destroy();
			delete this.currentLevel.levelUp;
			this.currentLevel.levelUp = null;
		}
		if (direction != 'left') {
			index = this.levels.indexOf(this.currentLevel.levelLeft);
			if (index !== -1) this.levels.splice(index, 1);
			this.currentLevel.levelLeft.destroy();
			delete this.currentLevel.levelLeft;
			this.currentLevel.levelLeft = null;
		}
		if (direction != 'right') {
			index = this.levels.indexOf(this.currentLevel.levelRight);
			if (index !== -1) this.levels.splice(index, 1);
			this.currentLevel.levelRight.destroy();
			delete this.currentLevel.levelRight;
			this.currentLevel.levelRight = null;
		}
	}
}
