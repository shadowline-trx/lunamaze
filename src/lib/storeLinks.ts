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
 * Filled 2026-08-09: the listing is live worldwide (0.2.4 READY_FOR_SALE, all
 * territories). Setting this switches iOS on across every surface and retires
 * the TestFlight fallback automatically — see `iosBetaUrl` below.
 *
 * Back to `null` if the listing is ever pulled: every surface then falls back
 * to Android-only and says so honestly rather than shipping a dead Apple link.
 */
export const APP_STORE_ID: string | null = '6791180351';

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
 * Territories where the Play listing exists but cannot be installed from.
 *
 * The trademark strike took the listing down in exactly these two markets.
 * Verified 2026-08-02 by requesting the listing with `gl` set to 17 territories:
 * only `us` and `au` returned 404 — gb, ca, nz, ie, in, de, fr, nl, br, id, ph,
 * za, sg, ae and jp all returned 200. This list changes when the dispute is
 * resolved, not on a schedule, so re-run that check before trusting it.
 */
export const PLAY_BLOCKED_TERRITORIES = ['US', 'AU'] as const;

/**
 * IANA zones for the United States, including the legacy `US/*` aliases some
 * browsers still report.
 *
 * Australia gets a prefix match instead, because `Australia/` belongs to one
 * country. The US cannot: `America/` also covers Canada, Mexico and all of
 * Latin America, so redirecting on that prefix would strand visitors in markets
 * where Play works fine.
 */
const US_TIME_ZONES: ReadonlySet<string> = new Set([
  'America/New_York',
  'America/Detroit',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/Indiana/Indianapolis',
  'America/Indiana/Vincennes',
  'America/Indiana/Winamac',
  'America/Indiana/Marengo',
  'America/Indiana/Petersburg',
  'America/Indiana/Vevay',
  'America/Indiana/Tell_City',
  'America/Indiana/Knox',
  'America/Chicago',
  'America/Menominee',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem',
  'America/North_Dakota/Beulah',
  'America/Denver',
  'America/Boise',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Juneau',
  'America/Sitka',
  'America/Metlakatla',
  'America/Yakutat',
  'America/Nome',
  'America/Adak',
  'America/Shiprock',
  'Pacific/Honolulu',
  'Navajo',
]);

/**
 * Whether this visitor is somewhere the Play listing will 404. Browser only —
 * it reads the device time zone, so it must be called from an effect, never
 * during render or the static export.
 *
 * Time zone rather than `navigator.language`: `en-US` is the default locale on
 * devices all over the world, so matching on it would suppress the Play
 * redirect far outside the two markets that are actually dark.
 */
export function playIsBlockedHere(): boolean {
  let zone: string | undefined;
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    zone = undefined;
  }

  // An unreadable location counts as blocked on purpose. The two mistakes are
  // not equally expensive: showing a working page to someone who could have
  // been auto-redirected costs one tap, while auto-redirecting a US or
  // Australian visitor drops them on a 404 that reads as "this app does not
  // exist" — and we never find out it happened.
  if (zone === undefined || zone === '') return true;

  return zone.startsWith('Australia/') || zone.startsWith('US/') || US_TIME_ZONES.has(zone);
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
