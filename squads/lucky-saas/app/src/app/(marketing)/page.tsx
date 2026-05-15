import { Navbar } from '@/components/marketing/Navbar'
import { Hero } from '@/components/marketing/Hero'
import { MetricsBar } from '@/components/marketing/MetricsBar'
import { Features } from '@/components/marketing/Features'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { SocialProof } from '@/components/marketing/SocialProof'
import { Integrations } from '@/components/marketing/Integrations'
import { RoiSection } from '@/components/marketing/RoiSection'
import { Pricing } from '@/components/marketing/Pricing'
import { FAQ } from '@/components/marketing/FAQ'
import { CtaFinal } from '@/components/marketing/CtaFinal'
import { Footer } from '@/components/marketing/Footer'

export const metadata = {
  title: 'Premia — Nunca perca uma renovação',
  description: 'O sistema de gestão para corretores SUSEP. Pipeline de leads, alertas de renovação e controle de comissões. Comece grátis.',
  openGraph: {
    title: 'Premia — Nunca perca uma renovação',
    description: 'O sistema de gestão para corretores SUSEP. Pipeline de leads, alertas de renovação e controle de comissões. Comece grátis.',
    type: 'website',
    siteName: 'Premia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premia — Nunca perca uma renovação',
    description: 'O sistema de gestão para corretores SUSEP. Pipeline de leads, alertas de renovação e controle de comissões. Comece grátis.',
  },
  alternates: {
    canonical: '/',
  },
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MetricsBar />
        <Features />
        <HowItWorks />
        <SocialProof />
        <Integrations />
        <RoiSection />
        <Pricing />
        <FAQ />
        <CtaFinal />
      </main>
      <Footer />
    </>
  )
}
