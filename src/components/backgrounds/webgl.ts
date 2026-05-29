/**
 * Minimal, dependency-free WebGL full-screen-quad runner.
 *
 * Powers the procedural background components in this folder (Beams,
 * GradientBlinds, GridDistortion) without pulling in Three.js or OGL — it
 * matches the existing self-contained canvas style used by `NeuralOrb` and
 * keeps the static export lean.
 *
 * Features:
 *   - Compiles a caller-supplied fragment shader against a fixed clip-space
 *     vertex shader (GLSL ES 1.00, broadly compatible).
 *   - Always exposes `iTime` (seconds), `iResolution` (device px), and
 *     `iMouse` (0..1, y-up) uniforms, plus any caller-supplied scalar/vec
 *     uniforms (e.g. brand colours).
 *   - Caps device-pixel-ratio for fill-rate sanity on hi-dpi screens.
 *   - Pauses the rAF loop when the canvas scrolls off-screen
 *     (IntersectionObserver) or the tab is hidden, then resumes cleanly.
 *   - `animate: false` renders a single static frame — used to honour
 *     `prefers-reduced-motion`.
 *   - Fails gracefully: if WebGL is unavailable or a shader fails to
 *     compile, it returns `null` and the caller's CSS fallback shows through.
 */

export type UniformValue =
  | number
  | readonly [number, number]
  | readonly [number, number, number]
  | readonly [number, number, number, number];

export interface ShaderBackgroundOptions {
  /** Fragment shader source (GLSL ES 1.00). */
  readonly fragment: string;
  /** Static custom uniforms (colours, knobs). Re-applied every frame. */
  readonly uniforms?: Readonly<Record<string, UniformValue>>;
  /** When false, renders a single frame and never starts the rAF loop. */
  readonly animate?: boolean;
  /** Upper bound on devicePixelRatio. Defaults to 1.5. */
  readonly dprCap?: number;
}

export interface ShaderBackgroundHandle {
  /** Tear down listeners, observers, the rAF loop, and the GL context. */
  destroy(): void;
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_PRELUDE = `
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
`;

type GL = WebGLRenderingContext;

function compileShader(
  gl: GL,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (shader === null) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) !== true) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function buildProgram(gl: GL, fragment: string): WebGLProgram | null {
  const vert = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const frag = compileShader(
    gl,
    gl.FRAGMENT_SHADER,
    `${FRAGMENT_PRELUDE}\n${fragment}`,
  );
  if (vert === null || frag === null) return null;

  const program = gl.createProgram();
  if (program === null) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  // Shaders can be detached/deleted once linked; the program keeps the code.
  gl.deleteShader(vert);
  gl.deleteShader(frag);

  if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function applyUniform(
  gl: GL,
  location: WebGLUniformLocation,
  value: UniformValue,
): void {
  if (typeof value === 'number') {
    gl.uniform1f(location, value);
    return;
  }
  switch (value.length) {
    case 2:
      gl.uniform2f(location, value[0], value[1]);
      return;
    case 3:
      gl.uniform3f(location, value[0], value[1], value[2]);
      return;
    case 4:
      gl.uniform4f(location, value[0], value[1], value[2], value[3]);
      return;
  }
}

export function createShaderBackground(
  canvas: HTMLCanvasElement,
  options: ShaderBackgroundOptions,
): ShaderBackgroundHandle | null {
  if (typeof window === 'undefined') return null;

  const gl =
    (canvas.getContext('webgl', {
      premultipliedAlpha: false,
      antialias: true,
    }) as GL | null) ??
    (canvas.getContext('experimental-webgl') as GL | null);
  if (gl === null) return null;

  const program = buildProgram(gl, options.fragment);
  if (program === null) return null;

  const animate = options.animate ?? true;
  const dprCap = options.dprCap ?? 1.5;
  const customUniforms = options.uniforms ?? {};

  // Full-screen quad (two triangles).
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const positionLoc = gl.getAttribLocation(program, 'a_position');
  const uResolution = gl.getUniformLocation(program, 'iResolution');
  const uTime = gl.getUniformLocation(program, 'iTime');
  const uMouse = gl.getUniformLocation(program, 'iMouse');

  const customLocations: Record<string, WebGLUniformLocation | null> = {};
  for (const name of Object.keys(customUniforms)) {
    customLocations[name] = gl.getUniformLocation(program, name);
  }

  const mouse: { x: number; y: number } = { x: 0.5, y: 0.5 };
  const startTime = performance.now();
  let rafId = 0;
  let running = false;
  let visible = true;
  let disposed = false;
  // Ambient backgrounds look identical at ~30fps but cost roughly half the
  // GPU/battery of an uncapped 60/120fps loop. Throttle to a min frame time.
  const minFrameMs = 1000 / 30;
  let lastFrameTime = 0;

  const resize = (): void => {
    // On coarse-pointer (touch / mobile) devices, fragment-heavy shaders are
    // far more expensive per screen pixel, so render at a lower internal
    // resolution there. Data-saver mode drops it further. This keeps the
    // effect smooth on phones without changing how it looks on desktop.
    const coarse =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches;
    const navWithData = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    const saveData = navWithData.connection?.saveData === true;
    const effectiveCap = saveData ? 1 : coarse ? Math.min(dprCap, 1) : dprCap;

    const dpr = Math.min(window.devicePixelRatio || 1, effectiveCap);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  };

  const renderFrame = (): void => {
    resize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    if (uResolution !== null) {
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    }
    if (uTime !== null) {
      gl.uniform1f(uTime, (performance.now() - startTime) / 1000);
    }
    if (uMouse !== null) {
      gl.uniform2f(uMouse, mouse.x, mouse.y);
    }
    for (const name of Object.keys(customUniforms)) {
      const loc = customLocations[name];
      if (loc !== null && loc !== undefined) {
        applyUniform(gl, loc, customUniforms[name]);
      }
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const loop = (): void => {
    if (disposed) return;
    const now = performance.now();
    // Throttle: only redraw once enough time has elapsed. The rAF loop keeps
    // running so we stay in sync with the display's refresh cadence.
    if (now - lastFrameTime >= minFrameMs) {
      lastFrameTime = now;
      renderFrame();
    }
    rafId = window.requestAnimationFrame(loop);
  };

  const start = (): void => {
    if (running || disposed || !animate) return;
    running = true;
    rafId = window.requestAnimationFrame(loop);
  };

  const stop = (): void => {
    running = false;
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const handlePointerMove = (event: PointerEvent): void => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    mouse.x = (event.clientX - rect.left) / rect.width;
    // Flip to y-up so shaders read bottom-left origin.
    mouse.y = 1 - (event.clientY - rect.top) / rect.height;
  };

  const handleVisibility = (): void => {
    if (document.hidden) {
      stop();
    } else if (visible) {
      start();
    }
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('visibilitychange', handleVisibility);

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      visible = entry?.isIntersecting ?? true;
      if (visible && !document.hidden) {
        start();
      } else {
        stop();
      }
    },
    { threshold: 0 },
  );
  observer.observe(canvas);

  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (!running) renderFrame();
    });
    resizeObserver.observe(canvas);
  }

  // Initial paint (also the only paint when animate === false).
  renderFrame();
  if (animate) start();

  return {
    destroy(): void {
      disposed = true;
      stop();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      resizeObserver?.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      const lose = gl.getExtension('WEBGL_lose_context');
      lose?.loseContext();
    },
  };
}

/**
 * Convert a `#rrggbb` hex string to a normalized RGB triple for shader use.
 * Falls back to mid-grey on malformed input so a typo never crashes a page.
 */
export function hexToRgb(hex: string): readonly [number, number, number] {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (match === null) return [0.5, 0.5, 0.5] as const;
  const int = parseInt(match[1], 16);
  return [
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  ] as const;
}

/** True when the user has requested reduced motion. SSR-safe (false on server). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
