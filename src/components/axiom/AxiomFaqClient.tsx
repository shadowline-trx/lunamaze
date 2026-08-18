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
  readonly keyStat?: { label: string; value: string };
}

interface AxiomFaqClientProps {
  readonly faqs: ReadonlyArray<FaqItem>;
}

const CATEGORIES = ['All', 'Neuroscience', 'Quitting & Tools', 'Psychology & Symptoms', 'Privacy & Law'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_COLORS: Record<string, { badge: string; border: string; glow: string; text: string }> = {
  Neuroscience: {
    badge: 'bg-[#8b7cf7]/15 text-[#a79bfb] border-[#8b7cf7]/30',
    border: 'hover:border-[#8b7cf7]/50',
    glow: 'from-[#8b7cf7]/10 to-transparent',
    text: 'text-[#a79bfb]',
  },
  'Quitting & Tools': {
    badge: 'bg-[#00f5a0]/15 text-[#00f5a0] border-[#00f5a0]/30',
    border: 'hover:border-[#00f5a0]/50',
    glow: 'from-[#00f5a0]/10 to-transparent',
    text: 'text-[#00f5a0]',
  },
  'Psychology & Symptoms': {
    badge: 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30',
    border: 'hover:border-[#38bdf8]/50',
    glow: 'from-[#38bdf8]/10 to-transparent',
    text: 'text-[#38bdf8]',
  },
  'Privacy & Law': {
    badge: 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30',
    border: 'hover:border-[#fbbf24]/50',
    glow: 'from-[#fbbf24]/10 to-transparent',
    text: 'text-[#fbbf24]',
  },
};

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
    <div className="axiom-v3 relative min-h-screen overflow-x-hidden bg-[#07060a] text-[#edeaf5] antialiased selection:bg-[#8b7cf7]/30 selection:text-white">
      {/* Film grain layer */}
      <Grain />

      {/* Atmospheric dynamic canvas mesh & light shafts */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Core radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(130% 100% at 50% 0%, #15102a 0%, #0c0919 35%, #07060a 75%, #050407 100%)',
          }}
        />

        {/* Ambient violet energy orb */}
        <div className="absolute -top-[20vw] left-1/2 h-[55vw] w-[55vw] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#6c5ce7]/20 to-[#8b7cf7]/5 blur-[120px] opacity-70 animate-pulse duration-[8000ms]" />

        {/* Mint reward glow subtle orb (right side) */}
        <div className="absolute top-[35vh] -right-[15vw] h-[40vw] w-[40vw] rounded-full bg-[#00f5a0]/10 blur-[140px] opacity-40" />

        {/* Subtle grid cage */}
        <div className="ax-cage absolute inset-0 opacity-25" />
        <div className="ax-shafts opacity-20" />
      </div>

      {/* Fixed Frosted Header Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07060a]/75 backdrop-blur-xl transition-all duration-300">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/axiom/" className="group flex items-center gap-3.5">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-[0_0_20px_rgba(108,92,231,0.3)] transition-transform duration-300 group-hover:scale-105">
              <img
                src={internalUrl('/images/axiom/logo.webp')}
                alt="Axiom Logo"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className={`${MONO} text-sm font-semibold tracking-[0.32em] text-[#f2f1f7] transition-colors group-hover:text-white`}>
                AXIOM
              </span>
              <span className="text-[9px] tracking-widest text-[#7a7690] uppercase">Neuroscience Protocol</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/axiom/tools/"
              className={`${MONO} hidden text-[11px] uppercase tracking-[0.2em] text-[#9b98ad] transition-colors hover:text-[#00f5a0] sm:inline-block`}
            >
              Free Tools
            </Link>
            <Link
              href="/axiom/blog/"
              className={`${MONO} hidden text-[11px] uppercase tracking-[0.2em] text-[#9b98ad] transition-colors hover:text-[#a79bfb] sm:inline-block`}
            >
              Research Library
            </Link>
            <Link
              href="/axiom/"
              className={`${MONO} flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[#c9c6d8] backdrop-blur-md transition-all duration-200 hover:border-[#8b7cf7]/50 hover:bg-[#8b7cf7]/15 hover:text-white hover:shadow-[0_0_20px_rgba(139,124,247,0.3)]`}
            >
              <span>← App Overview</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content Stage */}
      <main className="relative mx-auto max-w-5xl px-4 pb-36 pt-32 sm:px-8 sm:pt-40">
        {/* Breadcrumb path */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className={`${MONO} mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#7a7690]`}
        >
          <Link href="/" className="hover:text-[#edeaf5] transition-colors">Luna Maze</Link>
          <span>/</span>
          <Link href="/axiom/" className="hover:text-[#edeaf5] transition-colors">Axiom</Link>
          <span>/</span>
          <span className="text-[#a79bfb]">Clinical & Recovery FAQ</span>
        </motion.nav>

        {/* Hero Header Section */}
        <div className="relative">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`${MONO} mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#8b7cf7]/30 bg-[#8b7cf7]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-[#c5bdfc] backdrop-blur-md shadow-[0_0_25px_rgba(139,124,247,0.2)]`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00f5a0] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00f5a0]" />
            </span>
            Clinical Evidence & Recovery Protocol
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2.6rem,6.5vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#fbfaff]"
          >
            The Neuroscience of Rewiring.
            <br />
            <span className="ax-serif font-normal italic bg-gradient-to-r from-[#9d8ffb] via-[#c5bdfc] to-[#00f5a0] bg-clip-text text-transparent">
              Answered with proof.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-[#a5a0be] sm:text-xl"
          >
            Clear, honest, research-grounded answers to the most searched questions on compulsive
            viewing, dopamine receptor restoration, withdrawal flatlines, and zero-knowledge privacy.
            No shame, no pseudo-science, no dogma.
          </motion.p>
        </div>

        {/* Cinematic 4-Pillar Stat Rail */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4"
        >
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#8b7cf7]/40 hover:bg-[#8b7cf7]/[0.04]">
            <div className={`${MONO} text-2xl font-bold tracking-tight text-[#f2f1f7] sm:text-3xl text-[#a79bfb]`}>
              60–90d
            </div>
            <p className="mt-1.5 text-xs text-[#8983a3] leading-relaxed">
              Dopamine D2 Receptor Normalization Arc
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#00f5a0]/40 hover:bg-[#00f5a0]/[0.04]">
            <div className={`${MONO} text-2xl font-bold tracking-tight text-[#f2f1f7] sm:text-3xl text-[#00f5a0]`}>
              0 Bytes
            </div>
            <p className="mt-1.5 text-xs text-[#8983a3] leading-relaxed">
              Readable Journal Data Sent to Cloud
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#38bdf8]/40 hover:bg-[#38bdf8]/[0.04]">
            <div className={`${MONO} text-2xl font-bold tracking-tight text-[#f2f1f7] sm:text-3xl text-[#38bdf8]`}>
              ICD-11
            </div>
            <p className="mt-1.5 text-xs text-[#8983a3] leading-relaxed">
              Code 6C72 WHO Clinical Diagnosis
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#fbbf24]/40 hover:bg-[#fbbf24]/[0.04]">
            <div className={`${MONO} text-2xl font-bold tracking-tight text-[#f2f1f7] sm:text-3xl text-[#fbbf24]`}>
              100% Free
            </div>
            <p className="mt-1.5 text-xs text-[#8983a3] leading-relaxed">
              Permanent Panic, Check-in & Breathing Tools
            </p>
          </div>
        </motion.div>

        {/* Interactive Search & Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 space-y-5 rounded-3xl border border-white/[0.09] bg-[#0d0a17]/90 p-5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:p-6"
        >
          {/* Search bar */}
          <div className="relative flex items-center">
            <svg
              className="absolute left-4.5 h-5 w-5 text-[#8983a3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, symptom, neurotransmitter, flatline, privacy, or law..."
              className="w-full rounded-2xl border border-white/[0.08] bg-black/40 py-3.5 pl-12 pr-10 text-sm text-[#f2f1f7] placeholder-[#635f79] outline-none transition-all duration-200 focus:border-[#8b7cf7] focus:bg-black/60 focus:ring-2 focus:ring-[#8b7cf7]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs text-[#8983a3] hover:text-white"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Category Chips & Bulk Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`${MONO} relative rounded-xl px-3.5 py-1.5 text-xs uppercase tracking-[0.16em] transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#8b7cf7] font-semibold text-[#07060a] shadow-[0_0_20px_rgba(139,124,247,0.5)]'
                        : 'border border-white/10 bg-white/[0.02] text-[#8983a3] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className={`${MONO} text-[10px] uppercase tracking-[0.18em] text-[#7a7690] hover:text-[#00f5a0] transition-colors`}
              >
                Expand all
              </button>
              <span className="text-[#3c3852]">·</span>
              <button
                onClick={collapseAll}
                className={`${MONO} text-[10px] uppercase tracking-[0.18em] text-[#7a7690] hover:text-[#e8e6f0] transition-colors`}
              >
                Collapse all
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Counter */}
        <div className="mt-8 flex items-center justify-between px-1">
          <p className={`${MONO} text-xs uppercase tracking-[0.2em] text-[#7a7690]`}>
            Showing <span className="text-[#edeaf5] font-semibold">{filteredFaqs.length}</span> verified clinical answers
          </p>
          {searchQuery && (
            <p className="text-xs text-[#a79bfb]">Filtered by query &ldquo;{searchQuery}&rdquo;</p>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-6 space-y-4">
          <AnimatePresence>
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-12 text-center"
              >
                <p className="text-lg font-medium text-[#edeaf5]">No answers match your search term.</p>
                <p className="mt-2 text-sm text-[#8983a3]">
                  Try searching for terms like &ldquo;dopamine&rdquo;, &ldquo;flatline&rdquo;, &ldquo;PIED&rdquo;, &ldquo;tracking&rdquo;, or &ldquo;India&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className={`${MONO} mt-6 rounded-xl border border-[#8b7cf7]/40 bg-[#8b7cf7]/15 px-4 py-2 text-xs uppercase tracking-widest text-[#c5bdfc]`}
                >
                  Reset all filters
                </button>
              </motion.div>
            ) : (
              filteredFaqs.map((item, index) => {
                const isExpanded = expandedIds.has(item.id);
                const styling = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Neuroscience;

                return (
                  <motion.article
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
                    className={`group relative overflow-hidden rounded-2xl border bg-[#0b0814]/80 backdrop-blur-xl transition-all duration-300 ${
                      isExpanded
                        ? 'border-[#8b7cf7]/40 shadow-[0_10px_35px_-10px_rgba(108,92,231,0.25)]'
                        : 'border-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    {/* Top gradient glow line on expanded */}
                    {isExpanded && (
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8b7cf7] to-transparent opacity-80" />
                    )}

                    {/* Question Clickable Header */}
                    <button
                      onClick={() => toggleExpand(item.id)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-start justify-between gap-4 p-6 sm:p-7 text-left outline-none"
                    >
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`${MONO} inline-block rounded-md border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${styling.badge}`}
                          >
                            {item.category}
                          </span>
                          <span className={`${MONO} text-[11px] text-[#55506c]`}>Q{index + 1}</span>
                        </div>

                        <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#f6f5fa] transition-colors group-hover:text-white sm:text-xl">
                          {item.question}
                        </h2>

                        {!isExpanded && (
                          <p className="text-sm text-[#8983a3] line-clamp-1 leading-relaxed">
                            {item.shortAnswer}
                          </p>
                        )}
                      </div>

                      {/* Expand indicator icon */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isExpanded
                            ? 'border-[#8b7cf7]/40 bg-[#8b7cf7]/20 text-[#a79bfb] rotate-180'
                            : 'border-white/10 bg-white/[0.03] text-[#8983a3] group-hover:border-white/20 group-hover:text-white'
                        }`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expandable Body */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.06] p-6 sm:p-7 pt-4 sm:pt-5 space-y-5">
                            {/* Key Takeaway Callout */}
                            <div className="rounded-xl border border-[#8b7cf7]/20 bg-[#8b7cf7]/[0.07] p-4.5">
                              <p className={`${MONO} text-[10px] uppercase tracking-[0.24em] text-[#a79bfb] font-semibold`}>
                                Key Neurobiological Takeaway
                              </p>
                              <p className="mt-1 text-sm font-medium leading-relaxed text-[#edeaf5]">
                                {item.shortAnswer}
                              </p>
                            </div>

                            {/* Detailed Explanation */}
                            <div className="space-y-3">
                              <p className={`${MONO} text-[10px] uppercase tracking-[0.22em] text-[#7a7690]`}>
                                In-Depth Analysis & Mechanism
                              </p>
                              <p className="text-sm leading-relaxed text-[#b1acc7] sm:text-base">
                                {item.detailedAnswer}
                              </p>
                            </div>

                            {/* Scientific References */}
                            {item.reference && (
                              <div className="flex items-start gap-2.5 rounded-lg border border-white/[0.05] bg-black/30 p-3 text-xs text-[#8983a3]">
                                <span className={`${MONO} text-[10px] uppercase text-[#a79bfb] font-semibold shrink-0`}>
                                  Source Study:
                                </span>
                                <span className="italic">{item.reference}</span>
                              </div>
                            )}

                            {/* Tool / Solution link */}
                            {item.toolLink && (
                              <div className="pt-2">
                                <Link
                                  href={item.toolLink.href}
                                  className="group/link inline-flex items-center gap-2.5 rounded-xl border border-[#00f5a0]/30 bg-[#00f5a0]/10 px-4 py-2.5 text-xs font-semibold text-[#00f5a0] transition-all duration-200 hover:border-[#00f5a0]/60 hover:bg-[#00f5a0]/20 hover:shadow-[0_0_20px_rgba(0,245,160,0.25)]"
                                >
                                  <span>{item.toolLink.label}</span>
                                  <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
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

        {/* Master CTA Hero Box ("The Dawn Resolution") */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="relative mt-28 overflow-hidden rounded-3xl border border-[#8b7cf7]/35 bg-gradient-to-b from-[#181335] via-[#0f0c22] to-[#07060a] p-8 sm:p-14 text-center shadow-[0_0_100px_-20px_rgba(108,92,231,0.35)]"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(108,92,231,0.25)_0%,transparent_70%)]" />

          <div
            className={`${MONO} mb-4 inline-flex items-center gap-2 rounded-full border border-[#00f5a0]/30 bg-[#00f5a0]/10 px-4 py-1 text-[11px] uppercase tracking-[0.26em] text-[#00f5a0]`}
          >
            Zero-Knowledge · Client-Side Encrypted
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#fbfaff] sm:text-4xl">
            Rewiring is an arc. Start yours with proof.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#b1acc7]">
            AXIOM is an honest, private companion built on real neuroscience. Free core forever: daily check-ins, guided breathing, urge panic tools, and your sealed journal.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/axiom/"
              className={`${MONO} rounded-xl bg-gradient-to-r from-[#8b7cf7] to-[#6c5ce7] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-[0_0_30px_rgba(108,92,231,0.5)] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,124,247,0.7)]`}
            >
              Get Axiom on iOS & Android
            </Link>
            <Link
              href="/axiom/tools/severity-test/"
              className={`${MONO} rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-[#edeaf5] backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/10`}
            >
              Take Free Severity Test
            </Link>
          </div>
        </motion.section>
      </main>

      {/* Minimal Studio Footer */}
      <footer className="relative border-t border-white/[0.06] bg-[#050407] py-12">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-8">
          <p className={`${MONO} text-[11px] uppercase tracking-[0.24em] text-[#7a7690]`}>
            AXIOM is built with craft by{' '}
            <Link href="/" className="text-[#c5bdfc] underline underline-offset-4 transition-colors hover:text-white">
              Luna Maze Studio
            </Link>
          </p>
          <p className="mt-3 text-xs text-[#524d67]">
            © {new Date().getFullYear()} Luna Maze. Grounded in neuroplasticity. Zero-knowledge by design.
          </p>
        </div>
      </footer>
    </div>
  );
}
