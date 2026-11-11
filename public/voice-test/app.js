// Gate 1 demo flow: record -> measure -> 60-second reset -> record again -> before/after -> offer.
import { openMic, openFakeMic, recordTake, playPcm, playTone } from './audio/recorder.js';
import { encodeWav } from './audio/wav.js';
import { analyzeSpeech, analyzeHum, analyzeGlide, targetPitch } from './engine/analyze.js';
import { compareTakes } from './engine/compare.js';
import { semitones } from './engine/dsp.js';
import { startLivePitch } from './ui/livepitch.js';
import { makeShareVideo, renderShareFrames, shareOrDownload, waveformSvg, trimToVoice } from './ui/share.js';
import { lab } from './lab/store.js';
import { renderLab, renderListen } from './lab/lab.js';
import { gate1, consentScreen, upload, sendingScreen, sendFailedScreen, thanksScreen } from './lab/gate1.js';
import { CONFIG } from './config.js';
import { track } from './track.js';

const params = new URLSearchParams(location.search);
const FAKE = params.has('fake');
const SPEED = params.has('fast') ? 10 : 1;
const VS_RAW = Number(params.get('vs'));
const VS = VS_RAW >= 50 && VS_RAW <= 300 ? Math.round(VS_RAW) : null;
if (params.has('lab')) lab.setEnabled(true);

const PASSAGE = ['Good morning.', "I'm here, and I'm ready.", 'We run the plan, and we win.', 'Remember my name.'];
const CONTEXTS = [
  ['Calls', 'on calls'],
  ['Meetings', 'in meetings'],
  ['Dates', 'on dates'],
  ['Videos', 'on video'],
  ['Arguments', 'in arguments'],
];

const state = { mic: null, takes: {}, res: {}, target: null, floorHz: null, context: null, retried: false, tester: '', cmp: null, video: null, videoJob: null, labId: null };

const app = document.getElementById('app');
const $ = (s) => app.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
const sec = (s) => s / SPEED;
const hz = (v) => Math.round(v);

function render(html) {
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

function heroWave() {
  const W = 360;
  const H = 120;
  let paths = '';
  for (let k = 0; k < 4; k++) {
    let d = '';
    const amp = 40 - k * 8;
    const freq = 1.1 + k * 0.5;
    const ph = k * 0.9;
    for (let x = 0; x <= W; x += 4) {
      const y = H / 2 + amp * Math.sin((x / W) * Math.PI * 2 * freq + ph) * Math.sin((x / W) * Math.PI);
      d += `${x ? 'L' : 'M'}${x} ${y.toFixed(1)}`;
    }
    paths += `<path d="${d}" style="opacity:${(1 - k * 0.22).toFixed(2)}"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${paths}</svg>`;
}

// ---------- screens ----------

function intro() {
  track('intro_view', { vs: VS, lab: lab.enabled() });
  render(`<section class="screen intro">
    <div class="brand">${esc(CONFIG.brand)}</div>
    <div class="hero-wave" aria-hidden="true">${heroWave()}</div>
    ${VS ? `<div class="challenge">A friend hit <b>${VS} Hz</b>. Can you go deeper?</div>` : ''}
    ${gate1.on ? '<div class="challenge">Tester link. Thank you for helping.</div>' : ''}
    <h1>Hear your deeper voice in 2&nbsp;minutes.</h1>
    <p class="lead">Read one line. We measure your pitch and resonance, coach you for 60 seconds, and you hear the difference.</p>
    <ul class="ticks"><li>Free</li><li>Measured on your phone</li><li>${gate1.on ? 'You choose what to send' : 'Nothing is uploaded'}</li></ul>
    ${lab.enabled() || (gate1.on && !gate1.prolific) ? `<label class="field"><span>${gate1.on ? 'Your first name or a nickname (optional)' : 'Tester name (lab)'}</span><input id="tester" autocomplete="off" placeholder="e.g. Arun" value="${esc(state.tester)}"></label>` : ''}
    <div class="grow"></div>
    <button class="btn primary" id="go">Start</button>
    <p class="fine">Not medical advice. Stop if your throat feels tight, sore or hoarse.</p>
  </section>`);
  $('#go').onclick = () => {
    state.tester = $('#tester')?.value.trim() || '';
    run().catch((e) => {
      console.error(e);
      errorScreen('crash').then(intro);
    });
  };
}

function analyzingScreen(text) {
  render(`<section class="screen center"><div class="spinner" aria-hidden="true"></div><p class="lead">${esc(text)}…</p></section>`);
  return nextFrame().then(() => sleep(60));
}

const ERRORS = {
  mic_denied: ['We need your mic', 'Allow microphone access for this page in your browser settings, then try again.'],
  too_little_voice: ["We couldn't hear enough voice", 'Hold the phone 20–30 cm from your mouth and read the whole line out loud.'],
  noisy: ['Too much background noise', 'Find a quieter spot and try again.'],
  clipped: ['Too loud for the mic', 'Hold the phone a little further away and try again.'],
  crash: ['Something went wrong', 'Reload the page and try again.'],
};

function errorScreen(reason) {
  const [title, body] = ERRORS[reason] || ERRORS.crash;
  return new Promise((resolve) => {
    render(`<section class="screen center"><h2>${esc(title)}</h2><p class="lead">${esc(body)}</p><div class="grow"></div><button class="btn primary" id="again">Try again</button></section>`);
    $('#again').onclick = () => resolve();
  });
}

function recordScreen({ slot, step, title, body, passage, seconds, minSeconds }) {
  return new Promise((resolve) => {
    render(`<section class="screen rec">
      <div class="steps">${esc(step)}</div>
      <h2>${title}</h2>
      <p class="lead">${body}</p>
      ${passage ? `<blockquote class="passage">${PASSAGE.map((s) => `<span>${esc(s)}</span>`).join(' ')}</blockquote>` : ''}
      <div class="grow"></div>
      <div class="recwrap">
        <div class="meter" aria-hidden="true"><i id="lvl"></i></div>
        <button class="recbtn" id="rec" aria-label="Record">
          <svg viewBox="0 0 120 120" class="ring" aria-hidden="true"><circle cx="60" cy="60" r="54" class="track"/><circle cx="60" cy="60" r="54" class="prog" id="prog"/></svg>
          <span class="dot"></span>
        </button>
        <div class="rechint" id="hint">Tap to record · ${seconds} s</div>
        <button class="link" id="done" hidden>Done</button>
      </div>
    </section>`);
    const btn = $('#rec');
    const prog = $('#prog');
    const C = 2 * Math.PI * 54;
    prog.style.strokeDasharray = `${C}`;
    prog.style.strokeDashoffset = `${C}`;
    let rec = null;
    btn.onclick = () => {
      if (rec) return;
      btn.classList.add('on');
      track('take_start', { slot });
      rec = recordTake(state.mic, {
        seconds,
        slot,
        speed: SPEED,
        onLevel: (rms) => {
          const db = 20 * Math.log10(Math.max(rms, 1e-6));
          const p = Math.max(0, Math.min(1, (db + 60) / 54));
          const el = $('#lvl');
          if (el) el.style.width = `${(p * 100).toFixed(0)}%`;
        },
        onProgress: (p, el) => {
          prog.style.strokeDashoffset = `${C * (1 - p)}`;
          const left = Math.max(0, Math.ceil(seconds - el));
          const hint = $('#hint');
          if (hint) hint.textContent = `Recording · ${left} s`;
          const done = $('#done');
          if (done && minSeconds < seconds && el >= minSeconds) done.hidden = false;
        },
      });
      $('#done').onclick = () => rec.stop();
      rec.done.then((pcm) => {
        track('take_done', { slot, sec: Math.round((pcm.length / state.mic.sampleRate) * 10) / 10 });
        resolve(pcm);
      });
    };
  });
}

function scoreBars(s) {
  const rows = [
    ['Depth', s.depth],
    ['Resonance', s.resonance],
    ['Endings', s.endings],
    ['Steadiness', s.steadiness],
  ];
  return `<div class="bars">${rows.map(([k, v]) => `<div class="b"><span>${k}</span><i><em style="width:${(v * 10).toFixed(0)}%"></em></i><b>${v.toFixed(1)}</b></div>`).join('')}</div>`;
}

function diagnosisScreen() {
  const b = state.res.before;
  const floor = state.floorHz;
  const gapSt = floor ? semitones(b.f0Median) - semitones(floor) : null;
  const findings = [];
  if (gapSt !== null && gapSt >= 3) findings.push(`You talk <b>${gapSt.toFixed(1)} semitones</b> above your comfortable low (${hz(floor)} Hz). There's room to go deeper.`);
  else findings.push('You already talk close to your low notes. The gain for you is resonance: a darker, fuller sound.');
  if (b.phraseCount && b.risingCount) findings.push(`<b>${b.risingCount} of ${b.phraseCount}</b> sentences ended going up. It sounds like you're asking, not telling.`);
  else if (b.phraseCount) findings.push('Your sentences land low at the end. Keep that.');
  findings.push(b.scores.resonance < 6 ? `Resonance <b>${b.scores.resonance.toFixed(1)}/10</b>. The sound sits high and light.` : `Resonance <b>${b.scores.resonance.toFixed(1)}/10</b>. Good body already.`);
  if (b.fryPct > 0.15) findings.push(`<b>${Math.round(b.fryPct * 100)}%</b> of your voice was creak (vocal fry). It sounds low, but it isn't depth.`);
  track('diagnosis_view', { score: b.scores.overall, f0: hz(b.f0Median), gapSt: gapSt && Math.round(gapSt * 10) / 10 });
  return new Promise((resolve) => {
    render(`<section class="screen diag">
      <div class="kicker">Your voice score</div>
      <div class="bigscore"><b>${b.scores.overall.toFixed(1)}</b><span>/10</span></div>
      <div class="pills"><span>${hz(b.f0Median)} Hz</span><span>Deeper than ${Math.round(b.deeperThanPct)}% of men</span></div>
      ${scoreBars(b.scores)}
      <h3>What we heard</h3>
      <ul class="findings">${findings.map((f) => `<li>${f}</li>`).join('')}</ul>
      <h3>When does your voice let you down?</h3>
      <div class="chips">${CONTEXTS.map(([k]) => `<button class="chip" data-ctx="${k}">${k}</button>`).join('')}</div>
      <div class="grow"></div>
      <button class="btn primary" id="go">Find my deeper voice · 60 s</button>
    </section>`);
    app.querySelectorAll('.chip').forEach((c) => {
      c.onclick = () => {
        app.querySelectorAll('.chip').forEach((x) => x.classList.remove('sel'));
        c.classList.add('sel');
        state.context = c.dataset.ctx;
        track('context_pick', { ctx: state.context });
      };
    });
    $('#go').onclick = () => resolve();
  });
}

function resetStep({ n, title, body, seconds, kind }) {
  return new Promise((resolve) => {
    const t = state.target;
    const live = kind !== 'breath';
    render(`<section class="screen reset">
      <div class="steps">60-second reset · ${n} of 3</div>
      <div class="bar"><i id="bar"></i></div>
      <h2>${title}</h2>
      <p class="lead">${body}</p>
      ${live ? `<div class="live"><canvas id="live"></canvas><div class="livestat"><b id="hz">–</b><span id="band">Get your line into the green band</span></div></div>` : '<div class="breath" aria-hidden="true"><span></span></div>'}
      <div class="grow"></div>
      ${live ? '<button class="btn ghost" id="tone">Play the note again</button>' : ''}
      <button class="btn primary" id="next">${n < 3 ? 'Next' : 'Read the line again'}</button>
      <p class="fine">If anything feels tight or scratchy, stop. Never push to the bottom of your range.</p>
    </section>`);
    let lp = null;
    if (live) {
      playTone(state.mic.ctx, t.targetHz, 2.2);
      $('#tone').onclick = () => playTone(state.mic.ctx, t.targetHz, 2.2);
      if (state.mic.fake) state.mic.setSource('hum');
      lp = startLivePitch(state.mic, $('#live'), {
        ...t,
        onStats: ({ f0, inBandPct }) => {
          const h = $('#hz');
          const band = $('#band');
          if (h) h.textContent = f0 ? `${hz(f0)} Hz` : '–';
          if (band && f0) band.textContent = `In the band ${Math.round(inBandPct * 100)}% of the time`;
        },
      });
    }
    const t0 = performance.now();
    let raf = 0;
    let finished = false;
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / 1000 / sec(seconds));
      const bar = $('#bar');
      if (bar) bar.style.width = `${(p * 100).toFixed(1)}%`;
      if (p < 1) raf = requestAnimationFrame(tick);
      else $('#next')?.classList.add('ready');
    };
    raf = requestAnimationFrame(tick);
    $('#next').onclick = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      const stats = lp?.stop();
      track('reset_step', { n, inBand: stats ? Math.round(stats.inBandPct * 100) : null });
      resolve();
    };
  });
}

async function resetFlow() {
  track('reset_start');
  await resetStep({ n: 1, title: 'Relax your throat', body: 'Yawn with your lips closed, then sigh out <q>haaah</q> as the yawn ends. Three times.', seconds: 15, kind: 'breath' });
  await resetStep({ n: 2, title: 'Chest hum', body: 'Hand on your chest. Hum the note you hear, and feel the buzz under your hand.', seconds: 25, kind: 'hum' });
  await resetStep({ n: 3, title: 'Speak from the hum', body: 'Hum, then open into <q>Mm-hmm… good morning.</q> Slow. Let the last word drop.', seconds: 20, kind: 'speak' });
  track('reset_done');
}

function takeCard(label, m, pcm, key, hot) {
  return `<div class="take ${hot ? 'hot' : ''}">
    <div class="take-top"><span class="tag">${label}</span><span class="score">${m.scores.overall.toFixed(1)}<small>/10</small></span></div>
    <div class="hz">${hz(m.f0Median)}<small> Hz</small></div>
    <button class="play" data-play="${key}" aria-label="Play ${label.toLowerCase()}"><span class="pi">▶</span>${waveformSvg(pcm, 280, 44, 44)}</button>
  </div>`;
}

let stopPlayback = null;
function bindPlayback(clips) {
  app.querySelectorAll('[data-play]').forEach((b) => {
    b.onclick = () => {
      stopPlayback?.();
      app.querySelectorAll('[data-play]').forEach((x) => x.classList.remove('playing'));
      b.classList.add('playing');
      track('play', { which: b.dataset.play });
      stopPlayback = playPcm(state.mic.ctx, clips[b.dataset.play], state.mic.sampleRate, () => b.classList.remove('playing'));
    };
  });
}

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
      if (b && !state.video) b.textContent = `Making your video ${Math.round(p * 100)}%`;
    },
  })
    .then((blob) => {
      state.video = blob;
      if (FAKE) window.__dvLastVideo = { size: blob.size, type: blob.type }; // test hook (fixtures mode only)
      const b = $('#share');
      if (b) {
        b.disabled = false;
        b.textContent = 'Share my before/after video';
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
      cmp,
      beforeWav: new Blob([encodeWav(state.takes.before, fs)], { type: 'audio/wav' }),
      afterWav: new Blob([encodeWav(state.takes.after, fs)], { type: 'audio/wav' }),
    });
  } catch (e) {
    console.warn('lab save failed', e);
  }
}

function compareScreen({ final = false } = {}) {
  const b = state.res.before;
  const a = state.res.after;
  const cmp = state.cmp;
  const canRetry = !final && !cmp.improved && !state.retried;
  let head;
  let sub;
  if (cmp.improved) {
    head = "That's your voice. You just did it.";
    sub = 'Same line, same phone, 60 seconds apart. Measured, not guessed.';
  } else if (canRetry) {
    head = 'Close. One more try.';
    sub = 'Slower this time. Start every sentence from the hum, and let the last word fall.';
  } else {
    head = 'Not deeper yet.';
    sub = 'That happens on day one. Your numbers are below. The daily plan builds it step by step.';
  }
  const fs = state.mic.sampleRate;
  const clips = { before: trimToVoice(state.takes.before, fs, b), after: trimToVoice(state.takes.after, fs, a) };
  const vsLine = VS ? `<div class="vs ${a.f0Median < VS ? 'win' : ''}">You ${hz(a.f0Median)} Hz vs your friend ${VS} Hz · ${a.f0Median < VS ? 'you win' : 'they win this round'}</div>` : '';
  return new Promise((resolve) => {
    render(`<section class="screen compare">
      <h2 class="${cmp.improved ? 'win' : ''}">${head}</h2>
      <p class="lead">${sub}</p>
      ${cmp.fakeDeep ? '<div class="warn">Part of that was vocal fry (creak). It sounds low, but it isn\'t depth. Keep the buzz in your chest.</div>' : ''}
      <div class="takes">
        ${takeCard('Before', b, clips.before, 'before', false)}
        ${takeCard('After 60 s', a, clips.after, 'after', cmp.improved)}
      </div>
      ${cmp.highlights.length ? `<ul class="wins">${cmp.highlights.map((h) => `<li><b>${esc(h.title)}</b><span>${esc(h.sub)}</span></li>`).join('')}</ul>` : ''}
      ${vsLine}
      ${
        canRetry
          ? `<div class="grow"></div><button class="btn primary" id="retry">Try once more</button><button class="link" id="offer">${gate1.on ? 'Continue without trying again' : 'See the plan'}</button>`
          : `<div class="share">
              ${cmp.improved ? `<button class="btn ghost" id="share" disabled>Making your video…</button>` : ''}
              <button class="btn ghost" id="vsbtn">Challenge a friend</button>
            </div>
            <div class="grow"></div>
            <button class="btn primary" id="offer">${gate1.on ? (gate1.sent ? 'Done' : 'Next') : 'Make this my default voice'}</button>`
      }
      <p class="fine">${gate1.sent ? `Sent to Luna Maze for testing. Your code: ${esc(gate1.sent.code)}.` : 'Measured on your phone. Nothing was uploaded.'}</p>
    </section>`);
    bindPlayback(clips);
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
        sb.textContent = 'Share my before/after video';
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

function offerScreen() {
  const ctxPhrase = CONTEXTS.find(([k]) => k === state.context)?.[1];
  track('offer_view', { ctx: state.context });
  let plan = 'weekly';
  return new Promise((resolve) => {
    render(`<section class="screen offer">
      <div class="kicker">Your 21-day plan</div>
      <h2>Right now it holds while you focus. The plan makes it automatic${ctxPhrase ? `, even ${ctxPhrase}` : ''}.</h2>
      <ul class="ticks col">
        <li><b>5 minutes a day.</b> Drills picked from your numbers.</li>
        <li><b>A daily cold read.</b> Shows how close your everyday voice is to your trained voice.</li>
        <li><b>Safe by design.</b> It never trains at the bottom of your range.</li>
      </ul>
      <div class="plans">
        <button class="plan sel" data-plan="weekly"><span>Weekly</span><b>${CONFIG.prices.weekly}</b><small>per week</small></button>
        <button class="plan" data-plan="yearly"><em>Best value</em><span>Yearly</span><b>${CONFIG.prices.yearly}</b><small>${CONFIG.prices.yearlyPerWeek} a week</small></button>
      </div>
      <div class="grow"></div>
      <button class="btn primary" id="buy">Start my plan</button>
      <button class="link" id="back">Back to my results</button>
    </section>`);
    app.querySelectorAll('.plan').forEach((p) => {
      p.onclick = () => {
        app.querySelectorAll('.plan').forEach((x) => x.classList.remove('sel'));
        p.classList.add('sel');
        plan = p.dataset.plan;
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
  return new Promise((resolve) => {
    render(`<section class="screen center door">
      <div class="kicker">You're early</div>
      <h2>The full plan isn't open yet.</h2>
      <p class="lead">Nothing was charged. Your before/after stays on this phone. Thanks for testing it.</p>
      <div class="grow"></div>
      <button class="btn ghost" id="vsbtn">Challenge a friend</button>
      <button class="btn primary" id="back">Back to my results</button>
    </section>`);
    $('#vsbtn').onclick = challenge;
    $('#back').onclick = () => resolve('back');
  });
}

// ---------- flow ----------

async function run() {
  track('start');
  if (!state.mic) {
    try {
      state.mic = FAKE ? await openFakeMic('./fixtures', SPEED) : await openMic();
    } catch (e) {
      track('mic_denied', { err: String(e?.name || e) });
      await errorScreen('mic_denied');
      return intro();
    }
  }
  Object.assign(state, { retried: false, video: null, videoJob: null, cmp: null, context: null, labId: `${Date.now()}`, res: {}, takes: {} });
  const fs = state.mic.sampleRate;

  for (;;) {
    state.takes.before = await recordScreen({ slot: 'before', step: '1 of 3', title: 'Your normal voice', body: 'Read this out loud the way you normally talk.', passage: true, seconds: 10, minSeconds: 6 });
    await analyzingScreen('Checking the recording');
    state.res.before = analyzeSpeech(state.takes.before, fs);
    if (state.res.before.ok) break;
    track('take_rejected', { slot: 'before', reason: state.res.before.reason });
    await errorScreen(state.res.before.reason);
  }
  state.takes.mmhmm = await recordScreen({ slot: 'mmhmm', step: '2 of 3', title: 'Agree out loud', body: 'Say <q>mm-hmm</q> twice, like you agree with someone.', seconds: 3, minSeconds: 3 });
  state.takes.glide = await recordScreen({ slot: 'glide', step: '3 of 3', title: 'Find your floor', body: 'Slide <q>aaah</q> from your normal voice down to your lowest comfortable note. Gentle. No pushing.', seconds: 5, minSeconds: 5 });
  await analyzingScreen('Measuring your voice');
  const b = state.res.before;
  state.res.hum = analyzeHum(state.takes.mmhmm, fs);
  state.res.glide = analyzeGlide(state.takes.glide, fs);
  state.floorHz = state.res.glide.ok && state.res.glide.floorHz < b.f0Median ? state.res.glide.floorHz : null;
  state.target = targetPitch({ habitualHz: b.f0Median, mmhmmHz: state.res.hum.ok ? state.res.hum.f0Median : 0, floorHz: state.floorHz || 0 });

  await diagnosisScreen();
  await resetFlow();

  for (;;) {
    const slot = state.retried ? 'after2' : 'after';
    const pcm = await recordScreen({
      slot,
      step: state.retried ? 'One more try' : 'Again',
      title: 'Now, your deeper voice',
      body: state.retried ? 'Slower. Start every sentence from the hum, and let the last word fall.' : 'Same line. Start from the hum, go slow, and let each sentence land low.',
      passage: true,
      seconds: 10,
      minSeconds: 6,
    });
    await analyzingScreen('Comparing');
    const after = analyzeSpeech(pcm, fs);
    if (!after.ok) {
      track('take_rejected', { slot, reason: after.reason });
      await errorScreen(after.reason);
      continue;
    }
    state.takes.after = pcm;
    state.res.after = after;
    state.cmp = compareTakes(b, after);
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
          const onStep = sendingScreen(render);
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
  if (h.startsWith('#/lab')) return renderLab(app);
  if (h.startsWith('#/listen')) return renderListen(app);
  return intro();
}

window.addEventListener('hashchange', route);
route();
