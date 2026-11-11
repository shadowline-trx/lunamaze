// The viral asset: a 9:16 before/after video with both takes' real audio, made on the phone.

const FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const F = (weight, px) => `${weight} ${px}px ${FONT}`;
const C = { bg0: '#07080b', bg1: '#141922', text: '#f3efe8', muted: '#8f98a8', dim: '#2a3140', accent: '#f2a33a', accent2: '#ffd08a', card: 'rgba(255,255,255,0.045)' };

export function pickVideoMime() {
  if (!window.MediaRecorder?.isTypeSupported) return '';
  const opts = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  return opts.find((m) => MediaRecorder.isTypeSupported(m)) || '';
}

// maxPhrases: the share video keeps only the first sentences so it stays short (~13 s).
export function trimToVoice(pcm, fs, m, maxPhrases = Infinity) {
  if (!m?.phrases?.length) return pcm;
  const last = m.phrases[Math.min(m.phrases.length, maxPhrases) - 1];
  const s = Math.max(0, Math.floor((m.phrases[0].startT - 0.2) * fs));
  const e = Math.min(pcm.length, Math.ceil((last.endT + 0.35) * fs));
  return e > s ? pcm.slice(s, e) : pcm;
}

export function peaks(pcm, cols) {
  const out = new Float32Array(cols);
  const step = pcm.length / cols;
  let mx = 0;
  for (let c = 0; c < cols; c++) {
    let m = 0;
    const s = Math.floor(c * step);
    const e = Math.floor((c + 1) * step);
    for (let i = s; i < e; i++) {
      const v = Math.abs(pcm[i]);
      if (v > m) m = v;
    }
    out[c] = m;
    if (m > mx) mx = m;
  }
  for (let c = 0; c < cols; c++) out[c] = mx ? Math.sqrt(out[c] / mx) : 0;
  return out;
}

export function waveformSvg(pcm, w, h, bars) {
  const p = peaks(pcm, bars);
  const bw = w / bars;
  let rects = '';
  for (let i = 0; i < bars; i++) {
    const bh = Math.max(2, p[i] * (h - 2));
    rects += `<rect x="${(i * bw + bw * 0.2).toFixed(1)}" y="${((h - bh) / 2).toFixed(1)}" width="${(bw * 0.6).toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bw * 0.3).toFixed(1)}"/>`;
  }
  return `<svg class="wave" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${rects}</svg>`;
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// hzValue / score null = hidden (the reveal comes when that clip plays).
function drawRow(g, x, y, w, h, label, hzValue, score, pk, progress, active) {
  roundRect(g, x, y, w, h, 28);
  g.fillStyle = active ? 'rgba(242,163,58,0.10)' : C.card;
  g.fill();
  if (active) {
    g.strokeStyle = C.accent;
    g.lineWidth = 3;
    g.stroke();
  }
  g.fillStyle = active ? C.accent2 : C.muted;
  g.font = F(700, 24);
  g.textBaseline = 'alphabetic';
  g.fillText(label, x + 36, y + 58);
  g.textAlign = 'right';
  g.fillStyle = C.text;
  g.font = F(700, 34);
  g.fillText(score === null ? '?' : score.toFixed(1), x + w - 92, y + 60);
  g.fillStyle = C.muted;
  g.font = F(600, 24);
  g.fillText('/10', x + w - 36, y + 60);
  g.textAlign = 'left';
  g.fillStyle = hzValue === null ? C.dim : C.text;
  g.font = F(800, 116);
  const hz = hzValue === null ? '???' : `${Math.round(hzValue)}`;
  g.fillText(hz, x + 32, y + 172);
  const hw = g.measureText(hz).width;
  g.fillStyle = C.muted;
  g.font = F(700, 40);
  g.fillText(' Hz', x + 32 + hw, y + 172);
  const bars = pk.length;
  const ww = w - 72;
  const bw = ww / bars;
  const cy = y + 236;
  for (let i = 0; i < bars; i++) {
    const bh = Math.max(4, pk[i] * 62);
    g.fillStyle = i / bars < progress ? C.accent : C.dim;
    roundRect(g, x + 36 + i * bw + bw * 0.18, cy - bh / 2, bw * 0.64, bh, Math.min(4, bw * 0.3));
    g.fill();
  }
}

function centerText(g, text, y, font, color, W) {
  g.font = font;
  g.fillStyle = color;
  g.textAlign = 'center';
  g.fillText(text, W / 2, y);
  g.textAlign = 'left';
}

function drawFrame(g, W, H, t, s) {
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, C.bg0);
  grd.addColorStop(1, C.bg1);
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);

  g.fillStyle = C.accent;
  g.font = F(800, 22);
  g.fillText(s.brand.toUpperCase().split('').join('\u2009'), 56, 104);
  g.fillStyle = C.text;
  g.font = F(800, 64);
  g.fillText('My voice, before', 56, 196);
  g.fillText('and after 60 seconds', 56, 270);

  const bActive = t >= s.tB && t < s.tB + s.bDur;
  const aActive = t >= s.tA && t < s.tA + s.aDur;
  const bProg = Math.max(0, Math.min(1, (t - s.tB) / s.bDur));
  const aProg = Math.max(0, Math.min(1, (t - s.tA) / s.aDur));
  // After row: hidden until its clip starts, then the number counts down to the measured value.
  const bHz = s.beforeM.f0Median;
  const aHz = s.afterM.f0Median;
  let aShown = null;
  let aScore = null;
  if (t >= s.tA) {
    const k = Math.min(1, (t - s.tA) / 1.4);
    const ease = 1 - (1 - k) ** 3;
    aShown = bHz + (aHz - bHz) * ease;
    aScore = k >= 1 ? s.afterM.scores.overall : null;
  }
  drawRow(g, 40, 360, W - 80, 300, 'BEFORE', bHz, s.beforeM.scores.overall, s.bPeaks, bProg, bActive);
  drawRow(g, 40, 700, W - 80, 300, 'AFTER 60 S', aShown, aScore, s.aPeaks, aProg, aActive);

  centerText(g, `Test yours free → ${s.host}`, 1160, F(700, 30), C.muted, W);

  if (t >= s.tOut) {
    const a = Math.min(1, (t - s.tOut) / 0.35);
    g.globalAlpha = a;
    g.fillStyle = C.bg0;
    g.fillRect(0, 0, W, H);
    const c = s.cmp;
    if (c.dSt <= -0.5) {
      centerText(g, Math.abs(c.dSt).toFixed(1), 560, F(800, 220), C.accent, W);
      centerText(g, 'semitones deeper', 640, F(700, 46), C.text, W);
    } else {
      centerText(g, `+${Math.max(0, c.dScore).toFixed(1)}`, 560, F(800, 220), C.accent, W);
      centerText(g, 'voice score', 640, F(700, 46), C.text, W);
    }
    centerText(g, `${Math.round(s.beforeM.f0Median)} → ${Math.round(s.afterM.f0Median)} Hz in 60 seconds`, 730, F(600, 34), C.muted, W);
    centerText(g, `Deeper than ${Math.round(s.afterM.deeperThanPct)}% of men`, 790, F(600, 34), C.muted, W);
    centerText(g, 'Test your voice free', 1060, F(800, 44), C.text, W);
    centerText(g, s.host, 1120, F(700, 36), C.accent, W);
    g.globalAlpha = 1;
  }
}

const W = 720;
const H = 1280;

function buildScene({ fs, before, after, beforeM, afterM, cmp, brand, host }) {
  const INTRO = 1.4;
  const GAP = 0.6;
  const OUTRO = 2.8;
  const bDur = before.length / fs;
  const aDur = after.length / fs;
  const s = { brand, host, cmp, beforeM, afterM, bPeaks: peaks(before, 56), aPeaks: peaks(after, 56), tB: INTRO, bDur, tA: INTRO + bDur + GAP, aDur };
  s.tOut = s.tA + s.aDur + 0.3;
  s.tEnd = s.tOut + OUTRO;
  return s;
}

// Stills of the share video at given times (or fractions of its length when <= 1 and `fractions`).
// Used by tests to check the video's look without decoding the video file.
export function renderShareFrames(opts, times, { fractions = false } = {}) {
  const s = buildScene(opts);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext('2d');
  return { duration: s.tEnd, frames: times.map((t) => (drawFrame(g, W, H, fractions ? t * s.tEnd : t, s), canvas.toDataURL('image/png'))) };
}

// Plays both takes into a MediaStream while drawing the canvas; real time (~13-16 s).
export async function makeShareVideo({ ctx, fs, before, after, beforeM, afterM, cmp, brand, host, onProgress }) {
  const mime = pickVideoMime();
  const canvas = document.createElement('canvas');
  if (!mime || !canvas.captureStream || !ctx.createMediaStreamDestination) throw new Error('video_unsupported');
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext('2d');
  const bBuf = ctx.createBuffer(1, before.length, fs);
  bBuf.copyToChannel(before, 0);
  const aBuf = ctx.createBuffer(1, after.length, fs);
  aBuf.copyToChannel(after, 0);
  const s = buildScene({ fs, before, after, beforeM, afterM, cmp, brand, host });

  const dest = ctx.createMediaStreamDestination();
  const vTrack = canvas.captureStream(30).getVideoTracks()[0];
  const stream = new MediaStream([vTrack, ...dest.stream.getAudioTracks()]);
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 3_500_000, audioBitsPerSecond: 128_000 });
  const chunks = [];
  rec.ondataavailable = (e) => e.data?.size && chunks.push(e.data);
  const stopped = new Promise((r) => (rec.onstop = r));
  drawFrame(g, W, H, 0, s);
  await ctx.resume();
  rec.start(250);
  const t0 = ctx.currentTime + 0.1;
  const sb = ctx.createBufferSource();
  sb.buffer = bBuf;
  sb.connect(dest);
  sb.start(t0 + s.tB);
  const sa = ctx.createBufferSource();
  sa.buffer = aBuf;
  sa.connect(dest);
  sa.start(t0 + s.tA);
  await new Promise((resolve) => {
    const loop = () => {
      const t = Math.max(0, ctx.currentTime - t0);
      drawFrame(g, W, H, t, s);
      onProgress?.(Math.min(1, t / s.tEnd));
      if (t >= s.tEnd) resolve();
      else requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  rec.stop();
  await stopped;
  vTrack.stop();
  return new Blob(chunks, { type: mime.split(';')[0] });
}

export async function shareOrDownload(blob, name, text) {
  const file = new File([blob], name, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return 'shared';
    } catch (e) {
      if (e?.name === 'AbortError') return 'cancelled';
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return 'downloaded';
}
