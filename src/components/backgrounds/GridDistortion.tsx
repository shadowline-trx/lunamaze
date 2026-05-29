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
 * GridDistortion — a procedural neon grid warped by flowing noise and a
 * pointer-driven refraction lens.
 *
 * A dependency-free reinterpretation of the React Bits "Grid Distortion"
 * background. The original distorts a supplied image via Three.js; this
 * version distorts a generated grid instead, so it needs no texture asset and
 * no WebGL library — matching the project's self-contained canvas style.
 *
 * The grid bends continuously with low-frequency noise, and dragging the
 * pointer pushes a smooth ripple through the lines. Tuned to the Axiom violet
 * palette so it slots in as that page's backdrop.
 *
 * Behaviour matches the sibling backgrounds: full-bleed, non-interactive,
 * reduced-motion aware (static frame), CSS fallback on WebGL failure.
 *
 * Client component (WebGL + browser APIs).
 */

export interface GridDistortionProps {
  /** Background colour `#rrggbb`. Defaults to Axiom deep navy. */
  readonly background?: string;
  /** Grid line colour `#rrggbb`. Defaults to Axiom violet. */
  readonly gridColor?: string;
  /** Accent colour `#rrggbb` for the moving highlight. Defaults to streak. */
  readonly accentColor?: string;
  /** Grid density (cells across). Defaults to 22. */
  readonly density?: number;
  /**
   * Overall distortion strength multiplier (0 = a still grid, 1 = full
   * warp). Scales both the ambient flow and the pointer ripple. Defaults to 1.
   */
  readonly intensity?: number;
  /** Optional extra class names for the host wrapper. */
  readonly className?: string;
}

const FRAGMENT_SHADER = `
uniform vec3 uBackground;
uniform vec3 uGrid;
uniform vec3 uAccent;
uniform float uDensity;
uniform float uIntensity;

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

// Distance to the nearest grid line for a given uv, returning line intensity.
float gridLines(vec2 uv, float density) {
  vec2 g = uv * density;
  vec2 f = abs(fract(g) - 0.5);
  float line = min(f.x, f.y);
  // Thin, anti-aliased lines.
  return 1.0 - smoothstep(0.0, 0.04, line);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float aspect = iResolution.x / iResolution.y;
  vec2 p = uv;
  p.x *= aspect;

  // Flowing low-frequency distortion field.
  float t = iTime * 0.15;
  vec2 flow = vec2(
    noise(p * 1.5 + vec2(t, 0.0)),
    noise(p * 1.5 + vec2(0.0, t + 5.2))
  );
  flow = (flow - 0.5) * 0.08 * uIntensity;

  // Pointer refraction lens: ripple radiating from the cursor.
  vec2 m = iMouse;
  m.x *= aspect;
  float d = distance(p, m);
  float ripple = sin(d * 22.0 - iTime * 3.0) * exp(-d * 5.0) * 0.05 * uIntensity;
  vec2 dir = d > 0.0001 ? normalize(p - m) : vec2(0.0);
  vec2 distortion = flow + dir * ripple;

  vec2 warped = uv + distortion;

  float line = gridLines(warped, uDensity);

  // Travelling accent band sweeping across the grid.
  float band = 0.5 + 0.5 * sin(warped.x * 3.0 + warped.y * 2.0 - iTime * 0.8);
  vec3 lineColor = mix(uGrid, uAccent, band * 0.6);

  // Glow near the cursor (scaled so a calm grid also has a calm highlight).
  float glow = exp(-d * 3.5) * 0.25 * uIntensity;

  vec3 col = uBackground;
  col += lineColor * line * 0.6;
  col += uAccent * glow;

  // Vignette.
  float vig = smoothstep(1.15, 0.3, length(uv - 0.5));
  col *= mix(0.7, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

const DEFAULT_BACKGROUND = '#050510'; // axiom.bgDeep
const DEFAULT_GRID = '#6C5CE7'; // axiom.primary
const DEFAULT_ACCENT = '#00F5A0'; // axiom.streak

export default function GridDistortion({
  background = DEFAULT_BACKGROUND,
  gridColor = DEFAULT_GRID,
  accentColor = DEFAULT_ACCENT,
  density = 22,
  intensity = 1,
  className,
}: GridDistortionProps): JSX.Element {
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
          uGrid: hexToRgb(gridColor),
          uAccent: hexToRgb(accentColor),
          uDensity: density,
          uIntensity: intensity,
        },
      },
    );

    return () => {
      handle?.destroy();
    };
  }, [background, gridColor, accentColor, density, intensity]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-0 overflow-hidden ${className ?? ''}`}
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${gridColor}1a 0%, ${background} 75%)`,
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
