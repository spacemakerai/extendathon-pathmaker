import { Forma } from "forma-embedded-view-sdk/auto";

export type Road = { x: number; y: number }[];

async function get(): Promise<Road[]> {
  const paths = await Forma.geometry.getPathsByCategory({ category: "road" });
  //console.log(paths);
  const roads = await Promise.all(
    paths.map(async (path) => {
      //console.log(`getting footprint for ${path}`);
      const footprint = await Forma.geometry.getFootprint({ path });
      if (!footprint) {
        //console.log(`didn't get footprint for path ${path}`);
        return [];
      }
      //console.log(`got footprint type ${footprint.type} for path ${path}`);
      if (footprint.type != "LineString") return [];
      return footprint.coordinates.map((point: number[]) => ({
        x: point[0],
        y: point[1],
      }));
    }),
  );
  return roads;
}

export default { get };
