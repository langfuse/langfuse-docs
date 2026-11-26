/** Decorative layers don't need a retina-sized backing store on a large display. */
export function canvasScale(width: number, height: number, pixels = 900_000) {
  return Math.min(
    devicePixelRatio || 1,
    1.25,
    Math.sqrt(pixels / Math.max(1, width * height)),
  );
}
