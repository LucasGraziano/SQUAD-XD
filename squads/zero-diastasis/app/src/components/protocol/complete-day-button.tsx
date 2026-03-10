'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Celebration } from './celebration';

type CompleteDayButtonProps = {
  dayNumber: number;
  isCompleted: boolean;
};

export function CompleteDayButton({ dayNumber, isCompleted }: CompleteDayButtonProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  async function handleComplete() {
    if (completed || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber }),
      });

      if (res.ok) {
        setCompleted(true);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);
      }
    } catch {
      // silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <>
        <Celebration show={showCelebration} />
        <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-xl text-green-700">
          <CheckCircle size={20} />
          <span className="font-semibold">¡Sesión completada!</span>
        </div>
      </>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full gap-2 mt-6"
      onClick={handleComplete}
      disabled={loading}
    >
      <CheckCircle size={18} />
      {loading ? 'Guardando...' : 'Marcar como completado'}
    </Button>
  );
}
