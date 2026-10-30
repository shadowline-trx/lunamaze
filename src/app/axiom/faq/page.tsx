import type { Metadata } from 'next';
import AxiomFaqClient, { type FaqItem } from '@/components/axiom/AxiomFaqClient';

export const metadata: Metadata = {
  title: 'Quitting Porn: Questions About Habits, Tools & Privacy',
  description: 'Plain answers about porn habits, flatline questions, streaks, privacy and AXIOM 2.7.3. Practical next steps with sources and the limits of what we know.',
  alternates: { canonical: 'https://lunamaze.com/axiom/faq/' },
  openGraph: { title: 'AXIOM Recovery Questions', description: 'Habits, practical tools and privacy, with sources.', url: 'https://lunamaze.com/axiom/faq/', type: 'website' },
};

// Existing answer IDs stay stable for incoming links.
const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    id: 'what-causes-porn-addiction', category: 'Neuroscience',
    question: 'What causes porn addiction and compulsive viewing?',
    shortAnswer: 'There is no single cause that explains every person’s porn use. Repeated cues, coping habits and a sense of losing control can all matter.',
    detailedAnswer: 'High frequency alone does not establish a disorder. A clinician considers control, consequences and impairment, along with other possible explanations. A browsing habit cannot tell you your dopamine level, receptor density or whether your brain is damaged. Begin with the situations you can observe: when you open it, what is happening around you, and what you want to do differently.',
    reference: 'WHO, ICD-11 clinical descriptions and diagnostic requirements (2024).',
    referenceUrl: 'https://www.who.int/publications/i/item/9789240077263',
    toolLink: { label: 'Write an observable if–then plan', href: '/axiom/blog/en/if-then-plan/' },
  },
  {
    id: 'can-brain-recover-how-long', category: 'Neuroscience',
    question: 'Can your brain recover from porn, and how long does it take?',
    shortAnswer: 'Habits can change, but there is no validated universal 30-, 60- or 90-day brain-recovery clock for quitting porn.',
    detailedAnswer: 'A streak or app map does not measure neurobiology. In one randomized seven-day abstinence study of regular users, the confirmatory analyses did not find general withdrawal effects. That does not mean nobody struggles; it means a fixed stage chart cannot predict your experience. Track changes you can observe and ask a qualified professional about persistent symptoms.',
    reference: 'Fernandez et al., randomized seven-day pornography abstinence study (2023).',
    referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/36652136/',
    toolLink: { label: 'Read the timeline guide and its evidence limits', href: '/axiom/blog/en/rewire-timeline/' },
  },
  {
    id: 'why-is-quitting-so-hard', category: 'Neuroscience',
    question: 'Why is quitting porn so hard? What is the withdrawal flatline?',
    shortAnswer: 'A familiar browsing response can be hard to interrupt. “Flatline” is a community term for experiences such as low desire or feeling emotionally flat, not a diagnosis.',
    detailedAnswer: 'Those experiences do not prove a dopamine deficit or a predictable healing phase. Sleep, stress, mood, medication and other factors can affect how you feel. You do not need to test yourself with more explicit material. If a change is persistent, distressing or affecting daily life, seek an individual assessment rather than waiting for an app countdown.',
    reference: 'Fernandez et al. (2023); the study does not establish a universal withdrawal sequence.',
    referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/36652136/',
    toolLink: { label: 'Read about the word flatline and when to get help', href: '/axiom/blog/en/flatline/' },
  },
  {
    id: 'is-porn-addiction-real', category: 'Neuroscience',
    question: 'Is porn addiction a recognized medical condition?',
    shortAnswer: 'The everyday phrase “porn addiction” is not interchangeable with a diagnosis. ICD-11 includes compulsive sexual behaviour disorder, assessed by a qualified professional.',
    detailedAnswer: 'WHO describes persistent impaired control and significant distress or impairment. High sexual interest alone is not enough, and distress entirely about moral disapproval is not enough. A self-test, a streak or a recovery app cannot make that diagnosis. You can choose to change a habit without labelling yourself with a disorder.',
    reference: 'WHO, ICD-11 clinical descriptions and diagnostic requirements (2024).',
    referenceUrl: 'https://www.who.int/publications/i/item/9789240077263',
  },
  {
    id: 'is-porn-bad-for-mental-health', category: 'Psychology & Symptoms',
    question: 'Is porn bad for mental health, anxiety, and concentration?',
    shortAnswer: 'Experiences differ. Difficulty controlling use and its consequences deserve attention, but a symptom does not establish that porn caused it.',
    detailedAnswer: 'Notice concrete effects on sleep, time, work, relationships and your chosen goals. Low mood or anxiety can have several causes; neither a website nor an app can separate them for you. If distress persists or functioning is affected, speak with a qualified professional. A habit plan can support the changes you choose while that assessment happens.',
    reference: 'WHO, ICD-11 clinical descriptions and diagnostic requirements (2024).',
    referenceUrl: 'https://www.who.int/publications/i/item/9789240077263',
  },
  {
    id: 'symptoms-of-porn-addiction', category: 'Psychology & Symptoms',
    question: 'What signs suggest I should ask for help with porn use?',
    shortAnswer: 'Repeated difficulty controlling use, continuing despite significant consequences, or interference with daily life are reasons to seek an assessment.',
    detailedAnswer: 'A particular number of sessions, a long streak goal or feeling guilty does not make a diagnosis. Write down what is happening and what it is affecting, without preserving explicit details. Bring those observations to a qualified professional if you want help understanding them. AXIOM’s check-ins are personal records, not a clinical screening result.',
    reference: 'WHO, ICD-11 clinical descriptions and diagnostic requirements (2024).',
    referenceUrl: 'https://www.who.int/publications/i/item/9789240077263',
  },
  {
    id: 'why-do-married-people-watch', category: 'Psychology & Symptoms',
    question: 'Why do married or partnered people watch porn, and does it affect relationships?',
    shortAnswer: 'A partner’s reason cannot be inferred from the fact that they watched. Expectations, boundaries and the effect on the relationship need an actual conversation.',
    detailedAnswer: 'Describe the behaviour and its impact rather than diagnosing someone’s motivation. Agree what you each mean by privacy, honesty and a boundary. If control, distress or repeated conflict is an issue, individual or relationship support may help clarify what to do next. AXIOM does not monitor a partner’s browsing, and Buddy Bond does not reveal journals, check-ins or streaks.',
  },
  {
    id: 'what-is-gooning', category: 'Psychology & Symptoms',
    question: 'What does “gooning” mean, and how can I interrupt a long browsing session?',
    shortAnswer: 'The word is commonly used for prolonged, absorbed sexual browsing or stimulation. The label is not a medical diagnosis.',
    detailedAnswer: 'If you want to stop the session, close the material, stand up and change the setting. Give the next few minutes an ordinary task away from the device. You do not have to wait until a craving disappears to make that move. Review later what brought you into the session, and prepare one response for that cue.',
    toolLink: { label: 'Use the urge-surfing walkthrough', href: '/axiom/blog/en/urge-surfing/' },
  },
  {
    id: 'how-to-stop-forever', category: 'Quitting & Tools',
    question: 'How do I start changing a porn habit?',
    shortAnswer: 'Choose a concrete goal, identify one familiar cue, add useful friction and prepare a response you can carry out when that cue appears.',
    detailedAnswer: '“Be stronger” leaves the decision until the hardest moment. Try a sentence such as: “If I take my phone to bed, I will leave it charging in the kitchen.” Start with a small plan, review what actually happened and adjust it. No app or checklist can guarantee that you will never watch again. A slip can be examined without writing off the rest of the day.',
    toolLink: { label: 'Start with a practical first-week plan', href: '/axiom/blog/en/first-week/' },
  },
  {
    id: 'what-app-can-help', category: 'Quitting & Tools',
    question: 'What does AXIOM offer for someone changing a porn habit?',
    shortAnswer: 'AXIOM 2.7.3 has thirty authored Recalibration nights, a daily plan, check-ins, breathing, a private journal and the Lighthouse.',
    detailedAnswer: 'Members can choose a reminder time for their next Recalibration night. An early summary opens after three distinct check-in days. The Lighthouse opens without membership; the November Climb has a separate seasonal invitation. Full access is paid, with a seven-day monthly trial for eligible new subscribers. AXIOM does not block apps or websites, and Shield, Circles and Community are not available in this release.',
    toolLink: { label: 'See the current release and exact access details', href: '/axiom/updates/' },
  },
  {
    id: 'do-streak-counters-work', category: 'Quitting & Tools',
    question: 'Do streak counters help, and what else can I track?',
    shortAnswer: 'A streak can support a chosen goal, but it records consecutive days rather than everything you have changed.',
    detailedAnswer: 'You might also track kept plans, time spent, interrupted sessions or evenings handled differently. Keep the measures simple enough to review. A counter resetting does not delete those observations. General progress-monitoring research supports recording and reviewing goals; it does not validate a porn-recovery percentage or an app’s brain-health score.',
    toolLink: { label: 'Track progress beyond a streak', href: '/axiom/blog/en/progress-beyond-streaks/' },
  },
  {
    id: 'can-i-be-tracked', category: 'Privacy & Law',
    question: 'Does private browsing hide my activity from everyone?',
    shortAnswer: 'No. Incognito mainly limits what the browser retains locally after the session. It does not make browsing invisible to websites or organisations managing the network.',
    detailedAnswer: 'Google’s own Chrome documentation explains those limits. Separately, decide what a habit app needs to receive: AXIOM keeps journal notes, trigger names, reset reasons and reflections on-device. Optional backup includes streak dates and mood scores, and first-party usage analytics can be disabled. Social features have their own shared information, explained in the privacy policy.',
    reference: 'Google Chrome Help, Browse in Incognito mode.',
    referenceUrl: 'https://support.google.com/chrome/answer/95464?hl=en',
    toolLink: { label: 'Read AXIOM’s data categories', href: '/axiom/privacy/' },
  },
  {
    id: 'is-porn-illegal-in-india', category: 'Privacy & Law',
    question: 'Where can I check the law on adult content in India?',
    shortAnswer: 'Use current official legislation and qualified legal advice for your circumstances. A short habit-app FAQ cannot give a blanket assurance about viewing, storing or sharing particular material.',
    detailedAnswer: 'India’s Information Technology Act distinguishes categories of material and conduct, including publishing or transmitting sexually explicit material and provisions concerning children. Consent, the material and what someone does with it matter. The official Act is linked below. AXIOM is not a source of legal advice or a way to bypass legal restrictions.',
    reference: 'India Code, Information Technology Act 2000, including sections 67A and 67B.',
    referenceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/13116/1/it_act_2000_updated.pdf',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org', '@type': 'FAQPage', '@id': 'https://lunamaze.com/axiom/faq/#faq',
  mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: `${item.shortAnswer} ${item.detailedAnswer}` } })),
};

export default function AxiomFaqPage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} /><AxiomFaqClient faqs={FAQ_ITEMS} /></>;
}
