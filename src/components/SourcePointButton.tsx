import { useCallback } from "preact/compat";
import { Forma } from "forma-embedded-view-sdk/auto";
import state from "../pathmaker/state.ts";
import { coordinateToCanvasSpace } from "../pathmaker/helpers.ts";
import { useState } from "preact/hooks";

export default function SourcePointButton() {
  const [settingSourcePoints, setSettingSourcePoints] = useState(false);
  const onClick = useCallback(async () => {
    setSettingSourcePoints(true);
    const pos = await Forma.designTool.getPoint();
    if (pos) {
      state.sourcePoints.value = [...state.sourcePoints.value, coordinateToCanvasSpace(pos)];
      await onClick();
    }
    setSettingSourcePoints(false);
    return;
  }, []);

  return (
    <div>
      <h3>Source points</h3>
      <p className="helpText">Where people come from: their homes, subways, etc.</p>
      {state.sourcePoints.value.length > 0 ? (
        <p>{state.sourcePoints.value.length} source points added</p>
      ) : null}
      <weave-button variant="outlined" onClick={onClick}>
        {settingSourcePoints ? "Press escape to complete" : "Add source points"}
      </weave-button>
    </div>
  );
}
