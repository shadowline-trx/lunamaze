// Gate 1 online: a tester link (?k=<key>) turns on consent and upload at the end of the test.
// Without a key nothing here runs, and the public test keeps its promise that nothing is uploaded.
// Recordings are sent at 16 kHz, through three database functions that only accept a valid key.
import { CONFIG } from '../config.js';
import { encodeWav } from '../audio/wav.js';
import { resample } from '../engine/dsp.js';
import { dialHtml, FIG } from '../ui/dial.js';
import { mountAt, still, ticker } from '../ui/live.js';
import { frames } from '../ui/motion.js';

const UPLOAD_FS = 16000;
// Bump whenever the consent screen's words change, so each stored session says which text he agreed to.
const CONSENT_VERSION = 'g1-2026-11-11b';
const CONTACT = 'lunamaze.dev@gmail.com';
const KEEP_UNTIL = '31 March 2027';
const SLOTS = ['before', 'after', 'mmhmm', 'glide'];
const STORE = 'dv_g1';
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

const params = new URLSearchParams(location.search);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readLink() {
  const k = params.get('k');
  if (k && /^[a-z0-9]{8,40}$/.test(k)) {
    const prolific = ['PROLIFIC_PID', 'STUDY_ID', 'SESSION_ID'].every((p) => ID_RE.test(params.get(p) || ''))
      ? { pid: params.get('PROLIFIC_PID'), study: params.get('STUDY_ID'), session: params.get('SESSION_ID') }
      : null;
    const link = { key: k, prolific };
    try {
      sessionStorage.setItem(STORE, JSON.stringify(link));
    } catch {
      /* private mode */
    }
    return link;
  }
  try {
    return JSON.parse(sessionStorage.getItem(STORE) || 'null');
  } catch {
    return null;
  }
}

const FAKE = params.has('fake');
// The fixtures run (tests only) talks to a stand-in address that the test intercepts.
const API = CONFIG.gate1 ?? (FAKE ? { url: 'https://gate1.test', publishableKey: 'sb_publishable_test' } : null);
const link = API ? readLink() : null;

export const gate1 = {
  on: Boolean(link),
  prolific: Boolean(link?.prolific),
  sent: null, // { code, completion } once uploaded
};

async function rpc(name, body) {
  const headers = { apikey: API.publishableKey, 'Content-Type': 'application/json' };
  if (!API.publishableKey.startsWith('sb_')) headers.Authorization = `Bearer ${API.publishableKey}`; // legacy anon JWT
  const res = await fetch(`${API.url}/rest/v1/rpc/${name}`, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      msg = JSON.parse(text).message || msg;
    } catch {
      /* not JSON */
    }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return text ? JSON.parse(text) : null;
}

async function withRetry(fn, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      // A closed session or an unknown link won't fix itself.
      if (i >= tries || [400, 401, 403, 404, 409].includes(e.status)) throw e;
      await sleep(800 * i);
    }
  }
}

function b64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function wav16k(pcm, fs) {
  return b64(encodeWav(fs === UPLOAD_FS ? pcm : resample(pcm, fs, UPLOAD_FS), UPLOAD_FS));
}

const shortCode = (id) => id.replace(/-/g, '').slice(0, 8).toUpperCase().replace(/(.{4})/, '$1-');

const lines = (arr) => arr.map((t) => `<span class="ml"><span>${t}</span></span>`).join('');

export function consentScreen(render, $) {
  return new Promise((resolve) => {
    render(`<section class="screen consent">
      <div class="lab hi rise">Last step · your choice</div>
      <h2 class="h2 m12">${lines(['Send your recordings', 'to help us test this?'])}</h2>
      <div class="well heard m18">
        <p class="rise"><b>What we get:</b> your four short recordings (about 30 seconds of audio), what the test measured (your voice and your room’s noise), the answer you picked, and your phone model, browser and mic type.</p>
        <p class="rise"><b>What we don’t get:</b> your contacts or your location, or your name unless you typed one.</p>
        <p class="rise"><b>Why:</b> to check that the measurement works on real phones, before anyone pays for it.</p>
        <p class="rise"><b>How long:</b> until ${KEEP_UNTIL}, then we delete them. To delete yours sooner, email ${esc(CONTACT)} with the code you’ll see next.</p>
      </div>
      <label class="toggle rise m20"><input type="checkbox" id="adult"> I’m 18 or older.</label>
      <label class="toggle rise m14"><input type="checkbox" id="listen"> OK to play my two readings, without my name, to other testers, who pick which one sounds deeper.</label>
      <div class="grow"></div>
      <button class="btn off rise m24" id="send" disabled>Send my recordings</button>
      <button class="link rise" id="skip">Don’t send</button>
      <p class="fine tc rise m10">Run by Luna Maze. <a href="./privacy.html" target="_blank" rel="noopener">How we handle your recordings</a></p>
    </section>`);
    const adult = $('#adult');
    const send = $('#send');
    adult.onchange = () => {
      send.disabled = !adult.checked;
      send.classList.toggle('off', !adult.checked);
    };
    send.onclick = () => resolve({ send: true, adult: true, listening: $('#listen').checked });
    $('#skip').onclick = () => resolve({ send: false });
  });
}

// Sends one finished test. `st` is the app state; `pick` turns an analysis into plain numbers.
export async function upload(st, pick, { onStep } = {}) {
  const id = crypto.randomUUID();
  const fs = st.mic.sampleRate;
  const { highlights, ...cmp } = st.cmp;
  const meta = {
    consent: { version: CONSENT_VERSION, adult: true, listening: Boolean(st.consent?.listening), at: new Date().toISOString() },
    tester: st.tester ? st.tester.slice(0, 40) : null,
    prolific: link.prolific,
    device: {
      ua: navigator.userAgent.slice(0, 300),
      lang: navigator.language,
      touch: navigator.maxTouchPoints > 0,
      screen: `${screen.width}x${screen.height}`,
      inputRate: fs,
      uploadRate: UPLOAD_FS,
      micKind: st.mic.kind ?? null,
      micSettings: st.mic.settings || null,
    },
    // How the takes were made: since the v3 screens they start at his first voiced moment
    // (with 0.5 s before it) and stop after a pause, instead of on a tap and a timer.
    capture: { start: 'voice', preRollSec: 0.5, ui: 'v3' },
    results: {
      before: pick(st.res.before),
      after: pick(st.res.after),
      hum: st.res.hum,
      glide: st.res.glide,
      target: st.target,
      floorHz: st.floorHz,
      room: st.room || null,
      context: st.context,
      retried: st.retried,
      cmp,
      highlights: highlights.map((h) => h.key),
      seconds: Object.fromEntries(SLOTS.filter((s) => st.takes[s]).map((s) => [s, Math.round((st.takes[s].length / fs) * 10) / 10])),
    },
    app: { build: CONFIG.build || null, fake: FAKE },
  };
  onStep?.(0, SLOTS.length + 1);
  await withRetry(() => rpc('gate1_submit', { p_key: link.key, p_id: id, p_meta: meta }));
  const slots = SLOTS.filter((s) => st.takes[s]);
  for (const [i, slot] of slots.entries()) {
    onStep?.(i + 1, slots.length + 1);
    const wav = wav16k(st.takes[slot], fs);
    await withRetry(() => rpc('gate1_add_take', { p_key: link.key, p_id: id, p_slot: slot, p_rate: UPLOAD_FS, p_wav: wav }));
  }
  const completion = await withRetry(() => rpc('gate1_finish', { p_key: link.key, p_id: id }));
  onStep?.(slots.length + 1, slots.length + 1);
  gate1.sent = { code: shortCode(id), completion };
  return gate1.sent;
}

// The dial at the top of the Gate 1 screens: his figure, lit once the recordings are in.
function topDial($, { lit = false, bright = 1 } = {}) {
  return still(mountAt($('.dial'), { fig: FIG.locked, seed: 43 }), lit ? FIG.locked : FIG.mandala, { lit, bright });
}

export function sendingScreen(render, $) {
  const alive = render(`<section class="screen c sending">
    <div class="grow"></div>
    <div class="c-col">${dialHtml(84, { numerals: false })}</div>
    <h2 class="h2 m24">${lines(['Sending…'])}</h2>
    <p class="lead m10" id="g1step" role="status">Your recordings, one at a time.</p>
    <div class="grow"></div>
  </section>`);
  const d = topDial($);
  d.el.querySelector('.bz-pip').style.opacity = '0';
  const tick = ticker(d);
  let p = 0;
  let shown = 0;
  frames((dt, t) => {
    if (!alive()) return false;
    shown += (p - shown) * (1 - Math.exp(-dt * 6));
    d.prog(shown);
    d.plate.energy = 0.12 + 0.06 * Math.sin(t * 3);
    tick(dt);
    return true;
  });
  return (i, n) => {
    p = i / n;
    const el = document.getElementById('g1step');
    if (el) el.textContent = i >= n ? 'Done.' : `Sending ${Math.min(i + 1, n)} of ${n}…`;
  };
}

export function sendFailedScreen(render, $, err) {
  return new Promise((resolve) => {
    render(`<section class="screen c">
      <div class="grow"></div>
      <div class="c-col rise">${dialHtml(64, { numerals: false })}</div>
      <h2 class="h2 m24">${lines(['That didn’t send'])}</h2>
      <p class="lead rise m12">${esc(err?.message === 'this test is full' ? 'This test has all the testers it needs. Thank you anyway.' : 'Check your connection and try again. Your recordings are still on this phone.')}</p>
      <div class="grow"></div>
      <button class="btn rise" id="again">Try again</button>
      <button class="link rise" id="skip">Skip</button>
    </section>`);
    const d = topDial($, { bright: 0.45 });
    d.el.querySelector('.bz-pip').style.opacity = '0';
    $('#again').onclick = () => resolve('again');
    $('#skip').onclick = () => resolve('skip');
  });
}

export function thanksScreen(render, $) {
  const s = gate1.sent;
  return new Promise((resolve) => {
    if (s?.completion && gate1.prolific) {
      render(`<section class="screen c">
        <div class="grow"></div>
        <div class="c-col rise">${dialHtml(64, { numerals: false })}</div>
        <h2 class="h2 m24">${lines(['Sent. Thank you.'])}</h2>
        <p class="lead rise m12">Taking you back to Prolific to finish.</p>
        <p class="fine rise m16">Your code: <b>${esc(s.code)}</b>. Keep it if you ever want your recordings deleted.</p>
        <div class="grow"></div>
      </section>`);
      topDial($, { lit: true }).el.querySelector('.bz-pip').style.opacity = '0';
      setTimeout(() => location.assign(`https://app.prolific.com/submissions/complete?cc=${encodeURIComponent(s.completion)}`), 2500);
      return;
    }
    render(`<section class="screen c">
      <div class="grow"></div>
      <div class="c-col rise">${dialHtml(64, { numerals: false })}</div>
      <h2 class="h2 m24">${lines([s ? 'Sent. Thank you.' : 'Nothing was sent.'])}</h2>
      <p class="lead rise m12">${s ? 'Your recordings help us check the measurement on real phones.' : `Your recordings stay on this phone.${gate1.prolific ? ' If you came from Prolific, please return the study there.' : ''}`}</p>
      ${s ? `<div class="well heard rise m20 stretch"><p class="fine">Your code: <b>${esc(s.code)}</b>. Keep it if you ever want your recordings deleted: ${esc(CONTACT)}.</p></div>` : ''}
      <div class="grow"></div>
      <button class="btn ghost rise" id="again">Hear my before and after again</button>
    </section>`);
    topDial($, { lit: Boolean(s), bright: s ? 1 : 0.45 }).el.querySelector('.bz-pip').style.opacity = '0';
    $('#again').onclick = () => resolve('results');
  });
}
