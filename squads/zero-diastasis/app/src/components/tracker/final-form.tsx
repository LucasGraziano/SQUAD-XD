'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MeasurementForm } from './measurement-form';
import { Trophy } from 'lucide-react';

export function FinalForm() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-accent-50 to-primary-50 border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy size={24} className="text-accent" />
            <h2 className="font-heading font-bold text-foreground text-xl">¡Día 28 — Medición final!</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/70 mb-4">
            Has completado los 28 días del protocolo. Registra tus medidas finales para comparar con el inicio.
          </p>
        </CardContent>
      </Card>
      <MeasurementForm />
    </div>
  );
}
