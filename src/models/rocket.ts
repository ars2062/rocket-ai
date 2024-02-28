import p5, { Vector } from "p5";
import { Brain } from "./brain";
import { BRAIN_CAPACITY, POINT_SIZE } from "..";

const FAN_SIZE = 5;

export default class Rocket {
  pos: Vector;
  acc = new Vector();
  vel = new Vector();
  brain: Brain;
  p5: p5;
  endPos: Vector;
  _isDead = false;
  currentStep?: number;

  constructor(p5: p5, pos: Vector, endPos: Vector, brain?: Brain) {
    this.pos = pos.copy();
    this.p5 = p5;
    this.brain = brain || Brain.random();
    this.endPos = endPos;
  }

  update() {
    if (this.isDead) return;
    this.vel.add(this.acc);
    this.vel.limit(3);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // check if out of boundary
    if (
      this.pos.x < 0 ||
      this.pos.x > this.p5.width ||
      this.pos.y < 0 ||
      this.pos.y > this.p5.height
    )
      this._isDead = true;
  }

  move(step: number) {
    this.currentStep = step;
    if (this.brain.cells[step]) this.acc.add(this.brain.cells[step] as Vector);
  }

  get isDead() {
    return (
      this.currentStep == BRAIN_CAPACITY - 1 ||
      this._isDead ||
      this.pos.dist(this.endPos) < POINT_SIZE / 2
    );
  }

  draw(fill: number | number[] = 255) {
    this.p5.push();
    this.p5.fill(fill as any);
    this.p5.translate(this.pos);
    this.p5.rotate(this.vel.heading() - this.p5.HALF_PI);
    this.p5.triangle(
      -FAN_SIZE,
      -FAN_SIZE,
      0,
      FAN_SIZE * 2,
      FAN_SIZE,
      -FAN_SIZE
    );
    this.p5.pop();
  }

  getScore(endPos: Vector, maxDist: number) {
    return (
      this.p5.map(this.pos.dist(endPos), maxDist, 0, 0, maxDist) *
      ((this.brain.cells.slice(0, (this.currentStep || 0) + 1).filter(Boolean)
        .length || 1) /
        BRAIN_CAPACITY)
    );
  }
}
