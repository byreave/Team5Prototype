export default class Planet {
    constructor(scene, x, y, radius, name, texture = "bomb") {
        this.scene = scene;
        this.name = name;
        this.sprite = scene.physics.add
          .sprite(x, y, texture);
        this.sprite.body.immovable = true;
        this.sprite.name = name;
        this.sprite.body.allowGravity = false;
        var circle = new Phaser.Geom.Circle(x, y, radius);
        this.sprite.setScale(2);

        radius = radius / this.sprite.scaleX;
        this.gravityCircle = circle;
        this.sprite.setCircle(radius, -(radius - this.sprite.displayWidth / (2* this.sprite.scaleX)),  -(radius - this.sprite.displayHeight / (2** this.sprite.scaleY)));
        this.collider = this.scene.physics.add.collider(this.scene.player.sprite, this.sprite, this.enterPlanet, function () {
          this.physics.world.removeCollider(this.collider);
        }, this.scene);
        this.drawOrbit(); 
    }
    
    drawOrbit()
    {
      this.graphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
      this.gravityCircle.x = this.sprite.x;
      this.gravityCircle.y = this.sprite.y;
      this.graphics.strokeCircleShape(this.gravityCircle);
    }
  
    update(delta) {
      this.graphics.destroy();
      this.drawOrbit();
    }
  
    destroy() {
      this.sprite.destroy();
    }

    enterPlanet(playerSprite, planetSprite) {
      if(playerSprite.y > planetSprite.y && this.player.isLanded == false)
      {
        this.player.stop();
        this.player.land();
        //this.player.orbitPlanet(this.planet1);
        for(var p of this.planets)
        {
          //console.log(planetSprite.name);
          //console.log(p);

          if(planetSprite.name == p.name)
          {
            this.player.orbitPlanet(p);
            this.physics.world.removeCollider(p.collider);
            console.log("111");
            break;
          }
        }
        
        //this.planet1.body.refresh();
      }
    }
  }