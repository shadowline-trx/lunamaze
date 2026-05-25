'use client';

import type { JSX } from 'react';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface LunaConstellationProps {
  readonly nodeCount?: number;
  readonly className?: string;
}

interface ScatterPoint {
  readonly x: number;
  readonly y: number;
}

interface NodePoint {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly fill: string;
  readonly highlight: boolean;
}

interface LinkSegment {
  readonly id: string;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 800;
const PADDING_X = 80;
const PADDING_Y = 60;
const MAX_NEIGHBORS_PER_NODE = 2;

// Brand tokens (kept inline so the SVG renders correctly with no JS).
const COLOR_BG_ELEVATED = '#1A2150'; // radial gradient center
const COLOR_BORDER = '#22264A'; // maze grid stroke
const COLOR_VIOLET = '#7B5CFF'; // connecting lines
const COLOR_VIOLET_LIGHT = '#A48CFF'; // base node fill
const COLOR_SIGNAL = '#FFD27A'; // highlight node fill

const NODE_BASE_RADIUS = 2.5;
const NODE_HIGHLIGHT_RADIUS = 3.5;

/**
 * Deterministic seeded pseudo-random scatter using sin-based hash.
 * Returns identical results on the server and the client so SSR markup
 * matches the first client render — required to avoid hydration mismatches.
 */
function seededPositions(
  count: number,
  w: number,
  h: number
): ReadonlyArray<ScatterPoint> {
  const out: ScatterPoint[] = [];
  for (let i = 0; i < count; i += 1) {
    // Two independent sin-based hashes give x and y a fixed sequence.
    const seedX = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453);
    const seedY = Math.abs(Math.sin((i + 1) * 78.233) * 43758.5453);
    const x = (seedX - Math.floor(seedX)) * w;
    const y = (seedY - Math.floor(seedY)) * h;
    out.push({ x, y });
  }
  return out;
}

function buildNodes(count: number): ReadonlyArray<NodePoint> {
  const spanX = VIEWBOX_WIDTH - PADDING_X * 2;
  const spanY = VIEWBOX_HEIGHT - PADDING_Y * 2;
  const positions = seededPositions(count, spanX, spanY);
  const result: NodePoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const p = positions[i];
    const highlight = i % 4 === 0;
    result.push({
      id: i,
      x: Math.round((PADDING_X + p.x) * 100) / 100,
      y: Math.round((PADDING_Y + p.y) * 100) / 100,
      r: highlight ? NODE_HIGHLIGHT_RADIUS : NODE_BASE_RADIUS,
      fill: highlight ? COLOR_SIGNAL : COLOR_VIOLET_LIGHT,
      highlight,
    });
  }
  return result;
}

/**
 * Build nearest-neighbor links: each node connects to its 1–2 closest peers.
 * Duplicate undirected pairs are de-duplicated.
 */
function buildLinks(nodes: ReadonlyArray<NodePoint>): ReadonlyArray<LinkSegment> {
  const links: LinkSegment[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i];
    const distances: Array<{ readonly j: number; readonly d: number }> = [];
    for (let j = 0; j < nodes.length; j += 1) {
      if (i === j) continue;
      const b = nodes[j];
      distances.push({ j, d: Math.hypot(a.x - b.x, a.y - b.y) });
    }
    distances.sort((p, q) => p.d - q.d);
    const picked = distances.slice(0, MAX_NEIGHBORS_PER_NODE);
    for (const { j } of picked) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const b = nodes[j];
      links.push({ id: key, x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
  }
  return links;
}

interface GridLine {
  readonly id: string;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

/**
 * Build six horizontal + six vertical maze grid lines with slight
 * deterministic irregularities so the grid feels hand-drawn.
 */
function buildGridLines(): ReadonlyArray<GridLine> {
  const lines: GridLine[] = [];
  const horizontalCount = 6;
  const verticalCount = 6;

  for (let i = 0; i < horizontalCount; i += 1) {
    const t = (i + 1) / (horizontalCount + 1);
    const baseY = t * VIEWBOX_HEIGHT;
    // Deterministic offsets for slight irregularity (sin-based).
    const jitterStart = Math.sin((i + 1) * 9.13) * 18;
    const jitterEnd = Math.sin((i + 1) * 4.71) * 18;
    lines.push({
      id: `h-${i}`,
      x1: -20,
      y1: Math.round((baseY + jitterStart) * 100) / 100,
      x2: VIEWBOX_WIDTH + 20,
      y2: Math.round((baseY + jitterEnd) * 100) / 100,
    });
  }

  for (let i = 0; i < verticalCount; i += 1) {
    const t = (i + 1) / (verticalCount + 1);
    const baseX = t * VIEWBOX_WIDTH;
    const jitterTop = Math.sin((i + 1) * 6.28) * 22;
    const jitterBottom = Math.sin((i + 1) * 3.17) * 22;
    lines.push({
      id: `v-${i}`,
      x1: Math.round((baseX + jitterTop) * 100) / 100,
      y1: -20,
      x2: Math.round((baseX + jitterBottom) * 100) / 100,
      y2: VIEWBOX_HEIGHT + 20,
    });
  }

  return lines;
}

function mergeClassName(...parts: ReadonlyArray<string | undefined>): string {
  return parts.filter((p): p is string => Boolean(p)).join(' ');
}

export default function LunaConstellation(
  props: LunaConstellationProps
): JSX.Element {
  const { nodeCount = 24, className } = props;
  const ref = useRef<SVGSVGElement | null>(null);

  // Deterministic geometry — identical on server and client.
  const gridLines = buildGridLines();
  const nodes = buildNodes(nodeCount);
  const links = buildLinks(nodes);

  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const root = ref.current;
      if (!root) return;

      const gridEls = root.querySelectorAll<SVGLineElement>('[data-luna="grid-line"]');
      const circleEls = root.querySelectorAll<SVGCircleElement>('[data-luna="node"]');
      const linkEls = root.querySelectorAll<SVGLineElement>('[data-luna="link"]');

      // Prime grid lines for fade-in.
      gsap.set(gridEls, { opacity: 0 });

      // Prime nodes for stagger-pop from center.
      gsap.set(circleEls, {
        scale: 0,
        transformOrigin: '50% 50%',
      });

      // Prime connecting lines for stroke-dashoffset trace reveal.
      linkEls.forEach((line) => {
        const x1 = line.x1.baseVal.value;
        const y1 = line.y1.baseVal.value;
        const x2 = line.x2.baseVal.value;
        const y2 = line.y2.baseVal.value;
        const length = Math.hypot(x2 - x1, y2 - y1);
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const tl = gsap.timeline();

      // 1. Fade in the grid lines.
      tl.to(gridEls, {
        opacity: 0.5,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.04,
      });

      // 2. Stagger-pop nodes from scale 0 → 1.
      tl.to(
        circleEls,
        {
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: 0.04,
        },
        '-=0.5'
      );

      // 3. Trace connecting lines via stroke-dashoffset.
      tl.to(
        linkEls,
        {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: 'power1.out',
          stagger: 0.015,
        },
        '-=0.4'
      );
    },
    { scope: ref }
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
      className={mergeClassName('w-full h-full', className)}
    >
      <defs>
        <radialGradient id="lunamazeBackdrop" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor={COLOR_BG_ELEVATED} stopOpacity="0.85" />
          <stop offset="60%" stopColor={COLOR_BG_ELEVATED} stopOpacity="0.35" />
          <stop offset="100%" stopColor={COLOR_BG_ELEVATED} stopOpacity="0" />
        </radialGradient>
        <filter
          id="lunamazeGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Layer 1: radial gradient backdrop. */}
      <rect
        x="0"
        y="0"
        width={VIEWBOX_WIDTH}
        height={VIEWBOX_HEIGHT}
        fill="url(#lunamazeBackdrop)"
      />

      {/* Layer 2: maze-like grid (6 horizontal + 6 vertical lines). */}
      <g>
        {gridLines.map((line) => (
          <line
            key={`grid-${line.id}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={COLOR_BORDER}
            strokeOpacity="0.5"
            strokeWidth="1"
            data-luna="grid-line"
          />
        ))}
      </g>

      {/* Layer 3: nearest-neighbor connecting lines (drawn under nodes). */}
      <g>
        {links.map((link) => (
          <line
            key={`link-${link.id}`}
            x1={link.x1}
            y1={link.y1}
            x2={link.x2}
            y2={link.y2}
            stroke={COLOR_VIOLET}
            strokeOpacity="0.25"
            strokeWidth="0.75"
            strokeLinecap="round"
            data-luna="link"
          />
        ))}
      </g>

      {/* Layer 4: constellation nodes (highlights glow via filter). */}
      <g>
        {nodes.map((node) => (
          <circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={node.fill}
            filter={node.highlight ? 'url(#lunamazeGlow)' : undefined}
            data-luna="node"
          />
        ))}
      </g>
    </svg>
  );
}
