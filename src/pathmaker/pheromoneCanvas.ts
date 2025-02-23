import { CanvasLayerOrder, DIMENSION } from "./constants.ts";
import { Forma } from "forma-embedded-view-sdk/auto";
import state, { Point } from "./state.ts";
import { drawCircle } from "./helpers.ts";
import { Agent } from "./agents.ts";

let canvas: HTMLCanvasElement | undefined;
let ctx: CanvasRenderingContext2D | null;
const name = "pheromone";

function initializeCanvas() {
  console.log("initialize");
  canvas = document.createElement("canvas", {});
  canvas.height = DIMENSION;
  canvas.width = DIMENSION;
  ctx = canvas.getContext("2d");

  Forma.terrain.groundTexture.add({
    name,
    canvas,
    position: { x: 0, y: 0, z: CanvasLayerOrder.PHEROMONES },
  });
}

function update(agents: Agent[]) {
  if (!ctx || !canvas) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = data[i + 3] * state.agentWeights.value.pheromoneDecay;
    if (data[i + 3] < 100) {
      data[i + 3] = 0;
      data[i + 1] = 0;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  for (let a of agents) {
    drawCircle(ctx, a.pos, 1.5, `rgba(0, 255, 0, ${a.pheromoneLevel * 0.8})`);
  }

  Forma.terrain.groundTexture.updateTextureData({ name, canvas });
}

function samplePos(pos: Point, radius: number = 10): number {
  if (!canvas) return 0;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return 0;
  const imageData = ctx.getImageData(pos.x - radius, pos.y - radius, radius * 2, radius * 2);
  const count = imageData.data.length / 4;
  let sum = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    const green = (imageData.data[i + 1] * imageData.data[i + 3]) / 255;
    sum += green;
  }
  return sum / count / 255;
}

function remove() {
  Forma.terrain.groundTexture.remove({ name });
}

function resetCanvas() {
  if (!canvas) return;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  ctx.clearRect(0, 0, DIMENSION, DIMENSION);
}

state.pointsOfInterest.subscribe(() => {
  resetCanvas();
});

state.sourcePoints.subscribe(() => {
  resetCanvas();
});

state.numberOfAgents.subscribe(() => {
  resetCanvas();
});

export default {
  initialize: initializeCanvas,
  update,
  samplePos,
  remove,
  resetCanvas,
};
