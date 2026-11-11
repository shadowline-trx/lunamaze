// Mic capture -> Float32 chunks at the AudioContext rate. Plus playback and the target tone.
import { concatChunks } from '../engine/dsp.js';
import { decodeWav } from './wav.js';

const WORKLET = `class DvTap extends AudioWorkletProcessor{process(i){const c=i[0]&&i[0][0];if(c)this.port.postMessage(c.slice(0));return true}}registerProcessor('dv-tap',DvTap);`;

// Which kind of mic a track label names. Gate 1 sends only this, never the label itself:
// Bluetooth labels often carry the owner's name ("Arun's AirPods").
// Chrome on Android names the phone's own mic "Headset earpiece" or "Speakerphone".
export function micKind(label) {
  if (!label) return null;
  if (/earpiece|speakerphone|built-?in|internal|iphone|ipad|microphone array|\b(front|back|bottom|top)\b/i.test(label)) return 'built-in';
  if (/bluetooth|airpods|buds|hands-?free|beats|jabra|bose|\bbt\b/i.test(label)) return 'bluetooth';
  if (/wired|headset|headphone|earphone|usb|line.?in|external/i.test(label)) return 'wired';
  if (/^default\b/i.test(label)) return 'default';
  return 'other';
}

function makeHub() {
  const subs = new Set();
  return {
    emit(chunk) {
      for (const fn of subs) fn(chunk);
    },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}

// ctxIn: an AudioContext made inside the tap that started the test (iPhone Safari needs that).
export async function openMic(ctxIn = null) {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('no_mic_api');
  // Raw signal: echo cancellation, noise suppression and auto gain all bend pitch and resonance.
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 },
  });
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = ctxIn || new Ctx();
  await ctx.resume();
  const source = ctx.createMediaStreamSource(stream);
  const hub = makeHub();
  let node;
  if (ctx.audioWorklet && window.AudioWorkletNode) {
    const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }));
    await ctx.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);
    node = new AudioWorkletNode(ctx, 'dv-tap');
    node.port.onmessage = (e) => hub.emit(e.data);
  } else {
    node = ctx.createScriptProcessor(2048, 1, 1);
    node.onaudioprocess = (e) => hub.emit(e.inputBuffer.getChannelData(0).slice(0));
  }
  const sink = ctx.createGain();
  sink.gain.value = 0;
  source.connect(node);
  node.connect(sink);
  sink.connect(ctx.destination);
  // Which kind of mic the browser gave us, and whether it honoured "no processing" (Gate 1 checks both).
  const t0 = stream.getAudioTracks()[0];
  const s = t0?.getSettings?.() || {};
  return {
    fake: false,
    ctx,
    kind: micKind(t0?.label),
    settings: { echoCancellation: s.echoCancellation ?? null, noiseSuppression: s.noiseSuppression ?? null, autoGainControl: s.autoGainControl ?? null, sampleRate: s.sampleRate ?? null, channelCount: s.channelCount ?? null },
    sampleRate: ctx.sampleRate,
    subscribe: hub.subscribe,
    async setSource() {},
    close() {
      stream.getTracks().forEach((t) => t.stop());
      ctx.close();
    },
  };
}

// Test double: streams fixture WAVs in real time (x speed) as if they came from the mic.
// The "room" source is a quiet room (faint noise, about -70 dBFS), made here rather than stored.
export async function openFakeMic(base, speed = 1, ctxIn = null) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = ctxIn || new Ctx();
  await ctx.resume();
  const hub = makeHub();
  const cache = new Map();
  let cur = null;
  let pos = 0;
  const load = async (slot) => {
    if (!cache.has(slot)) {
      if (slot === 'room') {
        const fs = cache.get('before')?.fs || 16000;
        const pcm = new Float32Array(fs * 2);
        for (let i = 0; i < pcm.length; i++) pcm[i] = (Math.random() - 0.5) * 0.0011;
        cache.set(slot, { pcm, fs });
        return cache.get(slot);
      }
      const r = await fetch(`${base}/${slot}.dat`);
      if (!r.ok) throw new Error(`fixture ${slot} missing`);
      cache.set(slot, decodeWav(await r.arrayBuffer()));
    }
    return cache.get(slot);
  };
  const first = await load('before');
  const timer = setInterval(() => {
    if (!cur) return;
    const n = Math.round(cur.fs * 0.05 * speed);
    for (let k = 0; k < n; k += 2048) {
      const len = Math.min(2048, n - k);
      const chunk = new Float32Array(len);
      for (let i = 0; i < len; i++) chunk[i] = cur.pcm[pos++ % cur.pcm.length];
      hub.emit(chunk);
    }
  }, 50);
  return {
    fake: true,
    ctx,
    sampleRate: first.fs,
    subscribe: hub.subscribe,
    async setSource(slot) {
      cur = await load(slot);
      pos = 0;
    },
    close() {
      clearInterval(timer);
      ctx.close();
    },
  };
}

function chunkRms(c) {
  let s = 0;
  for (let i = 0; i < c.length; i++) s += c[i] * c[i];
  return Math.sqrt(s / Math.max(1, c.length));
}

// Records `seconds` of audio. Returns { done: Promise<Float32Array>, stop() }.
export function recordTake(mic, { seconds, slot, speed = 1, onLevel, onProgress }) {
  const chunks = [];
  let stopped = false;
  let unsub = null;
  let raf = 0;
  let resolveFn;
  const done = new Promise((r) => (resolveFn = r));
  const finish = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    unsub?.();
    resolveFn(concatChunks(chunks));
  };
  (async () => {
    if (mic.fake) await mic.setSource(slot);
    const start = performance.now();
    unsub = mic.subscribe((c) => {
      if (stopped) return;
      chunks.push(c);
      onLevel?.(chunkRms(c));
    });
    const tick = () => {
      if (stopped) return;
      const el = ((performance.now() - start) / 1000) * speed;
      onProgress?.(Math.min(1, el / seconds), el);
      if (el >= seconds) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  })();
  return { done, stop: finish };
}

export function playPcm(ctx, pcm, fs, onEnd) {
  const buf = ctx.createBuffer(1, pcm.length, fs);
  buf.copyToChannel(pcm, 0);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.onended = () => onEnd?.();
  ctx.resume().then(() => src.start());
  return () => {
    try {
      src.stop();
    } catch {
      /* already stopped */
    }
  };
}

// Soft hum-like tone at the target pitch.
export function playTone(ctx, hz, seconds = 2.2) {
  const t = ctx.currentTime + 0.03;
  const out = ctx.createGain();
  out.gain.setValueAtTime(0, t);
  out.gain.linearRampToValueAtTime(0.22, t + 0.12);
  out.gain.setValueAtTime(0.22, t + seconds - 0.3);
  out.gain.linearRampToValueAtTime(0, t + seconds);
  out.connect(ctx.destination);
  const parts = [
    [1, 1],
    [2, 0.35],
    [3, 0.12],
  ];
  for (const [mult, level] of parts) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = hz * mult;
    g.gain.value = level;
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + seconds + 0.05);
  }
}
