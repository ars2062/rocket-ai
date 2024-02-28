import p5, { Vector } from "p5";
import Rocket from "./models/rocket";
import { BREED_CELL_CHANCE, MUTATION_RATE, TPopulation } from ".";
import { Brain } from "./models/brain";

export function generateRandomAgents(p5: p5, n: number, startPos: Vector, endPos: Vector) {
  return Array(n)
    .fill(null)
    .map(() => new Rocket(p5, startPos, endPos));
}

export function getParents(population: TPopulation, endPos: Vector) {
  const maxDist = Math.max(...population.map(i=>endPos.dist(i.pos)))
  return population.sort((a, b) => b.getScore(endPos, maxDist) - a.getScore(endPos, maxDist)).slice(0,2);
}

export function breedParents(
  p5: p5,
  startPos: Vector,
  endPos: Vector,
  p1: Rocket,
  p2: Rocket,
  count: number
) {
  const population: Rocket[] = [];
  for (let i = 0; i < count; i++) {
    const brain = new Brain(
      p1.brain.cells.map((i, index) =>
        Math.random() > BREED_CELL_CHANCE ? i : p2.brain.cells[index]
      )
    );
    population.push(new Rocket(p5, startPos, endPos, brain));
  }
  return population;
}

export function mutatePopulation(population: TPopulation) {
  for (const rocket of population) {
    for (let i = 0; i < rocket.brain.cells.length; i++) {
      if (Math.random() < MUTATION_RATE) {
        rocket.brain.cells[i] = Brain.generateRandomCell();
      }
    }
  }
}
