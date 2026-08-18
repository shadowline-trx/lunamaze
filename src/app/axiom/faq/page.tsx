import type { Metadata } from 'next';
import type { JSX } from 'react';
import AxiomFaqClient, { type FaqItem } from '@/components/axiom/AxiomFaqClient';

export const metadata: Metadata = {
  title: 'Porn Addiction & Brain Recovery FAQ — Science, Timelines & Privacy | Axiom',
  description:
    'Evidence-based answers to the most searched questions on porn addiction, dopamine neuroplasticity, rewire timelines, mental health, private tracking, and recovery methods.',
  alternates: { canonical: 'https://lunamaze.com/axiom/faq/' },
  openGraph: {
    title: 'Porn Addiction & Brain Recovery FAQ — Science, Timelines & Privacy | Axiom',
    description:
      'Evidence-based answers on porn addiction, dopamine neuroplasticity, rewire timelines, mental health, private tracking, and recovery methods.',
    url: 'https://lunamaze.com/axiom/faq/',
    siteName: 'Luna Maze',
    type: 'website',
    images: [
      {
        url: 'https://lunamaze.com/images/axiom/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Axiom FAQ — Porn Addiction Recovery and Neuroscience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porn Addiction & Brain Recovery FAQ — Science, Timelines & Privacy | Axiom',
    description:
      'Evidence-based answers on porn addiction, dopamine neuroplasticity, rewire timelines, mental health, private tracking, and recovery methods.',
    images: ['https://lunamaze.com/images/axiom/og.jpg'],
  },
};

const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    id: 'what-causes-porn-addiction',
    category: 'Neuroscience',
    question: 'What causes porn addiction and compulsive viewing?',
    shortAnswer:
      'High-speed digital pornography acts as a "supernormal stimulus" that hijacks the brain’s mesolimbic dopamine pathway through hyper-novelty and instant reward.',
    detailedAnswer:
      'Evolutionary biology designed the brain to reward mating cues with surges of dopamine, reinforcing survival behaviors. Internet pornography delivers endless artificial novelty at a speed and variety the human brain never evolved to process (the Coolidge effect). Over repeated sessions, this causes high dopamine spikes followed by accumulation of the deltaFosB transcription factor in the nucleus accumbens, creating deeply entrenched neurological cravings and conditioned triggers.',
    reference: 'Volkow et al. (Neuroscience of Dopamine & Addictive Behaviors); Nestler (deltaFosB molecular mechanisms).',
    toolLink: { label: 'Calculate your habit load on our Severity Self-Test', href: '/axiom/tools/severity-test/' },
  },
  {
    id: 'can-brain-recover-how-long',
    category: 'Neuroscience',
    question: 'Can your brain recover from porn, and how long does it take?',
    shortAnswer:
      'Yes. Through neuroplasticity, dopamine D2 receptor density upregulates and prefrontal cortex executive control restores, typically taking between 60 to 90+ days.',
    detailedAnswer:
      'The brain is plastic. When high-intensity supernormal stimulation stops, the nervous system begins homeostasis. In the first 1-3 weeks, withdrawal and a "flatline" (temporary low libido, emotional fatigue) often occur as dopamine sensitivity is low. Between days 30-60, neuroplastic pruning weakens compulsive pathways. By days 60-90 and beyond, baseline dopamine receptors normalize, leading to sharper focus, emotional presence, and restored natural responsiveness.',
    reference: 'Kühn & Gallinat (Brain Structure & Pornography Consumption, JAMA Psychiatry).',
    toolLink: { label: 'Explore your timeline on the Rewire Calculator', href: '/axiom/tools/rewire-calculator/' },
  },
  {
    id: 'why-is-quitting-so-hard',
    category: 'Neuroscience',
    question: 'Why is quitting porn so hard? What is the withdrawal flatline?',
    shortAnswer:
      'Quitting is difficult because the brain experiences a temporary dopamine deficit state, triggering discomfort, restlessness, and the psychological "flatline."',
    detailedAnswer:
      'Because chronic exposure causes downregulation of dopamine receptors, removing porn creates a sudden dopamine drop. The brain interprets this as a deficit and triggers intense cravings to restore previous levels. Many people encounter the "flatline" — a phase where libido drops to zero, mood flattens, and anxiety spikes. People often mistake the flatline for permanent damage and relapse just to test their function. Knowing the flatline is proof of healing is essential.',
    reference: 'Lembke (Dopamine Nation: Finding Balance in the Age of Indulgence).',
    toolLink: { label: 'Use the Panic Button for emergency urge grounding', href: '/axiom/tools/panic/' },
  },
  {
    id: 'is-porn-addiction-real',
    category: 'Neuroscience',
    question: 'Is porn addiction a recognized medical condition?',
    shortAnswer:
      'Yes. The World Health Organization (WHO) formally recognizes it under ICD-11 as "Compulsive Sexual Behavior Disorder" (Code 6C72).',
    detailedAnswer:
      'While nomenclature varies between addiction specialists and clinical bodies, the WHO ICD-11 defines Compulsive Sexual Behavior Disorder (CSBD) by an inability to control intense sexual impulses or urges resulting in repetitive sexual behaviors that cause significant distress or impairment in personal, family, social, educational, or occupational functioning over 6 months or more.',
    reference: 'World Health Organization ICD-11 Clinical Descriptions (CSBD 6C72).',
  },
  {
    id: 'is-porn-bad-for-mental-health',
    category: 'Psychology & Symptoms',
    question: 'Is porn bad for mental health, anxiety, and concentration?',
    shortAnswer:
      'Extensive research links heavy compulsive consumption to elevated social anxiety, depressive symptoms, brain fog, and reduced prefrontal gray matter volume.',
    detailedAnswer:
      'Compulsive porn use depletes tonic (baseline) dopamine levels, leaving individuals susceptible to lethargy, motivational apathy, and social withdrawal. Furthermore, artificial hyper-stimulation creates cognitive dissonance and shame cycles, which exacerbate anxiety and erode self-efficacy.',
    reference: 'Love et al. (Neuroscience of Internet Pornography Addiction, Behavioral Sciences).',
  },
  {
    id: 'symptoms-of-porn-addiction',
    category: 'Psychology & Symptoms',
    question: 'What are the key symptoms and warning signs of porn addiction?',
    shortAnswer:
      'Common symptoms include escalating content intensity, failed attempts to cut down, using porn to cope with negative emotions, and relationship or sexual desensitization.',
    detailedAnswer:
      'Key diagnostic indicators include: (1) Escalation: needing more extreme or taboo material to achieve the same arousal; (2) Time distortion: spending hours browsing or "edging/gooning"; (3) Psychological toll: guilt, emotional numbness, and brain fog; (4) Physical symptoms: Porn-Induced Erectile Dysfunction (PIED) or delayed ejaculation with real partners; (5) Compulsive relapse despite clear negative life consequences.',
    toolLink: { label: 'Take the anonymous 2-minute Severity Self-Test', href: '/axiom/tools/severity-test/' },
  },
  {
    id: 'why-do-married-people-watch',
    category: 'Psychology & Symptoms',
    question: 'Why do married or partnered people watch porn, and does it affect relationships?',
    shortAnswer:
      'People in relationships often watch porn due to habit conditioning, stress relief, or novelty-seeking, but compulsive use can harm intimacy, trust, and physical connection.',
    detailedAnswer:
      'Pornography consumption is rarely about a lack of love or attraction for a partner. Instead, it is an automated coping mechanism for dopamine regulation, boredom, loneliness, or emotional avoidance. However, compulsive secret viewing often leads to emotional detachment, unrealistic sexual expectations, reduced partner satisfaction, and betrayal trauma when discovered.',
    reference: 'Schneider (Effects of Cybersex Addiction on Intimate Relationships).',
  },
  {
    id: 'what-is-gooning',
    category: 'Psychology & Symptoms',
    question: 'What is "gooning" and why is it so damaging to the nervous system?',
    shortAnswer:
      '"Gooning" refers to prolonged, trance-like arousal sessions lasting hours. It causes extreme dopamine floods that deeply exhaust neurological reward circuits.',
    detailedAnswer:
      'By maintaining high sexual excitation for continuous hours without resolution, individuals flood their synaptic clefts with continuous high-dose dopamine and norepinephrine. This intense multi-hour exposure causes severe receptor downregulation, extreme lethargy, cognitive brain fog, and intense post-session dysphoria. Recovery requires completely breaking the session loop and resetting the nervous system.',
  },
  {
    id: 'how-to-stop-forever',
    category: 'Quitting & Tools',
    question: 'How do you stop watching pornography forever and break the habit loop?',
    shortAnswer:
      'Permanent recovery requires combining environmental friction, emotional urge interception, cognitive rewiring, and non-judgmental pattern logging.',
    detailedAnswer:
      'Willpower alone fails because willpower is an exhaustible prefrontal resource. Effective recovery relies on: (1) Environmental friction: removing easy access, moving devices out of bedrooms at night; (2) Somatic urge surfing: riding out the 10-15 minute physical peak of an urge with physiological sigh breathing; (3) Identity shift: viewing yourself not as someone "fighting an urge" but as someone who is rewired and free; (4) Zero-shame logging: analyzing triggers (HALT: Hungry, Angry, Lonely, Tired) instead of punishing yourself.',
    toolLink: { label: 'Read our comprehensive Neuroplasticity Rewire Guide', href: '/axiom/blog/en/rewire-timeline/' },
  },
  {
    id: 'what-app-can-help',
    category: 'Quitting & Tools',
    question: 'What app can help me quit porn without shame, fake timers, or privacy leaks?',
    shortAnswer:
      'AXIOM is an independent, zero-knowledge recovery companion built on neuroscience. It provides honest phase tracking, free panic tools, and client-side encryption.',
    detailedAnswer:
      'Unlike legacy quit apps that lock panic buttons behind paywalls, use fabricated countdown timers, or sell user data to advertising brokers, AXIOM was built with strict ethical boundaries: (1) Free Core Forever: streaks, daily check-ins, breathing exercises, and panic tools are completely free; (2) Zero-Knowledge Encryption: all journal entries and recovery logs are encrypted on-device with your personal key — our servers cannot read your story; (3) Neuroscience Framework: tracking based on real dopamine receptor recovery stages, not arbitrary gamification.',
    toolLink: { label: 'Learn more about AXIOM', href: '/axiom/' },
  },
  {
    id: 'do-streak-counters-work',
    category: 'Quitting & Tools',
    question: 'Do bare streak counters work, or do they make relapses worse?',
    shortAnswer:
      'Bare numbers often trigger the "abstinence violation effect" — where a single reset causes total bingeing. Tracking phases and overall trend retention is far more effective.',
    detailedAnswer:
      'When an app reduces your entire recovery to a single fragile number (Day 42 → Day 0), a single slip creates overwhelming despair, leading to the cognitive trap: "I ruined everything, so I might as well binge." In reality, neuroplastic brain adaptations made over 40 days are not wiped out in 15 minutes. AXIOM treats a slip as data to study trigger patterns, preserving your underlying progress.',
  },
  {
    id: 'can-i-be-tracked',
    category: 'Privacy & Law',
    question: 'Can I be tracked for watching adult content on my phone or browser?',
    shortAnswer:
      'Yes. Commercial adult websites are heavily loaded with third-party tracking scripts, advertising trackers, and ISP logging.',
    detailedAnswer:
      'Academic studies have shown that over 90% of popular adult websites leak data to third-party ad networks, Google, or data brokers through device fingerprinting, tracking pixels, and unencrypted metadata. Even "Incognito Mode" only clears local browser history — it does NOT conceal traffic from ISPs, Wi-Fi network administrators, or web tracking entities. This is why private, zero-knowledge architecture in recovery tools (like AXIOM) is non-negotiable.',
    reference: 'Vallina-Rodriguez et al. (Tracking and Privacy Leaks in Adult Web Services).',
  },
  {
    id: 'is-porn-illegal-in-india',
    category: 'Privacy & Law',
    question: 'Is watching adult content illegal in India?',
    shortAnswer:
      'Private viewing of consensual adult pornography in India is not a criminal offense for adults, but producing, publishing, or distributing it is strictly illegal.',
    detailedAnswer:
      'Under the Information Technology Act 2000 (Section 67 and 67A) and the Indian Penal Code, publishing, transmitting, or facilitating commercial adult content is prohibited. The Supreme Court of India has observed that watching consensual adult content in the privacy of one’s home is not an offense. However, any content involving minors (CSAM) or non-consensual media is strictly illegal and subject to severe criminal prosecution (POCSO Act). Adult streaming sites also carry high risks of malicious software, extortion scams, and privacy tracking.',
    reference: 'Information Technology Act, 2000 (Sections 67, 67A); Supreme Court of India rulings.',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://lunamaze.com/axiom/faq/#faq',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: `${item.shortAnswer} ${item.detailedAnswer}`,
    },
  })),
};

export default function AxiomFaqPage(): JSX.Element {
  return (
    <>
      {/* Server-rendered structured data for Google Rich Snippets & AI Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <AxiomFaqClient faqs={FAQ_ITEMS} />
    </>
  );
}
