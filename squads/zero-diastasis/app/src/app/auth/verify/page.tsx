'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function VerifyContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (token_hash && type === 'magiclink') {
      const supabase = createClient();
      supabase.auth
        .verifyOtp({ token_hash, type: 'magiclink' })
        .then(({ data, error }) => {
          if (error) {
            setStatus('error');
          } else {
            const locale = data.user?.user_metadata?.locale || 'es';
            window.location.href = `/${locale}`;
          }
        })
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  if (status === 'error') {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
          Enlace inválido
        </h1>
        <p className="text-foreground/60 mb-4">
          El enlace ha expirado o es inválido. Por favor, solicita uno nuevo.
        </p>
        <a
          href="/auth/login"
          className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-primary text-white font-semibold"
        >
          Solicitar nuevo enlace
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-foreground/60">Verificando...</p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Cargando...</p>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
