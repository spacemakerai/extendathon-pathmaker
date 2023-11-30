import { DIMENSION } from "./constants";
import { CreateGrid, bfs } from "./graph/bfs";
import { LayerID, getLayerCanvas, layers, updateLayer } from "./layers";
import state from "./state";

export type CostSettings = {
  roadDisount: number;
  scale: number;
};

const canvas = getLayerCanvas(LayerID.COST_MAP, "cost map");

function update() {
  const settings: CostSettings = {
    roadDisount: 0.1,
    scale: 0.1,
  };

  const poi = state.pointsOfInterest.value;
  const goal = poi.length > 0 ? poi[poi.length - 1] : { x: 500, y: 500 };

  const ctx = canvas.getContext("2d");
  const terrainCtx = layers.value[LayerID.TERRAIN].canvas.getContext("2d");
  const roadCtx = layers.value[LayerID.ROADS].canvas.getContext("2d");
  const buildingCtx = layers.value[LayerID.BUILDINGS].canvas.getContext("2d");
  if (!ctx || !terrainCtx || !roadCtx || !buildingCtx) return;
  const output = ctx.createImageData(DIMENSION, DIMENSION);
  const terrainData = terrainCtx.getImageData(0, 0, DIMENSION, DIMENSION).data;
  const roadData = roadCtx.getImageData(0, 0, DIMENSION, DIMENSION).data;
  const buildingData = buildingCtx.getImageData(0, 0, DIMENSION, DIMENSION).data;
  if (!output || !terrainData || !roadData || !buildingData) return;
  const grid = CreateGrid(DIMENSION, 0);
  for (let i = 0; i < output.data.length / 4; i++) {
    const terrain = (255 - terrainData[i * 4]) / 255;
    const road = roadData[i * 4] > 0;
    const building = buildingData[i * 4 + 3] > 127;
    let val = 10000;
    if (!building) {
      val = terrain + (road ? 0 : settings.roadDisount);
      val *= settings.scale
    }
    const x = i % DIMENSION;
    const y = Math.floor(i / DIMENSION);
    grid[x][y] = val;
  }
  const bfsGrid = bfs(grid, Math.round(goal.x), Math.round(goal.y));
  let max = 0;
  for (let i = 0; i < output.data.length / 4; i++) {
    const x = i % DIMENSION;
    const y = Math.floor(i / DIMENSION);
    const val = bfsGrid[x][y];
    if (val >= 10000) continue;
    max = Math.max(max, val);
  }
  for (let i = 0; i < output.data.length / 4; i++) {
    const x = i % DIMENSION;
    const y = Math.floor(i / DIMENSION);
    const scaled = bfsGrid[x][y] / max;
    const clip = scaled > 1 ? 1 : scaled;
    const c = Math.floor(255 * (1 - clip));
    output.data[i * 4 + 0] = c;
    output.data[i * 4 + 1] = c;
    output.data[i * 4 + 2] = c;
    output.data[i * 4 + 3] = 255;
  }
  console.log("putting img data");
  ctx.putImageData(output, 0, 0);
  updateLayer(LayerID.COST_MAP);
}

export default {
  update,
};
