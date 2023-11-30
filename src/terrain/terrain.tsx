import FromTerrainBuffer from "./FromArrayBuffer";
import CalculateAndStore from "./Calculate";

type Settings = {
  steepnessThreshold: number;
};

const DEFAULT_SETTINGS: Settings = {
  steepnessThreshold: 40,
};

export const SCALE = 1;

export const CANVAS_NAME = "terrain slope";

export default function Terrain() {
  const projectSettings = DEFAULT_SETTINGS;
  return (
    <>
      <CalculateAndStore steepnessThreshold={projectSettings.steepnessThreshold} />
      <FromTerrainBuffer steepnessThreshold={projectSettings.steepnessThreshold} />
    </>
  );
}
