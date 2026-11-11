// The dial: a machined, sunburst-brushed face with a Hz bezel, and the voice drawn on it as
// grains settling on a vibrating plate (Chladni figures). Higher pitch = more nodal lines = a busier
// figure; a lower, steadier voice = a simpler, bolder figure. That is the physics and the promise.
// Shared by the live test (web/app.js) and the v3 design boards (web/design/v3/dial.js re-exports it).

const PI = Math.PI;

// Square-plate Chladni amplitude and its analytic gradient: out = [a, da/dx, da/dy].
// s = -1 is the classic antisymmetric mode (it always has a nodal line on the diagonal, which
// reads as a strike-through on a round dial); s = +1 with n, m both even has no line through
// the centre and full 8-way symmetry, like a guilloché dial.
function chladniG(x, y, n, m, s, out) {
  const nx = n * PI * x;
  const mx = m * PI * x;
  const ny = n * PI * y;
  const my = m * PI * y;
  const cnx = Math.cos(nx);
  const cmx = Math.cos(mx);
  const cny = Math.cos(ny);
  const cmy = Math.cos(my);
  out[0] = cnx * cmy + s * cmx * cny;
  out[1] = -n * PI * Math.sin(nx) * cmy - s * m * PI * Math.sin(mx) * cny;
  out[2] = -m * PI * cnx * Math.sin(my) - s * n * PI * cmx * Math.sin(ny);
}
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixRgb = (a, b, k) => a.map((v, j) => Math.round(v + (b[j] - v) * k));
export const cssv = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();

// Figures [n, m, sign], cleanest to busiest, in order of plate frequency (n² + m²).
// Chosen from test/plate-modes-v3.mjs: symmetric modes only, so no line ever crosses the dial.
export const FIG = {
  locked: [2, 4, 1], // a ring inside a diamond
  flower: [4, 6, 1], // quatrefoil
  rings: [4, 8, 1], // five rings on a lattice
  mandala: [6, 8, 1],
  lattice: [2, 10, 1],
  busy: [4, 10, 1],
};
export const figOpts = ([n, m, s]) => ({ n, m, s });

export class Plate {
  constructor(canvas, { count, ink = '#eef3fb', dim = '#8da2c9', accent = '#d6f79b', n = 7, m = 4, s = -1, mask = 0.48, alpha = 1, size = 1.2, seed = null } = {}) {
    this.c = canvas;
    this.cols = { ink: hexRgb(ink), dim: hexRgb(dim), accent: hexRgb(accent) };
    this.bright = 1;
    this.brightTo = 1;
    this.tint = 0;
    this.tintTo = 0;
    this.alpha = alpha;
    this.size = size;
    this.mode = { n, m, s };
    this.from = { n, m, s };
    this.mix = 1;
    this.mixTo = 1;
    this.energy = 0.6;
    this.shake = 0; // room noise / a jolt: grains jump everywhere, nodal lines or not
    this.mask = mask;
    this.A = new Float64Array(3);
    this.B = new Float64Array(3);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.S = canvas.clientWidth;
    canvas.width = Math.round(this.S * dpr);
    canvas.height = Math.round(this.S * dpr);
    this.g = canvas.getContext('2d');
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.n = count ?? Math.round(this.S * this.S * 0.105);
    this.x = new Float32Array(this.n);
    this.y = new Float32Array(this.n);
    let sd = seed ?? Math.random() * 1e6;
    this.rnd = seed === null ? Math.random : () => ((sd = (sd * 9301 + 49297) % 233280) / 233280);
    this.scatter();
  }
  scatter() {
    for (let i = 0; i < this.n; i++) {
      let x, y;
      do {
        x = this.rnd();
        y = this.rnd();
      } while ((x - 0.5) ** 2 + (y - 0.5) ** 2 > this.mask * this.mask);
      this.x[i] = x;
      this.y[i] = y;
    }
  }
  // Morph toward a new figure. `upTo` < 1 stops part-way (a partial match).
  to(n, m, s = -1, upTo = 1) {
    this.from = { ...this.mode };
    this.mode = { n, m, s };
    this.mix = 0;
    this.mixTo = upTo;
  }
  // While the plate rings (energy > 0) grains bounce at the antinodes and slide down the
  // gradient of a² onto the nodal lines; when it stops, they stay where they landed.
  step(dt) {
    this.mix = Math.min(this.mixTo, this.mix + dt * 0.9);
    const k5 = 1 - Math.exp(-dt * 5);
    this.tint += (this.tintTo - this.tint) * k5;
    this.bright += (this.brightTo - this.bright) * k5;
    const e = this.energy;
    const sh = this.shake;
    if (e <= 0 && sh <= 0) return;
    const f = dt * 60;
    const J = (0.0015 + 0.022 * e) * f;
    // Low modes have gentle slopes, so grains would crawl onto them; scale the drift up to match.
    const D = 0.00034 * e * f * Math.max(1, 50 / (this.mode.n ** 2 + this.mode.m ** 2));
    const SJ = sh * 0.016 * f;
    const R2 = this.mask * this.mask;
    const { A, B } = this;
    const k = this.mix;
    const rnd = this.rnd;
    for (let i = 0; i < this.n; i++) {
      const x = this.x[i];
      const y = this.y[i];
      chladniG(x, y, this.mode.n, this.mode.m, this.mode.s, A);
      if (k < 1) {
        chladniG(x, y, this.from.n, this.from.m, this.from.s, B);
        for (let j = 0; j < 3; j++) A[j] = B[j] + (A[j] - B[j]) * k;
      }
      const a = A[0];
      const jit = J * Math.min(1, Math.abs(a)) + SJ;
      let nx = x - D * a * A[1] + (rnd() - 0.5) * jit;
      let ny = y - D * a * A[2] + (rnd() - 0.5) * jit;
      if ((nx - 0.5) ** 2 + (ny - 0.5) ** 2 > R2) {
        nx = x;
        ny = y;
      }
      this.x[i] = nx;
      this.y[i] = ny;
    }
  }
  // Run the physics offline (for still figures: share card, gallery, paywall).
  settle(seconds = 2.6, energy = 0.6) {
    const e0 = this.energy;
    this.energy = energy;
    for (let t = 0; t < seconds; t += 1 / 60) this.step(1 / 60);
    this.energy = e0;
    this.tint = this.tintTo;
    this.bright = this.brightTo;
    this.mix = this.mixTo;
    return this;
  }
  draw() {
    const g = this.g;
    const S = this.S;
    g.clearRect(0, 0, S, S);
    const base = mixRgb(this.cols.dim, this.cols.ink, this.bright);
    const c = mixRgb(base, this.cols.accent, this.tint);
    g.globalAlpha = this.alpha;
    g.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    const z = this.size;
    for (let i = 0; i < this.n; i++) g.fillRect(this.x[i] * S - z / 2, this.y[i] * S - z / 2, z, z);
    g.globalAlpha = 1;
    this.c.classList.toggle('lit', this.tint > 0.5);
  }
}

// ---------- bezel: Hz scale 80-160 over 300 degrees, deeper = counter-clockwise ----------
const LO = 80;
const HI = 160;
const SPAN = 300;
export const hzDeg = (hz) => -SPAN / 2 + ((Math.max(LO, Math.min(HI, hz)) - LO) / (HI - LO)) * SPAN;
const pt = (c, deg, r) => [c + r * Math.sin((deg * PI) / 180), c - r * Math.cos((deg * PI) / 180)];
const f1 = (v) => v.toFixed(1);
function arcD(c, a0, a1, r) {
  const [x0, y0] = pt(c, a0, r);
  const [x1, y1] = pt(c, a1, r);
  return `M${f1(x0)} ${f1(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f1(x1)} ${f1(y1)}`;
}

export function dialHtml(R, { cls = '', numerals: num = true, ticks = true } = {}) {
  const numerals = num && ticks; // no bezel, no numerals (and no space reserved for them)
  const pad = numerals ? 40 : ticks ? 18 : 6;
  const S = 2 * (R + pad);
  const c = S / 2;
  let svg = '';
  if (ticks) {
    const r1 = R + 7;
    const n = numerals ? 80 : 40;
    for (let i = 0; i <= n; i++) {
      const hz = LO + (i / n) * (HI - LO);
      const major = numerals ? i % 10 === 0 : i % 10 === 0;
      const mid = numerals && i % 5 === 0 && !major;
      const len = major ? 9 : mid ? 6 : 3.5;
      const [x1, y1] = pt(c, hzDeg(hz), r1);
      const [x2, y2] = pt(c, hzDeg(hz), r1 + len);
      svg += `<line class="${major ? 'tk mj' : 'tk'}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`;
      if (numerals && major) {
        const [tx, ty] = pt(c, hzDeg(hz), R + 28);
        svg += `<text class="bz-n" x="${f1(tx)}" y="${f1(ty + 4)}" text-anchor="middle">${Math.round(hz)}</text>`;
      }
    }
    const [hx, hy] = pt(c, 180, R + 26);
    if (numerals) svg += `<text class="bz-u" x="${f1(hx)}" y="${f1(hy + 4)}" text-anchor="middle">Hz</text>`;
    svg += `<path class="bz-target" d=""/><path class="bz-trail" d=""/><path class="bz-prog" d="${arcD(c, -150, 150, R + 3)}" pathLength="1"/>`;
    svg += `<g class="bz-ghost" transform="rotate(-150 ${c} ${c})"><path d="M${c} ${c - R - 5} l-4.5 -9 h9 z"/></g>`;
    svg += `<g class="bz-pip" transform="rotate(-150 ${c} ${c})"><path d="M${c} ${c - R - 4} l-5.5 -11 h11 z"/></g>`;
  }
  return `<div class="dial ${cls}" style="width:${S}px;height:${S}px">
    <div class="disc" style="inset:${pad - (ticks ? 16 : 4)}px"></div>
    <canvas class="grains" style="left:${pad}px;top:${pad}px;width:${2 * R}px;height:${2 * R}px"></canvas>
    ${ticks ? `<svg class="bezel" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" data-c="${c}" data-r="${R}">${svg}</svg>` : ''}
  </div>`;
}

// Wire up a dial rendered by dialHtml. Returns the plate and bezel controls.
export function mountDial(el, plateOpts = {}) {
  const scr = el.closest('.scr') || document.body;
  const plate = new Plate(el.querySelector('.grains'), {
    ink: cssv(scr, '--grain'),
    dim: cssv(scr, '--grain-dim'),
    accent: cssv(scr, '--lume'),
    ...plateOpts,
  });
  const svg = el.querySelector('.bezel');
  const c = svg ? Number(svg.dataset.c) : 0;
  const R = svg ? Number(svg.dataset.r) : 0;
  const rot = (g, hz) => g && g.setAttribute('transform', `rotate(${hzDeg(hz).toFixed(2)} ${c} ${c})`);
  return {
    el,
    plate,
    pip: (hz) => rot(svg?.querySelector('.bz-pip'), hz),
    ghost: (hz) => {
      const g = svg?.querySelector('.bz-ghost');
      if (!g) return;
      g.style.opacity = hz ? 1 : 0;
      if (hz) rot(g, hz);
    },
    target: (lo, hi) => svg?.querySelector('.bz-target').setAttribute('d', lo ? arcD(c, hzDeg(lo), hzDeg(hi), R + 10) : ''),
    trail: (a, b) => svg?.querySelector('.bz-trail').setAttribute('d', a ? arcD(c, hzDeg(Math.min(a, b)), hzDeg(Math.max(a, b)) + 0.01, R + 10) : ''),
    prog: (p) => svg && (svg.querySelector('.bz-prog').style.strokeDashoffset = String(1 - Math.max(0, Math.min(1, p)))),
    lit: (on) => el.classList.toggle('in-target', on),
  };
}

// Pitch -> figure: the lower and steadier the voice, the simpler the figure.
const LADDER = [FIG.locked, FIG.flower, FIG.rings, FIG.mandala, FIG.lattice, FIG.busy];
export function figForHz(hz) {
  const k = Math.max(0, Math.min(LADDER.length - 1, Math.round(((hz - 108) / (140 - 108)) * (LADDER.length - 1))));
  return LADDER[k];
}
