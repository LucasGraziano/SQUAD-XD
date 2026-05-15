import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { PostHogInit } from '@/components/shared/PostHogInit'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Premia — Gestão para Corretores de Seguros',
  description: 'O sistema feito por corretor para corretor. Nunca perca uma renovação, sempre saiba quanto vai receber.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D0D0D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-ui antialiased">
        <PostHogInit />
        {children}
      </body>
    </html>
  )
}
