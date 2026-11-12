// Pitch tracking (YIN, de Cheveigne & Kawahara 2002) at 8 kHz, 10 ms hop.
import { resample, frameRms, zeroCrossRate, percentile, median } from './dsp.js';

export const PITCH_FS = 8000;
export const HOP = 80; // 10 ms at 8 kHz
export const HOP_SEC = HOP / PITCH_FS;
export const WIN = 240; // 30 ms
export const F0_MIN = 55;
export const F0_MAX = 400;

const TAU_MIN = Math.floor(PITCH_FS / F0_MAX);
const TAU_MAX = Math.ceil(PITCH_FS / F0_MIN);

// Below this F0 with weak periodicity, a frame counts as creak (vocal fry), not depth.
const FRY_F0 = 68;
const CREAK_ZCR = 0.25; // voice-like zero-crossing rate at 8 kHz (F1 ringing); fricatives run higher
const CREAK_MIN_RUN = 3; // 30 ms
// 0.35, tuned against Praat on 60 real male utterances (CMU ARCTIC): voicing errors 21% -> 6%,
// gross pitch errors stay ~0.3%, median-F0 error 1.1% -> 0.4%. See research/accuracy/.
export const VOICING_THRESHOLD = 0.35;
export const GATE_DB = -30; // floor of the energy gate relative to the loud frames

// One YIN estimate on x[off .. off + WIN + TAU_MAX).
export function yinAt(x, off, threshold = 0.15, scratch = null) {
  const d = scratch?.d ?? new Float64Array(TAU_MAX + 2);
  const cm = scratch?.cm ?? new Float64Array(TAU_MAX + 2);
  if (off < 0 || off + WIN + TAU_MAX + 1 > x.length) return { f0: 0, cmnd: 1, periodic: false };
  for (let tau = 1; tau <= TAU_MAX + 1; tau++) {
    let s = 0;
    for (let j = 0; j < WIN; j++) {
      const diff = x[off + j] - x[off + j + tau];
      s += diff * diff;
    }
    d[tau] = s;
  }
  cm[0] = 1;
  let run = 0;
  for (let tau = 1; tau <= TAU_MAX + 1; tau++) {
    run += d[tau];
    cm[tau] = run > 0 ? (d[tau] * tau) / run : 1;
  }
  let best = -1;
  for (let tau = TAU_MIN; tau <= TAU_MAX; tau++) {
    if (cm[tau] < threshold) {
      while (tau + 1 <= TAU_MAX && cm[tau + 1] < cm[tau]) tau++;
      best = tau;
      break;
    }
  }
  let periodic = true;
  if (best < 0) {
    periodic = false;
    best = TAU_MIN;
    for (let tau = TAU_MIN + 1; tau <= TAU_MAX; tau++) if (cm[tau] < cm[best]) best = tau;
  }
  // Parabolic interpolation around the dip.
  let tauF = best;
  if (best > 1 && best < TAU_MAX + 1) {
    const a = cm[best - 1];
    const b = cm[best];
    const c = cm[best + 1];
    const den = a - 2 * b + c;
    if (den > 1e-12) tauF = best + (0.5 * (a - c)) / den;
  }
  return { f0: PITCH_FS / tauF, cmnd: cm[best], periodic };
}

function localMedian(values, i, radius) {
  const pick = [];
  for (let k = Math.max(0, i - radius); k <= Math.min(values.length - 1, i + radius); k++) {
    if (values[k] > 0) pick.push(values[k]);
  }
  return pick.length ? median(pick) : 0;
}

// Full track. Returns frames with t (s), f0 (Hz, 0 when unvoiced), voiced, creak, rms, zcr, cmnd.
// threshold picks the period dip; voicing accepts a frame whose dip is below voicingThreshold.
export function trackPitch(pcm, fsIn, { threshold = 0.15, voicingThreshold = VOICING_THRESHOLD, gateDb = GATE_DB } = {}) {
  const x = resample(pcm, fsIn, PITCH_FS);
  const scratch = { d: new Float64Array(TAU_MAX + 2), cm: new Float64Array(TAU_MAX + 2) };
  const frames = [];
  for (let off = 0; off + WIN + TAU_MAX + 1 <= x.length; off += HOP) {
    const rms = frameRms(x, off, WIN);
    const zcr = zeroCrossRate(x, off, WIN);
    const y = yinAt(x, off, threshold, scratch);
    frames.push({ t: (off + WIN / 2) / PITCH_FS, rawF0: y.f0, cmnd: y.cmnd, periodic: y.periodic, rms, zcr, f0: 0, voiced: false, creak: false });
  }
  if (!frames.length) return { frames, gate: 0, noise: 0, loud: 0, hopSec: HOP_SEC };

  const rmsAll = frames.map((f) => f.rms);
  const noise = percentile(rmsAll, 5);
  const loud = percentile(rmsAll, 95);
  const gate = Math.max(Math.min(noise * 3.16, loud * 0.25), loud * 10 ** (gateDb / 20), 3e-4);

  for (const f of frames) {
    f.voiced = f.cmnd < voicingThreshold && f.rms > gate && f.rawF0 >= F0_MIN && f.rawF0 <= F0_MAX;
    f.f0 = f.voiced ? f.rawF0 : 0;
  }

  // Octave-error repair against the local median.
  const raw = frames.map((f) => f.f0);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    if (!f.voiced) continue;
    const m = localMedian(raw, i, 25);
    if (!m) continue;
    const r = f.f0 / m;
    if (r > 1.85 && r < 2.15) f.f0 /= 2;
    else if (r > 0.465 && r < 0.54) f.f0 *= 2;
  }

  // 5-point median smoothing inside voiced runs.
  const fixed = frames.map((f) => f.f0);
  for (let i = 0; i < frames.length; i++) {
    if (!frames[i].voiced) continue;
    const win = [];
    for (let k = i - 2; k <= i + 2; k++) if (k >= 0 && k < frames.length && frames[k].voiced) win.push(fixed[k]);
    frames[i].f0 = median(win);
  }

  // Creak: loud, voice-like spectrum, but no usable periodicity in the modal range.
  for (const f of frames) {
    const weakLow = f.voiced && f.f0 < FRY_F0 && f.cmnd > 0.08;
    const aperiodicVoice = !f.voiced && f.rms > gate && f.zcr < CREAK_ZCR;
    f.creakCandidate = weakLow || aperiodicVoice;
  }
  let i = 0;
  while (i < frames.length) {
    if (!frames[i].creakCandidate) {
      i++;
      continue;
    }
    let j = i;
    while (j < frames.length && frames[j].creakCandidate) j++;
    if (j - i >= CREAK_MIN_RUN) {
      for (let k = i; k < j; k++) {
        frames[k].creak = true;
        frames[k].voiced = false;
        frames[k].f0 = 0;
      }
    }
    i = j;
  }
  for (const f of frames) delete f.creakCandidate;

  return { frames, gate, noise, loud, hopSec: HOP_SEC };
}

// Live estimate from the newest samples of a ring buffer (any input rate).
// f0 is clean pitch only. cmnd and rawF0 let a caller judge "voice-like" more loosely, the way the
// offline track does (VOICING_THRESHOLD): breathy, soft or creaky voice fails the clean test.
export function livePitch(recent, fsIn) {
  const x = resample(recent, fsIn, PITCH_FS);
  const need = WIN + TAU_MAX + 1;
  if (x.length < need) return { f0: 0, rms: 0, cmnd: 1, rawF0: 0 };
  const off = Math.max(0, Math.floor((x.length - need) / 2));
  const rms = frameRms(x, off, WIN);
  const y = yinAt(x, off, 0.15);
  const ok = y.periodic && rms > 0.004 && y.f0 >= F0_MIN && y.f0 <= F0_MAX;
  return { f0: ok ? y.f0 : 0, rms, cmnd: y.cmnd, rawF0: y.f0 };
}
