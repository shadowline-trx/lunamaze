import type { CSSProperties } from 'react';
import { internalUrl } from '@/lib/paths';
import KernClientShell from './KernClientShell';
import {
  KernFocusExperience,
  KernSearchExperience,
} from './KernInteractiveDemos';
import styles from './kern-product.module.css';

const ACCESS_MAILTO = 'mailto:lunamaze.dev@gmail.com?subject=Kern%20early%20access';

const histogram = [12, 7, 4, 3, 2, 4, 9, 22, 16, 11, 7, 12, 24, 18, 15, 9, 13, 27, 31, 18, 12, 8, 5, 3];
const accentNames = ['RUST', 'SAGE', 'INDIGO', 'OCHRE', 'PLUM'];
const drawerApps = ['Calculator', 'Calendar', 'Camera', 'Chrome', 'Clock', 'Contacts', 'Drive', 'Gmail', 'Maps', 'Messages', 'Phone', 'Photos', 'Play Store', 'Settings'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function Wordmark() {
  return <span className={styles.wordmark}><span className={styles.wordmarkIcon} aria-hidden="true">K</span><span>KERN</span></span>;
}

function SectionHead({ index, title, note }: { index: string; title: string; note: string }) {
  return <div className={styles.sectionHead} data-reveal><p>{index}</p><h2>{title}</h2><p>{note}</p></div>;
}

export default function KernProductLanding() {
  return (
    <main className={styles.root} data-kern-root>
      <div className={styles.scrollProgress} aria-hidden><span /></div>
      <KernClientShell />

      <section id="top" className={styles.hero}>
        <div className={styles.heroMechanism} aria-hidden>
          <div className={styles.heroRings}><i /><i /><i /><i /></div>
          <strong>K</strong>
          <span>FIND / NOTICE / CAPTURE</span>
        </div>
        <div className={styles.heroIndex} aria-hidden><span>ANDROID 8.0+</span><i /><span>LOCAL / PRIVATE</span></div>
        <div className={styles.heroCopy}>
          <p className={styles.label}><span /> ANDROID HOME, RECONSIDERED</p>
          <h1>A launcher for people who would rather <em>use</em> their phone than look at it.</h1>
          <p className={styles.intro}>A quiet home screen is not enough. Kern adds the three things that change the relationship: fast search, an honest record of the day, and somewhere to write things down.</p>
          <a className={styles.primaryAction} href={ACCESS_MAILTO}><span className={styles.filledSquare} /><span>JOIN EARLY ACCESS</span><span aria-hidden>↗</span></a>
        </div>
        <div className={styles.heroMeasure} aria-label="Example notification record">
          <p>YESTERDAY</p><div><strong>214</strong><span>interruptions</span></div><i><span /></i><div><strong>11</strong><span>opened</span></div><p>IT REPORTS. WHAT TO DO ABOUT IT IS NOT ITS BUSINESS.</p>
        </div>
        <div className={styles.heroFoot}><span>NO ACCOUNT</span><span>NO CLOUD</span><span>NO ANALYTICS</span><span>KOTLIN / COMPOSE</span></div>
      </section>

      <section className={`${styles.argument} ${styles.lightSection}`}>
        <SectionHead index="01 / THE ARGUMENT" title="Less is useful. Fast is better." note="A launcher should remove friction, not only icons." />
        <div className={styles.argumentLead} data-reveal><p>MINIMALISM IS NOT THE PRODUCT</p><h3>Removing everything leaves you with less. Kern gives the empty space a job.</h3></div>
        <div className={styles.threeWays}>
          {[
            ['01', 'FIND', 'Search apps, shortcuts, notes, settings, and arithmetic before your thumb changes its mind.'],
            ['02', 'NOTICE', 'See the day as time and interruptions. No score. No sermon. Just the record.'],
            ['03', 'CAPTURE', 'Keep a page, a task, or a thought one swipe away from wherever you are.'],
          ].map(([number, title, copy]) => <article key={number} data-reveal><span>{number}</span><i /><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
        <div className={styles.productFacts} data-reveal>
          <div><span>PACKAGE</span><strong>dev.lunamaze.kern</strong></div>
          <div><span>PLATFORM</span><strong>Android 8.0+</strong></div>
          <div><span>BUILT NATIVE</span><strong>Kotlin + Jetpack Compose</strong></div>
          <div><span>MADE BY</span><strong>One developer</strong></div>
        </div>
      </section>

      <section id="reflex" className={styles.reflexSection} aria-labelledby="reflex-title">
        <div className={styles.reflexGhost} aria-hidden>KERN / KERN / KERN /</div>
        <div className={styles.reflexHeader}>
          <span>01.5 / THE REFLEX</span>
          <span>HOME → INTENT</span>
        </div>
        <div className={styles.reflexStage}>
          <div className={styles.reflexCopy} data-reveal>
            <p>READY BEFORE DISTRACTION GETS A VOTE</p>
            <h2 id="reflex-title">The shortest route through your phone.</h2>
          </div>
          <div className={styles.reflexMetric} data-reveal aria-label="Two keys to reach an action">
            <strong>02</strong>
            <span>KEYS<br />TO THERE</span>
          </div>
        </div>
        <div className={styles.reflexRoute} data-reveal aria-label="Kern search route: home, type, open">
          <div><span>01</span><strong>HOME</strong><em>START</em></div>
          <i><b /></i>
          <div><span>02</span><strong>TYPE</strong><em>RANKED</em></div>
          <i><b /></i>
          <div><span>03</span><strong>OPEN</strong><em>DONE</em></div>
        </div>
        <div className={styles.reflexBars} aria-hidden>
          {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
        </div>
      </section>

      <section id="drawer" className={styles.drawerSection}>
        <SectionHead index="02 / THE DRAWER" title="Everything. Under one thumb." note="A complete app drawer that behaves like you already know it." />
        <div className={styles.drawerStage}>
          <div className={styles.drawerCopy} data-reveal>
            <p className={styles.eyebrow}>FAST WITHOUT REARRANGING ITSELF</p>
            <h3>Predictions where your thumb starts. The alphabet where it expects to finish.</h3>
            <p>Frequently used apps sit in a small predicted band. The full drawer stays alphabetical. Search remains at the bottom, inside the natural reach of one hand.</p>
            <div className={styles.drawerLegend}><span><i /> PREDICTED</span><span><i /> ALPHABETICAL</span></div>
          </div>
          <div className={styles.drawerSystem} data-reveal aria-label="Schematic of Kern's one-thumb app drawer">
            <div className={styles.predictedBand}><small>PREDICTED / NOW</small><div>{['Maps', 'Messages', 'Camera', 'Notes'].map((app, index) => <span key={app}><i>{String(index + 1).padStart(2, '0')}</i>{app}</span>)}</div></div>
            <div className={styles.drawerList}>{drawerApps.map((app, index) => <div key={app}><span>{app[0]}</span><strong>{app}</strong><em>{String(index + 1).padStart(2, '0')}</em></div>)}</div>
            <div className={styles.alphabetRail} aria-hidden>{alphabet.map((letter) => <span key={letter}>{letter}</span>)}</div>
            <div className={styles.drawerSearch}><span>⌕</span><strong>SEARCH ALL APPS</strong><em>BOTTOM / THUMB REACH</em></div>
          </div>
        </div>
      </section>

      <section id="search" className={styles.searchSection}>
        <SectionHead index="03 / SEARCH" title="Two keys. Then done." note="Fuzzy, ranked, local, and patient with typos." />
        <KernSearchExperience />
        <div className={styles.searchTicker} aria-hidden><div>APPS · SHORTCUTS · NOTES · SETTINGS · ARITHMETIC · APPS · SHORTCUTS · NOTES · SETTINGS · ARITHMETIC ·&nbsp;</div></div>
      </section>

      <section className={styles.intermission} aria-label="Kern principle">
        <div className={styles.intermissionMark} aria-hidden><i /><span>K</span><i /></div>
        <p data-reveal>READY BEFORE YOU ASK</p>
        <h2 data-reveal>Not another layer.<br /><em>The shortest route through.</em></h2>
        <div className={styles.intermissionLine} aria-hidden><span /></div>
      </section>

      <section id="ledger" className={`${styles.ledgerSection} ${styles.lightSection}`}>
        <SectionHead index="04 / THE LEDGER" title="The day, without judgement." note="144 marks. Ten minutes each. Nothing hidden inside a score." />
        <div className={styles.ledgerIntro} data-reveal><p className={styles.eyebrow}>A RECORD, NOT A REPRIMAND</p><h3>Every ten minutes gets one mark. The result is a day you can actually read.</h3><p>Pickups, longest stretch, time away, first reach, late-night minutes. Kern states what happened and leaves the conclusion with you.</p></div>
        <div className={styles.dayMarks} data-reveal role="img" aria-label="144 ten-minute marks across one day">{Array.from({ length: 144 }, (_, index) => <i key={index} className={(index > 46 && index < 58) || (index > 74 && index < 83) || (index > 106 && index < 124) ? styles.markActive : ''} />)}</div>
        <div className={styles.ledgerGrid}>
          <article className={styles.curvePanel} data-reveal><div className={styles.panelHead}><span>CUMULATIVE USE</span><span>VS RECENT AVERAGE</span></div>
            <svg viewBox="0 0 720 300" role="img" aria-label="Cumulative phone use compared with recent average"><defs><linearGradient id="kernCurveFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b4553b" stopOpacity="0.16" /><stop offset="1" stopColor="#b4553b" stopOpacity="0" /></linearGradient></defs><g className={styles.chartGrid}><path d="M0 60H720M0 120H720M0 180H720M0 240H720" /><path d="M120 0V300M240 0V300M360 0V300M480 0V300M600 0V300" /></g><path className={styles.averageLine} d="M0 276 C112 267 148 222 240 204 S364 164 448 142 S596 83 720 54" /><path className={styles.curveFill} d="M0 286 C70 281 97 250 158 246 S238 222 286 204 S371 199 418 171 S494 122 551 116 S633 77 720 47 L720 300 L0 300Z" /><path className={styles.curveLine} d="M0 286 C70 281 97 250 158 246 S238 222 286 204 S371 199 418 171 S494 122 551 116 S633 77 720 47" /></svg>
            <div className={styles.axis}><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div></article>
          <article className={styles.statPanel} data-reveal>{[['PICKUPS','37'],['LONGEST STRETCH','1h 42'],['TIME AWAY','8h 19'],['FIRST PICKUP','07:18'],['TYPICAL SESSION','3m 40'],['AFTER 23:00','12m']].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</article>
          <article className={styles.histogramPanel} data-reveal><div className={styles.panelHead}><span>PICKUPS BY HOUR</span><span>24H</span></div><div className={styles.histogram}>{histogram.map((height, index) => <i key={index} style={{ '--h': height } as CSSProperties} />)}</div><div className={styles.axis}><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div></article>
        </div>
      </section>

      <section className={styles.reportSection}>
        <SectionHead index="05 / DAY REPORT" title="Interruptions, accounted for." note="Kern records what arrived and what you did with it." />
        <div className={styles.reportHook} data-reveal><p>You were interrupted</p><div><strong>214</strong><span>times<br />yesterday.</span></div><p>You opened</p><div><strong>11</strong><span>of<br />them.</span></div></div>
        <div className={styles.reportRule} data-reveal><span /></div>
        <div className={styles.reportData}>{[['OPENED','11','5.1%'],['SWIPED','176','82.2%'],['WITHDRAWN','27','12.7%'],['WORTH IT','11','OF 214']].map(([label,value,note]) => <article key={label} data-reveal><span>{label}</span><strong>{value}</strong><em>{note}</em></article>)}</div>
        <p className={styles.reportFoot} data-reveal>Kern stores the package, the hour, and the outcome. Never the title, text, or sender.</p>
      </section>

      <section id="pages" className={`${styles.pagesSection} ${styles.lightSection}`}>
        <SectionHead index="06 / PAGES" title="A place for the thing in your head." note="One swipe from home. Plain text. A small grammar." />
        <div className={styles.pagesGrid}>
          <div className={styles.pageStatement} data-reveal><p className={styles.eyebrow}>CAPTURE BEFORE IT BECOMES AN APP</p><h3>Notes, tasks, and daily pages without opening another system.</h3><p>Write in short forms that stay readable as text. Export whenever you like. Lock the workspace when the page is not for everyone holding the phone.</p></div>
          <div className={styles.captureDemo} data-reveal><div className={styles.captureHead}><span>DAILY / TODAY</span><span>4 LINES</span></div><div><i>—</i><span>Send the new build to Maya</span><em>TASK</em></div><div><i>!</i><span>Call Amma after 19:00</span><em>PINNED</em></div><div><i>›</i><span>work / launcher copy</span><em>PAGE</em></div><div><i>·</i><span>The home screen should disappear.</span><em>NOTE</em></div><div className={styles.captureInput}><b>+</b><span>CAPTURE ANYTHING</span><small>RETURN</small></div></div>
        </div>
        <div className={styles.pageFeatures}>{['MARKDOWN-STYLE GRAMMAR','DAILY TASKS','CLEAR DONE','PLAIN EXPORT','OPTIONAL LOCK'].map((item,index) => <div key={item} data-reveal><span>{String(index + 1).padStart(2,'0')}</span><p>{item}</p></div>)}</div>
      </section>

      <section id="focus" className={styles.focusSection}>
        <SectionHead index="07 / FOCUS" title="Make one thing the only thing." note="Timed sessions, a stricter exit, and a moment to breathe." />
        <KernFocusExperience />
      </section>

      <section className={styles.learningSection}>
        <SectionHead index="08 / LEARNING" title="It learns. The floor stays still." note="Useful adaptation without a rearranging home screen." />
        <div className={styles.learningGrid}>
          <div className={styles.signalList} data-reveal><p className={styles.eyebrow}>THREE LOCAL SIGNALS</p><div><strong>01</strong><span>14-day frecency</span><i /></div><div><strong>02</strong><span>Time of day</span><i /></div><div><strong>03</strong><span>Follow-on actions</span><i /></div></div>
          <div className={styles.movesList} data-reveal><p className={styles.eyebrow}>ONLY TWO THINGS MOVE</p><div><span className={styles.filledSquare} /><strong>DRAWER PREDICTION BAND</strong><em>LEARNS</em></div><div><span className={styles.filledSquare} /><strong>SEARCH RESULT ORDER</strong><em>LEARNS</em></div><div><span className={styles.openSquare} /><strong>DOCK</strong><em>NEVER MOVES</em></div><div><span className={styles.openSquare} /><strong>ALPHABET</strong><em>NEVER MOVES</em></div></div>
        </div>
        <p className={styles.clearable} data-reveal>All learning stays on the phone. You can clear it in one action.</p>
      </section>

      <section className={`${styles.appearanceSection} ${styles.lightSection}`}>
        <SectionHead index="09 / APPEARANCE" title="Distinctly yours. Still Kern." note="A small system with enough room to make it personal." />
        <div className={styles.appearanceGrid} data-reveal><div className={styles.iconField} aria-hidden><span>K</span><span>K</span><span>K</span><span>K</span></div><div className={styles.paletteList}>{accentNames.map((name,index) => <div key={name}><i className={styles[`accent${index}`]} /><span>{name}</span><em>0{index + 1}</em></div>)}</div><div className={styles.themeList}><p>LIGHT</p><p>DARK</p><p>SYSTEM</p><p>GREEN</p></div></div>
      </section>

      <section id="privacy" className={styles.privacySection}>
        <SectionHead index="10 / PRIVACY" title="There is no Kern server." note="Not a promise about policy. A description of the architecture." />
        <div className={styles.privacyLead} data-reveal><h3>Your home screen is not an advertising surface.</h3><p>There is no account, sign-in, cloud sync, analytics SDK, ad network, or tracking. Search ranking and daily records are calculated on the device and stay there.</p></div>
        <div className={styles.noList}>{['NO ACCOUNT','NO CLOUD','NO ANALYTICS','NO ADS','NO TRACKING','NO KERN SERVER'].map((item,index) => <div key={item} data-reveal><span>{String(index + 1).padStart(2,'0')}</span><strong>{item}</strong><i /></div>)}</div>
        <div className={styles.privacyEnd} data-reveal><p className={styles.privacyNote}>Notification history keeps package · hour · outcome. It never stores title · text · sender.</p><a href={internalUrl('/kern/privacy/')}>READ THE FULL PRIVACY POLICY <span>↗</span></a></div>
      </section>

      <section className={`${styles.pricingSection} ${styles.lightSection}`}>
        <SectionHead index="11 / LICENCE" title="Try everything. Keep the launcher." note="14 days free. Then choose what the deeper layer is worth." />
        <div className={styles.priceGrid}>
          <article data-reveal><p>FREE / FOREVER</p><strong>₹0</strong><ul><li>Home screen</li><li>Whole app drawer</li><li>App search</li><li>One notes page</li></ul><span>OLD DATA IS NEVER LOCKED</span></article>
          <article className={styles.paidPrice} data-reveal><p>YEARLY LICENCE</p><strong>₹399 <small>/ year</small></strong><ul><li>The ledger + day report</li><li>Focus sessions</li><li>Unlimited pages</li><li>Deep search + appearance</li></ul><a href={ACCESS_MAILTO}>JOIN EARLY ACCESS <span>↗</span></a></article>
          <article data-reveal><p>LIFETIME LICENCE</p><strong>₹1,299</strong><ul><li>Everything in yearly</li><li>One payment</li><li>No subscription renewal</li><li>Future launcher updates</li></ul><span>USD 16.99 OUTSIDE INDIA</span></article>
        </div>
        <p className={styles.priceNote} data-reveal>Yearly pricing outside India: USD 4.99. The licence also includes widgets, notification shelf, and workspace lock.</p>
      </section>

      <div className={styles.techMarquee} aria-hidden><div>DEV.LUNAMAZE.KERN · ANDROID 8.0+ · KOTLIN · JETPACK COMPOSE · LOCAL FIRST · DEV.LUNAMAZE.KERN · ANDROID 8.0+ · KOTLIN · JETPACK COMPOSE · LOCAL FIRST ·&nbsp;</div></div>

      <footer className={styles.footer}><div className={styles.footerTop}><Wordmark /><h2>Use your phone.<br /><em>Do not look at it.</em></h2><a className={styles.primaryAction} href={ACCESS_MAILTO}><span className={styles.filledSquare} /><span>JOIN EARLY ACCESS</span><span aria-hidden>↗</span></a></div><div className={styles.footerBottom}><span>BUILT BY LUNA MAZE</span><span>ANDROID 8.0+</span><a href={internalUrl('/kern/faq/')}>FAQ</a><a href={internalUrl('/kern/privacy/')}>PRIVACY</a><a href="mailto:lunamaze.dev@gmail.com">CONTACT</a><a href="#top">BACK TO TOP ↑</a></div></footer>
    </main>
  );
}
