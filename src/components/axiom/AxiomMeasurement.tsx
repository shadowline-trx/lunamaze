'use client';

import { useEffect } from 'react';

type MeasurementWindow = Window & { gtag?: (command: 'event', name: string, fields: Record<string, string>) => void };

/** Uses the site's existing analytics. No entered text, query strings or personal records. */
export default function AxiomMeasurement() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor) return;
      const target = new URL(anchor.href, location.origin);
      const store = target.hostname === 'play.google.com' && target.searchParams.get('id') === 'com.axiomapp.app' ? 'google_play' : target.hostname === 'apps.apple.com' && target.pathname.includes('6791180351') ? 'app_store' : null;
      const emit = (window as MeasurementWindow).gtag;
      const placement = anchor.closest<HTMLElement>('[data-store-placement]')?.dataset.storePlacement ?? 'page-link';
      if (store) emit?.('event', 'axiom_store_exit', { store, placement, content_path: location.pathname });
      else if (target.origin === location.origin && location.pathname.includes('/axiom/blog/') && target.pathname === '/axiom/') emit?.('event', 'axiom_article_to_product', { content_path: location.pathname });
      else if (target.origin === location.origin && target.pathname === '/axiom/tools/panic/') emit?.('event', 'axiom_panic_open', { content_path: location.pathname });
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);
  return null;
}
