/* Twinsy — an independent, buildless product experience. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#${name}"/></svg>`;
  const mark = '<svg aria-hidden="true"><use href="#brand-symbol"/></svg>';
  const accounts = [
    { icon: 'chat', name: 'Friends & family', app: 'Chat', time: '9 MIN AGO' },
    { icon: 'mail', name: 'Work mail', app: 'Mail', time: '3 H AGO' },
    { icon: 'notes', name: 'Little ideas', app: 'Notes', time: 'NOT OPENED YET' }
  ];

  const status = () => '<div class="app-status"><span>9:41</span><span class="status-icons" aria-hidden="true"><span class="signal"></span><span class="battery"></span></span></div>';
  const appTop = () => `<div class="app-top"><span class="app-brand">${mark} Twinsy</span><span class="mono">SETTINGS</span></div>`;
  const bottom = (label = 'Add an app') => `<div class="app-bottom"><div class="app-health"><span class="health-dot"></span> ENGINE READY <span class="health-dot"></span> ALERTS ON</div><div class="app-add">${label}${icon('plus')}</div><div class="app-home-indicator"></div></div>`;

  function library(look = 'index', ready = false) {
    const title = look === 'passes' ? 'Your copies' : look === 'field' ? '3<span>apps with<br> a second account</span>' : 'Copies<sup>03</sup>';
    const hint = look === 'passes' ? 'Tap a card to open that account. Hold it for options.' : 'TAP TO OPEN — HOLD FOR OPTIONS';
    const rows = accounts.map((account, i) => `<div class="app-row"><span class="mono">0${i + 1}</span><span class="app-glyph">${icon(account.icon)}</span><span class="app-row-copy"><strong>${account.name}</strong><small><span class="account-square"></span>${look === 'passes' ? account.app : account.time}</small></span>${icon('arrow-up')}</div>`).join('');
    return `<div class="app-ui ${look}">${status()}${appTop()}<div class="app-title">${title}</div><div class="app-hint">${hint}</div>${ready ? `<div class="ready-flag">${icon('check')} YOUR COPY IS READY</div>` : ''}<div class="app-list">${rows}</div>${bottom()}</div>`;
  }

  function picker() {
    return `<div class="app-ui index">${status()}${appTop()}<div class="app-title">Choose<br> your app.</div><div class="app-hint">START WITH SOMETHING FAMILIAR.</div><div class="picker-search">Search your installed apps</div>${[
      ['chat', 'Chat'], ['mail', 'Mail'], ['notes', 'Notes'], ['photo', 'Photos']
    ].map(([symbol, name]) => `<div class="picker-row"><span class="app-glyph">${icon(symbol)}</span>${name}${icon('plus')}</div>`).join('')}${bottom('Choose an app')}</div>`;
  }

  function customize() {
    return `<div class="app-ui index">${status()}${appTop()}<div class="app-title">Make it<br> yours.</div><div class="name-preview"><span class="app-glyph">${icon('mail')}</span><strong>Work mail</strong></div><p class="name-label">GIVE IT A NAME</p><div class="name-field">Work mail</div><div class="swatches" aria-hidden="true"><span></span><span></span><span></span><span></span></div><p class="preview-caption">A name and a colour.<br> A little space that feels like yours.</p>${bottom('Create copy')}</div>`;
  }

  document.querySelectorAll('[data-screen]').forEach(screen => {
    screen.innerHTML = library(screen.dataset.screen);
  });

  function enter(element, keyboard = false) {
    element.getAnimations().forEach(animation => animation.cancel());
    if (reduceMotion.matches || keyboard) return;
    element.animate([
      { opacity: .4, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 380, easing: 'cubic-bezier(.23,1,.32,1)' });
  }

  /* Native tabs remain usable with keyboard, touch, and rapid selection. */
  function wireTabs(selector, onChange) {
    const tabs = Array.from(document.querySelectorAll(selector));
    function select(tab, keyboard = false) {
      if (tab.getAttribute('aria-selected') === 'true') return;
      tabs.forEach(item => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      onChange(tab, keyboard);
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', event => select(tab, event.detail === 0));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(tabs[next], true);
        tabs[next].focus();
      });
    });
  }

  const ritual = document.getElementById('ritual-screen');
  const ritualPanel = document.getElementById('ritual-preview');
  const stepViews = [picker, customize, () => library('index', true)];
  const captions = ['01 / CHOOSE AN INSTALLED APP', '02 / GIVE YOUR COPY A LITTLE CHARACTER', '03 / ANOTHER ACCOUNT. ALL YOURS.'];
  ritual.innerHTML = picker();
  wireTabs('.ritual-step', (tab, keyboard) => {
    const step = Number(tab.dataset.step);
    ritual.innerHTML = stepViews[step]();
    ritualPanel.setAttribute('aria-labelledby', tab.id);
    document.querySelector('.ritual-caption').textContent = captions[step];
    enter(ritual, keyboard);
  });

  const looks = {
    index: { name: 'Index', material: 'PAPER. INK. A LITTLE ORDER.', heading: 'A quiet kind<br> of clarity.', description: 'Warm paper, crisp rules, and numbered copies. Everything in its right place.', selection: 'INDEX / THE ORIGINAL', number: '01 / 03' },
    passes: { name: 'Passes', material: 'RICH COLOUR. A DIFFERENT PERSPECTIVE.', heading: 'A place for<br> every part of you.', description: 'Layered cards, deep tones, and a tactile sense of space. Your accounts, with a little more character.', selection: 'PASSES / A LITTLE DEPTH', number: '02 / 03' },
    field: { name: 'Field', material: 'OPEN SPACE. BOLD BY NATURE.', heading: 'A brighter<br> state of mind.', description: 'An open field of blue and a familiar app grid. Everything you need, with room to breathe.', selection: 'FIELD / WIDE OPEN', number: '03 / 03' }
  };
  const looksSection = document.getElementById('looks');
  const showcase = document.getElementById('showcase-screen');
  const lookTabs = document.querySelector('.look-controls');
  const compactLayout = window.matchMedia('(max-width: 600px)');
  const updateTabOrientation = () => {
    lookTabs.setAttribute('aria-orientation', compactLayout.matches ? 'horizontal' : 'vertical');
  };
  updateTabOrientation();
  compactLayout.addEventListener('change', updateTabOrientation);
  wireTabs('.look-tab', (tab, keyboard) => {
    const key = tab.dataset.look;
    const look = looks[key];
    looksSection.dataset.look = key;
    showcase.innerHTML = library(key);
    document.getElementById('look-preview').setAttribute('aria-labelledby', tab.id);
    document.querySelector('.look-background-word').textContent = look.name;
    document.querySelector('.look-material').textContent = look.material;
    document.querySelector('.look-caption h3').innerHTML = look.heading;
    document.querySelector('.look-description').textContent = look.description;
    document.querySelector('.look-selection').textContent = look.selection;
    document.querySelector('.theater-bottom span:last-child').textContent = look.number;
    enter(showcase, keyboard);
    enter(document.querySelector('.look-caption'), keyboard);
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  function closeMenu(returnFocus = false) {
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    if (returnFocus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'false';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });
  window.matchMedia('(min-width: 601px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  document.getElementById('year').textContent = new Date().getFullYear();
  document.documentElement.classList.add('js-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  /* Each account finds its own space as the native scroll moves the scene. */
  const hero = document.querySelector('.hero');
  const handsets = document.querySelector('.handsets');
  const frontPhone = document.querySelector('.handset-front');
  const backPhone = document.querySelector('.handset-back');
  const depthLayout = window.matchMedia('(min-width: 601px)');
  let heroVisible = true;
  let frame = 0;
  let posesDirty = true;
  let frontPose = '';
  let backPose = '';
  const heroObserver = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible) queueDepth();
  });
  heroObserver.observe(hero);

  function queueDepth() {
    if (!frame) frame = requestAnimationFrame(updateDepth);
  }

  function refreshPoses() {
    posesDirty = true;
    queueDepth();
  }

  function updateDepth() {
    frame = 0;
    if (posesDirty) {
      frontPhone.style.transform = '';
      backPhone.style.transform = '';
      frontPose = getComputedStyle(frontPhone).transform;
      backPose = getComputedStyle(backPhone).transform;
      posesDirty = false;
    }
    if (reduceMotion.matches || !depthLayout.matches) {
      handsets.style.transform = '';
      frontPhone.style.transform = '';
      backPhone.style.transform = '';
      return;
    }
    const progress = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
    handsets.style.transform = `translate3d(0,${(progress * 55).toFixed(2)}px,0) rotateX(${(progress * 2).toFixed(2)}deg)`;
    frontPhone.style.transform = `${frontPose} translate3d(${(-progress * 32).toFixed(2)}px,${(-progress * 10).toFixed(2)}px,0) rotateZ(${(-progress * 3).toFixed(2)}deg)`;
    backPhone.style.transform = `${backPose} translate3d(${(progress * 38).toFixed(2)}px,${(progress * 10).toFixed(2)}px,0) rotateZ(${(progress * 4).toFixed(2)}deg)`;
  }
  window.addEventListener('scroll', () => { if (heroVisible) queueDepth(); }, { passive: true });
  window.addEventListener('resize', refreshPoses, { passive: true });
  reduceMotion.addEventListener('change', refreshPoses);
  depthLayout.addEventListener('change', refreshPoses);
  queueDepth();
})();
