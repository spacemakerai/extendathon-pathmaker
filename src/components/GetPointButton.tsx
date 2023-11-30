import { useCallback } from "preact/compat";
import { Forma } from "forma-embedded-view-sdk/auto";
import state from "../pathmaker/state.ts";

import buildings from "../pathmaker/buildings.ts";
import agentCanvas from "../pathmaker/agentCanvas.ts";
import roads from "../pathmaker/roads.ts";
import { coordinateToCanvasSpace } from "../pathmaker/helpers.ts";

export default function GetPointButton() {
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
    <div class="row">
      <weave-button variant="outlined" onClick={onClick}>
        Get point
      </weave-button>
    </div>
  );
}
