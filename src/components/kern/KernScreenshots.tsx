import { KERN_PLAY_URL, KERN_SCREENSHOTS } from '@/content/kern';
import { internalUrl } from '@/lib/paths';
import styles from './kern-release.module.css';

export default function KernScreenshots() {
  return (
    <section id="screenshots" className={styles.section} aria-labelledby="kern-screenshots-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>KERN / ON YOUR PHONE</p>
          <h2 id="kern-screenshots-title">Less noise.<br /><em>More intention.</em></h2>
        </div>
        <div className={styles.context}>
          <p>The actual launcher. A quiet home, fast search, and a little space between you and the next distraction.</p>
          <a href={KERN_PLAY_URL} target="_blank" rel="noopener noreferrer">VIEW ON GOOGLE PLAY <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className={styles.gallery} role="region" tabIndex={0} aria-label="Kern app screenshots. Scroll horizontally to explore all six screens.">
        {KERN_SCREENSHOTS.map((screen, index) => (
          <figure className={styles.screen} key={screen.file}>
            <img
              src={internalUrl(`/images/kern/screenshots/${screen.file}`)}
              alt={screen.alt}
              width={540}
              height={960}
              loading="lazy"
              decoding="async"
            />
            <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{screen.title}</figcaption>
          </figure>
        ))}
      </div>
      <p className={styles.hint}>SCROLL TO EXPLORE <span aria-hidden="true">→</span></p>
    </section>
  );
}
