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
    badge: 'bg-[#8b7cf7]/15 text-[#c5bdfc] border-[#8b7cf7]/30',
    border: 'hover:border-[#8b7cf7]/50',
    glow: 'from-[#8b7cf7]/15 to-transparent',
    text: 'text-[#c5bdfc]',
  },
  'Quitting & Tools': {
    badge: 'bg-[#00f5a0]/15 text-[#00f5a0] border-[#00f5a0]/30',
    border: 'hover:border-[#00f5a0]/50',
    glow: 'from-[#00f5a0]/15 to-transparent',
    text: 'text-[#00f5a0]',
  },
  'Psychology & Symptoms': {
    badge: 'bg-[#38bdf8]/15 text-[#7dd3fc] border-[#38bdf8]/30',
    border: 'hover:border-[#38bdf8]/50',
    glow: 'from-[#38bdf8]/15 to-transparent',
    text: 'text-[#7dd3fc]',
  },
  'Privacy & Law': {
    badge: 'bg-[#fbbf24]/15 text-[#fde68a] border-[#fbbf24]/30',
    border: 'hover:border-[#fbbf24]/50',
    glow: 'from-[#fbbf24]/15 to-transparent',
    text: 'text-[#fde68a]',
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
        <div className="absolute -top-[25vw] left-1/2 h-[65vw] w-[65vw] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#6c5ce7]/20 to-[#8b7cf7]/5 blur-[100px] sm:blur-[140px] opacity-70 animate-pulse duration-[8000ms]" />

        {/* Mint reward glow subtle orb (right side) */}
        <div className="absolute top-[35vh] -right-[20vw] h-[50vw] w-[50vw] rounded-full bg-[#00f5a0]/10 blur-[120px] sm:blur-[160px] opacity-40" />

        {/* Subtle grid cage */}
        <div className="ax-cage absolute inset-0 opacity-20 sm:opacity-25" />
        <div className="ax-shafts opacity-15 sm:opacity-20" />
      </div>

      {/* Fixed Frosted Header Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07060a]/80 backdrop-blur-xl transition-all duration-300">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-8 sm:py-4">
          <Link href="/axiom/" className="group flex items-center gap-3">
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-[0_0_20px_rgba(108,92,231,0.3)] transition-transform duration-300 group-hover:scale-105">
              <img
                src={internalUrl('/images/axiom/logo.webp')}
                alt="Axiom Logo"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className={`${MONO} text-xs sm:text-sm font-semibold tracking-[0.32em] text-[#f2f1f7] transition-colors group-hover:text-white`}>
                AXIOM
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest text-[#7a7690] uppercase">Neuroscience FAQ</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/axiom/tools/"
              className={`${MONO} hidden text-[11px] uppercase tracking-[0.2em] text-[#9b98ad] transition-colors hover:text-[#00f5a0] md:inline-block`}
            >
              Free Tools
            </Link>
            <Link
              href="/axiom/blog/"
              className={`${MONO} hidden text-[11px] uppercase tracking-[0.2em] text-[#9b98ad] transition-colors hover:text-[#c5bdfc] md:inline-block`}
            >
              Research Library
            </Link>
            <Link
              href="/axiom/"
              className={`${MONO} flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#c9c6d8] backdrop-blur-md transition-all duration-200 hover:border-[#8b7cf7]/50 hover:bg-[#8b7cf7]/15 hover:text-white active:scale-95`}
            >
              <span>← App</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content Stage */}
      <main className="relative mx-auto max-w-5xl px-4 pb-36 pt-24 sm:px-8 sm:pt-36">
        {/* Breadcrumb path */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-label="Breadcrumb"
          className={`${MONO} mb-4 sm:mb-6 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#7a7690]`}
        >
          <Link href="/" className="hover:text-[#edeaf5] transition-colors">Luna Maze</Link>
          <span>/</span>
          <Link href="/axiom/" className="hover:text-[#edeaf5] transition-colors">Axiom</Link>
          <span>/</span>
          <span className="text-[#c5bdfc]">Clinical FAQ</span>
        </motion.nav>

        {/* Hero Header Section */}
        <div className="relative">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`${MONO} mb-4 inline-flex items-center gap-2 rounded-full border border-[#8b7cf7]/30 bg-[#8b7cf7]/10 px-3.5 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c5bdfc] backdrop-blur-md shadow-[0_0_25px_rgba(139,124,247,0.2)]`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00f5a0] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00f5a0]" />
            </span>
            Clinical Evidence & Recovery Protocol
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[2.2rem] leading-[1.08] tracking-[-0.035em] text-[#fbfaff] sm:text-5xl md:text-6xl"
          >
            The Neuroscience of Rewiring.
            <br />
            <span className="ax-serif font-normal italic bg-gradient-to-r from-[#9d8ffb] via-[#c5bdfc] to-[#00f5a0] bg-clip-text text-transparent">
              Answered with proof.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 sm:mt-6 max-w-3xl text-base leading-relaxed text-[#a5a0be] sm:text-lg"
          >
            Clear, research-backed answers to the most searched questions on compulsive viewing,
            dopamine receptor restoration, withdrawal flatlines, and zero-knowledge privacy.
            No shame, no pseudo-science.
          </motion.p>
        </div>

        {/* Cinematic 4-Pillar Stat Rail (Optimized for Mobile Grids) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 sm:mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4"
        >
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-[#8b7cf7]/40 hover:bg-[#8b7cf7]/[0.04]">
            <div className={`${MONO} text-xl sm:text-3xl font-bold tracking-tight text-[#c5bdfc]`}>
              60–90d
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[#8983a3] leading-snug">
              Dopamine D2 Receptor Normalization Arc
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-[#00f5a0]/40 hover:bg-[#00f5a0]/[0.04]">
            <div className={`${MONO} text-xl sm:text-3xl font-bold tracking-tight text-[#00f5a0]`}>
              0 Bytes
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[#8983a3] leading-snug">
              Readable Journal Data Sent to Cloud
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-[#38bdf8]/40 hover:bg-[#38bdf8]/[0.04]">
            <div className={`${MONO} text-xl sm:text-3xl font-bold tracking-tight text-[#7dd3fc]`}>
              ICD-11
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[#8983a3] leading-snug">
              Code 6C72 WHO Clinical Diagnosis
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-[#fbbf24]/40 hover:bg-[#fbbf24]/[0.04]">
            <div className={`${MONO} text-xl sm:text-3xl font-bold tracking-tight text-[#fde68a]`}>
              100% Free
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[#8983a3] leading-snug">
              Permanent Panic, Check-in & Breathing Tools
            </p>
          </div>
        </motion.div>

        {/* Interactive Search & Swipeable Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 sm:mt-14 space-y-4 rounded-2xl sm:rounded-3xl border border-white/[0.09] bg-[#0d0a17]/95 p-4 sm:p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Search bar (16px font prevents iOS zoom on focus) */}
          <div className="relative flex items-center">
            <svg
              className="absolute left-3.5 sm:left-4.5 h-4.5 w-4.5 text-[#8983a3]"
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
              placeholder="Search dopamine, flatline, PIED, tracking..."
              className="w-full rounded-xl sm:rounded-2xl border border-white/[0.08] bg-black/40 py-3 pl-10 pr-10 text-[16px] sm:text-sm text-[#f2f1f7] placeholder-[#635f79] outline-none transition-all duration-200 focus:border-[#8b7cf7] focus:bg-black/60 focus:ring-2 focus:ring-[#8b7cf7]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-[#8983a3] hover:text-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Swipeable Category Chips on Mobile */}
          <div className="flex flex-col gap-3 pt-1">
            <div className="-mx-4 flex overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0 scrollbar-none gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`${MONO} shrink-0 rounded-xl px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] transition-all duration-200 active:scale-95 touch-manipulation ${
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

            {/* Quick Bulk Expand Controls */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-[#7a7690]`}>
                {filteredFaqs.length} answers
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={expandAll}
                  className={`${MONO} text-[10px] uppercase tracking-[0.16em] text-[#7a7690] hover:text-[#00f5a0] p-1`}
                >
                  Expand all
                </button>
                <span className="text-[#3c3852]">·</span>
                <button
                  onClick={collapseAll}
                  className={`${MONO} text-[10px] uppercase tracking-[0.16em] text-[#7a7690] hover:text-[#e8e6f0] p-1`}
                >
                  Collapse all
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="mt-6 space-y-3.5 sm:space-y-4">
          <AnimatePresence>
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-12 text-center"
              >
                <p className="text-base sm:text-lg font-medium text-[#edeaf5]">No answers match your search.</p>
                <p className="mt-2 text-xs sm:text-sm text-[#8983a3]">
                  Try searching for terms like &ldquo;dopamine&rdquo;, &ldquo;flatline&rdquo;, &ldquo;PIED&rdquo;, &ldquo;tracking&rdquo;, or &ldquo;India&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className={`${MONO} mt-5 rounded-xl border border-[#8b7cf7]/40 bg-[#8b7cf7]/15 px-4 py-2 text-[11px] uppercase tracking-widest text-[#c5bdfc]`}
                >
                  Reset filters
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
                    transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.25) }}
                    className={`group relative overflow-hidden rounded-2xl border bg-[#0b0814]/90 backdrop-blur-xl transition-all duration-200 ${
                      isExpanded
                        ? 'border-[#8b7cf7]/45 shadow-[0_10px_35px_-10px_rgba(108,92,231,0.3)]'
                        : 'border-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    {/* Top gradient glow line on expanded */}
                    {isExpanded && (
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8b7cf7] to-transparent opacity-90" />
                    )}

                    {/* Question Clickable Header with ergonomic tap area */}
                    <button
                      onClick={() => toggleExpand(item.id)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-start justify-between gap-3 p-5 sm:p-7 text-left outline-none touch-manipulation active:bg-white/[0.02]"
                    >
                      <div className="space-y-2 pr-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`${MONO} inline-block rounded-md border px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] ${styling.badge}`}
                          >
                            {item.category}
                          </span>
                          <span className={`${MONO} text-[10px] text-[#55506c]`}>Q{index + 1}</span>
                        </div>

                        <h2 className="text-base sm:text-xl font-semibold tracking-[-0.015em] text-[#f6f5fa] transition-colors group-hover:text-white leading-snug">
                          {item.question}
                        </h2>

                        {!isExpanded && (
                          <p className="text-xs sm:text-sm text-[#8983a3] line-clamp-1 leading-relaxed">
                            {item.shortAnswer}
                          </p>
                        )}
                      </div>

                      {/* Expand indicator icon (min 36px touch target) */}
                      <div
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isExpanded
                            ? 'border-[#8b7cf7]/50 bg-[#8b7cf7]/25 text-[#c5bdfc] rotate-180'
                            : 'border-white/10 bg-white/[0.03] text-[#8983a3] group-hover:border-white/20 group-hover:text-white'
                        }`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
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
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.06] p-5 sm:p-7 pt-3.5 sm:pt-5 space-y-4 sm:space-y-5">
                            {/* Key Takeaway Callout */}
                            <div className="rounded-xl border border-[#8b7cf7]/20 bg-[#8b7cf7]/[0.08] p-3.5 sm:p-4.5">
                              <p className={`${MONO} text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#c5bdfc] font-semibold`}>
                                Key Neurobiological Takeaway
                              </p>
                              <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-[#edeaf5]">
                                {item.shortAnswer}
                              </p>
                            </div>

                            {/* Detailed Explanation */}
                            <div className="space-y-2">
                              <p className={`${MONO} text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#7a7690]`}>
                                In-Depth Analysis & Mechanism
                              </p>
                              <p className="text-xs sm:text-base leading-relaxed text-[#b1acc7]">
                                {item.detailedAnswer}
                              </p>
                            </div>

                            {/* Scientific References */}
                            {item.reference && (
                              <div className="flex items-start gap-2 rounded-lg border border-white/[0.05] bg-black/40 p-3 text-[11px] sm:text-xs text-[#8983a3]">
                                <span className={`${MONO} text-[9px] sm:text-[10px] uppercase text-[#c5bdfc] font-semibold shrink-0`}>
                                  Source:
                                </span>
                                <span className="italic leading-snug">{item.reference}</span>
                              </div>
                            )}

                            {/* Tool / Solution link (Full width touch button on mobile) */}
                            {item.toolLink && (
                              <div className="pt-1">
                                <Link
                                  href={item.toolLink.href}
                                  className="group/link flex sm:inline-flex items-center justify-center sm:justify-start gap-2 rounded-xl border border-[#00f5a0]/35 bg-[#00f5a0]/10 px-4 py-3 sm:py-2.5 text-xs font-semibold text-[#00f5a0] transition-all duration-200 hover:border-[#00f5a0]/60 hover:bg-[#00f5a0]/20 hover:shadow-[0_0_20px_rgba(0,245,160,0.25)] active:scale-95 touch-manipulation"
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

        {/* Master CTA Hero Box ("The Dawn Resolution" - Smartphone Optimized) */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 sm:mt-28 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#8b7cf7]/35 bg-gradient-to-b from-[#181335] via-[#0f0c22] to-[#07060a] p-6 sm:p-14 text-center shadow-[0_0_100px_-20px_rgba(108,92,231,0.35)]"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(108,92,231,0.25)_0%,transparent_70%)]" />

          <div
            className={`${MONO} mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#00f5a0]/30 bg-[#00f5a0]/10 px-3.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[#00f5a0]`}
          >
            Zero-Knowledge · Client-Side Encrypted
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-[#fbfaff] sm:text-4xl leading-tight">
            Rewiring is an arc. Start yours with proof.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-base leading-relaxed text-[#b1acc7]">
            AXIOM is an honest, private companion built on real neuroscience. Free core forever: daily check-ins, guided breathing, urge panic tools, and your sealed journal.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/axiom/"
              className={`${MONO} w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#8b7cf7] to-[#6c5ce7] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(108,92,231,0.5)] transition-all duration-200 active:scale-95`}
            >
              Get Axiom for iOS & Android
            </Link>
            <Link
              href="/axiom/tools/severity-test/"
              className={`${MONO} w-full sm:w-auto rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-[#edeaf5] backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-95`}
            >
              Take Free Severity Test
            </Link>
          </div>
        </motion.section>
      </main>

      {/* Minimal Studio Footer */}
      <footer className="relative border-t border-white/[0.06] bg-[#050407] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-8">
          <p className={`${MONO} text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#7a7690]`}>
            AXIOM is built with craft by{' '}
            <Link href="/" className="text-[#c5bdfc] underline underline-offset-4 transition-colors hover:text-white">
              Luna Maze Studio
            </Link>
          </p>
          <p className="mt-2 text-[10px] sm:text-xs text-[#524d67]">
            © {new Date().getFullYear()} Luna Maze. Grounded in neuroplasticity. Zero-knowledge by design.
          </p>
        </div>
      </footer>
    </div>
  );
}
