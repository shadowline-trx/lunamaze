'use client';

import type { JSX } from 'react';
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
  readonly bgTop: string;
  readonly bgBottom: string;
  readonly orbs: ReadonlyArray<string>;
  readonly accent: string;
}

const STYLES: Readonly<Record<StyleKey, StyleDef>> = {
  aurora: {
    name: 'Aurora',
    bgTop: '#070812',
    bgBottom: '#141033',
    orbs: ['#5b4dff', '#2dd4bf', '#8b5cf6', '#22d3ee'],
    accent: '#a5b4fc',
  },
  ember: {
    name: 'Ember',
    bgTop: '#0c0705',
    bgBottom: '#2a1208',
    orbs: ['#f97316', '#f43f5e', '#facc15', '#fb7185'],
    accent: '#fdba74',
  },
  mono: {
    name: 'Mono',
    bgTop: '#05060a',
    bgBottom: '#11141d',
    orbs: ['#94a3b8', '#e2e8f0', '#475569', '#cbd5e1'],
    accent: '#e2e8f0',
  },
};

const W = 1080;
const H = 2340;

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

function draw(canvas: HTMLCanvasElement, day: number, styleKey: StyleKey, showLabel: boolean): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const style = STYLES[styleKey];
  const rand = mulberry32(day * 7919 + styleKey.length * 104729);

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, style.bgTop);
  bg.addColorStop(1, style.bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Soft orbs — count grows slowly with the streak, capped for taste.
  const orbCount = Math.min(24, 6 + Math.floor(day / 7));
  for (let i = 0; i < orbCount; i += 1) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 60 + rand() * 260;
    const color = style.orbs[Math.floor(rand() * style.orbs.length)];
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `${color}55`);
    g.addColorStop(1, `${color}00`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fine star grain
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 140; i += 1) {
    ctx.globalAlpha = 0.08 + rand() * 0.35;
    const s = rand() < 0.92 ? 1.5 : 3;
    ctx.fillRect(rand() * W, rand() * H, s, s);
  }
  ctx.globalAlpha = 1;

  // Progress ring toward the next 90-day landmark
  const cx = W / 2;
  const cy = H * 0.42;
  const radius = W * 0.3;
  const progress = (day % 90) / 90;
  ctx.lineWidth = 10;
  ctx.strokeStyle = `${style.accent}33`;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = style.accent;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
  ctx.stroke();

  if (showLabel) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 200px system-ui, -apple-system, sans-serif';
    ctx.fillText(String(day), cx, cy + 70);
    ctx.fillStyle = `${style.accent}cc`;
    ctx.font = '500 54px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '18px';
    ctx.fillText('DAYS', cx, cy + 170);
    ctx.letterSpacing = '0px';
  }
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
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full max-w-[320px] rounded-3xl border border-lunamaze-border shadow-2xl"
          aria-label={`Wallpaper preview: day ${day}`}
        />
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-6 backdrop-blur-sm">
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
            className="mt-3 w-full rounded-xl border border-lunamaze-border bg-lunamaze-bgDeep px-4 py-3 text-lg font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-lunamaze-signal"
          />
          <p className="mt-2 text-xs text-lunamaze-textDim">
            The ring shows progress toward your next 90-day landmark.
          </p>
        </div>

        <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-6 backdrop-blur-sm">
          <p className="font-semibold">Style</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(Object.keys(STYLES) as StyleKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setStyleKey(key)}
                className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                  styleKey === key
                    ? 'border-lunamaze-signal text-lunamaze-signal'
                    : 'border-lunamaze-border hover:border-lunamaze-signal'
                }`}
              >
                {STYLES[key].name}
              </button>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm text-lunamaze-textSecondary">
            <input
              type="checkbox"
              checked={showLabel}
              onChange={(e) => setShowLabel(e.target.checked)}
              className="h-4 w-4 accent-current"
            />
            Show the day number on the art
          </label>
        </div>

        <button
          type="button"
          onClick={download}
          className="w-full rounded-xl bg-lunamaze-signal px-6 py-4 font-semibold text-lunamaze-bgDeep transition-opacity hover:opacity-90"
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
            className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
          >
            Axiom
          </Link>{' '}
          tracks your streak privately and renders art that grows with it.
        </p>
      </div>
    </div>
  );
}
