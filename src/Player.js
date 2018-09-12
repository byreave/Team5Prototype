export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
  
      this.sprite = scene.physics.add
        .sprite(x, y, "star", 0);
  
      this.keys = scene.input.keyboard.createCursorKeys();
    }
  
    freeze() {
      this.sprite.body.moves = false;
    }
  
    update() {
      const keys = this.keys;
      const sprite = this.sprite;
      const speed = 5;
  
  
      // Horizontal movement
      if (keys.left.isDown) {
        console.log("!!!!");
        sprite.setVelocityX(-speed);
      } else if (keys.right.isDown) {
        sprite.setVelocityX(speed);
      }
  
      // Vertical movement
      if (keys.up.isDown) {
        sprite.setVelocityY(-speed);
      } else if (keys.down.isDown) {
        sprite.setVelocityY(speed);
      }
    }
  
    destroy() {
      this.sprite.destroy();
    }
  }