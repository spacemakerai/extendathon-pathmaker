import { Forma } from "forma-embedded-view-sdk/auto";
import { useCallback, useEffect, useState } from "preact/hooks";
import { createCanvasFromSlope, degreesToRadians } from "../utils";
import { getFloat32Array } from "./storage";
import { CanvasLayerOrder } from "../pathmaker/constants";

type Props = {
  steepnessThreshold: number;
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

export default function FromTerrainBuffer({ steepnessThreshold }: Props) {
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
    const canvas = createCanvasFromSlope(
      terrainSlope,
      width,
      height,
      maxSlope,
      minSlope,
      degreesToRadians(steepnessThreshold),
    );

    // need to find the reference point of the terrain to place the canvas
    // for this analysis, it's the middle of the terrain
    const position = {
      x: 0,
      y: 0,
      z: CanvasLayerOrder.TERRAIN,
    };
    await Forma.terrain.groundTexture.add({
      name: "terrain slope",
      canvas,
      position,
    });
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
