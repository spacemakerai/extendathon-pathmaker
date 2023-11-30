import agentCanvas from "./agentCanvas.ts";
import { DIMENSION } from "./constants.ts";
import pheromone from "./pheromoneCanvas.ts";
import state, { Point } from "./state.ts";
import roadCanvas from "./roadCanvas.ts";

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

const NUMBER_OF_AGENTS = 1000;
const SPEED = 4;

const KEEP_SPEED_WEIGHT = 1;
const PHEROMONE_WEIGHT = 1;
const POINT_WEIGHT = 0.5;
const ROAD_WEIGHT = 1;

const agents: Agent[] = Array.apply(null, Array(NUMBER_OF_AGENTS)).map((_) => ({
  pos: { x: random(0, DIMENSION), y: random(0, DIMENSION) },
  velocity: multiply(normalize({ x: random(-1, 1), y: random(-1, 1) }), SPEED),
}));

function bound(val: number, max: number) {
  return (val + max) % max;
}

function move(pos: Agent["pos"], velocity: Agent["velocity"]): Agent["pos"] {
  return { x: pos.x + velocity.x, y: pos.y + velocity.y };
}

function normalize(vec: Point): Point {
  const dist = Math.sqrt(vec.x ** 2 + vec.y ** 2);
  if (dist === 0) {
    return { x: 0, y: 0 };
  }
  return { x: vec.x / dist, y: vec.y / dist };
}

function multiply(vec: Point, factor: number): Point {
  return { x: vec.x * factor, y: vec.y * factor };
}

function setLength(vec: Point, length: number) {
  const dist = Math.sqrt(vec.x ** 2 + vec.y ** 2);
  return { x: (vec.x / dist) * length, y: (vec.y / dist) * length };
}

function length(vec: Point) {
  return Math.sqrt(vec.x ** 2 + vec.y ** 2);
}

function add(v1: Point, v2: Point): Point {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

function adds(vs: Point[]): Point {
  return vs.reduce((prev, curr) => add(prev, curr), { x: 0, y: 0 });
}

function sub(v1: Point, v2: Point): Point {
  return { x: v1.x - v2.x, y: v1.y - v2.y };
}

const ANGLE_DIFF = Math.PI / 4;

function getPheromoneEffect(pos: Agent["pos"], velocity: Agent["velocity"]): Agent["pos"] {
  const DISTANCE = 50;
  const RADIUS = 20;

  const frontDir = normalize(velocity);

  const angle = Math.atan2(frontDir.y, frontDir.x);
  const rightAngle = angle - ANGLE_DIFF;
  const rightDir = { x: Math.cos(rightAngle), y: Math.sin(rightAngle) };
  const leftAngle = angle + ANGLE_DIFF;
  const leftDir = { x: Math.cos(leftAngle), y: Math.sin(leftAngle) };

  // const leftDir: Point = { x: frontDir.y, y: -frontDir.x };
  // const rightDir: Point = { x: -frontDir.y, y: frontDir.x };

  const front = pheromone.samplePos(add(pos, multiply(frontDir, DISTANCE)), RADIUS);
  const right = pheromone.samplePos(add(pos, multiply(rightDir, DISTANCE)), RADIUS);
  const left = pheromone.samplePos(add(pos, multiply(leftDir, DISTANCE)), RADIUS);

  if (left > front && left > right) {
    return normalize(multiply(leftDir, left));
  } else if (right > left && right > front) {
    return normalize(multiply(rightDir, right));
  } else {
    return normalize(multiply(frontDir, front));
  }
}

function getRoadEffect(pos: Agent["pos"], velocity: Agent["velocity"]): Agent["pos"] {
  const DISTANCE = 30;

  const frontDir = normalize(velocity);

  const angle = Math.atan2(frontDir.y, frontDir.x);
  const rightAngle = angle - ANGLE_DIFF;
  const rightDir = { x: Math.cos(rightAngle), y: Math.sin(rightAngle) };
  const leftAngle = angle + ANGLE_DIFF;
  const leftDir = { x: Math.cos(leftAngle), y: Math.sin(leftAngle) };

  const front = roadCanvas.samplePos(add(pos, multiply(frontDir, DISTANCE)));
  const right = roadCanvas.samplePos(add(pos, multiply(rightDir, DISTANCE)));
  const left = roadCanvas.samplePos(add(pos, multiply(leftDir, DISTANCE)));

  if (left > front && left > right) {
    return normalize(multiply(leftDir, left));
  } else if (right > left && right > front) {
    return normalize(multiply(rightDir, right));
  } else {
    return normalize(multiply(frontDir, front));
  }
}

function getPointEffect(pos: Agent["pos"]) {
  const effects: Point[] = [];

  for (let point of state.pointsOfInterest.value) {
    const diff = sub(point, pos);
    const distance = length(diff);
    const scaled = multiply(diff, 1 / distance ** 2);
    effects.push(scaled);
  }

  const sum = adds(effects);
  return normalize(sum);
}

function updateVelocity(pos: Agent["pos"], velocity: Agent["velocity"]): Agent["velocity"] {
  const pheromoneEffect = getPheromoneEffect(pos, velocity);
  const pointEffect = getPointEffect(pos);
  const roadEffect = getRoadEffect(pos, velocity);

  const sum = adds([
    multiply(normalize(velocity), KEEP_SPEED_WEIGHT),
    multiply(pheromoneEffect, PHEROMONE_WEIGHT),
    multiply(pointEffect, POINT_WEIGHT),
    multiply(roadEffect, ROAD_WEIGHT),
  ]);

  return setLength(sum, SPEED);
}

function step() {
  for (let a of agents) {
    const testPos = move(a.pos, a.velocity);
    if (testPos.x > DIMENSION || testPos.y > DIMENSION || testPos.x < 0 || testPos.y < 0) {
      a.velocity = multiply(a.velocity, -1);
    }
    a.pos = move(a.pos, a.velocity);
    a.velocity = updateVelocity(a.pos, a.velocity);
  }
  pheromone.update(agents.map((a) => a.pos));
}

export function updateAgentCanvas(showAgents: boolean) {
  agentCanvas.draw(showAgents ? agents.map((a) => a.pos) : []);
}

export function runSimulateAndAnimateLoop() {
  updateAgentCanvas(true);
  step();
  requestAnimationFrame(runSimulateAndAnimateLoop);
}
