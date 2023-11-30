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
import { useState } from "preact/hooks";
import styles from "./components/style.module.css";
import trailMap from "./pathmaker/trailMap.ts";

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
  const [showSettings, setShowShowSettings] = useState(false);
  return (
    <>
      <h3 className={"title"}>Pathmaker</h3>
      <p className={"helpTitle"}>
        Pedestrian Flow Prediction: Understand city movement patterns effortlessly.
      </p>
      <p className={"helpText"}>
        This feature uses evolutionary algorithms to predict pedestrian pathways based on
        residential locations and popular destinations. Gain valuable insights for informed urban
        planning.
      </p>
      <SourcePointButton />
      <POIButton />
      <div className={styles.Section}>
        <h3>Simulation</h3>
        <weave-button
          variant={"solid"}
          onClick={() => {
            if (agentsRunning.value) {
              stopAgents();
            } else {
              startAgents();
            }
          }}
        >
          {agentsRunning.value ? "Stop agent simulation" : "Start agent simulation"}
        </weave-button>
      </div>
      <weave-button variant="flat" onClick={() => setShowShowSettings((prev) => !prev)}>
        Show advanced settings
      </weave-button>
      {showSettings && (
        <>
          <Weights />

          <Terrain />
          <button onClick={costMap.update}>Update cost map</button>
          <button onClick={trailMap.update}>Update trails</button>
          <Layers />
        </>
      )}
    </>
  );
}
