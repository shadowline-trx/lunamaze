import type { JSX } from 'react';
import { hexA } from '@/lib/color';

/**
 * Layered aurora wash for hero sections.
 *
 * The app's identity is depth: aurora ribbons, glass, glow. The marketing site
 * had none of it, so pages read as generic dark-mode cards while the product
 * they advertise is an art piece. This closes that gap with pure CSS, no canvas
 * and no images, so it costs nothing at load and degrades to flat colour on old
 * browsers.
 *
 * Blurred radial gradients at low alpha, offset from each other, produce the
 * same soft-bloom look the wallpaper generator draws on canvas.
 */

export interface AuroraFieldProps {
  /** Primary bloom colour. */
  accent?: string;
  /** Secondary bloom, offset from the first. */
  accentAlt?: string;
  /** Dial the whole effect up or down. 1 = default. */
  intensity?: number;
}

export default function AuroraField({
  accent = '#7B5CFF',
  accentAlt = '#00D2FF',
  intensity = 1,
}: AuroraFieldProps): JSX.Element {
  const a = 0.28 * intensity;
  const b = 0.18 * intensity;
  const c = 0.14 * intensity;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute -top-1/3 -left-1/4 h-[70vh] w-[80vw] rounded-full blur-[90px]"
        style={{ background: `radial-gradient(circle, ${hexA(accent, a)} 0%, transparent 70%)` }}
      />
      <div
        className="absolute -top-1/4 right-[-20%] h-[55vh] w-[60vw] rounded-full blur-[100px]"
        style={{ background: `radial-gradient(circle, ${hexA(accentAlt, b)} 0%, transparent 70%)` }}
      />
      <div
        className="absolute top-[30%] left-[20%] h-[45vh] w-[55vw] rounded-full blur-[110px]"
        style={{ background: `radial-gradient(circle, ${hexA(accent, c)} 0%, transparent 72%)` }}
      />
      {/* Fade the whole field into the page so it never ends on a hard edge. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-lunamaze-bgDeep" />
    </div>
  );
}
