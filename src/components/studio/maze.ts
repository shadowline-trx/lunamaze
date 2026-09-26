/**
 * Deterministic circular labyrinth, the geometry behind the Luna Maze emblem.
 *
 * The same seed always produces the same maze, so the server-rendered SVG, the
 * WebGL layer that lights it, and every rebuild of the static export agree to
 * the pixel. Geometry lives in a 1000-unit square centred on the origin; the
 * outer wall sits on radius 1 (see `OUTER`) and the keyhole is the one cell of
 * ring 0.
 *
 * Grid: a polar grid in the style of Jamis Buck's "Mazes for Programmers".
 * Each ring keeps its cells roughly square by doubling the sector count once
 * the arc per cell grows past the ring height. Carving: an iterative
 * recursive-backtracker, which gives the long, winding corridors that read as
 * a labyrinth rather than a lattice.
 */

export interface MazeGeometry {
  /** SVG path data for every wall (arcs and radial segments). */
  readonly walls: string;
  /**
   * The same walls split by ring, innermost first; the last entry is the outer
   * wall. Lets the hero draw and light the labyrinth one ring at a time.
   */
  readonly ringWalls: ReadonlyArray<string>;
  /** SVG path data for the route from the entrance to the keyhole. */
  readonly thread: string;
  /** Radius, in viewBox units, of the outermost wall. */
  readonly outer: number;
  /** Ring height in viewBox units. */
  readonly ring: number;
  /** Number of rings including the keyhole. */
  readonly rings: number;
}

const OUTER = 440;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number): string => (Math.round(n * 10) / 10).toString();

function polar(radius: number, angle: number): [number, number] {
  // Angle 0 points up, clockwise positive, so the entrance can sit at the top.
  return [radius * Math.sin(angle), -radius * Math.cos(angle)];
}

interface Cell {
  readonly ring: number;
  readonly index: number;
  links: Set<number>;
}

export function buildMaze(seed = 20260926, rings = 9): MazeGeometry {
  const rand = mulberry32(seed);
  const ringH = OUTER / rings;

  // counts[r] = sectors in ring r; ring 0 is the single keyhole cell.
  const counts: number[] = [1];
  for (let r = 1; r < rings; r += 1) {
    const radius = r * ringH;
    const prev = counts[r - 1];
    const width = (2 * Math.PI * radius) / prev;
    const ratio = Math.max(1, Math.round(width / ringH));
    counts.push(r === 1 ? Math.max(6, prev * ratio) : prev * ratio);
  }

  const offsets: number[] = [];
  let total = 0;
  for (const c of counts) {
    offsets.push(total);
    total += c;
  }
  const cells: Cell[] = [];
  for (let r = 0; r < rings; r += 1) {
    for (let i = 0; i < counts[r]; i += 1) cells.push({ ring: r, index: i, links: new Set() });
  }
  const id = (r: number, i: number): number => offsets[r] + (((i % counts[r]) + counts[r]) % counts[r]);

  const neighbours = (cellId: number): number[] => {
    const { ring, index } = cells[cellId];
    const out: number[] = [];
    if (ring === 0) {
      for (let i = 0; i < counts[1]; i += 1) out.push(id(1, i));
      return out;
    }
    out.push(id(ring, index + 1), id(ring, index - 1));
    if (ring === 1) out.push(id(0, 0));
    else out.push(id(ring - 1, Math.floor(index / (counts[ring] / counts[ring - 1]))));
    if (ring + 1 < rings) {
      const ratio = counts[ring + 1] / counts[ring];
      for (let k = 0; k < ratio; k += 1) out.push(id(ring + 1, index * ratio + k));
    }
    return out;
  };

  const link = (a: number, b: number): void => {
    cells[a].links.add(b);
    cells[b].links.add(a);
  };

  // The keyhole opens to exactly one corridor, like the emblem.
  const start = id(rings - 1, 0);
  const visited = new Set<number>([start]);
  const stack = [start];
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const options = neighbours(current).filter((n) => !visited.has(n) && !(n === id(0, 0) && cells[id(0, 0)].links.size > 0));
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    // Favour moving around a ring over moving between rings: concentric
    // corridors are what make it read as a labyrinth, as in the emblem.
    const weights = options.map((n) => (cells[n].ring === cells[current].ring ? 2.6 : 1));
    let pick = rand() * weights.reduce((sum, w) => sum + w, 0);
    let next = options[options.length - 1];
    for (let k = 0; k < options.length; k += 1) {
      pick -= weights[k];
      if (pick <= 0) {
        next = options[k];
        break;
      }
    }
    if (next === id(0, 0)) {
      link(current, next);
      visited.add(next);
      continue;
    }
    link(current, next);
    visited.add(next);
    stack.push(next);
  }

  // Walls. Each cell owns its inner arc and its clockwise radial edge.
  const ringWalls: string[] = [];
  for (let r = 1; r < rings; r += 1) {
    const parts: string[] = [];
    const step = (2 * Math.PI) / counts[r];
    const inner = r * ringH;
    const outer = (r + 1) * ringH;
    let arcStart: number | null = null;
    for (let i = 0; i <= counts[r]; i += 1) {
      const cellId = id(r, i);
      const inward = r === 1 ? id(0, 0) : id(r - 1, Math.floor((i % counts[r]) / (counts[r] / counts[r - 1])));
      const walled = i < counts[r] && !cells[cellId].links.has(inward);
      // Merge consecutive walled arcs into one arc so the path stays short.
      if (walled && arcStart === null) arcStart = i;
      if ((!walled || i === counts[r]) && arcStart !== null) {
        const a0 = arcStart * step;
        const a1 = i * step;
        const [x0, y0] = polar(inner, a0);
        const [x1, y1] = polar(inner, a1);
        const large = a1 - a0 > Math.PI ? 1 : 0;
        if (a1 - a0 >= 2 * Math.PI - 1e-6) {
          const [xm, ym] = polar(inner, Math.PI);
          parts.push(`M${r1(x0)} ${r1(y0)}A${r1(inner)} ${r1(inner)} 0 0 1 ${r1(xm)} ${r1(ym)}A${r1(inner)} ${r1(inner)} 0 0 1 ${r1(x0)} ${r1(y0)}`);
        } else {
          parts.push(`M${r1(x0)} ${r1(y0)}A${r1(inner)} ${r1(inner)} 0 ${large} 1 ${r1(x1)} ${r1(y1)}`);
        }
        arcStart = null;
      }
    }
    for (let i = 0; i < counts[r]; i += 1) {
      if (!cells[id(r, i)].links.has(id(r, i + 1))) {
        const a = (i + 1) * step;
        const [x0, y0] = polar(inner, a);
        const [x1, y1] = polar(outer, a);
        parts.push(`M${r1(x0)} ${r1(y0)}L${r1(x1)} ${r1(y1)}`);
      }
    }
    ringWalls.push(parts.join(''));
  }

  // Outer wall with the entrance gap over cell (rings-1, 0).
  const lastStep = (2 * Math.PI) / counts[rings - 1];
  {
    const [x0, y0] = polar(OUTER, lastStep);
    const [xm, ym] = polar(OUTER, Math.PI + lastStep / 2);
    const [x1, y1] = polar(OUTER, 2 * Math.PI);
    ringWalls.push(`M${r1(x0)} ${r1(y0)}A${OUTER} ${OUTER} 0 0 1 ${r1(xm)} ${r1(ym)}A${OUTER} ${OUTER} 0 0 1 ${r1(x1)} ${r1(y1)}`);
  }

  // Route from the entrance to the keyhole (breadth-first over carved links).
  const goal = id(0, 0);
  const prev = new Map<number, number>([[start, -1]]);
  const queue = [start];
  while (queue.length > 0) {
    const current = queue.shift() as number;
    if (current === goal) break;
    for (const n of cells[current].links) {
      if (!prev.has(n)) {
        prev.set(n, current);
        queue.push(n);
      }
    }
  }
  const route: number[] = [];
  for (let at = goal; at !== -1; at = prev.get(at) as number) route.unshift(at);

  const centre = (cellId: number): { radius: number; angle: number } => {
    const { ring, index } = cells[cellId];
    if (ring === 0) return { radius: 0, angle: 0 };
    const step = (2 * Math.PI) / counts[ring];
    return { radius: (ring + 0.5) * ringH, angle: (index + 0.5) * step };
  };

  // The thread enters from just outside the wall, then moves cell to cell:
  // along an arc when it stays in a ring, radially when it changes ring.
  const first = centre(start);
  const [ex, ey] = polar(OUTER + ringH * 0.9, first.angle);
  const [fx, fy] = polar(first.radius, first.angle);
  const thread: string[] = [`M${r1(ex)} ${r1(ey)}L${r1(fx)} ${r1(fy)}`];
  for (let k = 1; k < route.length; k += 1) {
    const a = centre(route[k - 1]);
    const b = centre(route[k]);
    if (b.radius === 0) {
      const [x, y] = polar(ringH * 0.5, a.angle);
      thread.push(`L${r1(x)} ${r1(y)}L0 0`);
      continue;
    }
    if (Math.abs(a.radius - b.radius) < 1e-6) {
      let delta = b.angle - a.angle;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;
      const [x, y] = polar(b.radius, b.angle);
      thread.push(`A${r1(b.radius)} ${r1(b.radius)} 0 0 ${delta > 0 ? 1 : 0} ${r1(x)} ${r1(y)}`);
    } else {
      // Changing ring: travel radially at the child cell's angle, then settle.
      const outerCell = a.radius > b.radius ? a : b;
      const innerCell = a.radius > b.radius ? b : a;
      const angle = outerCell.angle;
      const [x0, y0] = polar(a.radius, a === outerCell ? angle : innerCell.angle);
      const [xa, ya] = polar(innerCell.radius, angle);
      if (a === outerCell) {
        thread.push(`L${r1(xa)} ${r1(ya)}`);
        let delta = innerCell.angle - angle;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;
        if (Math.abs(delta) > 1e-6) {
          const [x, y] = polar(innerCell.radius, innerCell.angle);
          thread.push(`A${r1(innerCell.radius)} ${r1(innerCell.radius)} 0 0 ${delta > 0 ? 1 : 0} ${r1(x)} ${r1(y)}`);
        }
      } else {
        let delta = angle - innerCell.angle;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;
        if (Math.abs(delta) > 1e-6) {
          thread.push(`A${r1(innerCell.radius)} ${r1(innerCell.radius)} 0 0 ${delta > 0 ? 1 : 0} ${r1(xa)} ${r1(ya)}`);
        }
        const [x, y] = polar(outerCell.radius, angle);
        thread.push(`L${r1(x)} ${r1(y)}`);
      }
      void x0;
      void y0;
    }
  }

  return { walls: ringWalls.join(''), ringWalls, thread: thread.join(''), outer: OUTER, ring: ringH, rings };
}

/**
 * A crescent is one disc minus another: the moon of the emblem (thick on the
 * lower left, tapering to a point at the top and at four o'clock) and the thin
 * blade that sweeps over the top right. `cx`/`cy`/`r` describe the outer disc,
 * `r2` the disc centred on the maze that is cut away.
 */
function crescent(cx: number, cy: number, r: number, r2: number, long: 0 | 1): string {
  const d = Math.hypot(cx, cy);
  const a = (d * d + r2 * r2 - r * r) / (2 * d);
  const h = Math.sqrt(Math.max(0, r2 * r2 - a * a));
  const ux = cx / d;
  const uy = cy / d;
  const px = ux * a;
  const py = uy * a;
  const p1 = [px - uy * h, py + ux * h];
  const p2 = [px + uy * h, py - ux * h];
  return `M${r1(p1[0])} ${r1(p1[1])}A${r} ${r} 0 ${long} 0 ${r1(p2[0])} ${r1(p2[1])}A${r2} ${r2} 0 ${long} 1 ${r1(p1[0])} ${r1(p1[1])}Z`;
}

export const CRESCENT = crescent(-58, 34, 512, 462, 1);
export const BLADE = crescent(34, -30, 470, 486, 0);
