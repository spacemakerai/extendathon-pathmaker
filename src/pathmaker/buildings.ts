import { Forma } from "forma-embedded-view-sdk/auto";
import { isDefined } from "../lib/utils.ts";
import { Point } from "./state.ts";

export type Building = {
  //x,y[]
  triangles: [Point, Point, Point][];
};

async function get(): Promise<Building[]> {
  const paths = await Forma.geometry.getPathsByCategory({ category: "building" });
  const buildings3d = (
    await Promise.all(
      paths.map((path) => {
        return Forma.geometry.getTriangles({ path });
      }),
    )
  ).filter(isDefined);
  return buildings3d.map((building3d) => {
    const triangles: [Point, Point, Point][] = [];
    for (let i = 0; i < building3d.length; i += 9) {
      const x1 = building3d[i];
      const y1 = building3d[i + 1];
      const z1 = building3d[i + 2];
      const x2 = building3d[i + 3];
      const y2 = building3d[i + 4];
      const z2 = building3d[i + 5];
      const x3 = building3d[i + 6];
      const y3 = building3d[i + 7];
      const z3 = building3d[i + 8];
      triangles.push([
        { x: x1, y: y1, z: z1 },
        { x: x2, y: y2, z: z2 },
        { x: x3, y: y3, z: z3 },
      ]);
    }
    return { triangles };
  });
}

export default { get };
