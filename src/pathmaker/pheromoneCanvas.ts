import { DIMENSION } from "./constants.ts";
import { Forma } from "forma-embedded-view-sdk/auto";
import { Point } from "./state.ts";
import { drawCircle } from "./commonCanvas.ts";

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
    position: { x: 0, y: 0, z: 0 },
  });
}

function update(pos: Point[]) {
  if (!ctx || !canvas) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = data[i + 3] * 0.99;
  }

  ctx.putImageData(imgData, 0, 0);

  for (let p of pos) {
    drawCircle(ctx, p, 2, "rgba(0, 255, 0, 100)");
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
    const green = imageData.data[i + 1];
    sum += green;
  }
  const avgNormalized = sum / count / 255;
  return avgNormalized;
}

function clear() {
  Forma.terrain.groundTexture.remove({ name });
}

export default {
  initializeCanvas,
  update,
  samplePos,
  clear,
};
