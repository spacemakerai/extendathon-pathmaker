import { Point } from "./state.ts";
import { Forma } from "forma-embedded-view-sdk/auto";
import { drawCircle } from "./helpers.ts";
import { CanvasLayerOrder, DIMENSION } from "./constants.ts";

export const name = "pathmaker-id";

let agentCanvas: HTMLCanvasElement | undefined;

function initializeCanvas() {
  console.log("initialize");
  agentCanvas = document.createElement("canvas", {});
  agentCanvas.height = DIMENSION;
  agentCanvas.width = DIMENSION;

  // const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  //
  // ctx.fillStyle = "green";
  // ctx.fillRect(0, 0, DIMENSION, DIMENSION);
  // ctx.fillStyle = "red";
  // ctx.fillRect(DIMENSION / 4, DIMENSION / 4, DIMENSION / 2, DIMENSION / 2);

  Forma.terrain.groundTexture.add({
    name,
    canvas: agentCanvas,
    position: { x: 0, y: 0, z: CanvasLayerOrder.AGENTS },
  });
}

function draw(points: Point[]) {
  if (!agentCanvas) return;
  const ctx = agentCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  ctx.clearRect(0, 0, DIMENSION, DIMENSION);

  for (let point of points) {
    drawCircle(ctx, point, 5, "red");
  }
  Forma.terrain.groundTexture.updateTextureData({ name, canvas: agentCanvas });
}

function clear() {
  Forma.terrain.groundTexture.remove({ name });
}

export default {
  draw,
  clear,
  initialize: initializeCanvas,
};
