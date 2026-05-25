'use client';

import ScrollReveal from './ScrollReveal';
import { motion } from 'framer-motion';

const phases = [
  {
    phase: 'Phase 1',
    days: 'Days 1–7',
    title: 'Foundation',
    description: 'Start with fundamentals: cold showers, short walks, gratitude journaling, and digital detox. Build your first streak and feel the initial dopamine reset.',
    missions: ['Cold Shower 30s', 'Walk 15 min', '3 Gratitudes', 'No Social Media 1hr'],
    color: 'bg-axiom-primary/20 text-axiom-primaryLight',
    border: 'border-axiom-primary/20',
  },
  {
    phase: 'Phase 2',
    days: 'Days 8–30',
    title: 'Momentum',
    description: 'Level up your habits: longer cold exposure, reading, workouts, and real human connection. Your brain begins forming new neural pathways.',
    missions: ['Cold Shower 60s', 'Read 20 min', '15-min Workout', 'Box Breathing'],
    color: 'bg-axiom-streak/20 text-axiom-streak',
    border: 'border-axiom-streak/20',
  },
  {
    phase: 'Phase 3',
    days: 'Days 31–60',
    title: 'Discipline',
    description: 'Deepen your practice: 10-minute meditations, intentional cooking, new skill learning, and consistent sleep schedules. The rewiring accelerates.',
    missions: ['Cold Shower 90s', '10-min Meditation', 'Cook a Meal', 'Sleep before 11 PM'],
    color: 'bg-axiom-calm/20 text-axiom-calm',
    border: 'border-axiom-calm/20',
  },
  {
    phase: 'Phase 4',
    days: 'Day 61+',
    title: 'Mastery',
    description: 'You are transformed. Full workouts, helping others, writing to your future self, and mastering early mornings. Your brain is now wired for excellence.',
    missions: ['Cold Shower 2 min', 'Help Someone', 'Letter to Future Self', 'Wake before 7 AM'],
    color: 'bg-axiom-amber/20 text-axiom-amber',
    border: 'border-axiom-amber/20',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-axiom-primaryLight font-medium tracking-wide mb-6">
            The Protocol
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Four phases to{' '}
            <span className="gradient-text">total transformation</span>
          </h2>
          <p className="text-lg text-axiom-textSecondary max-w-2xl mx-auto">
            Axiom adapts to your recovery stage. Each phase introduces progressively
            challenging missions that rebuild your dopamine system from the ground up.
          </p>
        </ScrollReveal>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-axiom-primary/50 via-axiom-streak/50 to-axiom-amber/50 hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {phases.map((phase, index) => (
              <ScrollReveal key={index} delay={index * 0.15}>
                <div className={`relative lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-axiom-bgSurface border-2 border-axiom-primary z-10 items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-axiom-primary" />
                  </div>

                  {/* Content */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`glass rounded-2xl p-8 border ${phase.border}`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${phase.color}`}>
                          {phase.phase}
                        </span>
                        <span className="text-axiom-textDim text-sm">{phase.days}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-axiom-textPrimary mb-3">
                        {phase.title}
                      </h3>

                      <p className="text-axiom-textSecondary leading-relaxed mb-6">
                        {phase.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {phase.missions.map((mission, mi) => (
                          <span
                            key={mi}
                            className="px-3 py-1.5 rounded-lg bg-axiom-bgSurface border border-axiom-border text-xs text-axiom-textSecondary"
                          >
                            {mission}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className={index % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
