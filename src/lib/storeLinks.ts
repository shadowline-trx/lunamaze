/**
 * Canonical Axiom store URLs, with campaign attribution baked in.
 *
 * Why this exists: a bare store link tells you nothing about where an install
 * came from. Play Console reads UTM values out of the `referrer` parameter and
 * reports them under Acquisition → Traffic source, so a link tagged here shows
 * up as a countable install source rather than vanishing into "Organic".
 * That turns "the post got 300k views" into "the post produced N installs".
 */

/** Android application ID of the live Play listing. */
export const PLAY_PACKAGE = 'com.axiomapp.app';

/**
 * Apple's numeric App Store ID (the digits in `apps.apple.com/app/id123456789`).
 *
 * Stays `null` until the iOS listing is publicly live; while it is null every
 * surface falls back to Android-only and says so honestly rather than shipping
 * a dead Apple link. Fill this in the moment the app is approved — it is the
 * only edit needed to switch iOS on across the site.
 */
export const APP_STORE_ID: string | null = null;

/**
 * Public TestFlight link for the iOS beta.
 *
 * This exists because "in review" was costing us every iPhone visitor. The beta
 * is build 28 — the same binary sitting with Apple for review, not an early
 * alpha — so sending people to it is honest and it converts a visitor who would
 * otherwise have left into a user today.
 *
 * Deliberately not routed through `/go/reddit` or any redirect: r/TestFlight
 * bans shortened and redirected links, and this is the URL that gets posted
 * there. It also cannot carry campaign parameters — TestFlight ignores them —
 * so beta installs are attributed by the counter in App Store Connect instead,
 * which was zero when this shipped.
 */
export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/pb2NWh6B';

/**
 * The beta link while it is still the best thing we can offer an iPhone
 * visitor, and `null` once it is not.
 *
 * Reads from APP_STORE_ID so this retires itself: the day the real listing goes
 * live, pointing people at a 90-day beta build instead would be actively worse,
 * and nobody has to remember to come back and remove it.
 */
export function iosBetaUrl(): string | null {
  return APP_STORE_ID === null ? TESTFLIGHT_URL : null;
}

/**
 * Play Store URL tagged for `source`. The `referrer` value is a single
 * URL-encoded query string; Play requires the inner `&` separators to be
 * encoded or it silently drops everything after the first pair.
 */
export function playStoreUrl(source: string): string {
  const referrer = new URLSearchParams({
    utm_source: source,
    utm_medium: 'social',
    utm_campaign: 'launch',
  }).toString();
  const params = new URLSearchParams({ id: PLAY_PACKAGE, referrer });
  return `https://play.google.com/store/apps/details?${params.toString()}`;
}

/**
 * App Store URL tagged for `source`, or `null` while iOS is unreleased.
 *
 * `ct` is Apple's campaign token. Full App Analytics attribution also wants the
 * provider token (`pt`) from the App Store Connect campaign builder; without it
 * the link still works and still carries the campaign name.
 */
export function appStoreUrl(source: string): string | null {
  if (APP_STORE_ID === null) return null;
  const params = new URLSearchParams({ ct: source, mt: '8' });
  return `https://apps.apple.com/app/id${APP_STORE_ID}?${params.toString()}`;
}
