import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Vínculo — Plataforma Clínica para Psicólogos',
    template: '%s | Vínculo',
  },
  description:
    'Você cuida das pessoas. A gente cuida de você. Prontuário inteligente, agenda automatizada e alertas de risco de abandono para psicólogos clínicos.',
  keywords: ['psicólogo', 'prontuário eletrônico', 'gestão de consultório', 'agenda psicólogo', 'sistema psicologia'],
  authors: [{ name: 'Vínculo' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://vinculo.app'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Vínculo',
  },
}

export const viewport: Viewport = {
  themeColor: '#1A4A5A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-neutral-off-white text-neutral-charcoal font-sans antialiased">{children}</body>
    </html>
  )
}
