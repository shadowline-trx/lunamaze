'use client';

import { useEffect, useState } from 'react';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.axiomapp.app&hl=en_IN';

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background gradient orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(108, 92, 231, 0.4) 0%, rgba(108, 92, 231, 0.1) 50%, transparent 70%)',
          transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-axiom-primaryLight font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-axiom-streak animate-pulse" />
            Habit Tracker for Brain Recovery
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1] animate-fade-in-up animate-delay-1">
          <span className="gradient-text">Your truth.</span>
          <br />
          <span className="text-axiom-textPrimary">Daily.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-axiom-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animate-delay-2">
          Axiom is a habit tracker engineered for brain recovery. Build
          unbreakable streaks, rewire your neural pathways, and reclaim
          your focus with science-backed missions.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-delay-3">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 rounded-xl bg-axiom-primary text-axiom-bgDeep font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 glow-primary"
          >
            <span className="relative z-10">Get Axiom on Google Play</span>
            <div className="absolute inset-0 bg-gradient-to-r from-axiom-primaryLight to-axiom-streak opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <a
            href="#features"
            className="px-8 py-4 rounded-xl glass text-axiom-textPrimary font-semibold text-lg transition-all duration-300 hover:bg-axiom-bgSurface hover:border-axiom-primary/30"
          >
            Explore Features
          </a>
        </div>

        {/* Honest status row — early stage, no inflated metrics */}
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-fade-in-up animate-delay-4">
          {[
            { value: 'Live', label: 'On Google Play' },
            { value: 'Early', label: 'Adopters Welcome' },
            { value: 'Solo', label: 'Founder-built' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl sm:text-2xl font-semibold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-axiom-textDim uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-axiom-border flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-axiom-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
}
