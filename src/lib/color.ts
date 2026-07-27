/**
 * Colour helpers shared by the accent-driven components.
 *
 * The design tokens are plain hex so they can live in Tailwind config, but the
 * aurora layers need alpha. Rather than duplicating a converter in every
 * component that takes an `accent` prop, they all import this one.
 */

/** `#RRGGBB` + alpha → `rgba()`, so callers can pass plain hex tokens. */
export function hexA(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
