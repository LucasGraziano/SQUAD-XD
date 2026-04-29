'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase sets session from URL hash on password recovery
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Mínimo 8 caracteres'); return; }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) { setError(authError.message); return; }
      setDone(true);
    } catch {
      setError('Error al actualizar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center animate-fade-in">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">¡Contraseña actualizada!</h1>
        <p className="text-foreground/60 mb-6">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <Link href="/auth/login">
          <Button className="w-full">Iniciar sesión</Button>
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="text-center animate-fade-in">
        <div className="text-5xl mb-4">🔗</div>
        <h1 className="text-xl font-heading font-bold text-foreground mb-3">Verificando enlace...</h1>
        <p className="text-foreground/60 text-sm">Asegúrate de abrir el enlace desde tu correo.</p>
        <Link href="/auth/forgot-password" className="block mt-6 text-sm text-primary hover:text-primary-600">
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Nueva contraseña</h1>
        <p className="text-foreground/60 text-sm">Elige una contraseña segura de mínimo 8 caracteres</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password" label="Nueva contraseña"
          placeholder="Mínimo 8 caracteres"
          value={password} onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password" label="Confirmar contraseña"
          placeholder="Repite tu nueva contraseña"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          required error={error}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
        </Button>
      </form>
    </div>
  );
}
