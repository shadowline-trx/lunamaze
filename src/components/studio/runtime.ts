/**
 * The studio home's runtime. Everything it touches is already server-rendered;
 * this only adds motion on top:
 *
 * - the pinned hero: scroll progress, the maze camera, the thread, the HUD;
 * - the page thread that runs down the gutter to the epilogue;
 * - reveals, the nav, and rooms that animate only while on screen;
 * - on fine pointers, a cursor, magnetic buttons and glass that catches the
 *   pointer's light;
 * - after the first gesture, the WebGL layer that relights the labyrinth.
 *
 * It writes a handful of CSS custom properties per frame and nothing else, so
 * layout never runs during scroll.
 *
 * Framework-free on purpose: the production home page ships as static HTML
 * plus this file (bundled by scripts/static-islands.mjs), with no React
 * runtime and no hydration payload. `StudioEnhancer` calls the same function
 * when the page is rendered by Next itself (dev, client-side navigation).
 */

import type { LabyrinthTint } from './labyrinth-gl';

interface HeroState {
  tint: LabyrinthTint;
  centreX: number;
  centreY: number;
  radius: number;
  rotation: number;
  progress: number;
  head: [number, number];
  pointer: [number, number];
  pointerActive: number;
}

const THEMES = [
  { id: '', name: 'Moonlight' },
  { id: 'eclipse', name: 'Blood moon' },
  { id: 'tide', name: 'Blue moon' },
] as const;

const rgb = (value: string): [number, number, number] => {
  const hex = value.trim().replace('#', '');
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex, 16);
  if (Number.isNaN(n)) return [0.7, 0.63, 1];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** The theme's colours, read back from the tokens the stylesheet resolved. */
const readTint = (root: HTMLElement): LabyrinthTint => {
  const cs = getComputedStyle(root);
  const pick = (name: string): string => cs.getPropertyValue(name);
  return {
    soft: rgb(pick('--violet-soft')),
    deep: rgb(pick('--violet-deep')),
    crA: rgb(pick('--cr-a')),
    crC: rgb(pick('--cr-c')),
    key: root.getAttribute('data-theme') ?? 'moonlight',
  };
};

const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const smooth = (a: number, b: number, v: number): number => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function startStudio(): () => void {
  const root = document.querySelector<HTMLElement>('[data-studio]');
  if (!root) return () => undefined;
  // The boot script in page.tsx sets data-js before the first paint, so the
  // reveal states are part of the first style pass rather than a restyle of
  // the whole page now. (When Next renders the page itself, it is set here.)
  // Nothing is measured up front: reveals are left to the observer below.
  if (!root.hasAttribute('data-js')) root.setAttribute('data-js', '');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cleanups: Array<() => void> = [];

  /* ------------------------------------------------------------ Reveal */
  const revealIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-in', '');
        revealIo.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
  );
  root.querySelectorAll('[data-reveal], [data-finale]').forEach((el) => revealIo.observe(el));
  cleanups.push(() => revealIo.disconnect());

  /* ------------------------- Decorative loops run only while on screen */
  const loopIo = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.toggleAttribute('data-onscreen', entry.isIntersecting);
  });
  root.querySelectorAll('[data-loop]').forEach((el) => loopIo.observe(el));
  cleanups.push(() => loopIo.disconnect());

  /* ------------------------------------------------ Nav + chapter name */
  const nav = root.querySelector<HTMLElement>('[data-nav]');
  const chapterLabel = root.querySelector<HTMLElement>('[data-nav-chapter]');
  const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'));
  let currentChapter = 'Prologue';
  const chapterIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const name = (entry.target as HTMLElement).dataset.chapter ?? '';
        if (name === currentChapter || !chapterLabel) continue;
        currentChapter = name;
        chapterLabel.setAttribute('data-swap', '');
        window.setTimeout(() => {
          chapterLabel.textContent = name;
          chapterLabel.removeAttribute('data-swap');
        }, 260);
      }
    },
    { rootMargin: '-45% 0px -54% 0px' },
  );
  chapters.forEach((el) => chapterIo.observe(el));
  cleanups.push(() => chapterIo.disconnect());

  /* -------------------------------------------------------------- Hero */
  const hero = root.querySelector<HTMLElement>('[data-hero]');
  const stage = root.querySelector<HTMLElement>('[data-hero-stage]');
  const frame = root.querySelector<HTMLElement>('[data-maze-frame]');
  const mazeBody = root.querySelector<HTMLElement>('[data-maze]');
  const threadPath = root.querySelector<SVGPathElement>('#lm-thread');
  const head = root.querySelector<SVGGElement>('[data-thread-head]');
  const hudPath = root.querySelector<HTMLElement>('[data-hud-path]');
  const hudRing = root.querySelector<HTMLElement>('[data-hud-ring]');
  const hudPhase = root.querySelector<HTMLElement>('[data-hud-phase]');
  const beats = root.querySelector<HTMLElement>('[data-beats]');
  const threadLength = threadPath?.getTotalLength() ?? 0;
  const ringHeight = 440 / 9;

  const heroState: HeroState = {
    tint: readTint(root),
    centreX: 0,
    centreY: 0,
    radius: 1,
    rotation: 0,
    progress: 0,
    head: [0, 0],
    pointer: [-9999, -9999],
    pointerActive: 0,
  };

  let frameRect = { x: 0, y: 0, size: 1 };
  let stageSize = { w: window.innerWidth, h: window.innerHeight };
  let heroTop = 0;
  let heroScroll = 1;
  let lastPath = -1;
  let lastRing = -1;
  let lastPhase = -1;
  let lastBeat = -1;
  let pastCopy = false;
  let wasMoving = false;
  let wasBlooming = false;

  const measure = (): void => {
    if (!hero || !stage || !frame) return;
    const heroRect = hero.getBoundingClientRect();
    heroTop = heroRect.top + window.scrollY;
    heroScroll = Math.max(1, hero.offsetHeight - stage.offsetHeight);
    stageSize = { w: stage.clientWidth, h: stage.clientHeight };
    // The frame is never transformed, so its box is the maze at rest.
    const r = frame.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    frameRect = { x: r.left - stageRect.left + r.width / 2, y: r.top - stageRect.top + r.height / 2, size: r.width };
  };

  const updateHero = (): void => {
    if (!hero || !mazeBody) return;
    const p = reduced ? 0 : clamp((window.scrollY - heroTop) / heroScroll);
    const e = ease(smooth(0.02, 0.96, p));
    const mobile = stageSize.w < 760;
    const zoom = 1 + e * (mobile ? 0.28 : 0.42);
    const rot = -e * 26;
    const dx = (stageSize.w / 2 - frameRect.x) * e;
    const dy = (stageSize.h / 2 - frameRect.y) * e;
    mazeBody.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${zoom.toFixed(4)}) rotate(${rot.toFixed(3)}deg)`;

    const tp = reduced ? 1 : 0.018 + 0.982 * smooth(0.06, 0.88, p);
    const bars = smooth(0.04, 0.22, p) * (1 - smooth(0.9, 1, p));
    const bloom = smooth(0.86, 0.99, p);
    hero.style.setProperty('--p', p.toFixed(4));
    hero.style.setProperty('--tp', tp.toFixed(4));
    hero.style.setProperty('--bars', bars.toFixed(4));
    hero.style.setProperty('--bloom', bloom.toFixed(4));

    if (threadPath && head) {
      const point = threadPath.getPointAtLength(tp * threadLength);
      head.setAttribute('transform', `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
      heroState.head = [point.x, point.y];
      const ring = Math.min(9, Math.max(0, Math.floor(Math.hypot(point.x, point.y) / ringHeight)));
      if (ring !== lastRing && hudRing) {
        hudRing.textContent = String(ring).padStart(2, '0');
        lastRing = ring;
      }
    }

    const pathPct = Math.round(tp * 100);
    if (pathPct !== lastPath && hudPath) {
      hudPath.textContent = String(pathPct).padStart(3, '0');
      lastPath = pathPct;
    }
    const phase = Math.min(4, Math.floor(tp * 4.999));
    if (phase !== lastPhase && hudPhase) {
      hudPhase.setAttribute('data-hud-phase', String(phase));
      lastPhase = phase;
    }
    const beat = p < 0.14 ? 0 : p < 0.4 ? 1 : p < 0.66 ? 2 : p < 0.94 ? 3 : 0;
    if (beat !== lastBeat && beats) {
      beats.setAttribute('data-beat', String(beat));
      lastBeat = beat;
    }
    const past = p > 0.25;
    if (past !== pastCopy) {
      hero.toggleAttribute('data-past-copy', past);
      pastCopy = past;
    }
    const moving = p > 0.004;
    if (moving !== wasMoving) {
      hero.toggleAttribute('data-moving', moving);
      wasMoving = moving;
    }
    const blooming = bloom > 0;
    if (blooming !== wasBlooming) {
      hero.toggleAttribute('data-bloom', blooming);
      wasBlooming = blooming;
    }

    heroState.progress = tp;
    heroState.rotation = (rot * Math.PI) / 180;
    heroState.radius = (frameRect.size / 2) * zoom;
    heroState.centreX = frameRect.x + dx;
    heroState.centreY = frameRect.y + dy;
  };

  /* -------------------------------------------------------- Page thread */
  const pageThread = root.querySelector<SVGSVGElement>('[data-page-thread]');
  const threadTrack = pageThread?.querySelector<SVGPathElement>('[data-track]');
  const threadLine = pageThread?.querySelector<SVGPathElement>('[data-line]');
  const threadHead = pageThread?.querySelector<SVGCircleElement>('[data-head]');
  const main = root.querySelector<HTMLElement>('main');
  let pageThreadLength = 0;
  let threadStart = 0;
  let threadEnd = 1;

  const buildPageThread = (): void => {
    if (!pageThread || !threadTrack || !threadLine || !main || !hero) return;
    // Positions come from each chapter's own box and its resolved padding,
    // never from elements inside it: chapters below the fold are skipped by
    // content-visibility, and measuring their contents would force layout.
    const width = main.clientWidth;
    const sections = Array.from(root.querySelectorAll<HTMLElement>('main [data-chapter]')).filter((el) => el !== hero);
    const finale = root.querySelector<HTMLElement>('[data-finale]');
    if (sections.length === 0 || !finale) return;
    const first = getComputedStyle(sections[0]);
    const contentLeft = sections[0].offsetLeft + parseFloat(first.paddingLeft);
    const x = width < 760 ? 9 : Math.max(12, Math.round(contentLeft / 2));
    const bend = width < 760 ? 6 : 16;
    const startY = hero.offsetTop + hero.offsetHeight;
    let d = `M${x} ${startY}`;
    for (const section of sections) {
      if (section === finale) continue;
      const y = section.offsetTop + parseFloat(getComputedStyle(section).paddingTop) + 20;
      // A small right-angled detour at every chapter, like a maze corridor.
      d += `L${x} ${y - bend * 2}L${x + bend} ${y - bend * 2}L${x + bend} ${y}L${x} ${y}`;
    }
    // End at the entrance of the epilogue's maze, where its own thread
    // takes over: down the gutter, across above the maze, then in.
    const cx = width / 2;
    const mazeSize = Math.min(window.innerWidth * 1.3, 1200);
    const entryY = finale.offsetTop + finale.offsetHeight / 2 - mazeSize * (484 / 1200);
    const turnY = entryY - Math.min(120, mazeSize * 0.12);
    const radius = Math.min(60, (cx - x) / 3);
    d += `L${x} ${turnY - radius}Q${x} ${turnY} ${x + radius} ${turnY}L${cx - radius} ${turnY}Q${cx} ${turnY} ${cx} ${turnY + radius}L${cx} ${entryY}`;
    pageThread.setAttribute('height', String(main.offsetHeight));
    pageThread.setAttribute('viewBox', `0 0 ${width} ${main.offsetHeight}`);
    threadTrack.setAttribute('d', d);
    threadLine.setAttribute('d', d);
    pageThreadLength = threadLine.getTotalLength();
    const mainTop = main.offsetTop;
    threadStart = mainTop + startY - window.innerHeight * 0.55;
    threadEnd = mainTop + entryY - window.innerHeight * 0.35;
  };

  const updatePageThread = (): void => {
    if (!threadLine || !threadHead || pageThreadLength === 0) return;
    const t = reduced ? 1 : clamp((window.scrollY - threadStart) / (threadEnd - threadStart));
    pageThread?.style.setProperty('--thread', t.toFixed(4));
    const pt = threadLine.getPointAtLength(t * pageThreadLength);
    threadHead.setAttribute('cx', pt.x.toFixed(1));
    threadHead.setAttribute('cy', pt.y.toFixed(1));
    threadHead.style.opacity = t > 0.001 && t < 0.999 ? '1' : '0';
  };

  /* ------------------------------------------------------ Scroll loop */
  const reel = root.querySelector<HTMLElement>('[data-reel]');
  let lastY = window.scrollY;
  let velocity = 0;
  let navHidden = false;
  let navScrolled = false;
  let ticking = false;

  const onFrame = (): void => {
    ticking = false;
    const y = window.scrollY;
    const doc = document.documentElement;
    // Custom properties are set on the few elements that read them, never on
    // the root: a root-level change would restyle the whole page each frame.
    nav?.style.setProperty('--page', clamp(y / Math.max(1, doc.scrollHeight - window.innerHeight)).toFixed(4));
    velocity += (clamp(y - lastY, -80, 80) - velocity) * 0.25;
    reel?.style.setProperty('--vel', velocity.toFixed(2));
    if (Math.abs(velocity) > 0.05) {
      velocity *= 0.9;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onFrame);
      }
    } else if (velocity !== 0) {
      velocity = 0;
      reel?.style.setProperty('--vel', '0');
    }
    updateHero();
    updatePageThread();
    if (nav) {
      const scrolled = y > 40;
      if (scrolled !== navScrolled) {
        nav.toggleAttribute('data-scrolled', scrolled);
        navScrolled = scrolled;
      }
      const hide = y > lastY + 4 && y > window.innerHeight * 0.9;
      const show = y < lastY - 4;
      if (hide && !navHidden) {
        nav.setAttribute('data-hidden', '');
        navHidden = true;
      } else if (show && navHidden) {
        nav.removeAttribute('data-hidden');
        navHidden = false;
      }
    }
    lastY = y;
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onFrame);
  };

  const onResize = (): void => {
    measure();
    buildPageThread();
    onFrame();
  };

  measure();
  onFrame();
  const idleBuild = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
  if (idleBuild) idleBuild(() => {
    buildPageThread();
    updatePageThread();
  });
  else window.setTimeout(buildPageThread, 600);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  });

  // Fonts and late layout move the chapter heads; rebuild once they settle.
  const settle = (): void => {
    measure();
    buildPageThread();
    onFrame();
  };
  document.fonts?.ready.then(settle).catch(() => undefined);
  const ro = new ResizeObserver(() => {
    buildPageThread();
    updatePageThread();
  });
  if (main) ro.observe(main);
  cleanups.push(() => ro.disconnect());

  root.setAttribute('data-ready', '');

  /* ------------------------------------- Everything else, once idle */
  // The hero, reveals and scroll are live now. The theme switch, the cursor
  // and the WebGL trigger wait for an idle slot, so starting up never lands
  // as one long task on a slow phone.
  let stopGl: (() => void) | null = null;
  let disposed = false;
  const later = (): void => {
    if (disposed) return;
    /* ----------------------------------------------------------- Themes */
    // Three moons. The switch casts the new light as a widening circle from
    // itself (View Transitions where supported), and the choice is remembered.
    const toggle = root.querySelector<HTMLButtonElement>('[data-theme-toggle]');
    const themeName = root.querySelector<HTMLElement>('[data-theme-name]');
    const syncTheme = (): void => {
      const id = root.getAttribute('data-theme') ?? '';
      const theme = THEMES.find((t) => t.id === id) ?? THEMES[0];
      if (themeName) themeName.textContent = theme.name;
      toggle?.setAttribute('aria-label', `Colour theme: ${theme.name}. Change theme`);
      heroState.tint = readTint(root);
    };
    syncTheme();
    if (toggle) {
      const onToggle = (): void => {
        const id = root.getAttribute('data-theme') ?? '';
        const index = THEMES.findIndex((t) => t.id === id);
        const next = THEMES[(index + 1) % THEMES.length];
        const apply = (): void => {
          if (next.id) root.setAttribute('data-theme', next.id);
          else root.removeAttribute('data-theme');
          try {
            if (next.id) localStorage.setItem('lm-theme', next.id);
            else localStorage.removeItem('lm-theme');
          } catch {
            /* storage unavailable: the theme lasts for this visit */
          }
          syncTheme();
        };
        const doc = document as Document & {
          startViewTransition?: (update: () => void) => { ready: Promise<void> };
        };
        if (!doc.startViewTransition || reduced) {
          apply();
          return;
        }
        const r = toggle.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        const transition = doc.startViewTransition(apply);
        transition.ready
          .then(() => {
            document.documentElement.animate(
              { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
              { duration: 1000, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
            );
          })
          .catch(() => undefined);
      };
      toggle.addEventListener('click', onToggle);
      cleanups.push(() => toggle.removeEventListener('click', onToggle));
    }

    /* ------------------------------------------ Cursor, magnetic buttons */
    if (finePointer && !reduced) {
      root.setAttribute('data-cursor-on', '');
      // Backdrop refraction through an SVG filter is a Chromium feature.
      if ((navigator as Navigator & { userAgentData?: unknown }).userAgentData) root.setAttribute('data-refract', '');
      const cursor = root.querySelector<HTMLElement>('[data-cursor-el]');
      const dot = cursor?.querySelector<HTMLElement>('[data-cursor-dot]');
      const ring = cursor?.querySelector<HTMLElement>('[data-cursor-ring]');
      const label = ring?.querySelector('span');
      let mx = -100;
      let my = -100;
      let rx = -100;
      let ry = -100;
      let raf = 0;
      let magnet: HTMLElement | null = null;

      const loop = (): void => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        if (dot) dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        raf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.2 ? requestAnimationFrame(loop) : 0;
      };

      const onMove = (event: PointerEvent): void => {
        mx = event.clientX;
        my = event.clientY;
        if (!raf) raf = requestAnimationFrame(loop);
        if (stage) {
          const r = stage.getBoundingClientRect();
          heroState.pointer = [event.clientX - r.left, event.clientY - r.top];
          heroState.pointerActive = 1;
        }
        const glass = (event.target as HTMLElement).closest<HTMLElement>('[data-glass]');
        if (glass) {
          const g = glass.getBoundingClientRect();
          glass.style.setProperty('--gx', `${(((event.clientX - g.left) / g.width) * 100).toFixed(1)}%`);
          glass.style.setProperty('--gy', `${(((event.clientY - g.top) / g.height) * 100).toFixed(1)}%`);
        }
        if (magnet) {
          const r = magnet.getBoundingClientRect();
          const ox = (event.clientX - (r.left + r.width / 2)) * 0.28;
          const oy = (event.clientY - (r.top + r.height / 2)) * 0.36;
          magnet.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0)`;
        }
      };

      const onOver = (event: PointerEvent): void => {
        const target = (event.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, summary');
        if (cursor) {
          const text = target?.dataset.cursor;
          if (text) {
            cursor.setAttribute('data-label', '');
            if (label) label.textContent = text;
          } else {
            cursor.removeAttribute('data-label');
          }
        }
        const nextMagnet = (event.target as HTMLElement).closest<HTMLElement>('[data-magnetic]');
        if (nextMagnet !== magnet) {
          if (magnet) {
            magnet.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            magnet.style.transform = '';
          }
          magnet = nextMagnet;
          if (magnet) magnet.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      };

      const onDown = (): void => cursor?.setAttribute('data-down', '');
      const onUp = (): void => cursor?.removeAttribute('data-down');
      const onLeave = (): void => {
        heroState.pointerActive = 0;
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerover', onOver, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerover', onOver);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        cancelAnimationFrame(raf);
        root.removeAttribute('data-cursor-on');
      });

      /* Scramble the chapter numerals on hover: a small mechanical tick. */
      const glyphs = 'IVXLΛ·◇○';
      root.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
        const original = el.textContent ?? '';
        const onEnter = (): void => {
          let frameNo = 0;
          const tick = (): void => {
            frameNo += 1;
            el.textContent = original
              .split('')
              .map((ch, i) => (frameNo > 6 + i * 3 ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
              .join('');
            if (frameNo < 8 + original.length * 3) requestAnimationFrame(tick);
            else el.textContent = original;
          };
          requestAnimationFrame(tick);
        };
        el.closest('[data-reveal]')?.addEventListener('pointerenter', onEnter);
      });
    }

    /* ------------------------------------------------ WebGL, when idle */
    const canvas = root.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (canvas && hero && !reduced && !saveData) {
      const boot = (): void => {
        import('./labyrinth-gl')
          .then(({ startLabyrinth }) => {
            stopGl = startLabyrinth(canvas, {
              walls: Array.from(root.querySelectorAll('[data-ring-path]'), (p) => p.getAttribute('d') ?? '').join(''),
              wallWidth: ringHeight * 0.3,
              state: heroState,
              onReady: () => hero.setAttribute('data-gl', 'on'),
            });
          })
          .catch(() => undefined);
      };
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      // The SVG hero is complete on its own. The lit version boots on the
      // visitor's first gesture, in an idle slot after load, so first paint
      // and first input never compete with shader work.
      const events = ['pointermove', 'pointerdown', 'wheel', 'touchstart', 'scroll', 'keydown'] as const;
      let armed = true;
      const trigger = (): void => {
        if (!armed) return;
        armed = false;
        events.forEach((name) => window.removeEventListener(name, trigger));
        const go = (): void => {
          if (idle) idle(boot, { timeout: 800 });
          else window.setTimeout(boot, 200);
        };
        if (document.readyState === 'complete') go();
        else window.addEventListener('load', go, { once: true });
      };
      events.forEach((name) => window.addEventListener(name, trigger, { passive: true }));
      cleanups.push(() => events.forEach((name) => window.removeEventListener(name, trigger)));
    }
  };
  const idleLater = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
    .requestIdleCallback;
  if (idleLater) idleLater(later, { timeout: 1200 });
  else window.setTimeout(later, 300);

  return () => {
    disposed = true;
    stopGl?.();
    for (const fn of cleanups) fn();
  };
}
