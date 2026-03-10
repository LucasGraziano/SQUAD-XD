'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const levels = [1, 2, 3, 4, 5] as const;

function LevelSelector({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground/80 mb-2">{label}</label>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
              value === level
                ? 'bg-primary text-white'
                : 'bg-secondary-100 text-foreground/60 hover:bg-secondary-200'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SymptomDiary() {
  const [energy, setEnergy] = useState(3);
  const [pain, setPain] = useState(0);
  const [bloating, setBloating] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch('/api/progress/symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        energy_level: energy,
        pain_level: pain,
        bloating,
        notes: notes || null,
      }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart size={20} className="text-primary" />
          <h2 className="font-heading font-bold text-foreground">Diario de síntomas</h2>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <LevelSelector label="Nivel de energía (1=baja, 5=alta)" value={energy} onChange={setEnergy} />
          <LevelSelector label="Dolor/molestia (0=nada, 5=mucho)" value={pain} onChange={setPain} />
          <LevelSelector label="Hinchazón (0=nada, 5=mucho)" value={bloating} onChange={setBloating} />

          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground/80 mb-1.5">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-secondary-300 bg-white text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="¿Cómo te sientes hoy?"
            />
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saved ? '¡Guardado!' : saving ? 'Guardando...' : 'Registrar síntomas'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
