import { DIMENSION } from "./constants.ts";
import { Building } from "./buildings.ts";
import { drawTriangle } from "./helpers.ts";
import { LayerID, getLayerCanvas, updateLayer } from "./layers.tsx";

export const name = "building-canvas";

const buildingCanvas = getLayerCanvas(LayerID.BUILDINGS, "buildings");

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
  updateLayer(LayerID.BUILDINGS);
}

export default {
  draw,
};
