'use client';

import { CheckCircle, Lock, Play } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { DayStatus } from '@/types/protocol';

type DayItemProps = {
  dayNumber: number;
  status: DayStatus;
};

export function DayItem({ dayNumber, status }: DayItemProps) {
  const content = (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
      status === 'locked' ? 'opacity-50' : 'hover:bg-secondary/30'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        status === 'completed' ? 'bg-green-100 text-green-600' :
        status === 'available' ? 'bg-primary-100 text-primary' :
        'bg-gray-100 text-gray-400'
      }`}>
        {status === 'completed' ? <CheckCircle size={20} /> :
         status === 'locked' ? <Lock size={16} /> :
         <Play size={16} className="ml-0.5" />}
      </div>
      <div className="flex-1">
        <span className="font-medium text-foreground">Día {dayNumber}</span>
      </div>
      {status === 'completed' && (
        <span className="text-xs text-green-600 font-medium">Completado</span>
      )}
    </div>
  );

  if (status === 'locked') return content;

  return <Link href={`/protocolo/dia/${dayNumber}`}>{content}</Link>;
}
