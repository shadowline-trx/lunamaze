import { aboutCopy, buildingCopy } from '@/content/lunamaze';
import ScrollReveal from '@/components/ScrollReveal';

export default function StudioSection() {
  return (
    <section id="studio" className="lunamaze-defer relative py-20 sm:py-32 px-5 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <span className="block text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-4">
            The Studio
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-lunamaze-textPrimary mb-12 max-w-3xl">
            A studio for the work that lasts.
          </h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <ScrollReveal>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-lunamaze-violetLight">
                About Luna Maze
              </h3>
              <p className="text-lg text-lunamaze-textSecondary leading-relaxed">
                {aboutCopy}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-lunamaze-violetLight">
                What we&apos;re building
              </h3>
              <p className="text-lg text-lunamaze-textSecondary leading-relaxed">
                {buildingCopy}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
