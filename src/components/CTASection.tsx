'use client';

import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.axiomapp.app&hl=en_IN';

export default function CTASection() {
  return (
    <section
      id="download"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-axiom-primary/10 blur-[150px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            Your brain is waiting.
            <br />
            <span className="gradient-text">Start today.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-lg sm:text-xl text-axiom-textSecondary max-w-2xl mx-auto mb-12">
            Axiom is live on Google Play and free to start. No iOS build yet —
            we&apos;ll get there. Your truth. Daily.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-axiom-textPrimary text-axiom-bgDeep font-semibold text-lg hover:bg-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3.609 1.814L13.792 12 3.61 22.186c-.185.185-.43.29-.692.29-.264 0-.51-.105-.693-.29l-.002-.002c-.186-.186-.29-.433-.29-.696V2.5c0-.263.104-.51.29-.696l.002-.002c.37-.37.973-.37 1.343 0l.001.001zm1.795 1.016l7.763 7.17L5.404 17.17V2.83zm10.88 8.136l2.697 2.49L5.604 21.16l-.001.001 10.88-10.194zm2.353-2.353l2.49 2.697-2.49-2.697z" />
              </svg>
              Get it on Google Play
            </motion.a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.45}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-axiom-textDim text-sm">
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-axiom-streak"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
              No ads
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-axiom-streak"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              Privacy first
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-axiom-streak"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
              Built on real research
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
