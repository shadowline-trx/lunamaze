// Dials on the live test: fitting one into the space a screen leaves for it, then driving its
// grains, pip and lock from the mic, from a recording, or (on the welcome screen) from a script.
import { dialHtml, mountDial, figForHz, FIG, figOpts } from './dial.js';
import { frames } from './motion.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const follow = (cur, to, dt, k = 9) => cur + (to - cur) * (1 - Math.exp(-dt * k));

// Settled grains per figure. Positions live on the unit plate, so one settle serves every dial
// size: a smaller dial takes the first n. Settling costs a few hundred ms on a phone; once is enough.
const settled = new Map();
export function settleFig(plate, fig) {
  const key = fig.join(',');
  const c = settled.get(key);
  plate.to(...fig);
  plate.mix = plate.mixTo = 1;
  plate.from = { ...plate.mode };
  if (c && c.n >= plate.n) {
    plate.x.set(c.x.subarray(0, plate.n));
    plate.y.set(c.y.subarray(0, plate.n));
  } else {
    plate.settle(2.6, 0.6);
    settled.set(key, { n: plate.n, x: plate.x.slice(), y: plate.y.slice() });
  }
  plate.energy = 0;
  return plate;
}

// The dial takes the height its stage leaves for it (the stage's other children, like a caption,
// keep theirs): numerals when there is room, ticks only when not. settle = start on a formed figure.
export function placeDial(stage, { maxR = 128, minR = 54, numerals = true, cls = '', fig = FIG.busy, seed, settle = true } = {}) {
  const host = stage.querySelector('.dial-host') || stage;
  const box = stage.getBoundingClientRect();
  const cs = getComputedStyle(stage);
  let h = box.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  if (host !== stage) {
    for (const c of stage.children) {
      if (c === host) continue;
      const s = getComputedStyle(c);
      h -= c.getBoundingClientRect().height + parseFloat(s.marginTop) + parseFloat(s.marginBottom);
    }
  }
  const fit = (pad) => Math.floor(Math.min(maxR, (h - 2 * pad) / 2, (box.width - 2 * pad) / 2));
  let num = numerals;
  let R = fit(num ? 40 : 18);
  if (num && R < 86) {
    num = false;
    R = fit(18);
  }
  R = clamp(R, minR, maxR);
  host.innerHTML = dialHtml(R, { numerals: num, cls });
  const d = mountDial(host.firstElementChild, { ...figOpts(fig), seed });
  if (settle) {
    settleFig(d.plate, fig);
    d.plate.draw();
  }
  return Object.assign(d, { R, numerals: num });
}

// A fixed-size dial (result, before/after, paywall), already in the markup via dialHtml.
export function mountAt(el, { fig = FIG.busy, seed } = {}) {
  return mountDial(el, { ...figOpts(fig), seed });
}

// The page's brushed sunburst is centred on the screen's dial, as on a watch face.
export function centerSheen(el) {
  const b = el.getBoundingClientRect();
  document.documentElement.style.setProperty('--cy', `${Math.round(b.top + b.height / 2 + window.scrollY)}px`);
}

// Step and draw, and thin the grains if this phone can't hold the frame rate.
export function ticker(d) {
  let ema = 1 / 60;
  let k = 0;
  return (dt) => {
    d.plate.step(dt);
    d.plate.draw();
    ema += (dt - ema) * 0.05;
    if (++k > 45 && ema > 0.026 && d.plate.n > 1400) {
      d.plate.n = Math.round(d.plate.n * 0.75);
      k = 0;
      ema = 1 / 60;
    }
  };
}

// A figure that holds still: settled offline, drawn once.
export function still(d, fig, { lit = false, pip = 0, ghost = 0, bright = 1 } = {}) {
  d.plate.brightTo = d.plate.bright = bright;
  d.plate.tintTo = d.plate.tint = lit ? 1 : 0;
  settleFig(d.plate, fig);
  d.plate.draw();
  if (pip) d.pip(pip);
  if (ghost) d.ghost(ghost);
  d.lit(lit);
  return d;
}

// A figure that forms on screen: the grains ring, gather on the nodal lines, then freeze.
export function form(d, fig, { secs = 2.2, e = 0.6, alive = () => true } = {}) {
  d.plate.to(...fig);
  const tick = ticker(d);
  return frames((dt, t) => {
    if (!alive()) return false;
    const k = clamp((t - secs * 0.7) / (secs * 0.3), 0, 1);
    d.plate.energy = e * (1 - k);
    tick(dt);
    return t < secs + 0.1;
  });
}

// The mic on the dial. Loudness rings the grains (they freeze in the pauses), the pip follows the
// pitch, the figure follows the pitch, and inside the target arc the figure locks and lights.
export function driveLive(d, ear, { target = null, ghost = 0, alive = () => true, onFrame } = {}) {
  const pipEl = d.el.querySelector('.bz-pip');
  if (pipEl) pipEl.style.opacity = '0';
  if (target) d.target(target.lowHz, target.highHz);
  if (ghost) d.ghost(ghost);
  d.plate.energy = 0;
  const tick = ticker(d);
  let hz = 0;
  let cur = null;
  let cand = null;
  let candT = 0;
  let inside = false;
  let stopped = false;
  const stats = { voicedSec: 0, insideSec: 0 };
  const loop = frames((dt) => {
    if (stopped || !alive()) return false;
    const p = ear.pitch;
    const on = ear.active;
    if (p) {
      if (!hz && pipEl) {
        pipEl.style.transition = 'opacity 300ms ease';
        pipEl.style.opacity = '1';
      }
      hz = hz ? follow(hz, p, dt, 9) : p;
      d.pip(hz);
      stats.voicedSec += dt;
    }
    const inNow = Boolean(target && p && hz >= target.lowHz && hz <= target.highHz);
    if (target && p && inNow) stats.insideSec += dt;
    // The lock changes only on a pitch reading, so it holds through a breath.
    if (p && inNow !== inside) {
      inside = inNow;
      d.lit(inside);
    }
    const want = inside ? FIG.locked : hz ? figForHz(hz) : null;
    if (want && want !== cur) {
      if (!cur) {
        cur = want;
        d.plate.to(...want);
      } else if (want !== cand) {
        cand = want;
        candT = 0;
      } else if ((candT += dt) > 0.25) {
        cur = want;
        cand = null;
        d.plate.to(...want);
      }
    }
    const loud = clamp((ear.levelDb - ear.floorDb - 8) / 30, 0, 1);
    d.plate.energy = on ? 0.25 + 0.75 * loud : 0;
    d.plate.tintTo = inside ? 1 : 0;
    onFrame?.(dt, { hz, p, on, inside });
    tick(dt);
    return true;
  });
  return {
    loop,
    stats,
    get hz() {
      return hz;
    },
    get inside() {
      return inside;
    },
    stop() {
      stopped = true;
      return stats;
    },
  };
}

// A recording on the dial while it plays: its loudness rings the grains, its pitch track moves the pip.
export function drivePlayback(d, pcm, fs, { contour = null, offsetSec = 0, alive = () => true, isPlaying = () => true } = {}) {
  const tick = ticker(d);
  const t0 = performance.now();
  const win = Math.round(fs * 0.03);
  let hz = 0;
  return frames((dt) => {
    if (!alive()) return false;
    const playing = isPlaying();
    const t = (performance.now() - t0) / 1000;
    const i0 = Math.floor(t * fs);
    let s = 0;
    for (let i = i0; i < Math.min(pcm.length, i0 + win); i++) s += pcm[i] * pcm[i];
    const db = 10 * Math.log10(s / win + 1e-12);
    const e = playing ? clamp((db + 60) / 40, 0, 1) : 0;
    d.plate.energy = e > 0.12 ? 0.15 + 0.4 * e : 0;
    if (contour?.length) {
      const k = Math.round((t + offsetSec - 0.015) / 0.01);
      const f = contour[Math.max(0, Math.min(contour.length - 1, k))];
      if (f && playing) {
        hz = hz ? follow(hz, f, dt, 12) : f;
        d.pip(hz);
      }
    }
    tick(dt);
    return playing || d.plate.energy > 0;
  });
}

// The welcome screen's demonstration, on synthetic sound: an everyday voice draws a busy figure, a
// lower, steadier one draws a simple figure that locks. It shows what the dial does, nothing more.
export function demoLoop(d, cap, { alive = () => true, synth } = {}) {
  const phrases = [
    { t0: 0.6, t1: 3.4, mean: 132, fig: FIG.busy },
    { t0: 4.7, t1: 7.7, mean: 110, fig: FIG.locked },
  ];
  const tick = ticker(d);
  let hz = 132;
  let cur = -1;
  let capText = '';
  let lap = -1;
  d.pip(hz);
  return frames((dt, T) => {
    if (!alive()) return false;
    const t = T % 11.5;
    const l = Math.floor(T / 11.5);
    if (l !== lap) {
      lap = l;
      d.plate.tintTo = 0;
      d.lit(false);
    }
    const k = phrases.findIndex((p) => t >= p.t0 && t < p.t1);
    const p = phrases[k];
    if (k !== cur && p) d.plate.to(...p.fig);
    cur = k;
    const txt = t < 4.7 ? 'An everyday voice' : t < 8 ? 'A lower, steadier voice' : 'Simpler. Locked.';
    if (txt !== capText && cap) cap.textContent = capText = txt;
    const lit = t > 8;
    d.plate.tintTo = lit ? 1 : 0;
    d.lit(lit);
    const e = p ? synth.speech(t - p.t0) : 0;
    d.plate.energy = p ? 0.3 + 0.7 * e : 0;
    const f = p ? synth.read(t - p.t0, p.mean) : 0;
    if (f) hz = follow(hz, f, dt, 9);
    d.pip(hz);
    tick(dt);
    return true;
  });
}
