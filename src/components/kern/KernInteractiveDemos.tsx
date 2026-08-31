'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import styles from './kern-product.module.css';

const searchDemos = [
  { query: 'plst', kind: 'INITIALS', count: '01', results: [['Play Store', 'APP', 'OPEN'], ['Playlist', 'PAGE', '4 LINES'], ['Private space', 'SETTING', 'OPEN']] },
  { query: '2400+18%', kind: 'ARITHMETIC', count: '2,832', results: [['2,832', 'ANSWER', 'COPY'], ['2400 × 1.18', 'WORKING', 'LOCAL'], ['Nothing left the device', 'PRIVACY', 'ALWAYS']] },
  { query: 'whstapp', kind: 'TYPO TOLERANCE', count: '01', results: [['WhatsApp', 'APP', 'OPEN'], ['Message Maya', 'SHORTCUT', 'OPEN'], ['WhatsApp · 17 min', 'LEDGER', 'TODAY']] },
  { query: 'wifi', kind: 'DEEP SEARCH', count: '03', results: [['Internet', 'SETTING', 'OPEN'], ['Wi-Fi hotspot', 'SETTING', 'OPEN'], ['Home network', 'NOTE', '1 MATCH']] },
] as const;

const focusLengths = [25, 45, 60] as const;

export function KernSearchExperience() {
  const [activeSearch, setActiveSearch] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(
      () => setActiveSearch((active) => (active + 1) % searchDemos.length),
      2800,
    );
    return () => window.clearInterval(timer);
  }, []);

  const demo = searchDemos[activeSearch];

  return (
    <div className={styles.searchStage}>
      <div className={styles.searchStatement} data-reveal>
        <p className={styles.eyebrow}>ONE FIELD. THE WHOLE PHONE.</p>
        <h3>Type what you mean. Kern works out where it lives.</h3>
        <p>Initials find apps. Names find shortcuts. A setting opens as easily as an app. Plain arithmetic stays plain arithmetic.</p>
        <div className={styles.searchTabs} aria-label="Search examples">
          {searchDemos.map((item, index) => (
            <button
              type="button"
              key={item.query}
              className={activeSearch === index ? styles.activeTab : ''}
              onClick={() => setActiveSearch(index)}
              aria-label={`Show ${item.kind.toLowerCase()} search example`}
              aria-pressed={activeSearch === index}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.searchDemo} data-reveal aria-live="polite">
        <div className={styles.searchMeta}><span>{demo.kind}</span><span>{demo.count}</span></div>
        <div className={styles.queryLine} key={demo.query}><span>›</span><strong>{demo.query}</strong><i /></div>
        <div className={styles.results} key={`${demo.query}-results`}>
          {demo.results.map(([title, kind, action], index) => (
            <div key={title} className={index === 0 ? styles.resultActive : ''}>
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><small>{kind}</small><em>{action}</em>
            </div>
          ))}
        </div>
        <div className={styles.searchFooter}><span>MATCHED LETTERS STAY LIT</span><span>ENTER TO OPEN</span></div>
      </div>
    </div>
  );
}

export function KernFocusExperience() {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);

  useEffect(() => {
    if (!focusRunning) return;
    const timer = window.setInterval(() => {
      setFocusSeconds((remaining) => {
        if (remaining <= 1) {
          setFocusRunning(false);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [focusRunning]);

  const focusClock = `${String(Math.floor(focusSeconds / 60)).padStart(2, '0')}:${String(focusSeconds % 60).padStart(2, '0')}`;
  const focusProgress = 1 - focusSeconds / (focusMinutes * 60);

  return (
    <div className={styles.focusGrid}>
      <div className={styles.focusCopy} data-reveal>
        <p className={styles.eyebrow}>FOCUS WITHOUT THE THEATRE</p>
        <h3>Start a timer. Make leaving deliberate. Stop when you are done.</h3>
        <p>Regular sessions keep time. Strict mode adds friction to the exit. Breathe gives the space between one block and the next. There is no streak waiting to be protected.</p>
        <div className={styles.focusModes}>
          <div><span>01</span><strong>SESSION</strong><em>TIME THE BLOCK</em></div>
          <div><span>02</span><strong>STRICT</strong><em>DELIBERATE EXIT</em></div>
          <div><span>03</span><strong>BREATHE</strong><em>PAUSE BETWEEN</em></div>
        </div>
      </div>
      <div className={`${styles.focusTimer} ${focusRunning ? styles.timerRunning : ''}`} data-reveal style={{ '--focus-progress': focusProgress } as CSSProperties}>
        <div className={styles.timerMeta}><span>FOCUS / SESSION</span><span>{focusRunning ? 'RUNNING' : focusSeconds === 0 ? 'COMPLETE' : 'READY'}</span></div>
        <div className={styles.timerDial}>
          <svg viewBox="0 0 200 200" aria-hidden><circle cx="100" cy="100" r="86" /><circle className={styles.focusArc} cx="100" cy="100" r="86" /></svg>
          <div><small>TIME REMAINING</small><strong>{focusClock}</strong><span>NO SCORE / NO STREAK</span></div>
        </div>
        <div className={styles.lengthPicker}>
          {focusLengths.map((minutes) => (
            <button type="button" key={minutes} className={focusMinutes === minutes ? styles.lengthActive : ''} onClick={() => { setFocusMinutes(minutes); setFocusSeconds(minutes * 60); setFocusRunning(false); }}>
              {minutes} MIN
            </button>
          ))}
        </div>
        <button className={styles.timerAction} type="button" onClick={() => { if (focusSeconds === 0) setFocusSeconds(focusMinutes * 60); setFocusRunning((running) => !running); }}>
          <span className={styles.filledSquare} />{focusRunning ? 'PAUSE SESSION' : focusSeconds === 0 ? 'START AGAIN' : 'START SESSION'}<em>{focusRunning ? 'Ⅱ' : '→'}</em>
        </button>
      </div>
    </div>
  );
}
