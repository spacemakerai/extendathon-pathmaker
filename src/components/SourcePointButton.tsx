import { useCallback } from "preact/compat";
import { Forma } from "forma-embedded-view-sdk/auto";
import state from "../pathmaker/state.ts";
import { coordinateToCanvasSpace } from "../pathmaker/helpers.ts";

export default function SourcePointButton() {
  const onClick = useCallback(async () => {
    const pos = await Forma.designTool.getPoint();
    if (pos) {
      state.sourcePoints.value = [...state.sourcePoints.value, coordinateToCanvasSpace(pos)];
    }
  }, []);

  return (
    <div>
      <h3>Source points</h3>
      <p className="helpText">Where people come from: their homes, subways, etc.</p>
      {state.sourcePoints.value.length > 0 ? (
        <p>{state.sourcePoints.value.length} source points added</p>
      ) : null}
      <weave-button variant="outlined" onClick={onClick}>
        Add source point
      </weave-button>
    </div>
  );
}
