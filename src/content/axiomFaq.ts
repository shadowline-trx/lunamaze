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
    a: 'Full AXIOM membership is paid. Eligible new monthly subscribers get a seven-day trial; annual plans have no trial. The Lighthouse opens without membership, and the browser Panic Button is free. The November Climb has a limited seasonal free route: for eligible nonmembers it appears after 24 hours from the first membership-screen view on the current build, during the joining window. Installing the app or closing the store sheet does not unlock it immediately.',
  },
  {
    q: 'I installed AXIOM before it was paid. What changed?',
    a: 'The main app requires membership, including on older installs. Your data remains available to export or delete from Settings without subscribing, and the Lighthouse still opens. A seasonal free Climb invitation, when available, covers the challenge rather than the full app. Already a member? Use Sign in or Restore on the membership screen.',
  },
  {
    q: 'What does the record guarantee actually cover?',
    a: 'The current in-app record guarantee requires check-ins on at least 25 of 30 nights. If you have not reached the target shown in the app by Night 30, claim from Settings. The remedy is a first-payment refund on Android or an additional month on iPhone. A slip does not cancel the nights or the guarantee. Check the terms shown with your plan; this is not a promise of a health outcome.',
  },
  {
    q: 'Can anyone at AXIOM read my journal?',
    a: 'Your journal notes, trigger names, reset reasons and reflections stay on your device. Optional signed-in backup includes streak dates and mood scores. AXIOM also uses first-party usage analytics, which you can disable. Buddy nudges and seasonal camp participation are separate social features; they do not share your journal. Read the privacy policy for each data category.',
  },
  {
    q: 'What happens when I relapse?',
    a: 'Record what happened and choose one thing to change for the next difficult hour. Your streak can reset while your check-in history and Recalibration nights remain. The next lesson waits where you left it. You can use the Lighthouse without buying membership.',
  },
  {
    q: 'Does thirty nights mean I will be recovered in thirty days?',
    a: 'No. Thirty nights is the length of Recalibration, not a biological deadline. There is no validated universal timetable for changing porn use, and a streak cannot measure dopamine levels or brain recovery. AXIOM is a habit and wellbeing tool. If symptoms or loss of control are affecting your life, a qualified professional can help assess them.',
  },
  {
    q: 'Do streak counters even work?',
    a: 'A streak can be useful if it helps you follow your own goal. It is only one measure. AXIOM also keeps check-ins and history, with an early summary after three distinct check-in days, so the counter is not the only thing you have to look at.',
  },
  {
    q: 'Do I need an account or my real name?',
    a: 'You can begin local use without an AXIOM account or your real name. Buying membership still uses your Apple or Google store account. Optional sign-in supports backup and social features. Buddy Bond connects you by code: your buddy sees your chosen display name and can exchange nudges, but does not see your streak, check-ins or journal.',
  },
  {
    q: 'Is AXIOM on iPhone?',
    a: 'Both. Android is on Google Play and iPhone is on the App Store — same app, same private journal. The price is shown in the app, in your currency.',
  },
  {
    q: 'Does AXIOM block porn, apps or websites?',
    a: 'No. AXIOM 2.7.3 does not include a website or app blocker. Focus Timer is a two-, three- or five-minute commitment; Android optionally offers screen pinning. Shield, Circles and Community are not available in this release. Use device restrictions or a separate blocker if access filtering is what you need.',
  },
  {
    q: 'Which languages does the app support?',
    a: 'English, Spanish, Brazilian Portuguese, Hindi, French, German, Russian, Indonesian, Turkish, Arabic and Simplified Chinese. All thirty Recalibration nights are available in these eleven languages. The website library has its own language coverage, shown on each article; that does not mean every in-app article or story is translated.',
  },
  {
    q: 'What is new in AXIOM 2.7.3?',
    a: 'After finishing a Recalibration night, members can choose the time for their next one. With notification permission, AXIOM reminds you then. Missing the time leaves the next night available. The current app also includes the seasonal Climb, a daily plan for your difficult hour, and an early read after three distinct check-in days.',
  },
] as const;
