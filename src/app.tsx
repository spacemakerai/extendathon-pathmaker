import { useState } from "preact/hooks";
import Terrain from "./terrain/terrain";

export default function App() {
  const [terrainOpen, setTerrainOpen] = useState<boolean>(false)

  return (
    <>
      <h1>Pathmaker</h1>
      <button onClick={() => {setTerrainOpen(!terrainOpen)}}>Toggle terrain</button>
      {terrainOpen && <Terrain />}
    </>
  );
}
