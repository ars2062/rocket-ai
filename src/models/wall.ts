import p5, { Vector } from "p5";
import Rocket from "./rocket";

export default class Wall {
  p1: Vector;
  p2: Vector;
  p5: p5;
  constructor(p5: p5, p1: Vector, p2: Vector) {
    this.p1 = p1;
    this.p2 = p2;
    this.p5 = p5;
  }
  draw(){
    this.p5.fill(150)
    this.p5.rect(this.p1.x,this.p1.y, this.p2.x - this.p1.x, this.p2.y-this.p1.y)
  }

  isCollidingWithRocket(rocket: Rocket) {
    const pointX = rocket.pos.x
    const pointY = rocket.pos.y
    const rectX1 = this.p1.x
    const rectY1 = this.p1.y
    const rectX2 = this.p2.x
    const rectY2 = this.p2.y
    // Check if point is inside or on the rectangle boundaries
    return (pointX >= Math.min(rectX1, rectX2) && pointX <= Math.max(rectX1, rectX2) &&
            pointY >= Math.min(rectY1, rectY2) && pointY <= Math.max(rectY1, rectY2));
}
}
