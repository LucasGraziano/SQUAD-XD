'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message === 'User already registered'
        ? 'Este correo ya está registrado. Inicia sesión.'
        : authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center animate-fade-in">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">¡Cuenta creada!</h1>
        <p className="text-foreground/60 mb-6">
          Revisa tu correo en <strong>{email}</strong> para confirmar tu cuenta.
        </p>
        <Link href="/auth/login">
          <Button className="w-full">Ir al inicio de sesión</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Zero Diastasis™</h1>
        <p className="text-foreground/60">Crea tu cuenta para acceder al protocolo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tu nombre" placeholder="Como te llamas"
          value={name} onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email" label="Tu correo electrónico"
          placeholder="nombre@ejemplo.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password" label="Contraseña (mínimo 8 caracteres)"
          placeholder="Tu contraseña"
          value={password} onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password" label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          required error={error}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/50 mt-6">
        ¿Ya tienes cuenta?{' '}
        <Link href="/auth/login" className="text-primary hover:text-primary-600 font-medium">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
