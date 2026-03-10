'use client';

import NavHeader from '@/components/landing/NavHeader';
import HeroSection from '@/components/landing/HeroSection';
import SocialProofSection from '@/components/landing/SocialProofSection';
import MechanismSection from '@/components/landing/MechanismSection';
import ResultsSection from '@/components/landing/ResultsSection';
import ProtocolSection from '@/components/landing/ProtocolSection';
import ForYouSection from '@/components/landing/ForYouSection';
import ValueStackSection from '@/components/landing/ValueStackSection';
import TrustBadges from '@/components/landing/TrustBadges';
import GuaranteeSection from '@/components/landing/GuaranteeSection';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/landing/Footer';
import StickyBar from '@/components/ui/StickyBar';

export default function OfertaPage() {
  return (
    <>
      <NavHeader />
      <main id="main-content" className="min-h-screen bg-warm">
        <HeroSection />
        <SocialProofSection />
        <MechanismSection />
        <ResultsSection />
        <ProtocolSection />
        <ForYouSection />
        <ValueStackSection />
        <TrustBadges />
        <GuaranteeSection />
        <FAQSection />
        <FinalCTASection />
        <Footer />
        <StickyBar />
      </main>
    </>
  );
}
