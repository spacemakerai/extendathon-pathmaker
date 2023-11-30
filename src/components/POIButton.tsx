import { useCallback } from "preact/compat";
import { Forma } from "forma-embedded-view-sdk/auto";
import state from "../pathmaker/state.ts";
import { coordinateToCanvasSpace } from "../pathmaker/helpers.ts";
import styles from "./style.module.css";
export default function POIButton() {
  const onClick = useCallback(async () => {
    state.getPointState.value = "poi";
    const pos = await Forma.designTool.getPoint();
    if (pos) {
      state.pointsOfInterest.value = [
        ...state.pointsOfInterest.value,
        coordinateToCanvasSpace(pos),
      ];
      await onClick();
    }
    state.getPointState.value = undefined;
  }, []);

  return (
    <div className={styles.Section}>
      <h3>Points of interest</h3>
      <p className="helpText">Stores, bus stops, kindergartens, etc.</p>
      {state.getPointState.value === "poi" ? <div>Press escape to complete</div> : null}
      <weave-button
        variant="outlined"
        onClick={onClick}
        disabled={state.getPointState.value === "poi"}
      >
        Add POIs
      </weave-button>
      {state.pointsOfInterest.value.length > 0 && (
        <weave-button variant="flat" onClick={() => (state.pointsOfInterest.value = [])}>
          Clear
        </weave-button>
      )}

      {state.pointsOfInterest.value.length > 0 ? (
        <p>{state.pointsOfInterest.value.length} POIs added</p>
      ) : null}
    </div>
  );
}
