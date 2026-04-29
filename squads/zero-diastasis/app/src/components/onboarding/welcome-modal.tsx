'use client';

import { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    emoji: '🎯',
    title: '¡Bienvenida a Zero Diastasis!',
    desc: 'Tu protocolo de 28 días para recuperar tu abdomen. Solo 10-12 minutos al día desde casa.',
  },
  {
    emoji: '🎧',
    title: 'Sesiones de audio guiado',
    desc: 'Cada día desbloquea una sesión de audio. Escúchala en un lugar tranquilo y sigue las instrucciones.',
  },
  {
    emoji: '📊',
    title: 'Registra tu evolución',
    desc: 'En "Evolución" puedes guardar tus medidas, fotos y síntomas para ver tu progreso semana a semana.',
  },
  {
    emoji: '🎁',
    title: 'Desbloquea bonuses',
    desc: 'A medida que avanzas, se desbloquean materiales complementarios como guías y recetas. ¡Recuérdalos!',
  },
];

type WelcomeModalProps = {
  onClose: () => void;
};

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-slide-up">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-primary' : 'w-1.5 bg-secondary-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-bounce-gentle">{current.emoji}</div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">{current.title}</h2>
          <p className="text-foreground/60 leading-relaxed text-sm">{current.desc}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!isLast && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-foreground/40">
              Saltar
            </Button>
          )}
          <Button
            className="flex-1 gap-2"
            onClick={isLast ? onClose : () => setStep((s) => s + 1)}
          >
            {isLast ? '¡Empezar! 🚀' : 'Siguiente'}
            {!isLast && <ChevronRight size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
