/**
 * WebGL2 relighting of the hero labyrinth.
 *
 * The walls are rasterised once, from the same SVG path the server rendered,
 * into a height map with a rounded profile. One full-screen fragment shader
 * then lights that relief as engraved silver: a fixed moon, the visitor's
 * pointer as a lantern, and the head of the thread as a travelling light that
 * glows along the corridor it is in. The crescent and the blade are analytic,
 * so they stay sharp at any zoom.
 *
 * Loaded with `import()` after the page is idle; it never blocks first paint.
 */

export interface LabyrinthState {
  centreX: number;
  centreY: number;
  radius: number;
  rotation: number;
  progress: number;
  head: [number, number];
  pointer: [number, number];
  pointerActive: number;
}

interface Options {
  readonly walls: string;
  readonly wallWidth: number;
  readonly state: LabyrinthState;
  readonly onReady: () => void;
}

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uWalls;
uniform vec2 uRes;
uniform float uDpr;
uniform vec2 uCentre;
uniform float uRadius;
uniform float uRot;
uniform vec2 uPointer;
uniform float uPointerOn;
uniform vec2 uHead;
uniform float uProgress;
uniform float uTime;
uniform float uReveal;
uniform float uTexel;
out vec4 outColor;

const vec2 C1 = vec2(-58.0, 34.0);
const float R1 = 512.0;
const float R2 = 462.0;
const vec2 C3 = vec2(34.0, -30.0);
const float R3 = 470.0;
const float R4 = 486.0;
const vec3 INK = vec3(0.0353, 0.0275, 0.0588);
const vec3 MOONLIGHT = vec3(1.0, 0.965, 0.9);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 toMaze(vec2 css) {
  vec2 d = css - uCentre;
  float c = cos(uRot);
  float s = sin(uRot);
  d = vec2(c * d.x + s * d.y, -s * d.x + c * d.y);
  return d * (600.0 / uRadius);
}

vec3 shadeMetal(vec3 n, vec3 P, vec3 albedo, vec3 envLow, vec3 envHigh, vec2 pm, float gloss) {
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 moonL = normalize(vec3(-0.55, -0.75, 0.62));
  float diff = max(dot(n, moonL), 0.0);
  float spec = pow(max(dot(n, normalize(moonL + V)), 0.0), gloss);
  float facing = dot(n.xy, vec2(-0.6, -0.8));
  vec3 env = mix(envLow, envHigh, smoothstep(-0.5, 0.85, facing));
  vec3 col = albedo * (0.16 + 0.5 * diff) + env * 0.42 + spec * 0.85;

  vec3 Lp = vec3(pm, 150.0) - P;
  float dp = length(Lp);
  Lp /= dp;
  float attP = uPointerOn / (1.0 + pow(dp / 240.0, 2.0));
  col += MOONLIGHT * (max(dot(n, Lp), 0.0) * 0.55 + pow(max(dot(n, normalize(Lp + V)), 0.0), gloss * 0.8) * 1.3) * attP;

  vec3 Lh = vec3(uHead, 46.0) - P;
  float dh = length(Lh);
  Lh /= dh;
  float attH = (0.4 + 0.6 * smoothstep(0.0, 0.04, uProgress)) / (1.0 + pow(dh / 80.0, 2.0));
  col += MOONLIGHT * (max(dot(n, Lh), 0.0) * 1.1 + pow(max(dot(n, normalize(Lh + V)), 0.0), gloss * 0.7) * 1.5) * attH;
  return col;
}

void main() {
  vec2 css = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 m = toMaze(css);
  vec2 pm = toMaze(uPointer);
  float unitsPerPx = 600.0 / uRadius / uDpr;
  float r = length(m);

  // Background: the page's ink, a violet haze around the maze, and stars.
  vec3 col = INK;
  col += vec3(0.30, 0.22, 0.64) * exp(-pow(r / 640.0, 2.0)) * 0.11;
  vec2 cell = floor(css / 2.5);
  float h0 = hash(cell);
  float star = step(0.9972, h0) * (0.45 + 0.55 * sin(uTime * (0.6 + h0 * 2.0) + h0 * 90.0));
  col += vec3(0.9, 0.88, 1.0) * star * 0.5 * smoothstep(470.0, 560.0, r);

  // Maze floor and walls.
  vec2 uv = m / 1200.0 + 0.5;
  if (r < 600.0) {
    float h = texture(uWalls, uv).r;
    float hx = texture(uWalls, uv + vec2(uTexel, 0.0)).r - texture(uWalls, uv - vec2(uTexel, 0.0)).r;
    float hy = texture(uWalls, uv + vec2(0.0, uTexel)).r - texture(uWalls, uv - vec2(0.0, uTexel)).r;
    float ao = textureLod(uWalls, uv, 4.0).r;
    vec3 n = normalize(vec3(-hx, -hy, 0.2));
    vec3 P = vec3(m, h * 16.0);

    vec3 floorC = INK * 0.8 * (1.0 - ao * 0.6);
    float dh = length(m - uHead);
    float corridor = (0.4 + 0.6 * smoothstep(0.0, 0.04, uProgress)) / (1.0 + pow(dh / 70.0, 2.0));
    floorC += vec3(0.95, 0.9, 1.0) * corridor * 0.32 * (1.0 - ao * 0.7);
    float dpf = length(m - pm);
    floorC += vec3(0.48, 0.4, 1.0) * 0.07 * uPointerOn / (1.0 + pow(dpf / 200.0, 2.0));

    vec3 wall = shadeMetal(n, P, vec3(0.8, 0.79, 0.86), vec3(0.14, 0.09, 0.3), vec3(0.96, 0.94, 1.0), pm, 46.0);
    float mask = smoothstep(0.03, 0.03 + max(0.06, unitsPerPx * 0.02), h);
    float disc = 1.0 - smoothstep(448.0, 468.0, r);
    col = mix(col, floorC, disc);
    col = mix(col, wall, mask);

    // A single sweep of light outward when the layer wakes up.
    float sweep = exp(-pow((r - uReveal * 760.0) / 50.0, 2.0)) * (1.0 - uReveal);
    col += vec3(0.85, 0.8, 1.0) * sweep * mask * 0.9;
  }

  // Crescent: the violet moon of the emblem.
  float d1 = length(m - C1);
  float eOuter = R1 - d1;
  float eInner = r - R2;
  float e1 = min(eOuter, eInner);
  if (e1 > -3.0) {
    vec2 dir = eOuter < eInner ? (m - C1) / d1 : -m / max(r, 1.0);
    float slope = (1.0 - smoothstep(0.0, 22.0, e1)) * 1.6;
    vec3 n = normalize(vec3(dir * slope, 1.0));
    vec3 P = vec3(m, smoothstep(0.0, 22.0, e1) * 16.0);
    float along = smoothstep(-460.0, 460.0, dot(m, normalize(vec2(0.8, 1.0))));
    vec3 albedo = mix(vec3(0.6, 0.48, 0.98), vec3(0.14, 0.08, 0.32), along);
    vec3 c = shadeMetal(n, P, albedo, vec3(0.1, 0.05, 0.24), vec3(0.72, 0.62, 1.0), pm, 34.0) * mix(1.0, 0.7, along);
    col = mix(col, c, smoothstep(0.0, max(1.2, unitsPerPx * 1.2), e1));
  }

  // Blade: the thin silver sweep over the top right.
  float d3 = length(m - C3);
  float e3 = min(R3 - d3, r - R4);
  if (e3 > -3.0) {
    vec2 dir = (R3 - d3) < (r - R4) ? (m - C3) / d3 : -m / max(r, 1.0);
    float slope = (1.0 - smoothstep(0.0, 9.0, e3)) * 1.4;
    vec3 n = normalize(vec3(dir * slope, 1.0));
    vec3 P = vec3(m, smoothstep(0.0, 9.0, e3) * 10.0);
    vec3 c = shadeMetal(n, P, vec3(0.85, 0.84, 0.9), vec3(0.2, 0.16, 0.34), vec3(1.0, 0.98, 1.0), pm, 60.0);
    col = mix(col, c, smoothstep(0.0, max(1.2, unitsPerPx * 1.2), e3));
  }

  // Lens: gentle vignette and a whisper of grain.
  vec2 q = css / (uRes / uDpr) - 0.5;
  col *= 1.0 - dot(q, q) * 0.55;
  col += (hash(gl_FragCoord.xy + fract(uTime * 7.0) * 311.0) - 0.5) * 0.028;
  outColor = vec4(max(col, 0.0), 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

/**
 * Rasterise the walls as a height map. The strokes are spread over several
 * frames so no single task runs long on a slow phone.
 */
function wallTexture(size: number, walls: string, wallWidth: number, done: (c: HTMLCanvasElement) => void): () => void {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) return () => undefined;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
  ctx.setTransform(size / 1200, 0, 0, size / 1200, size / 2, size / 2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'lighter';
  const path = new Path2D(walls);
  // Stack strokes of shrinking width so the height follows a rounded profile:
  // pass i covers the band where the wall is at least i/passes tall.
  const passes = 14;
  const step = Math.floor(255 / passes);
  ctx.strokeStyle = `rgb(${step},0,0)`;
  let i = 0;
  let raf = 0;
  const work = (): void => {
    const until = performance.now() + 6;
    while (i < passes && performance.now() < until) {
      const t = i / passes;
      ctx.lineWidth = wallWidth * 1.08 * Math.sqrt(1 - t * t);
      ctx.stroke(path);
      i += 1;
    }
    if (i < passes) raf = requestAnimationFrame(work);
    else done(c);
  };
  raf = requestAnimationFrame(work);
  return () => cancelAnimationFrame(raf);
}

export function startLabyrinth(canvas: HTMLCanvasElement, options: Options): () => void {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  });
  if (!gl) return () => undefined;

  // Software rasterisers (no GPU, or a blocklisted one) would spend the main
  // thread drawing this; the SVG hero is the better experience there.
  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return () => undefined;
  }

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const lowPower = coarse || cores <= 4;
  let dprScale = Math.min(window.devicePixelRatio || 1, lowPower ? 1.35 : 1.75);

  const parallel = gl.getExtension('KHR_parallel_shader_compile');
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return () => undefined;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
  const texSize = Math.min(maxTex, lowPower ? 1024 : 2048);
  const texture = gl.createTexture();
  let textureReady = false;
  const cancelTexture = wallTexture(texSize, options.walls, options.wallWidth, (source) => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    textureReady = true;
    if (visible && !raf) raf = requestAnimationFrame(render);
  });

  let ready = false;
  let uniforms: Record<string, WebGLUniformLocation | null> = {};
  const finishLink = (): boolean => {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);
    const loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const name of ['uWalls', 'uRes', 'uDpr', 'uCentre', 'uRadius', 'uRot', 'uPointer', 'uPointerOn', 'uHead', 'uProgress', 'uTime', 'uReveal', 'uTexel']) {
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    gl.uniform1i(uniforms.uWalls, 0);
    gl.uniform1f(uniforms.uTexel, 1.5 / texSize);
    return true;
  };

  let width = 0;
  let height = 0;
  const resize = (): void => {
    const w = Math.max(1, Math.floor(canvas.clientWidth * dprScale));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dprScale));
    if (w === width && h === height) return;
    width = w;
    height = h;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const state = options.state;
  // Draw every frame while something moves; otherwise tick slowly so the
  // stars and grain stay alive without keeping the GPU busy.
  let activeUntil = performance.now() + 2600;
  let lastDraw = 0;
  let lastKey = '';
  let px = state.pointer[0];
  let py = state.pointer[1];
  let pOn = 0;
  let visible = true;
  let raf = 0;
  let wake = -1;
  const start = performance.now();
  let slowFrames = 0;
  let last = start;

  const render = (now: number): void => {
    raf = 0;
    if (!visible || document.hidden || !textureReady) return;
    if (!ready) {
      const done = parallel ? gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR) : true;
      if (done) {
        ready = finishLink();
        if (!ready) return;
      } else {
        raf = requestAnimationFrame(render);
        return;
      }
    }

    // Adaptive resolution: if frames run long, render fewer pixels.
    const dt = now - last;
    last = now;
    if (dt > 24 && dt < 200) slowFrames += 1;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 40 && dprScale > 0.7) {
      dprScale *= 0.8;
      slowFrames = 0;
      resize();
    }

    const key = `${state.centreX.toFixed(1)}|${state.centreY.toFixed(1)}|${state.radius.toFixed(1)}|${state.progress.toFixed(4)}|${state.pointer[0]}|${state.pointer[1]}|${state.pointerActive}`;
    if (key !== lastKey) {
      lastKey = key;
      activeUntil = now + 1200;
    }
    if (now > activeUntil && now - lastDraw < 110) {
      raf = requestAnimationFrame(render);
      return;
    }
    lastDraw = now;

    const t = (now - start) / 1000;
    px += (state.pointer[0] - px) * 0.12;
    py += (state.pointer[1] - py) * 0.12;
    pOn += (state.pointerActive - pOn) * 0.05;
    if (wake < 0) wake = now;
    const reveal = Math.min(1, (now - wake) / 2200);

    gl.uniform2f(uniforms.uRes, width, height);
    gl.uniform1f(uniforms.uDpr, dprScale);
    gl.uniform2f(uniforms.uCentre, state.centreX, state.centreY);
    gl.uniform1f(uniforms.uRadius, state.radius);
    gl.uniform1f(uniforms.uRot, state.rotation);
    gl.uniform2f(uniforms.uPointer, px, py);
    gl.uniform1f(uniforms.uPointerOn, pOn);
    gl.uniform2f(uniforms.uHead, state.head[0], state.head[1]);
    gl.uniform1f(uniforms.uProgress, state.progress);
    gl.uniform1f(uniforms.uTime, t);
    gl.uniform1f(uniforms.uReveal, reveal);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (reveal < 1 || wake === now) {
      // First frame drawn: let the page cross-fade from the SVG.
      if (wake === now) options.onReady();
    }
    raf = requestAnimationFrame(render);
  };

  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible && !raf) raf = requestAnimationFrame(render);
  });
  io.observe(canvas);

  const onVisibility = (): void => {
    if (!document.hidden && visible && !raf) raf = requestAnimationFrame(render);
  };
  document.addEventListener('visibilitychange', onVisibility);

  const onLost = (event: Event): void => {
    event.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
    canvas.closest('[data-hero]')?.removeAttribute('data-gl');
  };
  canvas.addEventListener('webglcontextlost', onLost);

  raf = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(raf);
    cancelTexture();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onLost);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
