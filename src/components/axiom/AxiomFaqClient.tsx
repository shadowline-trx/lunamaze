'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Grain from '@/components/axiom/Grain';
import { internalUrl } from '@/lib/paths';

export interface FaqItem {
  readonly id: string;
  readonly category: 'Neuroscience' | 'Quitting & Tools' | 'Psychology & Symptoms' | 'Privacy & Law';
  readonly question: string;
  readonly shortAnswer: string;
  readonly detailedAnswer: string;
  readonly reference?: string;
  readonly toolLink?: { label: string; href: string };
  readonly code?: string;
}

interface AxiomFaqClientProps {
  readonly faqs: ReadonlyArray<FaqItem>;
}

const CATEGORIES = ['All', 'Neuroscience', 'Quitting & Tools', 'Psychology & Symptoms', 'Privacy & Law'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_META: Record<string, { code: string; label: string; accent: string }> = {
  Neuroscience: { code: '01', label: 'NEUROBIOLOGY', accent: '#8b7cf7' },
  'Quitting & Tools': { code: '02', label: 'RECOVERY PROTOCOL', accent: '#00f5a0' },
  'Psychology & Symptoms': { code: '03', label: 'PSYCHOPATHOLOGY', accent: '#60a5fa' },
  'Privacy & Law': { code: '04', label: 'PRIVACY & LEGAL', accent: '#f59e0b' },
};

const MONO = 'ax-mono';

export default function AxiomFaqClient({ faqs }: AxiomFaqClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([faqs[0]?.id]));

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
    <div className="axiom-v3 relative min-h-screen overflow-x-hidden bg-[#07060a] text-[#edeaf5] antialiased selection:bg-[#8b7cf7]/30 selection:text-white font-sans">
      {/* Film grain layer */}
      <Grain />

      {/* Atmospheric deep stage background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 0%, #110d22 0%, #090712 40%, #07060a 80%, #040306 100%)',
          }}
        />

        {/* Ambient violet aura */}
        <div className="absolute -top-[20vw] left-1/2 h-[50vw] w-[50vw] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#6c5ce7]/15 to-transparent blur-[140px] opacity-60" />

        {/* Emerald accent glow */}
        <div className="absolute top-[40vh] -right-[15vw] h-[35vw] w-[35vw] rounded-full bg-[#00f5a0]/08 blur-[150px] opacity-30" />

        {/* Cyber grid lines */}
        <div className="ax-cage absolute inset-0 opacity-[0.14]" />
      </div>

      {/* Frosted Navigation Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.05] bg-[#07060a]/80 backdrop-blur-2xl transition-all duration-300">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-8 sm:py-4">
          <Link href="/axiom/" className="group flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-white/5 shadow-[0_0_15px_rgba(108,92,231,0.25)] transition-all duration-300 group-hover:border-[#8b7cf7]/50 group-hover:scale-105">
              <img
                src={internalUrl('/images/lunamaze-logo.png')}
                alt="Luna Maze Studio Emblem"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className={`${MONO} text-xs sm:text-sm font-medium tracking-[0.28em] text-[#f2f1f7] transition-colors group-hover:text-white`}>
                AXIOM
              </span>
              <span className="text-[8px] tracking-[0.2em] text-[#7a7690] uppercase">Neuroscience Archive</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/axiom/tools/"
              className={`${MONO} hidden text-[11px] uppercase tracking-[0.22em] text-[#8983a3] transition-colors hover:text-[#00f5a0] md:inline-block`}
            >
              Tools
            </Link>
            <Link
              href="/axiom/blog/"
              className={`${MONO} hidden text-[11px] uppercase tracking-[0.22em] text-[#8983a3] transition-colors hover:text-[#c5bdfc] md:inline-block`}
            >
              Research
            </Link>
            <Link
              href="/axiom/"
              className={`${MONO} flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#c9c6d8] transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white`}
            >
              <span>← Axiom App</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="relative mx-auto max-w-4xl px-4 pb-36 pt-28 sm:px-6 sm:pt-40">
        {/* Breadcrumb path */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`${MONO} mb-5 flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#6d6982]`}
        >
          <Link href="/" className="hover:text-[#edeaf5] transition-colors">Luna Maze</Link>
          <span className="text-[#3e3b4f]">/</span>
          <Link href="/axiom/" className="hover:text-[#edeaf5] transition-colors">Axiom</Link>
          <span className="text-[#3e3b4f]">/</span>
          <span className="text-[#a79bfb]">Clinical Evidence Archive</span>
        </motion.div>

        {/* Hero Section */}
        <section className="relative pb-10">
          {/* Eyebrow marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`${MONO} mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] text-[#a79bfb] backdrop-blur-md`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#00f5a0] shadow-[0_0_8px_#00f5a0]" />
            Peer-Reviewed Neuroplasticity Record
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[clamp(2.3rem,5.5vw,4.5rem)] font-light leading-[1.04] tracking-[-0.04em] text-[#fbfaff]"
          >
            The architecture of the loop.
            <br />
            <span className="ax-serif font-normal italic text-[#c5bdfc]">
              And the proof that rewires it.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-[#938ea9] sm:text-lg"
          >
            A calm, exhaustive record addressing compulsive viewing, dopamine receptor upregulation,
            the withdrawal flatline, and on-device cryptographic isolation. Grounded in neurobiology.
          </motion.p>
        </section>

        {/* Minimalist Floating Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="sticky top-16 z-40 my-6 rounded-2xl border border-white/[0.08] bg-[#090712]/90 p-3 backdrop-blur-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)]"
        >
          <div className="flex flex-col gap-2.5">
            {/* Search Input */}
            <div className="relative flex items-center">
              <svg
                className="absolute left-3.5 h-4 w-4 text-[#635f79]"
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
                placeholder="Search by symptom, neurotransmitter, flatline, law..."
                className="w-full rounded-xl border border-white/[0.05] bg-black/50 py-2.5 pl-10 pr-9 text-[16px] sm:text-sm text-[#f2f1f7] placeholder-[#5a5670] outline-none transition-colors focus:border-[#8b7cf7]/50 focus:bg-black/80"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-[#7a7690] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Navigation */}
            <div className="flex items-center justify-between overflow-x-auto scrollbar-none pt-0.5 gap-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`${MONO} shrink-0 rounded-lg px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all duration-200 ${
                        isSelected
                          ? 'border border-[#8b7cf7]/40 bg-[#8b7cf7]/15 text-[#fbfaff] shadow-[0_0_12px_rgba(139,124,247,0.2)]'
                          : 'border border-transparent text-[#7a7690] hover:border-white/10 hover:text-[#edeaf5]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-2 pl-2">
                <button
                  onClick={expandAll}
                  className={`${MONO} text-[9px] uppercase tracking-[0.18em] text-[#6d6982] hover:text-[#00f5a0] transition-colors`}
                >
                  Expand
                </button>
                <span className="text-[#3c3852]">/</span>
                <button
                  onClick={collapseAll}
                  className={`${MONO} text-[9px] uppercase tracking-[0.18em] text-[#6d6982] hover:text-white transition-colors`}
                >
                  Collapse
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Counter */}
        <div className="mb-4 flex items-center justify-between px-1 text-[11px] text-[#6d6982]">
          <span className={`${MONO} uppercase tracking-[0.2em]`}>
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Entry' : 'Entries'} in archive
          </span>
          {searchQuery && <span className="text-[#a79bfb]">Filtered</span>}
        </div>

        {/* FAQ Accordion Entries */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-10 text-center"
              >
                <p className="text-sm font-medium text-[#edeaf5]">No records matched your search query.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className={`${MONO} mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#c5bdfc]`}
                >
                  Reset Search
                </button>
              </motion.div>
            ) : (
              filteredFaqs.map((item, index) => {
                const isExpanded = expandedIds.has(item.id);
                const meta = CATEGORY_META[item.category] || CATEGORY_META.Neuroscience;

                return (
                  <motion.article
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.2) }}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
                      isExpanded
                        ? 'border-white/[0.14] bg-[#0c0919] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                        : 'border-white/[0.05] bg-[#090712]/60 hover:border-white/[0.1] hover:bg-[#090712]'
                    }`}
                  >
                    {/* Subtle glowing accent left stripe when expanded */}
                    {isExpanded && (
                      <div
                        className="absolute inset-y-0 left-0 w-[2px]"
                        style={{ backgroundColor: meta.accent }}
                      />
                    )}

                    {/* Question Header Button */}
                    <button
                      onClick={() => toggleExpand(item.id)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left outline-none"
                    >
                      <div className="space-y-1.5 pr-2">
                        <div className="flex items-center gap-2">
                          <span className={`${MONO} text-[9px] uppercase tracking-[0.22em] text-[#6d6982]`}>
                            [ {index < 9 ? `0${index + 1}` : index + 1} ]
                          </span>
                          <span
                            className={`${MONO} text-[9px] uppercase tracking-[0.2em] font-medium`}
                            style={{ color: meta.accent }}
                          >
                            // {meta.label}
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg font-normal tracking-[-0.015em] text-[#f2f1f7] group-hover:text-white leading-snug">
                          {item.question}
                        </h2>

                        {!isExpanded && (
                          <p className="text-xs text-[#7e7994] line-clamp-1 leading-relaxed font-light">
                            {item.shortAnswer}
                          </p>
                        )}
                      </div>

                      {/* Geometric toggle indicator */}
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.02] text-[#8983a3] transition-transform duration-200 group-hover:text-white">
                        <span className={`${MONO} text-xs leading-none`}>{isExpanded ? '−' : '+'}</span>
                      </div>
                    </button>

                    {/* Expanded Drawer */}
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
                          <div className="border-t border-white/[0.04] p-5 sm:p-6 pt-4 space-y-4 text-sm">
                            {/* Primary Takeaway Statement */}
                            <div className="border-l-2 border-[#8b7cf7] pl-4 py-0.5">
                              <p className="text-sm sm:text-base font-normal leading-relaxed text-[#fbfaff]">
                                {item.shortAnswer}
                              </p>
                            </div>

                            {/* Detailed Scientific Narrative */}
                            <div className="text-xs sm:text-sm leading-relaxed text-[#9f9ab5] font-light space-y-2">
                              <p>{item.detailedAnswer}</p>
                            </div>

                            {/* Scientific Source Badge */}
                            {item.reference && (
                              <div className="flex items-center gap-2 rounded-md border border-white/[0.04] bg-black/40 px-3 py-2 text-[11px] text-[#7e7994]">
                                <span className={`${MONO} text-[9px] uppercase tracking-wider text-[#a79bfb]`}>
                                  Evidence:
                                </span>
                                <span className="italic truncate">{item.reference}</span>
                              </div>
                            )}

                            {/* Interactive Tool Teleport */}
                            {item.toolLink && (
                              <div className="pt-1">
                                <Link
                                  href={item.toolLink.href}
                                  className={`${MONO} inline-flex items-center gap-2 rounded-lg border border-[#00f5a0]/30 bg-[#00f5a0]/[0.06] px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#00f5a0] transition-all hover:bg-[#00f5a0]/15 hover:border-[#00f5a0]/60`}
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
                  </motion.article>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Clean Architectural Vault Footer Section */}
        <section className="relative mt-24 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#100c24] to-[#07060a] p-6 sm:p-10 text-center">
          <div className={`${MONO} mb-3 text-[10px] uppercase tracking-[0.28em] text-[#00f5a0]`}>
            Zero-Knowledge Architecture · Sealed by Cryptography
          </div>

          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#fbfaff]">
            Recovery is rewritten one day at a time.
          </h2>

          <p className="mx-auto mt-3 max-w-md text-xs sm:text-sm text-[#8983a3] leading-relaxed">
            AXIOM is an independent habit tracker and neural rewire protocol. Free core forever: daily check-ins, guided breathing, urge panic grounding, and sealed on-device storage.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/axiom/"
              className={`${MONO} rounded-xl bg-[#8b7cf7] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#07060a] transition-transform hover:scale-105 shadow-[0_0_25px_rgba(139,124,247,0.4)]`}
            >
              Get Axiom
            </Link>
            <Link
              href="/axiom/tools/severity-test/"
              className={`${MONO} rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#edeaf5] hover:bg-white/10`}
            >
              Severity Test
            </Link>
            <Link
              href="/axiom/tools/rewire-calculator/"
              className={`${MONO} rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#edeaf5] hover:bg-white/10`}
            >
              Rewire Timeline
            </Link>
          </div>
        </section>
      </main>

      {/* Studio Footer */}
      <footer className="border-t border-white/[0.05] bg-[#050407] py-10">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className={`${MONO} text-[10px] uppercase tracking-[0.24em] text-[#6d6982]`}>
            AXIOM is crafted by{' '}
            <Link href="/" className="text-[#c5bdfc] hover:text-white transition-colors underline underline-offset-4">
              Luna Maze Studio
            </Link>
          </p>
          <p className="mt-2 text-[10px] text-[#484459]">
            © {new Date().getFullYear()} Luna Maze. All recovery reflections sealed client-side.
          </p>
        </div>
      </footer>
    </div>
  );
}
