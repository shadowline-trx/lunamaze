// Pure DSP helpers. No DOM: runs in the browser and in Node tests.

export function concatChunks(chunks) {
  let n = 0;
  for (const c of chunks) n += c.length;
  const out = new Float32Array(n);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

// Blackman-windowed sinc low-pass. fcNorm = cutoff / sampleRate (0..0.5). Unity DC gain.
export function lowpassKernel(fcNorm, taps) {
  const M = taps - 1;
  const h = new Float64Array(taps);
  let sum = 0;
  for (let n = 0; n < taps; n++) {
    const k = n - M / 2;
    const sinc = k === 0 ? 2 * fcNorm : Math.sin(2 * Math.PI * fcNorm * k) / (Math.PI * k);
    const w = 0.42 - 0.5 * Math.cos((2 * Math.PI * n) / M) + 0.08 * Math.cos((4 * Math.PI * n) / M);
    h[n] = sinc * w;
    sum += h[n];
  }
  for (let n = 0; n < taps; n++) h[n] /= sum;
  return h;
}

const kernelCache = new Map();

// Band-limited resampler. Filters only at the input positions the output needs.
export function resample(x, fsIn, fsOut) {
  if (fsIn === fsOut) return Float32Array.from(x);
  const ratio = fsOut / fsIn;
  const n = Math.floor(x.length * ratio);
  const out = new Float32Array(n);
  let h = null;
  let half = 0;
  if (fsOut < fsIn) {
    const key = `${fsIn}>${fsOut}`;
    h = kernelCache.get(key);
    if (!h) {
      const fc = (0.42 * fsOut) / fsIn;
      const transition = (0.08 * fsOut) / fsIn;
      let taps = Math.ceil(5.5 / transition);
      if (taps % 2 === 0) taps += 1;
      taps = Math.min(Math.max(taps, 31), 1023);
      h = lowpassKernel(fc, taps);
      kernelCache.set(key, h);
    }
    half = (h.length - 1) >> 1;
  }
  const len = x.length;
  const at = (i) => {
    if (i < 0 || i >= len) return 0;
    if (!h) return x[i];
    let acc = 0;
    const j0 = Math.max(0, i - half);
    const j1 = Math.min(len - 1, i + half);
    for (let j = j0; j <= j1; j++) acc += h[i + half - j] * x[j];
    return acc;
  };
  for (let k = 0; k < n; k++) {
    const t = k / ratio;
    const i0 = Math.floor(t);
    const fr = t - i0;
    const a = at(i0);
    out[k] = fr > 1e-9 ? a + (at(i0 + 1) - a) * fr : a;
  }
  return out;
}

export function frameRms(x, start, len) {
  let s = 0;
  const end = Math.min(x.length, start + len);
  for (let i = start; i < end; i++) s += x[i] * x[i];
  return Math.sqrt(s / Math.max(1, end - start));
}

// Zero crossings per sample (0..1).
export function zeroCrossRate(x, start, len) {
  let z = 0;
  const end = Math.min(x.length, start + len);
  for (let i = start + 1; i < end; i++) {
    if ((x[i - 1] >= 0) !== (x[i] >= 0)) z++;
  }
  return z / Math.max(1, end - start - 1);
}

export function hamming(N) {
  const w = new Float64Array(N);
  for (let n = 0; n < N; n++) w[n] = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
  return w;
}

export function autocorr(x, p) {
  const r = new Float64Array(p + 1);
  const N = x.length;
  for (let k = 0; k <= p; k++) {
    let s = 0;
    for (let n = k; n < N; n++) s += x[n] * x[n - k];
    r[k] = s;
  }
  return r;
}

// Levinson-Durbin. Returns a[0..p] with a[0] = 1 for A(z) = 1 + sum a_j z^-j, or null.
export function levinson(r, p) {
  const a = new Float64Array(p + 1);
  a[0] = 1;
  let err = r[0];
  if (!(err > 0)) return null;
  const prev = new Float64Array(p + 1);
  for (let i = 1; i <= p; i++) {
    let acc = r[i];
    for (let j = 1; j < i; j++) acc += a[j] * r[i - j];
    const k = -acc / err;
    prev.set(a);
    for (let j = 1; j < i; j++) a[j] = prev[j] + k * prev[i - j];
    a[i] = k;
    err *= 1 - k * k;
    if (!(err > 0)) return null;
  }
  return a;
}

// Roots of a monic real polynomial z^p + c1 z^(p-1) + ... + cp (Durand-Kerner).
// coeffs = [1, c1, ..., cp]. Returns [[re, im], ...].
export function polyRoots(coeffs) {
  const p = coeffs.length - 1;
  const re = new Float64Array(p);
  const im = new Float64Array(p);
  for (let i = 0; i < p; i++) {
    const ang = (2 * Math.PI * i) / p + 0.4;
    re[i] = 0.9 * Math.cos(ang);
    im[i] = 0.9 * Math.sin(ang);
  }
  for (let it = 0; it < 600; it++) {
    let maxStep = 0;
    for (let i = 0; i < p; i++) {
      let pr = 1;
      let pi = 0;
      for (let k = 1; k <= p; k++) {
        const nr = pr * re[i] - pi * im[i] + coeffs[k];
        const ni = pr * im[i] + pi * re[i];
        pr = nr;
        pi = ni;
      }
      let dr = 1;
      let di = 0;
      for (let j = 0; j < p; j++) {
        if (j === i) continue;
        const ar = re[i] - re[j];
        const ai = im[i] - im[j];
        const nr = dr * ar - di * ai;
        const ni = dr * ai + di * ar;
        dr = nr;
        di = ni;
      }
      const den = dr * dr + di * di || 1e-30;
      const qr = (pr * dr + pi * di) / den;
      const qi = (pi * dr - pr * di) / den;
      re[i] -= qr;
      im[i] -= qi;
      const step = Math.hypot(qr, qi);
      if (step > maxStep) maxStep = step;
    }
    if (maxStep < 1e-12) break;
  }
  const roots = [];
  for (let i = 0; i < p; i++) roots.push([re[i], im[i]]);
  return roots;
}

export function median(values) {
  if (!values.length) return NaN;
  const s = Float64Array.from(values).sort();
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// q in 0..100, linear interpolation.
export function percentile(values, q) {
  if (!values.length) return NaN;
  const s = Float64Array.from(values).sort();
  const pos = (q / 100) * (s.length - 1);
  const i = Math.floor(pos);
  const fr = pos - i;
  return i + 1 < s.length ? s[i] + (s[i + 1] - s[i]) * fr : s[i];
}

export function semitones(hz, refHz = 100) {
  return 12 * Math.log2(hz / refHz);
}

export function shiftSemitones(hz, st) {
  return hz * 2 ** (st / 12);
}

export function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

// Standard normal CDF (Abramowitz-Stegun 7.1.26 erf, |error| < 1.5e-7).
export function normCdf(z) {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}
