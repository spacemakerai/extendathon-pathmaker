import { effect, signal } from "@preact/signals";
import buildings, { Building } from "./buildings.ts";
import roads, { Road } from "./roads.ts";
import buildingCanvas from "./buildingCanvas.ts";
import roadCanvas from "./roadCanvas.ts";
import pointOfInterestCanvas from "./pointOfInterestCanvas.ts";
import sourcePointsCanvas from "./sourcePointsCanvas.ts";

export type Point = { x: number; y: number };
export type Weights = {
  keepSpeed: number;
  pheromone: number;
  point: number;
  road: number;
};

const pointsOfInterest = signal<Point[]>([]);
const sourcePoints = signal<Point[]>([]);
const buildingsState = signal<Building[]>([]);
const visibleCanvas = signal({ buildings: true, roads: true });
const agentWeights = signal({
  keepSpeed: 1,
  pheromone: 1,
  point: 0.5,
  road: 1,
});

setTimeout(async () => {
  buildingsState.value = await buildings.get();
  roadState.value = await roads.get();
}, 0);
const roadState = signal<Road[]>([]);

effect(() => {
  if (visibleCanvas.value.buildings) {
    buildingCanvas.draw(buildingsState.value);
  }
});

effect(() => {
  if (visibleCanvas.value.roads) {
    roadCanvas.draw(roadState.value);
  }
});

effect(() => {
  pointOfInterestCanvas.draw(pointsOfInterest.value);
});

effect(() => {
  sourcePointsCanvas.draw(sourcePoints.value);
});

export default {
  pointsOfInterest,
  sourcePoints,
  buildings: buildingsState,
  roads: roadState,
  agentWeights,
};
