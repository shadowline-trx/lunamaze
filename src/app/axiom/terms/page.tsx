import type { JSX } from 'react';
import Link from 'next/link';
import { contactEmail } from '@/content/lunamaze';
import { internalUrl } from '@/lib/paths';

/**
 * Luna Maze subscription terms for Axiom.
 *
 * The canonical Terms of Use for Axiom subscriptions, carried under a stable
 * anchor (`#axiom`) so the App Store and Google Play listings can deep-link
 * straight to it. The Axiom section mirrors, word for word in substance, the
 * markdown source kept alongside the app (the store-facing terms link). Both
 * must stay in sync and must match what the app actually does: the core is
 * free, every plan is a recurring subscription billed by Apple or Google, a
 * free trial is offered only on the yearly plan, and refunds are handled by
 * the stores under their own policies. No price is ever hard-coded here.
 *
 * Chrome restyled 2026-08-03 to the AXIOM v3 "Silver Studio" language (static
 * CSS stage, minimal fixed nav, `.ax-prose` long-form styles). The legal
 * wording, section structure, anchors, and the "Last updated" date are
 * untouched — only the shell around them changed.
 */

const LAST_UPDATED = 'July 15, 2026';
const CONTACT_MAILTO = `mailto:${contactEmail}`;

interface QuickFact {
  readonly title: string;
  readonly description: string;
}

const QUICK_FACTS: ReadonlyArray<QuickFact> = [
  {
    title: 'Free core',
    description:
      'The heart of Axiom is free and stays free. A subscription is optional and only unlocks the deeper tools.',
  },
  {
    title: 'Recurring only',
    description:
      'Every plan is a recurring subscription billed by the store. There is no lifetime or one-time purchase.',
  },
  {
    title: 'Free trial on yearly',
    description:
      'A free trial is offered on the yearly plan, so you can decide before you are charged anything.',
  },
  {
    title: 'The store handles billing',
    description:
      'Apple and Google set the price, take payment, renew, and process refunds under their own policies.',
  },
];

const MONO = 'ax-mono';

export default function TermsPage(): JSX.Element {
  return (
    <div className="axiom-v3 relative min-h-screen">
      {/* Static stage: same look as the main landing, zero JS cost. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 0%, #131318 0%, #0a0a0d 52%, #070709 100%)',
          }}
        />
        <div className="ax-cage absolute inset-0" />
        <div className="ax-shafts" />
      </div>

      {/* Minimal nav */}
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,13,0.72), transparent)' }}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/axiom/" className="flex items-center gap-3">
            <img
              src={internalUrl('/images/axiom/logo.webp')}
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] rounded-xl"
            />
            <span className={`${MONO} text-sm font-medium tracking-[0.34em] text-[#e8e6f0]`}>
              AXIOM
            </span>
          </Link>
          <Link
            href="/axiom/"
            className={`${MONO} text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] transition-colors hover:text-[#e8e6f0]`}
          >
            ← The full story
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-3xl px-6 pb-28 pt-36">
        {/* Hero */}
        <div
          className={`${MONO} mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#9b98ad] backdrop-blur-md`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#8b7cf7] shadow-[0_0_12px_rgba(139,124,247,0.8)]" />
          Legal
        </div>
        <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[#f2f1f7]">
          Terms of <span className="ax-serif ax-grad-violet pr-1 font-normal">Use</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#a6a3b8]">
          {
            'These terms explain what an Axiom subscription costs, how billing and renewal work, how to cancel, and how refunds are handled. Axiom is free to use, any subscription is recurring and billed by Apple or Google, and the price you pay is always the one shown to you on the purchase screen. This page describes exactly what happens when you subscribe.'
          }
        </p>
        <p className={`${MONO} mt-6 text-[11px] tracking-[0.12em] text-[#8f8ca1]`}>
          Last updated: {LAST_UPDATED}
        </p>

        {/* At-a-glance subscription facts. */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {QUICK_FACTS.map((fact) => (
            <div key={fact.title} className="ax-card p-6">
              <p className="mb-2 text-base font-semibold text-[#f2f1f7]">
                {fact.title}
              </p>
              <p className="text-sm leading-relaxed text-[#a6a3b8]">
                {fact.description}
              </p>
            </div>
          ))}
        </div>

        {/* Full terms prose. */}
        <article className="ax-prose mt-16">
          <h2>Introduction</h2>
          <p>
            {
              'Luna Maze ("we," "our," or "us") is an independent app studio based in India. These Terms of Use explain how subscriptions work for Axiom, our dopamine recovery tracker, on the Apple App Store and Google Play. They should be read together with our Privacy Policy.'
            }
          </p>
          <p>
            {
              'This page covers what an Axiom subscription costs, how billing and renewal work, how to cancel, and how refunds are handled. The same terms govern both stores; the only differences are the store that processes your payment and the exact steps to cancel or request a refund on each platform.'
            }
          </p>

          {/* ---------------------------------------------------------------- */}
          <h2 id="axiom">Axiom Subscription Terms</h2>
          <p>
            {
              'Axiom ("the App") is a personal wellbeing and habit-tracking app that supports brain recovery, dopamine detox, and digital wellbeing. Its core is free to use. Axiom Protocol is an optional paid subscription that unlocks the deeper tools. This section applies to Axiom on both the Apple App Store (iOS) and Google Play (Android).'
            }
          </p>
          <div className="rounded-2xl border border-[#8b7cf7]/30 bg-[#8b7cf7]/[0.06] px-5 py-4 text-[#e8e6f0]">
            {
              'Every Axiom subscription is a recurring subscription billed by Apple or Google. There is no lifetime or one-time purchase. The price shown to you on the purchase screen, in your local currency, is the price you pay.'
            }
          </div>

          <h3>Axiom is free to use</h3>
          <p>
            {
              'The core of Axiom is free, and stays free: the panic tool, your streak and dashboard, daily check-ins, a breathing exercise, and your daily brief. You are never required to pay to keep using the free core.'
            }
          </p>
          <p>
            {
              'Axiom Protocol is an optional paid subscription that unlocks the deeper tools, including advanced insights and the full library and programs. Subscribing is entirely your choice.'
            }
          </p>

          <h3>What the Protocol costs</h3>
          <ul>
            <li>
              {
                'The price is always shown to you at the moment of purchase, in your local currency, on the purchase screen inside the app, before you confirm. The price displayed at checkout is the price you pay. We do not display or hard-code any price ourselves; every amount comes directly from Apple or Google for your region.'
              }
            </li>
            <li>
              {
                'Plans available may include weekly, monthly, and yearly options. The exact plans and prices can vary by country and can change over time; whatever is shown on the purchase screen at the time you buy is what applies to you.'
              }
            </li>
            <li>
              {
                'Longer plans cost less per week. The weekly plan is a short-term convenience option and therefore costs more per week than the monthly or yearly plan. Pick the plan that fits how you want to pay.'
              }
            </li>
            <li>
              {
                'All payments are collected by Apple (on iOS) or Google (on Android), not by us. Any applicable taxes or VAT are added and shown by the store.'
              }
            </li>
          </ul>

          <h3>Free trial and auto-renewal</h3>
          <p>{'Please read this section carefully.'}</p>
          <ul>
            <li>
              <strong>{'Free trial: '}</strong>
              {
                'a free trial is offered on the yearly plan. When a plan includes a free trial, the trial length and the exact date of your first charge are shown before you confirm. If you do not cancel at least 24 hours before the trial ends, the trial automatically converts to a paid subscription and you are charged. Cancel during the trial and you pay nothing.'
              }
            </li>
            <li>
              <strong>{'Auto-renewal: '}</strong>
              {
                'all subscriptions renew automatically. Unless you cancel at least 24 hours before the current period ends, the store automatically renews your subscription and charges you for the next period.'
              }
            </li>
            <li>
              <strong>{'Turning it off: '}</strong>
              {
                'you can turn off auto-renewal at any time (see "How to cancel" below). Turning it off stops all future charges. It does not refund the period you are currently in; you keep Protocol access until that period ends.'
              }
            </li>
          </ul>

          <h3>Price changes and our grandfather promise</h3>
          <ul>
            <li>
              {
                'If you are already a subscriber, a future price change does not silently apply to you. Your subscription continues at the price you originally subscribed at, for as long as you stay subscribed. Any price increase requires your explicit consent through the store; if you do not consent, your subscription simply stops renewing rather than charging you more.'
              }
            </li>
            <li>
              {
                'New prices apply only to new subscriptions started after the change. We implement new pricing as brand-new plans and never re-price the plan you bought.'
              }
            </li>
          </ul>

          <h3>How to cancel</h3>
          <p>
            {
              'Cancelling is done through the store you purchased from, not inside a hidden menu:'
            }
          </p>
          <ul>
            <li>
              <strong>{'iOS (Apple): '}</strong>
              {
                'open Settings, tap your name at the top, then Subscriptions, then Axiom, then Cancel Subscription. You can also do this from the App Store app: your profile picture, then Subscriptions.'
              }
            </li>
            <li>
              <strong>{'Android (Google): '}</strong>
              {
                'open the Google Play app, tap your profile picture, then Payments & subscriptions, then Subscriptions, then Axiom, then Cancel subscription.'
              }
            </li>
          </ul>
          <p>
            {
              'When you cancel, you keep Protocol access until the end of the period you have already paid for. Cancelling a subscription does not delete your data, and the free core of Axiom keeps working.'
            }
          </p>

          <h3>Refunds</h3>
          <p>
            {
              'Apple and Google process every payment for in-app subscriptions, so they, not us, handle refunds under their own policies. We cannot charge your card and we cannot issue a store refund directly. To request a refund:'
            }
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Store</th>
                  <th>How to request a refund</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>iOS (Apple)</td>
                  <td>
                    {
                      'Go to reportaproblem.apple.com, sign in with your Apple ID, find your Axiom purchase, and choose "Request a refund." Apple reviews and decides.'
                    }
                  </td>
                </tr>
                <tr>
                  <td>Android (Google)</td>
                  <td>
                    {
                      'Open Google Play, then Menu, then Order history, select the Axiom purchase, then Report a problem or Request a refund. Google reviews and decides. Many purchases are eligible for an automatic refund within 48 hours of purchase, directly in Google Play.'
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>{'Our position. '}</strong>
            {
              'Aside from the automatic windows the stores provide and any rights the law gives you (see below), subscription payments are generally non-refundable, because the Protocol delivers its value, full access to its content and tools, immediately and for the entire billing period. We built Axiom so you never have to gamble before paying: the entire core is free, and a free trial is offered on the yearly plan, so you can decide whether the Protocol is right for you before, or without, spending anything.'
            }
          </p>
          <p>
            {
              'That said, if you were charged in genuine error, a duplicate charge, a charge after you cancelled, or a technical failure that denied you the access you paid for, email us and we will help you resolve it with the store as quickly as possible.'
            }
          </p>

          <h3>Your statutory rights</h3>
          <p>
            {
              'Nothing in these terms removes or limits any right you have under the consumer-protection laws of your country. Depending on where you live you may have additional rights, for example:'
            }
          </p>
          <ul>
            <li>
              <strong>{'EU / UK: '}</strong>
              {
                'a 14-day right of withdrawal for digital purchases. Note that when you start a subscription that gives you immediate access to digital content and you agree to that immediate access at checkout, this withdrawal right may no longer apply once access has begun; the store presents this choice when you buy.'
              }
            </li>
            <li>
              <strong>{'Australia: '}</strong>
              {
                'consumer guarantees under the Australian Consumer Law that cannot be excluded.'
              }
            </li>
            <li>
              <strong>{'Other regions: '}</strong>
              {'your local consumer laws as applicable.'}
            </li>
          </ul>
          <p>
            {
              'Where the law grants you a right that conflicts with anything stated above, the law takes precedence.'
            }
          </p>

          <h3>Managing your subscription across devices</h3>
          <p>
            {
              'Your subscription is tied to the store account you bought it with (your Apple ID or your Google account) and to your Axiom account if you are signed in. A single Protocol subscription unlocks the Protocol on that account; it is for your personal use and is not shared through Family Sharing unless the store explicitly offers and you enable that option.'
            }
          </p>

          {/* ---------------------------------------------------------------- */}
          <h2>Changes to these terms</h2>
          <p>
            {
              'We may update these Terms of Use from time to time. Changes are posted here with an updated "Last updated" date, and material changes are announced within the app or on the store listing. Continued use after changes take effect constitutes acceptance.'
            }
          </p>

          <h2>Contact us</h2>
          <p>
            {
              'Questions about these terms or a subscription? Please tell us which store you purchased on (Apple or Google) and the approximate purchase date so we can help quickly. We cannot see your card details and cannot issue a store refund ourselves, but we will do everything on our side to make things right.'
            }
          </p>
          <ul>
            <li>
              <strong>{'Email: '}</strong>
              <a href={CONTACT_MAILTO}>{contactEmail}</a>
            </li>
            <li>
              <strong>{'Developer: '}</strong>
              {'Luna Maze, a studio of Harikrishnan V (shadowline), India'}
            </li>
          </ul>
        </article>
      </main>

      <footer className="relative border-t border-white/[0.06] bg-[#08080a] py-10">
        <p className={`${MONO} text-center text-[11px] uppercase tracking-[0.2em] text-[#8f8ca1]`}>
          A recovery app by{' '}
          <a href={internalUrl('/')} className="text-[#c9c6d8] underline underline-offset-2 transition-colors hover:text-[#e8e6f0]">
            Luna Maze
          </a>
        </p>
      </footer>
    </div>
  );
}
