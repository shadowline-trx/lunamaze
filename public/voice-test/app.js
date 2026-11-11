// The free voice test, in design v3 "Resonance on a watch dial" (silver):
// welcome -> room check -> read -> mm-hmm -> glide -> measuring -> result -> 60-second reset ->
// read again -> before/after -> offer, or on a tester link (Gate 1) consent and upload.
// The dial is the instrument on every screen: his loudness rings the grains, his pitch moves the pip
// and sets the figure, and inside his target arc the figure locks and lights.
import { openMic, openFakeMic, playPcm, playTone } from './audio/recorder.js';
import { encodeWav } from './audio/wav.js';
import { analyzeSpeech, analyzeHum, analyzeGlide, targetPitch } from './engine/analyze.js';
import { compareTakes } from './engine/compare.js';
import { semitones } from './engine/dsp.js';
import { dialHtml, FIG, figForHz } from './ui/dial.js';
import { placeDial, mountAt, centerSheen, still, form, driveLive, drivePlayback, demoLoop, ticker, follow } from './ui/live.js';
import { frames, odometer, countTo, reveal, SPRING_POP, easeInOut } from './ui/motion.js';
import { createEar } from './ui/voice.js';
import { synth } from './ui/demo.js';
import { makeShareVideo, renderShareFrames, shareOrDownload, trimToVoice } from './ui/share.js';
import { lab } from './lab/store.js';
import { renderLab, renderListen } from './lab/lab.js';
import { gate1, consentScreen, upload, sendingScreen, sendFailedScreen, thanksScreen } from './lab/gate1.js';
import { CONFIG } from './config.js';
import { track } from './track.js';

const params = new URLSearchParams(location.search);
const FAKE = params.has('fake');
// Test runs only (fixture mic): fast = 10x, speed=N for screenshots that need each screen to stay a moment.
const SPEED = FAKE ? clampSpeed(Number(params.get('speed')) || (params.has('fast') ? 10 : 1)) : 1;
function clampSpeed(v) {
  return Math.max(1, Math.min(10, v));
}
const VS_RAW = Number(params.get('vs'));
const VS = VS_RAW >= 50 && VS_RAW <= 300 ? Math.round(VS_RAW) : null;
if (params.has('lab')) lab.setEnabled(true);

const PASSAGE = ['Good morning.', 'I’m here, and I’m ready.', 'We run the plan, and we win.', 'Remember my name.'];
const CONTEXTS = [
  ['Calls', 'on calls'],
  ['Meetings', 'in meetings'],
  ['Dates', 'on dates'],
  ['Videos', 'on video'],
  ['Arguments', 'in arguments'],
];
// A room is quiet enough when its loud moments stay under this (dBFS, processing off). A first
// guess: the levels of every tester's room go to Gate 1, which is where it gets calibrated.
const ROOM_QUIET_DB = -40;

const state = { mic: null, ear: null, room: null, takes: {}, res: {}, target: null, floorHz: null, context: null, retried: false, tester: '', cmp: null, video: null, videoJob: null, labId: null };

const app = document.getElementById('app');
const $ = (s) => app.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const wait = (ms) => sleep(ms / SPEED); // pauses in the flow (short in the fast test mode)
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
const sec = (s) => s / SPEED;
const hz = (v) => Math.round(v);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const I = {
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
  play: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/></svg>',
  close: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  today: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>',
  phone: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/></svg>',
  figure: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5L20.5 12 12 20.5 3.5 12z"/><circle cx="12" cy="12" r="2.6"/></svg>',
};

const lines = (arr) => arr.map((t) => `<span class="ml"><span>${t}</span></span>`).join('');
const stepsBar = (n, on) => `<div class="steps" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i class="${i < on ? 'done' : i === on ? 'on' : ''}"></i>`).join('')}</div>`;
const ck = (cls = '') => `<i class="ck ${cls}">${I.check}</i>`;

// Every render starts a new screen; loops from the old one see alive() turn false and stop.
let seq = 0;
let stopPlayback = null;
function render(html) {
  seq++;
  stopPlayback?.();
  stopPlayback = null;
  app.innerHTML = html;
  window.scrollTo(0, 0);
  const my = seq;
  const items = app.querySelectorAll('.rise, .ml');
  requestAnimationFrame(() => reveal(items, { stagger: Math.min(60, 420 / Math.max(1, items.length)) }));
  const h = app.querySelector('h1, h2');
  if (h) {
    h.tabIndex = -1;
    h.focus({ preventScroll: true });
  }
  return () => my === seq;
}

async function swapText(el, text) {
  if (!el || el.textContent === text) return;
  el.classList.add('out');
  await sleep(160);
  el.textContent = text;
  el.classList.remove('out');
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

// The bezel's ticks as a level meter (room check, and while a take waits for his voice).
function meter(d) {
  const tks = [...d.el.querySelectorAll('.tk')];
  let lv = 0;
  return (dt, db) => {
    lv = follow(lv, clamp((db + 72) / 48, 0, 1), dt, 14);
    const n = Math.round(lv * tks.length);
    tks.forEach((l, i) => l.classList.toggle('lv', i < n));
    return lv;
  };
}

// ---------- welcome ----------

function intro() {
  track('intro_view', { vs: VS, lab: lab.enabled() });
  const askName = lab.enabled() || (gate1.on && !gate1.prolific);
  const alive = render(`<section class="screen c intro">
    <div class="wm rise">${esc(CONFIG.brand)}</div>
    ${VS ? `<div class="chip rise m12">A friend hit <b>${VS} Hz</b>. Can you go deeper?</div>` : ''}
    ${gate1.on ? '<div class="chip rise m12">Tester link · thank you for helping</div>' : ''}
    <div class="stage" data-dial><div class="dial-host"></div><div class="lab hi rise w-cap m10" aria-hidden="true">An everyday voice</div></div>
    <h1 class="h1 m10">${lines(['Your voice', 'has a shape.'])}</h1>
    <p class="lead rise m12">Read one line. Watch it settle.<br>Then find out how deep it goes.</p>
    ${askName ? `<label class="field rise m18"><span>${gate1.on ? 'Your first name or a nickname (optional)' : 'Tester name (lab)'}</span><input id="tester" autocomplete="off" autocapitalize="words" placeholder="e.g. Arun" value="${esc(state.tester)}"></label>` : ''}
    <button class="btn rise m20" id="go">Begin <span class="sub">· 2 minutes</span></button>
    <p class="fine rise m12">${gate1.on ? 'Measured on your phone. You choose what to send at the end.' : 'Measured on your phone. Nothing is uploaded.'}</p>
  </section>`);
  const d = placeDial($('[data-dial]'), { maxR: 128, fig: FIG.busy, seed: 3 });
  centerSheen(d.el);
  demoLoop(d, $('.w-cap'), { alive, synth });
  $('#go').onclick = () => {
    state.tester = $('#tester')?.value.trim() || '';
    // iPhone Safari lets a page start audio only inside the tap itself, so the audio clock starts here.
    let ctx = null;
    if (!state.mic) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      ctx = new Ctx();
      ctx.resume?.().catch(() => {});
    }
    run(ctx).catch((e) => {
      console.error(e);
      errorScreen('crash').then(intro);
    });
  };
}

// ---------- room check ----------

const ERRORS = {
  mic_denied: ['We need your mic', 'Allow microphone access for this page in your browser settings, then try again.'],
  mic_silent: ['We can’t hear your mic', 'Another app may be using it. Close it, then try again.'],
  too_little_voice: ['We couldn’t hear enough voice', 'Hold the phone 20 to 30 cm away and read the whole line out loud.'],
  noisy: ['Too much background noise', 'Find a quieter spot and try again.'],
  clipped: ['Too loud for the mic', 'Hold the phone a little further away and try again.'],
  crash: ['Something went wrong', 'Reload the page and try again.'],
};

function withTimeout(p, ms) {
  return Promise.race([p, sleep(ms).then(() => null)]);
}

function roomScreen() {
  const ear = state.ear;
  if (state.mic.fake) state.mic.setSource('room');
  return new Promise((resolve) => {
    const alive = render(`<section class="screen room">
      <div class="lab hi rise">Before we listen</div>
      <h2 class="h2 m12">${lines(['Find a quiet spot.'])}</h2>
      <p class="lead rise m10">We check the room first, so every number you see is real.</p>
      <div class="stage" data-dial><div class="dial-host"></div><div class="c-col m16" role="status"><div class="h2 rm-w swap">Listening</div><div class="lab rm-s m6 swap">to the room</div></div></div>
      <button class="btn off m16" id="go" disabled>Continue</button>
      <p class="fine tc m12">Not medical advice. Stop if your throat feels tight, sore or hoarse.</p>
    </section>`);
    const d = placeDial($('[data-dial]'), { maxR: 128, numerals: false, fig: FIG.busy, seed: 5, settle: false });
    centerSheen(d.el);
    d.el.querySelector('.bz-pip').style.opacity = '0';
    d.plate.energy = 0;
    d.plate.bright = d.plate.brightTo = 0.4;
    const tick = ticker(d);
    const lvOf = meter(d);
    frames((dt) => {
      if (!alive()) return false;
      // A quiet room: the sand lies flat and faint. Noise lifts it, brightens it and makes it jump.
      const lv = lvOf(dt, ear.levelDb);
      d.plate.shake = Math.max(0, lv - 0.2) * 1.6;
      d.plate.brightTo = 0.4 + 0.6 * Math.min(1, lv * 1.4);
      d.plate.alpha = 0.22 + 0.78 * clamp((lv - 0.12) * 1.6, 0, 1);
      tick(dt);
      return true;
    });
    const word = $('.rm-w');
    const sub = $('.rm-s');
    const btn = $('#go');
    const t0 = performance.now();
    let last = null;
    let shown = '';
    let noisySince = 0;
    const enable = (label) => {
      btn.disabled = false;
      btn.classList.remove('off');
      btn.textContent = label;
    };
    (async () => {
      let retried = false;
      while (alive()) {
        const r = await withTimeout(ear.measure(1.5), 4000);
        if (!alive()) return;
        if (!r) {
          // No audio is reaching the page. Wake the audio clock once, then give up.
          if (!retried && state.mic.ctx?.resume) {
            retried = true;
            state.mic.ctx.resume().catch(() => {});
            continue;
          }
          track('mic_silent');
          resolve('silent');
          return;
        }
        last = r;
        const quiet = r.p90Db < ROOM_QUIET_DB;
        if (quiet) {
          ear.setFloor(r.floorDb);
          noisySince = 0;
          if (shown !== 'quiet') {
            shown = 'quiet';
            swapText(word, 'Quiet');
            swapText(sub, 'Ready to listen');
            enable('Continue');
          }
        } else {
          noisySince ||= performance.now();
          if (shown !== 'noisy') {
            shown = 'noisy';
            swapText(word, 'Too noisy');
            swapText(sub, 'A TV or a voice nearby? Move somewhere quieter and we’ll wait.');
            btn.disabled = true;
            btn.classList.add('off');
            btn.textContent = 'Continue';
          }
          if (performance.now() - noisySince > 5000 && btn.disabled) enable('Continue anyway');
        }
      }
    })();
    btn.onclick = () => {
      state.room = last && { floorDb: Math.round(last.floorDb * 10) / 10, p90Db: Math.round(last.p90Db * 10) / 10, quiet: last.p90Db < ROOM_QUIET_DB, waitedSec: Math.round((performance.now() - t0) / 100) / 10 };
      if (last) ear.setFloor(last.floorDb);
      track('room_check', state.room || {});
      resolve('ok');
    };
  });
}

// ---------- a take: he starts talking, it listens, it stops when he is done ----------

const WORDS = PASSAGE.flatMap((s, si) => s.split(' ').map((w, wi, all) => ({ w, si, end: wi === all.length - 1 })));
// When each word lights in the pace guide: a calm reading pace with a short rest between sentences.
const WORD_AT = (() => {
  let t = 0.15;
  return WORDS.map((x) => {
    const at = t;
    t += x.end ? 0.72 : 0.36;
    return at;
  });
})();

function takeScreen(o) {
  const ear = state.ear;
  return new Promise((resolve) => {
    const words = WORDS.map((x) => `<span class="w">${esc(x.w)}</span>`).join(' ');
    const alive = render(`<section class="screen rec" data-slot="${o.slot}">
      <div class="row sb rise"><span class="lab hi">${o.kicker}</span>${o.steps ?? ''}</div>
      <h2 class="h2 m16">${lines(o.title)}</h2>
      ${o.passage ? `<div class="passage rise m16" aria-label="${esc(PASSAGE.join(' '))}">${words}</div>` : `<p class="lead rise m10">${o.lead}</p>`}
      <div class="stage" data-dial><div class="dial-host"></div>${o.floor ? '' : `<span class="chip rd-st m6" role="status"><span class="rd-dot"></span><span class="rd-t swap">${o.cue}</span></span>`}</div>
      ${o.floor ? `<div class="c-col" role="status"><div class="big fl-n" style="font-size:64px"><span class="fl">–</span><span class="unit">Hz</span></div><div class="lab fl-l m10 swap">${o.cue}</div></div>` : ''}
      <p class="fine tc rise m14">${o.fine || 'Hold the phone 20 to 30 cm away.'}</p>
    </section>`);
    const section = $('.screen');
    if (state.mic.fake) state.mic.setSource(o.slot);
    const d = placeDial($('[data-dial]'), { maxR: o.floor ? 116 : 120, fig: FIG.lattice, seed: 11 });
    centerSheen(d.el);
    const target = o.target ? state.target : null;
    const ws = [...app.querySelectorAll('.passage .w')];
    const chipT = $('.rd-t');
    const flN = $('.fl');
    const flL = $('.fl-l');
    const lvOf = meter(d);
    let firstHz = 0;
    let minHz = 0;
    let lastText = 0;
    let hinted = false;
    const cap = ear.capture({
      maxSec: o.maxSec,
      minSec: o.minSec,
      silenceSec: o.silenceSec,
      onStart: () => {
        track('take_start', { slot: o.slot });
        section.classList.add('recording');
        d.el.querySelectorAll('.tk.lv').forEach((l) => l.classList.remove('lv'));
        if (flL) swapText(flL, 'your comfortable low');
      },
    });
    const live = driveLive(d, ear, {
      target,
      ghost: o.ghost || 0,
      alive,
      onFrame: (dt, { hz: h, p }) => {
        if (!cap.started) {
          lvOf(dt, ear.levelDb);
          if (!hinted && cap.waited > 10) {
            hinted = true;
            swapText(chipT || flL, o.passage ? 'We can’t hear you yet. Read it out loud.' : 'We can’t hear you yet. Try a little louder.');
          }
          return;
        }
        const el = cap.elapsed;
        if (!o.floor) d.prog(el / o.maxSec);
        if (ws.length) {
          let k = 0;
          while (k < WORD_AT.length && WORD_AT[k] <= el) k++;
          for (let i = 0; i < ws.length; i++) ws[i].classList.toggle('lit', i < k);
        }
        const now = performance.now();
        if (chipT && now - lastText > 200) {
          lastText = now;
          const txt = `Listening · 0:${String(Math.max(0, Math.ceil(o.maxSec - el))).padStart(2, '0')}`;
          if (chipT.textContent !== txt) chipT.textContent = txt; // a new text node re-lays the stage
        }
        if (flN && p && h) {
          // His running low on the glide: the pip has settled by then, so no first-frame jump.
          firstHz ||= h;
          if (el > 0.4) minHz = minHz ? Math.min(minHz, h) : h;
          if (minHz) {
            d.trail(firstHz, minHz);
            if (now - lastText > 90) {
              lastText = now;
              flN.textContent = hz(minHz);
            }
          }
        }
      },
    });
    cap.done.then(async (pcm) => {
      track('take_done', { slot: o.slot, sec: Math.round((pcm.length / state.mic.sampleRate) * 10) / 10 });
      section.classList.remove('recording');
      ws.forEach((w) => w.classList.add('lit'));
      if (!o.floor) d.prog(1);
      live.stop();
      d.plate.energy = 0;
      d.plate.draw();
      if (o.analyze && chipT) chipT.textContent = 'Checking…';
      await nextFrame();
      await nextFrame();
      const m = o.analyze ? o.analyze(pcm) : null;
      if (!alive()) return;
      if (m && m.ok === false && !o.floor) return resolve({ pcm, m });
      if (o.floor) {
        const f = m?.ok ? m.floorHz : 0;
        if (f) {
          flN.textContent = hz(f);
          flN.classList.add('lume-t');
          d.ghost(f);
          d.plate.to(...figForHz(f));
          d.plate.tintTo = 1;
          d.lit(true);
          const t = ticker(d);
          frames((dt, tt) => {
            if (!alive()) return false;
            d.plate.energy = tt < 1.2 ? 0.5 * (1 - tt / 1.2) : 0;
            t(dt);
            return tt < 1.5;
          });
          flN.parentElement.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.07)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.34,1.56,.64,1)' });
          swapText(flL, 'your comfortable low · saved');
        } else swapText(flL, 'We couldn’t find it this time. That’s fine.');
        await wait(1700);
      } else {
        const chip = $('.rd-st');
        if (chip) chip.innerHTML = `${I.check}<span>Got it</span>`;
        await wait(650);
      }
      if (alive()) resolve({ pcm, m });
    });
  });
}

const TAKES = {
  before: { slot: 'before', kicker: 'Your normal voice', steps: stepsBar(3, 0), title: ['Read it the way', 'you normally talk.'], passage: true, cue: 'Start reading when you’re ready', maxSec: 10, minSec: 6, silenceSec: 1.3 },
  mmhmm: { slot: 'mmhmm', kicker: 'Agree out loud', steps: stepsBar(3, 1), title: ['Say “mm-hmm”', 'twice.'], lead: 'The way you’d agree with someone.', cue: 'Say it when you’re ready', maxSec: 3, minSec: 1.5, silenceSec: 0.9 },
  glide: { slot: 'glide', kicker: 'Find your floor', steps: stepsBar(3, 2), title: ['Glide down to', 'your lowest note.'], lead: 'Say “aaah” and slide down. Gentle. Never push.', cue: 'Start when you’re ready', floor: true, maxSec: 5, minSec: 2, silenceSec: 0.8, fine: 'If it feels tight, stop there. That’s your floor.' },
  after: { slot: 'after', kicker: 'Your deeper voice', title: ['Same line.', 'Start from the hum.'], passage: true, target: true, cue: 'Start reading when you’re ready', maxSec: 10, minSec: 6, silenceSec: 1.3, fine: 'Same distance as before: 20 to 30 cm.' },
  after2: { slot: 'after2', kicker: 'One more try', title: ['Slower.', 'Let each sentence land low.'], passage: true, target: true, cue: 'Start reading when you’re ready', maxSec: 10, minSec: 6, silenceSec: 1.3, fine: 'Same distance as before: 20 to 30 cm.' },
};

// ---------- measuring ----------

async function measuringScreen() {
  const b = state.res.before;
  const rowsTxt = ['Pitch', 'Resonance', 'Sentence endings', 'Steadiness'];
  const alive = render(`<section class="screen c measure">
    <div class="stage" data-dial><div class="dial-host"></div>
      <div class="lab hi ms-cap m20 swap" role="status">Measuring your voice</div>
      <div class="well ms rise m16 stretch">${rowsTxt.map((r) => `<div class="ms-r"><span>${r}</span>${ck()}</div>`).join('')}</div>
    </div>
  </section>`);
  const d = placeDial($('[data-dial]'), { maxR: 112, numerals: false, fig: FIG.busy, seed: 17 });
  centerSheen(d.el);
  d.el.querySelector('.bz-pip').style.opacity = '0';
  const rows = [...app.querySelectorAll('.ms-r')];
  const cap = $('.ms-cap');
  const order = [FIG.busy, FIG.locked, FIG.lattice, FIG.flower, FIG.mandala, FIG.rings];
  const mine = figForHz(b.f0Median);
  const K = SPEED > 1 ? 4 : 1;
  const tick = ticker(d);
  let k = -1;
  let settling = false;
  // The numbers are already in: this is about two seconds of his figure settling, not a fake wait.
  await frames((dt, T) => {
    if (!alive()) return false;
    const t = T * K;
    if (t < 1.3) {
      const i = Math.floor(t / 0.3);
      if (i !== k) {
        k = i;
        d.plate.to(...order[i % order.length]);
      }
      d.plate.energy = 0.95;
    } else {
      if (!settling) {
        settling = true;
        d.plate.to(...mine);
        swapText(cap, 'Your shape is settling');
      }
      d.plate.energy = t < 2.8 ? 0.8 * Math.min(1, (2.8 - t) / 0.8) : 0;
    }
    d.prog(Math.min(1, t / 1.4));
    rows.forEach((r, i) => {
      const t0 = 0.15 + i * 0.3;
      r.classList.toggle('run', t > t0 && t < t0 + 0.28);
      if (t >= t0 + 0.28 && !r.classList.contains('done')) {
        r.classList.add('done');
        r.querySelector('.ck').classList.add('on');
      }
    });
    tick(dt);
    return t < 2.9;
  });
  if (!alive()) return;
  swapText(cap, 'Done');
  await wait(600);
}

// ---------- result ----------

function subdial(label, v) {
  const S = 66;
  const c = 33;
  const r = 29;
  let t = '';
  for (let i = 0; i <= 10; i++) {
    const a = ((-120 + i * 24) * Math.PI) / 180;
    const mj = i % 5 === 0;
    const r1 = r - (mj ? 7 : 4.5);
    const r2 = r - 1.5;
    t += `<line class="t2${mj ? ' mj' : ''}" x1="${(c + r1 * Math.sin(a)).toFixed(1)}" y1="${(c - r1 * Math.cos(a)).toFixed(1)}" x2="${(c + r2 * Math.sin(a)).toFixed(1)}" y2="${(c - r2 * Math.cos(a)).toFixed(1)}"/>`;
  }
  return `<div class="sd" data-v="${v}"><svg viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" aria-hidden="true"><circle class="face" cx="${c}" cy="${c}" r="${r + 2}"/>${t}
    <g class="ndg" style="transform-origin:${c}px ${c}px;transform:rotate(-120deg)"><line class="nd" x1="${c}" y1="${c + 5}" x2="${c}" y2="${c - r + 6}"/></g><circle class="cap" cx="${c}" cy="${c}" r="3"/></svg>
    <b>0.0</b><span>${label}</span></div>`;
}

function resultScreen() {
  const b = state.res.before;
  const floor = state.floorHz;
  const gapSt = floor ? semitones(b.f0Median) - semitones(floor) : null;
  const findings = [];
  if (gapSt !== null && gapSt >= 3) findings.push(`You talk <b>${gapSt.toFixed(1)} semitones</b> above your comfortable low. The depth is there.`);
  else findings.push('You already talk close to your low notes. Your gain is resonance: a darker, fuller sound.');
  if (b.phraseCount && b.risingCount) findings.push(`<b>${b.risingCount} of ${b.phraseCount}</b> sentences ended going up. It reads as asking, not telling.`);
  else if (b.phraseCount) findings.push('Your sentences land low at the end. Keep that.');
  findings.push(b.scores.resonance < 6 ? `Resonance <b>${b.scores.resonance.toFixed(1)}</b>. The sound sits high and light.` : `Resonance <b>${b.scores.resonance.toFixed(1)}</b>. Good chest. It can carry more.`);
  if (b.fryPct > 0.15) findings.push(`<b>${Math.round(b.fryPct * 100)}%</b> of your voice was creak (vocal fry). It sounds low, but it isn’t depth.`);
  track('diagnosis_view', { score: b.scores.overall, f0: hz(b.f0Median), gapSt: gapSt && Math.round(gapSt * 10) / 10 });
  const s = b.scores;
  const R = window.innerWidth < 370 ? 50 : 60;
  return new Promise((resolve) => {
    const alive = render(`<section class="screen diag">
      <div class="row" style="align-items:flex-start;gap:4px">
        <div style="flex:1;min-width:0;padding-top:8px">
          <div class="lab hi rise">Your voice</div>
          <div class="big score rise m14" aria-label="${s.overall.toFixed(1)} out of 10"><span class="sc">0.0</span><span class="unit">/10</span></div>
        </div>
        <div class="rise">${dialHtml(R, { numerals: false })}</div>
      </div>
      <div class="row gap wrap rise m8"><span class="chip num">${hz(b.f0Median)} Hz</span><span class="chip">Deeper than ${Math.round(b.deeperThanPct)}% of men</span></div>
      <div class="well sds rise m18">${subdial('Depth', s.depth)}${subdial('Resonance', s.resonance)}${subdial('Endings', s.endings)}${subdial('Steadiness', s.steadiness)}</div>
      <div class="lab hi rise m24">What we heard</div>
      <div class="well heard rise m10">${findings.map((f) => `<p class="rise">${f}</p>`).join('')}</div>
      <div class="lab hi rise m24">When does your voice let you down?</div>
      <div class="chips rise m10">${CONTEXTS.map(([k]) => `<button class="chip" data-ctx="${k}">${k}</button>`).join('')}</div>
      <div class="grow"></div>
      <div class="dock"><button class="btn rise" id="go">Find my deeper voice <span class="sub">· 60 s</span></button></div>
    </section>`);
    const d = mountAt($('.dial'), { fig: FIG.busy, seed: 19 });
    d.pip(b.f0Median);
    if (floor) {
      d.ghost(floor);
      d.trail(floor, b.f0Median);
    }
    form(d, figForHz(b.f0Median), { alive });
    setTimeout(() => alive() && odometer($('.sc'), s.overall.toFixed(1)), 200);
    setTimeout(() => {
      if (!alive()) return;
      app.querySelectorAll('.sd').forEach((el, i) => {
        const v = Number(el.dataset.v);
        const delay = 120 + i * 90;
        el.querySelector('.ndg').animate([{ transform: 'rotate(-120deg)' }, { transform: `rotate(${-120 + 24 * v}deg)` }], { duration: SPRING_POP.duration + 300, delay, easing: SPRING_POP.easing, fill: 'forwards' });
        setTimeout(() => alive() && countTo(el.querySelector('b'), { to: v, decimals: 1, duration: 900 }), delay);
      });
    }, 500);
    app.querySelectorAll('[data-ctx]').forEach((c) => {
      c.onclick = () => {
        const on = !c.classList.contains('on');
        app.querySelectorAll('[data-ctx]').forEach((x) => x.classList.remove('on'));
        c.classList.toggle('on', on);
        state.context = on ? c.dataset.ctx : null;
        if (on) track('context_pick', { ctx: state.context });
      };
    });
    $('#go').onclick = () => resolve();
  });
}

// ---------- the 60-second reset ----------

function resetStep({ n, title, lead, seconds, kind }) {
  return new Promise((resolve) => {
    const t = state.target;
    const live = kind !== 'breath';
    const alive = render(`<section class="screen reset">
      <div class="row sb rise"><span class="lab hi">60-second reset</span><span class="fine num">${n} of 3</span></div>
      <div class="tbar rise" aria-hidden="true"><i></i></div>
      <h2 class="h2 m14">${lines(title)}</h2>
      <p class="lead rise m10">${lead}</p>
      <div class="stage" data-dial><div class="dial-host"></div></div>
      ${
        live
          ? `<div class="row gap rise"><div class="well st"><div class="big"><span class="hz">–</span><span class="unit">Hz</span></div><div class="lab">you, now</div></div><div class="well st"><div class="big"><span class="bp">0</span><span class="unit">%</span></div><div class="lab">in the arc</div></div></div>`
          : ''
      }
      <div class="row gap rise m12">${live ? `<button class="btn ghost" id="tone" style="flex:1">${I.play} Note</button>` : ''}<button class="btn" id="next" style="flex:2">${n < 3 ? 'Next' : 'Read the line again'}</button></div>
      <p class="fine tc rise m12">If anything feels tight or scratchy, stop. Never push to the bottom of your range.</p>
    </section>`);
    if (state.mic.fake) state.mic.setSource(live ? 'hum' : 'glide');
    const d = placeDial($('[data-dial]'), { maxR: 120, fig: FIG.mandala, seed: 23 });
    centerSheen(d.el);
    const note = () => {
      playTone(state.mic.ctx, t.targetHz, 2.2);
      state.ear.mute(2400); // the note comes out of the speaker; don't score it as him
    };
    const hzEl = $('.hz');
    const bpEl = $('.bp');
    let lastText = 0;
    const drive = driveLive(d, state.ear, {
      target: live ? t : null,
      alive,
      onFrame: (dt, { hz: h, p }) => {
        const now = performance.now();
        if (!live || now - lastText < 120) return;
        lastText = now;
        if (p && h) hzEl.textContent = hz(h);
        const st = drive.stats;
        bpEl.textContent = st.voicedSec > 0.2 ? Math.round((100 * st.insideSec) / st.voicedSec) : 0;
      },
    });
    if (live) {
      note();
      $('#tone').onclick = note;
    }
    // The step's time runs along the hairline under the header; the bezel stays for his pitch.
    const bar = $('.tbar i');
    const t0 = performance.now();
    frames(() => {
      if (!alive()) return false;
      const p = Math.min(1, (performance.now() - t0) / 1000 / sec(seconds));
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
      if (p >= 1) $('#next')?.classList.add('ready');
      return p < 1;
    });
    let finished = false;
    $('#next').onclick = () => {
      if (finished) return;
      finished = true;
      const st = drive.stop();
      track('reset_step', { n, inBand: live && st.voicedSec > 0.2 ? Math.round((100 * st.insideSec) / st.voicedSec) : null });
      resolve();
    };
  });
}

async function resetFlow() {
  track('reset_start');
  await resetStep({ n: 1, title: ['Relax your throat.'], lead: 'Yawn with your lips closed, then sigh out <q>haaah</q> as the yawn ends. Three times.', seconds: 15, kind: 'breath' });
  await resetStep({ n: 2, title: ['Hand on your chest.', 'Hum the note.'], lead: 'Feel the buzz under your hand. Keep the marker inside the blue arc.', seconds: 25, kind: 'hum' });
  await resetStep({ n: 3, title: ['Speak from', 'the hum.'], lead: 'Hum, then open into <q>Mm-hmm… good morning.</q> Slow. Let the last word drop.', seconds: 20, kind: 'speak' });
  track('reset_done');
}

// ---------- before / after ----------

// Where trimToVoice starts a clip, so the pitch track lines up with what plays.
const clipStart = (m) => (m?.phrases?.length ? Math.max(0, m.phrases[0].startT - 0.2) : 0);

function startVideo() {
  if (state.videoJob) return state.videoJob;
  const fs = state.mic.sampleRate;
  const scene = {
    fs,
    before: trimToVoice(state.takes.before, fs, state.res.before, 2),
    after: trimToVoice(state.takes.after, fs, state.res.after, 2),
    beforeM: state.res.before,
    afterM: state.res.after,
    cmp: state.cmp,
    brand: CONFIG.brand,
    host: location.host || 'voice depth test',
  };
  if (FAKE) window.__dvShareFrames = (times, opts) => renderShareFrames(scene, times, opts); // test hook
  state.videoJob = makeShareVideo({
    ctx: state.mic.ctx,
    ...scene,
    onProgress: (p) => {
      const b = $('#share');
      if (b && !state.video) b.textContent = `Making video ${Math.round(p * 100)}%`;
    },
  })
    .then((blob) => {
      state.video = blob;
      if (FAKE) window.__dvLastVideo = { size: blob.size, type: blob.type }; // test hook (fixtures mode only)
      const b = $('#share');
      if (b) {
        b.disabled = false;
        b.textContent = 'Share the video';
      }
      track('video_ready', { kb: Math.round(blob.size / 1024), type: blob.type });
      return blob;
    })
    .catch((e) => {
      console.warn('video failed', e);
      track('video_failed', { err: String(e?.message || e) });
      const b = $('#share');
      if (b) b.hidden = true;
    });
  return state.videoJob;
}

async function challenge() {
  const a = state.res.after || state.res.before;
  const url = `${location.origin}${location.pathname}?vs=${hz(a.f0Median)}`;
  const text = `I hit ${hz(a.f0Median)} Hz on the voice depth test. Can you go deeper?`;
  track('challenge_tap');
  if (navigator.share) {
    try {
      await navigator.share({ text, url });
      return;
    } catch (e) {
      if (e?.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    toast('Challenge link copied');
  } catch {
    prompt('Copy this link', url);
  }
}

const pick = (m) =>
  m && {
    f0Median: m.f0Median,
    f0Low: m.f0Low,
    f0High: m.f0High,
    deltaF: m.resonance?.deltaF,
    vtlCm: m.resonance?.vtlCm,
    formants: m.resonance?.formants,
    phraseCount: m.phraseCount,
    risingCount: m.risingCount,
    fryPct: m.fryPct,
    steadinessSt: m.steadinessSt,
    snrDb: m.snrDb,
    voicedSec: m.voicedSec,
    scores: m.scores,
    contour: m.contour,
  };

async function saveLab() {
  if (!lab.enabled()) return;
  const fs = state.mic.sampleRate;
  const { highlights, ...cmp } = state.cmp;
  try {
    await lab.saveSession({
      id: state.labId,
      tester: state.tester || 'anon',
      at: new Date().toISOString(),
      fs,
      fake: FAKE,
      retried: state.retried,
      before: pick(state.res.before),
      after: pick(state.res.after),
      hum: state.res.hum,
      glide: state.res.glide,
      target: state.target,
      context: state.context,
      room: state.room,
      cmp,
      beforeWav: new Blob([encodeWav(state.takes.before, fs)], { type: 'audio/wav' }),
      afterWav: new Blob([encodeWav(state.takes.after, fs)], { type: 'audio/wav' }),
    });
  } catch (e) {
    console.warn('lab save failed', e);
  }
}

function changeRows(b, a, cmp) {
  if (cmp.highlights.length) {
    return cmp.highlights.map((h) => `<div class="w-r rise">${ck('lume')}<div><b>${esc(h.title)}</b><span>${esc(h.sub)}</span></div></div>`).join('');
  }
  // Nothing passed: say what was measured, without the win marks.
  const same = (x) => (Math.abs(x) < 0.5 ? 'about the same' : x < 0 ? 'a little deeper' : 'a little higher');
  return [
    [`${hz(b.f0Median)} → ${hz(a.f0Median)} Hz`, `pitch ${same(cmp.dSt)}`],
    [`Resonance ${b.scores.resonance.toFixed(1)} → ${a.scores.resonance.toFixed(1)}`, cmp.dDfPct < -1.5 ? 'a little fuller' : 'about the same'],
    [`Rising endings ${b.risingCount} → ${a.risingCount}`, a.risingCount < b.risingCount ? 'fewer' : 'no change yet'],
  ]
    .map(([t, s]) => `<div class="w-r rise">${ck()}<div><b>${t}</b><span>${s}</span></div></div>`)
    .join('');
}

function compareScreen({ final = false } = {}) {
  const b = state.res.before;
  const a = state.res.after;
  const cmp = state.cmp;
  const canRetry = !final && !cmp.improved && !state.retried;
  let head;
  let sub;
  if (cmp.improved) {
    head = ['That’s your voice.'];
    sub = 'Same line. Same phone. Measured.';
  } else if (canRetry) {
    head = ['Close.', 'One more try.'];
    sub = 'Slower this time. Start every sentence from the hum, and let the last word fall.';
  } else {
    head = ['Not deeper yet.'];
    sub = 'That happens on day one. Here is what we measured.';
  }
  const fs = state.mic.sampleRate;
  const clips = { before: trimToVoice(state.takes.before, fs, b), after: trimToVoice(state.takes.after, fs, a) };
  const R = window.innerWidth < 370 ? 54 : 62;
  const vsLine = VS ? `<div class="chip vs rise m14">You ${hz(a.f0Median)} Hz · your friend ${VS} Hz · ${a.f0Median < VS ? '<b>you win</b>' : 'they win this round'}</div>` : '';
  const primary = gate1.on ? (gate1.sent ? 'Done' : 'Next') : cmp.improved ? 'Keep this voice' : 'See the plan';
  return new Promise((resolve) => {
    const alive = render(`<section class="screen compare">
      <div class="lab hi rise">60 seconds later</div>
      <h1 class="h1 m10${cmp.improved ? ' win' : ''}">${lines(head)}</h1>
      <p class="lead rise m8">${sub}</p>
      ${cmp.fakeDeep ? '<div class="well note rise m14">Part of that was vocal fry (creak). It sounds low, but it isn’t depth. Keep the buzz in your chest.</div>' : ''}
      <div class="pair rise m20">
        <div class="c-col">${dialHtml(R, { numerals: false })}<div class="lab">Before</div><div class="big">${hz(b.f0Median)}<span class="unit">Hz</span></div></div>
        <div class="c-col">${dialHtml(R, { numerals: false })}<div class="lab hi">After</div><div class="big"><span class="ahz">${hz(b.f0Median)}</span><span class="unit">Hz</span></div></div>
      </div>
      <div class="seg rise m20" role="group" aria-label="Play your recordings"><i class="knob"></i><button data-play="before" class="on">${I.play} Before</button><button data-play="after">${I.play} After</button></div>
      <div class="well wins m14">${changeRows(b, a, cmp)}</div>
      ${vsLine}
      ${canRetry ? '' : `<div class="row gap rise m16">${cmp.improved ? '<button class="btn ghost small" id="share" disabled>Making video…</button>' : ''}<button class="btn ghost small" id="vsbtn">Challenge a friend</button></div>`}
      <div class="grow"></div>
      <div class="dock">
        ${
          canRetry
            ? `<button class="btn rise" id="retry">Try once more</button><button class="link rise" id="offer">${gate1.on ? 'Continue without trying again' : 'See the plan'}</button>`
            : `<button class="btn rise" id="offer">${primary}</button>`
        }
        <p class="fine tc m12">${gate1.sent ? `Sent to Luna Maze for testing. Your code: ${esc(gate1.sent.code)}.` : 'Measured on your phone. Nothing was uploaded.'}</p>
      </div>
    </section>`);
    const [bdEl, adEl] = app.querySelectorAll('.pair .dial');
    const bd = still(mountAt(bdEl, { fig: figForHz(b.f0Median), seed: 29 }), figForHz(b.f0Median), { pip: b.f0Median });
    const ad = still(mountAt(adEl, { fig: figForHz(b.f0Median), seed: 29 }), figForHz(b.f0Median), { pip: b.f0Median });
    const dials = { before: bd, after: ad };
    const ahz = $('.ahz');
    // The after dial re-forms on his new voice while its number counts there.
    setTimeout(async () => {
      if (!alive()) return;
      ad.plate.to(...figForHz(a.f0Median));
      ad.ghost(b.f0Median);
      const tick = ticker(ad);
      await frames((dt, t) => {
        if (!alive()) return false;
        const k = easeInOut(Math.min(1, t / 1.6));
        const f = b.f0Median + (a.f0Median - b.f0Median) * k;
        ahz.textContent = hz(f);
        ad.pip(f);
        ad.plate.energy = t < 2 ? 0.7 : 0;
        if (t > 1.6 && cmp.improved) {
          ad.plate.tintTo = 1;
          ad.lit(true);
        }
        tick(dt);
        return t < 2.3;
      });
      if (!alive()) return;
      app.querySelectorAll('.w-r .ck.lume').forEach((c, i) => setTimeout(() => c.classList.add('on'), 200 + i * 140));
    }, 600);
    // Play: the knob moves to the take, and that dial rings with the recording.
    const seg = $('.seg');
    seg.querySelectorAll('[data-play]').forEach((btn) => {
      btn.onclick = () => {
        const which = btn.dataset.play;
        stopPlayback?.();
        seg.classList.toggle('r', which === 'after');
        seg.querySelectorAll('[data-play]').forEach((x) => x.classList.toggle('on', x === btn));
        track('play', { which });
        let playing = true;
        const stop = playPcm(state.mic.ctx, clips[which], fs, () => (playing = false));
        stopPlayback = () => {
          playing = false;
          stop();
        };
        const m = which === 'after' ? a : b;
        drivePlayback(dials[which], clips[which], fs, { contour: m.contour, offsetSec: clipStart(m), alive, isPlaying: () => playing });
      };
    });
    if (!canRetry) saveLab();
    if (canRetry) $('#retry').onclick = () => resolve('retry');
    $('#offer').onclick = () => {
      stopPlayback?.();
      resolve('offer');
    };
    const vsb = $('#vsbtn');
    if (vsb) vsb.onclick = challenge;
    const sb = $('#share');
    if (sb) {
      if (state.video) {
        sb.disabled = false;
        sb.textContent = 'Share the video';
      } else startVideo();
      sb.onclick = async () => {
        if (!state.video) return;
        const ext = state.video.type.includes('mp4') ? 'mp4' : 'webm';
        const how = await shareOrDownload(state.video, `my-voice-before-after.${ext}`, `My voice before vs after 60 seconds. Test yours: ${location.origin}${location.pathname}`);
        track('share_video', { how });
      };
    }
  });
}

// ---------- the offer (a price test: nothing is charged) ----------

function offerScreen() {
  const ctxPhrase = CONTEXTS.find(([k]) => k === state.context)?.[1];
  track('offer_view', { ctx: state.context });
  const a = state.res.after || state.res.before;
  const won = Boolean(state.cmp?.improved);
  const R = window.innerHeight < 720 ? 50 : 66;
  let plan = 'yearly';
  return new Promise((resolve) => {
    const alive = render(`<section class="screen offer">
      <div class="row sb rise"><button class="x-btn" id="back" aria-label="Back to my results">${I.close}</button></div>
      <div class="c-col" style="margin-top:-12px">${dialHtml(R, { numerals: false })}</div>
      <h1 class="h1 tc m10">${lines([won ? 'Keep this voice.' : 'Build this voice.'])}</h1>
      <p class="lead tc rise m8">Today you did it on purpose. The plan’s job is making it automatic${ctxPhrase ? `, even ${ctxPhrase}` : ''}, and every session checks whether it is.</p>
      <div class="feat m14">
        <div class="rise">${I.today}<span>3 minutes a day, built from your numbers</span></div>
        <div class="rise">${I.phone}<span>A warm-up before your calls and dates</span></div>
        <div class="rise">${I.figure}<span>Safe by design: it never trains at the bottom of your range</span></div>
      </div>
      <div class="grow"></div>
      <div class="dock">
        <div class="plans rise"><i class="plan-sel"></i>
          <button class="plan p-year" data-plan="yearly"><em>Best value</em><span>Yearly</span><b>${CONFIG.prices.yearly}</b><small>${CONFIG.prices.yearlyPerWeek} a week</small></button>
          <button class="plan p-week" data-plan="weekly"><span>Weekly</span><b>${CONFIG.prices.weekly}</b><small>per week</small></button>
        </div>
        <button class="btn rise m14" id="buy">Start</button>
        <p class="fine tc rise m10">Cancel anytime. We remind you before every renewal.</p>
      </div>
    </section>`);
    const d = still(mountAt($('.dial'), { fig: FIG.locked, seed: 31 }), won ? FIG.locked : figForHz(a.f0Median), { lit: won, pip: a.f0Median });
    const tick = ticker(d);
    frames((dt, t) => {
      if (!alive()) return false;
      d.plate.energy = 0.1 + 0.08 * Math.sin(t * 1.6); // his figure breathes on its lines
      tick(dt);
      return true;
    });
    const sel = $('.plan-sel');
    const place = (el, anim = true) => {
      const ms = SPRING_POP.duration + 150;
      sel.style.transition = anim ? `transform ${ms}ms ${SPRING_POP.easing}, width ${ms}ms ${SPRING_POP.easing}` : 'none';
      sel.style.transform = `translateX(${el.offsetLeft}px)`;
      sel.style.width = `${el.offsetWidth}px`;
    };
    place($('.p-year'), false);
    app.querySelectorAll('.plan').forEach((p) => {
      p.onclick = () => {
        plan = p.dataset.plan;
        place(p);
      };
    });
    $('#buy').onclick = () => {
      track('price_tap', { plan, ctx: state.context, improved: state.cmp?.improved });
      resolve('buy');
    };
    $('#back').onclick = () => resolve('back');
  });
}

function doorScreen() {
  track('door_view');
  const a = state.res.after || state.res.before;
  const won = Boolean(state.cmp?.improved);
  return new Promise((resolve) => {
    render(`<section class="screen c door">
      <div class="grow"></div>
      <div class="c-col rise">${dialHtml(64, { numerals: false })}</div>
      <div class="lab hi rise m24">You’re early</div>
      <h2 class="h2 m10">${lines(['The full plan', 'isn’t open yet.'])}</h2>
      <p class="lead rise m12">Nothing was charged. Your before and after stay on this phone. Thanks for testing it.</p>
      <div class="grow"></div>
      <button class="btn ghost rise" id="vsbtn">Challenge a friend</button>
      <button class="btn rise m10" id="back">Back to my results</button>
    </section>`);
    still(mountAt($('.dial'), { fig: FIG.locked, seed: 37 }), won ? FIG.locked : figForHz(a.f0Median), { lit: won, pip: a.f0Median });
    $('#vsbtn').onclick = challenge;
    $('#back').onclick = () => resolve('back');
  });
}

function errorScreen(reason) {
  const [title, body] = ERRORS[reason] || ERRORS.crash;
  return new Promise((resolve) => {
    render(`<section class="screen c">
      <div class="grow"></div>
      <div class="c-col rise">${dialHtml(64, { numerals: false })}</div>
      <h2 class="h2 m24">${lines([esc(title)])}</h2>
      <p class="lead rise m12">${esc(body)}</p>
      <div class="grow"></div>
      <button class="btn rise" id="again">Try again</button>
    </section>`);
    const d = still(mountAt($('.dial'), { fig: FIG.busy, seed: 41 }), FIG.busy, { bright: 0.45 });
    d.el.querySelector('.bz-pip').style.opacity = '0';
    $('#again').onclick = () => resolve();
  });
}

// ---------- flow ----------

async function run(ctx) {
  track('start');
  if (!state.mic) {
    try {
      state.mic = FAKE ? await openFakeMic('./fixtures', SPEED, ctx) : await openMic(ctx);
    } catch (e) {
      track('mic_denied', { err: String(e?.name || e) });
      ctx?.close?.().catch(() => {});
      await errorScreen('mic_denied');
      return intro();
    }
    state.ear = createEar(state.mic);
  }
  Object.assign(state, { retried: false, video: null, videoJob: null, cmp: null, context: null, labId: `${Date.now()}`, res: {}, takes: {} });
  const fs = state.mic.sampleRate;

  if ((await roomScreen()) === 'silent') {
    await errorScreen('mic_silent');
    return location.reload();
  }

  for (;;) {
    const { pcm, m } = await takeScreen({ ...TAKES.before, analyze: (p) => analyzeSpeech(p, fs) });
    if (m.ok) {
      state.takes.before = pcm;
      state.res.before = m;
      break;
    }
    track('take_rejected', { slot: 'before', reason: m.reason });
    await errorScreen(m.reason);
  }
  state.takes.mmhmm = (await takeScreen(TAKES.mmhmm)).pcm;
  const g = await takeScreen({ ...TAKES.glide, analyze: (p) => analyzeGlide(p, fs) });
  state.takes.glide = g.pcm;
  state.res.glide = g.m;
  const b = state.res.before;
  state.res.hum = analyzeHum(state.takes.mmhmm, fs);
  state.floorHz = state.res.glide.ok && state.res.glide.floorHz < b.f0Median ? state.res.glide.floorHz : null;
  state.target = targetPitch({ habitualHz: b.f0Median, mmhmmHz: state.res.hum.ok ? state.res.hum.f0Median : 0, floorHz: state.floorHz || 0 });

  await measuringScreen();
  await resultScreen();
  await resetFlow();

  for (;;) {
    const slot = state.retried ? 'after2' : 'after';
    const { pcm, m } = await takeScreen({ ...TAKES[slot], ghost: b.f0Median, analyze: (p) => analyzeSpeech(p, fs) });
    if (!m.ok) {
      track('take_rejected', { slot, reason: m.reason });
      await errorScreen(m.reason);
      continue;
    }
    state.takes.after = pcm;
    state.res.after = m;
    state.cmp = compareTakes(b, m);
    state.video = null;
    state.videoJob = null;
    track('compare_view', { improved: state.cmp.improved, dSt: Math.round(state.cmp.dSt * 100) / 100, dDf: Math.round(state.cmp.dDfPct * 10) / 10, retried: state.retried });
    const action = await compareScreen();
    if (action === 'retry') {
      state.retried = true;
      continue;
    }
    break;
  }

  if (gate1.on) return gate1Flow();
  for (;;) {
    const r = await offerScreen();
    if (r === 'buy') {
      await doorScreen();
    }
    await compareScreen({ final: true });
  }
}

// Tester links only: ask, send if he agrees, thank him. No price screen for testers.
async function gate1Flow() {
  for (;;) {
    if (!gate1.sent) {
      const c = await consentScreen(render, $);
      track('g1_consent', { send: c.send, listening: Boolean(c.listening) });
      if (c.send) {
        state.consent = c;
        for (;;) {
          const onStep = sendingScreen(render, $);
          try {
            await upload(state, pick, { onStep });
            track('g1_sent');
            break;
          } catch (e) {
            console.warn('gate1 upload failed', e);
            track('g1_send_failed', { err: String(e?.message || e).slice(0, 80) });
            if ((await sendFailedScreen(render, $, e)) === 'skip') break;
          }
        }
      }
    }
    const next = await thanksScreen(render, $);
    if (next === 'consent') continue;
    await compareScreen({ final: true });
  }
}

function route() {
  stopPlayback?.();
  const h = location.hash;
  if (h.startsWith('#/lab')) {
    seq++;
    return renderLab(app);
  }
  if (h.startsWith('#/listen')) {
    seq++;
    return renderListen(app);
  }
  return intro();
}

// Archivo first (the layout and the dial's size are measured from it), but never wait long for it.
Promise.race([document.fonts?.load?.('620 16px Archivo') ?? Promise.resolve(), sleep(1500)])
  .catch(() => {})
  .then(() => {
    window.addEventListener('hashchange', route);
    route();
  });
