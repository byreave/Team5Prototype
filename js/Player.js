export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
  
      this.sprite = scene.physics.add
        .sprite(x, y, "../assets/star.png", 0);
  
      this.keys = scene.input.keyboard.createCursorKeys();
    }
  
    freeze() {
      this.sprite.body.moves = false;
    }
  
    update() {
      const keys = this.keys;
      const sprite = this.sprite;
      const speed = 300;
      const prevVelocity = sprite.body.velocity.clone();
  
      // Stop any previous movement from the last frame
      sprite.body.setVelocity(0);
  
      // Horizontal movement
      if (keys.left.isDown) {
        sprite.body.setVelocityX(-speed);
        sprite.setFlipX(true);
      } else if (keys.right.isDown) {
        sprite.body.setVelocityX(speed);
        sprite.setFlipX(false);
      }
  
      // Vertical movement
      if (keys.up.isDown) {
        sprite.body.setVelocityY(-speed);
      } else if (keys.down.isDown) {
        sprite.body.setVelocityY(speed);
      }
  
      // Normalize and scale the velocity so that sprite can't move faster along a diagonal
      sprite.body.velocity.normalize().scale(speed);
  
      // Update the animation last and give left/right animations precedence over up/down animations
      if (keys.left.isDown || keys.right.isDown || keys.down.isDown) {
        sprite.anims.play("player-walk", true);
      } else if (keys.up.isDown) {
        sprite.anims.play("player-walk-back", true);
      } else {
        sprite.anims.stop();
  
        // If we were moving, pick and idle frame to use
        if (prevVelocity.y < 0) sprite.setTexture("characters", 65);
        else sprite.setTexture("characters", 46);
      }
    }
  
    destroy() {
      this.sprite.destroy();
    }
  }