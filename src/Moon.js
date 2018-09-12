export default class Moon {
    constructor(scene, orbit, startPos) {
        this.scene = scene;
        
        this.isOrbiting = false;
        this.orbit = orbit;
        this.speed = 1; //radian per second
        this.angle = startPos;
        this.isCCW = true;
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
    getArcSpeed()
    {
        return this.speed * this.orbit.gravityCircle.radius;
    }

    getCurrentArcDirection()
    {
        if(this.isCCW)
            return new Phaser.Math.Vector2(this.orbit.sprite.y - this.sprite.y, this.sprite.x - this.orbit.sprite.x);
        else
            return new Phaser.Math.Vector2(this.sprite.y - this.orbit.sprite.y, this.orbit.sprite.x - this.sprite.x);
    }
    OrbitUpdate(delta) //conter clockwise
    {
        if(this.isOrbiting)
        {
            if(this.isCCW)
                this.angle += this.speed * delta / 1000;
            else
                this.angle -= this.speed * delta / 1000;
            if(this.angle <= Math.PI / 2 && this.angle >= 0)
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
            else if (this.angle >= 2 * Math.PI)
                this.angle -= Math.PI * 2;
            else if(this.angle <= 0)
                this.angle = Math.PI * 2;
        }
    }
  
  
    destroy() {
      this.sprite.destroy();
    }
  }