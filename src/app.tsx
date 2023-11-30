import POIButton from "./components/POIButton.tsx";
import "./pathmaker/agents";
import Terrain from "./terrain/terrain";
import pheromone from "./pathmaker/pheromoneCanvas.ts";
import { agentsRunning, startAgents, stopAgents } from "./pathmaker/agents";
import agentCanvas from "./pathmaker/agentCanvas.ts";
import pointOfInterestCanvas from "./pathmaker/pointOfInterestCanvas.ts";
import SourcePointButton from "./components/SourcePointButton.tsx";
import sourcePointsCanvas from "./pathmaker/sourcePointsCanvas.ts";
import Weights from "./components/Weights.tsx";
import Layers from "./pathmaker/layers.tsx";
import costMap from "./pathmaker/costMap.ts";

if (import.meta.hot) {
  import.meta.hot.on("vite:afterUpdate", () => {
    console.log("Update");
    agentCanvas.clear();
    pheromone.clear();
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
          if (agentsRunning.value) {
            stopAgents();
          } else {
            startAgents();
          }
        }}
      >
        {agentsRunning.value ? "Stop agent simulation" : "Start agent simulation"}
      </button>

      <Terrain />
      <button onClick={costMap.update}>Update cost map</button>
      <Layers />
    </>
  );
}
