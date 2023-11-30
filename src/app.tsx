import GetPointButton from "./components/GetPointButton.tsx";
import "./pathmaker/agents";
import { useState } from "preact/hooks";
import Terrain from "./terrain/terrain";
import pheromone from "./pathmaker/pheromoneCanvas.ts";
import { runSimulateAndAnimateLoop, updateAgentCanvas } from "./pathmaker/agents";

if (import.meta.hot) {
  import.meta.hot.on("vite:afterUpdate", () => {
    console.log("Update");
    agentCanvas.clear();
    pheromone.clear();
  });
}
import roadCanvas from "./pathmaker/roadCanvas.ts";
import buildingCanvas from "./pathmaker/buildingCanvas.ts";
import agentCanvas from "./pathmaker/agentCanvas.ts";

agentCanvas.initialize();
pheromone.initialize();
roadCanvas.initialize();
buildingCanvas.initialize();

export default function App() {
  const [terrainOpen, setTerrainOpen] = useState<boolean>(false);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);

  return (
    <>
      <h1>Pathmaker</h1>
      <GetPointButton />
      {!simulationRunning && (
        <button
          onClick={() => {
            setSimulationRunning(true);
            runSimulateAndAnimateLoop();
          }}
        >
          Run agent simulation
        </button>
      )}
      {!simulationRunning && (
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
