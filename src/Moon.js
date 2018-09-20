export default class Moon {
    constructor(scene, orbit, startPos, isCCW, texture, name, speed = 2, isGolden = false) {
        this.scene = scene;
        this.name = name;
        this.isOrbiting = true;
        this.orbit = orbit;
        this.speed = speed; //radian per second
        this.angle = startPos;
        this.isCCW = isCCW;
        this.isGolden = isGolden;
        this.isExit = false;
        this.exit = null;
        this.isVisited = false;
        this.sprite = scene.physics.add.sprite(
            orbit.sprite.x + Math.cos(startPos) * orbit.gravityCircle.radius,
            orbit.sprite.y - Math.sin(startPos) * orbit.gravityCircle.radius,
            texture
        );
        this.sprite.setScale(0.4);
        this.sprite.name = name;
        this.collider = this.scene.physics.add.overlap(
            this.sprite,
            this.scene.player.sprite,
            this.playerIncoming.bind(this),
            null,
            this.scene
        );
    }

    setStartingPos(angle) {
        this.angle = angle;
    }

    setSpeed(anglePerSecond) {
        this.speed = anglePerSecond;
    }
    setOrbiting(o) {
        this.isOrbiting = o;
    }
    getArcSpeed() {
        return this.speed * this.orbit.gravityCircle.radius;
    }

    getCurrentArcDirection() {
        if (this.isCCW == false)
            return new Phaser.Math.Vector2(this.orbit.sprite.y - this.sprite.y, this.sprite.x - this.orbit.sprite.x);
        else return new Phaser.Math.Vector2(this.sprite.y - this.orbit.sprite.y, this.orbit.sprite.x - this.sprite.x);
    }
    OrbitUpdate(
        delta //conter clockwise
    ) {
        if (this.isOrbiting) {
            if (this.isCCW) this.angle += this.speed * delta / 1000;
            else this.angle -= this.speed * delta / 1000;
            var pos = new Phaser.Math.Vector2();
            pos.x = this.orbit.sprite.x + this.orbit.gravityCircle.radius * Math.cos(this.angle);// - this.orbit.gravityCircle.radius * Math.sin(this.angle);
            pos.y = this.orbit.sprite.y + this.orbit.gravityCircle.radius * Math.sin(this.angle);// + this.orbit.gravityCircle.radius * Math.cos(this.angle);
            this.sprite.setX(pos.x);
            this.sprite.setY(pos.y);
            /*if (this.angle <= Math.PI / 2 && this.angle >= 0) {
                this.sprite.setX(this.orbit.sprite.x + Math.cos(this.angle) * this.orbit.gravityCircle.radius);
                this.sprite.setY(this.orbit.sprite.y - Math.sin(this.angle) * this.orbit.gravityCircle.radius);
            } else if (this.angle <= Math.PI) {
                this.sprite.setX(
                    this.orbit.sprite.x - Math.sin(this.angle - Math.PI / 2) * this.orbit.gravityCircle.radius
                );
                this.sprite.setY(
                    this.orbit.sprite.y - Math.cos(this.angle - Math.PI / 2) * this.orbit.gravityCircle.radius
                );
            } else if (this.angle <= 3 * Math.PI / 2) {
                this.sprite.setX(
                    this.orbit.sprite.x - Math.cos(this.angle - Math.PI) * this.orbit.gravityCircle.radius
                );
                this.sprite.setY(
                    this.orbit.sprite.y + Math.sin(this.angle - Math.PI) * this.orbit.gravityCircle.radius
                );
            } else if (this.angle < 2 * Math.PI) {
                this.sprite.setX(
                    this.orbit.sprite.x + Math.cos(Math.PI * 2 - this.angle) * this.orbit.gravityCircle.radius
                );
                this.sprite.setY(
                    this.orbit.sprite.y + Math.sin(Math.PI * 2 - this.angle) * this.orbit.gravityCircle.radius
                );
            } else if (this.angle >= 2 * Math.PI) this.angle -= Math.PI * 2;
            else if (this.angle <= 0) this.angle = Math.PI * 2;*/
        }
    }

    destroy() {
        this.sprite.destroy();
    }

    playerIncoming(moonSprite, playerSprite) {
        if (this.scene.player.isLanded == false && this.scene.player.isLeaving == false) {
            if (this.isExit == false) {
                if (this.isVisited == false) {
                    this.isVisited = true;
                    if (this.isGolden == false){
                        this.scene.catch.play();
                        this.scene.score += 10 + 10 * this.scene.streak;    
                    }
                    else{
                        this.scene.gold.play();
                        this.scene.score += 200;
                    }
                    this.scene.streak++;
                }
                this.scene.player.land(moonSprite);
            }
            else {
                this.scene.catch.play();
                this.scene.player.land(moonSprite);
                if (this.isVisited == false) {
                    this.isVisited = true;
                    this.scene.score += 10 + 10 * this.scene.streak;
                    this.scene.streak++;
                }
                this.scene.levelManager.switchLevel(this.exit.direction, this.exit);
            }
        }
    }
}
