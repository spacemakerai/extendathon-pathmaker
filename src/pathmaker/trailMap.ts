import { DIMENSION } from "./constants";
import { CreateGrid, parents } from "./graph/bfs";
import { LayerID, getLayerCanvas, updateLayer } from "./layers";
import state from "./state";

const canvas = getLayerCanvas(LayerID.TRAIL_MAP, "trail map");

function update() {
  const sources = state.sourcePoints.value;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const output = ctx.createImageData(DIMENSION, DIMENSION);
  if (!output) return;
  const grid = CreateGrid(DIMENSION, 0);

  for (let source of sources) {
    let cur = [Math.round(source.x), Math.round(source.y)];
    while (true) {
      const parent = parents[cur[0]][cur[1]];
      if (!parent || parent[0] == -1 || parent[1] == -1) {
        break;
      }
      grid[cur[0]][cur[1]] = 1;
      cur = parent;
    }
  }

  for (let i = 0; i < output.data.length / 4; i++) {
    const x = i % DIMENSION;
    const y = Math.floor(i / DIMENSION);
    const visited = grid[x][y];
    //const c = Math.floor(255 * (1 - scaled));
    output.data[i * 4 + 0] = 255;
    output.data[i * 4 + 1] = 0;
    output.data[i * 4 + 2] = 0;
    output.data[i * 4 + 3] = visited ? 255 : 0;
  }
  ctx.putImageData(output, 0, 0);
  updateLayer(LayerID.TRAIL_MAP);
}

export default {
  update,
};
