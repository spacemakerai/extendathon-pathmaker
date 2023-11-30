import * as THREE from "three";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";
import { renderIntoCanvasFromSlope, degreesToRadians } from "../utils";
import { useCallback } from "preact/hooks";
import { Forma } from "forma-embedded-view-sdk/auto";
import { saveCanvas, saveFloatArray } from "./storage";
import { DIMENSION } from "../pathmaker/constants";
import { canvasSpaceToCoordinate } from "../pathmaker/helpers";
import { LayerID, updateLayer } from "../pathmaker/layers";

type Props = {
  steepnessThreshold: number;
  canvas: HTMLCanvasElement;
};

function getMinMax(array: Float32Array) {
  return array.reduce(
    (acc, curr) => {
      acc[0] = Math.min(acc[0], curr);
      acc[1] = Math.max(acc[1], curr);
      return acc;
    },
    [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
  );
}

// Speed up raycasting using https://github.com/gkjohnson/three-mesh-bvh
// @ts-ignore
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
// @ts-ignore
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
// @ts-ignore
THREE.Mesh.prototype.raycast = acceleratedRaycast;
const raycaster = new THREE.Raycaster();
// For this analysis we only need the first hit, which is faster to compute
// @ts-ignore
raycaster.firstHitOnly = true;

export default function CalculateAndStore({ steepnessThreshold, canvas }: Props) {
  const calculateTerrainSteepness = useCallback(async () => {
    const [terrain] = await Forma.geometry.getPathsByCategory({
      category: "terrain",
    });

    const terrainTriangles = await Forma.geometry.getTriangles({
      path: terrain,
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(terrainTriangles, 3));

    //@ts-ignore
    geometry.computeBoundsTree();

    const material = new THREE.MeshBasicMaterial();
    material.side = THREE.DoubleSide;
    const mesh = new THREE.Mesh(geometry, material);

    const scene = new THREE.Scene();
    scene.add(mesh);

    const xValues = terrainTriangles.filter((_, i) => i % 3 === 0);
    const [minX, maxX] = getMinMax(xValues);
    const yValues = terrainTriangles.filter((_, i) => i % 3 === 1);
    const [minY, maxY] = getMinMax(yValues);

    const width = DIMENSION;
    const height = DIMENSION;
    const direction = new THREE.Vector3(0, 0, -1);
    const origin = new THREE.Vector3(0, 0, 10000);

    let [minSlope, maxSlope] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
    let terrainSlope = new Float32Array(width * height).fill(NaN);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const coords = canvasSpaceToCoordinate({ x: j, y: i });
        origin.x = coords.x;
        origin.y = coords.y;
        raycaster.set(origin, direction);
        const intersection = raycaster.intersectObjects(scene.children)[0];
        const normal = intersection!.face!.normal;
        const slope = Math.abs(
          Math.PI / 2 -
            Math.atan(normal.z / Math.sqrt(Math.pow(normal.x, 2) + Math.pow(normal.y, 2))),
        );
        terrainSlope[i * width + j] = slope;
        minSlope = Math.min(slope, minSlope);
        maxSlope = Math.max(slope, maxSlope);
      }
    }

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
    await saveCanvas("terrain-steepness-png", canvas, {
      steepnessThreshold: steepnessThreshold,
      minX,
      maxX,
      minY,
      maxY,
    });
    await saveFloatArray("terrain-steepness-raw", terrainSlope, {
      minSlope,
      maxSlope,
      width,
      height,
      minX,
      maxX,
      minY,
      maxY,
    });
  }, [steepnessThreshold]);

  return (
    <button onClick={calculateTerrainSteepness} style="width: 100%;">
      Recalculate terrain
    </button>
  );
}
