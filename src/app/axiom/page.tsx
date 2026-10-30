import AxiomLanding from '@/components/axiom/AxiomLanding';
import { AXIOM_FAQS } from '@/content/axiomFaq';

/**
 * Structured data for the landing page only.
 *
 * It used to sit in the /axiom layout, so every page under it (blog posts,
 * tools, the privacy policy) claimed this page's ten FAQ answers, which none
 * of them show, plus a MedicalWebPage about an ICD-11 condition. Google treats
 * markup for content the visitor cannot see as spam, and AXIOM is a habit and
 * wellbeing app, not a medical source, so the medical node is gone for good.
 * The FAQ is built from the same array the page renders.
 */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MobileApplication',
      '@id': 'https://lunamaze.com/axiom/#app',
      name: 'AXIOM',
      alternateName: ['Axiom: Quit Porn, PMO Recovery'],
      description:
        'A private quit-porn app with thirty authored Recalibration nights, a daily plan, check-ins and a journal kept on-device. The Lighthouse opens without membership.',
      softwareVersion: '2.7.3',
      inLanguage: ['en', 'es', 'pt-BR', 'hi', 'fr', 'de', 'ru', 'id', 'tr', 'ar', 'zh-Hans'],
      url: 'https://lunamaze.com/axiom/',
      image: 'https://lunamaze.com/images/axiom/og.jpg',
      operatingSystem: 'Android, iOS',
      applicationCategory: 'HealthApplication',
      installUrl: 'https://play.google.com/store/apps/details?id=com.axiomapp.app',
      sameAs: ['https://apps.apple.com/app/id6791180351'],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description:
          'Free download. Full membership is paid at the local price shown in the app. Eligible monthly subscribers have a seven-day trial; annual plans have no trial. The Lighthouse opens without membership.',
      },
      publisher: { '@id': 'https://lunamaze.com/#organization' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://lunamaze.com/#organization',
      name: 'Luna Maze',
      url: 'https://lunamaze.com/',
      logo: 'https://lunamaze.com/images/lunamaze-logo-512.png',
    },
    {
      '@type': 'FAQPage',
      mainEntity: AXIOM_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Luna Maze', item: 'https://lunamaze.com/' },
        { '@type': 'ListItem', position: 2, name: 'AXIOM', item: 'https://lunamaze.com/axiom/' },
      ],
    },
  ],
};

export default function AxiomPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <AxiomLanding />
    </>
  );
}
