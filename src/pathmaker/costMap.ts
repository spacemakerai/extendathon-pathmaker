import { DIMENSION } from "./constants";
import { LayerID, getLayerCanvas, layers, updateLayer } from "./layers";

export type CostSettings = {
  roadDisount: number;
};

const canvas = getLayerCanvas(LayerID.COST_MAP, "cost map");

function update() {
  const settings: CostSettings = {
    roadDisount: 0.1,
  };
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
  for (let i = 0; i < output.data.length / 4; i++) {
    const terrain = (255 - terrainData[i * 4]) / 255;
    const road = roadData[i * 4] > 0;
    const building = buildingData[i * 4 + 3] > 127;
    let val = 1 + settings.roadDisount;
    if (!building) {
      val = terrain + (road ? 0 : settings.roadDisount);
    }
    const scaled = val / (1 + settings.roadDisount);
    const c = Math.floor(255 * (1 - scaled));
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
