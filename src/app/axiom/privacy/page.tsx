import type { JSX } from 'react';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import { contactEmail } from '@/content/lunamaze';

/**
 * Luna Maze privacy policy.
 *
 * A single canonical policy page for the studio. It opens with the studio-wide
 * privacy stance, then carries the full per-app policy under a stable anchor
 * (`#axiom`) so the App Store and Google Play listings can deep-link straight
 * to it. The Axiom section mirrors, word for word in substance, the markdown
 * source kept at github.com/shadowline-trx/axiom-privacy (the in-app link
 * fallback). Both must stay in sync and must match what the app actually does.
 *
 * Layout, tokens, and accessibility conventions mirror the Luna Maze product
 * pages: a fixed `ProductNav`, brand grid/noise backdrop on the header, and the
 * shared `LunaFooter`. Long-form copy uses the scoped `.lunamaze-prose` styles.
 */

const LAST_UPDATED = 'July 15, 2026';
const CONTACT_MAILTO = `mailto:${contactEmail}`;

interface Principle {
  readonly title: string;
  readonly description: string;
}

const PRINCIPLES: ReadonlyArray<Principle> = [
  {
    title: 'Local-first',
    description:
      'Your data lives on your device by default. Most of what you enter never leaves it.',
  },
  {
    title: 'No third-party tracking',
    description:
      'No third-party analytics or ad SDKs, no fingerprinting, no advertising identifiers. Any analytics we run are our own, and in Axiom you can switch them off.',
  },
  {
    title: 'No ads',
    description:
      'Every Luna Maze product is ad-free by design. You are never the product.',
  },
  {
    title: 'Minimal permissions',
    description:
      'We request only what a feature genuinely needs, and nothing more.',
  },
];

export default function PrivacyPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="Privacy" />

      {/* Header over the brand grid/noise backdrop. */}
      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-16 lunamaze-grid-bg lunamaze-noise">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-8">
            <span
              className="w-1.5 h-1.5 rounded-full bg-lunamaze-signal"
              aria-hidden="true"
            />
            Legal
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
            <span className="lunamaze-text-gradient">Privacy Policy</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-lunamaze-textSecondary leading-relaxed">
            {
              'Luna Maze builds privacy-first software. Our products keep your data on your device, use no third-party tracking or ads, and ask for the least we can. This page explains exactly what that means for each app.'
            }
          </p>
          <p className="mt-6 text-sm text-lunamaze-textDim">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </header>

      {/* Studio-wide privacy principles. */}
      <section className="relative px-6 sm:px-8 lg:px-16 pb-4">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-6 backdrop-blur-sm"
            >
              <p className="text-base font-semibold text-lunamaze-textPrimary mb-2">
                {principle.title}
              </p>
              <p className="text-sm text-lunamaze-textSecondary leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Full policy prose. */}
      <section className="relative px-6 sm:px-8 lg:px-16 py-16 sm:py-20">
        <article className="lunamaze-prose max-w-3xl mx-auto">
          <h2>Introduction</h2>
          <p>
            {
              'Luna Maze ("we," "our," or "us") is an independent app studio based in India. This Privacy Policy covers Axiom, our dopamine recovery tracker, available on the Apple App Store and Google Play. Policies for our other products will be published here as they launch.'
            }
          </p>
          <p>
            {
              'Across everything we build, the same commitments hold: your data is stored on your device first, we run no third-party analytics or advertising SDKs, and we never sell or share your information for anyone else’s purposes.'
            }
          </p>

          {/* ---------------------------------------------------------------- */}
          <h2 id="axiom">Axiom — Dopamine Recovery Tracker</h2>
          <p>
            {
              'Axiom ("the App") is a personal wellbeing and habit-tracking app that supports brain recovery, dopamine detox, and digital wellbeing. This section applies to Axiom on both the Apple App Store (iOS) and Google Play (Android). The same policy governs both; the only differences are the store that processes your payment and the sign-in options on each platform.'
            }
          </p>
          <div className="rounded-xl border border-lunamaze-violet/30 bg-lunamaze-violet/5 px-5 py-4 text-lunamaze-textPrimary">
            {
              'Axiom is built local-first. Your recovery data stays on your device by default, and your journal, trigger names, and reset reasons never leave it.'
            }
          </div>

          <h3>Data stored only on your device</h3>
          <p>
            {
              'By default, Axiom stores your data locally using an on-device database (Hive), protected by your device’s own security. This includes:'
            }
          </p>
          <ul>
            <li>{'Daily check-in entries (mood, energy, urge levels, and any notes you write)'}</li>
            <li>{'Streak and recovery timeline (start dates, reset reasons, reset triggers)'}</li>
            <li>{'Journal and reflection text'}</li>
            <li>{'Breathing exercise history'}</li>
            <li>{'Mission progress, achievements, and XP'}</li>
            <li>{'Your onboarding answers, pact, and personalized settings'}</li>
          </ul>
          <p>
            <strong>
              {
                'This information stays on your device, except for the specific, limited flows described below — and even then, your free-text recovery content is removed first.'
              }
            </strong>
          </p>

          <h3>Product analytics (first-party, opt-out)</h3>
          <p>
            {
              'To understand which parts of the App help and which get ignored, Axiom records product-analytics events on our own infrastructure (our Supabase database). No third-party analytics vendor, ad network, or data broker is involved.'
            }
          </p>
          <ul>
            <li>
              <strong>{'What is recorded: '}</strong>
              {
                'app opens, which screens you visit and for how long, feature-usage signals (for example, that a breathing session completed and how long it ran), onboarding progress as lengths and counts only, and paywall interactions. Events also carry coarse context: app version, a device performance tier (a high / mid / low bucket, not a device ID), your language setting, and a coarse install-month cohort.'
              }
            </li>
            <li>
              <strong>{'What is never recorded: '}</strong>
              {
                'your journal or reflection text, your mood values, your trigger names, your check-in notes, your pact text, or any other recovery content. The App strips these before any event is sent, enforced as a hard rule in the code and by a fixed deny-list of sensitive keys.'
              }
            </li>
            <li>
              <strong>{'How it links to you: '}</strong>
              {
                'when you are signed in, events are tagged with your account ID; when you are signed out, they are not linked to any account. Deleting your account removes the link between past events and you.'
              }
            </li>
            <li>
              <strong>{'Your control: '}</strong>
              {'the Settings > Privacy toggle turns analytics off at any time, and the App stops collecting immediately.'}
            </li>
          </ul>

          <h3>Account and authentication (only if you create an account)</h3>
          <p>
            {
              'Creating an account is optional — Axiom is fully usable without one. If you choose to sign in, you can use email and password, Google, or (on iOS) Sign in with Apple.'
            }
          </p>
          <ul>
            <li>
              {
                'We receive your email address. With Sign in with Apple you may use Apple’s private relay email, in which case we only ever see the relay address.'
              }
            </li>
            <li>{'With Google or Apple, we may also receive your name, only to set up your account.'}</li>
            <li>{'You may choose an optional display name and username.'}</li>
            <li>
              {
                'With email and password, your password is sent over HTTPS and stored only as a one-way hash by our authentication provider (Supabase Auth). We never see or store your plaintext password.'
              }
            </li>
          </ul>
          <p>
            {
              'This account information is held by our authentication provider (Supabase Auth) and is not copied into any other database we run.'
            }
          </p>

          <h3>Cloud backup of your progress (only if you are signed in)</h3>
          <p>
            {
              'When you are signed in, Axiom backs up a minimal slice of your progress to our own database so you can restore it on a new device:'
            }
          </p>
          <ul>
            <li>{'Streak records: start date, end date, and whether the streak is active.'}</li>
            <li>{'Check-ins: the date and a single numeric mood level (a 1 to 5 rating).'}</li>
          </ul>
          <p>
            <strong>
              {
                'Your journal notes, your trigger names, and your reset reasons never leave your device.'
              }
            </strong>
            {
              ' They are removed by the App before syncing, and our database additionally refuses to store those fields as a hard rule at the server level, so plaintext recovery content is never persisted on our servers. This backup is encrypted in transit (HTTPS/TLS) and encrypted at rest; it is not end-to-end encrypted, and we are technically able to access the minimal fields listed above.'
            }
          </p>

          <h3>Subscriptions and payments</h3>
          <p>
            {
              'If you purchase a subscription, payment is processed entirely by Apple (on iOS) or Google Play (on Android). We never receive or store your card, bank, or other payment details.'
            }
          </p>
          <p>
            {
              'We use RevenueCat to manage subscription status. RevenueCat receives your purchase receipt and entitlement status (active, trial, expired). Its identifier for you is anonymous until you make a purchase; because purchasing requires signing in, at that point the identifier is set to your Axiom account ID so your subscription follows your account across devices and platforms. RevenueCat still never receives your name, email, or any recovery or health data.'
            }
          </p>

          <h3>Community and support features you choose to use</h3>
          <p>{'These are optional and only send data when you actively use them:'}</p>
          <ul>
            <li>
              <strong>{'Username: '}</strong>
              {'if you claim a username, it becomes a public handle other signed-in users can see.'}
            </li>
            <li>
              <strong>{'Buddy Bond: '}</strong>
              {
                'to connect with an accountability partner, you generate a share code and choose a display name. If someone bonds with you, the display name you chose is shown to that one partner. "Nudges" between buddies are dated pings that carry no message content. No recovery data is ever shared with a buddy.'
              }
            </li>
            <li>
              <strong>{'Messages you send us: '}</strong>
              {
                'when you contact the team through the App (for example, the in-app founder channel), report a buddy, or answer our cancellation survey, the message or feedback you write and your account ID are sent to and stored on our servers so we can read and respond. If you ask for a personal reply, we also store the email you provide for that purpose. We use these only to support you and improve the App, never for advertising, and they are deleted when you delete your account.'
              }
            </li>
          </ul>

          <h3>Photos, notifications, and permissions</h3>
          <ul>
            <li>
              <strong>{'Photos: '}</strong>
              {
                'Axiom accesses your photo library only when you choose a profile picture or attach an image, and only from the gallery (never the camera). The image is copied to local storage on your device and is never uploaded.'
              }
            </li>
            <li>
              <strong>{'Notifications: '}</strong>
              {
                'reminders and milestone alerts are generated on your device by the operating system’s local scheduler. No push token is sent to any server, and notifications contain only what you already entered.'
              }
            </li>
            <li>
              <strong>{'Biometrics: '}</strong>
              {
                'Face ID or fingerprint is used by your device to unlock the App locally; the biometric itself never reaches us.'
              }
            </li>
          </ul>

          <h3>Data we do not collect</h3>
          <ul>
            <li>{'Location data'}</li>
            <li>{'Contacts, calendar, or files'}</li>
            <li>{'Camera (image selection is gallery-only and stays on your device)'}</li>
            <li>{'Browsing history, or usage of other apps on your device'}</li>
            <li>{'Advertising identifiers (no IDFA / IDFV / Google Advertising ID)'}</li>
            <li>{'Device fingerprints or cross-app tracking'}</li>
            <li>{'Any third-party advertising or analytics SDK'}</li>
          </ul>
          <p>
            {
              'We do not sell or share your data for advertising, and we do not use your data to train AI models.'
            }
          </p>

          <h3>Third-party services</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Purpose</th>
                  <th>Data shared</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Apple App Store / Google Play</td>
                  <td>Distribution &amp; payments</td>
                  <td>Purchase transactions (we never see payment details)</td>
                </tr>
                <tr>
                  <td>RevenueCat</td>
                  <td>Subscription management</td>
                  <td>Purchase receipt &amp; entitlement, tied to your account ID after purchase; never name, email, or health data</td>
                </tr>
                <tr>
                  <td>Supabase</td>
                  <td>Our backend (auth, our analytics DB, optional backup, social &amp; support)</td>
                  <td>Only the data described above; a processor hosting our own database, not a data buyer</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Data retention and deletion</h3>
          <ul>
            <li>
              <strong>{'Local data: '}</strong>
              {'use "Delete All Data" in Settings, or uninstall the App.'}
            </li>
            <li>
              <strong>{'Account & cloud data: '}</strong>
              {'delete your account in the App (Settings) or by email; cloud data is permanently erased within 30 days of a deletion request.'}
            </li>
            <li>
              <strong>{'Subscription records: '}</strong>
              {'retained by Apple, Google, and RevenueCat per their own policies.'}
            </li>
          </ul>

          <h3>Managing your subscription</h3>
          <ul>
            <li>{'iOS: manage or cancel from your Apple ID subscription settings in the App Store.'}</li>
            <li>{'Android: manage or cancel from your subscriptions in Google Play.'}</li>
          </ul>

          <h3>Security</h3>
          <p>
            {
              'Local data is protected by your device’s own security. Data sent to our servers is encrypted in transit (HTTPS/TLS) and at rest, and passwords are hashed before storage. As defense-in-depth for such a sensitive category of app, your free-text recovery content is stripped before it can be sent and is additionally blocked at the database level, so it is never stored on our servers.'
            }
          </p>

          <h3>Your rights</h3>
          <p>
            {
              'Depending on where you live, you may have rights to access, correct, delete, restrict, port, or object to the processing of your data (GDPR in the EU/UK; CCPA/CPRA in California, including the right to opt out of any sale — Axiom does not sell personal data). Because most data stays on your device, you can exercise most rights yourself with "Delete All Data" or by uninstalling. For account or cloud data, use in-app account deletion or contact us.'
            }
          </p>

          <h3>Age requirement and children&rsquo;s privacy</h3>
          <p>
            {
              'Axiom is intended for users aged 17 and older. It addresses topics related to compulsive behavior and pornography recovery that are not appropriate for minors. We do not knowingly collect data from anyone under 17. If you believe a minor has used the App, contact us for immediate deletion.'
            }
          </p>

          <h3>Health and wellness disclaimer</h3>
          <p>
            {
              'Axiom is a general wellbeing and habit-tracking tool. It is not a medical device and is not intended to diagnose, treat, cure, or prevent any condition. Its statistics and recovery phases are informational only and not a substitute for professional advice. If you are experiencing a mental-health crisis, please contact a qualified professional or your local emergency services.'
            }
          </p>

          <h3>International users</h3>
          <p>
            {
              'We are based in India, and our infrastructure providers may process and store data on servers located outside your country, with appropriate safeguards where required.'
            }
          </p>

          {/* ---------------------------------------------------------------- */}
          <h2>Changes to this policy</h2>
          <p>
            {
              'We may update this Privacy Policy from time to time. Changes are posted here with an updated "Last updated" date, and — for Axiom — material changes are announced within the app or on the store listing. Continued use after changes take effect constitutes acceptance.'
            }
          </p>

          <h2>Contact us</h2>
          <p>{'If you have questions about this Privacy Policy:'}</p>
          <ul>
            <li>
              <strong>{'Email: '}</strong>
              <a href={CONTACT_MAILTO}>{contactEmail}</a>
            </li>
            <li>
              <strong>{'Developer: '}</strong>
              {'Luna Maze, India'}
            </li>
          </ul>
        </article>
      </section>

      <LunaFooter />
    </main>
  );
}
