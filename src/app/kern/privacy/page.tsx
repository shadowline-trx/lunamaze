import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import styles from './kern-privacy.module.css';

/**
 * Kern's privacy policy.
 *
 * Its own page rather than a section of the studio policy, because Google Play links to
 * one URL per listing and that link is checked in review. It lives under /kern/ so it
 * inherits the product layout's fonts and reads as part of the same thing the visitor
 * just came from.
 *
 * The wording has to keep matching what the app actually does. Every claim below is
 * checkable against the source: there is no networking code in Kern at all, and the
 * notification log stores a package name, an hour and an outcome and nothing else.
 */

const LAST_UPDATED = 'August 29, 2026';

export const metadata: Metadata = {
  title: 'Privacy — Kern',
  description:
    'Kern collects nothing, sends nothing, and has no server to send it to. The full privacy policy.',
  alternates: { canonical: 'https://lunamaze.com/kern/privacy/' },
  openGraph: {
    title: 'Privacy — Kern',
    description: 'Kern collects nothing, sends nothing, and has no server to send it to.',
    url: 'https://lunamaze.com/kern/privacy/',
    siteName: 'Luna Maze',
    type: 'article',
  },
};

export default function KernPrivacyPage(): JSX.Element {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link className={styles.wordmark} href="/kern/">
          <span className={styles.wordmarkIcon}>K</span>
          <span>KERN</span>
        </Link>
      </header>

      <main className={styles.main}>
        <p className={styles.eyebrow}>PRIVACY POLICY</p>
        <h1 className={styles.title}>Privacy</h1>
        <p className={styles.lede}>
          Kern collects nothing, sends nothing, and has no server to send it to.
        </p>
        <p>
          That is the whole policy. Everything below is the detail behind it, written out
          because a one-line privacy policy is easy to write and hard to believe.
        </p>

        <h2>What is collected</h2>
        <p>
          Nothing. Kern has no analytics, no crash reporting service, no advertising
          identifier, no account and no sign-in. It does not ask for your email address,
          your name, your phone number or your contacts. There is no telemetry, not even
          anonymous usage counts.
        </p>
        <p>
          Kern makes no network requests of any kind. It has no backend. There is no
          address anywhere in the app for your information to be sent to, which is a
          stronger guarantee than a promise not to send it.
        </p>

        <h2>What stays on your phone</h2>
        <p>
          Kern is a launcher and a notebook, so it necessarily works with information
          about how you use your phone. All of it is written to the device&rsquo;s own
          private app storage, which no other app can read, and none of it leaves the
          device:
        </p>
        <ul>
          <li>
            <strong>Your pages and notes.</strong> Everything you write, kept in
            Kern&rsquo;s own storage on the phone.
          </li>
          <li>
            <strong>Screen-time figures.</strong> How long the screen was on and which
            apps were in front, read from Android&rsquo;s usage statistics with your
            permission and summarised for the day&rsquo;s record.
          </li>
          <li>
            <strong>Notification counts.</strong> Which app sent a notification, at what
            hour, and what became of it — opened, dismissed, or withdrawn by the app.
            Kern <strong>never</strong> stores a notification&rsquo;s title, its text or
            its sender.
          </li>
          <li>
            <strong>Data usage figures.</strong> How many bytes each app moved, read from
            the same Android usage statistics.
          </li>
          <li>
            <strong>Battery readings.</strong> Percentage, charge counter, temperature and
            voltage, sampled over time so that capacity and drain rates can be worked out.
          </li>
          <li>
            <strong>Which apps you open, and when.</strong> Used to put the app you are
            likely to want at the top of the drawer, and to order search results. Kept as
            counts and times, and clearable in one tap from Settings.
          </li>
          <li>
            <strong>Your settings and layout.</strong> Favourites, hidden apps, theme and
            the rest.
          </li>
        </ul>
        <p>
          Uninstalling Kern removes all of it. You can also export your pages, or clear
          what Kern has learned, from within Settings at any time.
        </p>

        <h2>Permissions, and exactly why</h2>
        <p>
          Every one of these is optional. Kern works without them; the feature each
          supports is what stops working, and Kern asks only at the moment you use it.
        </p>
        <ul>
          <li>
            <strong>Usage access.</strong> The day&rsquo;s record, and the data-usage
            figures. Android will not report screen time to any app without it. Granted
            by hand in system settings.
          </li>
          <li>
            <strong>Notification access.</strong> The notification shelf, and counting
            interruptions. Notifications are read in order to show and dismiss them, and
            to count them. Nothing about their content is stored and nothing is
            transmitted.
          </li>
          <li>
            <strong>Display over other apps.</strong> Returning a blocked app to the home
            screen during a focus session. Used for nothing else.
          </li>
          <li>
            <strong>Biometric or device credential.</strong> Unlocking a page or the inbox
            you have chosen to lock. Kern never sees your fingerprint or PIN; it asks
            Android whether you are you and receives a yes or a no.
          </li>
          <li>
            <strong>Notifications.</strong> Sending you the charge alarm, if you turn it
            on.
          </li>
          <li>
            <strong>Modify system settings.</strong> Optional, and grantable only over
            adb. Switching mobile data off on a schedule, if you choose to set that up.
            Used for nothing else.
          </li>
        </ul>

        <h2>Payments</h2>
        <p>
          Purchases are handled entirely by Google Play. Kern never sees your card
          details, your billing address or your Google account. It asks Play whether a
          licence is held and receives a yes or a no. Google&rsquo;s handling of that
          transaction is covered by{' '}
          <a href="https://policies.google.com/privacy">Google&rsquo;s privacy policy</a>.
        </p>

        <h2>Children</h2>
        <p>
          Kern is not directed at children, and since it collects no personal information
          from anyone, it collects none from children either.
        </p>

        <h2>Your rights</h2>
        <p>
          Regulations such as the GDPR and India&rsquo;s DPDP Act give you the right to
          access, correct, export and erase personal data held about you. Kern holds
          none, so there is nothing for us to hand over or delete — the data is on your
          phone, under your control, exportable from Settings, and destroyed when you
          uninstall.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy ever changes, the revised version will be posted here with a new
          date. Any change that would involve collecting information would arrive as a
          prominent notice in the app first, and would be something you opt into.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy, or anything else:{' '}
          <a href="mailto:hello@lunamaze.com">hello@lunamaze.com</a> or{' '}
          <a href="mailto:lunamaze.dev@gmail.com">lunamaze.dev@gmail.com</a>.
        </p>

        <p>
          For product, compatibility, feature and licence answers, read the{' '}
          <Link href="/kern/faq/">Kern FAQ</Link>, or{' '}
          <Link href="/kern/">return to the Kern overview</Link>.
        </p>

        <p className={styles.stamp}>
          KERN · <code>dev.lunamaze.kern</code> · LAST UPDATED {LAST_UPDATED.toUpperCase()}
        </p>
      </main>
    </div>
  );
}
