// Gate 1 lab screens: #/lab (sessions, gate status, export) and #/listen (blind A/B test).
import { lab } from './store.js';
import { localEvents } from '../track.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const NEED_TESTERS = 10;
const NEED_DROPS = 8;
const NEED_LISTENERS = 3;
const LISTEN_PASS = 0.8;

function listenerStats(listens) {
  const by = new Map();
  for (const l of listens) {
    const s = by.get(l.listener) || { listener: l.listener, total: 0, correct: 0 };
    s.total++;
    if (l.pickedAfter === true) s.correct++;
    by.set(l.listener, s);
  }
  return [...by.values()];
}

function download(name, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

// Playback through WebAudio, not <audio>: no media URLs for download managers (IDM) to grab.
let actx = null;
let current = null;
function stopAudio() {
  try {
    current?.stop();
  } catch {
    /* already stopped */
  }
  current = null;
}
async function play(blob) {
  stopAudio();
  actx ??= new (window.AudioContext || window.webkitAudioContext)();
  await actx.resume();
  const buf = await actx.decodeAudioData(await blob.arrayBuffer());
  const src = actx.createBufferSource();
  src.buffer = buf;
  src.connect(actx.destination);
  src.start();
  current = src;
}

async function blobToBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export async function renderLab(app) {
  const sessions = await lab.listSessions();
  const listens = await lab.listListens();
  const drops = sessions.filter((s) => s.cmp?.measurableDrop).length;
  const stats = listenerStats(listens);
  const passingListeners = stats.filter((s) => s.total >= Math.min(8, sessions.length) && s.correct / s.total >= LISTEN_PASS).length;
  const dropPass = sessions.length >= NEED_TESTERS && drops / sessions.length >= NEED_DROPS / NEED_TESTERS;
  const listenPass = passingListeners >= NEED_LISTENERS;
  const row = (s, i) => `<tr>
      <td>${esc(s.tester)}${s.retried ? ' <small>(retry)</small>' : ''}</td>
      <td>${Math.round(s.before.f0Median)} → ${Math.round(s.after.f0Median)}</td>
      <td>${s.cmp.dSt.toFixed(1)}</td>
      <td>${Number.isFinite(s.cmp.dDfPct) ? s.cmp.dDfPct.toFixed(1) : '–'}%</td>
      <td class="${s.cmp.measurableDrop ? 'ok' : 'no'}">${s.cmp.measurableDrop ? 'yes' : 'no'}</td>
      <td class="acts"><button data-p="b${i}" title="Play before">▶ B</button><button data-p="a${i}" title="Play after">▶ A</button></td>
    </tr>`;
  app.innerHTML = `<section class="screen labscreen">
    <div class="kicker">Lab · Gate 1</div>
    <h2>Does the 60-second reset really deepen voices?</h2>
    <label class="toggle"><input type="checkbox" id="on" ${lab.enabled() ? 'checked' : ''}> Save sessions on this device</label>
    <div class="gates">
      <div class="gate ${dropPass ? 'pass' : ''}"><b>${drops} / ${sessions.length}</b><span>measurable drop (need ${NEED_DROPS} of ${NEED_TESTERS} testers: ≥1 semitone or ≥3% resonance)</span></div>
      <div class="gate ${listenPass ? 'pass' : ''}"><b>${passingListeners} / ${NEED_LISTENERS}</b><span>blind listeners who picked "after" as deeper and natural in ≥80% of pairs</span></div>
    </div>
    ${stats.length ? `<ul class="listeners">${stats.map((s) => `<li>${esc(s.listener)}: ${s.correct}/${s.total}</li>`).join('')}</ul>` : ''}
    <div class="tablewrap"><table>
      <thead><tr><th>Tester</th><th>Hz</th><th>Δ st</th><th>Δ res</th><th>Drop</th><th></th></tr></thead>
      <tbody>${sessions.map(row).join('') || '<tr><td colspan="6">No sessions yet. Turn saving on, then run the demo with each tester.</td></tr>'}</tbody>
    </table></div>
    <div class="row">
      <a class="btn primary" href="#/listen">Start blind listening test</a>
    </div>
    <div class="row">
      <button class="btn ghost small" id="exp" title="One JSON file with numbers and recordings">Export</button>
      <a class="btn ghost small" href="#/">Run the demo</a>
      <button class="btn ghost small danger" id="clr">Delete all</button>
    </div>
  </section>`;
  app.querySelector('#on').onchange = (e) => lab.setEnabled(e.target.checked);
  app.querySelectorAll('[data-p]').forEach((b) => {
    b.onclick = () => {
      const k = b.dataset.p;
      const s = sessions[Number(k.slice(1))];
      play(k[0] === 'b' ? s.beforeWav : s.afterWav);
    };
  });
  // One JSON file with every recording inside (base64 WAV). No .wav downloads for IDM to hijack.
  app.querySelector('#exp').onclick = async (e) => {
    e.target.disabled = true;
    e.target.textContent = 'Packing…';
    const out = [];
    for (const { beforeWav, afterWav, ...rest } of sessions) {
      out.push({ ...rest, beforeWavB64: await blobToBase64(beforeWav), afterWavB64: await blobToBase64(afterWav) });
    }
    const data = { exportedAt: new Date().toISOString(), sessions: out, listens, events: localEvents() };
    download(`voice-lab-${Date.now()}.json`, new Blob([JSON.stringify(data)], { type: 'application/json' }));
    e.target.disabled = false;
    e.target.textContent = 'Export';
  };
  app.querySelector('#clr').onclick = async () => {
    if (!confirm('Delete every lab session and listening answer on this device?')) return;
    await lab.clearAll();
    renderLab(app);
  };
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function renderListen(app) {
  const sessions = await lab.listSessions();
  if (!sessions.length) {
    app.innerHTML = `<section class="screen"><h2>No recordings yet</h2><p class="lead">Record testers first.</p><a class="btn primary" href="#/lab">Back to lab</a></section>`;
    return;
  }
  app.innerHTML = `<section class="screen">
    <div class="kicker">Blind listening test</div>
    <h2>You'll hear two clips of the same person.</h2>
    <p class="lead">Pick the one that sounds deeper <b>and</b> natural. If you can't tell, say so. You won't see any numbers.</p>
    <label class="field"><span>Your name</span><input id="who" autocomplete="off"></label>
    <div class="grow"></div>
    <button class="btn primary" id="go">Start (${sessions.length} pairs)</button>
  </section>`;
  app.querySelector('#go').onclick = () => {
    const who = app.querySelector('#who').value.trim();
    if (!who) return app.querySelector('#who').focus();
    const order = shuffle(sessions.map((s) => ({ s, afterIsA: Math.random() < 0.5 })));
    pair(app, who, order, 0);
  };
}

function pair(app, who, order, i) {
  if (i >= order.length) {
    app.innerHTML = `<section class="screen"><h2>Done. Thank you, ${esc(who)}.</h2><p class="lead">Hand the phone back.</p><a class="btn primary" href="#/lab">See lab results</a></section>`;
    return;
  }
  const { s, afterIsA } = order[i];
  const A = afterIsA ? s.afterWav : s.beforeWav;
  const B = afterIsA ? s.beforeWav : s.afterWav;
  app.innerHTML = `<section class="screen">
    <div class="kicker">Pair ${i + 1} of ${order.length}</div>
    <h2>Which sounds deeper and natural?</h2>
    <div class="ab">
      <button class="abplay" id="pa">▶ Play A</button>
      <button class="abplay" id="pb">▶ Play B</button>
    </div>
    <div class="grow"></div>
    <div class="row three">
      <button class="btn ghost" data-pick="A">A</button>
      <button class="btn ghost" data-pick="B">B</button>
      <button class="btn ghost" data-pick="x">Can't tell</button>
    </div>
  </section>`;
  app.querySelector('#pa').onclick = () => play(A);
  app.querySelector('#pb').onclick = () => play(B);
  app.querySelectorAll('[data-pick]').forEach((b) => {
    b.onclick = async () => {
      stopAudio();
      const p = b.dataset.pick;
      const pickedAfter = p === 'x' ? null : (p === 'A') === afterIsA;
      await lab.saveListen({ id: `${who}::${s.id}`, listener: who, sessionId: s.id, pickedAfter, at: new Date().toISOString() });
      pair(app, who, order, i + 1);
    };
  });
}
