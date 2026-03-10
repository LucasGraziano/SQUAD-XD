'use client';

import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type MotivationProps = {
  currentDay: number;
};

export function Motivation({ currentDay }: MotivationProps) {
  const t = useTranslations('motivation');
  const dayKey = String(Math.min(Math.max(currentDay, 1), 28));

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary/10">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-accent mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80 italic leading-relaxed">{t(dayKey)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
