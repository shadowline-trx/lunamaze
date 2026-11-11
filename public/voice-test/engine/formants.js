// Resonance: formants by LPC root solving at 10 kHz, then formant spacing (deltaF).
// deltaF regression (Reby & McComb 2003): F_i ~ (2i - 1)/2 * deltaF. Lower deltaF = longer
// apparent vocal tract = a bigger, darker sound. People can lower it on purpose
// (Pisanski et al. 2016, "Volitional exaggeration of body size through fundamental and
// formant frequency modulation in humans").
import { resample, hamming, autocorr, levinson, polyRoots, median } from './dsp.js';
import { SPEED_OF_SOUND_CM_S } from './norms.js';

export const LPC_FS = 10000;
const ORDER = 12;
const WIN = 250; // 25 ms
const PRE = 0.97;

const SLOTS = [
  { lo: 180, hi: 1100 },
  { lo: 550, hi: 2700 },
  { lo: 1500, hi: 3700 },
  { lo: 2400, hi: 4800 },
];
const WEIGHTS = [0.5, 1.5, 2.5, 3.5];
const WEIGHT_SQ = WEIGHTS.reduce((a, w) => a + w * w, 0);

let hammingWin = null;

export function lpcFormants(frame, { order = ORDER, maxBw = 600, slots = true } = {}) {
  hammingWin ??= hamming(WIN);
  const w = new Float64Array(WIN);
  for (let i = 0; i < WIN; i++) w[i] = (frame[i] ?? 0) * hammingWin[i];
  const r = autocorr(w, order);
  r[0] *= 1 + 1e-9; // tiny white-noise floor for stability
  const a = levinson(r, order);
  if (!a) return null;
  const roots = polyRoots(Array.from(a));
  const cands = [];
  for (const [re, im] of roots) {
    if (im <= 0) continue;
    const f = (Math.atan2(im, re) / (2 * Math.PI)) * LPC_FS;
    const mag = Math.hypot(re, im);
    const bw = -(LPC_FS / Math.PI) * Math.log(mag);
    if (f > 90 && f < LPC_FS / 2 - 100 && bw > 0 && bw < maxBw) cands.push({ f, bw });
  }
  cands.sort((p, q) => p.f - q.f);
  if (!slots) return cands.length >= 4 ? cands.slice(0, 4).map((c) => c.f) : null; // Praat-style: first four
  const out = [];
  let k = 0;
  for (let s = 0; s < SLOTS.length; s++) {
    const lo = Math.max(SLOTS[s].lo, s ? out[s - 1] + 150 : 0);
    while (k < cands.length && cands[k].f < lo) k++;
    if (k >= cands.length || cands[k].f > SLOTS[s].hi) return null;
    out.push(cands[k].f);
    k++;
  }
  return out;
}

export function deltaFOf(F) {
  let s = 0;
  for (let i = 0; i < 4; i++) s += F[i] * WEIGHTS[i];
  return s / WEIGHT_SQ;
}

// voicedTimes: seconds of voiced frames (from the pitch track).
export function estimateResonance(pcm, fsIn, voicedTimes, { maxFrames = 400, lpc = {} } = {}) {
  const x = resample(pcm, fsIn, LPC_FS);
  const y = new Float32Array(x.length);
  y[0] = x[0] ?? 0;
  for (let i = 1; i < x.length; i++) y[i] = x[i] - PRE * x[i - 1];
  const step = Math.max(1, Math.ceil(voicedTimes.length / maxFrames));
  const per = [[], [], [], []];
  const dfs = [];
  for (let n = 0; n < voicedTimes.length; n += step) {
    const c = Math.round(voicedTimes[n] * LPC_FS);
    const s = c - (WIN >> 1);
    if (s < 0 || s + WIN > y.length) continue;
    const F = lpcFormants(y.subarray(s, s + WIN), lpc);
    if (!F) continue;
    for (let i = 0; i < 4; i++) per[i].push(F[i]);
    dfs.push(deltaFOf(F));
  }
  if (dfs.length < 5) return { ok: false, deltaF: NaN, vtlCm: NaN, formants: [], frames: dfs.length };
  const deltaF = median(dfs);
  return {
    ok: true,
    deltaF,
    vtlCm: SPEED_OF_SOUND_CM_S / (2 * deltaF),
    formants: per.map((v) => median(v)),
    frames: dfs.length,
  };
}
