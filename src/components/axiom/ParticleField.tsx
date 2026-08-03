'use client';

/**
 * ParticleField — the cinematic protagonist of the AXIOM landing page.
 *
 * A raw-WebGL point cloud (~25k particles on desktop) that keeps changing
 * what it is. Morph targets, in scroll order:
 *
 *   0 CHAOS   — scattered noise (the before-state)
 *   1 GLYPH   — the AXIOM "A" monogram (the decision)
 *   2 SYNAPSE — neural web of nodes and filaments (rewiring)
 *   3 SHIELD  — zero-knowledge privacy (the moat)
 *   4 TREE    — growth, who you become (the app's Rewire Tree motif)
 *
 * Shapes are sampled client-side from an offscreen 2D canvas, so there are
 * no image assets and no network cost. The parent drives `handle.state`
 * (progress 0–4, opacity, brightness) from GSAP tweens; the render loop just
 * reads the mutable object every frame — no React re-renders, ever.
 *
 * Per-particle stagger + a mid-flight swirl make every morph read as a burst
 * of embers rather than a linear tween. Pointer proximity repels particles
 * on desktop. Degrades honestly: no WebGL → nothing renders (the CSS stage
 * behind still stands); prefers-reduced-motion → a single static draw of the
 * monogram with no animation loop.
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

export interface ParticleFieldState {
  /** 0=chaos, 1=glyph, 2=brain, 3=shield, 4=tree; fractions blend. */
  progress: number;
  /** Global particle alpha, 0–1. */
  opacity: number;
  /** Color energy multiplier — pushed >1 for the dawn finale. */
  brightness: number;
}

export interface ParticleFieldHandle {
  state: ParticleFieldState;
}

interface ParticleFieldProps {
  className?: string;
}

// ── deterministic RNG (stable shapes across reloads) ─────────────────
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHAPE_CANVAS = 640;

type DrawShape = (ctx: CanvasRenderingContext2D) => void;

// ── shape painters (white on transparent, 640×640 space) ─────────────
const drawGlyphA: DrawShape = (ctx) => {
  ctx.lineWidth = 44;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(198, 500);
  ctx.lineTo(320, 148);
  ctx.lineTo(442, 500);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(252, 392);
  ctx.lineTo(388, 392);
  ctx.stroke();
  // Open orbit arc — motion without closing into a full ring (a closed
  // ring around an A reads as an anarchy mark).
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(320, 330, 244, 244, 0, Math.PI * 0.72, Math.PI * 1.55);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(320, 330, 244, 244, 0, Math.PI * 1.82, Math.PI * 2.35);
  ctx.stroke();
};

const drawSynapse: DrawShape = (ctx) => {
  // Synapse constellation — a neural web of glowing nodes joined by thin
  // filaments. Abstract on purpose: it reads as "rewiring" without the
  // uncanny-valley risk of drawing anatomy out of particles.
  const rnd = mulberry32(11);
  type Node = { x: number; y: number; r: number };
  const nodes: Node[] = [{ x: 320, y: 316, r: 27 }]; // hub
  // Inner shell.
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + rnd() * 0.7;
    const d = 95 + rnd() * 45;
    nodes.push({ x: 320 + Math.cos(a) * d, y: 316 + Math.sin(a) * d * 0.9, r: 13 + rnd() * 6 });
  }
  // Outer shell.
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2 + rnd() * 0.5;
    const d = 185 + rnd() * 65;
    nodes.push({ x: 320 + Math.cos(a) * d, y: 316 + Math.sin(a) * d * 0.88, r: 8 + rnd() * 7 });
  }
  // Filaments: hub→inner, every node→nearest two peers.
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  const edge = (a: Node, b: Node, w: number): void => {
    ctx.lineWidth = w;
    ctx.beginPath();
    // Slight sag makes the web organic instead of geometric.
    const mx = (a.x + b.x) / 2 + (rnd() - 0.5) * 34;
    const my = (a.y + b.y) / 2 + (rnd() - 0.5) * 34;
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mx, my, b.x, b.y);
    ctx.stroke();
  };
  for (let i = 1; i <= 5; i++) edge(nodes[0], nodes[i], 7);
  for (let i = 1; i < nodes.length; i++) {
    const dists = nodes
      .map((n, j) => ({ j, d: j === i || j === 0 ? Infinity : Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
      .sort((p, q) => p.d - q.d);
    edge(nodes[i], nodes[dists[0].j], 6);
    if (i > 5) edge(nodes[i], nodes[dists[1].j], 5);
  }
  // Nodes last so they stay dense and bright over the filaments.
  ctx.fillStyle = '#fff';
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  }
};

const shieldPath = (
  ctx: CanvasRenderingContext2D,
  s: number,
  cx: number,
  cy: number,
): void => {
  // s = scale of a 300-wide, 340-tall shield centred on (cx, cy).
  const w = 150 * s;
  const top = cy - 165 * s;
  const mid = cy + 20 * s;
  const bot = cy + 175 * s;
  ctx.beginPath();
  ctx.moveTo(cx - w, top + 26 * s);
  ctx.quadraticCurveTo(cx, top - 14 * s, cx + w, top + 26 * s);
  ctx.lineTo(cx + w, mid);
  ctx.quadraticCurveTo(cx + w, bot - 60 * s, cx, bot);
  ctx.quadraticCurveTo(cx - w, bot - 60 * s, cx - w, mid);
  ctx.closePath();
};

const drawShield: DrawShape = (ctx) => {
  ctx.fillStyle = '#fff';
  shieldPath(ctx, 1.06, 320, 320);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  // Inset outline → double-line shield.
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#fff';
  shieldPath(ctx, 0.86, 320, 320);
  ctx.stroke();
  // Keyhole.
  ctx.beginPath();
  ctx.arc(320, 288, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(302, 310);
  ctx.lineTo(338, 310);
  ctx.lineTo(352, 402);
  ctx.lineTo(288, 402);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
};

const drawTree: DrawShape = (ctx) => {
  const rnd = mulberry32(23);
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  const branch = (
    x: number,
    y: number,
    angle: number,
    len: number,
    width: number,
    depth: number,
  ): void => {
    if (depth === 0 || len < 7) return;
    const nx = x + Math.cos(angle) * len;
    const ny = y + Math.sin(angle) * len;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    const spread = 0.38 + rnd() * 0.3;
    branch(nx, ny, angle - spread, len * (0.68 + rnd() * 0.14), width * 0.68, depth - 1);
    branch(nx, ny, angle + spread, len * (0.68 + rnd() * 0.14), width * 0.68, depth - 1);
    if (rnd() > 0.72) {
      branch(nx, ny, angle + (rnd() - 0.5) * 0.6, len * 0.55, width * 0.5, depth - 2);
    }
  };
  branch(320, 585, -Math.PI / 2, 118, 17, 9);
  // Root flare.
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(320, 585);
  ctx.lineTo(276, 618);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(320, 585);
  ctx.lineTo(366, 616);
  ctx.stroke();
};

// ── sampling ─────────────────────────────────────────────────────────
function sampleShape(
  draw: DrawShape,
  count: number,
  rnd: () => number,
): Float32Array {
  const out = new Float32Array(count * 3);
  if (typeof document === 'undefined') return out;
  const cv = document.createElement('canvas');
  cv.width = SHAPE_CANVAS;
  cv.height = SHAPE_CANVAS;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sampleChaos(count, rnd);
  draw(ctx);
  const img = ctx.getImageData(0, 0, SHAPE_CANVAS, SHAPE_CANVAS).data;
  const px: number[] = [];
  for (let y = 0; y < SHAPE_CANVAS; y += 2) {
    for (let x = 0; x < SHAPE_CANVAS; x += 2) {
      if (img[(y * SHAPE_CANVAS + x) * 4 + 3] > 100) px.push(x, y);
    }
  }
  if (px.length < 600) return sampleChaos(count, rnd);
  const n = px.length / 2;
  for (let i = 0; i < count; i++) {
    const k = (rnd() * n) | 0;
    const jx = px[k * 2] + (rnd() - 0.5) * 3.4;
    const jy = px[k * 2 + 1] + (rnd() - 0.5) * 3.4;
    out[i * 3] = (jx / SHAPE_CANVAS) * 2 - 1;
    out[i * 3 + 1] = -((jy / SHAPE_CANVAS) * 2 - 1);
    out[i * 3 + 2] = (rnd() - 0.5) * 0.22;
  }
  return out;
}

function sampleChaos(count: number, rnd: () => number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const th = rnd() * Math.PI * 2;
    const r = 0.15 + Math.pow(rnd(), 0.42) * 1.35;
    out[i * 3] = Math.cos(th) * r;
    out[i * 3 + 1] = Math.sin(th) * r * 0.85;
    out[i * 3 + 2] = (rnd() - 0.5) * 0.9;
  }
  return out;
}

// ── shaders ──────────────────────────────────────────────────────────
const VERT = `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec4 aSeed; // x stagger, y colorMix, z phase, w sizeVar
uniform float uBlend;
uniform float uTime;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform vec2  uScale;
uniform float uPointBase;
varying float vAlpha;
varying float vMix;
varying float vSpark;

void main() {
  float stag = aSeed.x * 0.42;
  float t = clamp((uBlend - stag) / (1.0 - stag), 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 pos = mix(aFrom, aTo, t);

  // Mid-flight swirl: particles scatter into embers between shapes.
  float hump = sin(3.14159 * t);
  float ang = aSeed.z * 6.2831 + uTime * 0.35;
  float amp = (0.05 + 0.34 * aSeed.w) * hump;
  pos.x += cos(ang) * amp;
  pos.y += sin(ang * 1.31) * amp;
  pos.z += cos(ang * 0.7) * amp * 0.6;

  // Idle breathing so a held shape never freezes.
  pos.x += sin(uTime * 0.5 + aSeed.z * 6.2831) * 0.008;
  pos.y += cos(uTime * 0.42 + aSeed.z * 9.42) * 0.008;

  // Whole-field slow drift.
  float rot = sin(uTime * 0.05) * 0.035;
  float cr = cos(rot); float sr = sin(rot);
  pos.xy = mat2(cr, -sr, sr, cr) * pos.xy;

  vec2 p = pos.xy * uScale;

  // Pointer repulsion.
  vec2 dm = p - uMouse;
  float dist = length(dm);
  float push = smoothstep(0.38, 0.0, dist) * uMouseStrength;
  p += (dm / max(dist, 0.0001)) * push * 0.14;

  gl_Position = vec4(p, 0.0, 1.0);

  float tw = 0.72 + 0.5 * sin(uTime * (1.1 + aSeed.z * 1.8) + aSeed.z * 40.0);
  gl_PointSize = uPointBase * (0.6 + aSeed.w * 1.1) * (1.0 + pos.z * 1.1) * tw;

  vAlpha = 0.55 + 0.45 * tw;
  vMix = aSeed.y;
  vSpark = step(0.962, fract(aSeed.y * 7.13));
}
`;

const FRAG = `
precision mediump float;
uniform float uOpacity;
uniform float uBrightness;
varying float vAlpha;
varying float vMix;
varying float vSpark;

void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;
  float fall = exp(-d * 3.2) * (1.0 - d);
  vec3 silver = vec3(0.84, 0.83, 0.90);
  vec3 violet = vec3(0.55, 0.47, 0.96);
  vec3 col = mix(silver, violet, vMix * 0.85);
  col += vSpark * vec3(0.5, 0.45, 0.6);
  float a = fall * vAlpha * uOpacity;
  gl_FragColor = vec4(col * a * uBrightness, a);
}
`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

// ── component ────────────────────────────────────────────────────────
const ParticleField = forwardRef<ParticleFieldHandle, ParticleFieldProps>(
  function ParticleField({ className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef<ParticleFieldState>({
      progress: 0,
      opacity: 1,
      brightness: 1,
    });

    useImperativeHandle(ref, () => ({ state: stateRef.current }), []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const small = window.innerWidth < 768;
      // Scale density to the machine: fewer cores usually means an iGPU or a
      // budget phone, and half the particles is indistinguishable there.
      const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
      const COUNT = reduce
        ? 6000
        : small || coarse
          ? lowPower
            ? 7000
            : 11000
          : lowPower
            ? 14000
            : 26000;

      const gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        powerPreference: 'high-performance',
      });
      if (!gl) return;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;
      const prog = gl.createProgram();
      if (!prog) return;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      // Shape targets. Index matches ParticleFieldState.progress.
      const rnd = mulberry32(1337);
      const shapes: Float32Array[] = [
        sampleChaos(COUNT, rnd),
        sampleShape(drawGlyphA, COUNT, rnd),
        sampleShape(drawSynapse, COUNT, rnd),
        sampleShape(drawShield, COUNT, rnd),
        sampleShape(drawTree, COUNT, rnd),
      ];
      const buffers = shapes.map((data) => {
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return b;
      });

      const seeds = new Float32Array(COUNT * 4);
      for (let i = 0; i < COUNT; i++) {
        seeds[i * 4] = rnd();
        seeds[i * 4 + 1] = rnd();
        seeds[i * 4 + 2] = rnd();
        seeds[i * 4 + 3] = rnd();
      }
      const seedBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf);
      gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);

      const locFrom = gl.getAttribLocation(prog, 'aFrom');
      const locTo = gl.getAttribLocation(prog, 'aTo');
      const locSeed = gl.getAttribLocation(prog, 'aSeed');
      gl.enableVertexAttribArray(locFrom);
      gl.enableVertexAttribArray(locTo);
      gl.enableVertexAttribArray(locSeed);
      gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf);
      gl.vertexAttribPointer(locSeed, 4, gl.FLOAT, false, 0, 0);

      const uni = {
        blend: gl.getUniformLocation(prog, 'uBlend'),
        time: gl.getUniformLocation(prog, 'uTime'),
        mouse: gl.getUniformLocation(prog, 'uMouse'),
        mouseStrength: gl.getUniformLocation(prog, 'uMouseStrength'),
        scale: gl.getUniformLocation(prog, 'uScale'),
        pointBase: gl.getUniformLocation(prog, 'uPointBase'),
        opacity: gl.getUniformLocation(prog, 'uOpacity'),
        brightness: gl.getUniformLocation(prog, 'uBrightness'),
      };

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.6 : 2);
      const resize = (): void => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (w === 0 || h === 0) return;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      // Pointer state, smoothed in the loop.
      const mouse = { x: 10, y: 10, tx: 10, ty: 10, energy: 0 };
      const onPointer = (e: PointerEvent): void => {
        const r = canvas.getBoundingClientRect();
        mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
        mouse.energy = 1;
      };
      if (!coarse && !reduce) {
        window.addEventListener('pointermove', onPointer, { passive: true });
      }

      let raf = 0;
      let lost = false;
      const onLost = (e: Event): void => {
        e.preventDefault();
        lost = true;
        cancelAnimationFrame(raf);
      };
      canvas.addEventListener('webglcontextlost', onLost);

      const draw = (timeMs: number): void => {
        const s = stateRef.current;
        const p = Math.max(0, Math.min(shapes.length - 1 - 0.0001, s.progress));
        const seg = Math.floor(p);
        const blend = p - seg;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[seg]);
        gl.vertexAttribPointer(locFrom, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[Math.min(seg + 1, shapes.length - 1)]);
        gl.vertexAttribPointer(locTo, 3, gl.FLOAT, false, 0, 0);

        const w = canvas.width;
        const h = canvas.height;
        const m = Math.min(w, h);
        const zoom = small ? 1.02 : 1.16;
        gl.uniform2f(uni.scale, (m / w) * zoom, (m / h) * zoom);
        gl.uniform1f(uni.blend, blend);
        gl.uniform1f(uni.time, timeMs * 0.001);
        gl.uniform1f(uni.pointBase, (small ? 2.1 : 2.5) * dpr);
        gl.uniform1f(uni.opacity, s.opacity);
        gl.uniform1f(uni.brightness, s.brightness);

        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;
        mouse.energy *= 0.985;
        gl.uniform2f(uni.mouse, mouse.x, mouse.y);
        gl.uniform1f(uni.mouseStrength, 0.35 + mouse.energy * 0.65);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, COUNT);
      };

      if (reduce) {
        // One static frame of the monogram; no loop.
        stateRef.current.progress = 1;
        stateRef.current.opacity = 0.55;
        draw(0);
      } else {
        // While the field is dimmed behind content sections, render at half
        // rate — invisible to the eye at 16% alpha, real GPU/battery savings
        // across the long reading stretch of the page.
        let frame = 0;
        const loop = (t: number): void => {
          if (!lost) {
            frame++;
            if (stateRef.current.opacity >= 0.3 || frame % 2 === 0) draw(t);
            raf = requestAnimationFrame(loop);
          }
        };
        raf = requestAnimationFrame(loop);
      }

      const onVisibility = (): void => {
        if (reduce || lost) return;
        cancelAnimationFrame(raf);
        if (!document.hidden) {
          raf = requestAnimationFrame(function loop(t) {
            if (!lost) {
              draw(t);
              raf = requestAnimationFrame(loop);
            }
          });
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener('pointermove', onPointer);
        document.removeEventListener('visibilitychange', onVisibility);
        canvas.removeEventListener('webglcontextlost', onLost);
        buffers.forEach((b) => gl.deleteBuffer(b));
        gl.deleteBuffer(seedBuf);
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden />;
  },
);

export default ParticleField;
