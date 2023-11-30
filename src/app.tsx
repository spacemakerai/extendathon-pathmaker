import POIButton from "./components/POIButton.tsx";
import "./pathmaker/agents";
import Terrain from "./terrain/terrain";
import pheromone from "./pathmaker/pheromoneCanvas.ts";
import { signal } from "@preact/signals";
import { startAgents } from "./pathmaker/agents";
import agentCanvas from "./pathmaker/agentCanvas.ts";
import pointOfInterestCanvas from "./pathmaker/pointOfInterestCanvas.ts";
import SourcePointButton from "./components/SourcePointButton.tsx";
import sourcePointsCanvas from "./pathmaker/sourcePointsCanvas.ts";
import Weights from "./components/Weights.tsx";
import Layers from "./pathmaker/layers.tsx";

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
pointOfInterestCanvas.initialize();
sourcePointsCanvas.initialize();

export default function App() {
  return (
    <>
      <h1>Pathmaker</h1>
      <SourcePointButton />
      <POIButton />
      <Weights />
      {!simulationRunningState.value && (
        <button
          onClick={() => {
            simulationRunningState.value = !simulationRunningState.value;
            startAgents();
          }}
        >
          Run agent simulation
        </button>
      )}
      <Terrain />
      <Layers />
    </>
  );
}
