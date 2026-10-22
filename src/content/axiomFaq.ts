/**
 * The AXIOM landing page's FAQ, in one place.
 *
 * The page renders it and the page's FAQPage JSON-LD is built from it, so the
 * structured data can never describe answers the visitor cannot see. That rule
 * is Google's, and it used to be broken: the markup lived in the /axiom layout
 * and rode along on every page under it, the privacy policy included.
 */
export const AXIOM_FAQS = [
  {
    q: 'Is there a free version?',
    a: 'No. AXIOM is a paid app: the monthly plan starts with a 7-day free trial for eligible new subscribers, and the exact price is shown in the app before you pay anything. We tried it the other way and it made a worse product: a free tier funded by nagging the people using it. One exception, and it is not a marketing one — if you are in an urge, the Lighthouse opens whether you have paid or not.',
  },
  {
    q: 'I installed AXIOM before it was paid. What changed?',
    a: 'Since version 2.6.0 a subscription is needed on every install, including ones from before. Your data stays yours either way: export it or delete it from Settings, with or without a subscription, and the Lighthouse still opens whether you pay or not. Already subscribed on another phone? Tap Sign in or Restore on the membership screen.',
  },
  {
    q: 'What if it does not help me?',
    a: 'Ask from Settings and we make the next 30 days free. You do not have to explain what happened. It works on paid subscriptions, up to twice in any 12 months, and it adds time rather than refunding money.',
  },
  {
    q: 'Can anyone at AXIOM read my journal?',
    a: 'No. Your journal never leaves your phone. The app does not send it, and our database is built to refuse journal text, trigger names and reset reasons — so there is no journal on our servers to leak, sell, or hand over. If you sign in for backup, only your streak dates and mood scores sync.',
  },
  {
    q: 'What happens when I relapse?',
    a: 'A reset, not a verdict. You log it honestly, AXIOM asks what happened and what you will do differently, and that plan comes back to you within 72 hours. Your total and your history stay. Shame is not a strategy here.',
  },
  {
    q: 'How long does rewiring actually take?',
    a: 'Honestly: usually longer than the famous ninety days, and different for everyone. Many people describe the flatline lifting somewhere in weeks two to six and things steadying after two to three months. AXIOM will not promise you a date.',
  },
  {
    q: 'Do streak counters even work?',
    a: 'Alone, no — a bare number resets to zero and takes your motivation down with it. That is why AXIOM builds phases, patterns, and triggers around the streak: a reset costs you a day, not your progress.',
  },
  {
    q: 'Do I need an account or my real name?',
    a: 'No account is needed, and your real name is never required. AXIOM works on your phone without signing in. If you choose to sign in for backup, only your streak dates and mood scores sync — your journal never does. A recovery buddy sees whether you are standing, never what you wrote.',
  },
  {
    q: 'Is AXIOM on iPhone?',
    a: 'Both. Android is on Google Play and iPhone is on the App Store — same app, same private journal. The price is shown in the app, in your currency.',
  },
  {
    q: 'How is this different from the big-name quit apps?',
    a: 'No fake countdowns, no invented member counts, no panic button behind a paywall — and no journal sitting in a cloud. Scroll back up to the receipt.',
  },
] as const;
