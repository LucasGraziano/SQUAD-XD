'use client';

import { Lock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type LockScreenProps = {
  dayNumber: number;
  daysUntilUnlock: number;
};

export function LockScreen({ dayNumber, daysUntilUnlock }: LockScreenProps) {
  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <Card className="bg-gradient-to-br from-secondary-50 to-white">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Día {dayNumber} bloqueado
          </h2>
          <p className="text-foreground/60 mb-4">
            Este contenido se desbloqueará automáticamente cuando llegue el momento.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-accent">
            <Calendar size={16} />
            <span>
              {daysUntilUnlock === 1
                ? 'Se desbloquea mañana'
                : `Se desbloquea en ${daysUntilUnlock} días`}
            </span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
