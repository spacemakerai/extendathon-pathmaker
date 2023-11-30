export type Grid = number[][];
export type Pos = [number, number];
export type Heap<T> = [number, T][];

export function CreateGrid<T>(dim: number, initial: T): T[][] {
  return Array.apply(null, Array(dim)).map(() => Array.apply(null, Array(dim)).map(() => initial));
}

function Swap<T>(h: Heap<T>, i: number, j: number) {
  const temp = h[i];
  h[i] = h[j];
  h[j] = temp;
  //console.log("After Swap", Print(h));
}

function MinHeapify<T>(h: Heap<T>, i: number) {
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  let smallest = i;
  if (left < h.length && h[left][0] < h[smallest][0]) smallest = left;
  if (right < h.length && h[right][0] < h[smallest][0]) smallest = right;
  if (smallest != i) {
    Swap(h, i, smallest);
    MinHeapify(h, smallest);
  }
  //console.log("After MinHeapify", Print(h));
}

function BubbleUp<T>(h: Heap<T>, i: number) {
  if (i == 0) return;
  const parent = Math.floor((i + 1) / 2) - 1;
  if (h[parent][0] >= h[i][0]) {
    Swap(h, i, parent);
    BubbleUp(h, parent);
  }
  //console.log("After BubbleUp", Print(h));
}

function HeapInsert<T>(h: Heap<T>, val: number, node: T) {
  //console.log("INSERTING", val, JSON.stringify(node));
  h.push([val, node]);
  BubbleUp(h, h.length - 1);
  //console.log("AFTER INSERT", JSON.stringify(h));
}

function HeapRemove<T>(h: Heap<T>): [number, T] | undefined {
  //console.log("POPPING");
  if (h.length == 0) return undefined;
  Swap(h, 0, h.length - 1);
  const head = h.pop();
  MinHeapify(h, 0);
  //console.log("RETURNED", JSON.stringify(head));
  return head;
}

export let parents: (undefined | Pos)[][] = CreateGrid(2, undefined);

export function bfs(g: Grid, si: number, sj: number): Grid {
  const dim = g.length;
  let costs: number[][] = CreateGrid(dim, -1);
  parents = CreateGrid<undefined | Pos>(dim, undefined);
  type QueueEntry = number[];
  let queue: Heap<QueueEntry> = [[0, [si, sj, -1, -1]]];
  while (queue.length > 0) {
    const head = HeapRemove(queue);
    if (!head) break;
    const [cost, [ci, cj, pi, pj]] = head;
    if (costs[ci][cj] !== -1) continue;
    costs[ci][cj] = cost;
    parents[ci][cj] = [pi, pj];
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
    for (let [di, dj] of diffs) {
      const ni = ci + di;
      const nj = cj + dj;
      //console.log(`${ni} ${nj}`)
      if (ni < 0 || ni >= dim) continue;
      if (nj < 0 || nj >= dim) continue;
      if (costs[ni][nj] !== -1) continue;
      const n_cost = cost + g[ni][nj];
      HeapInsert(queue, n_cost, [ni, nj, ci, cj]);
    }
  }
  console.log(costs);
  return costs as Grid;
}

// function PushPop<T>(h: Heap<T>, item: T, val: number): Heap<T> {
//   if (h.length > 0 && h[0][0] > val)
// }
