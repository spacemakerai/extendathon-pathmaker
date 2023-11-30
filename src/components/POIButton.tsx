import { useCallback } from "preact/compat";
import { Forma } from "forma-embedded-view-sdk/auto";
import state from "../pathmaker/state.ts";

import buildings from "../pathmaker/buildings.ts";
import agentCanvas from "../pathmaker/agentCanvas.ts";
import roads from "../pathmaker/roads.ts";
import { coordinateToCanvasSpace } from "../pathmaker/helpers.ts";

export default function POIButton() {
  const onClick = useCallback(async () => {
    const pos = await Forma.designTool.getPoint();
    if (pos) {
      state.points.value = [...state.points.value, coordinateToCanvasSpace(pos)];
      state.buildings.value = await buildings.get();
      state.roads.value = await roads.get();
      agentCanvas.draw(state.points.value);
    }
  }, []);

  return (
    <div>
      <h3>Points of interest</h3>
      <p className="helpText">Stores, bus stops, kindergartens, etc.</p>
      {state.points.value.length > 0 ? <p>{state.points.value.length} POIs added</p> : null}
      <weave-button variant="outlined" onClick={onClick}>
        Add POI (store, bus stop, etc.)
      </weave-button>
    </div>
  );
}
