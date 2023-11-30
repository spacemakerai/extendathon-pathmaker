import { Point } from "./state.ts";
import { Forma } from "forma-embedded-view-sdk/auto";
import { DIMENSION } from "./constants.ts";
import { drawCircle } from "./helpers.ts";

export const name = "poi-canvas";

let pointOfInterestCanvas: HTMLCanvasElement | undefined;

function initializeCanvas() {
  console.log("initialize");
  pointOfInterestCanvas = document.createElement("canvas", {});
  pointOfInterestCanvas.height = DIMENSION;
  pointOfInterestCanvas.width = DIMENSION;

  Forma.terrain.groundTexture.add({
    name,
    canvas: pointOfInterestCanvas,
    position: { x: 0, y: 0, z: 0 },
  });
}

function draw(points: Point[]) {
  if (!pointOfInterestCanvas) return;
  const ctx = pointOfInterestCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  ctx.clearRect(0, 0, DIMENSION, DIMENSION);

  for (let point of points) {
    drawCircle(ctx, point, 5, "blue");
  }
  Forma.terrain.groundTexture.updateTextureData({ name, canvas: pointOfInterestCanvas });
}

function clear() {
  Forma.terrain.groundTexture.remove({ name });
}

export default {
  draw,
  clear,
  initialize: initializeCanvas,
};
