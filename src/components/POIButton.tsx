import { useCallback } from "preact/compat";
import { Forma } from "forma-embedded-view-sdk/auto";
import state from "../pathmaker/state.ts";
import { coordinateToCanvasSpace } from "../pathmaker/helpers.ts";

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
    <div>
      <h3>Points of interest</h3>
      <p className="helpText">Stores, bus stops, kindergartens, etc.</p>
      {state.pointsOfInterest.value.length > 0 ? (
        <p>{state.pointsOfInterest.value.length} POIs added</p>
      ) : null}
      <weave-button variant="outlined" onClick={onClick}>
        {state.getPointState.value === "poi"
          ? "Press escape to complete"
          : "Add POI (store, bus stop, etc.)"}
      </weave-button>
    </div>
  );
}
