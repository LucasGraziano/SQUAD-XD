'use client';

import { useTranslations } from 'next-intl';

type ProgressRingProps = {
  completedDays: number;
  totalDays?: number;
};

export function ProgressRing({ completedDays, totalDays = 28 }: ProgressRingProps) {
  const t = useTranslations('progress');
  const percentage = Math.round((completedDays / totalDays) * 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-5 mb-6">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#F5E6D3" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#D4A5A5"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-primary">{percentage}%</span>
        </div>
      </div>
      <div>
        <h3 className="font-heading font-bold text-foreground">{t('title')}</h3>
        <p className="text-sm text-foreground/60">
          {t('daysCompleted', { count: completedDays })}
        </p>
        <p className="text-xs text-foreground/40 mt-1">
          {completedDays < totalDays
            ? `${totalDays - completedDays} días restantes`
            : '¡Protocolo completado! 🎉'}
        </p>
      </div>
    </div>
  );
}
