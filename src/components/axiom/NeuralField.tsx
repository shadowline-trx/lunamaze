'use client';

/**
 * NeuralField — the page-wide living background ("The Rewiring").
 *
 * This is NOT a hero decoration: one fixed, full-viewport GLSL canvas sits
 * behind the entire page and is driven by scroll progress, so the background
 * IS the narrative. At the top the field is chaotic — dense, disordered,
 * drifting filaments (the dysregulated brain). As you scroll, `uProgress`
 * rises and the field *reorganizes*: the domain warp calms, the noise turns
 * anisotropic so filaments draw out into long coherent strands, and the
 * palette walks from cold violet toward dawn. By the finale it is ordered,
 * warm and sparse.
 *
 * Legibility is a first-class constraint: brightness follows an envelope that
 * dips through the middle of the page, where the copy is densest, and only
 * opens up again at the hero and the finale.
 *
 * Runs on the repo's `webgl.ts` engine (DPR-capped, pauses when hidden,
 * reduced-motion-safe, CSS fallback shows through when GL is unavailable).
 */

import { useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';
import {
  createShaderBackground,
  hexToRgb,
  prefersReducedMotion,
  type ShaderBackgroundHandle,
} from '@/components/backgrounds/webgl';

const FRAGMENT = `
// Living neural tissue that reorganizes with scroll.
uniform vec3  uBase;     // near-black base
uniform vec3  uViolet;   // spine violet (disordered state)
uniform vec3  uEmber;    // warm disturbance near the cursor
uniform vec3  uGreen;    // reward accent (very sparing)
uniform vec3  uDawn;     // the earned end-state hue
uniform float uProgress; // 0 = top of page (chaos) .. 1 = finale (order)
uniform float uHeat;     // 0 until the pointer has actually moved

float hash(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
// ridged fbm: (1 - |n|) accumulates into thread-like bright ridges
float ridged(vec2 p){
  float sum = 0.0;
  float amp = 0.55;
  float freq = 1.0;
  for (int i = 0; i < 5; i++){
    float n = noise(p * freq);
    n = 1.0 - abs(n * 2.0 - 1.0);
    n = n * n;
    sum += n * amp;
    freq *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

void main(){
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float aspect = iResolution.x / iResolution.y;
  vec2 p = uv;
  p.x *= aspect;

  float t = iTime * 0.045;
  float order = clamp(uProgress, 0.0, 1.0);
  // Ease so most of the visible reorganizing happens through the middle of
  // the page rather than all at once right after the hero.
  float o = order * order * (3.0 - 2.0 * order);

  // ── the reorganizing field ────────────────────────────────────────
  // Chaos: strong, isotropic domain warp -> tangled filaments.
  // Order: warp falls away and sampling turns anisotropic (y compressed),
  // which stretches the ridges into long, deliberate, parallel strands.
  float warpAmt = mix(1.5, 0.32, o);
  vec2 aniso = mix(vec2(1.0, 1.0), vec2(0.62, 3.1), o);

  vec2 q = vec2(
    ridged(p * 2.4 + vec2(0.0, t)),
    ridged(p * 2.4 + vec2(5.2, -t))
  );
  vec2 warped = (p * 5.2) * aniso + q * warpAmt + vec2(t * 0.5, -t * 0.3);
  float field = ridged(warped);

  // Light ONLY the ridge crests. A wide threshold band turns this into broad
  // smoke — which both looks like stock footage and destroys legibility. A
  // narrow, high band leaves thin bright strands on near-black: reads as
  // engineered neural structure, and copy stays readable on top of it.
  float lo = mix(0.74, 0.80, o);
  float hi = mix(0.96, 1.02, o);
  float filament = smoothstep(lo, hi, field);
  filament = pow(filament, mix(1.9, 2.3, o));

  // ── cursor disturbance ────────────────────────────────────────────
  vec2 m = iMouse;
  m.x *= aspect;
  // iMouse sits at the screen centre until the pointer first moves, which
  // would otherwise paint a permanent unexplained warm blob mid-page (and on
  // touch devices, forever). uHeat gates it until there is a real pointer.
  float heat = smoothstep(0.55, 0.0, distance(p, m)) * uHeat;

  // ── palette: cold violet -> dawn ──────────────────────────────────
  // Dawn is the EARNED end-state, so it must not bleed into the middle of the
  // page — mixing it by raw progress turns the whole body a muddy brown. Gate
  // it behind a late smoothstep and the spine stays cold violet until the
  // finale actually arrives.
  float dawnMix = smoothstep(0.72, 1.0, order);

  vec3 col = uBase;
  col = mix(col, uViolet * 0.16, uv.y * 0.55);
  col = mix(col, uDawn * 0.15, dawnMix);

  vec3 strand = mix(uViolet * 1.25, uDawn * 0.95, dawnMix);
  strand = mix(strand, uEmber, heat * 0.85);

  // Brightness envelope: bright at the hero, restrained through the copy-heavy
  // middle so text always wins, opening back up for the finale. Kept
  // deliberately low-contrast so the filaments read as a quiet texture behind
  // the copy, never competing with it.
  float envelope = mix(1.85, 1.25, smoothstep(0.0, 0.42, order))
                 + 0.70 * smoothstep(0.68, 1.0, order);

  col += strand * filament * (envelope + heat);

  // Rare green glints at the brightest cores — the "earned" accent, and it
  // only really arrives once the field has organized.
  float core = smoothstep(1.35, 1.7, field);
  col += uGreen * core * (0.12 + 0.34 * o);

  // Slow breathing pulse, calming as the field settles.
  col *= (0.92 + 0.08 * sin(iTime * 0.4)) * (1.0 - 0.03 * o);

  // Vignette keeps edges dark so foreground copy stays legible.
  float vig = smoothstep(1.25, 0.30, length(uv - 0.5));
  col *= 0.78 + 0.22 * vig;

  // Gentle filmic tone + gamma.
  col = col / (col + 0.7);
  col = pow(col, vec3(0.85));

  gl_FragColor = vec4(col, 1.0);
}
`;

type NeuralFieldProps = {
  base?: string;
  violet?: string;
  ember?: string;
  green?: string;
  dawn?: string;
  className?: string;
};

export default function NeuralField({
  base = '#08070C',
  violet = '#6C5CE7',
  ember = '#FF7A59',
  green = '#00F5A0',
  dawn = '#FF9E7D',
  className,
}: NeuralFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<ShaderBackgroundHandle | null>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    // Defer GL init until after first paint so it never blocks LCP.
    const id = window.requestAnimationFrame(() => {
      handleRef.current = createShaderBackground(canvas, {
        fragment: FRAGMENT,
        animate: !prefersReducedMotion(),
        dprCap: 1.75,
        uniforms: {
          uBase: hexToRgb(base),
          uViolet: hexToRgb(violet),
          uEmber: hexToRgb(ember),
          uGreen: hexToRgb(green),
          uDawn: hexToRgb(dawn),
          uProgress: 0,
          uHeat: 0,
        },
      });
    });
    return () => {
      window.cancelAnimationFrame(id);
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, [base, violet, ember, green, dawn]);

  // Fade the cursor warmth in once, on the first real pointer movement.
  useEffect(() => {
    let raf = 0;
    let amount = 0;
    const ramp = () => {
      amount = Math.min(1, amount + 0.05);
      handleRef.current?.setUniform('uHeat', amount);
      if (amount < 1) raf = window.requestAnimationFrame(ramp);
    };
    const onMove = () => {
      window.removeEventListener('pointermove', onMove);
      raf = window.requestAnimationFrame(ramp);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  // Drive the reorganization from scroll. framer's motion value already reads
  // the same scroll position Lenis is animating, so this stays in sync with
  // the smooth-scroll inertia instead of fighting it.
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v: number) => {
      handleRef.current?.setUniform('uProgress', v);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
