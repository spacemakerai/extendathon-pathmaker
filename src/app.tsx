import POIButton from "./components/POIButton.tsx";
import "./pathmaker/agents";
import Terrain from "./terrain/terrain";
import pheromone from "./pathmaker/pheromoneCanvas.ts";
import { signal } from "@preact/signals";
import { startAgents, stopAgents } from "./pathmaker/agents";
import agentCanvas from "./pathmaker/agentCanvas.ts";
import pointOfInterestCanvas from "./pathmaker/pointOfInterestCanvas.ts";
import SourcePointButton from "./components/SourcePointButton.tsx";
import sourcePointsCanvas from "./pathmaker/sourcePointsCanvas.ts";
import Weights from "./components/Weights.tsx";
import Layers from "./pathmaker/layers.tsx";

const simulationRunningState = signal<number | undefined>(undefined);

if (import.meta.hot) {
  import.meta.hot.on("vite:afterUpdate", () => {
    console.log("Update");
    agentCanvas.clear();
    pheromone.clear();
    simulationRunningState.value !== undefined && stopAgents(simulationRunningState.value);
    simulationRunningState.value = undefined;
  });
}

agentCanvas.initialize();
pheromone.initialize();
pointOfInterestCanvas.initialize();
sourcePointsCanvas.initialize();

export default function App() {
  return (
    <>
      <h1>Pathmaker</h1>
      <SourcePointButton />
      <POIButton />
      <Weights />
      <button
        onClick={() => {
          if (simulationRunningState.value !== undefined) {
            stopAgents(simulationRunningState.value);
            simulationRunningState.value = undefined;
          } else {
            simulationRunningState.value = startAgents();
          }
        }}
      >
        {simulationRunningState.value !== undefined
          ? "Stop agent simulation"
          : "Start agent simulation"}
      </button>

      <Terrain />
      <Layers />
    </>
  );
}
