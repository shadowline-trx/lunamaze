'use client';

import { useEffect } from 'react';
import s from './typecrt.module.css';

/**
 * TypeCrt landing interactions, on top of server-rendered markup:
 * - the monitor's attract mode (it types to itself, with the odd slip);
 * - a real mini-test once the visitor selects the screen and types;
 * - the theme swatches, which recolour the whole page;
 * - reveals for the manual entries and documentation links.
 *
 * WPM here uses the usual definition, five characters per word, over the
 * correct characters typed. The full test and its documented formulas live
 * at typecrt.com.
 */
export default function TypecrtEnhancer({ passages }: { readonly passages: ReadonlyArray<string> }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-tc]');
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: Array<() => void> = [];

    /* ------------------------------------------------------------ Themes */
    const swatches = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-set-theme]'));
    const setTheme = (id: string): void => {
      root.setAttribute('data-theme', id);
      swatches.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.setTheme === id)));
      try {
        localStorage.setItem('tc-theme', id);
      } catch {
        /* storage unavailable: the choice lasts for this visit only */
      }
    };
    try {
      const saved = localStorage.getItem('tc-theme');
      if (saved && swatches.some((b) => b.dataset.setTheme === saved)) setTheme(saved);
    } catch {
      /* ignore */
    }
    swatches.forEach((b) => {
      const onClick = (): void => setTheme(b.dataset.setTheme ?? 'amber');
      b.addEventListener('click', onClick);
      cleanups.push(() => b.removeEventListener('click', onClick));
    });

    /* ----------------------------------------------------------- Reveals */
    root.setAttribute('data-js', '');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute('data-in', '');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    root.querySelectorAll('[data-reveal]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.setAttribute('data-in', '');
      else io.observe(el);
    });
    cleanups.push(() => io.disconnect());

    /* ----------------------------------------------------------- Monitor */
    const screen = root.querySelector<HTMLElement>('[data-screen]');
    const passageEl = root.querySelector<HTMLElement>('[data-passage]');
    const sink = root.querySelector<HTMLTextAreaElement>('[data-sink]');
    const statWpm = root.querySelector<HTMLElement>('[data-stat="wpm"]');
    const statAcc = root.querySelector<HTMLElement>('[data-stat="acc"]');
    const statTime = root.querySelector<HTMLElement>('[data-stat="time"]');
    const modeEl = root.querySelector<HTMLElement>('[data-mode]');
    const result = root.querySelector<HTMLElement>('[data-result]');
    if (!screen || !passageEl || !sink) return () => cleanups.forEach((fn) => fn());

    let passageIndex = 0;
    let text = passages[0];
    let chars: HTMLElement[] = [];
    let typed: string[] = [];
    let keystrokes = 0;
    let correctStrokes = 0;
    let startedAt = 0;
    let mode: 'demo' | 'live' | 'done' = 'demo';
    let demoTimer = 0;
    let clockTimer = 0;
    let demoRunning = false;
    // The hidden field always holds one invisible character, so a phone
    // keyboard's backspace shows up as the value getting shorter.
    const SENTINEL = '\u200b';

    const render = (): void => {
      chars.forEach((el, i) => {
        el.classList.toggle(s.ok, i < typed.length && typed[i] === text[i]);
        el.classList.toggle(s.bad, i < typed.length && typed[i] !== text[i]);
        if (i === typed.length) el.setAttribute('data-caret', '');
        else el.removeAttribute('data-caret');
      });
      passageEl.toggleAttribute('data-end', typed.length >= text.length);
    };

    const stats = (): void => {
      const seconds = startedAt ? (performance.now() - startedAt) / 1000 : 0;
      const correct = typed.filter((ch, i) => ch === text[i]).length;
      const wpm = seconds > 0.5 ? Math.round(correct / 5 / (seconds / 60)) : 0;
      const acc = keystrokes > 0 ? Math.round((correctStrokes / keystrokes) * 100) : 100;
      if (statWpm) statWpm.textContent = String(wpm).padStart(2, '0');
      if (statAcc) statAcc.textContent = String(acc);
      if (statTime) statTime.textContent = seconds.toFixed(1);
    };

    const load = (index: number): void => {
      passageIndex = index % passages.length;
      text = passages[passageIndex];
      // Words stay unbroken: characters are grouped per word, spaces between.
      passageEl.textContent = '';
      chars = [];
      const words = text.split(' ');
      words.forEach((word, w) => {
        const group = document.createElement('span');
        group.className = s.word;
        for (const ch of word) {
          const span = document.createElement('span');
          span.className = s.ch;
          span.textContent = ch;
          group.appendChild(span);
          chars.push(span);
        }
        passageEl.appendChild(group);
        if (w < words.length - 1) {
          const space = document.createElement('span');
          space.className = s.ch;
          space.textContent = ' ';
          passageEl.appendChild(space);
          chars.push(space);
        }
      });
      typed = [];
      keystrokes = 0;
      correctStrokes = 0;
      startedAt = 0;
      if (result) result.textContent = '';
      screen.removeAttribute('data-done');
      render();
      stats();
    };

    const press = (ch: string): void => {
      if (typed.length >= text.length) return;
      if (!startedAt) startedAt = performance.now();
      keystrokes += 1;
      if (ch === text[typed.length]) correctStrokes += 1;
      typed.push(ch);
      render();
      stats();
      if (typed.length >= text.length) finish();
    };

    const back = (): void => {
      if (typed.length === 0) return;
      typed.pop();
      render();
      stats();
    };

    const finish = (): void => {
      window.clearInterval(clockTimer);
      stats();
      if (mode === 'demo') {
        demoRunning = false;
        demoTimer = window.setTimeout(() => {
          load(passageIndex + 1);
          demo();
        }, 1800);
        return;
      }
      mode = 'done';
      screen.setAttribute('data-done', '');
      const wpm = statWpm?.textContent ?? '0';
      const acc = statAcc?.textContent ?? '100';
      if (result) result.textContent = `${Number(wpm)} wpm at ${acc}% accuracy. Press Enter for another line, or take the full test at typecrt.com.`;
      if (modeEl) modeEl.textContent = 'done · enter for another';
    };

    // Attract mode: a believable typist, with the occasional slip corrected.
    const stopDemo = (): void => {
      window.clearTimeout(demoTimer);
      window.clearInterval(clockTimer);
      demoRunning = false;
    };

    const demo = (): void => {
      if (reduced || mode !== 'demo' || demoRunning) return;
      demoRunning = true;
      let slipped = false;
      const step = (): void => {
        if (mode !== 'demo') {
          demoRunning = false;
          return;
        }
        const i = typed.length;
        if (i >= text.length) return;
        const expected = text[i];
        if (!slipped && Math.random() < 0.035 && expected !== ' ') {
          slipped = true;
          press(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
          demoTimer = window.setTimeout(() => {
            back();
            demoTimer = window.setTimeout(step, 140);
          }, 260);
          return;
        }
        slipped = false;
        press(expected);
        const base = expected === ' ' ? 120 : 70;
        demoTimer = window.setTimeout(step, base + Math.random() * 90);
      };
      if (!startedAt) startedAt = performance.now();
      clockTimer = window.setInterval(stats, 200);
      demoTimer = window.setTimeout(step, 600);
    };

    const goLive = (): void => {
      if (mode === 'live') return;
      stopDemo();
      mode = 'live';
      screen.setAttribute('data-live', '');
      if (modeEl) modeEl.textContent = 'live · type the line';
      if (result) result.textContent = '';
      load(passageIndex);
      clockTimer = window.setInterval(() => {
        if (startedAt && mode === 'live') stats();
      }, 200);
      sink.value = SENTINEL;
      sink.focus({ preventScroll: true });
    };

    // The whole screen takes a click; keyboard and screen-reader users get
    // the same action from the real button in the status bar.
    const onScreen = (): void => goLive();

    const onKey = (event: KeyboardEvent): void => {
      if (mode === 'done' && event.key === 'Enter') {
        event.preventDefault();
        mode = 'live';
        if (modeEl) modeEl.textContent = 'live · type the line';
        load(passageIndex + 1);
        clockTimer = window.setInterval(() => {
          if (startedAt && mode === 'live') stats();
        }, 200);
        return;
      }
      if (mode !== 'live') return;
      if (event.key === 'Backspace') {
        event.preventDefault();
        back();
      } else if (event.key === 'Escape') {
        sink.blur();
      }
    };

    // Characters arrive through `input` so phone keyboards work too.
    const onInput = (): void => {
      const value = sink.value;
      sink.value = SENTINEL;
      if (mode !== 'live') return;
      if (!value.includes(SENTINEL) || value.length < SENTINEL.length) {
        back();
        return;
      }
      for (const ch of value.replace(SENTINEL, '')) press(ch === '\n' ? ' ' : ch);
    };

    const onBlur = (): void => {
      if (mode === 'live' && typed.length === 0) {
        window.clearInterval(clockTimer);
        mode = 'demo';
        screen.removeAttribute('data-live');
        if (modeEl) modeEl.textContent = 'demo · click to type';
        load(passageIndex);
        demo();
      }
    };

    screen.addEventListener('click', onScreen);
    sink.addEventListener('keydown', onKey);
    sink.addEventListener('input', onInput);
    sink.addEventListener('blur', onBlur);
    cleanups.push(() => {
      screen.removeEventListener('click', onScreen);
      sink.removeEventListener('keydown', onKey);
      sink.removeEventListener('input', onInput);
      sink.removeEventListener('blur', onBlur);
      stopDemo();
    });

    load(0);
    // The monitor only performs while it is on screen.
    const monitorIo = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (!visible && mode === 'demo') stopDemo();
      else if (visible && mode === 'demo') demo();
    });
    monitorIo.observe(screen);
    cleanups.push(() => monitorIo.disconnect());

    return () => cleanups.forEach((fn) => fn());
  }, [passages]);

  return null;
}
