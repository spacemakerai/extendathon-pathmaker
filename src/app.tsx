import GetPointButton from "./components/GetPointButton.tsx";
import { initializeCanvas } from "./pathmaker/agentCanvas.ts";
import "./pathmaker/agents";
import { useState } from "preact/hooks";
import Terrain from "./terrain/terrain";
import pheromone from "./pathmaker/pheromoneCanvas.ts";

initializeCanvas();
pheromone.initializeCanvas();

export default function App() {
  const [terrainOpen, setTerrainOpen] = useState<boolean>(false);

  return (
    <>
      <h1>Pathmaker</h1>
      <GetPointButton />
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
