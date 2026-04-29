'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (authError) { setError(authError.message); return; }
      setSent(true);
    } catch {
      setError('Sin conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center animate-fade-in">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Revisa tu correo</h1>
        <p className="text-foreground/60 mb-6">
          Enviamos un enlace para restablecer tu contraseña a <strong>{email}</strong>.
        </p>
        <Link href="/auth/login">
          <Button variant="secondary" className="w-full">Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">¿Olvidaste tu contraseña?</h1>
        <p className="text-foreground/60 text-sm">Te enviamos un enlace para restablecerla</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email" label="Tu correo electrónico"
          placeholder="nombre@ejemplo.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          required error={error}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </Button>
      </form>
      <p className="text-center text-sm text-foreground/50 mt-6">
        <Link href="/auth/login" className="text-primary hover:text-primary-600 font-medium">
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}
