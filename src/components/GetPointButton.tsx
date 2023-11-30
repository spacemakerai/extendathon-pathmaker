import { useCallback } from "preact/compat";
import { Forma } from "forma-embedded-view-sdk/auto";
import state from "../pathmaker/state.ts";

export default function GetPointButton() {
  const onClick = useCallback(() => {
    Forma.designTool.getPoint().then((pos) => {
      if (pos) {
        state.points.value = [...state.points.value, pos];
      }
    });
  }, []);

  return (
    <div class="row">
      <weave-button variant="outlined" onClick={onClick}>
        Get point
      </weave-button>
    </div>
  );
}
