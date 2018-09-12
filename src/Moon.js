export default class Moon {
    constructor(scene, orbit, startPos) {
        this.scene = scene;
        
        this.isOrbiting = false;
        this.orbit = orbit;
        this.angle = startPos;
        this.sprite = scene.physics.add
          .sprite(orbit.sprite.x + Math.cos(startPos) * orbit.gravityCircle.radius, orbit.sprite.y - Math.sin(startPos) * orbit.gravityCircle.radius, "star", 0, {isStatic:true});
    }
    
    setStartingPos(angle)
    {
        this.angle = angle;
    }

    setSpeed(anglePerSecond)
    {
        this.speed = anglePerSecond;
    }
    setOrbiting(o)
    {
        this.isOrbiting = o;
    }
    
    OrbitUpdate(delta) //conter clockwise
    {
        if(this.isOrbiting)
        {
            this.angle += this.speed;
            if(this.angle <= Math.PI / 2)
            {
                this.sprite.setX(this.orbit.sprite.x + Math.cos(this.angle) * this.orbit.gravityCircle.radius);
                this.sprite.setY(this.orbit.sprite.y - Math.sin(this.angle) * this.orbit.gravityCircle.radius);
            }
            else if(this.angle <= Math.PI)
            {
                this.sprite.setX(this.orbit.sprite.x - Math.sin(this.angle - Math.PI / 2) * this.orbit.gravityCircle.radius);
                this.sprite.setY(this.orbit.sprite.y - Math.cos(this.angle - Math.PI / 2) * this.orbit.gravityCircle.radius);
            }
            else if(this.angle <= 3 * Math.PI / 2)
            {
                this.sprite.setX(this.orbit.sprite.x - Math.cos(this.angle - Math.PI) * this.orbit.gravityCircle.radius);
                this.sprite.setY(this.orbit.sprite.y + Math.sin(this.angle - Math.PI) * this.orbit.gravityCircle.radius);
            }
            else if (this.angle < 2 * Math.PI)
            {
                this.sprite.setX(this.orbit.sprite.x + Math.cos(Math.PI * 2 - this.angle) * this.orbit.gravityCircle.radius);
                this.sprite.setY(this.orbit.sprite.y + Math.sin(Math.PI * 2 - this.angle) * this.orbit.gravityCircle.radius);
            }
            else
                this.angle -= Math.PI * 2;
        }
    }
  
  
    destroy() {
      this.sprite.destroy();
    }
  }