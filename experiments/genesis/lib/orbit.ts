export const MIN_ZOOM = 0.65;
// Leave space for the atmosphere, even at the closest view.
export const MAX_ZOOM = 1.16;
export const clampZoom = (value: number) =>
  Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

export function dragRotation(
  x: number,
  y: number,
  dx: number,
  dy: number,
  diameter: number,
) {
  const sensitivity = 2 / Math.max(1, diameter);
  // The shader maps the camera into the texture; the displayed surface moves
  // by the inverse rotation. Negative camera deltas follow positive hand deltas.
  return {
    x: x - dx * sensitivity,
    y: Math.max(-1.35, Math.min(1.35, y - dy * sensitivity)),
  };
}
