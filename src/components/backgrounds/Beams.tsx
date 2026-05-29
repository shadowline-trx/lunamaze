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
 * Beams — animated diagonal light beams rendered in a single WebGL pass.
 *
 * A dependency-free reimagining of the React Bits "Beams" background, tuned
 * to the Luna Maze / Drift palette. Soft volumetric streaks sweep across a
 * deep backdrop with a faint grain, evoking precision and motion — a fit for
 * the Drift puzzle page.
 *
 * Behaviour:
 *   - Fixed/absolute full-bleed canvas behind page content (`pointer-events:
 *     none`, `aria-hidden`).
 *   - Honours `prefers-reduced-motion`: renders one static frame instead of
 *     animating.
 *   - Degrades to a CSS gradient (set on the host element) if WebGL or shader
 *     compilation fails, so there is never a blank area.
 *
 * Client component: relies on WebGL + browser APIs that must mount in the
 * browser. Never executes during static export's build-time render.
 */

export interface BeamsProps {
  /** Base/background colour as `#rrggbb`. Defaults to Drift deep navy. */
  readonly background?: string;
  /** Beam colour as `#rrggbb`. Defaults to Luna Maze violet. */
  readonly beamColor?: string;
  /** Secondary accent colour as `#rrggbb`. Defaults to signal gold. */
  readonly accentColor?: string;
  /** Optional extra class names for the host wrapper. */
  readonly className?: string;
}

const FRAGMENT_SHADER = `
uniform vec3 uBackground;
uniform vec3 uBeam;
uniform vec3 uAccent;

// Hash / value-noise helpers (cheap, no textures).
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float aspect = iResolution.x / iResolution.y;

  // Rotate the space ~ -28deg so beams run diagonally.
  vec2 p = uv - 0.5;
  p.x *= aspect;
  float ang = -0.48;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  p = rot * p;

  // Gentle parallax toward the pointer.
  float mx = (iMouse.x - 0.5) * 0.25;

  float beams = 0.0;
  const int COUNT = 7;
  for (int i = 0; i < COUNT; i++) {
    float fi = float(i);
    float seed = fi * 1.37;
    // Each beam drifts at its own speed/phase.
    float x = p.x + mx + sin(iTime * 0.18 + seed) * 0.18 + (fi - 3.0) * 0.16;
    float width = 0.020 + 0.012 * noise(vec2(seed, iTime * 0.1));
    float core = exp(-pow(x / width, 2.0));
    // Travel highlight running along the beam.
    float travel = 0.5 + 0.5 * sin(iTime * 0.6 + p.y * 3.0 - seed * 2.0);
    beams += core * (0.35 + 0.65 * travel);
  }

  // Vertical falloff so beams fade toward top/bottom edges.
  float vfade = smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.55, uv.y);
  beams *= mix(0.55, 1.0, vfade);

  // Subtle grain to avoid banding on dark gradients.
  float grain = (noise(gl_FragCoord.xy * 0.5 + iTime) - 0.5) * 0.025;

  vec3 beamMix = mix(uBeam, uAccent, 0.5 + 0.5 * sin(iTime * 0.3 + p.y * 2.0));
  vec3 col = uBackground + grain;
  col += beamMix * beams * 0.9;

  // Soft central bloom to lift the middle of the canvas.
  float bloom = exp(-dot(p, p) * 3.0) * 0.12;
  col += uBeam * bloom;

  gl_FragColor = vec4(col, 1.0);
}
`;

const DEFAULT_BACKGROUND = '#06081A'; // lunamaze.bgDeep
const DEFAULT_BEAM = '#7B5CFF'; // lunamaze.violet
const DEFAULT_ACCENT = '#FFD27A'; // lunamaze.signal

export default function Beams({
  background = DEFAULT_BACKGROUND,
  beamColor = DEFAULT_BEAM,
  accentColor = DEFAULT_ACCENT,
  className,
}: BeamsProps): JSX.Element {
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
          uBeam: hexToRgb(beamColor),
          uAccent: hexToRgb(accentColor),
        },
      },
    );

    return () => {
      handle?.destroy();
    };
  }, [background, beamColor, accentColor]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-0 overflow-hidden ${className ?? ''}`}
      style={{
        // CSS fallback shown if WebGL/shader init fails (canvas stays blank).
        background: `radial-gradient(ellipse at 50% 40%, ${beamColor}22 0%, ${background} 70%)`,
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
