import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_PATHS = ['/auth/login', '/auth/verify', '/auth/callback', '/api/webhook'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let auth and webhook routes pass through without i18n
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return updateSession(request);
  }

  // Apply i18n middleware first
  const intlResponse = intlMiddleware(request);

  // Refresh Supabase session
  await updateSession(request);

  return intlResponse;
}

export const config = {
  matcher: ['/', '/(es|pt)/:path*', '/auth/:path*', '/api/webhook'],
};
