/**
 * Per-article accent colours for the recovery library.
 *
 * The library rendered every article as the same slab of text, so four very
 * different pieces — a timeline, a symptom explainer, a night-time guide and a
 * breach investigation — were visually indistinguishable. Colour is the cheapest
 * way to give each one an identity without commissioning art for every language.
 *
 * Accents are semantic and shared with the tools hub: cyan is time and
 * progression, violet is the diagnostic spine, amber is urgency, silver is
 * reporting. An unknown slug falls back to violet, so adding an article never
 * breaks the page.
 */

export interface BlogAccent {
  readonly accent: string;
  readonly accentAlt: string;
}

const DEFAULT_ACCENT: BlogAccent = { accent: '#7B5CFF', accentAlt: '#A48CFF' };

const BY_SLUG: Readonly<Record<string, BlogAccent>> = {
  /** The recovery timeline — same cyan as the rewire calculator it pairs with. */
  'rewire-timeline': { accent: '#00D2FF', accentAlt: '#7B5CFF' },
  /** The flatline — the core explainer, so the violet spine. */
  flatline: { accent: '#7B5CFF', accentAlt: '#A48CFF' },
  /** Night urges — the ember, matching the panic button it sends people to. */
  'night-urges': { accent: '#FFD27A', accentAlt: '#FF9E7A' },
  /** The breach write-up is reporting, not coaching: steel, deliberately cooler. */
  'quittr-breach': { accent: '#C7CCE0', accentAlt: '#7B5CFF' },
  // Sibling of the breach article, so it shares its silver; the warmer alt
  // separates the two cards on the index without breaking the pairing.
  'quittr-alternative': { accent: '#C7CCE0', accentAlt: '#00D2FF' },
};

export function blogAccent(slug: string): BlogAccent {
  return BY_SLUG[slug] ?? DEFAULT_ACCENT;
}
