import { signal } from "@preact/signals";
import { Forma } from "forma-embedded-view-sdk/auto";
import { DIMENSION } from "./constants";

// Ordered according to z-index
export enum LayerID {
  TERRAIN,
  ROADS,
  BUILDINGS,
  PHEROMONES,
  AGENTS,
  SOURCES,
  POI,
}

export type Layer = {
  id: LayerID;
  name: string;
  canvas: HTMLCanvasElement;
};

export type LayerList = Record<number, Layer>;
export type LayerVisibility = Record<number, boolean>;

export const layers = signal<LayerList>({});
export const hiddenLayers = signal<LayerVisibility>({
  [LayerID.TERRAIN]: false,
  [LayerID.ROADS]: false,
});

export function showLayer(id: LayerID) {
  if (!layers.value[id]) return;
  if (hiddenLayers.value[id] === false) return;
  hiddenLayers.value = { ...hiddenLayers.value, [id]: false };
  Forma.terrain.groundTexture.add({
    name: layers.value[id].name,
    canvas: layers.value[id].canvas,
    position: { x: 0, y: 0, z: id },
  });
}

export function hideLayer(id: LayerID) {
  if (!layers.value[id]) return;
  if (hiddenLayers.value[id] === true) return;
  hiddenLayers.value = { ...hiddenLayers.value, [id]: true };
  Forma.terrain.groundTexture.remove({ name: layers.value[id].name });
}

export function updateLayer(id: LayerID) {
  if (!layers.value[id]) return;
  if (hiddenLayers.value[id] !== false) return;
  Forma.terrain.groundTexture.updateTextureData({
    name: layers.value[id].name,
    canvas: layers.value[id].canvas,
  });
}

export function getLayerCanvas(id: LayerID, name: string) {
  if (!layers.value[id]) {
    const canvas = document.createElement("canvas", {});
    canvas.height = DIMENSION;
    canvas.width = DIMENSION;
    const layer = {
      id,
      name,
      canvas,
    };
    layers.value = { ...layers.value, [id]: layer };
    showLayer(id);
    return canvas;
  }
  return layers.value[id].canvas;
}

export default function Layers() {
  return (
    <div>
      {Object.entries(layers.value).map(([_, layer]) => (
        <button
          onClick={() => {
            hiddenLayers.value[layer.id] ? showLayer(layer.id) : hideLayer(layer.id);
          }}
        >
          {hiddenLayers.value[layer.id] ? "Show " : "Hide "}
          {layer.name}
        </button>
      ))}
    </div>
  );
}
