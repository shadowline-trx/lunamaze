// Motion toolkit, shared by the live test and the design boards: cubic-bezier tweens, Apple-style
// springs (damping + response), CSS linear() spring easings, odometer digits, counters, timelines.

export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const e = sx(t) - x;
      const d = dx(t);
      if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
export const easeOut = bezier(0.23, 1, 0.32, 1);
export const easeInOut = bezier(0.77, 0, 0.175, 1);
export const easeDrawer = bezier(0.32, 0.72, 0, 1);

export class Aborted extends Error {}

export function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Aborted());
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new Aborted());
    }, { once: true });
  });
}

export function frames(fn, signal) {
  // fn(dtSeconds, elapsedSeconds) -> return false to stop
  return new Promise((resolve, reject) => {
    let last = performance.now();
    const t0 = last;
    let id = 0;
    const step = (now) => {
      if (signal?.aborted) return reject(new Aborted());
      // A frame's timestamp is when the frame began, which can be before t0 (by a lot on a slow
      // phone). Clamp, so no caller ever sees negative time.
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = Math.max(last, now);
      if (fn(dt, Math.max(0, (now - t0) / 1000)) === false) return resolve();
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    signal?.addEventListener('abort', () => cancelAnimationFrame(id), { once: true });
  });
}

export function tween({ from = 0, to = 1, duration = 600, ease = easeOut, onUpdate, signal }) {
  return frames((_, el) => {
    const p = Math.min(1, (el * 1000) / duration);
    onUpdate(from + (to - from) * ease(p), p);
    return p < 1;
  }, signal);
}

// Apple's parameters: response (s) ~ how fast, damping ratio 1 = no overshoot.
export function spring({ from = 0, to = 1, response = 0.4, damping = 1, velocity = 0, onUpdate, signal, rest = 0.0005 }) {
  const k = (2 * Math.PI / response) ** 2;
  const c = (4 * Math.PI * damping) / response;
  let x = from;
  let v = velocity;
  return frames((dt) => {
    const steps = Math.ceil(dt / (1 / 240));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const a = -k * (x - to) - c * v;
      v += a * h;
      x += v * h;
    }
    onUpdate(x);
    if (Math.abs(x - to) < rest * Math.max(1, Math.abs(to - from)) && Math.abs(v) < rest * 10) {
      onUpdate(to);
      return false;
    }
    return true;
  }, signal);
}

// Sampled spring as a CSS linear() easing + its settle time (for WAAPI / transitions).
export function springEasing(response = 0.5, damping = 0.8) {
  const k = (2 * Math.PI / response) ** 2;
  const c = (4 * Math.PI * damping) / response;
  let x = 0;
  let v = 0;
  const h = 1 / 600;
  const pts = [];
  let settle = 0;
  for (let i = 0; i < 600 * 3; i++) {
    const a = -k * (x - 1) - c * v;
    v += a * h;
    x += v * h;
    if (i % 10 === 0) pts.push(x);
    if (Math.abs(x - 1) > 0.002 || Math.abs(v) > 0.02) settle = i * h;
  }
  const n = Math.max(8, Math.round((settle / (3 * 1)) * pts.length));
  const used = pts.slice(0, n);
  used.push(1);
  return { easing: `linear(${used.map((p) => +p.toFixed(4)).join(', ')})`, duration: Math.round(settle * 1000) };
}
export const SPRING_SOFT = springEasing(0.55, 0.9);
export const SPRING_POP = springEasing(0.45, 0.72);

// Odometer: digits roll into place with a spring, stagger right to left.
export function odometer(el, text, { stagger = 45, spring = SPRING_SOFT, from = null } = {}) {
  const chars = [...String(text)];
  el.classList.add('odo');
  el.innerHTML = '';
  const cols = [];
  chars.forEach((ch, i) => {
    if (!/\d/.test(ch)) {
      const s = document.createElement('span');
      s.className = 'sep';
      s.textContent = ch;
      el.appendChild(s);
      return;
    }
    const col = document.createElement('span');
    col.className = 'col';
    const target = Number(ch);
    const start = from !== null ? Number(String(from)[i] ?? 0) : 0;
    const spins = 1 + ((chars.length - i) % 2);
    const seq = [];
    for (let k = 0; k <= spins * 10 + ((target - start + 10) % 10); k++) seq.push((start + k) % 10);
    col.innerHTML = seq.map((d) => `<span>${d}</span>`).join('');
    el.appendChild(col);
    cols.push({ col, steps: seq.length - 1, i });
  });
  const anims = cols.map(({ col, steps }, j) =>
    col.animate([{ transform: 'translateY(0)' }, { transform: `translateY(-${steps}em)` }], {
      duration: spring.duration + 500,
      delay: (cols.length - 1 - j) * stagger,
      easing: spring.easing,
      fill: 'forwards',
    }),
  );
  return Promise.all(anims.map((a) => a.finished)).catch(() => {});
}

export function countTo(el, { from = 0, to, decimals = 0, duration = 1100, ease = easeOut, signal, suffix = '' }) {
  return tween({ from, to, duration, ease, signal, onUpdate: (v) => (el.textContent = v.toFixed(decimals) + suffix) });
}

export function reveal(nodes, { stagger = 60, cls = 'in' } = {}) {
  [...nodes].forEach((n, i) => setTimeout(() => n.classList.add(cls), i * stagger));
}
export function reset(root) {
  root.querySelectorAll('.in').forEach((n) => n.classList.remove('in'));
}
