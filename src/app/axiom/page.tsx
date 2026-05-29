import NeuralOrb from '@/components/NeuralOrb';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PremiumSection from '@/components/PremiumSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import GridDistortion from '@/components/backgrounds/GridDistortion';

export default function AxiomPage() {
  return (
    <main className="relative min-h-screen bg-axiom-bgDeep">
      <NeuralOrb />
      <Navbar />
      <div className="relative z-10">
        <HeroSection />
        <div className="grid-bg noise-overlay relative">
          <GridDistortion density={18} intensity={0.35} />
          <div className="relative z-10">
            <FeaturesSection />
          </div>
        </div>
        <section id="protocol">
          <HowItWorksSection />
        </section>
        <PremiumSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
