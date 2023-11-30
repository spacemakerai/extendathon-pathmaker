import { DIMENSION } from "./constants.ts";
import { Road } from "./roads.ts";
import { coordinateToCanvasSpace, sampleChannelForPos } from "./helpers.ts";
import { Point } from "./state.ts";
import { LayerID, getLayerCanvas, updateLayer } from "./layers.tsx";

export const name = "roads-canvas";

const roadCanvas = getLayerCanvas(LayerID.ROADS, "roads");

function draw(roads: Road[]) {
  if (!roadCanvas) return;
  const ctx = roadCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  ctx.clearRect(0, 0, DIMENSION, DIMENSION);
  for (let road of roads) {
    drawRoad(ctx, road);
  }
  updateLayer(LayerID.ROADS);
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
  samplePos,
};
