import { CanvasLayerOrder, DIMENSION } from "./constants.ts";
import { Forma } from "forma-embedded-view-sdk/auto";
import { Road } from "./roads.ts";
import { coordinateToCanvasSpace, sampleChannelForPos } from "./helpers.ts";
import { Point } from "./state.ts";

export const name = "roads-canvas";

let roadCanvas: HTMLCanvasElement | undefined;

export function initializeCanvas() {
  console.log("initialize");
  roadCanvas = document.createElement("canvas", {});
  roadCanvas.height = DIMENSION;
  roadCanvas.width = DIMENSION;

  Forma.terrain.groundTexture.add({
    name,
    canvas: roadCanvas,
    position: { x: 0, y: 0, z: CanvasLayerOrder.ROADS },
  });
}

function draw(roads: Road[]) {
  if (!roadCanvas) return;
  const ctx = roadCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  ctx.clearRect(0, 0, DIMENSION, DIMENSION);
  for (let road of roads) {
    drawRoad(ctx, road);
  }
  Forma.terrain.groundTexture.updateTextureData({ name, canvas: roadCanvas });
}

function drawRoad(ctx: CanvasRenderingContext2D, road: Road) {
  if (road.length < 2) return;
  const start = coordinateToCanvasSpace(road[0]);
  ctx.moveTo(start.x, start.y);
  for (let i = 1; i < road.length; i++) {
    const point = coordinateToCanvasSpace(road[i]);
    ctx.lineTo(point.x, point.y);
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255, 0, 0, 255)";
  ctx.stroke();
}

function samplePos(pos: Point) {
  if (!roadCanvas) return 0;
  const ctx = roadCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return 0;
  return sampleChannelForPos(ctx, pos, 0, 10);
}

export default {
  draw,
  initialize: initializeCanvas,
  samplePos,
};
