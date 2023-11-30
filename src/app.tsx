import POIButton from "./components/POIButton.tsx";
import "./pathmaker/agents";
import { useState } from "preact/hooks";
import Terrain from "./terrain/terrain";
import pheromone from "./pathmaker/pheromoneCanvas.ts";
import { signal } from "@preact/signals";
import { runSimulateAndAnimateLoop, updateAgentCanvas } from "./pathmaker/agents";
import roadCanvas from "./pathmaker/roadCanvas.ts";
import buildingCanvas from "./pathmaker/buildingCanvas.ts";
import agentCanvas from "./pathmaker/agentCanvas.ts";
import pointOfInterestCanvas from "./pathmaker/pointOfInterestCanvas.ts";
import SourcePointButton from "./components/SourcePointButton.tsx";
import sourcePointsCanvas from "./pathmaker/sourcePointsCanvas.ts";

const simulationRunningState = signal(false);

if (import.meta.hot) {
  import.meta.hot.on("vite:afterUpdate", () => {
    console.log("Update");
    agentCanvas.clear();
    pheromone.clear();
    simulationRunningState.value = false;
  });
}

agentCanvas.initialize();
pheromone.initialize();
roadCanvas.initialize();
pointOfInterestCanvas.initialize();
sourcePointsCanvas.initialize();
buildingCanvas.initialize();

export default function App() {
  const [terrainOpen, setTerrainOpen] = useState<boolean>(false);

  return (
    <>
      <h1>Pathmaker</h1>
      <SourcePointButton />
      <POIButton />
      {!simulationRunningState.value && (
        <button
          onClick={() => {
            simulationRunningState.value = !simulationRunningState.value;
            runSimulateAndAnimateLoop();
          }}
        >
          Run agent simulation
        </button>
      )}
      {!simulationRunningState.value && (
        <button
          onClick={() => {
            updateAgentCanvas(false);
          }}
        >
          Update canvas manually
        </button>
      )}
      <button
        onClick={() => {
          setTerrainOpen(!terrainOpen);
        }}
      >
        Toggle terrain
      </button>
      {terrainOpen && <Terrain />}
    </>
  );
}
