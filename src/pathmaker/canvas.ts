import state, { Point } from "./state.ts";
import { Forma } from "forma-embedded-view-sdk/auto";

export const name = "pathmaker-id";
const DIMENSION = 1000;

let canvas: HTMLCanvasElement | undefined;

function coordinateToCanvasSpace(pos: { x: number; y: number }): { x: number; y: number } {
  return { x: pos.x + DIMENSION / 2, y: DIMENSION / 2 - pos.y };
}

export function initializeCanvas() {
  canvas = document.createElement("canvas", {});
  canvas.height = DIMENSION;
  canvas.width = DIMENSION;

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, DIMENSION, DIMENSION);
  ctx.fillStyle = "red";
  ctx.fillRect(DIMENSION / 4, DIMENSION / 4, DIMENSION / 2, DIMENSION / 2);

  Forma.terrain.groundTexture.add({
    name,
    canvas,
    position: { x: 0, y: 0, z: 0 },
  });
}
initializeCanvas();

function drawCircle(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number },
  radius: number = 10,
) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = "blue";
  ctx.fill();
  //ctx.lineWidth = 5
  //ctx.strokeStyle = "#003300"
  //ctx.stroke()
}

function drawCanvas(points: Point[]) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  console.log(ctx);
  //ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let point of points) {
    drawCircle(ctx, coordinateToCanvasSpace(point));
  }
}

state.points.subscribe((val) => {
  if (!canvas) return;
  drawCanvas(val);
  Forma.terrain.groundTexture.updateTextureData({ name, canvas });
});
