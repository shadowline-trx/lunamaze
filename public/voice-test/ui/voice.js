// The mic, read live for the screens: loudness, pitch and voice activity, plus takes that start
// when he starts talking (keeping the half second before) and stop when he is done.
// Everything is timed in audio samples, so the fixture mic (10x speed in tests) behaves the same.
import { livePitch, F0_MIN, F0_MAX, VOICING_THRESHOLD } from '../engine/pitch.js';
import { concatChunks, percentile, semitones } from '../engine/dsp.js';

const PITCH_EVERY = 0.04; // s of audio between live pitch estimates
const RING_SEC = 0.08; // the window each estimate looks at
const PRE_ROLL = 0.5; // s kept before the first voiced frame, so the first word is whole
const HOLD = 0.12; // a pitch reading survives this long without a new one
const ACTIVE_HANG = 0.25; // voice counts as active this long after the last active estimate

// When the ear counts him as talking, in dB above the room's floor.
// The first real-phone run (11-12, vivo X100, processing off, room floor -43 dBFS) showed the old
// single gate (floor + 12 dB, clean periodicity only) losing his relaxed "after" voice and the low
// end of his glide: both takes ended while he was still talking. Now a take starts on clear voice,
// and softer, breathier or creaky voice keeps it going.
export const EAR_RULES = Object.freeze({
  startDb: 10, // a take starts on two voice-like estimates in a row this far above the room
  keepDb: 5, // once started, voice-like sound this far above the room keeps it going...
  loudDb: 12, // ...and so does any sound this loud (consonants, creak, a laugh)
  minDb: -60, // the gates never drop below this, however quiet the room
  voicing: VOICING_THRESHOLD, // voice-like = a YIN dip under this, as in the offline track
  roomCapDb: 6, // the live floor stays within this of the room check's floor...
  floorIgnoresVoice: true, // ...and never learns from voice-like sound
  loudHoldSec: 1.5, // loud sound keeps a take going only this long after the last voice-like sound
});
// The rules up to 11-11, kept so older recordings can be replayed (tools/gate1-takes.mjs).
export const EAR_RULES_V1 = Object.freeze({ startDb: 12, keepDb: 12, loudDb: Infinity, minDb: -58, voicing: 0.15 });

// How long each take may run, and how long a pause ends it (seconds).
// Readings may run 12 s: his readings on the app's mic check (11-12) still had voice at 8.8 and 9.9 s.
export const TAKE_RULES = Object.freeze({
  before: { maxSec: 12, minSec: 6, silenceSec: 1.3 },
  after: { maxSec: 12, minSec: 6, silenceSec: 1.3 },
  after2: { maxSec: 12, minSec: 6, silenceSec: 1.3 },
  mmhmm: { maxSec: 4, minSec: 1.5, silenceSec: 0.9 },
  glide: { maxSec: 6, minSec: 2, silenceSec: 0.8, creakEndSec: 1, dropSt: 3 },
});

export function createEar(mic, rules = EAR_RULES) {
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
  let roomDb = null; // the room check's floor: the live floor may not climb far above it
  let pitch = 0;
  let lastVoiced = -1e12; // last clean pitch reading (the pip)
  let lastActive = -1e12; // last moment that counted as him talking (takes)
  let lastVoiceLike = -1e12; // last voice-like estimate at any level: the floor never learns from voice
  let lastVoiceLikeHz = 0; // and the period it found
  let run = 0; // start-quality estimates in a row: a take starts on two, so one click can't start it
  let muteUntil = -1;
  const recent = []; // last raw estimates, for a median of three
  let pre = [];
  let preLen = 0;
  const PRE = Math.round(fs * PRE_ROLL);
  let take = null;
  const meters = new Set();

  const gate = (db) => Math.max(floorDb + db, rules.minDb);

  function estimate() {
    for (let i = 0; i < ringLen; i++) lin[i] = ring[(w + i) % ringLen];
    let s = 0;
    for (let i = 0; i < ringLen; i++) s += lin[i] * lin[i];
    const rms = Math.sqrt(s / ringLen);
    if (rms < 1e-5) return null;
    // The engine's live estimate ignores frames quieter than about -48 dBFS. Phone mics with
    // processing off can sit lower than that, so scale the window up first: the period it finds
    // doesn't depend on loudness, and loudness has its own gates here.
    const g = Math.min(40, 0.05 / rms);
    if (g > 1) for (let i = 0; i < ringLen; i++) lin[i] *= g;
    return livePitch(lin, fs);
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
      const e = muted ? null : estimate();
      const voiceLike = Boolean(e && e.cmnd < rules.voicing && e.rawF0 >= F0_MIN && e.rawF0 <= F0_MAX);
      const startOk = voiceLike && levelDb > gate(rules.startDb);
      if (voiceLike) {
        lastVoiceLike = n;
        lastVoiceLikeHz = e.rawF0;
      }
      // Loud sound counts as him only near his voice (a consonant, creak at a sentence end, a laugh).
      // Loud sound with no voice in it for loudHoldSec is the room: on the app's mic check (11-12) a
      // floor far under a noisy room called the room "talking", and every take ran to its limit.
      const loudOk = levelDb > gate(rules.loudDb) && n - lastVoiceLike < (rules.loudHoldSec ?? Infinity) * fs;
      const keepOk = !muted && ((voiceLike && levelDb > gate(rules.keepDb)) || loudOk);
      run = startOk ? run + 1 : 0;
      if (keepOk) lastActive = n;
      // The pip shows clean pitch only. An octave slip lasts one estimate; the median of three ignores it.
      const f0 = e?.f0 && levelDb > gate(rules.keepDb) ? e.f0 : 0;
      if (f0) {
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
    const active = n - lastActive < ACTIVE_HANG * fs;
    // The room level follows the quiet moments only: fast down, slow up. Never from anything
    // voice-like: under the old rules his own soft voice raised the floor mid-take, which raised the
    // gate over his voice and ended the take while he was still reading (11-12 phone run).
    const voiceNear = Boolean(rules.floorIgnoresVoice) && n - lastVoiceLike < ACTIVE_HANG * fs;
    if (!active && !muted && !voiceNear) {
      floorDb += (levelDb - floorDb) * (1 - Math.exp(-dt / (levelDb < floorDb ? 0.25 : 2.5)));
      if (roomDb !== null && rules.roomCapDb !== undefined) floorDb = Math.min(floorDb, roomDb + rules.roomCapDb);
    }

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
    rules,
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
      return gate(rules.startDb);
    },
    get pitch() {
      return pitch;
    },
    get active() {
      return n - lastActive < ACTIVE_HANG * fs;
    },
    get recording() {
      return Boolean(take?.started);
    },
    setFloor(db) {
      if (!Number.isFinite(db)) return;
      floorDb = Math.max(-90, Math.min(-25, db));
      roomDb = floorDb;
    },
    // Ignore the mic for a while: the target note plays through the speaker and would read as him.
    mute(ms) {
      muteUntil = Math.max(muteUntil, n + (ms / 1000) * fs);
      pitch = 0;
      run = 0;
      recent.length = 0;
    },
    get muted() {
      return n < muteUntil;
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
    // One take. It waits for his voice, keeps the half second before it, and ends at maxSec, or
    // once he has been quiet for silenceSec after at least minSec. With creakEndSec (the glide), it
    // also ends once he has slid at least dropSt semitones and then sat in creak that long: creak
    // never counts toward his floor, so holding it only makes him wait (11-12: ~3 s of fry at 80 Hz).
    capture({ maxSec, minSec = 1, silenceSec = 1.2, creakEndSec = 0, dropSt = 3, onStart } = {}) {
      let resolveFn;
      const done = new Promise((r) => (resolveFn = r));
      const chunks = [];
      let got = 0;
      let start = -1;
      let quietFrom = -1;
      let top = 0;
      let low = 0;
      let creak = 0; // samples of unbroken sound with no clean pitch
      let endedBy = null;
      const t = {
        started: false,
        waitFrom: n,
        feed(c, active) {
          if (!t.started) {
            pre.push(c);
            preLen += c.length;
            while (pre.length > 1 && preLen - pre[0].length >= PRE) preLen -= pre.shift().length;
            if (run < 2) return;
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
          if (creakEndSec > 0) {
            // Unbroken creak only: anything voice-like resets it (the engine's own voicing test, looser
            // than the clean pitch the pip needs). On his 11-12 glide the modal 80 Hz frames that set
            // his floor came between bursts of creak; counting creak across them ended the take
            // before them and moved his floor from 79 to 106 Hz.
            // Fry often reads as voice at 300 Hz and up (the formants ringing between pulses), so a
            // reading far above his lowest so far is not part of the glide, and doesn't reset it.
            if (pitch && (!low || pitch <= low * 1.6)) {
              top = Math.max(top, pitch);
              low = low ? Math.min(low, pitch) : pitch;
            }
            // Likewise far below it: fry's own pulses read as 30-60 Hz.
            const hi = Math.max(top, low * 1.6) * 1.1;
            const lo = low / 1.26;
            const voiced = n - lastVoiceLike < PITCH_EVERY * fs + c.length && (!low || (lastVoiceLikeHz <= hi && lastVoiceLikeHz >= lo));
            if (voiced) creak = 0;
            else if (active) creak += c.length;
          }
          const slid = low > 0 && semitones(top) - semitones(low) >= dropSt;
          const sat = creakEndSec > 0 && slid && got >= minSec * fs && creak >= creakEndSec * fs;
          const long = got >= maxSec * fs;
          const finished = got >= minSec * fs && quietFrom >= 0 && n - quietFrom >= silenceSec * fs;
          if (long || finished || sat) t.finish(sat ? 'creak' : finished ? 'pause' : 'max');
        },
        finish(why = 'stop') {
          if (take !== t) return;
          take = null;
          endedBy = why;
          resolveFn(concatChunks(chunks.length ? chunks : pre));
        },
      };
      take = t;
      return {
        done,
        stop: () => t.finish(),
        // how it ended: pause | max | creak | stop
        get endedBy() {
          return endedBy;
        },
        // the glide's creak count and range so far (seconds, Hz), for tests and tools
        get creak() {
          return { sec: creak / fs, top, low };
        },
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
