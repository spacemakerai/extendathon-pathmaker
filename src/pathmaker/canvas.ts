import { Point } from "./state.ts";
import { Forma } from "forma-embedded-view-sdk/auto";
import { Building } from "./buildings.ts";
import { Road } from "./roads.ts";

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

function drawRoad(ctx: CanvasRenderingContext2D, road: Road) {
  if (road.length < 2) return;
  const start = coordinateToCanvasSpace(road[0]);
  ctx.moveTo(start.x, start.y);
  for (let i = 1; i < road.length; i++) {
    const point = coordinateToCanvasSpace(road[i]);
    ctx.lineTo(point.x, point.y);
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#ccc";
  ctx.stroke();
}

function drawTriangle(ctx: CanvasRenderingContext2D, triangle: [Point, Point, Point]) {
  const [_p1, _p2, _p3] = triangle;
  const p1 = coordinateToCanvasSpace(_p1);
  const p2 = coordinateToCanvasSpace(_p2);
  const p3 = coordinateToCanvasSpace(_p3);
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.fillStyle = "black";
  ctx.fill();
}

function draw(points: Point[], roads: Road[], buildings: Building[]) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  console.log(ctx);
  //ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let point of points) {
    drawCircle(ctx, coordinateToCanvasSpace(point));
  }
  for (let road of roads) {
    drawRoad(ctx, road);
  }
  for (let building of buildings) {
    for (let triangle of building.triangles) {
      drawTriangle(ctx, triangle);
    }
  }
  //Move to a better location:
  Forma.terrain.groundTexture.updateTextureData({ name, canvas });
}

export default { draw };
