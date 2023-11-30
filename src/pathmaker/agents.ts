import agentCanvas from "./agentCanvas.ts";
import { DIMENSION } from "./constants.ts";
import pheromone from "./pheromoneCanvas.ts";
import { Point } from "./state.ts";
import buildings from "./buildings.ts";
import roads from "./roads.ts";

type Agent = {
  pos: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
};

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const NUMBER_OF_AGENTS = 100;
const SPEED = 4;

const agents: Agent[] = Array.apply(null, Array(NUMBER_OF_AGENTS)).map((_) => ({
  pos: { x: random(0, DIMENSION), y: random(0, DIMENSION) },
  velocity: multiply(normalize({ x: random(-1, 1), y: random(-1, 1) }), SPEED),
}));

function bound(val: number, max: number) {
  return (val + max) % max;
}

function move(pos: Agent["pos"], velocity: Agent["velocity"]): Agent["pos"] {
  return { x: bound(pos.x + velocity.x, DIMENSION), y: bound(pos.y + velocity.y, DIMENSION) };
}

function normalize(vec: Point): Point {
  const dist = Math.sqrt(vec.x ** 2 + vec.y ** 2);
  return { x: vec.x / dist, y: vec.y / dist };
}

function multiply(vec: Point, factor: number): Point {
  return { x: vec.x * factor, y: vec.y * factor };
}

function add(v1: Point, v2: Point): Point {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

const DISTANCE = 50;
const RADIUS = 20;

function updateVelocity(pos: Agent["pos"], velocity: Agent["velocity"]): Agent["pos"] {
  const frontDir = normalize(velocity);
  const leftDir: Point = { x: frontDir.y, y: -frontDir.x };
  const rightDir: Point = { x: -frontDir.y, y: frontDir.x };

  const front = pheromone.samplePos(add(pos, multiply(frontDir, DISTANCE)), RADIUS);
  const right = pheromone.samplePos(add(pos, multiply(rightDir, DISTANCE)), RADIUS);
  const left = pheromone.samplePos(add(pos, multiply(leftDir, DISTANCE)), RADIUS);

  if (left > front && left > right) {
    return multiply(normalize(add(velocity, multiply(leftDir, left))), SPEED);
  } else if (right > left && right > front) {
    return multiply(normalize(add(velocity, multiply(rightDir, right))), SPEED);
  } else {
    return multiply(normalize(add(velocity, multiply(frontDir, front))), SPEED);
  }
}

function step() {
  for (let a of agents) {
    a.pos = move(a.pos, a.velocity);
    a.velocity = updateVelocity(a.pos, a.velocity);
  }
  pheromone.update(agents.map((a) => a.pos));
}

const buildingTriangles = await buildings.get();
const roadLines = await roads.get();

function animate() {
  agentCanvas.draw(
    agents.map((a) => a.pos),
    roadLines,
    buildingTriangles,
  );
  step();
  requestAnimationFrame(animate);
}

animate();
