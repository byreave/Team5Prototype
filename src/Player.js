export default class Player {
  constructor(scene, x, y, level) {
    this.scene = scene;
    this.fuel = 100;
    this.fuelSpendSpeed = 5; //per second
    this.sprite = scene.physics.add.sprite(x, y, 'character').setScale(0.15).setAngle(0);
    this.traBG = scene.add.image(x, y, 'TraBG').setVisible(false);
    this.traLine = scene.add.image(x, y, 'TraLine').setVisible(false);
    this.traLine.setOrigin(0, 0.5);

    //this.traLine.setOrigin(0, this.traLine.displayHeight);
    this.acceleration = 30;
    this.isLanded = false;
    this.sprite.setVelocityX(100);
    this.keys = scene.input.keyboard.createCursorKeys();
    //console.log(this.keys);
    this.orbit; //planets player orbiting around ps:not moons
    this.moon; // the moon player come across
    this.level = level;
    this.landedOn = 0;
    this.angle = 0.0; //joystick control
    this.speedDirect;//joystick speed direction

    this.joystickSensi = 0.5;
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
    this.traBG.setVisible(true);
    this.traLine.setVisible(true);
    //bring to top
    this.scene.children.bringToTop(this.traBG);
    this.scene.children.bringToTop(this.traLine);
    this.scene.children.bringToTop(this.sprite);
    this.moon = this.level.moons.get(moonSprite);
    console.log(this.moon);
    if (this.moon.isOrbiting == false) this.moon.isOrbiting = true;
    this.orbit = this.moon.orbit;
    this.isCCW = this.moon.isCCW;
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(0);
    this.sprite.setAccelerationX(0);
    this.sprite.setAccelerationY(0);
    this.speedDirect = this.getCurrentArcDirection();

  }

  takeoff() {
    var direction = this.speedDirect;
    direction = direction.normalize(); //debug found
    this.scene.graphics.clear();
    //var arcSpeed = this.moon.launchSpeed;
    var arcSpeed = this.getArcSpeed();
    this.sprite.setVelocityX(-arcSpeed * direction.x);
    this.sprite.setVelocityY(-arcSpeed * direction.y);
    this.isLanded = false;
    this.isLeaving = true;
    this.traBG.setVisible(false);
    this.traLine.setVisible(false);

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
        this.scene.streak = 0;
        sprite.setAccelerationX(-this.acceleration);
        isBoosting = true;
      } if (keys.right.isDown) {
        this.scene.streak = 0;
        sprite.setAccelerationX(this.acceleration);
        isBoosting = true;
      } else {
        sprite.setAccelerationX(0);
        sprite.setAccelerationY(0);
      }

      // Vertical movement
      if (keys.up.isDown) {
        this.scene.streak = 0;
        sprite.setAccelerationY(-this.acceleration);
        isBoosting = true;
      } else if (keys.down.isDown) {
        this.scene.streak = 0;
        sprite.setAccelerationY(this.acceleration);
        isBoosting = true;
      } else {
        sprite.setAccelerationX(0);
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
      //Control launch angle
      if (keys.up.isDown) {
        if (this.angle <= Math.PI / 4) {
          this.angle += this.joystickSensi * delta / 1000;

        }
      }
      if (keys.down.isDown) {
        if (this.angle >= - Math.PI / 4) {
          this.angle -= this.joystickSensi * delta / 1000;
        }
      }
      this.speedDirect = this.getCurrentArcDirection();
      this.speedDirect.x = this.speedDirect.x * Math.cos(this.angle) - this.speedDirect.y * Math.sin(this.angle);
      this.speedDirect.y = this.speedDirect.x * Math.sin(this.angle) + this.speedDirect.y * Math.cos(this.angle);

      //traBG
      this.traBG.setX(this.sprite.x);
      this.traBG.setY(this.sprite.y);
      //traLine
      this.traLine.setX(this.sprite.x)
      this.traLine.setY(this.sprite.y);
      this.traLine.setRotation(this.speedDirect.angle(new Phaser.Math.Vector2(1, 0)) + Math.PI);
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
    return this.moon.speed * this.orbit.gravityCircle.radius;
  }

  getCurrentArcDirection() {
    if (this.isCCW == false)
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
