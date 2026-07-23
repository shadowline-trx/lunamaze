import type { BlogArticle } from '../types';

/**
 * Breach-Refugee Bridge page (master plan §1.1). Rules applied here:
 * STRICTLY factual, every claim about the incident attributed to the outlet
 * that reported it (404 Media 2026-03-10 and 2026-04-06, Cybernews,
 * Techlicious), remediation-first, no vulturing tone. The Axiom section is
 * honest contrast, not a victory lap — and says so.
 *
 * Verified against the published coverage on 2026-07-23. If new reporting
 * emerges, update the facts AND dateModified.
 */
const article: BlogArticle = {
  slug: 'quittr-breach',
  lang: 'en',
  title: 'Used Quittr? What Was Exposed, What to Do Now, and How to Pick an App That Can’t Leak Your Recovery',
  description:
    'A factual guide to the reported Quittr data exposure: what journalists say was accessible, concrete steps to protect yourself, and how to evaluate any recovery app’s privacy before trusting it.',
  datePublished: '2026-07-23',
  dateModified: '2026-07-23',
  readingMinutes: 8,
  ctaLabel: 'See how Axiom works',
  ctaText:
    'Axiom was built so a leak like this is architecturally impossible: what you log is encrypted on your phone and never reaches our servers in readable form. We could not expose your journal, because we never have it.',
  blocks: [
    {
      kind: 'p',
      text: 'In March 2026, the tech outlet 404 Media reported that Quittr — described by 404 Media as a viral porn-addiction recovery app — had exposed intimate data belonging to hundreds of thousands of its users. If you are or were a Quittr user, this page is for you: what the reporting actually says, what you can do about it now, and what to look for before trusting any app with this part of your life again.',
    },
    {
      kind: 'p',
      text: 'One thing before anything else: none of this is a victory lap. We build a competing app, and you should factor that into how you read this page — but a breach in this category hurts every person trying to quit, and Quittr’s users deserved better. The useful part of this story is what it teaches about how recovery data should be protected. That is what this page is about.',
    },
    { kind: 'h2', text: 'What happened, according to the reporting' },
    {
      kind: 'p',
      text: 'On March 10, 2026, 404 Media published an investigation reporting that Quittr had exposed user data including ages, masturbation frequency, and users’ emotional responses to pornography — and that many affected users were minors. Cybernews, covering the same exposure, put the figure at more than 600,000 users, roughly 100,000 of whom were identified in the data as minors. Coverage by Techlicious described the exposed data as including porn-use triggers, personal confessions, relapse incidents, mood check-ins, and journal entries.',
    },
    {
      kind: 'p',
      text: 'The technical cause, per the reporting, was a misconfigured Google Firebase backend that allowed far broader access to the database than intended. In a follow-up published April 6, 2026, 404 Media reported that at least three separate security researchers had warned the company months earlier — one email from July 2025 stating plainly that the database was misconfigured and could be read and written to — and that a founder initially promised a fix “in a matter of hours,” while the exposure in fact persisted for months. According to that reporting, the vulnerability was finally fixed sometime before the March article was published — only after 404 Media had contacted the company multiple times.',
    },
    {
      kind: 'callout',
      title: 'The status today',
      text: 'Per the published reporting, the vulnerability has been fixed. What nobody can tell you is whether your specific data was accessed during the months it was exposed. With a misconfiguration of this kind, the honest assumption is that access was possible — so the steps below are worth taking even though the door is now closed.',
    },
    { kind: 'h2', text: 'What to do now — in order' },
    {
      kind: 'list',
      items: [
        'Audit what you shared. Journal entries, confessions, relapse logs, mood check-ins — the reporting says these categories were in the exposed database. Knowing what you put in tells you what your realistic exposure is.',
        'Exercise your deletion rights. If you stop using the app, don’t just uninstall — request account and data deletion inside the app or by emailing the company. Under GDPR (EU/UK) and CCPA (California) you have a legal right to erasure; many other jurisdictions have equivalents. Deletion requests also apply to backend copies, which uninstalling does not touch.',
        'Rotate any reused password. The reporting centers on database contents rather than passwords, but if the password you used there guards anything else — especially your email — rotating it costs you two minutes.',
        'Be extra skeptical of targeted messages. Data this personal is exactly what extortion and phishing campaigns prize. Treat any message that references your recovery, your habits, or this app with maximum suspicion, and never pay anyone claiming to hold your data.',
        'Decide about the app with clear eyes. The vulnerability is reportedly fixed. Whether you keep using the app is your call — the section below is the checklist worth running before trusting it, or any alternative, again.',
      ],
    },
    { kind: 'h2', text: 'How to judge any recovery app before trusting it' },
    {
      kind: 'p',
      text: 'Recovery data is arguably the most sensitive data you own — more compromising than your bank statement, more personal than your photos. Three questions cut through every privacy page ever written:',
    },
    { kind: 'h3', text: '1. Can the company read your entries?' },
    {
      kind: 'p',
      text: 'This is the only question that matters architecturally. If your journal is stored readable on their servers, then a misconfiguration, a hack, a subpoena, an acquisition, or one careless employee can expose it — no matter how good the privacy policy sounds. End-to-end or on-device encryption means the company cannot read your data even if it wants to, and therefore cannot leak it in readable form. Policies are promises; architecture is a fact.',
    },
    { kind: 'h3', text: '2. What does the store privacy label say?' },
    {
      kind: 'p',
      text: 'Both app stores force every app to publish a data-safety declaration — on Google Play it is the "Data safety" section of the listing, on the App Store the "App Privacy" label. Read it before installing. Look for what is collected, what is linked to your identity, and what is shared with third parties. A recovery app that declares collecting identity-linked "sensitive info" or sharing data with advertisers is telling you, in public writing, exactly what its incentives are.',
    },
    { kind: 'h3', text: '3. What happens when researchers knock?' },
    {
      kind: 'p',
      text: 'Every app has bugs. The tell is the response. The pattern described in 404 Media’s follow-up — repeated warnings over months, a promised fix “in a matter of hours” that didn’t come, denial that the problem existed — is the failure mode to screen for. Companies that take security seriously publish a contact for researchers and fix reported issues fast, because they know the alternative is their users’ data on the line.',
    },
    { kind: 'h2', text: 'Where Axiom stands — said plainly' },
    {
      kind: 'p',
      text: 'We built Axiom zero-knowledge because of exactly the failure mode this story describes. Your streak, your journal, your check-ins, your relapse log — all of it is encrypted on your device, and what reaches our servers we cannot read. This is not a policy choice we could quietly reverse; it is how the system is built. If our database were breached tomorrow, your recovery would not be in it in any readable form.',
    },
    {
      kind: 'p',
      text: 'That is the whole pitch, and we will leave it there. Whatever app you choose — including none — the checklist above is yours to keep.',
    },
    {
      kind: 'sources',
      items: [
        {
          label: '404 Media — “Viral ‘Quittr’ Porn Addiction App Exposed the Masturbation Habits of Hundreds of Thousands of Users” (March 10, 2026)',
          url: 'https://www.404media.co/viral-quittr-porn-addiction-app-exposed-the-masturbation-habits-of-hundreds-of-thousands-of-users/',
        },
        {
          label: '404 Media — “Multiple Hackers Warned Anti-Porn App Quittr About Security Issue for Months” (April 6, 2026)',
          url: 'https://www.404media.co/multiple-hackers-warned-anti-porn-app-quittr-about-security-issue-for-months/',
        },
        {
          label: 'Cybernews — “Quittr app leak exposed intimate data of 600K users”',
          url: 'https://cybernews.com/privacy/app-quit-porn-exposed-masturbation-habits-600000-users/',
        },
        {
          label: 'Techlicious — “Porn addiction app reportedly leaked what users say they watch” (March 10, 2026)',
          url: 'https://www.techlicious.com/blog/quittr-porn-addiction-app-leaked-what-users-say-they-watch/',
        },
      ],
    },
    {
      kind: 'faq',
      items: [
        {
          q: 'Was my data definitely leaked?',
          a: 'Nobody can tell you individually. The reporting establishes that the database was accessible for months and what categories of data it held; it does not establish who accessed what. The prudent assumption with a long-lived misconfiguration is that access was possible, which is why the remediation steps — deletion request, password rotation, phishing skepticism — are worth taking regardless.',
        },
        {
          q: 'Is Quittr safe to use now?',
          a: 'The specific vulnerability is fixed, per the published reporting. Whether the app deserves your trust going forward is a judgment about how the company handles security overall — the reported months-long gap between researcher warnings and the fix is the data point to weigh. The three-question checklist above applies to Quittr the same as to every other app, ours included.',
        },
        {
          q: 'Do I have a legal right to make them delete my data?',
          a: 'In many places, yes. GDPR (EU and UK) grants a right to erasure, CCPA (California) a right to delete, and many other jurisdictions have equivalents. Send the request explicitly — in-app account deletion or an email to the company’s privacy contact — and keep a copy. This is general information, not legal advice; if real harm is involved, a lawyer or your data-protection authority is the next step.',
        },
        {
          q: 'What does "zero-knowledge" or "E2EE" actually mean?',
          a: 'That data is encrypted with keys only you hold, before it ever leaves your device — so the company operating the servers cannot read it, and neither can anyone who breaches those servers. It is the difference between a promise ("we won’t look") and a property ("we can’t look"). For data as sensitive as recovery, the property is the standard worth demanding.',
        },
      ],
    },
  ],
};

export default article;
