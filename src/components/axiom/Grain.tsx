'use client';

/**
 * Grain — a fixed, full-viewport film-grain overlay.
 *
 * The single cheapest layer that makes a dark page read as "film," not "web"
 * (the Basement/Darkroom tell). Static tiled fractal-noise SVG at low opacity,
 * `mix-blend-overlay`, pointer-events-none, above content. No per-frame cost.
 */

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.05] mix-blend-overlay"
      style={{ backgroundImage: NOISE, backgroundSize: '200px 200px' }}
    />
  );
}
