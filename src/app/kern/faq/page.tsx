import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { contactEmail } from '@/content/lunamaze';
import { KERN_PLAY_URL } from '@/content/kern';
import styles from './kern-faq.module.css';

export const metadata: Metadata = {
  title: 'Kern FAQ — Android Launcher, Privacy & Pricing',
  description:
    'Answers about the Kern Android launcher: Google Play availability, compatibility, search, privacy, focus, notes, the 14-day trial, and Full Measure.',
  alternates: { canonical: 'https://lunamaze.com/kern/faq/' },
  openGraph: {
    title: 'Kern FAQ — Android Launcher, Privacy & Pricing',
    description:
      'Clear answers about Kern compatibility, features, on-device privacy, Full Measure, and Google Play availability.',
    url: 'https://lunamaze.com/kern/faq/',
    siteName: 'Luna Maze',
    type: 'website',
    images: [
      {
        url: 'https://lunamaze.com/images/kern/og.png',
        width: 1731,
        height: 909,
        alt: 'Kern Android launcher',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kern FAQ — Android Launcher, Privacy & Pricing',
    description:
      'Compatibility, features, privacy, permissions, subscriptions, and Google Play answers for Kern.',
    images: ['https://lunamaze.com/images/kern/og.png'],
  },
};

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://lunamaze.com/kern/faq/#webpage',
      url: 'https://lunamaze.com/kern/faq/',
      name: 'Kern FAQ — Android Launcher, Privacy & Pricing',
      description:
        'Product, compatibility, privacy, permission, subscription, and Google Play answers for the Kern Android launcher.',
      datePublished: '2026-08-31',
      dateModified: '2026-10-13',
      isPartOf: { '@id': 'https://lunamaze.com/#website' },
      about: { '@id': 'https://lunamaze.com/kern/#app' },
      publisher: { '@id': 'https://lunamaze.com/#organization' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Luna Maze',
          item: 'https://lunamaze.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Kern',
          item: 'https://lunamaze.com/kern/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'FAQ',
          item: 'https://lunamaze.com/kern/faq/',
        },
      ],
    },
  ],
};

const groups = [
  {
    id: 'basics',
    index: '01',
    title: 'The basics',
    questions: [
      {
        question: 'What is Kern?',
        answer:
          'Kern is a native Android home launcher built to make common actions faster without turning the home screen into a feed. It combines a complete app drawer, ranked local search, an honest daily activity ledger, focus sessions, and plain-text pages. It is a practical home screen and lifestyle utility—not a digital-wellbeing scorecard and not merely an empty minimalist theme.',
      },
      {
        question: 'How is Kern different from other minimalist Android launchers?',
        answer:
          'Most minimalist launchers concentrate on hiding icons. Kern starts with speed: the full drawer stays predictable, frequently used apps appear in a small prediction band, and search reaches apps, shortcuts, Android settings, notes, and arithmetic. The ledger, focus tools, and pages are integrated into the launcher, while the dock and alphabet never rearrange themselves.',
      },
      {
        question: 'Which phones and Android versions does Kern support?',
        answer:
          'Kern is designed for phones running Android 8.0 or later and is built natively in Kotlin with Jetpack Compose. Open its Google Play listing to check whether your device is compatible.',
      },
      {
        question: 'Does Kern work offline?',
        answer:
          'Yes. The launcher, local search, pages, focus sessions and daily records work on the phone. In version 1.1, Google Play and Superwall use the network for paywalls, purchases and access checks. Optional Firebase usage and crash reports are off until you agree.',
      },
    ],
  },
  {
    id: 'features',
    index: '02',
    title: 'Using Kern',
    questions: [
      {
        question: 'How does Kern search the phone so quickly?',
        answer:
          'Kern uses fuzzy, ranked search calculated locally. Initials can find an app, misspellings remain useful, Android settings can open like apps, notes and shortcuts can surface beside them, and plain arithmetic returns an answer. Recent use, time of day, and follow-on actions influence ordering; the search index and its learning remain on the device.',
      },
      {
        question: 'What does the daily ledger show?',
        answer:
          'The ledger turns a day into 144 ten-minute marks and reports facts such as pickups, the longest uninterrupted stretch, time away, first pickup, typical session length, late-night use, data movement, and battery behavior. It does not assign a wellness score or tell you how to feel. It shows the record and leaves the conclusion to you.',
      },
      {
        question: 'What is the notification day report?',
        answer:
          'The report counts how many interruptions arrived and whether each was opened, dismissed, or withdrawn by its app. Kern stores the app package, hour, and outcome only. It never stores the notification title, message text, or sender, so the report can reveal patterns without becoming a second archive of private messages.',
      },
      {
        question: 'What do Focus, Strict, and Breathe do?',
        answer:
          'A regular Focus session times one block of work. Strict mode makes leaving that session deliberate by returning blocked apps to the home screen, and Breathe creates a pause between blocks. Kern does not attach a streak, social score, or guilt mechanic to the timer; the goal is simply to make one thing the only thing for a while.',
      },
      {
        question: 'Can I keep notes and tasks on the home screen?',
        answer:
          'Yes. Kern Pages keeps notes, short tasks, pinned lines, and daily pages one swipe from home. The grammar stays readable as plain text, completed tasks can be cleared, workspaces can be locked, and pages can be exported from Settings. The free plan includes one page; paid licences unlock unlimited pages.',
      },
      {
        question: 'How much can I customize Kern?',
        answer:
          'Kern supports light, dark, system, and green themes, multiple accent palettes, icon choices, favourites, hidden apps, layout preferences, widgets, and a notification shelf. The goal is deep personalization inside a coherent system: you can make the launcher distinctly yours without losing the predictable structure that makes it fast.',
      },
    ],
  },
  {
    id: 'privacy',
    index: '03',
    title: 'Privacy and control',
    questions: [
      {
        question: 'Does Kern collect, sell, or send personal data?',
        answer:
          'Kern keeps notes, searches, notification content and detailed phone-use records local. Version 1.1 uses optional Firebase Analytics and Crashlytics reports, with advertising IDs and ad personalization disabled. Google Play and Superwall process purchase/paywall information separately, including installation identifiers and transaction details. Kern has no account, ad network or sale of personal data. The Settings transcript shows custom events submitted this session; local reset does not delete uploaded reports. The privacy policy explains deletion requests, Android backups and exports.',
      },
      {
        question: 'Which Android permissions does Kern need?',
        answer:
          'Every elevated permission is optional and requested only when its feature is used. Usage access supports the ledger and data-usage figures; notification access supports the shelf and interruption counts; display-over-apps supports Strict focus; Android biometric or device credentials unlock protected pages; notification permission supports an optional charge alarm. Kern still works when optional features are left off.',
      },
      {
        question: 'Does Kern move apps around as it learns?',
        answer:
          'Only two ordered surfaces learn: the small prediction band at the top of the drawer and search result order. The dock and full alphabetical drawer stay fixed. Learning uses 14-day frequency, time of day, and follow-on actions, all on-device. You can clear everything Kern has learned in one action from Settings.',
      },
      {
        question: 'Can Kern read my notification messages?',
        answer:
          'Notification access lets Kern display and dismiss notifications and count what happened to them. The permanent report stores only package, hour, and outcome. It does not save a notification’s title, text, or sender, and nothing is transmitted. Notification access can be withheld or revoked; only the shelf and interruption-report features then stop working.',
      },
    ],
  },
  {
    id: 'pricing',
    index: '04',
    title: 'Trial, pricing, and access',
    questions: [
      {
        question: 'Is Kern free?',
        answer:
          'Yes. Every feature is unlocked for 14 days with no payment details required. After that, the home screen, full app drawer, app search, one notes page, and a pause before one app remain free. Kern has no ads or nagging, and anything you have written remains accessible and exportable.',
      },
      {
        question: 'What does Full Measure unlock?',
        answer:
          'Full Measure unlocks the daily ledger and day report, focus mode, unlimited Pages, pauses before every app, deep search, appearance controls, widgets, the notification shelf, and workspace lock. Choose a monthly or yearly subscription inside Kern. Google Play shows the current price in your local currency before you purchase.',
      },
      {
        question: 'What happens to my data if I do not buy a licence?',
        answer:
          'Existing data is never locked. You can continue using the free launcher, drawer, app search, and one page. Pages remain exportable, and the local information already recorded stays under your control. Paid features stop adding their deeper functionality; Kern does not hold your own notes or previous records hostage.',
      },
      {
        question: 'How do I get Kern on Google Play?',
        answer:
          'Open the Kern listing using any Google Play button on this website. The full rollout has been submitted and is in review. If installation is not available for your account or region yet, check the same listing again after Google Play completes review.',
      },
    ],
  },
] as const;

export default function KernFaqPage(): JSX.Element {
  return (
    <div id="top" className={styles.root}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <header className={styles.header}>
        <Link className={styles.wordmark} href="/kern/">
          <span className={styles.wordmarkIcon} aria-hidden="true">K</span>
          <span>KERN</span>
        </Link>
        <nav className={styles.headerNav} aria-label="Kern pages">
          <Link href="/kern/">Overview</Link>
          <Link aria-current="page" href="/kern/faq/">FAQ</Link>
          <Link href="/kern/privacy/">Privacy</Link>
        </nav>
        <a className={styles.headerCta} href={KERN_PLAY_URL} target="_blank" rel="noopener noreferrer">Google Play ↗</a>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroRail} aria-hidden>
            <span>ANDROID 8.0+</span><i /><span>LOCAL FIRST</span>
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>KERN / QUESTIONS, ANSWERED</p>
            <h1>Before Kern becomes <em>your home screen.</em></h1>
            <p className={styles.lede}>
              Kern is a fast, private Android launcher—not a blank-screen
              minimalism exercise. These are direct answers about what it does,
              what stays on your phone, what remains free, and what to expect
              on Google Play.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href={KERN_PLAY_URL} target="_blank" rel="noopener noreferrer">View on Google Play <span>↗</span></a>
              <Link className={styles.secondaryAction} href="/kern/">Explore the system</Link>
            </div>
          </div>
          <aside className={styles.factGrid} aria-label="Kern key facts">
            <div><span>PLATFORM</span><strong>Android 8.0+</strong></div>
            <div><span>CORE PRICE</span><strong>Free forever</strong></div>
            <div><span>ACCOUNT</span><strong>Not required</strong></div>
            <div><span>DATA</span><strong>On device</strong></div>
          </aside>
        </section>

        <nav className={styles.topicNav} aria-label="FAQ topics">
          {groups.map((group) => (
            <a key={group.id} href={`#${group.id}`}>
              <span>{group.index}</span>{group.title}
            </a>
          ))}
        </nav>

        {groups.map((group) => (
          <section className={styles.group} id={group.id} key={group.id}>
            <header className={styles.groupHeader}>
              <p>{group.index} / FAQ</p>
              <h2>{group.title}</h2>
              <span>{String(group.questions.length).padStart(2, '0')} ANSWERS</span>
            </header>
            <div className={styles.answers}>
              {group.questions.map((item, index) => (
                <article className={styles.answer} key={item.question}>
                  <span>{group.index}.{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className={styles.finalCta}>
          <p>THE SHORT VERSION</p>
          <h2>Fast when you need it.<br /><em>Quiet when you do not.</em></h2>
          <p className={styles.finalCopy}>
            Try every feature for 14 days. No account, no cloud,
            and a free core that remains useful after the trial.
          </p>
          <a className={styles.primaryAction} href={KERN_PLAY_URL} target="_blank" rel="noopener noreferrer">View on Google Play <span>↗</span></a>
        </section>
      </main>

      <footer className={styles.footer}>
        <Link href="/">LUNA MAZE</Link>
        <Link href="/kern/">KERN</Link>
        <Link href="/kern/privacy/">PRIVACY</Link>
        <a href={`mailto:${contactEmail}`}>CONTACT</a>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </div>
  );
}
