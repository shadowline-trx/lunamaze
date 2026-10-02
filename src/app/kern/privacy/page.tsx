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
 * checkable against the source: the only networking code is data/Telemetry.kt (opt-in,
 * a fixed vocabulary of events and property keys) and the Google Play purchase path in
 * data/Billing.kt; the notification log stores a package name, an hour and an outcome
 * and nothing else. data/RcBilling.kt exists but is inert while RC_PUBLIC_KEY is empty;
 * if it is ever switched on, the Payments section has to name RevenueCat first.
 */

const LAST_UPDATED = 'October 2, 2026';

export const metadata: Metadata = {
  title: 'Privacy — Kern',
  description:
    'Kern has no account, no ads and no tracking, and sends nothing about you unless you turn on anonymous counts. The full privacy policy.',
  alternates: { canonical: 'https://lunamaze.com/kern/privacy/' },
  openGraph: {
    title: 'Privacy — Kern',
    description: 'No account, no ads, no tracking. Anonymous counts only if you turn them on.',
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
          Kern has no account, no ads and no tracking. It sends nothing about you unless
          you turn on anonymous counts &mdash; and if you do, you can read every one.
        </p>
        <p>
          That is the short version. Everything below is the detail behind it, written out
          because a one-line privacy policy is easy to write and hard to believe.
        </p>

        <h2>What leaves your phone</h2>
        <p>
          By default, nothing about you. Kern has no account and no sign-in and no
          advertising identifier, and it does not ask for your email address, your name,
          your phone number or your contacts. Your notes, pages, usage figures and
          everything else described further down stay on the device.
        </p>
        <p>Two things can use the network, and only these two:</p>
        <ul>
          <li>
            <strong>Purchases.</strong> Buying or restoring a licence goes through Google
            Play. See Payments below.
          </li>
          <li>
            <strong>Anonymous counts, if you turn them on.</strong> Off by default. Kern
            asks once, a day or more after you start using it, and Settings can turn it on
            or off at any time.
          </li>
        </ul>

        <h2>Anonymous counts (only if you say yes)</h2>
        <p>
          If you turn them on, Kern sends a small set of counts to a database run by Luna
          Maze, so that the person who makes it can tell what is used, what is not, and
          whether a purchase went through:
        </p>
        <ul>
          <li>
            That Kern was opened on a given day, whether the licence is a trial, paid or
            lapsed, which day of the trial it was, and whether usage access was granted.
          </li>
          <li>
            That a feature was used: the record, focus sessions, the battery page, extra
            pages, widgets, deep search, backup.
          </li>
          <li>
            That the pause before opening an app appeared, whether it was turned back or
            opened anyway, and how many seconds that took. Not which app.
          </li>
          <li>
            That the price screen or the receipt was shown, which product was tapped, and
            whether a purchase succeeded or failed.
          </li>
          <li>
            That Kern stopped being, or became again, your home screen; and the class name
            of an error if the app crashes (for example NullPointerException), with no
            message and no trace.
          </li>
          <li>
            The build number of Kern, the Android version, your language, and your time
            zone&rsquo;s offset from UTC.
          </li>
        </ul>
        <p>
          <strong>Never sent:</strong> which apps you use or pause, the name of any app,
          the text of a page, note, notification or search, your contacts, your location,
          or anything that identifies you. There is no account to link counts to. The only
          identifier is a random number generated on your phone the first time you turn
          counts on; it is not derived from anything about you or the device.
        </p>
        <p>
          You can read exactly what has been sent, word for word, in Settings under
          Anonymous counts. You can also erase it there: Kern asks the server to delete
          every count stored under your number, then starts a new one. Turning counts off
          deletes anything not yet sent. Counts older than 90 days are deleted
          automatically. Our hosting provider, Supabase, may log network addresses as part
          of running its service; Kern does not store them with the counts.
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
            <strong>Network access.</strong> Two things use it, both described above:
            checking a purchase, and the anonymous counts, which do nothing until you
            turn them on. Nothing else in Kern uses the network.
          </li>
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
          licence is held and receives a yes or a no; no purchase-checking service sits in
          between. Google&rsquo;s handling of that transaction is covered by{' '}
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
          access, correct, export and erase personal data held about you. Kern holds no
          personal information: the anonymous counts are not linked to your name or an
          account, and we cannot trace them to you, but you can still erase them from
          Settings, or ask at <a href="mailto:hello@lunamaze.com">hello@lunamaze.com</a>.
          Everything else is on your phone, exportable from Settings and destroyed when
          you uninstall.
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
