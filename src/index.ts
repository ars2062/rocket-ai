import P5, { Vector } from "p5";
import Rocket from "./models/rocket";
import {
  breedParents,
  generateRandomAgents,
  getParents,
  mutatePopulation,
} from "./evolution";
import Wall from "./models/wall";
export let POPULATION_COUNT = 1000;
export const CANVAS_SIZE = 600;
export const MOVE_EVERY = 100;
export let MUTATION_RATE = 0.1;
export let BREED_CELL_CHANCE = 0.5;
export let BRAIN_CAPACITY = 300;
export let LAZY_ROCKET_CHANCE = 0.3;

export const POINT_SIZE = 20;

export type TPopulation = Rocket[];

interface CheckboxElement extends P5.Element {
  checked: () => boolean;
}

new P5((p5: P5) => {
  let population: TPopulation;
  let startPos: Vector;
  let endPos: Vector;
  let populationSlider: P5.Element;
  let mutationSlider: P5.Element;
  let breedSlider: P5.Element;
  let brainSlider: P5.Element;
  let lazyRocketSlider: P5.Element;
  let renderAllCheckbox: CheckboxElement;
  let renderBestCheckbox: CheckboxElement;
  const walls: Wall[] = [];
  let started = false;

  function generateRandomPopulation() {
    population = generateRandomAgents(p5, POPULATION_COUNT, startPos, endPos);
  }

  p5.setup = () => {
    p5.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    startPos = p5.createVector(p5.width / 2, p5.height - 20);
    endPos = p5.createVector(p5.width / 2, 20);

    generateRandomPopulation();

    const startBtn = p5.createButton("start");
    startBtn.mouseClicked(() => {
      started = true;
    });
    const resetBtn = p5.createButton("reset");
    resetBtn.mouseClicked(() => {
      started = false;
      population = generateRandomAgents(p5, POPULATION_COUNT, startPos, endPos);
      walls.splice(0);
      counter = 0;
      stepCounter = 0;
      startPos = p5.createVector(p5.width / 2, p5.height - 20);
      endPos = p5.createVector(p5.width / 2, 20);
    });

    populationSlider = p5.createSlider(10, 5000, POPULATION_COUNT);
    populationSlider.mouseReleased(() => {
      POPULATION_COUNT = +populationSlider.value();
    });
    mutationSlider = p5.createSlider(0, 1, MUTATION_RATE, 0.01);
    mutationSlider.mouseReleased(() => {
      MUTATION_RATE = +mutationSlider.value();
    });
    breedSlider = p5.createSlider(0, 1, BREED_CELL_CHANCE, 0.01);
    breedSlider.mouseReleased(() => {
      BREED_CELL_CHANCE = +breedSlider.value();
    });
    brainSlider = p5.createSlider(10, 1000, BRAIN_CAPACITY);
    brainSlider.mouseReleased(() => {
      BRAIN_CAPACITY = +brainSlider.value();
    });
    lazyRocketSlider = p5.createSlider(0, 1, LAZY_ROCKET_CHANCE, 0.01);
    lazyRocketSlider.mouseReleased(() => {
      LAZY_ROCKET_CHANCE = +lazyRocketSlider.value();
    });

    renderAllCheckbox = p5.createCheckbox(
      "render all?",
      true
    ) as CheckboxElement;
    renderBestCheckbox = p5.createCheckbox(
      "render best?",
      true
    ) as CheckboxElement;
  };
  let counter = 0;
  let stepCounter = 0;
  p5.draw = () => {
    p5.background(0);

    p5.fill("blue");
    if (movingStartPos) {
      p5.circle(p5.mouseX, p5.mouseY, POINT_SIZE);
    } else {
      p5.circle(startPos.x, startPos.y, POINT_SIZE);
    }
    p5.fill("green");
    if (movingEndPos) {
      p5.circle(p5.mouseX, p5.mouseY, POINT_SIZE);
    } else {
      p5.circle(endPos.x, endPos.y, POINT_SIZE);
    }
    if (wallP1) {
      const mousePoint = p5.createVector(p5.mouseX, p5.mouseY);
      new Wall(p5, wallP1, mousePoint).draw();
    }
    if (started) {
      if (population.every((i) => i.isDead)) {
        /**
         * all the agents are dead now we need to create the new population
         */
        stepCounter = 0;
        counter = 0;
        /**
         * get the bes two parents
         */
        const [p1, p2] = getParents(population, endPos);
        p1.draw([255, 0, 0]);
        p2.draw([255, 0, 0]);
        console.log(
          "two best agent brains: ",
          JSON.parse(JSON.stringify(p1.brain.cells)),
          JSON.parse(JSON.stringify(p2.brain.cells))
        );
        console.log(
          "p1 laziness: ",
          (p1.brain.cells.filter((i) => i === null).length / BRAIN_CAPACITY * 100).toFixed(2) + '%'
        );
        console.log(
          "p2 laziness: ",
          (p2.brain.cells.filter((i) => i === null).length / BRAIN_CAPACITY * 100).toFixed(2) + '%'
        );

        /**
         * generate new population from parents
         */
        const newPopulation = breedParents(
          p5,
          startPos,
          endPos,
          p1,
          p2,
          POPULATION_COUNT
        );
        /**
         * mutate the new population
         */
        mutatePopulation(newPopulation);
        /**
         * replace with the dead population
         */
        population = newPopulation;
      }
      population.forEach((r) => {
        r.update();
        if (counter % MOVE_EVERY) r.move(stepCounter);
        for (const wall of walls) {
          if (wall.isCollidingWithRocket(r)) {
            r._isDead = true;
          }
        }
        if (renderAllCheckbox.checked()) r.draw();
      });

      if (renderBestCheckbox.checked()) {
        getParents(population, endPos)[0].draw([0, 255, 0]);
      }

      if (counter % MOVE_EVERY) stepCounter++;
      counter++;
    }
    walls.forEach((wall) => {
      wall.draw();
    });
    const textX = 10;
    const textY = p5.height - 100;
    const textSpace = 15;
    p5.fill(255);
    p5.text(`population count: ${populationSlider.value()}`, textX, textY);
    p5.text(
      `mutation rate: ${mutationSlider.value()}`,
      textX,
      textY + textSpace * 1
    );
    p5.text(
      `parent selection chance: ${breedSlider.value()}`,
      textX,
      textY + textSpace * 2
    );
    p5.text(
      `brain capacity: ${brainSlider.value()}`,
      textX,
      textY + textSpace * 3
    );
    p5.text(
      `lazy rocket cell chance: ${lazyRocketSlider.value()}`,
      textX,
      textY + textSpace * 4
    );
  };

  let wallP1: Vector | undefined;
  let movingStartPos = false;
  let movingEndPos = false;

  p5.mousePressed = () => {
    if (!started) {
      const mousePoint = p5.createVector(p5.mouseX, p5.mouseY);
      if (startPos.dist(mousePoint) <= POINT_SIZE / 2) {
        movingStartPos = true;
      } else if (endPos.dist(mousePoint) <= POINT_SIZE / 2) {
        movingEndPos = true;
      } else {
        wallP1 = mousePoint;
      }
    }
  };

  p5.mouseReleased = () => {
    if (!started) {
      const mousePoint = p5.createVector(p5.mouseX, p5.mouseY);

      if (movingStartPos) {
        startPos = mousePoint;
        movingStartPos = false;
        generateRandomPopulation();
      } else if (movingEndPos) {
        endPos = mousePoint;
        movingEndPos = false;
        generateRandomPopulation();
      } else if (wallP1) {
        walls.push(new Wall(p5, wallP1, mousePoint));
        wallP1 = undefined;
      }
    }
  };
});
