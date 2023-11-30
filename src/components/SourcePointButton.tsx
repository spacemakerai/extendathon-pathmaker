import { useCallback } from "preact/compat";
import { Forma } from "forma-embedded-view-sdk/auto";
import state from "../pathmaker/state.ts";
import { coordinateToCanvasSpace } from "../pathmaker/helpers.ts";
import styles from "./style.module.css";

export default function SourcePointButton() {
  const onClick = useCallback(async () => {
    state.getPointState.value = "source";
    const pos = await Forma.designTool.getPoint();
    if (pos) {
      state.sourcePoints.value = [...state.sourcePoints.value, coordinateToCanvasSpace(pos)];
      await onClick();
    }
    state.getPointState.value = undefined;
    return;
  }, []);

  return (
    <div className={styles.Section}>
      <h3>Source points</h3>
      <p className="helpText">Where people come from: their homes, subways, etc.</p>
      <weave-button variant="outlined" onClick={onClick}>
        {state.getPointState.value === "source" ? "Press escape to complete" : "Add source points"}
      </weave-button>
      {state.sourcePoints.value.length > 0 ? (
        <p>{state.sourcePoints.value.length} source points added</p>
      ) : null}
    </div>
  );
}
