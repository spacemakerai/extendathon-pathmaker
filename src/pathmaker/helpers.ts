import { DIMENSION } from "./constants.ts";

export function coordinateToCanvasSpace(pos: { x: number; y: number }): { x: number; y: number } {
  return { x: pos.x + DIMENSION / 2, y: DIMENSION / 2 - pos.y };
}
