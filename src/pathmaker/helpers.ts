import { DIMENSION } from "./constants.ts";
import { Point } from "./state.ts";

export function coordinateToCanvasSpace(pos: { x: number; y: number }): { x: number; y: number } {
  return { x: pos.x + DIMENSION / 2, y: DIMENSION / 2 - pos.y };
}

export function canvasSpaceToCoordinate(pos: { x: number; y: number }): { x: number; y: number } {
  return { x: pos.x - DIMENSION / 2, y: DIMENSION / 2 - pos.y };
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
