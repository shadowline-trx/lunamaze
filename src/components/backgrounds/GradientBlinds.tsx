'use client';

import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import {
  createShaderBackground,
  hexToRgb,
  prefersReducedMotion,
  type ShaderBackgroundHandle,
} from './webgl';

/**
 * GradientBlinds — vertical "blinds" of shifting gradient light, with a
 * scanline + vignette treatment that reads as a CRT/terminal phosphor glow.
 *
 * A dependency-free take on the React Bits "Gradient Blinds" background,
 * recoloured for the TypeCrt page (phosphor green → amber). The blinds tilt
 * and the gradient breathes over time; a pointer-reactive highlight tracks
 * the cursor. Scanlines and a soft vignette complete the retro-monitor feel.
 *
 * Behaviour mirrors the other backgrounds in this folder: full-bleed,
 * non-interactive, reduced-motion aware, with a CSS gradient fallback.
 *
 * Client component (WebGL + browser APIs).
 */

export interface GradientBlindsProps {
  /** Background colour `#rrggbb`. Defaults to near-black CRT bezel. */
  readonly background?: string;
  /** Primary phosphor colour `#rrggbb`. Defaults to terminal green. */
  readonly colorA?: string;
  /** Secondary phosphor colour `#rrggbb`. Defaults to amber. */
  readonly colorB?: string;
  /** Number of vertical blinds. Defaults to 18. */
  readonly blindCount?: number;
  /** Optional extra class names for the host wrapper. */
  readonly className?: string;
}

const FRAGMENT_SHADER = `
uniform vec3 uBackground;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uBlinds;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  // Slight diagonal tilt on the blinds.
  float tilt = (uv.y - 0.5) * 0.12;
  float x = uv.x + tilt;

  // Blind index + local position within a blind (0..1).
  float scaled = x * uBlinds;
  float local = fract(scaled);
  float idx = floor(scaled);

  // Each blind has a soft rounded profile (bright center, dim edges).
  float profile = sin(local * 3.14159265);
  profile = pow(clamp(profile, 0.0, 1.0), 1.3);

  // Animated gradient sweep across blinds + time.
  float t = iTime * 0.25;
  float grad = 0.5 + 0.5 * sin(idx * 0.5 + t + uv.y * 1.5);
  vec3 phosphor = mix(uColorA, uColorB, grad);

  // Pointer highlight: blinds near the cursor glow brighter.
  float distToMouse = abs(uv.x - iMouse.x);
  float highlight = exp(-distToMouse * distToMouse * 18.0) * 0.6;

  // Scanlines for CRT texture.
  float scan = 0.92 + 0.08 * sin(gl_FragCoord.y * 1.6);

  float intensity = profile * (0.35 + highlight) * scan;

  // Vignette to round off the monitor edges.
  vec2 vc = uv - 0.5;
  float vignette = smoothstep(0.85, 0.25, length(vc));

  vec3 col = uBackground + phosphor * intensity * vignette;

  // Faint phosphor bleed lifting the whole frame.
  col += uColorA * 0.03;

  gl_FragColor = vec4(col, 1.0);
}
`;

const DEFAULT_BACKGROUND = '#050608';
const DEFAULT_COLOR_A = '#00F5A0'; // axiom.streak — phosphor green
const DEFAULT_COLOR_B = '#FFB703'; // axiom.amber

export default function GradientBlinds({
  background = DEFAULT_BACKGROUND,
  colorA = DEFAULT_COLOR_A,
  colorB = DEFAULT_COLOR_B,
  blindCount = 18,
  className,
}: GradientBlindsProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const handle: ShaderBackgroundHandle | null = createShaderBackground(
      canvas,
      {
        fragment: FRAGMENT_SHADER,
        animate: !prefersReducedMotion(),
        uniforms: {
          uBackground: hexToRgb(background),
          uColorA: hexToRgb(colorA),
          uColorB: hexToRgb(colorB),
          uBlinds: blindCount,
        },
      },
    );

    return () => {
      handle?.destroy();
    };
  }, [background, colorA, colorB, blindCount]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-0 overflow-hidden ${className ?? ''}`}
      style={{
        background: `linear-gradient(120deg, ${background} 0%, ${colorA}11 50%, ${background} 100%)`,
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
