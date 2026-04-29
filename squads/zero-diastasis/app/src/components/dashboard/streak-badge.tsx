'use client';

import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type StreakBadgeProps = {
  streak: number;
  completedDays: number;
};

export function StreakBadge({ streak, completedDays }: StreakBadgeProps) {
  if (streak === 0 && completedDays === 0) return null;

  const milestones = [7, 14, 21, 28];
  const nextMilestone = milestones.find((m) => m > completedDays);
  const daysToNext = nextMilestone ? nextMilestone - completedDays : 0;

  return (
    <div className="flex items-center gap-3 mb-6 animate-slide-up-delay-1">
      {streak >= 2 && (
        <div className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
          streak >= 7 ? 'bg-orange-100 text-orange-600' : 'bg-primary-50 text-primary-600',
        )}>
          <Flame size={14} className={streak >= 7 ? 'text-orange-500' : 'text-primary'} />
          {streak} días seguidos
        </div>
      )}
      {nextMilestone && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-100 text-foreground/50 text-xs font-medium">
          <Trophy size={12} />
          {daysToNext === 1 ? '¡Mañana alcanzas ' : `${daysToNext} días para `}
          el hito de {nextMilestone}
        </div>
      )}
    </div>
  );
}
