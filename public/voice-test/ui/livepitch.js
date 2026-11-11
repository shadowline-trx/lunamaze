// Live pitch line with the green target band, for the 60-second reset.
import { livePitch } from '../engine/pitch.js';

const COLORS = { band: 'rgba(95, 211, 154, 0.14)', bandEdge: 'rgba(95, 211, 154, 0.55)', line: '#f2a33a', good: '#5fd39a', label: 'rgba(243, 239, 232, 0.55)' };

export function startLivePitch(mic, canvas, { targetHz, lowHz, highHz, onStats, windowSec = 6 }) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cssW = canvas.clientWidth || 320;
  const cssH = canvas.clientHeight || 160;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const g = canvas.getContext('2d');
  g.scale(dpr, dpr);

  const fs = mic.sampleRate;
  const ringLen = Math.round(fs * 0.08);
  const ring = new Float32Array(ringLen);
  const lin = new Float32Array(ringLen);
  let w = 0;
  let filled = 0;
  const unsub = mic.subscribe((c) => {
    for (let i = 0; i < c.length; i++) {
      ring[w] = c[i];
      w = (w + 1) % ringLen;
    }
    filled = Math.min(ringLen, filled + c.length);
  });

  const pts = [];
  let voiced = 0;
  let inBand = 0;
  const t0 = performance.now();
  const timer = setInterval(() => {
    if (filled < ringLen) return;
    for (let i = 0; i < ringLen; i++) lin[i] = ring[(w + i) % ringLen];
    const { f0 } = livePitch(lin, fs);
    const t = (performance.now() - t0) / 1000;
    pts.push({ t, f0 });
    while (pts.length && pts[0].t < t - windowSec - 0.5) pts.shift();
    if (f0) {
      voiced++;
      if (f0 >= lowHz && f0 <= highHz) inBand++;
    }
    onStats?.({ f0, inBandPct: voiced ? inBand / voiced : 0 });
  }, 50);

  const yOf = (hz) => {
    const st = 12 * Math.log2(hz / targetHz);
    return Math.max(4, Math.min(cssH - 4, cssH / 2 - (st / 7) * (cssH / 2 - 8)));
  };
  let raf = 0;
  const draw = () => {
    g.clearRect(0, 0, cssW, cssH);
    const yHi = yOf(highHz);
    const yLo = yOf(lowHz);
    g.fillStyle = COLORS.band;
    g.fillRect(0, yHi, cssW, yLo - yHi);
    g.strokeStyle = COLORS.bandEdge;
    g.lineWidth = 1;
    g.setLineDash([4, 6]);
    g.beginPath();
    g.moveTo(0, yOf(targetHz));
    g.lineTo(cssW, yOf(targetHz));
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = COLORS.label;
    g.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    g.fillText(`TARGET ${Math.round(targetHz)} Hz`, 10, Math.max(14, yHi - 8));

    const now = (performance.now() - t0) / 1000;
    g.lineWidth = 3;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.strokeStyle = COLORS.line;
    g.beginPath();
    let pen = false;
    for (const p of pts) {
      const x = cssW - 10 - ((now - p.t) / windowSec) * (cssW - 10);
      if (!p.f0 || x < 0) {
        pen = false;
        continue;
      }
      const y = yOf(p.f0);
      if (pen) g.lineTo(x, y);
      else g.moveTo(x, y);
      pen = true;
    }
    g.stroke();
    const last = pts[pts.length - 1];
    if (last?.f0) {
      g.fillStyle = last.f0 >= lowHz && last.f0 <= highHz ? COLORS.good : COLORS.line;
      g.beginPath();
      g.arc(cssW - 10, yOf(last.f0), 6, 0, Math.PI * 2);
      g.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  return {
    stop() {
      clearInterval(timer);
      cancelAnimationFrame(raf);
      unsub();
      return { inBandPct: voiced ? inBand / voiced : 0, voiced };
    },
  };
}
