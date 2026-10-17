import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { contactEmail, secondaryContactEmail } from '@/content/lunamaze';
import styles from './kern-privacy.module.css';

/** Kern privacy disclosures for Android 1.1: match Telemetry.kt and Monetization.kt. */

const LAST_UPDATED = 'October 17, 2026';

export const metadata: Metadata = {
  title: 'Privacy — Kern',
  description:
    'Kern keeps your private content on your phone. Optional Firebase diagnostics and Google Play/Superwall purchases are explained in this policy.',
  alternates: { canonical: 'https://lunamaze.com/kern/privacy/' },
  openGraph: {
    title: 'Privacy — Kern',
    description: 'Local private content, optional Firebase diagnostics, and clear Google Play/Superwall purchase disclosures.',
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
          Kern keeps your notes and phone-use records on your device. It has no account
          or ads. Optional diagnostics use Firebase; paywalls and purchases use Google
          Play and Superwall.
        </p>
        <p>
          Luna Maze publishes Kern and is responsible for the app practices described here.
          This policy explains the local features, optional diagnostics and purchase services.
        </p>

        <h2>What leaves your phone</h2>
        <p>
          This policy describes Android version 1.1 and later. Earlier versions may not
          include these services. Kern does not ask for your name, email, contacts or
          account. Private notes, pages, searches, notification content and records of
          which apps you use are not attached to analytics or paywall events.
        </p>
        <ul>
          <li><strong>Optional usage and diagnostics.</strong> Firebase Analytics and
            Crashlytics are off until you agree in Kern. You can decline without losing
            launcher features, and change your answer in Settings.</li>
          <li><strong>Paywalls and purchases.</strong> Superwall provides plan screens,
            purchase validation and subscription status through Google Play. These
            services operate separately from optional diagnostics.</li>
        </ul>
        <h2>Usage and diagnostics, only with your agreement</h2>
        <p>
          When enabled, Kern sends Firebase a fixed vocabulary of feature, tutorial,
          pause-outcome, preview and purchase-result events. These can include the
          feature category, subscription tier, preview day and product identifier.
          Firebase also processes installation identifiers, sessions, app/device versions,
          language and general location derived from the network address. Advertising ID
          collection and advertising personalization are disabled.
        </p>
        <p>
          Crashlytics receives crash and diagnostic reports, including stack traces,
          installation identifiers and device/app state. Kern does not deliberately attach
          your private content. These identifiers distinguish installations; reports are
          not described as anonymous simply because Kern does not ask for your name.
          See <a href="https://firebase.google.com/support/privacy">Firebase privacy information</a>.
        </p>
        <p>
          Settings shows custom events handed to Firebase during the current session.
          This is not a delivery receipt or a complete list of SDK-generated events.
          Turning reports off stops future optional collection. Resetting local analytics
          creates a fresh local analytics identity and clears local state; it does not
          erase previously uploaded reports. Provider retention settings and policies
          apply to uploaded data. Contact us about access or deletion requests.
        </p>

        <h2>What stays on your phone</h2>
        <p>
          Kern stores the following in Android&rsquo;s private app storage. It does not
          upload this content or detailed phone-use history to Firebase or Superwall.
          Exports you choose and Android&rsquo;s own backup/restore settings are separate:
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
          Uninstalling Kern removes the local app copy. Exported files remain wherever you
          saved them. Android may back up and restore app data according to your device
          and Google account settings; manage those backups in Android. You can export
          your pages or clear what Kern has learned from Settings.
        </p>

        <h2>Permissions, and exactly why</h2>
        <p>
          Access for the optional features below can be left off; Kern still works with
          those features unavailable. Network access is a standard Android permission
          used by the services described here and does not have a separate runtime prompt.
        </p>
        <ul>
          <li>
            <strong>Network access.</strong> Google Play and Superwall use it for paywall
            delivery and purchase checks. Optional Firebase reports use it after your
            agreement. The launcher and private notes work offline.
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

        <h2>Paywalls and payments</h2>
        <p>
          Google Play handles payment. Kern does not receive card details. Superwall
          processes installation identifiers, paywall interactions, device/app metadata
          and Play purchase tokens or transaction details to load offers, restore access
          and keep subscription status current, including renewals and refunds. It can
          contact its service at startup to check configuration and existing access.
          Kern does not set an email or account identity in Superwall.
        </p>
        <p>
          Purchase records are retained as needed to provide and verify access and handle
          subscription changes, subject to provider policies and applicable obligations.
          Uninstalling Kern or resetting optional analytics does not cancel a subscription
          or erase purchase records. Manage or cancel subscriptions in Google Play.
          See <a href="https://policies.google.com/privacy">Google&rsquo;s privacy policy</a> and{' '}
          <a href="https://superwall.com/privacy">Superwall&rsquo;s privacy policy</a>.
        </p>
        <h2>Children</h2>
        <p>
          Kern is not directed at children. If you believe a child has supplied data to
          these services through Kern, contact us so we can investigate and assist.
        </p>
        <h2 id="data-deletion">Your choices and data deletion requests</h2>
        <p>
          Turn optional reports off or reset their local state in Settings. Export your
          pages before uninstalling if you want to keep them. For access, correction or
          deletion of uploaded information, contact{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We may need enough
          information to locate the relevant provider record; do not send private notes,
          a payment-card number or your Google password. We will explain any records we
          cannot locate or must retain. Kern does not sell personal information or use an
          advertising network. Providers process data on their infrastructure, which may
          be outside your country.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy ever changes, the revised version will be posted here with a new
          date. Changes to optional diagnostics are explained in the app before consent.
          Purchase processing needed to provide paid access is described here.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy, or anything else:{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or{' '}
          <a href={`mailto:${secondaryContactEmail}`}>{secondaryContactEmail}</a>.
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
