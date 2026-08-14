import type { BlogArticle } from '../blog/types';

/**
 * Target queries: "why do typing tests give different wpm", "monkeytype vs
 * 10fastfingers wpm difference", "which typing test is accurate", "net wpm vs
 * gross wpm".
 *
 * This exists because it is the most-asked question about typing tests that
 * nobody answers properly, and because answering it well is the cheapest
 * authority we can build: the whole piece is arithmetic anyone can check.
 *
 * Voice rules: no claim about a competitor that cannot be verified from their
 * own published behaviour or documentation, and every number traceable. The
 * one thing this article must never do is imply TypeCrt's number is the "true"
 * one — the honest answer is that there is no true one, and that is the point.
 */
const article: BlogArticle = {
  slug: 'why-typing-tests-disagree',
  lang: 'en',
  title: 'Why Two Typing Tests Give You Two Different WPM',
  description:
    'Score 70 on one site and 62 on another? Neither is broken. Here is the arithmetic behind the gap — word length, error penalties, and what the timer actually starts on.',
  datePublished: '2026-08-13',
  dateModified: '2026-08-13',
  readingMinutes: 7,
  ctaLabel: 'Try TypeCrt',
  ctaText:
    'TypeCrt publishes the exact formula behind every number it shows, so you can recompute your own score by hand from the character breakdown on the results screen.',
  blocks: [
    {
      kind: 'p',
      text: 'You take a typing test and score 71 words per minute. You take another one ten minutes later, on a different site, and score 62. Same hands, same keyboard, same morning coffee. One of them must be lying.',
    },
    {
      kind: 'p',
      text: 'Neither is. A words-per-minute figure is not a measurement in the way a temperature is a measurement — it is the output of a formula, and the formula has at least four decisions baked into it that different sites make differently. Once you can see those decisions, the gap between two scores stops being mysterious and starts being predictable. You can usually work out which direction a given site will round you.',
    },

    { kind: 'h2', text: 'Decision one: how long is a word?' },
    {
      kind: 'p',
      text: 'Nobody counts words. Words are wildly uneven — "a" and "internationalisation" are both one word — so a test that counted them would score you differently depending on which sentence it happened to serve. Instead, essentially every typing test defines a word as five characters, including the space that follows it.',
    },
    {
      kind: 'p',
      text: 'This convention is old and it is arbitrary, but it is nearly universal, so it is rarely the source of a disagreement between two mainstream tests. It matters for a different reason: it means the text itself changes your score. English averages a little under five letters per word, so a passage of short common words gives you more spaces per character than a passage of long ones — and spaces are the easiest keystroke on the board. A test that feeds you "the and for was" will read faster than one feeding you "consequently disproportionate".',
    },
    {
      kind: 'callout',
      title: 'The practical consequence',
      text: 'Comparing your score across two sites that use different word lists is not comparing your typing. It is partly comparing their vocabularies. This is also why your own score drifts between attempts on the same site.',
    },

    { kind: 'h2', text: 'Decision two: what counts as an error, and what does it cost' },
    {
      kind: 'p',
      text: 'This is where most of the gap comes from. There are two broad schools.',
    },
    {
      kind: 'list',
      items: [
        'Gross (or raw) WPM counts every character you typed, correct or not, and reports accuracy separately. It answers "how fast did your fingers move".',
        'Net WPM subtracts something for mistakes. It answers "how much correct text did you produce".',
      ],
    },
    {
      kind: 'p',
      text: 'The trouble is that "subtracts something" is not one method. A common older convention, inherited from typing classes, deducts one whole word per uncorrected error — so a single wrong letter costs you five characters. Many modern web tests instead count only the characters that ended up correct, which costs you exactly the characters you got wrong. On a test with a handful of errors, those two rules can differ by ten WPM or more on the same keystrokes.',
    },
    {
      kind: 'p',
      text: 'A third variant: some tests let you type past a mistake and simply mark it, while others block you until you fix it. Blocking changes what you actually do with your hands, not just how it is scored — you spend real time backspacing, and that time lands in the denominator.',
    },

    { kind: 'h2', text: 'Decision three: when does the clock start' },
    {
      kind: 'p',
      text: 'Some tests start the timer on your first keystroke. Some start it when the page is ready and you press begin. The difference is the second or two you spend orienting yourself, and on a 15-second test a two-second head start is over 13% of the run.',
    },
    {
      kind: 'p',
      text: 'This is why short tests flatter you and long tests do not. On a 15-second test, one lucky burst of familiar words dominates the score. On a 60-second test it is averaged away. If you want a number that predicts how you actually type, take the longer test; if you want your best-looking number, take the shortest one. Both are real; they are answering different questions.',
    },

    { kind: 'h2', text: 'Decision four: what happens to the last, unfinished word' },
    {
      kind: 'p',
      text: 'A timed test almost always ends in the middle of a word. Does that half-typed word count? Some tests count the correct characters you managed; some discard the whole word; some count it as complete. On a 15-second test at 60 WPM you type roughly 15 words, so one word is nearly 7% of your score.',
    },

    { kind: 'h2', text: 'So which number is the real one?' },
    {
      kind: 'p',
      text: 'None of them, and asking is the wrong question. WPM is a convention for comparing a person against themselves over time, and against a population measured the same way. It is not a physical constant.',
    },
    {
      kind: 'p',
      text: 'What that means in practice is narrower and more useful than it sounds:',
    },
    {
      kind: 'list',
      items: [
        'Comparing your Monday score to your Friday score on the same site, same mode, same duration: valid, and the only comparison that tracks improvement.',
        'Comparing your score to a friend on a different site: not valid, and neither of you is cheating.',
        'Comparing your score to a published average: only valid if you know how that average was measured — most quoted figures do not say.',
      ],
    },
    {
      kind: 'callout',
      title: 'On the "average typing speed is 40 WPM" claim',
      text: 'It is repeated everywhere and sourced almost nowhere. The largest published dataset — 168,960 participants, 136,857,600 keystrokes, collected by Dhakal, Feit, Kristensson and Oulasvirta and presented at CHI 2018 — measured a mean of 51.56 WPM, with the fastest tenth above roughly 78 and the slowest tenth below roughly 26. If a site quotes you a number without saying where it came from, that is the thing to notice.',
    },

    { kind: 'h2', text: 'How to actually compare yourself over time' },
    {
      kind: 'list',
      items: [
        'Pick one site and stay on it. Switching resets your baseline.',
        'Pick one duration and stay on it. A 15-second score and a 60-second score are different measurements, not the same measurement with more data.',
        'Watch accuracy alongside speed. Speed gained by accepting more errors is not gained, on most scoring rules — it just moves where the loss is booked.',
        'Look at consistency if the site reports it. A steady 55 predicts your real-world typing better than a spiky 70.',
        'Take more than one run. A single test has enough variance that a five-WPM swing means nothing.',
      ],
    },

    {
      kind: 'faq',
      items: [
        {
          q: 'Why is my WPM higher on 15-second tests than 60-second ones?',
          a: 'Three reasons compound. A short test is dominated by whichever words happen to appear, so a run of familiar short words inflates it. Any fixed overhead — the moment before the clock starts, the unfinished last word — is a larger share of a short run. And you cannot sustain a sprint pace for a minute. The 60-second figure is the better predictor of how you type in real work.',
        },
        {
          q: 'Is raw WPM or net WPM the better number to track?',
          a: 'Track both, for different things. Raw tells you how fast your hands can move, which is the ceiling you are training toward. Net tells you how much usable text you produced, which is what actually matters when you are writing. A large gap between them means your bottleneck is accuracy, not speed — and accuracy is usually the faster thing to fix.',
        },
        {
          q: 'Does the keyboard I use change my WPM?',
          a: 'Yes, though usually less than people expect, and mostly through familiarity rather than the hardware itself. Switching keyboards costs you speed for days to weeks while the finger-to-key mapping resettles. That is the same mechanism that makes a layout change expensive, and it is worth knowing before you buy something to fix a plateau.',
        },
        {
          q: 'Can I compare my score to my friend on a different site?',
          a: 'Not reliably. Between word-list vocabulary, error penalties, timer start and unfinished-word handling, two mainstream tests can differ by ten WPM or more on identical typing. To settle it, take the same test, same mode, same duration, on the same site.',
        },
      ],
    },

    {
      kind: 'sources',
      items: [
        {
          label:
            'Dhakal, Feit, Kristensson & Oulasvirta — "Observations on Typing from 136 Million Keystrokes" (CHI 2018)',
          url: 'https://userinterfaces.aalto.fi/136Mkeystrokes/',
        },
        {
          label: 'TypeCrt — the exact formulas behind every metric it reports',
          url: 'https://typecrt.com/docs/metrics',
        },
        {
          label: 'TypeCrt — research page: the published figures, and the claims they do not support',
          url: 'https://typecrt.com/docs/research',
        },
      ],
    },
  ],
};

export default article;
