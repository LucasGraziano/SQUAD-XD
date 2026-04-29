'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Ruler } from 'lucide-react';

export function MeasurementForm() {
  const [waist, setWaist] = useState('');
  const [fingers, setFingers] = useState('');
  const [weight, setWeight] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/progress/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waist_cm: waist ? parseFloat(waist) : null,
          diastasis_fingers: fingers ? parseFloat(fingers) : null,
          weight_kg: weight ? parseFloat(weight) : null,
        }),
      });

      if (!res.ok) throw new Error('Error al guardar');

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ruler size={20} className="text-primary" />
          <h2 className="font-heading font-bold text-foreground">Registrar medidas</h2>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            step="0.1"
            label="Cintura (cm)"
            placeholder="ej: 78.5"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
          />
          <Input
            type="number"
            step="0.5"
            label="Diástasis (dedos)"
            placeholder="ej: 2.5"
            helperText="Mide con el auto-test sobre el ombligo"
            value={fingers}
            onChange={(e) => setFingers(e.target.value)}
          />
          <Input
            type="number"
            step="0.1"
            label="Peso (kg) — opcional"
            placeholder="ej: 65.0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={saving}>
            {saved ? '¡Guardado!' : saving ? 'Guardando...' : 'Guardar medidas'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
