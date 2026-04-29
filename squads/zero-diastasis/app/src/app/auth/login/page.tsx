'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Mode = 'magic' | 'password';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) { setError(authError.message); return; }
      setSent(true);
    } catch {
      setError('Sin conexión con el servidor. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos'
          : authError.message);
        return;
      }
      window.location.href = '/es';
    } catch {
      setError('Sin conexión con el servidor. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center animate-fade-in">
        <div className="text-5xl mb-4">✉️</div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Revisa tu correo</h1>
        <p className="text-foreground/60 mb-6">
          Te enviamos un enlace mágico a <strong>{email}</strong>. Haz clic en el enlace para acceder.
        </p>
        <Button variant="ghost" onClick={() => setSent(false)}>Usar otro correo</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Zero Diastasis™</h1>
        <p className="text-foreground/60">Accede a tu protocolo de 28 días</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-secondary-100 rounded-xl p-1 mb-6">
        {(['magic', 'password'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={cn(
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              mode === m ? 'bg-white text-foreground shadow-sm' : 'text-foreground/50 hover:text-foreground/70',
            )}
          >
            {m === 'magic' ? '✨ Enlace mágico' : '🔑 Contraseña'}
          </button>
        ))}
      </div>

      {mode === 'magic' ? (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <Input
            type="email" name="email" label="Tu correo electrónico"
            placeholder="nombre@ejemplo.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            required error={error}
          />
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace mágico'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePassword} className="space-y-4">
          <Input
            type="email" name="email" label="Tu correo electrónico"
            placeholder="nombre@ejemplo.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password" name="password" label="Contraseña"
            placeholder="Tu contraseña"
            value={password} onChange={(e) => setPassword(e.target.value)}
            required error={error}
          />
          <div className="text-right -mt-2">
            <Link href="/auth/forgot-password" className="text-xs text-foreground/50 hover:text-primary transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-foreground/50 mt-6">
        ¿No tienes cuenta?{' '}
        <Link href="/auth/register" className="text-primary hover:text-primary-600 font-medium">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
