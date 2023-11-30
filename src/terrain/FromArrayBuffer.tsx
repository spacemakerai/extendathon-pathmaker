import { useCallback, useEffect, useState } from "preact/hooks";
import { renderIntoCanvasFromSlope, degreesToRadians } from "../utils";
import { getFloat32Array } from "./storage";
import { LayerID, updateLayer } from "../pathmaker/layers";

type Props = {
  steepnessThreshold: number;
  canvas: HTMLCanvasElement;
};

type MetadataRaw = {
  maxSlope: number;
  minSlope: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
};

export default function FromTerrainBuffer({ steepnessThreshold, canvas }: Props) {
  const [terrainSlope, setTerrainSlope] = useState<Float32Array>();
  const [metadata, setMetadata] = useState<MetadataRaw>();
  const [hasAutoFetched, setHasAutoFetched] = useState<boolean>(false);
  useEffect(() => {
    getFloat32Array("terrain-steepness-raw").then((res) => {
      if (!res) {
        return;
      }
      setTerrainSlope(res.arr);
      if (res.metadata) {
        setMetadata(res.metadata as MetadataRaw);
      }
    });
  }, []);

  const calculateFromArrrayBuffer = useCallback(async () => {
    if (!metadata || !terrainSlope) return;

    const { width, height, maxSlope, minSlope } = metadata;
    renderIntoCanvasFromSlope(
      terrainSlope,
      width,
      height,
      maxSlope,
      minSlope,
      degreesToRadians(steepnessThreshold),
      canvas,
    );

    updateLayer(LayerID.TERRAIN);
  }, [steepnessThreshold, terrainSlope, metadata]);
  if (!metadata || !terrainSlope) {
    return null;
  }

  useEffect(() => {
    if (!hasAutoFetched) {
      setHasAutoFetched(true);
      calculateFromArrrayBuffer();
    }
  }, [hasAutoFetched]);

  return null;
}
