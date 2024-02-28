import { Vector } from "p5";
import { BRAIN_CAPACITY, LAZY_ROCKET_CHANCE } from "..";

export type TCell = Vector | null

export class Brain {
  cells: TCell[];
  constructor(cells: TCell[]) {
    this.cells = cells;
  }

  static random(cellLength = BRAIN_CAPACITY) {
    return new Brain(
      Array(cellLength)
        .fill(null)
        .map(() => this.generateRandomCell())
    );
  }

  static generateRandomCell(): TCell{
    return Math.random() < LAZY_ROCKET_CHANCE ? null : Vector.random2D();
  }
}
