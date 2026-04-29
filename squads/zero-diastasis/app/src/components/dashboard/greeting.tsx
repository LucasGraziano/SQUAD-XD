'use client';

import { useTranslations } from 'next-intl';

type GreetingProps = {
  name?: string | null;
};

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function Greeting({ name }: GreetingProps) {
  const t = useTranslations('greeting');
  const timeOfDay = getTimeOfDay();

  return (
    <div className="mb-6 animate-fade-in">
      <h1 className="text-2xl font-heading font-bold text-foreground">
        {t(timeOfDay)}{name ? `, ${name.split(' ')[0]}` : ''} 👋
      </h1>
      <p className="text-sm text-foreground/40 mt-1">Zero Diastasis™ · Protocolo de 28 días</p>
    </div>
  );
}
