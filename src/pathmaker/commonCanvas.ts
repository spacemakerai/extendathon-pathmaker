import { coordinateToCanvasSpace } from "./helpers.ts";
import { Point } from "./state.ts";
import { Road } from "./roads.ts";

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number },
  radius: number = 5,
  color: CanvasRenderingContext2D["fillStyle"],
) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();

  //ctx.lineWidth = 5
  //ctx.strokeStyle = "#003300"
  //ctx.stroke()
}

export function drawTriangle(ctx: CanvasRenderingContext2D, triangle: [Point, Point, Point]) {
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

export function drawRoad(ctx: CanvasRenderingContext2D, road: Road) {
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
