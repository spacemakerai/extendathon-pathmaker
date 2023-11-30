import { DIMENSION } from "./constants";
import { CreateGrid, costs } from "./graph/bfs";
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
  let maxGrid = 0;

  for (let source of sources) {
    for (let _instance of Array(100)) {
      let cur = [Math.round(source.x), Math.round(source.y)];
      let step = 0;
      while (step < 2000) {
        const [ci, cj] = cur;
        if (costs[ci][cj] == 0) break;
        const diffs = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ];
        let nexts = [];
        for (let [di, dj] of diffs) {
          const ni = ci + di;
          const nj = cj + dj;
          if (ni < 0 || ni >= DIMENSION) continue;
          if (nj < 0 || nj >= DIMENSION) continue;
          const n_cost = costs[ni][nj];
          nexts.push([n_cost, ni, nj]);
        }
        const temp = 2;
        const maxcost = nexts.map(([p]) => p).reduce((a, b) => Math.max(a, b), 0);
        const mincost = nexts.map(([p]) => p).reduce((a, b) => Math.min(a, b), 10000);
        const adjusted = nexts.map(([p, ...rest]) => [
          1 - (p - mincost) / (maxcost - mincost) + temp,
          ...rest,
        ]);
        const probsum = adjusted.map(([p]) => p).reduce((a, b) => a + b, 0);
        const probs = adjusted.map(([p, ...rest]) => [p / probsum, ...rest]);
        probs.sort((a, b) => a[0] - b[0]);
        //console.log("adjusted", JSON.stringify(adjusted.map(([p]) => p)));
        //console.log("probs", JSON.stringify(probs.map(([p]) => p)));
        const draw = Math.random();
        let chosen = 0;
        let cumulativeProb = 0;
        while (cumulativeProb < draw && chosen < probs.length - 1) {
          chosen += 1;
          cumulativeProb += probs[chosen][0];
        }
        grid[cur[0]][cur[1]] += 1;
        maxGrid = Math.max(maxGrid, Math.log(grid[cur[0]][cur[1]] + 1));
        cur = [probs[chosen][1], probs[chosen][2]];
        step += 1;
      }
    }
  }

  for (let i = 0; i < output.data.length / 4; i++) {
    const x = i % DIMENSION;
    const y = Math.floor(i / DIMENSION);
    const visited = Math.log(grid[x][y] + 1) / maxGrid;
    //const c = Math.floor(255 * (1 - scaled));
    output.data[i * 4 + 0] = 255;
    output.data[i * 4 + 1] = 0;
    output.data[i * 4 + 2] = 0;
    output.data[i * 4 + 3] = Math.round(visited * 255);
  }
  ctx.putImageData(output, 0, 0);
  updateLayer(LayerID.TRAIL_MAP);
}

export default {
  update,
};
