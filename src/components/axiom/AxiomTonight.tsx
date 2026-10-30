'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { internalUrl } from '@/lib/paths';
import styles from './axiom-upgrade.module.css';

const STEPS = [
  { label: 'Read', caption: 'A few minutes. One thing at a time.', title: 'Naming the Start', text: 'Day one is not about willpower. It is about a decision you have already made by being here.', foot: 'Night 01 / 30 · Recalibration' },
  { label: 'Write', caption: 'One task. In your own words.', title: 'Why did you start?', text: 'Write one sentence about why you started, and keep it somewhere you will see it today.', foot: 'Your reflection stays on your phone' },
  { label: 'Return', caption: 'New in 2.7.3', title: 'When is your next night?', text: 'Choose a time for Night 2. With notifications allowed, AXIOM reminds you then. If you miss it, the night waits.', foot: 'Next: Clearing the Easy Cues' },
] as const;

/** A deliberately labelled preview, using the shipped first night's actual text. */
export default function AxiomTonight() {
  const [step, setStep] = useState(0);
  const id = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % STEPS.length;
    else if (event.key === 'ArrowLeft') next = (index + STEPS.length - 1) % STEPS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = STEPS.length - 1;
    else return;
    event.preventDefault();
    setStep(next);
    buttons.current[next]?.focus();
  }

  return (
    <section id="tonight" className={styles.tonight} aria-labelledby="tonight-title">
      <div className={styles.tonightInner}>
        <div className={styles.tonightCopy}>
          <p className={styles.eyebrow}>Inside AXIOM / 2.7.3</p>
          <h2 id="tonight-title" data-reveal>Give tonight<br />a <em>different ending.</em></h2>
          <p className={styles.lede} data-reveal>You already know the hour that gets difficult. Put something there before it arrives.</p>
        </div>

        <div id="night-preview" className={styles.nightStage}>
          <div className={styles.nightOrbit} aria-hidden="true">
            <svg viewBox="0 0 520 580" fill="none">
              <defs><linearGradient id="ax-night-orbit" x1="60" y1="520" x2="460" y2="60"><stop stopColor="#8b7cf7" stopOpacity=".05" /><stop offset=".55" stopColor="#cdc7ee" stopOpacity=".5" /><stop offset="1" stopColor="#7ef7c2" stopOpacity=".8" /></linearGradient></defs>
              <ellipse cx="260" cy="290" rx="213" ry="268" stroke="url(#ax-night-orbit)" strokeWidth=".7" />
              <ellipse cx="260" cy="290" rx="238" ry="280" stroke="#cdc7ee" strokeOpacity=".08" strokeWidth=".7" transform="rotate(23 260 290)" />
              {Array.from({ length: 30 }, (_, i) => { const angle = (i / 30) * Math.PI * 2 - Math.PI / 2; return <circle key={i} cx={(260 + Math.cos(angle) * 213).toFixed(3)} cy={(290 + Math.sin(angle) * 268).toFixed(3)} r={i === 0 ? 4 : 1.6} fill={i === 0 ? '#7ef7c2' : '#b5aecb'} opacity={i === 0 ? 1 : .4} />; })}
            </svg>
          </div>
          <div className={styles.nightPreview}>
            <div className={styles.previewTop}><span>AXIOM</span><span>First-night preview</span></div>
            <div className={styles.lantern} aria-hidden="true"><span /><i /></div>
            <div role="tablist" aria-label="Preview your first night" className={styles.nightTabs}>
              {STEPS.map((item, index) => <button key={item.label} type="button" ref={(node) => { buttons.current[index] = node; }} id={`${id}-tab-${index}`} role="tab" aria-selected={step === index} aria-controls={`${id}-panel-${index}`} tabIndex={step === index ? 0 : -1} onClick={() => setStep(index)} onKeyDown={(event) => navigate(event, index)}><span>0{index + 1}</span>{item.label}</button>)}
            </div>
            {STEPS.map((item, index) => <div key={item.label} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={step !== index} className={styles.nightPanel}>
              <p className={styles.panelCaption}>{item.caption}</p>
              <h3>{item.title}</h3>
              <p className={styles.panelText}>{item.text}</p>
              <p className={styles.panelFoot}>{item.foot}</p>
            </div>)}
          </div>
          <p className={styles.previewNote}>An illustrated look inside the flow. Your night happens in the app.</p>
        </div>
        <div className={styles.tonightDetails}>
          <p className={styles.body} data-reveal>Recalibration gives you thirty authored nights: a short read, one task, and a line in your words. Finish tonight. Choose tomorrow’s time. Come back to the next night.</p>
          <div className={styles.releaseLine} data-reveal><span aria-hidden="true">↗</span><p><strong>The reminder is yours to set.</strong><br />New in 2.7.3. A missed night waits for you.</p></div>
          <a className={styles.textLink} href={internalUrl('/axiom/updates/')}>Read what changed <span aria-hidden="true">↗</span></a>
          <p className={styles.quiet}>Recalibration is included with membership.</p>
        </div>
      </div>
    </section>
  );
}
