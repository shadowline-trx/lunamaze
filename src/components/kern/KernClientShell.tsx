'use client';

import { useEffect, useState } from 'react';
import { internalUrl } from '@/lib/paths';
import styles from './kern-product.module.css';

const ACCESS_MAILTO =
  'mailto:lunamaze.dev@gmail.com?subject=Kern%20early%20access';

function Wordmark() {
  return (
    <span className={styles.wordmark}>
      <span className={styles.wordmarkIcon} aria-hidden="true">K</span>
      <span>KERN</span>
    </span>
  );
}

/** Hydrates only the navigation and lightweight scroll/reveal controller. */
export default function KernClientShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-kern-root]');
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(styles.visible);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '80px 0px' });
    targets.forEach((target) => observer.observe(target));

    let frame = 0;
    const syncProgress = (): void => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty(
          '--scroll-progress',
          String(distance > 0 ? window.scrollY / distance : 0),
        );
        frame = 0;
      });
    };
    syncProgress();
    window.addEventListener('scroll', syncProgress, { passive: true });
    window.addEventListener('resize', syncProgress);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', syncProgress);
      window.removeEventListener('resize', syncProgress);
    };
  }, []);

  return (
    <header className={styles.header}>
      <a href="#top" aria-label="Kern home"><Wordmark /></a>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Primary navigation">
        <a href="#search" onClick={() => setMenuOpen(false)}>Search</a>
        <a href="#ledger" onClick={() => setMenuOpen(false)}>Ledger</a>
        <a href="#focus" onClick={() => setMenuOpen(false)}>Focus</a>
        <a href={internalUrl('/kern/faq/')} onClick={() => setMenuOpen(false)}>FAQ</a>
      </nav>
      <a className={styles.headerCta} href={ACCESS_MAILTO}>EARLY ACCESS</a>
      <button
        className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span /><span />
      </button>
    </header>
  );
}
