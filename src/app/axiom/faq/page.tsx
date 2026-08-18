import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { internalUrl } from '@/lib/paths';

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

const MONO = 'ax-mono';

interface FaqItem {
  readonly id: string;
  readonly category: 'Neuroscience' | 'Quitting & Tools' | 'Psychology & Symptoms' | 'Privacy & Law';
  readonly question: string;
  readonly shortAnswer: string;
  readonly detailedAnswer: string;
  readonly reference?: string;
  readonly toolLink?: { label: string; href: string };
}

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
    <div className="axiom-v3 relative min-h-screen bg-[#070709] text-[#f2f1f7]">
      {/* JSON-LD Schema for Google Rich Snippets & AI Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Background stage */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 0%, #131318 0%, #0a0a0d 52%, #070709 100%)',
          }}
        />
        <div className="ax-cage absolute inset-0 opacity-40" />
        <div className="ax-shafts opacity-30" />
      </div>

      {/* Header Navigation */}
      <header
        className="fixed inset-x-0 top-0 z-50 backdrop-blur-md"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,13,0.85), transparent)' }}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/axiom/" className="flex items-center gap-3">
            <img
              src={internalUrl('/images/axiom/logo.webp')}
              alt="Axiom Logo"
              width={34}
              height={34}
              className="h-[34px] w-[34px] rounded-xl"
            />
            <span className={`${MONO} text-sm font-medium tracking-[0.34em] text-[#e8e6f0]`}>
              AXIOM
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/axiom/tools/"
              className={`${MONO} text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] transition-colors hover:text-[#e8e6f0]`}
            >
              Free Tools
            </Link>
            <Link
              href="/axiom/"
              className={`${MONO} text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] transition-colors hover:text-[#e8e6f0]`}
            >
              ← Overview
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative mx-auto max-w-4xl px-4 pb-32 pt-28 sm:px-6 sm:pt-36">
        {/* Breadcrumb indicator */}
        <nav aria-label="Breadcrumb" className={`${MONO} mb-8 text-[11px] uppercase tracking-[0.2em] text-[#8f8ca1]`}>
          <Link href="/axiom/" className="hover:text-[#e8e6f0]">Axiom</Link>
          <span className="mx-2">/</span>
          <span className="text-[#cdc7ee]">Frequently Asked Questions</span>
        </nav>

        {/* Hero Title */}
        <div
          className={`${MONO} mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#9b98ad] backdrop-blur-md`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#8b7cf7] shadow-[0_0_12px_rgba(139,124,247,0.8)]" />
          Evidence-Based FAQ
        </div>

        <h1 className="text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-[#f2f1f7]">
          Porn, Dopamine & Recovery.
          <br />
          <span className="ax-serif ax-grad-violet font-normal">Answered with evidence.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#a6a3b8]">
          Honest answers to the most common questions on neuroplasticity, timelines, privacy, and
          practical recovery methods. No shame, no moralizing, and no pseudo-science.
        </p>

        {/* Quick Anchor Links */}
        <div className="mt-8 flex flex-wrap gap-2">
          {['Neuroscience', 'Psychology & Symptoms', 'Quitting & Tools', 'Privacy & Law'].map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className={`${MONO} rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#c9c6d8] transition-colors hover:border-[#8b7cf7]/50 hover:bg-[#8b7cf7]/10 hover:text-white`}
            >
              {cat}
            </a>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="mt-16 space-y-16">
          {(['Neuroscience', 'Psychology & Symptoms', 'Quitting & Tools', 'Privacy & Law'] as const).map(
            (category) => {
              const categoryItems = FAQ_ITEMS.filter((item) => item.category === category);
              const sectionId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

              return (
                <section key={category} id={sectionId} className="scroll-mt-28">
                  <div className="mb-6 flex items-center gap-3 border-b border-white/[0.08] pb-4">
                    <h2 className={`${MONO} text-xs font-semibold uppercase tracking-[0.28em] text-[#8b7cf7]`}>
                      {category}
                    </h2>
                    <span className="text-xs text-[#5a576e]">({categoryItems.length} questions)</span>
                  </div>

                  <div className="space-y-4">
                    {categoryItems.map((item) => (
                      <article
                        key={item.id}
                        id={item.id}
                        className="ax-card group rounded-2xl border border-white/[0.08] bg-[#0c0c11]/80 p-6 sm:p-7 backdrop-blur-md transition-all duration-200 hover:border-[#8b7cf7]/40"
                      >
                        <h3 className="text-xl font-semibold text-[#f2f1f7] leading-snug">
                          {item.question}
                        </h3>

                        <p className="mt-3 text-base font-medium text-[#cdc7ee] leading-relaxed">
                          {item.shortAnswer}
                        </p>

                        <p className="mt-3 text-sm text-[#9b98ad] leading-relaxed">
                          {item.detailedAnswer}
                        </p>

                        {item.reference && (
                          <p className={`${MONO} mt-4 text-[11px] text-[#716e85] leading-relaxed border-l-2 border-[#8b7cf7]/30 pl-3`}>
                            <strong className="text-[#8f8ca1]">Evidence / Reference:</strong> {item.reference}
                          </p>
                        )}

                        {item.toolLink && (
                          <div className="mt-5 pt-4 border-t border-white/[0.05]">
                            <Link
                              href={item.toolLink.href}
                              className={`${MONO} inline-flex items-center gap-2 text-xs font-medium text-[#7ef7c2] transition-colors hover:text-[#b4fbe0]`}
                            >
                              <span>→ {item.toolLink.label}</span>
                            </Link>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              );
            }
          )}
        </div>

        {/* Bottom CTA Box */}
        <section className="mt-20 rounded-3xl border border-[#8b7cf7]/30 bg-gradient-to-b from-[#161426] to-[#0d0c17] p-8 sm:p-12 text-center shadow-[0_0_80px_-20px_rgba(139,124,247,0.25)]">
          <div
            className={`${MONO} mb-4 inline-flex items-center gap-2 rounded-full border border-[#8b7cf7]/30 bg-[#8b7cf7]/10 px-3.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[#c9c6d8]`}
          >
            Zero-Knowledge Recovery
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#f2f1f7]">
            Ready to begin an honest, private recovery?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#a6a3b8]">
            AXIOM is free forever at its core. No ads, no fake countdowns, and your journal never leaves your device readable. Available on iOS and Android.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/axiom/"
              className={`${MONO} rounded-xl bg-[#8b7cf7] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#070709] transition-transform duration-150 hover:scale-[1.02] hover:bg-[#9d90fb]`}
            >
              Explore AXIOM
            </Link>
            <Link
              href="/axiom/tools/severity-test/"
              className={`${MONO} rounded-xl border border-white/15 bg-white/[0.05] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#e8e6f0] transition-colors hover:bg-white/10`}
            >
              Take Free Severity Test
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] bg-[#08080a] py-10">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-[#8f8ca1]`}>
            A recovery app by{' '}
            <a href={internalUrl('/')} className="text-[#c9c6d8] underline underline-offset-2 transition-colors hover:text-[#e8e6f0]">
              Luna Maze
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
