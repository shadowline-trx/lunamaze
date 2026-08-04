'use client';

/**
 * Grain — a fixed, full-viewport film-grain overlay.
 *
 * The single cheapest layer that makes a dark page read as "film," not "web"
 * (the Basement/Darkroom tell). Static tiled fractal-noise SVG at low opacity,
 * pointer-events-none, above content.
 *
 * The blend mode is desktop-only, and that is load-bearing: `mix-blend-mode`
 * on a full-viewport layer makes the compositor re-read and re-blend the whole
 * screen on every frame anything underneath changes — and the particle canvas
 * underneath changes 60×/s. On a phone GPU that alone eats the frame budget
 * through the entire hero and story act, so touch devices drop the layer
 * entirely — at phone pixel density the grain is imperceptible anyway. See
 * `.ax-grain` in globals.css.
 */

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Grain() {
  return (
    <div
      aria-hidden
      className="ax-grain pointer-events-none fixed inset-0 z-[90]"
      style={{ backgroundImage: NOISE, backgroundSize: '200px 200px' }}
    />
  );
}
