import type { BlogArticle } from '../types';

/**
 * Data piece: every panic-button press in the AXIOM app over 90 days
 * (2026-07-24 to 2026-10-21), bucketed by the phone's local hour. Pulled from
 * analytics_events (`panic:opened`, `local_hour`), founder, staff and QA
 * installs excluded. Counts only; the privacy policy says we publish totals.
 * Target queries: "what time are porn urges strongest", "urges at night",
 * "no nut november hardest time". Doubles as the link asset for NNN press.
 * Re-pull the numbers before changing any of them.
 */
const HOURS = [81, 72, 35, 45, 33, 43, 32, 39, 37, 43, 61, 57, 70, 62, 47, 69, 52, 56, 51, 50, 85, 75, 73, 97];

const article: BlogArticle = {
  slug: 'when-urges-hit',
  lang: 'en',
  title: 'When Do Porn Urges Hit? We Mapped 1,365 Panic-Button Presses by Hour',
  seoTitle: 'When Do Porn Urges Hit? 1,365 Panic Presses, by Hour',
  description:
    'We counted every panic-button press in the AXIOM app for 90 days. The urge hour is 11pm, not 2am, and 2am is one of the quietest hours of the day.',
  datePublished: '2026-10-22',
  dateModified: '2026-10-22',
  readingMinutes: 6,
  ctaLabel: 'See how AXIOM works',
  ctaText:
    'The panic button in AXIOM opens for everyone, paid or not. It is built for the ten minutes after 11pm.',
  blocks: [
    {
      kind: 'p',
      text: 'We expected 2am. It is the hour everyone names, and it is the hour our own app store listing names. Then we counted. The hour people actually reach for help is 11pm, and 2am turned out to be one of the quietest hours of the whole day.',
    },
    {
      kind: 'callout',
      title: 'The short version',
      text: 'Across 1,365 panic-button presses in 90 days, the busiest hour was 11pm. The five hours from 8pm to 1am held 30% of all presses. 2am had fewer presses than almost any other hour. If you are planning for a hard moment, plan for the evening, not the middle of the night.',
    },
    { kind: 'h2', text: 'What we counted' },
    {
      kind: 'p',
      text: 'AXIOM is a quit porn app with a panic button: one tap, from anywhere in the app, opens a screen built to get you through the next few minutes. It opens for everyone, whether they pay or not. Every time someone opens it, the app records the hour on their phone. Nothing else about that moment is recorded.',
    },
    {
      kind: 'p',
      text: 'We took every press from July 24 to October 21, 2026, and left out our own phones and test devices. That left 1,365 presses from 767 people in dozens of countries. Each press sits in the hour it happened, in that person\'s local time.',
    },
    {
      kind: 'hourChart',
      caption: 'Panic-button presses by local hour, AXIOM app, July 24 to October 21, 2026 (1,365 presses, 767 people). Highlighted: 8pm to 1am.',
      summary: 'Bar chart of 1,365 panic-button presses by hour of day. Presses climb from 8pm, peak at 11pm with 97 presses, stay high until 1am, and fall to their lowest between 2am and 9am.',
      values: HOURS,
      peak: [20, 21, 22, 23, 0],
      tableLabel: 'See every hour',
      hourHeader: 'Hour',
      valueHeader: 'Presses',
    },
    { kind: 'h2', text: 'Three things the chart shows' },
    { kind: 'h3', text: '1. The evening is a wall, not a slope' },
    {
      kind: 'p',
      text: 'At 7pm there were 50 presses. At 8pm there were 85. The jump is that sudden, and the count stays high all the way to 1am. The single busiest hour is 11pm, with 97 presses, about 1.7 times what an average hour gets. If you spread all 1,365 presses evenly across the day, every hour would get about 57.',
    },
    { kind: 'h3', text: '2. 2am is quiet' },
    {
      kind: 'p',
      text: 'The 2am hour had 35 presses. Only 4am and 6am had fewer. That does not mean 2am is safe for everyone. It may mean that by 2am most people are asleep, or that the night has already been decided one way or the other. Either way, the moment to prepare for comes earlier than the story says.',
    },
    { kind: 'h3', text: '3. There is a smaller bump in the day' },
    {
      kind: 'p',
      text: 'Noon (70 presses) and 3pm (69) stand out from the hours around them. Those are lunch breaks and the long middle of the afternoon: alone at a desk, bored, phone in hand. Smaller than the evening, but real.',
    },
    { kind: 'h2', text: 'Why the evening' },
    {
      kind: 'p',
      text: 'This is a count, not an experiment, so it cannot prove why. But the evening is when several things line up at once. You are tired after a full day of choices. You are often alone, and nobody would know. Nothing is competing for your attention. And the phone, the whole delivery system, is already in your hand in bed.',
    },
    {
      kind: 'p',
      text: 'None of that is a character flaw. It is a setup. And a setup can be changed in ways that willpower at 11pm cannot.',
    },
    { kind: 'h2', text: 'What to do with this' },
    {
      kind: 'list',
      items: [
        'Name your hour. Ours is 11pm on average, but yours is yours. Write it down, and write down the one thing you will do when it arrives.',
        'Charge the phone outside the bedroom, and plug it in before 10:30pm. The distance between the urge and the screen is the cheapest thing you can change.',
        'Plan the next ten minutes, not the whole night. An urge rises and falls. A shower, a walk to the kitchen, a message to a friend, or the panic button all buy those minutes.',
        'Front-load the hard part of your day. If the evening is where it gets decided, move something you look forward to into it.',
      ],
    },
    {
      kind: 'p',
      text: 'One more number from the same 90 days. In 526 of those 1,365 sessions, the person closed the panic screen by tapping the button that says the urge has passed. That is not proof the button works, and we will not claim it is. It is a record of 526 times someone came in at a bad moment and left saying they were steady.',
    },
    { kind: 'h2', text: 'If you are doing No Nut November' },
    {
      kind: 'p',
      text: 'No Nut November starts November 1, and most people plan it as a test of the whole month. The chart says to plan it as a test of the evenings. The days mostly take care of themselves. Treat 8pm to 1am as the actual challenge, especially in the first week, before the new routine has settled.',
    },
    { kind: 'h2', text: 'What these numbers cannot tell you' },
    {
      kind: 'list',
      items: [
        'They only include people who opened a recovery app. People who did not reach for help at all are not in here.',
        'A press is not an urge. Plenty of urges happen with no press, and some people slip without ever opening the app. The chart shows when people reach for help.',
        'This is one app\'s users. The largest groups are in Indonesia and India, with many more across Africa, the Americas and Europe. Your country, schedule and age will shift your own curve.',
        'It is not a scientific study. It is a count, published so you can plan around it.',
      ],
    },
    {
      kind: 'faq',
      items: [
        {
          q: 'What time of day are porn urges strongest?',
          a: 'In our data, the evening. Across 1,365 panic-button presses in the AXIOM app, the busiest hour was 11pm, and the five hours from 8pm to 1am held 30% of all presses.',
        },
        {
          q: 'Is 2am the worst time for urges?',
          a: 'Not in our data. The 2am hour had 35 presses, fewer than almost any other hour. The hard part of the night came earlier, between 8pm and 1am.',
        },
        {
          q: 'How long does an urge last?',
          a: 'It varies from person to person, but urges rise and fall rather than building forever. That is why a plan for the next ten minutes works better than a plan for the whole night.',
        },
        {
          q: 'How was this data collected?',
          a: 'The AXIOM app records the local hour each time someone opens its panic button. We counted every press from July 24 to October 21, 2026, excluding our own and test devices. Only counts are published, never anything about one person.',
        },
      ],
    },
    {
      kind: 'links',
      title: 'Read next',
      items: [
        { label: 'Why urges hit hardest at night, and what works after 11pm', href: '/axiom/blog/en/night-urges/' },
        { label: 'The flatline: why you feel nothing after quitting porn', href: '/axiom/blog/en/flatline/' },
        { label: 'The free panic tool: get through the next ten minutes', href: '/axiom/tools/panic/' },
      ],
    },
    {
      kind: 'sources',
      items: [{ label: 'AXIOM privacy policy: what the app records and what it never does', url: 'https://lunamaze.com/axiom/privacy/' }],
    },
  ],
};

export default article;
