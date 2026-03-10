'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
          Revisa tu correo
        </h1>
        <p className="text-foreground/60 mb-6">
          Te enviamos un enlace mágico a <strong>{email}</strong>. Haz clic en el enlace para
          acceder.
        </p>
        <Button variant="ghost" onClick={() => setSent(false)}>
          Usar otro correo
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Zero Diastasis™</h1>
        <p className="text-foreground/60">Accede a tu protocolo de 28 días</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          label="Tu correo electrónico"
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={error}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace mágico'}
        </Button>
      </form>
    </div>
  );
}
