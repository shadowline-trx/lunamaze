import type { Metadata } from 'next';
import LunaNavbar from '@/components/lunamaze/LunaNavbar';
import LunaHero from '@/components/lunamaze/LunaHero';
import StudioSection from '@/components/lunamaze/StudioSection';
import ProductsGrid from '@/components/lunamaze/ProductsGrid';
import CapabilitiesSection from '@/components/lunamaze/CapabilitiesSection';
import FounderSection from '@/components/lunamaze/FounderSection';
import ContactSection from '@/components/lunamaze/ContactSection';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import DotGrid from '@/components/backgrounds/DotGrid';
import { products, capabilities } from '@/content/lunamaze';

export const metadata: Metadata = {
  title: 'Luna Maze — Independent Product Studio',
  description:
    'Luna Maze is an independent product studio building premium tools at the intersection of cognition, focus, and craft. Founder-led. Considered. Quiet on purpose.',
  openGraph: {
    title: 'Luna Maze — Independent Product Studio',
    description:
      'Premium tools at the intersection of cognition, focus, and craft. Home of Axiom.',
    type: 'website',
  },
};

export default function LunaMazePage() {
  return (
    <div className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <LunaNavbar />
      <main>
        <LunaHero />
        <div className="lunamaze-grid-bg lunamaze-noise relative">
          <DotGrid />
          <div className="relative z-10">
            <StudioSection />
            <ProductsGrid products={products} />
            <CapabilitiesSection items={capabilities} />
          </div>
        </div>
        <FounderSection />
        <ContactSection />
      </main>
      <LunaFooter />
    </div>
  );
}
