import ExplodingHealth from "./ExplodingHealth";

export default class Player {
  constructor(scene, x, y) {

    this.sprite = scene.physics.add.sprite(x, y, 'character').setScale(0.15).setAngle(0);
    this.explosion = scene.physics.add.sprite(x, y, 'kaboom').setAngle(0);
    this.traBG = scene.add.image(x, y, 'TraBG').setVisible(false).setScale(0.8);
    this.traLine = scene.add.image(x, y, 'TraLine').setVisible(false).setScale(0.5);
    this.lives = 4;
    this.livearray = new Array(this.lives);
    for (var i = 0; i < this.lives; i++) {
      this.livearray[i] = scene.add.image(30 + i * 40, 1050, 'life').setScale(0.5).setAngle(0);
      this.livearray[i].setScrollFactor(0);
    }
    this.explosion.setVisible(false);

    this.scene = scene;
    this.fuel = 100;
    this.fuelSpendSpeed = 5; //per second
    this.traLine.setOrigin(0, 0.5);

    this.boundaryMargin = 30; //for re-collide of the boundary(quick death)
    //this.traLine.setOrigin(0, this.traLine.displayHeight);
    this.acceleration = 60;
    this.isLanded = false;
    this.sprite.setVelocityX(100);
    this.keys = scene.input.keyboard.createCursorKeys();
    //console.log(this.keys);
    this.orbit; //planets player orbiting around ps:not moons
    this.moon; // the moon player come across
    this.level;
    this.landedOn = 0;
    this.angle = 0.0; //joystick control
    this.speedDirect; //joystick speed direction

    this.joystickSensi = 0.5;
    this.isCCW = true;
    this.isLeaving = false; //for moon collider

    this.lastLanded = null;
    this.isDestroy = false;
    this.isInvincible = false;
    this.invincibleTime = 2.0;
    this.blinkTime = 0.0;
  }

  init() {
    this.explosion.setVisible(false);

    //this.scene = scene;
    this.fuel = 100;
    this.fuelSpendSpeed = 5; //per second
    this.traLine.setOrigin(0, 0.5);

    this.boundaryMargin = 30; //for re-collide of the boundary(quick death)
    //this.traLine.setOrigin(0, this.traLine.displayHeight);
    this.acceleration = 60;
    this.isLanded = false;
    this.sprite.setVelocityX(100);
    //this.keys = scene.input.keyboard.createCursorKeys();
    //console.log(this.keys);
    this.orbit; //planets player orbiting around ps:not moons
    this.moon; // the moon player come across
    this.landedOn = 0;
    this.angle = 0.0; //joystick control
    this.speedDirect; //joystick speed direction

    this.joystickSensi = 0.5;
    this.isCCW = true;
    this.isLeaving = false; //for moon collider

    this.lastLanded = null;
    this.isDestroy = false;
    this.isInvincible = false;
    this.invincibleTime = 2.0;
    this.blinkTime = 0.0;
  }
  stop() {
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(0);
    this.landedOn++;
  }

  land(moon) {
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(0);
    this.sprite.setAccelerationX(0);
    this.sprite.setAccelerationY(0);
    this.isLanded = true;
    console.log("Land");
    this.traBG.setVisible(true);
    this.traLine.setVisible(true);
    //bring to top
    this.scene.children.bringToTop(this.traBG);
    this.scene.children.bringToTop(this.traLine);
    this.lastLanded = moon;
    this.scene.children.bringToTop(this.sprite);
    this.moon = moon;
    if (this.moon.isOrbiting == false) this.moon.isOrbiting = true;
    this.orbit = this.moon.orbit;
    this.isCCW = this.moon.isCCW;

    this.speedDirect = this.getCurrentArcDirection();
  }

  startOnDestroy(camera) {
    this.sprite.x = 100 + camera.main.scrollX;
    this.sprite.y = 200 + camera.main.scrollY;
    this.speed = 2; //radian per sec
    this.sprite.setVelocityX(100);
    this.sprite.setVelocityY(0);
    this.sprite.setAccelerationX(0);
    this.sprite.setAccelerationY(0);
  }

  takeoff() {
    this.scene.launch.play();
    var direction = this.speedDirect;
    direction = direction.normalize(); //debug found
    this.scene.graphics.clear();
    //var arcSpeed = this.moon.launchSpeed;
    var arcSpeed = 2 * this.getArcSpeed();
    this.sprite.setVelocityX(-arcSpeed * direction.x);
    this.sprite.setVelocityY(-arcSpeed * direction.y);
    this.isLanded = false;
    this.isLeaving = true;
    this.traBG.setVisible(false);
    this.traLine.setVisible(false);
  }
  update(delta, destroy) {
    if (!destroy) {
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
          //fuel consume
          isBoosting = true;

        } else if (keys.right.isDown) {
          this.scene.streak = 0;
          sprite.setAccelerationX(this.acceleration);
          //fuel consume
          isBoosting = true;
        } else {
          sprite.setAccelerationX(0);
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
          if (this.angle >= -Math.PI / 4) {
            this.angle -= this.joystickSensi * delta / 1000;
          }
        }
        this.speedDirect = this.getCurrentArcDirection();
        this.speedDirect.x =
          this.speedDirect.x * Math.cos(this.angle) - this.speedDirect.y * Math.sin(this.angle);
        this.speedDirect.y =
          this.speedDirect.x * Math.sin(this.angle) + this.speedDirect.y * Math.cos(this.angle);

        //traBG
        this.traBG.setX(this.sprite.x);
        this.traBG.setY(this.sprite.y);
        //traLine
        this.traLine.setX(this.sprite.x);
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

      if (this.isInvincible) {
        this.blinkTime += delta / 1000;
        this.invincibleTime += delta / 1000;
        if (this.invincibleTime > 2.0) {
          this.isInvincible = false;
          this.invincibleTime = 0.0;
          this.blinkTime = 0.0;
          this.sprite.setVisible(true);
        }
        if (this.blinkTime > 0.0 && this.blinkTime < 0.25)
          this.sprite.setVisible(false);
        else if (this.blinkTime < 0.5)
          this.sprite.setVisible(true);
        else {
          this.blinkTime = 0.0;
        }
      }
    }
  }

  reducelife(moon = true) {
    // console.log(player.lives -= 1);
    if (this.lives != 0 && moon) {
      this.lives -= 1;
      this.isInvincible = true;
      var hpExplode =
        new ExplodingHealth(
          this.scene,
          this.livearray[this.lives].x,
          this.livearray[this.lives].y);
      this.livearray[this.lives].setVisible(false);
      //this.land(this.lastLanded);
    } else if (this.lives != 0 && !moon) {
      this.isInvincible = true;
      this.lives -= 1;
      var hpExplode =
        new ExplodingHealth(
          this.scene,
          this.livearray[this.lives].x,
          this.livearray[this.lives].y);
      this.livearray[this.lives].setVisible(false);
      this.startOnDestroy(this.scene.cameras);
    } //else if (this.lives == 0) {
    //this.scene.scene.start('end', { Score: this.scene.score });
    //}
  }

  gainHealth() {
    if (this.lives < 4) {
      this.lives++;
      this.livearray[this.lives - 1].setVisible(true);
    }
  }

  checkPlayerpos() {
    if (!this.isLanded && !this.isLeaving && this.lastLanded != null) {
      if (
        this.sprite.x <= this.scene.cameras.main.scrollX - this.boundaryMargin ||
        this.sprite.x >= this.scene.cameras.main.scrollX + this.level.levelWidth + this.boundaryMargin ||
        this.sprite.y <= this.scene.cameras.main.scrollY - this.boundaryMargin ||
        this.sprite.y >= this.scene.cameras.main.scrollY + this.level.levelHeight + this.boundaryMargin
      ) {
        this.scene.fail.play();
        //move animations back to screen
        if (this.sprite.x <= this.scene.cameras.main.scrollX - this.boundaryMargin)
          this.explosion.x = this.sprite.x + this.boundaryMargin;
        else
          this.explosion.x = this.sprite.x - this.boundaryMargin;

        if (this.sprite.y <= this.scene.cameras.main.scrollY - this.boundaryMargin)
          this.explosion.y = this.sprite.y + this.boundaryMargin;
        else
          this.explosion.y = this.sprite.y - this.boundaryMargin;
        this.land(this.lastLanded);
        this.sprite.setVisible(false);
        this.traBG.setVisible(false);
        this.traLine.setVisible(false);
        this.explosion.setVisible(true);
        this.explosion.setAngle(this.sprite.angle);
        this.explosion.setScale(2);
        this.explosion.play('die');
        this.explosion.once(
          'animationcomplete',
          function (anim, frame) {
            this.sprite.setVisible(true);
            this.traBG.setVisible(true);
            this.traLine.setVisible(true);
            this.explosion.setVisible(false);
            this.reducelife();
          },
          this
        );
      }
    } else if (!this.isLanded && !this.isLeaving && this.lastLanded == null) {
      if (
        this.sprite.x <= this.scene.cameras.main.scrollX - this.boundaryMargin ||
        this.sprite.x >= this.scene.cameras.main.scrollX + this.level.levelWidth + this.boundaryMargin ||
        this.sprite.y <= this.scene.cameras.main.scrollY - this.boundaryMargin ||
        this.sprite.y >= this.scene.cameras.main.scrollY + this.level.levelHeight + this.boundaryMargin
      ) {
        this.scene.fail.play();
        this.sprite.setVisible(false);
        this.explosion.x = this.sprite.x;
        this.explosion.y = this.sprite.y;
        this.sprite.x = this.scene.cameras.main.scrollX + 100;
        this.sprite.y = this.scene.cameras.main.scrollY + 200;
        this.explosion.setAngle(this.sprite.angle);
        this.explosion.setScale(2);
        this.explosion.setVisible(true);
        this.explosion.play('die');
        this.explosion.once(
          'animationcomplete',
          function (anim, frame) {
            this.sprite.setVisible(true);
            this.explosion.setVisible(false);
            this.reducelife(false);
          },
          this
        );
      }
    }
    else {
    }
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
    this.sprite.body.allowGravity = false;
    this.orbit = planet;
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
