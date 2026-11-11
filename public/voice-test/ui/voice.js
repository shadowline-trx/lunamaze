// The mic, read live for the screens: loudness, pitch and voice activity, plus takes that start
// when he starts talking (keeping the half second before) and stop when he is done.
// Everything is timed in audio samples, so the fixture mic (10x speed in tests) behaves the same.
import { livePitch } from '../engine/pitch.js';
import { concatChunks, percentile } from '../engine/dsp.js';

const PITCH_EVERY = 0.04; // s of audio between live pitch estimates
const RING_SEC = 0.08; // the window each estimate looks at
const PRE_ROLL = 0.5; // s kept before the first voiced frame, so the first word is whole
const HOLD = 0.12; // a pitch reading survives this long without a new one
const ACTIVE_HANG = 0.25; // voice counts as active this long after the last voiced frame

export function createEar(mic) {
  const fs = mic.sampleRate;
  const ringLen = Math.round(fs * RING_SEC);
  const ring = new Float32Array(ringLen);
  const lin = new Float32Array(ringLen);
  let w = 0;
  let filled = 0;
  let n = 0; // samples heard so far: the clock
  let nextPitch = 0;
  let levelDb = -100; // smoothed loudness, dBFS
  let floorDb = -70; // the room when nobody talks
  let pitch = 0;
  let lastVoiced = -1e12;
  let run = 0; // voiced estimates in a row: a take starts on two, so one click can't start it
  let muteUntil = -1;
  const recent = []; // last raw estimates, for a median of three
  let pre = [];
  let preLen = 0;
  const PRE = Math.round(fs * PRE_ROLL);
  let take = null;
  const meters = new Set();

  const threshold = () => Math.max(floorDb + 12, -58);

  function estimatePitch() {
    for (let i = 0; i < ringLen; i++) lin[i] = ring[(w + i) % ringLen];
    let s = 0;
    for (let i = 0; i < ringLen; i++) s += lin[i] * lin[i];
    const rms = Math.sqrt(s / ringLen);
    if (rms < 1e-5) return 0;
    // The engine's live estimate ignores frames quieter than about -48 dBFS. Phone mics with
    // processing off can sit lower than that, so scale the window up first: the period it finds
    // doesn't depend on loudness, and loudness has its own gate here (threshold()).
    const g = Math.min(40, 0.05 / rms);
    if (g > 1) for (let i = 0; i < ringLen; i++) lin[i] *= g;
    return livePitch(lin, fs).f0;
  }

  const unsub = mic.subscribe((c) => {
    const len = c.length;
    for (let i = 0; i < len; i++) {
      ring[w] = c[i];
      w = (w + 1) % ringLen;
    }
    filled = Math.min(ringLen, filled + len);
    let s = 0;
    for (let i = 0; i < len; i++) s += c[i] * c[i];
    const db = 10 * Math.log10(s / Math.max(1, len) + 1e-12);
    const dt = len / fs;
    levelDb += (db - levelDb) * (1 - Math.exp(-dt / (db > levelDb ? 0.012 : 0.12)));
    n += len;
    const muted = n < muteUntil;

    if (filled >= ringLen && n >= nextPitch) {
      nextPitch = n + PITCH_EVERY * fs;
      const f0 = muted ? 0 : estimatePitch();
      const voicedNow = f0 > 0 && levelDb > threshold();
      run = voicedNow ? run + 1 : 0;
      if (voicedNow) {
        // An octave slip lasts one estimate; the median of the last three ignores it.
        recent.push(f0);
        if (recent.length > 3) recent.shift();
        const sorted = [...recent].sort((a, b) => a - b);
        pitch = sorted[Math.floor(sorted.length / 2)];
        lastVoiced = n;
      } else if (n - lastVoiced > HOLD * fs) {
        pitch = 0;
        recent.length = 0;
      }
    }
    const active = n - lastVoiced < ACTIVE_HANG * fs;
    // The room level follows the quiet moments only: fast down, slow up.
    if (!active && !muted) floorDb += (levelDb - floorDb) * (1 - Math.exp(-dt / (levelDb < floorDb ? 0.25 : 2.5)));

    for (const m of meters) m(levelDb);

    if (take) take.feed(c, active);
    else {
      pre.push(c);
      preLen += len;
      while (pre.length > 1 && preLen - pre[0].length >= PRE) preLen -= pre.shift().length;
    }
  });

  const ear = {
    fs,
    get time() {
      return n / fs;
    },
    get levelDb() {
      return levelDb;
    },
    get floorDb() {
      return floorDb;
    },
    get threshold() {
      return threshold();
    },
    get pitch() {
      return pitch;
    },
    get active() {
      return n - lastVoiced < ACTIVE_HANG * fs;
    },
    get recording() {
      return Boolean(take?.started);
    },
    setFloor(db) {
      if (Number.isFinite(db)) floorDb = Math.max(-90, Math.min(-25, db));
    },
    // Ignore the mic for a while: the target note plays through the speaker and would read as him.
    mute(ms) {
      muteUntil = Math.max(muteUntil, n + (ms / 1000) * fs);
      pitch = 0;
      run = 0;
      recent.length = 0;
    },
    // The room, before any reading: loudness spread over `sec` seconds (skipping the first moment,
    // when some mics click on).
    measure(sec = 1.5, skip = 0.2) {
      return new Promise((resolve) => {
        const vals = [];
        const t0 = n + skip * fs;
        const end = t0 + sec * fs;
        const m = (lv) => {
          if (n < t0) return;
          vals.push(lv);
          if (n >= end) {
            meters.delete(m);
            resolve({ floorDb: percentile(vals, 20), p90Db: percentile(vals, 90), peakDb: Math.max(...vals) });
          }
        };
        meters.add(m);
      });
    },
    // One take. It waits for the first voiced moment, keeps the half second before it, and ends
    // at maxSec, or once he has been quiet for silenceSec after at least minSec.
    capture({ maxSec, minSec = 1, silenceSec = 1.2, onStart } = {}) {
      let resolveFn;
      const done = new Promise((r) => (resolveFn = r));
      const chunks = [];
      let got = 0;
      let start = -1;
      let quietFrom = -1;
      const t = {
        started: false,
        waitFrom: n,
        feed(c, active) {
          if (!t.started) {
            pre.push(c);
            preLen += c.length;
            while (pre.length > 1 && preLen - pre[0].length >= PRE) preLen -= pre.shift().length;
            if (!active || run < 2 || n - lastVoiced > 0.05 * fs) return;
            t.started = true;
            start = n - preLen;
            chunks.push(...pre);
            got = preLen;
            pre = [];
            preLen = 0;
            onStart?.();
            return;
          }
          chunks.push(c);
          got += c.length;
          if (active) quietFrom = -1;
          else if (quietFrom < 0) quietFrom = n;
          const long = got >= maxSec * fs;
          const finished = got >= minSec * fs && quietFrom >= 0 && n - quietFrom >= silenceSec * fs;
          if (long || finished) t.finish();
        },
        finish() {
          if (take !== t) return;
          take = null;
          resolveFn(concatChunks(chunks.length ? chunks : pre));
        },
      };
      take = t;
      return {
        done,
        stop: () => t.finish(),
        get started() {
          return t.started;
        },
        // seconds since he started (0 while waiting), and seconds spent waiting
        get elapsed() {
          return t.started ? (n - start) / fs : 0;
        },
        get waited() {
          return t.started ? 0 : (n - t.waitFrom) / fs;
        },
      };
    },
    close() {
      unsub();
      meters.clear();
      take = null;
    },
  };
  return ear;
}
