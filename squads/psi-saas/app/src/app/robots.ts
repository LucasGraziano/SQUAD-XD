import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vinculo.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/termos', '/privacidade', '/register', '/login'],
        disallow: ['/dashboard', '/agenda', '/pacientes', '/prontuario', '/alertas', '/financeiro', '/configuracoes', '/planos', '/linhagem', '/onboarding', '/intake', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
