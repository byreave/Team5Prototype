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
        this.smallMovingSpeed = 10.0;
        this.smallMovingTime = 0.5;
        this.currentTime = 0.0;
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
        this.scene.levelManager.currentLevel.removeColle(this);
    }
    update(delta) {
        //make it floating a bit.
        this.currentTime += delta / 1000.0;
        if (this.movesUp) {
            if (this.sprite != null && this.currentTime <= this.smallMovingTime) {
                this.sprite.setVelocityY(-50)
            }
            else {
                this.movesUp = false;
                this.currentTime = 0.0;
            }
        }
        if (!this.movesUp) {
            if (this.sprite != null && this.currentTime <= this.smallMovingTime) {
                this.sprite.setVelocityY(50)
            }
            else {
                this.movesUp = true;
                this.currentTime = 0.0;
            }
        }

    }
    destroy() {
        this.sprite.destroy();
    }
}