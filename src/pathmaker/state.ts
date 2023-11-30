import { signal } from "@preact/signals";

export type Point = { x: number; y: number };

const points = signal<Point[]>([]);

export default {
  points,
};
