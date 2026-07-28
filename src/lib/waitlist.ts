/**
 * Launch-waitlist signup.
 *
 * The site is a static export with no server of its own, so this posts straight
 * to the Supabase RPC `join_waitlist` from the browser. That function is the
 * only thing the anon role may call: the `launch_waitlist` table itself has RLS
 * on with no policies and no grants, so the list cannot be read or written any
 * other way.
 *
 * Why the key is committed rather than injected as a build secret: Supabase
 * publishable keys are designed to sit in client bundles — they identify the
 * project and carry no authority beyond what RLS and grants already allow. A
 * static export would inline the value at build time regardless, so a
 * `NEXT_PUBLIC_` variable would buy nothing except a GitHub Actions secret that
 * has to be configured before the site can build.
 *
 * A duplicate signup and a fresh one return the identical response. That is
 * deliberate and enforced server-side: a distinguishable conflict would let
 * anyone probe whether a particular address had signed up for a porn-recovery
 * app's waitlist.
 */

const SUPABASE_URL = 'https://qqdcigfsavxnenygovdm.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ynsF6ZCjE1pJo1iR1Wtv8Q_ZpI0cx0o';

/** Abandon the request rather than spin forever behind a captive portal. */
const TIMEOUT_MS = 10_000;

export type WaitlistPlatform = 'ios' | 'android' | 'any';

export interface WaitlistSignup {
  readonly email: string;
  /** Which surface this came from, so we learn which dead end converts. */
  readonly source: string;
  readonly platform: WaitlistPlatform;
}

/** Everything the caller needs to render an outcome, with no exceptions thrown. */
export type WaitlistResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly message: string };

/**
 * Cheap client-side shape check, so an obvious typo is caught before a round
 * trip. The server re-validates; this exists for the error message, not safety.
 */
export function looksLikeEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 6 && trimmed.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed);
}

export async function joinWaitlist({
  email,
  source,
  platform,
}: WaitlistSignup): Promise<WaitlistResult> {
  if (!looksLikeEmail(email)) {
    return { ok: false, message: 'That does not look like an email address.' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/join_waitlist`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_email: email.trim(),
        p_source: source,
        p_platform: platform,
        // Only so the launch email can go out in a language they read.
        p_locale: typeof navigator === 'undefined' ? null : navigator.language.slice(0, 20),
      }),
    });

    if (response.ok) return { ok: true };

    // The server's flood guard is the one failure worth naming, because
    // "try again" is genuinely the right advice and "invalid" would be a lie.
    if (response.status === 400) {
      const body: unknown = await response.json().catch(() => null);
      const message =
        typeof body === 'object' && body !== null && 'message' in body
          ? String((body as { message: unknown }).message)
          : '';
      if (message.includes('temporarily closed')) {
        return { ok: false, message: 'Too many signups at once. Try again in a few minutes.' };
      }
      return { ok: false, message: 'That does not look like an email address.' };
    }

    return { ok: false, message: 'Could not save that just now. Please try again.' };
  } catch {
    // Aborts and network failures land here and are indistinguishable to the
    // visitor, so they get the one message that is true for both.
    return { ok: false, message: 'No connection. Check your network and try again.' };
  } finally {
    clearTimeout(timer);
  }
}
