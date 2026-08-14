import type { BlogArticle } from '../blog/types';

/**
 * Target queries: "keybr alternative", "adaptive typing practice", "practice
 * weak keys typing", "how to fix slow keys typing".
 *
 * Rules for this one, tighter than usual because it names a competitor:
 * every statement about Keybr must be something a reader can see for
 * themselves by opening it — its own on-screen readouts and documented
 * behaviour. No claims about its internals, its business, or its quality of
 * engineering. The argument here is a design disagreement about ONE thing, and
 * the piece is stronger for conceding everything else, because the concession
 * is true: the adaptive-unlock idea is Keybr's, it is good, and KeyForge is
 * downstream of it.
 */
const article: BlogArticle = {
  slug: 'adaptive-typing-practice',
  lang: 'en',
  title: 'Adaptive Typing Practice: Drilling the Keys That Are Actually Slowing You Down',
  description:
    'Generic typing drills give everyone the same text. Adaptive practice targets your own slowest keys — here is how it works, and the one place these tools mislead you.',
  datePublished: '2026-08-13',
  dateModified: '2026-08-13',
  readingMinutes: 8,
  ctaLabel: 'Open KeyForge',
  ctaText:
    'KeyForge is TypeCrt’s adaptive practice mode. It ranks your keys by the time each one costs you, and its progress readout stays quiet when a change is within your normal variation.',
  blocks: [
    {
      kind: 'p',
      text: 'Most typing practice has a strange property: it gives everyone the same text. Whether you have been typing for twenty years or two weeks, whether your left ring finger is the problem or your right index, you get the same paragraphs. It is the equivalent of a gym where everyone does the same workout regardless of what they are trying to build.',
    },
    {
      kind: 'p',
      text: 'Adaptive practice is the alternative, and the idea is simple enough that it is surprising how few tools do it: measure which specific keys you are slow or unreliable on, then generate practice text weighted toward those keys. Keybr popularised this approach and deserves the credit for it. This article is about how it works, why it works, and the one place where this whole category — including the tool you are reading about — has to be careful not to mislead you.',
    },

    { kind: 'h2', text: 'What "adaptive" actually means here' },
    {
      kind: 'p',
      text: 'Three mechanisms do most of the work.',
    },
    {
      kind: 'h3',
      text: '1. Progressive unlocking' },
    {
      kind: 'p',
      text: 'Rather than starting with the full alphabet, adaptive tools start with a handful of letters — often six — and add the next only once the current set is comfortable. This is not artificial difficulty. A beginner typing full English is spending nearly all of their attention on locating keys, which is exactly the attention they need for building the motor pattern. A small alphabet lets the pattern form before the search problem gets hard.',
    },
    {
      kind: 'h3',
      text: '2. Per-key timing' },
    {
      kind: 'p',
      text: 'The tool records the interval between your keystrokes and attributes it to the key you just hit. Do that a few hundred times and you have a latency profile: not which keys you think are hard, but which ones your hands are measurably slower on. These are frequently not the same. Most people can name a key they dislike; almost nobody correctly names their slowest one.',
    },
    {
      kind: 'h3',
      text: '3. Weighted text generation' },
    {
      kind: 'p',
      text: 'The practice text is then generated — usually as pronounceable pseudo-words rather than real English — weighted toward whatever is currently lagging. Pseudo-words matter more than they look: real English lets you type by word recognition, which is a different skill from typing by letter. If the goal is to fix a specific key, you want that key to appear far more often than English would ever give you.',
    },
    {
      kind: 'callout',
      title: 'Why this beats "just type more"',
      text: 'Typing more English practises the letters English is made of. E, T, A and O get thousands of repetitions; the letters actually holding you back get a handful. You improve, but you improve at what you were already good at, which is why plateaus feel so stubborn.',
    },

    { kind: 'h2', text: 'The part these tools get wrong' },
    {
      kind: 'p',
      text: 'Adaptive tools work in short blocks — a paragraph of fifteen or twenty words, then a result, then the next block. After each one you are shown how you did, usually with a signed arrow against the previous block. Open Keybr and you will see a line like this after a lesson:',
    },
    {
      kind: 'quote',
      text: 'Speed: 58.7 wpm (↓ −0.0 wpm)  Accuracy: 90.6% (↑ +1.4%)',
    },
    {
      kind: 'p',
      text: 'Look at the speed figure. A downward arrow, attached to a change of zero. That is not a bug — it is what happens when you compare two adjacent blocks and always display a direction.',
    },
    {
      kind: 'p',
      text: 'Here is the problem. A block is fifteen to twenty seconds of typing. Over that span, a person’s speed varies by several words per minute for reasons that have nothing to do with skill: which letters came up, whether the generated words happened to suit your hands, whether you blinked, where your fingers were resting when the block started. The block-to-block difference is mostly noise.',
    },
    {
      kind: 'p',
      text: 'So an arrow after every block is, most of the time, pointing at randomness — confidently. And a learner who reads arrows learns to see progress and regression in noise. That is worse than showing no comparison at all, because it is stated with authority. You will change what you are doing in response to nothing.',
    },

    { kind: 'h2', text: 'What an honest progress readout looks like' },
    {
      kind: 'p',
      text: 'The fix is not complicated, and it is mostly about restraint. Compare the block against several recent blocks rather than one. Measure how much those blocks varied among themselves. Then report a change only when it is larger than that variation — and when it is not, say so in words instead of drawing an arrow.',
    },
    {
      kind: 'p',
      text: 'That produces a readout that is silent more often than the alternative, and correct when it speaks. Most blocks will tell you the difference is within your normal range. That is the honest answer, and it is what makes the blocks that do report a real change worth reading.',
    },
    {
      kind: 'callout',
      title: 'The same restraint applies to per-key claims',
      text: 'In a twenty-word block you might press a given letter four times. Four presses cannot distinguish a slip from a pattern, in either direction. A tool that tells you a key "got worse" on that evidence is guessing, and the fix is to say nothing about keys it has not seen enough of.',
    },

    { kind: 'h2', text: 'Ranking keys by frequency tells you about English, not you' },
    {
      kind: 'p',
      text: 'Adaptive tools generally give you a per-key breakdown, often as a frequency histogram or a keyboard heatmap. These are handsome, and they are mostly not about you: a frequency chart of English text has E tallest, then T, then A, for every user who has ever loaded the page. Your chart and a stranger’s chart have the same shape.',
    },
    {
      kind: 'p',
      text: 'The question a practising typist actually has is which key to fix first, and frequency does not answer it. Neither does latency on its own — Q is slow for nearly everyone precisely because it is rare, and fixing it buys you almost nothing.',
    },
    {
      kind: 'p',
      text: 'The number that does answer it is time. For each key, take how much slower it is than your own fastest key, and multiply by how often you actually type it:',
    },
    {
      kind: 'quote',
      text: 'cost = (this key’s average latency − your fastest key’s latency) × times typed',
    },
    {
      kind: 'p',
      text: 'Anchoring to your own fastest key matters. It is not "slower than some ideal typist" — it is slower than you, on your best key, today. That is a gap you have already demonstrated you can close, because you are closing it every time you hit that key. And multiplying by usage is what separates "slow" from "worth practising".',
    },

    { kind: 'h2', text: 'How to use adaptive practice without wasting the time' },
    {
      kind: 'list',
      items: [
        'Practise in short sessions, often. Ten minutes daily beats an hour on Sunday — motor learning consolidates between sessions, not during them.',
        'Do not chase the per-block number. It is noisy by construction. Judge a session, not a block.',
        'Let accuracy lead. Speed gained by accepting errors is not gained; it is just booked somewhere else.',
        'Stay on pseudo-words while a specific key is the target, and switch to real text when you want to test transfer.',
        'Expect the unlock of a new letter to drop your speed. It should — you added a search problem. It recovers.',
      ],
    },

    {
      kind: 'faq',
      items: [
        {
          q: 'What is the best free alternative to Keybr?',
          a: 'Keybr itself is free and the adaptive-unlock idea is its contribution to the category. TypeCrt’s KeyForge is a free alternative built on the same principle, differing mainly in how progress is reported: it compares a block against several recent blocks and against your own variability, and stays silent when a difference cannot be distinguished from noise. It also ranks keys by the time they cost you rather than by how often they appear.',
        },
        {
          q: 'Does adaptive practice work better than just taking typing tests?',
          a: 'For a plateau, generally yes, and the reason is arithmetic rather than pedagogy. Typing English practises the letters English is made of, so the keys already holding you back get very few repetitions per session. Weighted generation reverses that ratio. Tests are still the better measurement — practise adaptively, measure on normal text.',
        },
        {
          q: 'How long before adaptive practice shows results?',
          a: 'Honest answer: nobody has published a number worth quoting, and any tool promising you a speed by a date is inventing it. What is reasonable to expect is that a specific targeted key becomes noticeably less awkward within a few sessions, while overall WPM moves slowly and unevenly. Judge it on the key you were targeting, not on your headline number.',
        },
        {
          q: 'Should I use pseudo-words or real words?',
          a: 'Pseudo-words while you are fixing a specific key, because they let the tool put that letter in front of you far more often than English would, and they stop you coasting on word recognition. Real words when you want to check whether the improvement transferred to actual typing. Both, alternating, is better than either alone.',
        },
      ],
    },

    {
      kind: 'sources',
      items: [
        {
          label:
            'Feit, Weir & Oulasvirta — "How We Type: Movement Strategies and Performance in Everyday Typing" (CHI 2016)',
          url: 'https://userinterfaces.aalto.fi/how-we-type/',
        },
        {
          label:
            'Dhakal, Feit, Kristensson & Oulasvirta — "Observations on Typing from 136 Million Keystrokes" (CHI 2018)',
          url: 'https://userinterfaces.aalto.fi/136Mkeystrokes/',
        },
        {
          label: 'Keybr — the adaptive practice tool discussed above',
          url: 'https://www.keybr.com/',
        },
        {
          label: 'TypeCrt KeyForge — how the confidence formula and unlock order work',
          url: 'https://typecrt.com/docs/keyforge',
        },
      ],
    },
  ],
};

export default article;
