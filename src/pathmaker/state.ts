import { effect, signal } from "@preact/signals";
import buildings, { Building } from "./buildings.ts";
import roads, { Road } from "./roads.ts";
import buildingCanvas from "./buildingCanvas.ts";
import roadCanvas from "./roadCanvas.ts";
import pointOfInterestCanvas from "./pointOfInterestCanvas.ts";
import sourcePointsCanvas from "./sourcePointsCanvas.ts";
import { Forma } from "forma-embedded-view-sdk/auto";

export type Point = { x: number; y: number };
export type AgentSettings = {
  keepSpeed: number;
  pheromone: number;
  point: number;
  road: number;
  building: number;
  random: number;
  pheromoneDecay: number;
  agentSpeed: number;
};

const getPointState = signal<"poi" | "source" | undefined>(undefined);
const pointsOfInterest = signal<Point[]>([]);
const sourcePoints = signal<Point[]>([]);
const buildingsState = signal<Building[]>([]);
const visibleCanvas = signal({ buildings: true, roads: true });
const agentSettings = signal<AgentSettings>({
  keepSpeed: 1,
  pheromone: 1,
  point: 0.6,
  road: 0.1,
  pheromoneDecay: 0.995,
  agentSpeed: 2,
  building: 5,
  random: 0.2,
});

const numberOfAgents = signal<number>(400);
const rootUrnState = signal<string | undefined>(undefined);

effect(async () => {
  if (rootUrnState.value) {
    buildingsState.value = await buildings.get();
    roadState.value = await roads.get();
  }
});

setTimeout(async () => {
  const rootUrn = await Forma.proposal.getRootUrn();
  rootUrnState.value = rootUrn;
}, 0);

setInterval(async () => {
  const rootUrn = await Forma.proposal.getRootUrn();
  if (rootUrnState.value !== rootUrn) {
    rootUrnState.value = rootUrn;
  }
}, 1000);

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
  agentWeights: agentSettings,
  getPointState,
  numberOfAgents,
};
