import FromTerrainBuffer from "./FromArrayBuffer";
import CalculateAndStore from "./Calculate";
import { LayerID, getLayerCanvas } from "../pathmaker/layers";

type Settings = {
  steepnessThreshold: number;
};

const DEFAULT_SETTINGS: Settings = {
  steepnessThreshold: 40,
};

const canvas = getLayerCanvas(LayerID.TERRAIN, "terrain");

export const SCALE = 1;

export const CANVAS_NAME = "terrain slope";

export default function Terrain() {
  const projectSettings = DEFAULT_SETTINGS;
  return (
    <>
      <CalculateAndStore steepnessThreshold={projectSettings.steepnessThreshold} canvas={canvas} />
      <FromTerrainBuffer steepnessThreshold={projectSettings.steepnessThreshold} canvas={canvas} />
    </>
  );
}
