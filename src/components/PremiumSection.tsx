'use client';

import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const premiumFeatures = [
  'Unlimited daily missions',
  'Brain Rewire Map visualization',
  'Dopamine Score tracking',
  'Cold Exposure Timer',
  'Ambient Soundscapes library',
  'Streak multiplier bonuses',
  'Priority community access',
  'Exclusive badge collection',
];

export default function PremiumSection() {
  return (
    <section id="premium" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-axiom-amber font-medium tracking-wide mb-6">
            Axiom Premium
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Unlock your{' '}
            <span className="gradient-text">full potential</span>
          </h2>
          <p className="text-lg text-axiom-textSecondary max-w-2xl mx-auto">
            Free users get 1 mission per day. Premium unlocks the complete Axiom protocol.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ScrollReveal delay={0.1}>
            <div className="glass rounded-2xl p-8 border border-axiom-border/50 h-full">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-axiom-textPrimary mb-2">Free</h3>
                <p className="text-axiom-textSecondary text-sm">Start your recovery journey</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-axiom-textPrimary">$0</span>
                <span className="text-axiom-textDim">/forever</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-axiom-textSecondary text-sm">
                  <svg className="w-5 h-5 text-axiom-streak flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
                  1 mission per day
                </li>
                <li className="flex items-center gap-3 text-axiom-textSecondary text-sm">
                  <svg className="w-5 h-5 text-axiom-streak flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Basic streak tracking
                </li>
                <li className="flex items-center gap-3 text-axiom-textSecondary text-sm">
                  <svg className="w-5 h-5 text-axiom-streak flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Breathe exercises
                </li>
                <li className="flex items-center gap-3 text-axiom-textSecondary text-sm">
                  <svg className="w-5 h-5 text-axiom-streak flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Knowledge Library
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <motion.div
              whileHover={{ y: -4 }}
              className="relative rounded-2xl p-8 border border-axiom-primary/30 bg-gradient-to-b from-axiom-primary/10 to-transparent overflow-hidden"
            >
              <div className="absolute top-0 right-0 px-4 py-1 bg-axiom-primary text-axiom-bgDeep text-xs font-bold rounded-bl-xl">
                RECOMMENDED
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-axiom-textPrimary mb-2">Premium</h3>
                <p className="text-axiom-textSecondary text-sm">The complete protocol</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold gradient-text">$4.99</span>
                <span className="text-axiom-textDim">/month</span>
                <p className="text-sm text-axiom-streak mt-1">Or $29.99/year — save 50%</p>
              </div>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-axiom-textSecondary text-sm">
                    <svg className="w-5 h-5 text-axiom-primaryLight flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl bg-axiom-primary text-axiom-bgDeep font-semibold hover:bg-axiom-primaryLight transition-colors glow-primary">
                Get Premium
              </button>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
