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
        'A quit porn app built for the minute the urge hits: a streak tracker, a panic button that opens whether or not you pay, a 30-day reboot program and a journal that stays on your phone.',
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
          'Free to install. A subscription is needed to use the app, and the price is shown in your own currency before you buy. The panic button opens for anyone, subscribed or not.',
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
