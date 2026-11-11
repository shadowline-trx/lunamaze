// Turns one recording into the numbers the app shows. Every number comes from the recording.
import { trackPitch, HOP_SEC } from './pitch.js';
import { estimateResonance } from './formants.js';
import { median, percentile, semitones, shiftSemitones, normCdf, clamp } from './dsp.js';
import { MALE_F0, MALE_DF, STEADINESS } from './norms.js';

const PHRASE_GAP_FRAMES = 25; // 250 ms of no voice ends a phrase
const PHRASE_MIN_VOICED = 40; // 400 ms
const RISING_ST = 1.5;

export function clipFraction(pcm) {
  let c = 0;
  for (let i = 0; i < pcm.length; i++) if (Math.abs(pcm[i]) >= 0.99) c++;
  return c / Math.max(1, pcm.length);
}

function segmentPhrases(frames) {
  const phrases = [];
  let cur = [];
  let gap = 0;
  for (let i = 0; i < frames.length; i++) {
    if (frames[i].voiced) {
      cur.push(i);
      gap = 0;
    } else if (cur.length) {
      gap++;
      if (gap >= PHRASE_GAP_FRAMES) {
        phrases.push(cur);
        cur = [];
        gap = 0;
      }
    }
  }
  if (cur.length) phrases.push(cur);
  return phrases.filter((p) => p.length >= PHRASE_MIN_VOICED);
}

function phraseEnding(frames, idx) {
  const st = idx.map((i) => semitones(frames[i].f0));
  const n = st.length;
  const endN = Math.max(6, Math.round(0.15 * n));
  const end = median(st.slice(n - endN));
  const pre = median(st.slice(Math.round(0.4 * n), Math.round(0.85 * n)));
  const rise = end - pre;
  return { startT: frames[idx[0]].t, endT: frames[idx[n - 1]].t, riseSt: rise, rising: rise > RISING_ST };
}

function steadinessOf(frames) {
  const deltas = [];
  for (let i = 1; i < frames.length; i++) {
    if (frames[i].voiced && frames[i - 1].voiced) deltas.push(Math.abs(semitones(frames[i].f0) - semitones(frames[i - 1].f0)));
  }
  return deltas.length ? median(deltas) : NaN;
}

export function deeperThanPct(f0Hz) {
  return 100 * (1 - normCdf((f0Hz - MALE_F0.meanHz) / MALE_F0.sdHz));
}

function scale01to10(p) {
  return clamp(1 + 9 * p, 0, 10);
}

export function scoreTake(m) {
  const depth = scale01to10(1 - normCdf((m.f0Median - MALE_F0.meanHz) / MALE_F0.sdHz));
  const resonance = Number.isFinite(m.resonance.deltaF) ? scale01to10(1 - normCdf((m.resonance.deltaF - MALE_DF.meanHz) / MALE_DF.sdHz)) : 5;
  const endings = m.phraseCount ? clamp(10 * (1 - m.risingCount / m.phraseCount), 1, 10) : 5;
  const steadiness = Number.isFinite(m.steadinessSt) ? clamp(10 - (9 * (m.steadinessSt - STEADINESS.best)) / (STEADINESS.worst - STEADINESS.best), 1, 10) : 5;
  let overall = 0.35 * depth + 0.3 * resonance + 0.2 * endings + 0.15 * steadiness;
  if (m.fryPct > 0.15) overall -= Math.min(2, (m.fryPct - 0.15) * 10);
  overall = clamp(Math.round(overall * 10) / 10, 0, 10);
  const r1 = (v) => Math.round(v * 10) / 10;
  return { depth: r1(depth), resonance: r1(resonance), endings: r1(endings), steadiness: r1(steadiness), overall };
}

// Reading take: the fixed line.
export function analyzeSpeech(pcm, fs) {
  const clip = clipFraction(pcm);
  const track = trackPitch(pcm, fs);
  const frames = track.frames;
  const voiced = frames.filter((f) => f.voiced);
  const creak = frames.filter((f) => f.creak);
  const voicedSec = voiced.length * HOP_SEC;
  const voiceRms = voiced.length ? median(voiced.map((f) => f.rms)) : 0;
  const snrDb = 20 * Math.log10(Math.max(voiceRms, 1e-9) / Math.max(track.noise, 1e-6));
  const voicedFrac = voiced.length / Math.max(1, frames.length);
  const base = { ok: false, durationSec: pcm.length / fs, voicedSec, clipPct: clip, snrDb };
  if (clip > 0.01) return { ...base, reason: 'clipped' };
  if (voicedSec < 2) return { ...base, reason: 'too_little_voice' };
  if (snrDb < 10 && voicedFrac < 0.85) return { ...base, reason: 'noisy' };

  const f0s = voiced.map((f) => f.f0);
  const f0Median = median(f0s);
  const phrases = segmentPhrases(frames).map((p) => phraseEnding(frames, p));
  const risingCount = phrases.filter((p) => p.rising).length;
  const resonance = estimateResonance(pcm, fs, voiced.map((f) => f.t));
  const m = {
    ...base,
    ok: true,
    reason: null,
    f0Median,
    f0Low: percentile(f0s, 10),
    f0High: percentile(f0s, 90),
    pitchRangeSt: semitones(percentile(f0s, 90)) - semitones(percentile(f0s, 10)),
    steadinessSt: steadinessOf(frames),
    phrases,
    phraseCount: phrases.length,
    risingCount,
    fryPct: creak.length / Math.max(1, creak.length + voiced.length),
    resonance,
    deeperThanPct: deeperThanPct(f0Median),
    contour: frames.map((f) => (f.voiced ? Math.round(f.f0 * 10) / 10 : 0)),
  };
  m.scores = scoreTake(m);
  return m;
}

// "Mm-hmm" take: the pitch you agree at is a classic clue to a comfortable speaking pitch.
export function analyzeHum(pcm, fs) {
  const { frames } = trackPitch(pcm, fs);
  const v = frames.filter((f) => f.voiced).map((f) => f.f0);
  if (v.length < 30) return { ok: false, reason: 'too_little_voice' };
  return { ok: true, f0Median: median(v) };
}

// Glide down: the bottom of the comfortable range (creak excluded).
export function analyzeGlide(pcm, fs) {
  const { frames } = trackPitch(pcm, fs);
  const v = frames.filter((f) => f.voiced).map((f) => f.f0);
  if (v.length < 40) return { ok: false, reason: 'too_little_voice' };
  return { ok: true, floorHz: percentile(v, 5), topHz: percentile(v, 95) };
}

// Practice target: about 2 semitones under the habitual pitch (or the mm-hmm if lower),
// never closer than 3 semitones to the comfortable floor, never above the habitual pitch.
export function targetPitch({ habitualHz, mmhmmHz, floorHz }) {
  const safeMinHz = floorHz ? shiftSemitones(floorHz, 3) : shiftSemitones(habitualHz, -3);
  let t = Math.min(shiftSemitones(habitualHz, -2), mmhmmHz || Infinity);
  t = Math.max(t, safeMinHz);
  t = Math.min(t, habitualHz);
  return { targetHz: t, lowHz: shiftSemitones(t, -1.5), highHz: shiftSemitones(t, 1.5), safeMinHz };
}
