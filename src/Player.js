export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
      this.fuel = 100;
      this.fuelSpendSpeed = 5; //per second
      this.sprite = scene.physics.add
        .sprite(x, y, "star", 0);
      this.speed = 50;
      this.acceleration = 10;
      this.isLanded = false;
      this.sprite.setVelocityX(this.speed);
      this.keys = scene.input.keyboard.createCursorKeys();
    }
  
    freeze() {
      this.sprite.body.moves = false;
    }
  
    land() {
      this.isLanded = true;
    }

    takeoff() {
      this.isLanded = false;
    }
    update(delta) {
      const keys = this.keys;
      const sprite = this.sprite;
      const speed = this.speed;
  
  
      if(this.isLanded == false)
      {
          // Horizontal movement
        if (keys.left.isDown) {
          if(this.fuel >= 0) {
            sprite.setAccelerationX(-this.acceleration);
            //fuel consume
            this.fuel -= this.fuelSpendSpeed * delta / 1000;  
          }
          else {
            //not enough fuel
            console.log("Not Enough Fuel!!");
          }
        } else if (keys.right.isDown) {
          if(this.fuel >= 0) {
            sprite.setAccelerationX(this.acceleration);
            //fuel consume
            this.fuel -= this.fuelSpendSpeed * delta / 1000;
          }
          else {
            //not enough fuel
            console.log("Not Enough Fuel!!");
          }
        } else {
          sprite.setAccelerationX(0);
        }
    
        // Vertical movement
        if (keys.up.isDown) {
          if(this.fuel >= 0) {
            sprite.setAccelerationY(-this.acceleration);
            //fuel consume
            this.fuel -= this.fuelSpendSpeed * delta / 1000;
          }
          else {
            //not enough fuel
            console.log("Not Enough Fuel!!");
          }
          } else if (keys.down.isDown) {
            if(this.fuel >= 0) {
              sprite.setAccelerationY(this.acceleration);
              //fuel consume
              this.fuel -= this.fuelSpendSpeed * delta / 1000;
            }
            else {
              //not enough fuel
              console.log("Not Enough Fuel!!");
            }
          } else {
            sprite.setAccelerationY(0);
          }

        
        }
    }
  
    destroy() {
      this.sprite.destroy();
    }

    refill() {
      this.fuel = 100;
    }
  }