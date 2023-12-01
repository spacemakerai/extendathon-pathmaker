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
import Layers, { LayerID, hideLayer, showLayer } from "./pathmaker/layers.tsx";
import costMap from "./pathmaker/costMap.ts";
import { useState } from "preact/hooks";
import styles from "./components/style.module.css";
import trailMap from "./pathmaker/trailMap.ts";
import state from "./pathmaker/state.ts";
import pheromoneCanvas from "./pathmaker/pheromoneCanvas.ts";

if (import.meta.hot) {
  import.meta.hot.on("vite:afterUpdate", () => {
    console.log("Update");
    agentCanvas.clear();
    pheromone.remove();
  });
}

agentCanvas.initialize();
pheromone.initialize();
pointOfInterestCanvas.initialize();
sourcePointsCanvas.initialize();

export default function App() {
  const [showSettings, setShowShowSettings] = useState(false);
  const [agentType, setAgentType] = useState<"agent" | "map">("agent");
  const [heatmapRunning, setHeatmapRunning] = useState<boolean>(false);
  const [terrainLoaded, setTerrainLoaded] = useState<boolean>(false);
  const sourcesEmpty = state.sourcePoints.value.length == 0;
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
      <div className={styles.Section}>
        <h3>Algorithm type</h3>
        <p className="helpText">Whether to run an agent-based or a map-based simulation</p>
        <weave-radio-button-group>
          <weave-radio-button
            label='Agent based ("ant mode")'
            checked={agentType == "agent" ? true : undefined}
            onClick={() => {
              setAgentType("agent");
              hideLayer(LayerID.COST_MAP);
              hideLayer(LayerID.TRAIL_MAP);
            }}
          ></weave-radio-button>
          <weave-radio-button
            label='Map based ("omniscient mode")'
            checked={agentType == "map" ? true : undefined}
            onClick={() => {
              setAgentType("map");
              stopAgents();
              showLayer(LayerID.COST_MAP);
              showLayer(LayerID.TRAIL_MAP);
            }}
          ></weave-radio-button>
        </weave-radio-button-group>
      </div>
      <SourcePointButton />
      <POIButton />
      <div className={styles.Section}>
        <h3>Simulation</h3>
        {agentType == "agent" && (
          <weave-button
            variant={"solid"}
            onClick={() => {
              if (agentsRunning.value) {
                stopAgents();
                pheromoneCanvas.resetCanvas();
              } else {
                startAgents();
              }
            }}
          >
            {agentsRunning.value ? "Stop agent simulation" : "Start agent simulation"}
          </weave-button>
        )}
        {agentType == "map" && (
          <>
            <weave-button
              variant={"solid"}
              disabled={heatmapRunning || sourcesEmpty || !terrainLoaded}
              onClick={() => {
                setHeatmapRunning(true);
                setTimeout(() => {
                  costMap.update();
                  trailMap.update();
                  setHeatmapRunning(false);
                }, 100);
              }}
            >
              {heatmapRunning ? "Running map-based simulation..." : "Start map-based simulation"}
            </weave-button>
            {sourcesEmpty && (
              <p style={{ color: "red" }}>Add at least one source to start simulation</p>
            )}
            {!terrainLoaded && <p style={{ color: "red" }}>Please load terrain first</p>}
            <Terrain
              onLoaded={() => {
                setTerrainLoaded(true);
              }}
            />
          </>
        )}
      </div>
      <weave-button variant="flat" onClick={() => setShowShowSettings((prev) => !prev)}>
        Show advanced settings
      </weave-button>
      {showSettings && (
        <>
          <Weights />

          <button onClick={costMap.update}>Update cost map</button>
          <button onClick={trailMap.update}>Update trails</button>
          <Layers />
        </>
      )}
    </>
  );
}
