'use client';

import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from './webgl';

/**
 * DotGrid — an interactive grid of dots that react to the pointer.
 *
 * A dependency-light reimplementation of the React Bits "Dot Grid" background
 * using Canvas 2D + GSAP (already a project dependency — no new packages).
 * Dots within a radius of the cursor are pushed outward and tinted toward the
 * active colour, then GSAP eases them back to rest. A click sends a ripple
 * shockwave through the field.
 *
 * Tuned to the Luna Maze palette and used behind the studio landing's
 * mid-page sections. Cheapest of the four backgrounds, perf-wise.
 *
 * Behaviour:
 *   - Full-bleed, non-interactive layer (`pointer-events: none`,
 *     `aria-hidden`). Pointer/click are read from `window` so overlaying
 *     content stays fully clickable.
 *   - Honours `prefers-reduced-motion`: draws a single static dot field and
 *     skips all interaction/animation.
 *   - Pauses its rAF loop when scrolled off-screen or the tab is hidden.
 *
 * Client component: Canvas 2D + browser APIs that must mount in the browser.
 */

export interface DotGridProps {
  /** Spacing between dots in CSS px. Defaults to 28. */
  readonly gap?: number;
  /** Base dot radius in CSS px. Defaults to 1.6. */
  readonly dotRadius?: number;
  /** Resting dot colour `#rrggbb`. Defaults to Luna Maze border violet. */
  readonly baseColor?: string;
  /** Active (near-cursor) colour `#rrggbb`. Defaults to Luna Maze violet. */
  readonly activeColor?: string;
  /** Pointer influence radius in CSS px. Defaults to 160. */
  readonly influence?: number;
  /** Optional extra class names for the host wrapper. */
  readonly className?: string;
}

interface Dot {
  readonly baseX: number;
  readonly baseY: number;
  x: number;
  y: number;
  /** 0 at rest → 1 fully activated; eased by GSAP. */
  glow: number;
}

interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

function parseHex(hex: string): Rgb {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (match === null) return { r: 128, g: 128, b: 128 };
  const int = parseInt(match[1], 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

const DEFAULT_BASE = '#22264A'; // lunamaze.border
const DEFAULT_ACTIVE = '#7B5CFF'; // lunamaze.violet

export default function DotGrid({
  gap = 28,
  dotRadius = 1.6,
  baseColor = DEFAULT_BASE,
  activeColor = DEFAULT_ACTIVE,
  influence = 160,
  className,
}: DotGridProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return;

    const reduced = prefersReducedMotion();
    const base = parseHex(baseColor);
    const active = parseHex(activeColor);

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999 };
    let rafId = 0;
    let running = false;
    let visible = true;
    let disposed = false;
    // Throttle the interactive field to ~30fps — smooth enough for cursor
    // tracking while halving redraw cost vs. an uncapped loop.
    const minFrameMs = 1000 / 30;
    let lastFrameTime = 0;

    const build = (): void => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const x = c * gap;
          const y = r * gap;
          dots.push({ baseX: x, baseY: y, x, y, glow: 0 });
        }
      }
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, width, height);
      const inf2 = influence * influence;
      for (const dot of dots) {
        if (!reduced) {
          const dx = dot.baseX - pointer.x;
          const dy = dot.baseY - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const target = dist2 < inf2 ? 1 - Math.sqrt(dist2 / inf2) : 0;
          // Repel from cursor proportionally to proximity.
          if (target > 0) {
            const dist = Math.max(0.0001, Math.sqrt(dist2));
            const push = target * 12;
            dot.x = dot.baseX + (dx / dist) * push;
            dot.y = dot.baseY + (dy / dist) * push;
            if (target > dot.glow) dot.glow = target;
          } else {
            // Ease position + glow back toward rest.
            dot.x += (dot.baseX - dot.x) * 0.12;
            dot.y += (dot.baseY - dot.y) * 0.12;
            dot.glow *= 0.92;
          }
        }

        const g = dot.glow;
        const r = Math.round(base.r + (active.r - base.r) * g);
        const gg = Math.round(base.g + (active.g - base.g) * g);
        const b = Math.round(base.b + (active.b - base.b) * g);
        const radius = dotRadius + g * 1.6;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r}, ${gg}, ${b})`;
        ctx.globalAlpha = 0.35 + g * 0.65;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (): void => {
      if (disposed) return;
      const now = performance.now();
      if (now - lastFrameTime >= minFrameMs) {
        lastFrameTime = now;
        draw();
      }
      rafId = window.requestAnimationFrame(loop);
    };

    const start = (): void => {
      if (running || disposed || reduced) return;
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

    const onPointerMove = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const onPointerLeave = (): void => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onClick = (event: MouseEvent): void => {
      if (reduced) return;
      const rect = canvas.getBoundingClientRect();
      const cx = event.clientX - rect.left;
      const cy = event.clientY - rect.top;
      // Ripple: flash glow on nearby dots, GSAP eases them down.
      for (const dot of dots) {
        const dist = Math.hypot(dot.baseX - cx, dot.baseY - cy);
        if (dist < influence * 1.6) {
          gsap.killTweensOf(dot);
          dot.glow = 1;
          gsap.to(dot, {
            glow: 0,
            duration: 0.9,
            delay: dist * 0.0012,
            ease: 'power2.out',
          });
        }
      }
    };

    const onResize = (): void => {
      build();
      if (reduced || !running) draw();
    };

    const onVisibility = (): void => {
      if (document.hidden) stop();
      else if (visible) start();
    };

    build();
    draw();
    if (!reduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerdown', onClick);
      window.addEventListener('blur', onPointerLeave);
      document.addEventListener('visibilitychange', onVisibility);
    }
    window.addEventListener('resize', onResize);

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      disposed = true;
      stop();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onClick);
      window.removeEventListener('blur', onPointerLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
      for (const dot of dots) gsap.killTweensOf(dot);
    };
  }, [gap, dotRadius, baseColor, activeColor, influence]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-0 overflow-hidden ${className ?? ''}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
