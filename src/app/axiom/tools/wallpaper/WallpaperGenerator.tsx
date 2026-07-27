'use client';

import type { CSSProperties, JSX } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * Streak wallpaper generator. Renders abstract "Day N" art to a canvas and
 * downloads it as a PNG phone wallpaper. Deliberately topic-silent: the
 * artifact says only the day count, so it can be shared or set as a lock
 * screen without naming anything. Fully client-side; deterministic per
 * (day, style) so the same inputs always produce the same art.
 */

type StyleKey = 'aurora' | 'ember' | 'mono';

interface StyleDef {
  readonly name: string;
  /** Four-stop vertical background gradient (t, color). */
  readonly bg: ReadonlyArray<readonly [number, string]>;
  /** Aurora ribbon colors, drawn top to bottom. */
  readonly ribbons: ReadonlyArray<string>;
  readonly accent: string;
}

const STYLES: Readonly<Record<StyleKey, StyleDef>> = {
  aurora: {
    name: 'Aurora',
    bg: [
      [0, '#050610'],
      [0.45, '#0c0a22'],
      [0.8, '#180e34'],
      [1, '#0a0718'],
    ],
    ribbons: ['#5b4dff', '#2dd4bf', '#8b5cf6'],
    accent: '#a5b4fc',
  },
  ember: {
    name: 'Ember',
    bg: [
      [0, '#0a0605'],
      [0.5, '#1c0c0a'],
      [0.85, '#36140c'],
      [1, '#100806'],
    ],
    ribbons: ['#f97316', '#e11d48', '#ff783c'],
    accent: '#fdba74',
  },
  mono: {
    name: 'Mono',
    bg: [
      [0, '#05060a'],
      [0.5, '#0d1018'],
      [0.85, '#181c28'],
      [1, '#080a10'],
    ],
    ribbons: ['#94a3b8', '#e2e8f0', '#64748b'],
    accent: '#e2e8f0',
  },
};

const W = 1080;
const H = 2340;

/* --------------------------------------------------------------------------
   UI chrome. Separate from the canvas palette above: this is the accent the
   tools hub gives the wallpaper card, so the page and its card match.
   Borders use the accent at low alpha because the neutral token (#22264A on
   #06081A) is effectively invisible and made every panel read as flat.
   -------------------------------------------------------------------------- */
const UI_ACCENT = '#A48CFF';
const UI_ACCENT_ALT = '#00D2FF';

/** #RRGGBB + alpha → rgba(), so panels can tint from the accent token. */
function accentA(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Shared face for the control panels: real edge, accent-tinted glass. */
const PANEL_STYLE: CSSProperties = {
  borderColor: accentA(UI_ACCENT, 0.28),
  background: `linear-gradient(160deg, ${accentA(UI_ACCENT, 0.09)} 0%, rgba(18,23,55,0.75) 45%)`,
  boxShadow: `0 1px 0 0 ${accentA(UI_ACCENT, 0.14)} inset`,
};

/** Deterministic PRNG so the same day+style always renders the same art. */
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

/** One flowing aurora ribbon: a blurred sine-wave band, screen-blended. */
function drawRibbon(
  ctx: CanvasRenderingContext2D,
  rand: () => number,
  color: string,
  yCenter: number,
  amp: number,
  thickness: number,
): void {
  const phase = rand() * Math.PI * 2;
  const freq = 0.8 + rand() * 0.8;
  const tilt = -0.25 + rand() * 0.5;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.5;
  ctx.filter = 'blur(90px)';
  ctx.fillStyle = color;
  ctx.beginPath();
  const steps = 40;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = t * W;
    const y = yCenter + tilt * (t - 0.5) * H + Math.sin(phase + t * freq * Math.PI * 2) * amp;
    const th = thickness * (0.6 + 0.4 * Math.sin(t * Math.PI));
    if (i === 0) ctx.moveTo(x, y - th / 2);
    else ctx.lineTo(x, y - th / 2);
  }
  for (let i = steps; i >= 0; i -= 1) {
    const t = i / steps;
    const x = t * W;
    const y = yCenter + tilt * (t - 0.5) * H + Math.sin(phase + t * freq * Math.PI * 2) * amp;
    const th = thickness * (0.6 + 0.4 * Math.sin(t * Math.PI));
    ctx.lineTo(x, y + th / 2);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function draw(canvas: HTMLCanvasElement, day: number, styleKey: StyleKey, showLabel: boolean): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const style = STYLES[styleKey];
  const rand = mulberry32(day * 7919 + styleKey.length * 104729);

  // Background: four-stop vertical gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  for (const [t, c] of style.bg) bg.addColorStop(t, c);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Aurora ribbons across the upper two thirds — the main event.
  for (let i = 0; i < style.ribbons.length; i += 1) {
    drawRibbon(
      ctx,
      rand,
      style.ribbons[i],
      H * (0.22 + 0.16 * i + (rand() - 0.5) * 0.06),
      H * (0.04 + rand() * 0.05),
      H * (0.1 + rand() * 0.06),
    );
  }

  // Depth orbs: few, large, soft, additive. Count grows gently with streak.
  const orbCount = 4 + Math.min(6, Math.floor(day / 15));
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < orbCount; i += 1) {
    const x = rand() * W;
    const y = H * (0.05 + rand() * 0.85);
    const r = 80 + rand() * 180;
    const color = style.ribbons[i % style.ribbons.length];
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `${color}38`);
    g.addColorStop(1, `${color}00`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Fine star grain
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 240; i += 1) {
    ctx.globalAlpha = 0.1 + rand() * 0.4;
    const s = rand() < 0.9 ? 2 : 4;
    ctx.fillRect(rand() * W, rand() * H, s, s);
  }
  ctx.globalAlpha = 1;

  const cx = W / 2;

  if (showLabel) {
    // Big serif number, centered in the lower third.
    const numY = H * 0.745;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.font = `700 ${Math.round(W * 0.4)}px Georgia, 'Times New Roman', serif`;
    const num = String(day);
    ctx.fillText(num, cx, numY);
    const metrics = ctx.measureText(num);
    const numBottom = numY + metrics.actualBoundingBoxDescent;

    // "D A Y S" label with real spacing, clear of the digits.
    const labelY = numBottom + H * 0.03;
    ctx.fillStyle = `${style.accent}d2`;
    ctx.font = `500 ${Math.round(W * 0.04)}px 'JetBrains Mono', Consolas, monospace`;
    ctx.letterSpacing = `${Math.round(W * 0.022)}px`;
    ctx.fillText('DAYS', cx + Math.round(W * 0.011), labelY);
    ctx.letterSpacing = '0px';

    // Progress ticks toward the next 90-day landmark.
    const ticks = 30;
    const filled = Math.floor(((day % 90) / 90) * ticks);
    const span = W * 0.56;
    const gap = span / (ticks - 1);
    const x0 = cx - span / 2;
    const ty = labelY + H * 0.035;
    ctx.lineWidth = 4;
    for (let i = 0; i < ticks; i += 1) {
      ctx.strokeStyle = i < filled ? `${style.accent}eb` : `${style.accent}46`;
      ctx.beginPath();
      ctx.moveTo(x0 + i * gap, ty);
      ctx.lineTo(x0 + i * gap, ty + 24);
      ctx.stroke();
    }
  }

  // Vignette: gentle darkening toward the edges.
  const vin = ctx.createRadialGradient(cx, H * 0.5, W * 0.4, cx, H * 0.5, H * 0.72);
  vin.addColorStop(0, 'rgba(0,0,0,0)');
  vin.addColorStop(1, 'rgba(0,0,0,0.42)');
  ctx.fillStyle = vin;
  ctx.fillRect(0, 0, W, H);
}

export default function WallpaperGenerator(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [day, setDay] = useState<number>(7);
  const [styleKey, setStyleKey] = useState<StyleKey>('aurora');
  const [showLabel, setShowLabel] = useState<boolean>(true);

  const render = useCallback(() => {
    if (canvasRef.current) draw(canvasRef.current, day, styleKey, showLabel);
  }, [day, styleKey, showLabel]);

  useEffect(() => {
    render();
    // Re-render once web fonts land so the label uses the real mono face.
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) render();
    });
    return () => {
      cancelled = true;
    };
  }, [render]);

  function download(): void {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `day-${day}-wallpaper.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="relative flex justify-center">
        {/* The preview is the hero of this page, so it gets a bloom of its own
            instead of sitting on flat background like a form field. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[80%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
          style={{
            background: `radial-gradient(circle, ${accentA(UI_ACCENT, 0.3)} 0%, ${accentA(UI_ACCENT_ALT, 0.12)} 45%, transparent 72%)`,
          }}
        />
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="relative w-full max-w-[320px] rounded-3xl border"
          style={{
            borderColor: accentA(UI_ACCENT, 0.32),
            boxShadow: `0 30px 70px -20px rgba(0,0,0,0.85), 0 0 0 1px ${accentA(UI_ACCENT, 0.08)}`,
          }}
          aria-label={`Wallpaper preview: day ${day}`}
        />
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border p-6 backdrop-blur-sm" style={PANEL_STYLE}>
          <label htmlFor="day-input" className="block font-semibold">
            Your day count
          </label>
          <input
            id="day-input"
            type="number"
            min={0}
            max={9999}
            value={day}
            onChange={(e) => {
              const v = Number.parseInt(e.target.value, 10);
              setDay(Number.isNaN(v) ? 0 : Math.max(0, Math.min(9999, v)));
            }}
            className="mt-3 w-full rounded-xl border bg-lunamaze-bgDeep/80 px-4 py-3 text-lg font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-lunamaze-violetLight"
            style={{ borderColor: accentA(UI_ACCENT, 0.24) }}
          />
          <p className="mt-2 text-xs text-lunamaze-textDim">
            The ring shows progress toward your next 90-day landmark.
          </p>
        </div>

        <div className="rounded-3xl border p-6 backdrop-blur-sm" style={PANEL_STYLE}>
          <p className="font-semibold">Style</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(Object.keys(STYLES) as StyleKey[]).map((key) => {
              const selected = styleKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStyleKey(key)}
                  aria-pressed={selected}
                  className="rounded-xl border px-3 py-2 text-sm transition-all duration-200 hover:-translate-y-0.5"
                  style={
                    selected
                      ? {
                          borderColor: accentA(UI_ACCENT, 0.75),
                          background: accentA(UI_ACCENT, 0.16),
                          color: UI_ACCENT,
                        }
                      : {
                          borderColor: accentA(UI_ACCENT, 0.2),
                          background: accentA(UI_ACCENT, 0.04),
                        }
                  }
                >
                  {STYLES[key].name}
                </button>
              );
            })}
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm text-lunamaze-textSecondary">
            <input
              type="checkbox"
              checked={showLabel}
              onChange={(e) => setShowLabel(e.target.checked)}
              className="h-4 w-4"
              style={{ accentColor: UI_ACCENT }}
            />
            Show the day number on the art
          </label>
        </div>

        <button
          type="button"
          onClick={download}
          className="w-full rounded-2xl px-6 py-4 font-semibold text-lunamaze-bgDeep transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95"
          style={{
            background: `linear-gradient(115deg, ${UI_ACCENT} 0%, ${UI_ACCENT_ALT} 100%)`,
            boxShadow: `0 14px 40px -14px ${accentA(UI_ACCENT, 0.85)}`,
          }}
        >
          Download wallpaper (PNG)
        </button>

        <p className="text-xs text-lunamaze-textDim leading-relaxed">
          Generated entirely in your browser — your day count is never sent anywhere. The art
          says only the number: set it as a lock screen or share it to any chat without naming
          the topic.
        </p>

        <p className="text-sm text-lunamaze-textSecondary">
          Want the count to update itself?{' '}
          <Link
            href="/axiom/"
            className="underline decoration-lunamaze-violetLight/50 underline-offset-4 hover:text-lunamaze-violetLight"
          >
            Axiom
          </Link>{' '}
          tracks your streak privately and renders art that grows with it.
        </p>
      </div>
    </div>
  );
}
