'use client';

import { useTranslations } from 'next-intl';
import { Play, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { getModuleForDay } from '@/hooks/use-protocol-day';

type DailyCardProps = {
  currentDay: number;
  isCompleted: boolean;
};

export function DailyCard({ currentDay, isCompleted }: DailyCardProps) {
  const t = useTranslations('dailyCard');
  const moduleNum = getModuleForDay(currentDay);

  return (
    <Card className="mb-6 border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={isCompleted ? 'success' : 'accent'}>
            {t('module', { module: moduleNum })}
          </Badge>
          <span className="text-sm text-foreground/50">
            {t('day', { day: currentDay })}
          </span>
        </div>

        <h2 className="text-xl font-heading font-bold text-foreground mb-4">
          {t('title')}
        </h2>

        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span className="font-medium">{t('completed')}</span>
          </div>
        ) : (
          <Link href={`/protocolo/dia/${currentDay}`}>
            <Button size="lg" className="w-full gap-2">
              <Play size={18} />
              {t('start')}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
