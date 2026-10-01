/* Allergen Label Maker: the generator, the print pipeline, the founding-list capture. No dependencies. */
(function () {
  'use strict';

  var CFG = window.ALM_CONFIG || {};
  var A = window.Allergens;
  var IS_LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var FREE_PRINTS = typeof CFG.freePrints === 'number' ? CFG.freePrints : 3;
  var MAX_QTY = 12;

  var SIZES = {
    '2.25x1.25': { w: 2.25, h: 1.25, base: 7, type: 'roll', name: 'Small 2.25 × 1.25 in (57 × 32 mm)' },
    '3x2': { w: 3, h: 2, base: 9, type: 'roll', name: 'Medium 3 × 2 in (76 × 51 mm)' },
    '4x2': { w: 4, h: 2, base: 10, type: 'roll', name: 'Wide 4 × 2 in (102 × 51 mm)' },
    '4x6': { w: 4, h: 6, base: 16, type: 'roll', name: 'Large 4 × 6 in (102 × 152 mm)' },
    avery5163: {
      w: 4, h: 2, base: 10, type: 'sheet', name: 'Sheet of 10, Avery 5163 style, 4 × 2 in, US Letter',
      page: [8.5, 11], cols: 2, left: 0.15625, top: 0.5, px: 4.1875, py: 2, perPage: 10,
    },
  };

  var DEFAULTS = {
    region: 'us', name: '', ingredients: '', business: '', made: '', useBy: '',
    showIngredients: true, boldAllergens: true, showDates: false, size: '3x2', qty: 1, manual: {},
  };
  var state = load('alm_state_v1', DEFAULTS);
  var det = { found: {}, watch: [] };
  var lastFitPt = null;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- storage helpers (never throw)
  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return clone(fallback);
      var obj = JSON.parse(raw);
      var out = clone(fallback);
      Object.keys(fallback).forEach(function (k) { if (obj && typeof obj[k] === typeof fallback[k]) out[k] = obj[k]; });
      return out;
    } catch (e) { return clone(fallback); }
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function store(key, val) { try { localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val)); } catch (e) { /* private mode */ } }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function sread(key) { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) { return null; } }
  function swrite(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ } }
  var saveTimer;
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { store('alm_state_v1', state); }, 250); }

  // ---------- analytics + attribution live in site.js (shared with the other pages)
  var ALM = window.ALM || { track: function () {}, captureAttribution: function () { return {}; } };
  var track = ALM.track;
  var captureAttribution = ALM.captureAttribution;

  // ---------- text helpers
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function fmtDate(iso, region) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    var yy = m[1].slice(2);
    return region === 'uk' ? m[3] + '/' + m[2] + '/' + yy : m[2] + '/' + m[3] + '/' + yy;
  }
  function todayISO() {
    var d = new Date();
    var z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }

  // ---------- detection + label content
  function isChecked(id) {
    return Object.prototype.hasOwnProperty.call(state.manual, id) ? !!state.manual[id] : !!det.found[id];
  }
  function checkedIds() { return A.order(state.region).filter(isChecked); }

  function highlight(raw, ids) {
    var spans = A.spansFor(det.found, ids);
    var out = '', pos = 0;
    spans.forEach(function (s) {
      out += esc(raw.slice(pos, s[0])) + '<b>' + esc(raw.slice(s[0], s[1])) + '</b>';
      pos = s[1];
    });
    return out + esc(raw.slice(pos));
  }

  // UK pre-packed-for-direct-sale food needs the full ingredient list (Natasha's Law), so UK labels always print it.
  function withIngredients(s) { return s.showIngredients || s.region === 'uk'; }

  function labelHTML() {
    var s = state;
    var ids = checkedIds();
    var names = ids.map(function (id) { return A.label(id, s.region); });
    var raw = s.ingredients;
    var hasIng = withIngredients(s) && raw.trim();
    var parts = [];
    if (s.name.trim()) parts.push('<div class="l-name">' + esc(s.name.trim()) + '</div>');
    if (hasIng) {
      var bold = s.region === 'uk' || s.boldAllergens;
      var body = bold ? highlight(raw, ids) : esc(raw);
      parts.push('<div class="l-ing"><b>' + (s.region === 'uk' ? 'Ingredients' : 'INGREDIENTS') + ':</b> ' + body.trim() + '</div>');
    }
    if (names.length) parts.push('<div class="l-contains">Contains: ' + esc(names.join(', ')) + '</div>');
    if (s.showDates && (s.made || s.useBy)) {
      var d = [];
      if (s.made) d.push('Made ' + fmtDate(s.made, s.region));
      if (s.useBy) d.push('Use by ' + fmtDate(s.useBy, s.region));
      parts.push('<div class="l-dates">' + esc(d.join('   ·   ')) + '</div>');
    }
    if (s.business.trim()) parts.push('<div class="l-biz">' + esc(s.business.trim()) + '</div>');
    if (!parts.length) return '<div class="l-empty">Your label appears here.</div>';
    return parts.join('');
  }

  function plainText() {
    var s = state, names = checkedIds().map(function (id) { return A.label(id, s.region); });
    var lines = [];
    if (s.name.trim()) lines.push(s.name.trim().toUpperCase());
    if (withIngredients(s) && s.ingredients.trim()) lines.push('INGREDIENTS: ' + s.ingredients.trim());
    if (names.length) lines.push('CONTAINS: ' + names.join(', ').toUpperCase());
    if (s.showDates && (s.made || s.useBy)) lines.push([s.made && 'Made ' + fmtDate(s.made, s.region), s.useBy && 'Use by ' + fmtDate(s.useBy, s.region)].filter(Boolean).join(' · '));
    if (s.business.trim()) lines.push(s.business.trim());
    return lines.join('\n');
  }

  // ---------- label element + font fitting (true physical size)
  function makeLabel(size, pt) {
    var el = document.createElement('div');
    el.className = 'label';
    el.style.width = size.w + 'in';
    el.style.height = size.h + 'in';
    var inner = document.createElement('div');
    inner.className = 'label-inner';
    inner.innerHTML = labelHTML();
    if (pt) inner.style.fontSize = pt + 'pt';
    el.appendChild(inner);
    return el;
  }
  function fit(inner, basePt) {
    var pt = basePt, guard = 0;
    inner.style.fontSize = pt + 'pt';
    while (inner.scrollHeight > inner.clientHeight + 1 && pt > 4 && guard++ < 90) {
      pt -= 0.25;
      inner.style.fontSize = pt + 'pt';
    }
    return { pt: pt, overflow: inner.scrollHeight > inner.clientHeight + 1 };
  }

  function renderPreview() {
    var size = SIZES[state.size] || SIZES['3x2'];
    var stage = $('#preview-stage');
    var box = $('#scale-box');
    box.innerHTML = '';
    var label = makeLabel(size, null);
    box.appendChild(label);
    var res = fit($('.label-inner', label), size.base * 1.4);
    lastFitPt = res.pt;
    var availW = Math.max(180, stage.clientWidth - 36);
    var px = size.w * 96, ph = size.h * 96;
    var scale = Math.min(availW / px, 440 / ph, 2.6);
    label.style.transform = 'scale(' + scale + ')';
    box.style.width = px * scale + 'px';
    box.style.height = ph * scale + 'px';
    $('#preview-cap').textContent = 'Shown scaled to fit. Prints at ' + size.w + ' × ' + size.h + ' in' + (size.type === 'sheet' ? ' on US Letter. Print at 100% (Actual size).' : '.');
    $('#overflow-warn').hidden = !res.overflow;
  }

  // ---------- form <-> state
  function buildChips() {
    var box = $('#chips');
    box.innerHTML = '';
    A.order(state.region).forEach(function (id) {
      var lab = document.createElement('label');
      lab.className = 'chip';
      var inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.dataset.id = id;
      var sp = document.createElement('span');
      sp.appendChild(document.createTextNode(A.label(id, state.region)));
      var em = document.createElement('em');
      em.className = 'auto';
      em.textContent = 'found';
      em.hidden = true;
      sp.appendChild(em);
      lab.appendChild(inp);
      lab.appendChild(sp);
      box.appendChild(lab);
      inp.addEventListener('change', function () {
        state.manual[id] = inp.checked;
        track('allergen_toggle', { id: id, on: inp.checked, region: state.region });
        update();
      });
    });
  }

  function syncChips() {
    $$('#chips input').forEach(function (inp) {
      var id = inp.dataset.id;
      inp.checked = isChecked(id);
      var em = $('.auto', inp.parentNode);
      var hits = det.found[id];
      em.hidden = !hits;
      inp.parentNode.title = hits ? 'Found in your text: ' + hits.map(function (h) { return h.term.toLowerCase(); }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(', ') : '';
    });
  }

  function renderNotes() {
    var ul = $('#notes');
    ul.innerHTML = '';
    var add = function (txt, cls) { var li = document.createElement('li'); if (cls) li.className = cls; li.textContent = txt; ul.appendChild(li); };
    if (state.ingredients.trim()) {
      var ids = A.order(state.region).filter(function (id) { return det.found[id]; });
      if (ids.length) {
        add('Found in your text: ' + ids.map(function (id) {
          var terms = det.found[id].map(function (h) { return h.term.toLowerCase(); }).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 3);
          return A.label(id, state.region) + ' (' + terms.join(', ') + ')';
        }).join('; ') + '. Check every box before you print.', 'ok');
      } else {
        add('No allergens found in the text. If that is right, no "Contains" line will print. Read it once more against your supplier labels.');
      }
    }
    det.watch.forEach(function (w) { add(w.note); });
  }

  function update() {
    det = A.detect(state.ingredients, state.region);
    syncChips();
    renderNotes();
    renderPreview();
    var uk = state.region === 'uk';
    var bold = $('#opt-bold');
    bold.checked = uk ? true : state.boldAllergens;
    bold.disabled = uk;
    var ing = $('#opt-ing');
    ing.checked = uk ? true : state.showIngredients;
    ing.disabled = uk;
    $('#region-note').textContent = uk
      ? '14 allergens (UK/EU). For pre-packed food sold on the premises, the label needs the food name and a full ingredients list with allergens emphasised, as Natasha\'s Law requires.'
      : '9 major allergens (FDA). New York\'s 2026 law uses this list.';
    $('#date-fields').hidden = !state.showDates;
    saveSoon();
  }

  function bindField(sel, key, type) {
    var el = $(sel);
    if (!el) return;
    if (type === 'check') el.checked = !!state[key];
    else el.value = state[key];
    el.addEventListener('input', function () {
      state[key] = type === 'check' ? el.checked : type === 'num' ? Math.max(1, Math.min(MAX_QTY, parseInt(el.value, 10) || 1)) : el.value;
      if (key === 'showDates' && state.showDates && !state.made) { state.made = todayISO(); $('#f-made').value = state.made; }
      if (key === 'ingredients' && !state.__typed) { state.__typed = true; track('tool_start', { region: state.region }); }
      update();
    });
  }

  // ---------- printing
  function hasContent() { return !!(state.name.trim() || state.ingredients.trim()); }
  function freeLeft() {
    if (read('alm_unlock') === '1') return Infinity;
    return Math.max(0, FREE_PRINTS - (parseInt(read('alm_prints'), 10) || 0));
  }
  function updateCounter() {
    var n = freeLeft();
    var c = $('#counter');
    c.textContent = n === Infinity ? 'Unlocked' : n > 0 ? n + ' free print' + (n === 1 ? '' : 's') + ' left' : 'Free prints used';
  }

  function buildPrintPages() {
    var size = SIZES[state.size] || SIZES['3x2'];
    var root = $('#print-root');
    root.innerHTML = '';
    var pt = lastFitPt || size.base;
    var qty = state.qty;
    var style = $('#page-style');
    if (size.type === 'roll') {
      style.textContent = '@page{size:' + size.w + 'in ' + size.h + 'in;margin:0}';
      for (var i = 0; i < qty; i++) {
        var page = document.createElement('div');
        page.className = 'print-page';
        page.style.width = size.w + 'in';
        page.style.height = size.h + 'in';
        page.appendChild(makeLabel(size, pt));
        root.appendChild(page);
      }
    } else {
      style.textContent = '@page{size:' + size.page[0] + 'in ' + size.page[1] + 'in;margin:0}';
      var placed = 0;
      while (placed < qty) {
        var sheet = document.createElement('div');
        sheet.className = 'print-page sheet';
        sheet.style.width = size.page[0] + 'in';
        sheet.style.height = size.page[1] + 'in';
        for (var k = 0; k < size.perPage && placed < qty; k++, placed++) {
          var l = makeLabel(size, pt);
          l.style.left = size.left + (k % size.cols) * size.px + 'in';
          l.style.top = size.top + Math.floor(k / size.cols) * size.py + 'in';
          sheet.appendChild(l);
        }
        root.appendChild(sheet);
      }
    }
  }

  function onPrint() {
    if (!hasContent()) { toast('Add a product name or ingredients first.'); return; }
    track('print_click', { region: state.region, size: state.size, qty: state.qty, allergens: checkedIds().length });
    if (freeLeft() <= 0) {
      track('limit_hit', { region: state.region });
      openLead('limit');
      return;
    }
    buildPrintPages();
    store('alm_prints', String((parseInt(read('alm_prints'), 10) || 0) + 1));
    updateCounter();
    track('print_done', { region: state.region, size: state.size, qty: state.qty });
    setTimeout(function () { window.print(); }, 60);
  }
  window.addEventListener('afterprint', function () { var r = $('#print-root'); if (r) r.innerHTML = ''; });

  function onCopy() {
    if (!hasContent()) { toast('Nothing to copy yet.'); return; }
    var txt = plainText();
    var done = function () { toast('Label text copied.'); track('copy_text'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { toast('Copy blocked by the browser.'); });
    else toast('Copy is not supported in this browser.');
  }

  // ---------- toast
  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  // ---------- founding list (lead capture)
  var dlg;
  function openLead(source, plan) {
    if (CFG.paymentLink && source === 'pricing') {
      track('checkout_click', { plan: plan || 'shop' });
      window.location.href = CFG.paymentLink;
      return;
    }
    dlg = dlg || $('#lead-dialog');
    $('#lead-source').value = source || 'page';
    $('#lead-limit-copy').hidden = source !== 'limit';
    if (plan) { var r = $('input[name="plan"][value="' + plan + '"]', dlg); if (r) r.checked = true; }
    $('#lead-form').hidden = false;
    $('#lead-done').hidden = true;
    $('#lead-err').textContent = '';
    track('lead_open', { source: source || 'page', plan: plan || '' });
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    var em = $('#lead-email'); if (em) setTimeout(function () { em.focus(); }, 30);
  }

  function sendLead(data) {
    var attr = captureAttribution();
    var payload = Object.assign({}, data, attr, { region: state.region, printed: read('alm_prints') || '0', page: location.pathname, at: new Date().toISOString() });
    var saved = []; try { saved = JSON.parse(read('alm_leads') || '[]'); } catch (e) { saved = []; }
    saved.push(payload); store('alm_leads', saved);
    if (CFG.web3formsKey) {
      return fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.assign({ access_key: CFG.web3formsKey, subject: 'Allergen Label Maker: new founding-list signup', from_name: 'Allergen Label Maker' }, payload)),
      }).then(function (r) { return r.json(); }).then(function (j) { if (!j.success) throw new Error(j.message || 'Could not save'); });
    }
    if (CFG.leadEndpoint) {
      return fetch(CFG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { if (!r.ok) throw new Error('Could not save'); });
    }
    if (IS_LOCAL) { console.warn('[lead] no web3formsKey/leadEndpoint set; stored in localStorage only', payload); return Promise.resolve('local'); }
    if (CFG.contactEmail) {
      var body = 'Please add me to the Allergen Label Maker founding list.\n\nEmail: ' + payload.email + '\nPlan: ' + payload.plan +
        '\nBusiness: ' + payload.business_type + '\nItems I label: ' + payload.items;
      window.location.href = 'mailto:' + CFG.contactEmail + '?subject=' + encodeURIComponent('Allergen Label Maker founding list') + '&body=' + encodeURIComponent(body);
      return Promise.resolve('mailto');
    }
    return Promise.reject(new Error('Signup is not connected yet.'));
  }

  function bindLead() {
    var form = $('#lead-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var fd = new FormData(form);
      var data = { email: String(fd.get('email') || '').trim(), plan: fd.get('plan') || 'shop', business_type: fd.get('business_type') || '', items: fd.get('items') || '', source: fd.get('source') || '' };
      var btn = $('button[type=submit]', form); btn.disabled = true; btn.textContent = 'Saving…';
      sendLead(data).then(function (via) {
        track('lead_submit', { source: data.source, plan: data.plan, business_type: data.business_type, via: via || 'form' });
        store('alm_unlock', '1');
        updateCounter();
        $('#lead-done-mailto').hidden = via !== 'mailto';
        form.hidden = true; $('#lead-done').hidden = false;
      }).catch(function (err) {
        $('#lead-err').textContent = (err && err.message ? err.message : 'Could not save.') + ' Please try again.';
      }).then(function () { btn.disabled = false; btn.textContent = 'Join the founding list'; });
    });
    $$('[data-close]').forEach(function (b) { b.addEventListener('click', function () { var d = $('#lead-dialog'); if (d.close) d.close(); else d.removeAttribute('open'); }); });
    var d = $('#lead-dialog');
    d.addEventListener('click', function (e) { if (e.target === d && d.close) d.close(); });
  }

  // ---------- init
  function init() {
    var qp = new URLSearchParams(location.search);
    if (qp.get('unlock') === '1') store('alm_unlock', '1');
    if (qp.get('region') === 'uk' || qp.get('region') === 'us') { state.region = qp.get('region'); }
    if (!SIZES[state.size]) state.size = '3x2';

    // region + size controls
    $$('input[name="region"]').forEach(function (r) {
      r.checked = r.value === state.region;
      r.addEventListener('change', function () {
        if (!r.checked) return;
        state.region = r.value; state.manual = {};
        buildChips(); update();
        track('region_change', { region: state.region });
      });
    });
    var sel = $('#f-size');
    Object.keys(SIZES).forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = SIZES[k].name; sel.appendChild(o); });
    sel.value = state.size;
    sel.addEventListener('change', function () { state.size = sel.value; update(); });

    bindField('#f-name', 'name');
    bindField('#f-ing', 'ingredients');
    bindField('#f-biz', 'business');
    bindField('#f-made', 'made');
    bindField('#f-useby', 'useBy');
    bindField('#opt-ing', 'showIngredients', 'check');
    bindField('#opt-bold', 'boldAllergens', 'check');
    bindField('#opt-dates', 'showDates', 'check');
    bindField('#f-qty', 'qty', 'num');

    $('#btn-print').addEventListener('click', onPrint);
    $('#btn-copy').addEventListener('click', onCopy);
    $('#btn-example').addEventListener('click', function () {
      state.name = state.region === 'uk' ? 'Victoria sponge' : 'Blueberry muffin';
      state.ingredients = state.region === 'uk'
        ? 'Wheat flour, butter, caster sugar, eggs, milk, raising agent, vanilla extract, strawberry jam'
        : 'Enriched flour (wheat), sugar, butter, eggs, milk, blueberries, baking powder, vanilla, salt, sesame seeds';
      state.manual = {};
      $('#f-name').value = state.name; $('#f-ing').value = state.ingredients;
      track('example_click', { region: state.region });
      update();
    });
    $$('[data-lead]').forEach(function (b) { b.addEventListener('click', function () { openLead(b.dataset.lead, b.dataset.plan); }); });

    buildChips();
    bindLead();
    updateCounter();
    update();
    track('tool_view', { region: state.region });

    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(renderPreview, 120); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // small hook for the browser test
  window.__ALM = { state: function () { return state; }, detect: function () { return det; }, buildPrintPages: buildPrintPages, labelHTML: labelHTML };
})();
