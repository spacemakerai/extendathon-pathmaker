import { useCallback } from "preact/compat";
import { Forma } from "forma-embedded-view-sdk/auto";
import state from "../pathmaker/state.ts";
import canvas from "../pathmaker/canvas.ts";
import buildings from "../pathmaker/buildings.ts";
import roads from "../pathmaker/roads.ts";

export default function GetPointButton() {
  const onClick = useCallback(async () => {
    const pos = await Forma.designTool.getPoint();
    if (pos) {
      state.points.value = [...state.points.value, pos];
      const buildingTriangles = await buildings.get();
      const roadLines = await roads.get();
      canvas.draw(state.points.value, roadLines, buildingTriangles);
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
