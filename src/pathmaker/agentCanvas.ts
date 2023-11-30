import { Point } from "./state.ts";
import { Forma } from "forma-embedded-view-sdk/auto";
import { DIMENSION } from "./constants.ts";
import { drawCircle, drawRoad, drawTriangle } from "./commonCanvas.ts";
import { Building } from "./buildings.ts";
import { Road } from "./roads.ts";

export const name = "pathmaker-id";

let agentCanvas: HTMLCanvasElement | undefined;

export function initializeCanvas() {
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
    position: { x: 0, y: 0, z: 0 },
  });
}

function draw(points: Point[], roads: Road[], buildings: Building[]) {
  if (!agentCanvas) return;
  const ctx = agentCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  ctx.clearRect(0, 0, DIMENSION, DIMENSION);

  for (let point of points) {
    drawCircle(ctx, point, 5, "red");
  }
  for (let building of buildings) {
    for (let triangle of building.triangles) {
      drawTriangle(ctx, triangle);
    }
  }
  for (let road of roads) {
    drawRoad(ctx, road);
  }

  Forma.terrain.groundTexture.updateTextureData({ name, canvas: agentCanvas });
}

function clear() {
  Forma.terrain.groundTexture.remove({ name });
}

export default {
  draw,
  clear,
};
