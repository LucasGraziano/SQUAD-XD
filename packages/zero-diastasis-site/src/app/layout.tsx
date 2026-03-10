import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://zerodiastasis.com'),
  title: 'Zero Diastasis™ — Tu Protocolo de Recuperación en 28 Días',
  description:
    'El protocolo de bienestar abdominal postparto que reactiva tu músculo profundo en 28 días. Sin ejercicios agresivos. Sin equipos. Desde tu casa.',
  openGraph: {
    title: 'Zero Diastasis™ — Recupera Tu Abdomen en 28 Días',
    description:
      'Protocolo de bienestar postparto con audio-guías diarias de 12 minutos. 5,234+ mamás ya lo usan.',
    type: 'website',
    locale: 'es_LA',
    images: [
      {
        url: '/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Zero Diastasis — Tu barriga de mamá NO es gordura. Es un músculo dormido.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero Diastasis™ — Recupera Tu Abdomen en 28 Días',
    description: 'Protocolo de bienestar postparto. Solo 8-12 min/día.',
    images: ['/images/og-image.webp'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFAF5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
