export default class Back {
<<<<<<< HEAD

    constructor(scene, x, velocity, y = 0) {
        var spriteY = y;
        this.scene = scene;
        this.spriteX = x;
        this.image = this.scene.add.image(this.spriteX, spriteY, 'back');
        // debugger
        // console.log(this.image);
        this.image2 = this.scene.add.image(this.image.width + this.spriteX, spriteY, 'back');
        this.velocity = velocity;
    }

    update(delta) {
        this.image.x -= this.velocity * delta / 1000;
        this.image2.x -= this.velocity * delta / 1000;

        if (this.image.x <= this.spriteX - this.image.width) {
            this.image.x = this.image.width + this.image2.x;
        }
        if (this.image2.x <= this.spriteX - this.image2.width) {
            this.image2.x = this.image.x + this.image2.width;
        }
    }

}
=======
  constructor(scene, x, velocity, y = 0) {
    var spriteY = y;
    this.scene = scene;
    var spriteX = x;
    this.image = this.scene.add.image(spriteX, spriteY, "back");
    // debugger
    // console.log(this.image);
    this.image2 = this.scene.add.image(this.image.width, spriteY, "back");
    this.velocity = velocity;
  }
}
>>>>>>> b3908406098525a803b911877d3c324b505aa63a
