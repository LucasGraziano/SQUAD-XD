'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';
import type { ChartDataPoint } from '@/types/progress';

export function ProgressChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/progress/measurements')
      .then((r) => r.json())
      .then((res) => {
        setData(res.measurements || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-foreground/50 py-8">Cargando...</p>;
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <TrendingDown size={32} className="text-foreground/20 mx-auto mb-3" />
          <p className="text-foreground/50">Aún no hay medidas registradas.</p>
          <p className="text-sm text-foreground/40 mt-1">Registra tus medidas para ver tu progreso aquí.</p>
        </CardContent>
      </Card>
    );
  }

  const maxWaist = Math.max(...data.filter((d) => d.waist_cm).map((d) => d.waist_cm!));
  const minWaist = Math.min(...data.filter((d) => d.waist_cm).map((d) => d.waist_cm!));
  const range = maxWaist - minWaist || 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingDown size={20} className="text-primary" />
          <h2 className="font-heading font-bold text-foreground">Evolución de cintura</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-end gap-1">
          {data
            .filter((d) => d.waist_cm != null)
            .map((d, i) => {
              const height = ((d.waist_cm! - minWaist) / range) * 80 + 20;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-foreground/40">{d.waist_cm}</span>
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary-200 rounded-t-sm transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-foreground/40">D{d.day}</span>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
