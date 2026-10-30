import { internalUrl } from '@/lib/paths';
import styles from './axiom-upgrade.module.css';

const NOTES = [
  { slug: 'urge-surfing', title: 'An urge is here. Start with the next move.', text: 'A practical walkthrough of urge surfing, including what to do when the feeling stays.' },
  { slug: 'after-a-slip', title: 'You watched again. The rest of today is still yours.', text: 'End the session, change one thing, and keep the day from becoming a write-off.' },
  { slug: 'porn-blocker-vs-recovery-app', title: 'What a blocker can do. What it leaves to you.', text: 'Access friction, daily practice, privacy, and choosing the tools you actually need.' },
] as const;

export default function AxiomNotes() {
  return <section className={styles.notes} aria-labelledby="notes-title"><div className={styles.notesInner}>
    <div className={styles.notesHead}><div><p className={styles.eyebrow}>The recovery library / free to read</p><h2 id="notes-title">For the hour<br />you’re <em>actually in.</em></h2></div><a className={styles.textLink} href={internalUrl('/axiom/blog/')}>Browse the library <span aria-hidden="true">↗</span></a></div>
    <div className={styles.notesList}>{NOTES.map((note, i) => <a key={note.slug} className={styles.note} href={internalUrl(`/axiom/blog/en/${note.slug}/`)}><span className={styles.noteNumber}>0{i + 1}</span><div><h3>{note.title}</h3><p>{note.text}</p></div><span aria-hidden="true">↗</span></a>)}</div>
  </div></section>;
}

/** Dated offer, with access conditions next to the description rather than hidden. */
export function AxiomClimb() {
  return <section id="climb" className={styles.season} aria-labelledby="climb-title"><div className={styles.seasonInner}>
    <div><p className={styles.eyebrow}>The Climb / November 2026</p><h2 id="climb-title">Thirty nights.<br /><em>One camp at a time.</em></h2><div className={styles.seasonCamps} aria-hidden="true"><i /><span /><i /><span /><i /><span /><i /><span /><i /></div></div>
    <div><p>A short lesson each night, an interactive drill, and a lantern to carry into the next camp. The Climb is AXIOM’s seasonal No Nut November challenge, alongside the year-round Recalibration programme.</p><small>Joining window: 18 October–30 November 2026. A seasonal free route is available to eligible nonmembers after 24 hours from their first membership-screen view on the current build. It does not immediately unlock when you install or close the store sheet. The in-app invitation shows your access.</small><a className={styles.textLink} href={internalUrl('/axiom/updates/#climb')}>Check the Climb access details <span aria-hidden="true">↗</span></a></div>
  </div></section>;
}
