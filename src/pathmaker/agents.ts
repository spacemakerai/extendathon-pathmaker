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
  targetType: "origin" | "destination";
  targetIndex: number;
};

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

let agents: Agent[] = [];

function initializeAgents() {
  agents = Array.apply(null, Array(state.agentWeights.value.agentCount)).map((_) => {
    const originIndex = randomInt(state.sourcePoints.value.length);
    let originPos: Point | undefined;
    if (originIndex < state.sourcePoints.value.length) {
      originPos = state.sourcePoints.value[originIndex];
    } else {
      originPos = { x: random(0, DIMENSION), y: random(0, DIMENSION) };
    }

    return {
      pos: originPos,
      velocity: multiply(normalize({ x: random(-1, 1), y: random(-1, 1) }), state.agentWeights.value.agentSpeed),
      targetType: "destination",
      targetIndex: randomInt(state.pointsOfInterest.value.length),
    };
  });
}

//@ts-ignore
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

function randomInt(max: number) {
  return Math.floor(Math.random() * (max + 1));
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

function getTargetPosition(agent: Agent): Point | undefined {
  let target: Point | undefined;
  if (agent.targetType === "destination") {
    target = state.pointsOfInterest.value[agent.targetIndex];
  } else {
    target = state.sourcePoints.value[agent.targetIndex];
  }
  return target;
}

function getPointEffect(agent: Agent) {
  const target = getTargetPosition(agent);

  if (!target) return { x: 0, y: 0 };

  return normalize(sub(target, agent.pos));
}

function updateVelocity(agent: Agent): Agent["velocity"] {
  const pheromoneEffect = getPheromoneEffect(agent.pos, agent.velocity);
  const pointEffect = getPointEffect(agent);
  const roadEffect = getRoadEffect(agent.pos, agent.velocity);

  const sum = adds([
    multiply(normalize(agent.velocity), state.agentWeights.value.keepSpeed),
    multiply(pheromoneEffect, state.agentWeights.value.pheromone),
    multiply(pointEffect, state.agentWeights.value.point),
    multiply(roadEffect, state.agentWeights.value.road),
  ]);

  return setLength(sum, state.agentWeights.value.agentSpeed);
}

const REACHED_DESTINATION_THRESHOLD = 10;

function updateTarget(agent: Agent) {
  const target = getTargetPosition(agent);
  if (!target || length(sub(target, agent.pos)) < REACHED_DESTINATION_THRESHOLD) {
    agent.targetType = agent.targetType === "destination" ? "origin" : "destination";
    agent.targetIndex =
      agent.targetType === "destination"
        ? randomInt(state.pointsOfInterest.value.length)
        : randomInt(state.sourcePoints.value.length);
  }
}

function step() {
  for (let a of agents) {
    const testPos = move(a.pos, a.velocity);
    if (testPos.x > DIMENSION || testPos.y > DIMENSION || testPos.x < 0 || testPos.y < 0) {
      a.velocity = multiply(a.velocity, -1);
    }
    a.pos = move(a.pos, a.velocity);
    a.velocity = updateVelocity(a);
    updateTarget(a);
  }
  pheromone.update(agents.map((a) => a.pos));
}

export function updateAgentCanvas(showAgents: boolean) {
  agentCanvas.draw(showAgents ? agents.map((a) => a.pos) : []);
}

function runSimulateAndAnimateLoop() {
  updateAgentCanvas(true);
  step();
  requestAnimationFrame(runSimulateAndAnimateLoop);
}

export function startAgents() {
  initializeAgents();
  runSimulateAndAnimateLoop();
}
