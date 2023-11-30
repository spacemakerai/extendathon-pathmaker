import { DIMENSION } from "./constants.ts";
import { Forma } from "forma-embedded-view-sdk/auto";
import { Building } from "./buildings.ts";
import { drawTriangle } from "./helpers.ts";

export const name = "building-canvas";

let buildingCanvas: HTMLCanvasElement | undefined;

export function initializeCanvas() {
  console.log("initialize");
  buildingCanvas = document.createElement("canvas", {});
  buildingCanvas.height = DIMENSION;
  buildingCanvas.width = DIMENSION;

  Forma.terrain.groundTexture.add({
    name,
    canvas: buildingCanvas,
    position: { x: 0, y: 0, z: 0 },
  });
}

function draw(buildings: Building[]) {
  if (!buildingCanvas) return;
  const ctx = buildingCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  ctx.clearRect(0, 0, DIMENSION, DIMENSION);
  for (let building of buildings) {
    for (let triangle of building.triangles) {
      drawTriangle(ctx, triangle);
    }
  }
  console.log("drawing buildings", buildings.length);
  Forma.terrain.groundTexture.updateTextureData({ name, canvas: buildingCanvas });
}

export default {
  draw,
  initialize: initializeCanvas,
};
