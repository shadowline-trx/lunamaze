import type { JSX } from 'react';
import type { FaqItem } from '@/components/lunamaze/ProductFaq';
import TypecrtLanding from '@/components/typecrt/TypecrtLanding';

/**
 * TypeCrt product page: a CRT-lit landing with a monitor you can type on.
 * Copy and design live in `src/components/typecrt/`; metadata in layout.tsx.
 */

/**
 * Answers written to be quoted on their own. Every figure comes from TypeCrt's
 * published documentation; nothing here is a claim the docs do not back.
 */
const FAQ: ReadonlyArray<FaqItem> = [
  {
    q: 'What is TypeCrt?',
    a: 'TypeCrt is a typing test and practice tool styled after vintage CRT terminals, made by the independent studio Luna Maze. It runs in the browser at typecrt.com and is built in vanilla TypeScript with no framework and no virtual DOM. It offers 80 themes, practice that targets your weak keys, a command palette and a dashboard that tracks progress.',
  },
  {
    q: 'Is TypeCrt free?',
    a: 'Yes. Open typecrt.com and start typing. There is no sign-up wall in front of the test.',
  },
  {
    q: 'What is the average typing speed?',
    a: 'In the largest published typing study, which measured 168,960 people, the average speed was 51.56 words per minute. TypeCrt’s evidence page lists the exact figures from the two largest studies and the common claims that no research supports, such as the often-repeated 40 WPM average.',
  },
  {
    q: 'Why do different typing tests give me different WPM scores?',
    a: 'Because WPM is the output of a formula, not a direct measurement. Tests define a word as five characters, but they differ in their word lists, in how errors are counted and penalised, and in when the timer starts. A site that serves short common words will read faster than one serving long words. TypeCrt publishes its exact formulas so any score can be recomputed by hand.',
  },
  {
    q: 'How does TypeCrt calculate WPM and accuracy?',
    a: 'TypeCrt writes out net WPM, raw WPM, accuracy and consistency in full in its metrics documentation at typecrt.com/docs/metrics, and the results screen shows the character breakdown each number is computed from.',
  },
  {
    q: 'How does TypeCrt’s adaptive practice work?',
    a: 'Its practice engine, KeyForge, watches which keys you miss and builds drills around them so weak spots get more repetitions. The confidence formula, the order in which letters unlock and how drill words are generated are all documented at typecrt.com/docs/keyforge.',
  },
  {
    q: 'Can a beginner learn to type with TypeCrt?',
    a: 'Yes. The learn-to-type path starts on a handful of keys and adds the next key only once the last one sticks.',
  },
  {
    q: 'Can I use TypeCrt without a mouse?',
    a: 'Yes. A command palette puts modes, themes and tests one keystroke away, so the whole app can be driven from the keyboard.',
  },
  {
    q: 'Who makes TypeCrt?',
    a: 'TypeCrt is made by Luna Maze, an independent software studio run by the developer Shadowline. The studio also makes Axiom, Kern, Tether ADB and Drift.',
  },
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://lunamaze.com/typecrt/#faq',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function TypeCrtPage(): JSX.Element {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <TypecrtLanding faq={FAQ} />
    </>
  );
}
