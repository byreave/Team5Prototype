export default class Back {
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
