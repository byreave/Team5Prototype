export default class Player {
	constructor(scene, x, y, level) {
		this.scene = scene;
		this.fuel = 100;
		this.fuelSpendSpeed = 5; //per second
		this.sprite = scene.physics.add.sprite(x, y, 'character').setScale(0.15).setAngle(0);
		this.speed = 2; //radian per sec
		this.acceleration = 30;
		this.isLanded = false;
		this.sprite.setVelocityX(100);
		this.keys = scene.input.keyboard.createCursorKeys();
		//console.log(this.keys);
		this.orbit; //planets player orbiting around ps:not moons
		this.moon; // the moon player come across
		this.level = level;
		this.landedOn = 0;
		//this.angle = 0.0;
		this.isCCW = true;
		this.isLeaving = false; //for moon collider
	}

	stop() {
		this.sprite.setVelocityX(0);
		this.sprite.setVelocityY(0);
		this.landedOn++;
	}

	land(moonSprite) {
		this.isLanded = true;
		this.moon = this.level.moons.get(moonSprite);
		if (this.moon.isOrbiting == false) this.moon.isOrbiting = true;
		console.log(this.moon);
		this.orbit = this.moon.orbit;
		this.isCCW = this.moon.isCCW;
		this.sprite.setVelocityX(0);
		this.sprite.setVelocityY(0);
		this.sprite.setAccelerationX(0);
		this.sprite.setAccelerationY(0);
	}

	takeoff() {
		var direction = this.getCurrentArcDirection();
		direction = direction.normalize(); //debug found
		var arcSpeed = this.getArcSpeed();
		this.sprite.setVelocityX(-arcSpeed * direction.x);
		this.sprite.setVelocityY(-arcSpeed * direction.y);
		this.isLanded = false;
		this.isLeaving = true;
	}
	update(delta) {
		const keys = this.keys;
		const sprite = this.sprite;

		if (this.isLanded == false) {
			// boost identifier
			var isBoosting = false;
			var currentDir = new Phaser.Math.Vector2().copy(this.sprite.body.velocity).normalize();

			// Horizontal movement
			if (keys.left.isDown) {
				if (this.fuel >= 0) {
					sprite.setAccelerationX(-this.acceleration);
					//fuel consume
					this.fuel -= this.fuelSpendSpeed * delta / 1000;
					isBoosting = true;
				} else {
					//not enough fuel
					sprite.setAccelerationX(0);
				}
			} else if (keys.right.isDown) {
				if (this.fuel >= 0) {
					sprite.setAccelerationX(this.acceleration);
					//fuel consume
					this.fuel -= this.fuelSpendSpeed * delta / 1000;
					isBoosting = true;
				} else {
					//not enough fuel
					sprite.setAccelerationX(0);
				}
			} else {
				sprite.setAccelerationX(0);
			}

			// Vertical movement
			if (keys.up.isDown) {
				if (this.fuel >= 0) {
					sprite.setAccelerationY(-this.acceleration);
					//fuel consume
					this.fuel -= this.fuelSpendSpeed * delta / 1000;
					isBoosting = true;
				} else {
					//not enough fuel
					sprite.setAccelerationX(0);
				}
			} else if (keys.down.isDown) {
				if (this.fuel >= 0) {
					sprite.setAccelerationY(this.acceleration);
					//fuel consume
					this.fuel -= this.fuelSpendSpeed * delta / 1000;
					isBoosting = true;
				} else {
					//not enough fuel
					sprite.setAccelerationX(0);
				}
			} else {
				sprite.setAccelerationY(0);
			}

			// stop/play boosting animation
			isBoosting ? this.sprite.play('hermes', true, 0) : this.sprite.setFrame(0);

			// set sprite direction
			var aimAngle = currentDir.angle(new Phaser.Math.Vector2(0, 1)) + Math.PI / 2;
			this.sprite.setRotation(aimAngle);
		} else {
			this.sprite.setX(this.moon.sprite.x);
			this.sprite.setY(this.moon.sprite.y);
			if (keys.space.isDown) {
				this.takeoff();
			}
		}
		//moon collider
		if (this.isLeaving == true) {
			if (
				(this.moon.sprite.x - this.sprite.x) * (this.moon.sprite.x - this.sprite.x) +
					(this.moon.sprite.y - this.sprite.y) * (this.moon.sprite.y - this.sprite.y) >
				2 * this.moon.sprite.displayWidth * this.moon.sprite.displayWidth +
					2 * this.sprite.displayWidth * this.sprite.displayHeight
			) {
				//distance vs two object size(approximately)
				this.isLeaving = false;
			}
		}
	}

	destroy() {
		this.sprite.destroy();
	}

	refill() {
		this.fuel = 100;
	}

	getArcSpeed() {
		return this.speed * this.orbit.gravityCircle.radius;
	}

	getCurrentArcDirection() {
		if (this.isCCW)
			return new Phaser.Math.Vector2(this.orbit.sprite.y - this.sprite.y, this.sprite.x - this.orbit.sprite.x);
		else return new Phaser.Math.Vector2(this.sprite.y - this.orbit.sprite.y, this.orbit.sprite.x - this.sprite.x);
	}

	//for playable
	orbitPlanet(planet) {
		var radio = new Phaser.Math.Vector2(planet.sprite.x - this.sprite.x, planet.sprite.y - this.sprite.y);
		if (radio.x < 0) this.angle = Math.atan(radio.y / radio.x);
		else if (radio.x > 0) {
			this.angle = Math.atan(-radio.y / radio.x);
		} else this.angle = Math.PI / 2;
		if (this.sprite.body.velocity.x < 0) this.isCCW = false;
		else this.isCCW = true;
		console.log(radio);
		console.log(this.angle);
		this.sprite.body.allowGravity = false;
		this.orbit = planet;
	}
	orbitUpdate(delta) {
		if (this.isLanded) {
			if (this.angle < 0) {
				this.isCCW = true;
			} else if (this.angle <= Math.PI / 2) {
				this.sprite.setX(this.orbit.sprite.x - Math.cos(this.angle) * this.orbit.gravityCircle.radius);
				this.sprite.setY(this.orbit.sprite.y + Math.sin(this.angle) * this.orbit.gravityCircle.radius);
			} else if (this.angle <= Math.PI) {
				this.sprite.setX(
					this.orbit.sprite.x + Math.cos(Math.PI - this.angle) * this.orbit.gravityCircle.radius
				);
				this.sprite.setY(
					this.orbit.sprite.y + Math.sin(Math.PI - this.angle) * this.orbit.gravityCircle.radius
				);
			} else if (this.angle > Math.PI) {
				this.isCCW = false;
			}

			if (this.isCCW) {
				this.angle += this.speed * delta / 1000;
			} else this.angle -= this.speed * delta / 1000;
		}
	}
}
