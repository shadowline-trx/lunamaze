import type { JSX } from 'react';

export interface FaqItem {
  readonly q: string;
  readonly a: string;
}

interface ProductFaqProps {
  readonly items: ReadonlyArray<FaqItem>;
  readonly title?: string;
  /** Page URL, used to give the FAQPage node a stable @id. */
  readonly pageUrl: string;
}

/**
 * Question-and-answer block for a product page, with matching FAQPage JSON-LD.
 * Answers are plain, self-contained sentences so a search snippet or an AI
 * answer can quote any one of them without the rest of the page. The markup
 * mirrors the Tether ADB FAQ; <details> works before any script has loaded.
 */
export default function ProductFaq({ items, title = 'Frequently asked', pageUrl }: ProductFaqProps): JSX.Element {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-6 py-20 sm:py-24" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 id="faq-title" className="text-center text-3xl font-bold tracking-tight text-lunamaze-textPrimary sm:text-4xl">
        {title}
      </h2>
      <div className="mt-10 space-y-3">
        {items.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-5 [&_summary]:cursor-pointer"
          >
            <summary className="flex items-center justify-between gap-4 text-[15.5px] font-semibold text-lunamaze-textPrimary marker:content-['']">
              <h3 className="text-[15.5px] font-semibold">{f.q}</h3>
              <span aria-hidden="true" className="text-lunamaze-textSecondary transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed text-lunamaze-textSecondary">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
