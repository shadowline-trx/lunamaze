import type { JSX } from 'react';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import { contactEmail } from '@/content/lunamaze';

/**
 * Luna Maze privacy policy.
 *
 * A single canonical policy page for the studio. It opens with the studio-wide
 * privacy stance, then carries the full per-app policies under stable anchors
 * (`#axiom`, `#drift`) so each Google Play listing can deep-link straight to
 * its own section. Content mirrors the source policies previously kept as
 * markdown in the product repos (axiom/PRIVACY_POLICY.md, drift/PRIVACY_POLICY.md).
 *
 * Layout, tokens, and accessibility conventions mirror the Luna Maze product
 * pages: a fixed `ProductNav`, brand grid/noise backdrop on the header, and the
 * shared `LunaFooter`. Long-form copy uses the scoped `.lunamaze-prose` styles.
 */

const LAST_UPDATED = 'May 5, 2026';
const CONTACT_MAILTO = `mailto:${contactEmail}`;

interface Principle {
  readonly title: string;
  readonly description: string;
}

const PRINCIPLES: ReadonlyArray<Principle> = [
  {
    title: 'Local-first',
    description:
      'Your data lives on your device by default. Nothing leaves it unless you explicitly opt in.',
  },
  {
    title: 'No tracking',
    description:
      'No analytics SDKs, no fingerprinting, no advertising identifiers — in any product.',
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
              'Luna Maze builds privacy-first software. Our products keep your data on your device, use no tracking or ads, and ask for the least we can. This page explains exactly what that means for each app.'
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
              'Luna Maze ("we," "our," or "us") is an independent app and game studio based in India. This Privacy Policy covers Axiom, our dopamine recovery tracker. Policies for our other products will be published here as they launch.'
            }
          </p>
          <p>
            {
              'Across everything we build, the same commitments hold: your data is stored on your device first, we run no analytics or advertising SDKs, and we never sell or share your information.'
            }
          </p>

          {/* ---------------------------------------------------------------- */}
          <h2 id="axiom">Axiom — Dopamine Recovery Tracker</h2>
          <p>
            {
              'Luna Maze operates Axiom ("the App"), a mobile dopamine recovery tracker. We are committed to respecting your privacy.'
            }
          </p>
          <div className="rounded-xl border border-lunamaze-violet/30 bg-lunamaze-violet/5 px-5 py-4 text-lunamaze-textPrimary">
            {
              'Axiom is built local-first — your recovery data stays on your device by default.'
            }
          </div>

          <h3>Data stored locally</h3>
          <p>
            {
              'Axiom stores recovery data on your device using encrypted local storage (Hive). This includes:'
            }
          </p>
          <ul>
            <li>{'Streak count and recovery timeline'}</li>
            <li>{'Daily check-in data (mood, energy, urge levels)'}</li>
            <li>{'Mission completion progress'}</li>
            <li>{'Breathing exercise history'}</li>
            <li>{'Achievement and XP progress'}</li>
            <li>{'App preferences and settings'}</li>
          </ul>
          <p>
            <strong>
              {
                'This data never leaves your device unless you explicitly enable cloud sync.'
              }
            </strong>
          </p>

          <h3>Optional cloud sync (Supabase)</h3>
          <p>
            {'If you choose to create an account and enable cloud sync:'}
          </p>
          <ul>
            <li>{'Your recovery data is encrypted and stored on Supabase servers'}</li>
            <li>{'Used solely for cross-device sync and backup'}</li>
            <li>{'You can delete your cloud data at any time from Settings'}</li>
            <li>{'We do not analyze, sell, or share your synced data'}</li>
          </ul>

          <h3>Premium purchases (RevenueCat)</h3>
          <p>{'If you purchase a premium subscription:'}</p>
          <ul>
            <li>{'Payment processing is handled by Google Play and RevenueCat'}</li>
            <li>{'We receive a purchase token and entitlement status'}</li>
            <li>
              {'We do NOT receive your payment details (credit card, bank info)'}
            </li>
          </ul>

          <h3>Data we do not collect</h3>
          <ul>
            <li>{'Personal identification (name, email — unless you create an account)'}</li>
            <li>{'Location data'}</li>
            <li>{'Device identifiers or fingerprinting'}</li>
            <li>{'Browsing history'}</li>
            <li>{'Contact lists'}</li>
            <li>{'Photos or media'}</li>
            <li>{'Usage analytics or telemetry'}</li>
            <li>{'Advertising identifiers'}</li>
          </ul>

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
                  <td>Google Play</td>
                  <td>App distribution &amp; payments</td>
                  <td>Purchase transactions</td>
                </tr>
                <tr>
                  <td>RevenueCat</td>
                  <td>Subscription management</td>
                  <td>Anonymous purchase tokens</td>
                </tr>
                <tr>
                  <td>Supabase</td>
                  <td>Optional cloud sync</td>
                  <td>Encrypted recovery data (user-initiated)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            {'We do NOT use any analytics, advertising, or tracking SDKs.'}
          </p>

          <h3>Data retention</h3>
          <ul>
            <li>
              <strong>{'Local data: '}</strong>
              {'stored until you uninstall the app or clear app data'}
            </li>
            <li>
              <strong>{'Cloud data: '}</strong>
              {'stored until you delete your account or request deletion'}
            </li>
            <li>
              <strong>{'Purchase data: '}</strong>
              {'retained by Google Play per their policies'}
            </li>
          </ul>

          <h3>Data deletion</h3>
          <ul>
            <li>
              <strong>{'Local data: '}</strong>
              {'uninstall the app, or use Settings → Clear Data'}
            </li>
            <li>
              <strong>{'Cloud data: '}</strong>
              {'Settings → Account → Delete Account'}
            </li>
            <li>
              <strong>{'Purchase history: '}</strong>
              {'contact Google Play support'}
            </li>
          </ul>

          <h3>Children&rsquo;s privacy</h3>
          <p>
            {
              'Axiom is not directed at children under 13. We do not knowingly collect data from children. If you believe a child has provided us data, contact us for immediate deletion.'
            }
          </p>

          {/* ---------------------------------------------------------------- */}
          <h2>Changes to this policy</h2>
          <p>
            {
              'We may update this Privacy Policy from time to time. Changes will be posted on this page, and — for Axiom — within the app. Continued use of a product after changes take effect constitutes acceptance.'
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
