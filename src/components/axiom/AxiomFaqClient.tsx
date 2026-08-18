'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { internalUrl } from '@/lib/paths';

export interface FaqItem {
  readonly id: string;
  readonly category: 'Neuroscience' | 'Quitting & Tools' | 'Psychology & Symptoms' | 'Privacy & Law';
  readonly question: string;
  readonly shortAnswer: string;
  readonly detailedAnswer: string;
  readonly reference?: string;
  readonly toolLink?: { label: string; href: string };
}

interface AxiomFaqClientProps {
  readonly faqs: ReadonlyArray<FaqItem>;
}

interface Chapter {
  readonly id: string;
  readonly number: string;
  readonly category: FaqItem['category'];
  readonly title: string;
  readonly subtitle: string;
  readonly accent: string;
}

const CHAPTERS: ReadonlyArray<Chapter> = [
  {
    id: 'neuroscience',
    number: '01',
    category: 'Neuroscience',
    title: 'Neurobiology & Receptor Recovery',
    subtitle: 'How supernormal novelty alters dopamine pathways, receptor density, and homeostasis timelines.',
    accent: '#8b7cf7',
  },
  {
    id: 'psychology',
    number: '02',
    category: 'Psychology & Symptoms',
    title: 'Symptoms, Flatlines & Relationships',
    subtitle: 'The clinical mechanics of withdrawal phases, desensitization, and relationship intimacy.',
    accent: '#60a5fa',
  },
  {
    id: 'protocol',
    number: '03',
    category: 'Quitting & Tools',
    title: 'The Rewiring Protocol',
    subtitle: 'Evidence-based urge interception, identity transitions, and sustainable habit formation.',
    accent: '#00f5a0',
  },
  {
    id: 'privacy',
    number: '04',
    category: 'Privacy & Law',
    title: 'Digital Privacy & Legal Facts',
    subtitle: 'Third-party tracking on adult platforms, ISP logging, and legal frameworks.',
    accent: '#f59e0b',
  },
];

const CATEGORIES = ['All', 'Neuroscience', 'Psychology & Symptoms', 'Quitting & Tools', 'Privacy & Law'] as const;
type Category = typeof CATEGORIES[number];

const MONO = 'ax-mono';

export default function AxiomFaqClient({ faqs }: AxiomFaqClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([faqs[0]?.id, faqs[1]?.id]));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredFaqs.map((f) => f.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.shortAnswer.toLowerCase().includes(query) ||
        faq.detailedAnswer.toLowerCase().includes(query) ||
        (faq.reference && faq.reference.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div className="axiom-v3 relative min-h-screen text-[#edeaf5] selection:bg-[#8b7cf7]/30 selection:text-white">
      {/* Background Stage */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(130% 100% at 50% 0%, #141026 0%, #0c0919 45%, #070709 85%, #050507 100%)',
          }}
        />
        <div className="ax-cage absolute inset-0 opacity-20" />
        <div className="ax-shafts opacity-20" />
      </div>

      {/* Header */}
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{ background: 'linear-gradient(to bottom, rgba(7,7,9,0.92), rgba(7,7,9,0.6) 70%, transparent)' }}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8 sm:py-5">
          <Link href="/axiom/" className="flex items-center gap-3.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 transition-transform duration-200 group-hover:scale-105">
              <img
                src={internalUrl('/images/axiom/logo.webp')}
                alt="Axiom Logo"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className={`${MONO} text-sm font-semibold tracking-[0.32em] text-[#f2f1f7]`}>
                AXIOM
              </span>
              <span className="text-[9px] tracking-[0.24em] text-[#7a7690] uppercase">Neuroscience Archive</span>
            </div>
          </Link>

          <div className="flex items-center gap-5 sm:gap-7">
            <Link
              href="/axiom/tools/"
              className={`${MONO} hidden text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] transition-colors hover:text-[#00f5a0] md:inline-block`}
            >
              Tools
            </Link>
            <Link
              href="/axiom/blog/"
              className={`${MONO} hidden text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] transition-colors hover:text-[#c5bdfc] md:inline-block`}
            >
              Library
            </Link>
            <Link
              href="/axiom/"
              className={`${MONO} rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#c9c6d8] transition-all hover:border-[#8b7cf7]/50 hover:bg-[#8b7cf7]/10 hover:text-white`}
            >
              ← App overview
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="relative mx-auto max-w-4xl px-4 pb-40 pt-32 sm:px-6 sm:pt-44">
        {/* Breadcrumb Path */}
        <nav
          aria-label="Breadcrumb"
          className={`${MONO} mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-[#7a7690]`}
        >
          <Link href="/" className="hover:text-[#edeaf5] transition-colors">Luna Maze</Link>
          <span className="text-[#3c3852]">/</span>
          <Link href="/axiom/" className="hover:text-[#edeaf5] transition-colors">Axiom</Link>
          <span className="text-[#3c3852]">/</span>
          <span className="text-[#c5bdfc]">Clinical Archive</span>
        </nav>

        {/* Hero Presentation */}
        <div className="pb-12 border-b border-white/[0.06]">
          <div className={`${MONO} mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#8b7cf7]`}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b7cf7] shadow-[0_0_8px_#8b7cf7]" />
            Evidence-Based Clinical FAQ
          </div>

          <h1 className="text-[clamp(2.4rem,5.5vw,4.2rem)] font-light leading-[1.04] tracking-[-0.035em] text-[#fbfaff]">
            The questions everyone asks.
            <br />
            <span className="ax-serif font-normal italic text-axiom-violetGlow">
              Answered with proof, not shame.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-[1.75] text-[#a6a3b8] sm:text-lg">
            A comprehensive clinical reference addressing compulsive pornography use, dopamine receptor density restoration, withdrawal flatlines, and zero-knowledge privacy. Grounded in peer-reviewed neurobiology.
          </p>
        </div>

        {/* Search & Category Filter Control */}
        <div className="sticky top-20 z-40 my-10 rounded-2xl border border-white/[0.08] bg-[#0c0a18]/90 p-3.5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative flex items-center">
              <svg
                className="absolute left-4 h-4 w-4 text-[#7a7690]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dopamine, flatline, PIED, DeltaFosB, tracking, India..."
                className="w-full rounded-xl border border-white/[0.06] bg-black/40 py-3 pl-11 pr-10 text-[16px] sm:text-sm text-[#f2f1f7] placeholder-[#635f79] outline-none transition-colors focus:border-[#8b7cf7] focus:bg-black/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs text-[#7a7690] hover:text-white"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center justify-between overflow-x-auto scrollbar-none pt-1 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`${MONO} shrink-0 rounded-lg px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-200 ${
                        isSelected
                          ? 'border border-[#8b7cf7]/60 bg-[#8b7cf7]/20 text-white shadow-[0_0_15px_rgba(139,124,247,0.3)] font-medium'
                          : 'border border-transparent text-[#7a7690] hover:border-white/10 hover:text-[#edeaf5]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-2 pl-3">
                <button
                  onClick={expandAll}
                  className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-[#7a7690] hover:text-[#00f5a0] transition-colors`}
                >
                  Expand all
                </button>
                <span className="text-[#3c3852]">·</span>
                <button
                  onClick={collapseAll}
                  className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-[#7a7690] hover:text-white transition-colors`}
                >
                  Collapse all
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Counter Info */}
        <div className="mb-8 flex items-center justify-between px-1 text-xs text-[#7a7690]">
          <span className={`${MONO} uppercase tracking-[0.24em]`}>
            Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Clinical Answer' : 'Clinical Answers'}
          </span>
          {searchQuery && <span className="text-[#a79bfb]">Filtered by &ldquo;{searchQuery}&rdquo;</span>}
        </div>

        {/* Content Render: Chapter-Organized when viewing All without active search */}
        {selectedCategory === 'All' && !searchQuery ? (
          <div className="space-y-16">
            {CHAPTERS.map((chapter) => {
              const chapterFaqs = faqs.filter((f) => f.category === chapter.category);
              if (chapterFaqs.length === 0) return null;

              return (
                <section key={chapter.id} className="space-y-5">
                  {/* Chapter Intro Banner */}
                  <div className="flex flex-col gap-1.5 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`${MONO} text-[11px] font-semibold tracking-[0.28em] uppercase`}
                        style={{ color: chapter.accent }}
                      >
                        CHAPTER {chapter.number}
                      </span>
                      <span className="h-px w-6 bg-white/[0.12]" />
                      <span className={`${MONO} text-[10px] uppercase tracking-[0.22em] text-[#7a7690]`}>
                        {chapter.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-medium tracking-tight text-[#f2f1f7] sm:text-2xl">
                      {chapter.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8983a3] leading-relaxed">
                      {chapter.subtitle}
                    </p>
                  </div>

                  {/* Chapter Question Cards */}
                  <div className="space-y-4 pt-1">
                    {chapterFaqs.map((item) => (
                      <FaqCard
                        key={item.id}
                        item={item}
                        isExpanded={expandedIds.has(item.id)}
                        onToggle={() => toggleExpand(item.id)}
                        accentColor={chapter.accent}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Flat list for active search or specific category filter */
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
                <p className="text-base font-medium text-[#edeaf5]">No matching answers found.</p>
                <p className="mt-2 text-xs text-[#8983a3]">
                  Try searching for terms like &ldquo;dopamine&rdquo;, &ldquo;flatline&rdquo;, &ldquo;PIED&rdquo;, &ldquo;tracking&rdquo;, or &ldquo;India&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className={`${MONO} mt-5 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-[#a79bfb] hover:bg-white/10`}
                >
                  Reset search
                </button>
              </div>
            ) : (
              filteredFaqs.map((item) => (
                <FaqCard
                  key={item.id}
                  item={item}
                  isExpanded={expandedIds.has(item.id)}
                  onToggle={() => toggleExpand(item.id)}
                />
              ))
            )}
          </div>
        )}

        {/* Bottom Studio Recovery CTA */}
        <section className="relative mt-24 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#120d28] to-[#070709] p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <p className={`${MONO} text-[10px] uppercase tracking-[0.28em] text-[#00f5a0] mb-3`}>
            ZERO-KNOWLEDGE ARCHITECTURE · CRYPTOGRAPHIC ISOLATION
          </p>

          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#edeaf5]">
            Rewiring is an arc. Start yours with proof.
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-[#a6a3b8] leading-relaxed">
            AXIOM is an honest habit tracker and neural rewire protocol. Free core forever: daily check-ins, guided breathing, urge panic tools, and your sealed on-device journal.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/axiom/"
              className={`${MONO} rounded-xl bg-[#8b7cf7] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#070709] transition-transform hover:scale-105 shadow-[0_0_25px_rgba(139,124,247,0.4)]`}
            >
              Get Axiom
            </Link>
            <Link
              href="/axiom/tools/severity-test/"
              className={`${MONO} rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-xs uppercase tracking-[0.22em] text-[#edeaf5] hover:bg-white/10 hover:border-white/30`}
            >
              Severity Self-Test
            </Link>
            <Link
              href="/axiom/tools/rewire-calculator/"
              className={`${MONO} rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-xs uppercase tracking-[0.22em] text-[#edeaf5] hover:bg-white/10 hover:border-white/30`}
            >
              Rewire Timeline
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className={`${MONO} text-[11px] uppercase tracking-[0.26em] text-[#7a7690]`}>
            AXIOM is crafted by{' '}
            <Link href="/" className="text-[#c5bdfc] hover:text-white transition-colors underline underline-offset-4">
              Luna Maze Studio
            </Link>
          </p>
          <p className="mt-3 text-xs text-[#4e4a60]">
            © {new Date().getFullYear()} Luna Maze. All recovery reflections sealed client-side.
          </p>
        </div>
      </footer>
    </div>
  );
}

/** Individual Question Card Component */
function FaqCard({
  item,
  isExpanded,
  onToggle,
  accentColor = '#8b7cf7',
}: {
  item: FaqItem;
  isExpanded: boolean;
  onToggle: () => void;
  accentColor?: string;
}) {
  return (
    <article
      className={`rounded-2xl border transition-all duration-200 ${
        isExpanded
          ? 'border-white/[0.16] bg-[#0e0b1c] shadow-[0_10px_35px_-10px_rgba(0,0,0,0.6)]'
          : 'border-white/[0.06] bg-[#0c0a17]/60 hover:border-white/[0.12] hover:bg-[#0c0a17]'
      }`}
    >
      {/* Question Header Button */}
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-start justify-between gap-4 p-6 sm:p-7 text-left outline-none"
      >
        <div className="space-y-2 pr-2">
          <span
            className={`${MONO} text-[10px] uppercase tracking-[0.24em] font-medium block`}
            style={{ color: accentColor }}
          >
            {item.category}
          </span>

          <h3 className="text-lg sm:text-xl font-normal tracking-[-0.015em] text-[#f2f1f7] leading-snug">
            {item.question}
          </h3>

          {!isExpanded && (
            <p className="text-xs sm:text-sm text-[#8983a3] line-clamp-1 leading-relaxed font-light">
              {item.shortAnswer}
            </p>
          )}
        </div>

        {/* Minimalist Geometric Toggle Icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-[#8983a3] transition-colors hover:text-white">
          <span className={`${MONO} text-sm leading-none`}>{isExpanded ? '−' : '+'}</span>
        </div>
      </button>

      {/* Expanded Accordion Drawer */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] p-6 sm:p-7 pt-5 space-y-5">
              {/* Primary Direct Clinical Finding */}
              <div
                className="border-l-2 pl-4 py-1"
                style={{ borderColor: accentColor }}
              >
                <p className="text-base sm:text-lg font-light leading-relaxed text-[#edeaf5]">
                  {item.shortAnswer}
                </p>
              </div>

              {/* In-Depth Scientific Analysis */}
              <div className="space-y-2">
                <p className={`${MONO} text-[10px] uppercase tracking-[0.24em] text-[#7a7690]`}>
                  NEUROLOGICAL MECHANISM
                </p>
                <p className="text-sm sm:text-base leading-[1.75] text-[#a6a3b8] font-normal">
                  {item.detailedAnswer}
                </p>
              </div>

              {/* Scientific Source Plaque */}
              {item.reference && (
                <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.05] bg-black/40 p-3.5 text-xs text-[#8983a3]">
                  <span className={`${MONO} text-[10px] uppercase tracking-wider text-[#c5bdfc] shrink-0 font-semibold`}>
                    Study:
                  </span>
                  <span className="italic leading-relaxed">{item.reference}</span>
                </div>
              )}

              {/* Actionable Companion Tool Link */}
              {item.toolLink && (
                <div className="pt-2">
                  <Link
                    href={item.toolLink.href}
                    className={`${MONO} inline-flex items-center gap-2 rounded-xl border border-[#00f5a0]/35 bg-[#00f5a0]/10 px-4 py-2.5 text-xs font-semibold text-[#00f5a0] transition-all hover:bg-[#00f5a0]/20 hover:border-[#00f5a0]/60`}
                  >
                    <span>{item.toolLink.label}</span>
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
