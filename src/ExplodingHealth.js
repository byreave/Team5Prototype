export default class ExplodingHealth {
    constructor(scene, posX, posY) {
        this.scene = scene;

        // particle part
        this.particleManager = scene.add.particles('life');

        this.sparkles = this.particleManager.createEmitter({
            x: posX + this.scene.cameras.main.scrollX,
            y: posY + this.scene.cameras.main.scrollY,
            lifespan: 1500,
            angle: { min: 0, max: 360 },
            speed: { min: 10, max: 60 },
            gravityY: -200,
            quantity: 4,
            scale: { start: 0.1, end: 0 }
        });

        var endEvent1 = scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.sparkles.setQuantity(0);
            },
            loop: false
        });
    }
}