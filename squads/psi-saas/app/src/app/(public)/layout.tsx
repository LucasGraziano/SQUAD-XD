import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vinculo.app'

export const metadata: Metadata = {
  title: {
    default: 'Vínculo — Sistema clínico com alerta de abandono para psicólogos',
    template: '%s | Vínculo',
  },
  description:
    'O único SaaS clínico que detecta os 7 sinais de abandono antes que o paciente desapareça. Prontuário criptografado, agenda, cobrança e alertas de risco — 14 dias grátis.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Vínculo',
    title: 'Vínculo — Seu paciente dá 7 sinais antes de abandonar a terapia',
    description:
      'O primeiro sistema que avisa antes do desaparecimento. Prontuário, agenda e cobrança para psicólogos brasileiros — CFP-compliant, LGPD-ready.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vínculo — Sistema de gestão clínica com alerta de abandono',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vínculo — Alerta de abandono para psicólogos',
    description:
      'Detecte os sinais de abandono antes que o paciente desapareça. Prontuário, agenda, cobrança. 14 dias grátis.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
