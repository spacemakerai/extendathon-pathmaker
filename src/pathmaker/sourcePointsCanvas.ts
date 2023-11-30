import { Point } from "./state.ts";
import { Forma } from "forma-embedded-view-sdk/auto";
import { CanvasLayerOrder, DIMENSION } from "./constants.ts";
import { drawCircle } from "./helpers.ts";

export const name = "source-points-canvas";

let sourcePointsCanvas: HTMLCanvasElement | undefined;

function initializeCanvas() {
  console.log("initialize");
  sourcePointsCanvas = document.createElement("canvas", {});
  sourcePointsCanvas.height = DIMENSION;
  sourcePointsCanvas.width = DIMENSION;

  Forma.terrain.groundTexture.add({
    name,
    canvas: sourcePointsCanvas,
    position: { x: 0, y: 0, z: CanvasLayerOrder.SOURCES },
  });
}

function draw(points: Point[]) {
  if (!sourcePointsCanvas) return;
  const ctx = sourcePointsCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  ctx.clearRect(0, 0, DIMENSION, DIMENSION);

  for (let point of points) {
    drawCircle(ctx, point, 5, "red");
  }
  Forma.terrain.groundTexture.updateTextureData({ name, canvas: sourcePointsCanvas });
}

function clear() {
  Forma.terrain.groundTexture.remove({ name });
}

export default {
  draw,
  clear,
  initialize: initializeCanvas,
};
