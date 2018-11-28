export default class Collectible {
    constructor(scene, x, y, texture, scores, health) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(
            x,
            y,
            texture
        );
        this.scores = scores;
        this.health = health;
        this.collider = this.scene.physics.add.overlap(
            this.sprite,
            this.scene.player.sprite,
            this.playerIncoming.bind(this),
            null,
            this.scene
        );

        //for floating
        this.smallMovingDistance = 50.0;
        this.smallMovingTime = 2.0;
        this.currentDifference = 0.0;
        this.movesUp = true;
    }
    playerIncoming() {
        if (this.scores != 0) {
            this.scene.score += this.scores;
            //do something if collide with score collectible
        }
        //ignore the situation where one collectible add more than two lives.// lazy
        if (this.health > 0) {
            this.scene.player.gainHealth();
        }
        this.destroy();
    }
    update(delta) {
        //make it floating a bit.
        var step = (this.smallMovingDistance / this.smallMovingTime) * delta / 1000;
        if (this.movesUp) {
            if (this.currentDifference >= -this.smallMovingDistance / 2.0) {
                this.sprite.setY(this.sprite.y - step);
                this.currentDifference -= this.step;
            }
            else
                this.movesUp = false;
        }
        if (!this.movesUp) {
            if (this.currentDifference <= this.smallMovingDistance / 2.0) {
                this.sprite.setY(this.sprite.y - step);
                this.currentDifference += this.step;
            }
            else
                this.movesUp = true;
        }

    }
    destroy() {
        this.sprite.destroy();
    }
}