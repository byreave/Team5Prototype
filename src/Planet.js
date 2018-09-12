export default class Planet {
    constructor(scene, x, y, radius) {
        this.scene = scene;
    
        this.sprite = scene.physics.add
          .sprite(x, y, "bomb", 0, {isStatic:true});
        var circle = new Phaser.Geom.Circle(x, y, radius);
        this.gravityCircle = circle;
      
    }
    
    drawOrbit()
    {
      var graphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
      graphics.strokeCircleShape(this.gravityCircle);
    }
  
  
    destroy() {
      this.sprite.destroy();
    }
  }