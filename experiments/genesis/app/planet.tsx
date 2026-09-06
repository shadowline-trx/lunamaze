'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, Maximize, RotateCw, Scan, Plus, Minus } from 'lucide-react';
import { clampZoom, dragRotation } from '@/lib/orbit';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { bakeTerrain } from '@/lib/terrain';
import { vertex, fragment } from '@/lib/planet-shader';
import { scenarios, type Tool, type View, type World } from '@/lib/simulation';
type Point = [number, number, number];
type Props = {
  world: World;
  view: View;
  tool: Tool;
  running: boolean;
  cloudCover?: number;
  onSculpt: (point: Point) => boolean;
};
const toolNumber = (tool: Tool) =>
  ['orbit', 'raise', 'lower', 'life', 'impact'].indexOf(tool);

export default function Planet({
  world,
  view,
  tool,
  running,
  cloudCover = 0.8,
  onSculpt,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null),
    values = useRef({ world, view, running, tool, cloudCover });
  values.current = { world, view, running, tool, cloudCover };
  const camera = useRef({
    x: 0.35,
    y: -0.18,
    zoom: 1,
    targetX: 0.35,
    targetY: -0.18,
    targetZoom: 1,
  });
  const pointer = useRef<{ x: number; y: number } | null>(null),
    hover = useRef<Point | null>(null);
  const touches = useRef(new Map<number, { x: number; y: number }>());
  const pinched = useRef(false);
  const effect = useRef({ point: [0, 0, 1] as Point, tool: 0, at: -10000 }),
    capture = useRef(false),
    spinning = useRef(true);
  const [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [rotate, setRotate] = useState(true),
    [restart, setRestart] = useState(0);
  const [postcard, setPostcard] = useState<string | null>(null);
  useEffect(
    () => () => {
      if (postcard) URL.revokeObjectURL(postcard);
    },
    [postcard],
  );
  useEffect(() => {
    const el = canvas.current!,
      gl = el.getContext('webgl', {
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
      });
    if (!gl) {
      setError(
        'Your browser could not start the 3D view. Enable hardware acceleration and reload.',
      );
      setLoading(false);
      return;
    }
    let disposed = false,
      generation = 0,
      requestedSeed = -1,
      loadedSeed = -1;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      shaders.push(s);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(s) || 'Shader failed');
      return s;
    };
    const program = gl.createProgram()!;
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error('Program link failed');
    } catch (err) {
      console.error('Genesis renderer:', err);
      setError('The 3D view could not start on this device.');
      setLoading(false);
      shaders.forEach((s) => gl.deleteShader(s));
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const attribute = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([128, 0, 128, 0]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const keys = [
      'atlas',
      'resolution',
      'time',
      'water',
      'temperature',
      'biomass',
      'atmosphere',
      'mode',
      'zoom',
      'rotation',
      'stamps[0]',
      'stampCount',
      'brush',
      'effect',
      'effectAge',
      'cloudCover',
    ];
    const u = Object.fromEntries(
      keys.map((k) => [k, gl.getUniformLocation(program, k)]),
    );
    gl.uniform1i(u.atlas, 0);
    const cache = new Map<
      number,
      NonNullable<Awaited<ReturnType<typeof bakeTerrain>>>
    >();
    const upload = (
      data: NonNullable<Awaited<ReturnType<typeof bakeTerrain>>>,
      seed: number,
    ) => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        data.width,
        data.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data.pixels,
      );
      loadedSeed = seed;
      setLoading(false);
    };
    async function load(seed: number) {
      requestedSeed = seed;
      const job = ++generation;
      setLoading(true);
      if (cache.has(seed)) {
        upload(cache.get(seed)!, seed);
        return;
      }
      const cancelled = () => disposed || generation !== job;
      const low = await bakeTerrain(seed, 256, cancelled);
      if (!low || cancelled()) return;
      upload(low, seed);
      const high = await bakeTerrain(seed, 2048, cancelled);
      if (!high || cancelled()) return;
      if (cache.size >= 4) cache.delete(cache.keys().next().value!);
      cache.set(seed, high);
      upload(high, seed);
    }
    let frame = 0,
      last = 0,
      clock = 0,
      quality = Math.min(devicePixelRatio || 1, 1.75),
      sampleTime = 0,
      samples = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smooth = {
        water: world.water,
        temperature: world.temperature,
        biomass: world.biomass,
        atmosphere: world.atmosphere,
        cloudCover,
      },
      stampData = new Float32Array(64);
    let bounds = el.getBoundingClientRect();
    const resize = new ResizeObserver(() => {
      bounds = el.getBoundingClientRect();
    });
    resize.observe(el);
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (document.hidden || gl.isContextLost()) {
        last = now;
        return;
      }
      const elapsed = last ? now - last : 16.7,
        dt = Math.min(elapsed / 1000, 0.05);
      last = now;
      const {
        world: w,
        view: v,
        running: r,
        tool: t,
        cloudCover: c,
      } = values.current;
      if (requestedSeed !== w.seed)
        void load(w.seed).catch((err) => {
          console.error(err);
          if (!disposed) {
            setLoading(false);
            setError('The landscape could not load. Try reloading this view.');
          }
        });
      if (loadedSeed < 0) return;
      sampleTime += elapsed;
      samples++;
      if (samples >= 120) {
        el.dataset.fps = String(Math.round(1000 / (sampleTime / samples)));
        if (sampleTime / samples > 24 && quality > 0.9)
          quality = Math.max(0.9, quality - 0.2);
        samples = 0;
        sampleTime = 0;
      }
      const cam = camera.current,
        ease = reduced || pointer.current ? 1 : 1 - Math.exp(-dt * 14);
      if (
        r &&
        spinning.current &&
        t === 'orbit' &&
        !pointer.current &&
        !reduced
      )
        cam.targetX += dt * 0.035;
      cam.x += (cam.targetX - cam.x) * ease;
      cam.y += (cam.targetY - cam.y) * ease;
      cam.zoom += (cam.targetZoom - cam.zoom) * ease;
      if (r && !reduced) clock += dt;
      for (const key of [
        'water',
        'temperature',
        'biomass',
        'atmosphere',
      ] as const)
        smooth[key] +=
          (w[key] - smooth[key]) * (reduced ? 1 : 1 - Math.exp(-dt * 2.5));
      smooth.cloudCover += (c - smooth.cloudCover) * ease;
      const width = Math.max(1, Math.round(bounds.width * quality)),
        height = Math.max(1, Math.round(bounds.height * quality));
      if (el.width !== width || el.height !== height) {
        el.width = width;
        el.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(u.resolution, width, height);
      gl.uniform1f(u.time, clock);
      for (const key of [
        'water',
        'temperature',
        'biomass',
        'atmosphere',
        'cloudCover',
      ] as const)
        gl.uniform1f(u[key], smooth[key]);
      gl.uniform1f(u.mode, v === 'natural' ? 0 : v === 'thermal' ? 1 : 2);
      gl.uniform1f(u.zoom, cam.zoom);
      gl.uniform2f(u.rotation, cam.x, cam.y);
      stampData.fill(0);
      w.stamps.forEach((s, i) => stampData.set(s, i * 4));
      gl.uniform4fv(u['stamps[0]'], stampData);
      gl.uniform1i(u.stampCount, w.stamps.length);
      const h = hover.current;
      gl.uniform4f(
        u.brush,
        h?.[0] || 0,
        h?.[1] || 0,
        h?.[2] || 0,
        h ? toolNumber(t) : 0,
      );
      const e = effect.current;
      gl.uniform4f(u.effect, ...e.point, e.tool);
      gl.uniform1f(u.effectAge, reduced ? 10 : (now - e.at) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (capture.current) {
        capture.current = false;
        downloadPostcard(el, w, setPostcard);
      }
    };
    frame = requestAnimationFrame(render);
    const lost = (event: Event) => {
        event.preventDefault();
        setError(
          'The graphics connection was interrupted. Restoring the planet…',
        );
      },
      restored = () => {
        setError('');
        setRestart((n) => n + 1);
      };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.current.targetZoom = clampZoom(
        camera.current.targetZoom - event.deltaY * 0.0008,
      );
    };
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('webglcontextlost', lost);
    el.addEventListener('webglcontextrestored', restored);
    return () => {
      disposed = true;
      generation++;
      cancelAnimationFrame(frame);
      resize.disconnect();
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('webglcontextlost', lost);
      el.removeEventListener('webglcontextrestored', restored);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((s) => gl.deleteShader(s));
    };
  }, [restart]);
  function hit(clientX: number, clientY: number): Point | null {
    const box = canvas.current!.getBoundingClientRect(),
      s = Math.min(box.width, box.height),
      cam = camera.current,
      x = (((clientX - box.left - box.width / 2) / s) * 2) / cam.zoom / 0.79,
      y = ((-(clientY - box.top - box.height / 2) / s) * 2) / cam.zoom / 0.79,
      rr = x * x + y * y;
    if (rr > 1) return null;
    const z = Math.sqrt(1 - rr),
      a = cam.x,
      b = cam.y,
      y2 = Math.cos(b) * y - Math.sin(b) * z,
      z2 = Math.sin(b) * y + Math.cos(b) * z;
    return [
      Math.cos(a) * x + Math.sin(a) * z2,
      y2,
      -Math.sin(a) * x + Math.cos(a) * z2,
    ];
  }
  function apply(point: Point | null) {
    if (!point || loading) return;
    if (onSculpt(point))
      effect.current = { point, tool: toolNumber(tool), at: performance.now() };
  }
  return (
    <div className={`planet-render tool-${tool}`}>
      <canvas
        ref={canvas}
        aria-label="Interactive 3D planet. Drag to rotate. Arrow keys rotate, plus and minus zoom, and Enter applies the selected tool at the center."
        tabIndex={0}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          pointer.current = { x: e.clientX, y: e.clientY };
          if (touches.current.size > 1) pinched.current = true;
          spinning.current = false;
          setRotate(false);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (touches.current.has(e.pointerId) && touches.current.size === 2) {
            const previous = [...touches.current.values()],
              old = Math.hypot(
                previous[0].x - previous[1].x,
                previous[0].y - previous[1].y,
              );
            touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            const next = [...touches.current.values()],
              distance = Math.hypot(
                next[0].x - next[1].x,
                next[0].y - next[1].y,
              );
            if (old > 1)
              camera.current.targetZoom = clampZoom(
                (camera.current.targetZoom * distance) / old,
              );
            pointer.current = null;
            return;
          }
          if (touches.current.has(e.pointerId))
            touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          hover.current = hit(e.clientX, e.clientY);
          const p = pointer.current;
          if (!p) return;
          if (tool === 'orbit') {
            const box = e.currentTarget.getBoundingClientRect();
            const next = dragRotation(
              camera.current.x,
              camera.current.y,
              e.clientX - p.x,
              e.clientY - p.y,
              Math.min(box.width, box.height) * 0.79 * camera.current.zoom,
            );
            camera.current.x = camera.current.targetX = next.x;
            camera.current.y = camera.current.targetY = next.y;
          }
          p.x = e.clientX;
          p.y = e.clientY;
        }}
        onPointerUp={(e) => {
          touches.current.delete(e.pointerId);
          if (pointer.current && !pinched.current && tool !== 'orbit')
            apply(hit(e.clientX, e.clientY));
          pointer.current =
            touches.current.size === 1
              ? { ...[...touches.current.values()][0] }
              : null;
          if (!touches.current.size) pinched.current = false;
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={(e) => {
          touches.current.delete(e.pointerId);
          pointer.current = null;
        }}
        onLostPointerCapture={(e) => {
          touches.current.delete(e.pointerId);
          if (!touches.current.size) pointer.current = null;
        }}
        onBlur={() => {
          touches.current.clear();
          pinched.current = false;
          pointer.current = null;
        }}
        onPointerLeave={() => {
          hover.current = null;
        }}
        onKeyDown={(e) => {
          const c = camera.current;
          if (
            [
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              '+',
              '-',
              'Enter',
            ].includes(e.key)
          ) {
            e.preventDefault();
            spinning.current = false;
            setRotate(false);
            if (e.key === 'ArrowLeft') c.targetX += 0.15;
            if (e.key === 'ArrowRight') c.targetX -= 0.15;
            if (e.key === 'ArrowUp')
              c.targetY = Math.min(1.35, c.targetY + 0.15);
            if (e.key === 'ArrowDown')
              c.targetY = Math.max(-1.35, c.targetY - 0.15);
            if (e.key === '+') c.targetZoom = clampZoom(c.targetZoom + 0.08);
            if (e.key === '-') c.targetZoom = clampZoom(c.targetZoom - 0.08);
            if (e.key === 'Enter' && tool !== 'orbit') {
              const b = canvas.current!.getBoundingClientRect();
              apply(hit(b.x + b.width / 2, b.y + b.height / 2));
            }
          }
        }}
      />
      <div className="planet-view-actions">
        <button
          title="Zoom out"
          aria-label="Zoom out"
          onClick={() => {
            camera.current.targetZoom = clampZoom(
              camera.current.targetZoom - 0.08,
            );
          }}
        >
          <Minus size={16} />
        </button>
        <button
          title="Fit planet"
          aria-label="Fit planet"
          onClick={() => {
            camera.current.targetZoom = 1;
            camera.current.targetY = -0.18;
          }}
        >
          <Scan size={16} />
        </button>
        <button
          title="Zoom in"
          aria-label="Zoom in"
          onClick={() => {
            camera.current.targetZoom = clampZoom(
              camera.current.targetZoom + 0.08,
            );
          }}
        >
          <Plus size={16} />
        </button>
        <button
          title={rotate ? 'Stop planet rotation' : 'Rotate planet'}
          aria-label={rotate ? 'Stop planet rotation' : 'Rotate planet'}
          aria-pressed={rotate}
          onClick={() => {
            spinning.current = !rotate;
            setRotate(!rotate);
          }}
        >
          <RotateCw size={16} />
        </button>
        <button
          title="Download a planet postcard"
          aria-label="Download a planet postcard"
          disabled={loading || !!error}
          onClick={() => {
            capture.current = true;
          }}
        >
          <Download size={16} />
        </button>
        <button
          title="Immersive view"
          aria-label="Immersive view"
          onClick={() => {
            const stage = canvas.current!.closest('.planet-stage');
            if (document.fullscreenElement) void document.exitFullscreen();
            else void stage?.requestFullscreen().catch(() => {});
          }}
        >
          <Maximize size={16} />
        </button>
      </div>
      {loading && (
        <div className="planet-loading" role="status">
          <span /> Forming your world
        </div>
      )}
      <Dialog
        open={!!postcard}
        onOpenChange={(open) => {
          if (!open) setPostcard(null);
        }}
      >
        <DialogContent className="genesis-dialog postcard-dialog">
          <DialogTitle>A world to keep.</DialogTitle>
          <DialogDescription>
            Your planet, captured in a 1600 × 1200 postcard.
          </DialogDescription>
          {postcard && (
            <>
              <img src={postcard} alt="Your Genesis planet postcard" />
              <a
                className="primary-button"
                href={postcard}
                download={`genesis-${world.scenario}.png`}
              >
                <Download size={16} /> Download PNG
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
      {error && (
        <div className="planet-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
function downloadPostcard(
  globe: HTMLCanvasElement,
  w: World,
  ready: (url: string) => void,
) {
  const card = document.createElement('canvas');
  card.width = 1600;
  card.height = 1200;
  const ctx = card.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#080e13';
  ctx.fillRect(0, 0, 1600, 1200);
  ctx.drawImage(globe, 300, 0, 1000, 1000);
  ctx.fillStyle = '#c5e4d1';
  ctx.font = '20px sans-serif';
  ctx.fillText('GENESIS / LUNAMAZE', 70, 75);
  ctx.font = '60px Georgia';
  ctx.fillText(scenarios[w.scenario].name, 70, 1050);
  ctx.fillStyle = '#9cafa9';
  ctx.font = '22px sans-serif';
  ctx.fillText(
    `Year ${Math.floor(w.year)}   ·   ${w.temperature.toFixed(1)}°C   ·   ${Math.round(w.biomass)}% biosphere`,
    70,
    1100,
  );
  ctx.textAlign = 'right';
  ctx.fillText('lunamaze.com/genesis', 1530, 1100);
  card.toBlob((blob) => {
    if (!blob) return;
    ready(URL.createObjectURL(blob));
  }, 'image/png');
}
