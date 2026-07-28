import type { BlogArticle } from '../types';

/**
 * Transactional sibling of `quittr-breach`. That article answers "what
 * happened"; this one answers "so which app do I use instead", which is the
 * query people type once they have already decided to leave. Ever Accountable
 * currently owns it with a dedicated page, and we had nothing aimed at it.
 *
 * Rules applied, same as the breach article: every claim about a third party is
 * attributed to the outlet that reported it, competitors are described by their
 * architecture rather than accused of anything, and our own storage is stated
 * precisely enough to be checked. A page that attacks another app's data
 * handling has to be scrupulous about its own or it deserves to be ignored.
 *
 * Deliberately not a feature table. Feature tables go stale within a release
 * and every app wins its own. What separates these products durably is what
 * leaves the device, so the page is organised around that.
 *
 * Verified against published coverage on 2026-07-28. If new reporting emerges,
 * update the facts AND dateModified.
 */
const article: BlogArticle = {
  slug: 'quittr-alternative',
  lang: 'en',
  title: 'Quittr Alternatives: How to Pick a Recovery App That Cannot Leak What You Log',
  description:
    'After the reported Quittr data exposure, the question is not which app has more features. It is which app stores your confessions at all. Three tests you can run on any of them.',
  datePublished: '2026-07-28',
  dateModified: '2026-07-28',
  readingMinutes: 7,
  ctaLabel: 'See how Axiom works',
  ctaText:
    'Axiom keeps what you log on your phone. If you never turn on backup, there is no copy of your journal on our servers to expose, subpoena, or misconfigure.',
  blocks: [
    {
      kind: 'p',
      text: 'If you came here after the Quittr reporting, you probably are not shopping for features. You want to know which of these apps could do the same thing to you. That is a better question than the one most comparison pages answer, and it has a surprisingly short checklist.',
    },
    {
      kind: 'p',
      text: 'Before anything else: we make a competing app, so read this the way you would read any page written by a competitor. What we can offer is that every factual claim below about another product is attributed to the outlet that reported it or to that company’s own published description, and that our own data handling is written precisely enough for you to check it against our privacy policy.',
    },

    { kind: 'h2', text: 'What actually happened, briefly' },
    {
      kind: 'p',
      text: 'In March 2026, 404 Media reported that Quittr, a porn-addiction recovery app, had exposed intimate user data through a misconfigured Google Firebase database. The exposed records reportedly included users’ ages, how often they said they masturbated, the material they said they watched, and free-text confessions. 404 Media described the scale as hundreds of thousands of users and reported that many of them self-identified as minors. Cybernews, covering the same incident, put the figure at more than 600,000 users, around 100,000 of whom were identified in the data as minors.',
    },
    {
      kind: 'p',
      text: 'In a follow-up published on 6 April 2026, 404 Media reported that multiple independent researchers had warned the company about the issue over a period of months before the story ran, and that the vulnerability was fixed only shortly before publication.',
    },
    {
      kind: 'callout',
      title: 'The part that matters for choosing your next app',
      text: 'The cause reported was a database permission setting, not a sophisticated attack. That is the uncomfortable lesson: if an app holds your confessions on a server, a single configuration mistake is all it takes. The protection you are shopping for is not better security. It is less data in the first place.',
    },

    { kind: 'h2', text: 'The only question that separates these apps' },
    {
      kind: 'p',
      text: 'Every app in this category will tell you it takes privacy seriously, and most of them mean it. Intent is not the variable. The variable is what physically leaves your phone, because you cannot leak what you never collected. Broadly, these products fall into four architectures.',
    },
    {
      kind: 'h3',
      text: '1. Server-stored journals',
    },
    {
      kind: 'p',
      text: 'Your check-ins, relapse notes and written entries are uploaded and stored in a database the company administers. This is the most common design because it makes cross-device sync and analytics easy. It is also the design that was involved in the Quittr reporting. Your protection here rests entirely on that company’s configuration being correct, forever, including after the founders lose interest.',
    },
    {
      kind: 'h3',
      text: '2. Accountability and monitoring apps',
    },
    {
      kind: 'p',
      text: 'These work by design on the opposite principle: your activity is captured and shared with a chosen partner who is meant to see it. Ever Accountable, for example, describes using on-device AI to monitor what is on your screen inside every app, and markets accountability reporting as the core feature. That is a legitimate model that many people find genuinely helpful, and the company publicises ISO 27001 and ISO 27701 certification. It is worth being clear-eyed about the trade, though: the entire point is that a record of your behaviour exists and another human reads it. If your reason for leaving Quittr is that you never want that record to exist, a monitoring app is not the answer to that specific fear.',
    },
    {
      kind: 'h3',
      text: '3. Blockers and filters',
    },
    {
      kind: 'p',
      text: 'Some block using a list processed on the device; others route your browsing through a remote server that necessarily sees the requests. The difference matters and is rarely advertised. If a blocker requires you to install a VPN profile or a certificate, find out where the traffic goes and who logs it.',
    },
    {
      kind: 'h3',
      text: '4. Local-first apps',
    },
    {
      kind: 'p',
      text: 'What you log is written to storage on your own phone and is not transmitted. Sync, when offered, is encrypted with a key held on the device. The obvious cost is that a lost phone with no backup means lost history, and features that need a server, such as social ones, are harder or absent. The benefit is that a configuration mistake on somebody’s cloud console cannot expose a journal that was never uploaded to it.',
    },

    { kind: 'h2', text: 'Three tests you can run yourself, on any app' },
    {
      kind: 'p',
      text: 'You do not have to take marketing copy on trust. These take about five minutes each and work on any app in this category, including ours.',
    },
    {
      kind: 'list',
      items: [
        'Turn on airplane mode and open the app. Write an entry, then close and reopen it. If your own writing will not display without a connection, it is being fetched from somewhere. A journal that needs the internet to show you your own words is stored on a server.',
        'Try to use it without creating an account. If an email address is mandatory before the app does anything, every record it makes is attached to an identifier that identifies you. Optional accounts are a meaningfully different design from required ones.',
        'Open the privacy policy and find the section listing what is collected. Look specifically for whether your entries, journal text, or check-in content appear on that list. If they do, the company holds them. If the policy is vague about this, treat that as the answer.',
      ],
    },
    {
      kind: 'p',
      text: 'A fourth, if you want to be thorough: search the company name together with the words breach or vulnerability before you commit. It costs one search and it is how you would have learned about the Quittr situation in advance.',
    },

    { kind: 'h2', text: 'Where Axiom sits, stated plainly' },
    {
      kind: 'p',
      text: 'Axiom is a local-first app in the sense described above. Check-ins, streak history, relapse notes and journal entries are stored on your device. An account is optional and the app is fully usable without one. If you never create one, nothing you write is transmitted to us at any point.',
    },
    {
      kind: 'p',
      text: 'If you do create an account, here is what exists on our servers: your email address, and, if you switch on backup, your entries encrypted on your phone with a key we do not hold. We also record anonymous usage counts, such as which screens are opened, which never contain anything you write. We cannot read your journal. That is not a policy we could quietly change next year, because the decryption key is not ours to use.',
    },
    {
      kind: 'p',
      text: 'The honest costs of this design, which you should weigh: if you lose your phone without enabling backup, your history is gone and we cannot restore it. Recovering an account whose key you have lost is not possible for the same reason. And some features that competitors offer are harder to build this way.',
    },
    {
      kind: 'callout',
      title: 'What Axiom does not have yet',
      text: 'The site and app blocker currently runs on Android only. The iOS version is built but needs a Family Controls entitlement from Apple that has not been granted yet, so if blocking is the feature you are shopping for on an iPhone, Axiom is not your answer today. The iPhone build is otherwise complete and in review.',
    },

    { kind: 'h2', text: 'If you used Quittr, do these first' },
    {
      kind: 'p',
      text: 'Whichever app you move to, a few practical steps are worth taking now rather than later.',
    },
    {
      kind: 'list',
      items: [
        'If you reused that password anywhere else, change it there first. Reused passwords are the most common way one exposure becomes several.',
        'Request deletion of your account and data. In the UK and EU this is a legal right under UK GDPR and GDPR; in California it is available under the CCPA. Many companies honour requests from elsewhere anyway.',
        'Check whether the email address you used appears in any known breach corpus, and be aware that data which was publicly readable may have been copied by people who will never be identified.',
        'If you were under 18 when you used it, consider telling a parent or guardian, uncomfortable as that is. Reporting indicated a substantial number of the affected accounts belonged to minors.',
      ],
    },

    {
      kind: 'faq',
      items: [
        {
          q: 'Was Quittr hacked?',
          a: 'Based on the published reporting, the incident was described as a misconfigured Firebase database that allowed data to be read, rather than a break-in. 404 Media reported that multiple researchers notified the company over a period of months before the story was published.',
        },
        {
          q: 'Is there a free alternative to Quittr?',
          a: 'Axiom has a free tier that does not require an account, and the features that matter most during an urge are not behind the paid tier. Free tiers vary considerably across this category, so check specifically whether the emergency or panic features are gated before you rely on any of them.',
        },
        {
          q: 'Do any of these apps work without an account?',
          a: 'Some do and many do not. It is worth testing before you commit, because an app that requires an account before it will function is necessarily attaching every record it creates to an identifier for you.',
        },
        {
          q: 'Is a local-first app less useful than a cloud one?',
          a: 'For tracking and pattern analysis, no, since the work happens on the device either way. For anything social, or for restoring your history to a new phone without a backup, it genuinely is more limited. That limitation is the direct cost of the data not existing anywhere you do not control.',
        },
        {
          q: 'How do I know Axiom is telling the truth about this?',
          a: 'Run the airplane-mode test above on it. Beyond that, our privacy policy states what is stored and we are describing an architecture rather than a promise, which is the kind of claim you can check.',
        },
      ],
    },

    {
      kind: 'sources',
      items: [
        {
          label: '404 Media — Multiple Hackers Warned Anti-Porn App Quittr About Security Issue for Months (6 April 2026)',
          url: 'https://www.404media.co/multiple-hackers-warned-anti-porn-app-quittr-about-security-issue-for-months/',
        },
        {
          label: 'Cybernews — Quittr app leak exposed intimate data of 600K users',
          url: 'https://cybernews.com/privacy/app-quit-porn-exposed-masturbation-habits-600000-users/',
        },
        {
          label: 'Techlicious — Porn addiction app reportedly leaked what users say they watch',
          url: 'https://www.techlicious.com/blog/quittr-porn-addiction-app-leaked-what-users-say-they-watch/',
        },
        {
          label: 'Ever Accountable — company description of its accountability model',
          url: 'https://everaccountable.com/freedom/quittr/',
        },
      ],
    },
  ],
};

export default article;
