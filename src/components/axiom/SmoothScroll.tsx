'use client';

/**
 * SmoothScroll — Lenis inertia scrolling for the AXIOM page.
 *
 * This one primitive is ~half of the "expensive" feel of award sites: momentum
 * scrolling with a long, soft settle instead of the OS's stepwise scroll. A
 * single rAF loop drives Lenis; it is fully disabled under prefers-reduced-motion
 * (native scroll then), and torn down on unmount.
 *
 * When GSAP ScrollTrigger choreography lands, sync it here
 * (`lenis.on('scroll', ScrollTrigger.update)` + drive `lenis.raf` from the gsap
 * ticker) so scrubbed timelines read Lenis position, not native scroll.
 */

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      // A slightly "heavier", cinematic ease-out on programmatic scrolls.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
