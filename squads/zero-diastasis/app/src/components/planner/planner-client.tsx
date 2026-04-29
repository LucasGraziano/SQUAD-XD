'use client';

import { useState } from 'react';
import { Check, Lock, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

type Props = {
  currentDay: number;
  completedDays: number[];
  userId: string;
};

const WEEK_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const MODULE_RANGES = [
  { module: 1, days: [1, 7], color: 'bg-primary-100 border-primary-200', activeColor: 'bg-primary border-primary', label: 'Reposicionamiento' },
  { module: 2, days: [8, 14], color: 'bg-accent-50 border-accent-200', activeColor: 'bg-accent border-accent', label: 'Compresión' },
  { module: 3, days: [15, 28], color: 'bg-secondary-100 border-secondary-300', activeColor: 'bg-secondary border-secondary-400', label: 'Anclaje' },
];

function getModuleForDay(day: number) {
  if (day <= 7) return 0;
  if (day <= 14) return 1;
  return 2;
}

export function PlannerClient({ currentDay, completedDays, userId }: Props) {
  const totalWeeks = 4;
  const currentWeek = Math.ceil(currentDay / 7);
  const [viewWeek, setViewWeek] = useState(currentWeek);

  const weekStart = (viewWeek - 1) * 7 + 1;
  const weekEnd = Math.min(viewWeek * 7, 28);
  const daysInView = Array.from({ length: weekEnd - weekStart + 1 }, (_, i) => weekStart + i);

  const overallProgress = Math.round((completedDays.length / 28) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-5 border border-primary-100 animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground/70">Progreso general</span>
          <span className="text-lg font-heading font-bold text-primary">{overallProgress}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-xs text-foreground/50 mt-2">{completedDays.length} de 28 días completados</p>
      </div>

      {/* Module Legend */}
      <div className="grid grid-cols-3 gap-2 animate-slide-up-delay-1">
        {MODULE_RANGES.map((m) => (
          <div key={m.module} className={cn('rounded-xl p-2.5 border text-center', m.color)}>
            <div className="text-xs font-bold text-foreground/70">Mód. {m.module}</div>
            <div className="text-xs text-foreground/50 mt-0.5">Días {m.days[0]}-{m.days[1]}</div>
          </div>
        ))}
      </div>

      {/* Week Navigator */}
      <div className="animate-slide-up-delay-2">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setViewWeek((w) => Math.max(1, w - 1))}
            disabled={viewWeek === 1}
            className="w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center disabled:opacity-30 hover:bg-secondary-200 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <div className="font-heading font-bold text-foreground">Semana {viewWeek}</div>
            <div className="text-xs text-foreground/50">Días {weekStart}–{weekEnd}</div>
          </div>
          <button
            onClick={() => setViewWeek((w) => Math.min(totalWeeks, w + 1))}
            disabled={viewWeek === totalWeeks}
            className="w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center disabled:opacity-30 hover:bg-secondary-200 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {WEEK_LABELS.map((label) => (
            <div key={label} className="text-center text-xs text-foreground/40 font-medium pb-1">{label}</div>
          ))}
          {/* Fill empty cells before weekStart day-of-week */}
          {daysInView.map((day) => {
            const isCompleted = completedDays.includes(day);
            const isCurrent = day === currentDay;
            const isLocked = day > currentDay;
            const modIdx = getModuleForDay(day);
            const mod = MODULE_RANGES[modIdx];

            return (
              <div key={day} className="aspect-square">
                {isLocked ? (
                  <div className="w-full h-full rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center">
                    <Lock size={10} className="text-gray-300 mb-0.5" />
                    <span className="text-[10px] text-gray-300 font-medium">{day}</span>
                  </div>
                ) : isCompleted ? (
                  <div className={cn('w-full h-full rounded-xl border-2 flex flex-col items-center justify-center', mod.activeColor)}>
                    <Check size={12} className="text-white mb-0.5" />
                    <span className="text-[10px] text-white font-bold">{day}</span>
                  </div>
                ) : isCurrent ? (
                  <Link href={`/protocolo/dia/${day}`} className="block w-full h-full">
                    <div className="w-full h-full rounded-xl border-2 border-primary bg-primary-50 flex flex-col items-center justify-center animate-pulse-soft">
                      <Play size={10} className="text-primary mb-0.5" fill="currentColor" />
                      <span className="text-[10px] text-primary font-bold">{day}</span>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/protocolo/dia/${day}`} className="block w-full h-full">
                    <div className={cn('w-full h-full rounded-xl border flex flex-col items-center justify-center hover:border-primary-300 transition-colors', mod.color)}>
                      <span className="text-[10px] text-foreground/60 font-medium">{day}</span>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Focus */}
      {currentDay <= 28 && (
        <div className="bg-white rounded-2xl border border-secondary-200 p-5 shadow-sm animate-slide-up-delay-3">
          <h3 className="font-heading font-bold text-foreground mb-1">Hoy: Día {currentDay}</h3>
          <p className="text-sm text-foreground/60 mb-4">
            {completedDays.includes(currentDay)
              ? '✅ ¡Ya completaste la sesión de hoy! Vuelve mañana.'
              : 'Tu sesión de hoy te está esperando. Solo 10-12 minutos.'}
          </p>
          {!completedDays.includes(currentDay) && (
            <Link href={`/protocolo/dia/${currentDay}`}>
              <button className="w-full py-3 rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors active:scale-95">
                <Play size={16} fill="white" />
                Comenzar sesión del día {currentDay}
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
