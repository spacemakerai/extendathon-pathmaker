export function renderIntoCanvasFromSlope(
  terrainSlope: Float32Array,
  width: number,
  _height: number,
  _maxSlope: number,
  minSlope: number,
  threshold: number,
  canvas: HTMLCanvasElement,
) {
  const ctx = canvas.getContext("2d");
  for (let i = 0; i < terrainSlope.length; i++) {
    const x = Math.floor(i % width);
    const y = Math.floor(i / width);
    const value = Math.min(threshold, terrainSlope[i]) - minSlope / (threshold - minSlope);
    const c = Math.floor(255 * (1 - value));
    const color = `rgba(${c},${c},${c},255)`;
    ctx!.fillStyle = color;
    ctx!.fillRect(x, y, 1, 1);
  }
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
