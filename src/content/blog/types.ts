/**
 * Blog content model for the Axiom recovery library.
 *
 * Every article is one file per language exporting a `BlogArticle`. Structured
 * blocks (not markdown) keep rendering consistent, make FAQ JSON-LD trivial to
 * emit, and avoid pulling a markdown dependency into the static export.
 *
 * The same `slug` is shared across all languages of one article — that is what
 * lets the route layer emit correct hreflang alternates automatically.
 */

export type BlogBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'list'; items: ReadonlyArray<string> }
  | { kind: 'quote'; text: string }
  | { kind: 'callout'; title: string; text: string }
  | { kind: 'faq'; items: ReadonlyArray<{ q: string; a: string }> };

export interface BlogArticle {
  /** Shared across languages; used in the URL and for hreflang grouping. */
  readonly slug: string;
  /** BCP-47 language tag, lowercase (e.g. 'en', 'hi', 'pt-br'). */
  readonly lang: string;
  /** Text direction; omit for LTR. */
  readonly dir?: 'rtl';
  readonly title: string;
  /** Meta description — also the index-card teaser. Keep under ~160 chars. */
  readonly description: string;
  /** ISO date, e.g. '2026-07-22'. */
  readonly datePublished: string;
  readonly dateModified: string;
  readonly readingMinutes: number;
  /** Localized label for the CTA button to the Axiom product page. */
  readonly ctaLabel: string;
  /** Localized one-liner above the CTA. Keep honest and low-pressure. */
  readonly ctaText: string;
  readonly blocks: ReadonlyArray<BlogBlock>;
}

export interface BlogLanguageMeta {
  /** Native display name, e.g. 'हिन्दी'. */
  readonly nativeName: string;
  /** English name for tooling/alt text. */
  readonly englishName: string;
}

export const BLOG_LANGUAGES: Readonly<Record<string, BlogLanguageMeta>> = {
  en: { nativeName: 'English', englishName: 'English' },
  hi: { nativeName: 'हिन्दी', englishName: 'Hindi' },
  ta: { nativeName: 'தமிழ்', englishName: 'Tamil' },
  ml: { nativeName: 'മലയാളം', englishName: 'Malayalam' },
  id: { nativeName: 'Bahasa Indonesia', englishName: 'Indonesian' },
  'pt-br': { nativeName: 'Português (BR)', englishName: 'Portuguese (Brazil)' },
  es: { nativeName: 'Español', englishName: 'Spanish' },
  ar: { nativeName: 'العربية', englishName: 'Arabic' },
  fr: { nativeName: 'Français', englishName: 'French' },
  de: { nativeName: 'Deutsch', englishName: 'German' },
  ru: { nativeName: 'Русский', englishName: 'Russian' },
  tr: { nativeName: 'Türkçe', englishName: 'Turkish' },
};
