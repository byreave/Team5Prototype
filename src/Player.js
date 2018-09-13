export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.fuel = 100;
    this.fuelSpendSpeed = 5; //per second
    this.sprite = scene.physics.add.sprite(x, y, "star", 0);
    this.speed = 2; //radian per sec
    this.acceleration = 30;
    this.isLanded = false;
    this.sprite.setVelocityX(100);
    this.keys = scene.input.keyboard.createCursorKeys();
    //console.log(this.keys);
    this.orbit;
    this.landedOn = 0;
    this.angle = 0.0;
    this.isCCW = true;
  }

  stop() {
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(0);
    this.landedOn++;
  }

  land() {
    this.isLanded = true;
  }

  takeoff() {
    this.sprite.body.allowGravity = true;
    var direction = this.getCurrentArcDirection();
    direction = direction.normalize(); //debug found
    var arcSpeed = this.getArcSpeed();
    this.sprite.setVelocityX(-arcSpeed * direction.x);
    this.sprite.setVelocityY(-arcSpeed * direction.y);
    this.isLanded = false;
  }
  update(delta) {
    const keys = this.keys;
    const sprite = this.sprite;

    if (this.isLanded == false) {
      // Horizontal movement
      if (keys.left.isDown) {
        if (this.fuel >= 0) {
          sprite.setAccelerationX(-this.acceleration);
          //fuel consume
          this.fuel -= (this.fuelSpendSpeed * delta) / 1000;
        } else {
          //not enough fuel
          console.log("Not Enough Fuel!!");
        }
      } else if (keys.right.isDown) {
        if (this.fuel >= 0) {
          sprite.setAccelerationX(this.acceleration);
          //fuel consume
          this.fuel -= (this.fuelSpendSpeed * delta) / 1000;
        } else {
          //not enough fuel
          console.log("Not Enough Fuel!!");
        }
      } else {
        sprite.setAccelerationX(0);
      }

      // Vertical movement
      if (keys.up.isDown) {
        if (this.fuel >= 0) {
          sprite.setAccelerationY(-this.acceleration);
          //fuel consume
          this.fuel -= (this.fuelSpendSpeed * delta) / 1000;
        } else {
          //not enough fuel
          console.log("Not Enough Fuel!!");
        }
      } else if (keys.down.isDown) {
        if (this.fuel >= 0) {
          sprite.setAccelerationY(this.acceleration);
          //fuel consume
          this.fuel -= (this.fuelSpendSpeed * delta) / 1000;
        } else {
          //not enough fuel
          console.log("Not Enough Fuel!!");
        }
      } else {
        sprite.setAccelerationY(0);
      }
    } else {
      if (keys.space.isDown) {
        this.takeoff();
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
      return new Phaser.Math.Vector2(
        this.orbit.sprite.y - this.sprite.y,
        this.sprite.x - this.orbit.sprite.x
      );
    else
      return new Phaser.Math.Vector2(
        this.sprite.y - this.orbit.sprite.y,
        this.orbit.sprite.x - this.sprite.x
      );
  }

  //for playable
  orbitPlanet(planet) {
    var radio = new Phaser.Math.Vector2(
      planet.sprite.x - this.sprite.x,
      planet.sprite.y - this.sprite.y
    );
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
        this.sprite.setX(
          this.orbit.sprite.x -
            Math.cos(this.angle) * this.orbit.gravityCircle.radius
        );
        this.sprite.setY(
          this.orbit.sprite.y +
            Math.sin(this.angle) * this.orbit.gravityCircle.radius
        );
      } else if (this.angle <= Math.PI) {
        this.sprite.setX(
          this.orbit.sprite.x +
            Math.cos(Math.PI - this.angle) * this.orbit.gravityCircle.radius
        );
        this.sprite.setY(
          this.orbit.sprite.y +
            Math.sin(Math.PI - this.angle) * this.orbit.gravityCircle.radius
        );
      } else if (this.angle > Math.PI) {
        this.isCCW = false;
      }

      if (this.isCCW) {
        this.angle += (this.speed * delta) / 1000;
      } else this.angle -= (this.speed * delta) / 1000;
    }
  }
}
