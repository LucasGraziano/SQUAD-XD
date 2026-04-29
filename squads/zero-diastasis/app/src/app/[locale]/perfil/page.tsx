'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthType, setBirthType] = useState('unknown');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '');
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              const profile = data as { full_name: string | null; birth_type: string | null };
              setName(profile.full_name || '');
              setBirthType(profile.birth_type || 'unknown');
            }
          });
      }
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await (supabase.from('profiles') as any).upsert({
        id: user.id,
        email: user.email,
        full_name: name,
        birth_type: birthType,
      });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Perfil</h1>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={20} className="text-primary" />
            <h2 className="font-heading font-bold text-foreground">Tu información</h2>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
            <Input label="Correo" value={email} disabled />

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                Tipo de parto
              </label>
              <select
                value={birthType}
                onChange={(e) => setBirthType(e.target.value)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-secondary-300 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="unknown">No especificado</option>
                <option value="natural">Parto natural</option>
                <option value="cesarean">Cesárea</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saved ? '¡Guardado!' : saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Acceso rápido */}
      <div className="mb-4 space-y-2">
        <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-2">Acceso rápido</h2>
        <a href="/loja" className="flex items-center justify-between p-4 bg-white rounded-xl border border-secondary-200 hover:border-primary-200 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛍️</span>
            <span className="font-medium text-foreground text-sm">Tienda de productos</span>
          </div>
          <span className="text-foreground/30">→</span>
        </a>
        <a href="/bonus" className="flex items-center justify-between p-4 bg-white rounded-xl border border-secondary-200 hover:border-primary-200 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎁</span>
            <span className="font-medium text-foreground text-sm">Mis bonuses</span>
          </div>
          <span className="text-foreground/30">→</span>
        </a>
      </div>

      <Button variant="ghost" className="w-full gap-2 text-red-500" onClick={handleSignOut}>
        <LogOut size={18} />
        Cerrar sesión
      </Button>
    </main>
  );
}
