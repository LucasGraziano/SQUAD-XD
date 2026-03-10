'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Headphones,
  Activity,
  Trophy,
  ChevronRight,
  Flame,
  Star,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { phases, days, getPhaseForDay, getProgress } from '@/lib/protocol-data';

const typeIcons = {
  ebook: BookOpen,
  audio: Headphones,
  exercise: Activity,
  rest: Trophy,
};

const milestones = [
  { day: 0, label: 'Inicio', emoji: '🌱' },
  { day: 7, label: 'Semana 1', emoji: '⭐' },
  { day: 14, label: 'Mitad', emoji: '🔥' },
  { day: 21, label: 'Semana 3', emoji: '💪' },
  { day: 28, label: 'Completado', emoji: '🏆' },
];

export default function ProtocoloPage() {
  const [currentDay] = useState(3);
  const [completedDays] = useState<number[]>([0, 1, 2]);

  const progress = getProgress(currentDay);
  const currentPhase = getPhaseForDay(currentDay);
  const todayContent = days.find((d) => d.day === currentDay);
  const streak = completedDays.length;
  const nextMilestone = milestones.find((m) => m.day > Math.max(...completedDays, -1));

  return (
    <main className="min-h-screen bg-warm">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-nude-dark/20 sticky top-0 z-50">
        <div className="max-w-wide mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl text-text">
            Zero Diastasis<span className="text-blush-strong">&trade;</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-nude px-3 py-1.5 rounded-full" aria-label={`Racha de ${streak} días`}>
              <Flame className="w-4 h-4 text-gold" aria-hidden="true" />
              <span className="font-semibold text-small text-text">{streak}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-content mx-auto px-5 py-8 md:py-12">
        {/* Welcome + Motivation */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-text-muted text-small mb-1">
            Fase {currentPhase.id} — {currentPhase.nameES}
          </p>
          <h2 className="font-serif text-h2 text-text mb-2">
            Día {currentDay} de 28
          </h2>
          {nextMilestone && (
            <p className="text-small text-text-light">
              {nextMilestone.emoji} Próximo logro:{' '}
              <span className="font-medium text-text">{nextMilestone.label}</span>
              {' '}en {nextMilestone.day - currentDay} días
            </p>
          )}
        </motion.div>

        {/* Progress Bar with Milestones */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between text-small mb-2">
            <span className="text-text-muted">Tu progreso</span>
            <span className="font-semibold text-text">{progress}%</span>
          </div>

          <div className="relative">
            <div className="h-3 bg-nude rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: currentPhase.color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>

            {/* Milestone markers on progress bar */}
            <div className="absolute inset-0 flex items-center">
              {milestones.map((m) => {
                const pct = (m.day / 28) * 100;
                const reached = completedDays.includes(m.day) || m.day === 0;
                return (
                  <div
                    key={m.day}
                    className="absolute -top-0.5"
                    style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-colors ${
                        reached
                          ? 'bg-gold border-gold'
                          : 'bg-white border-nude-dark/30'
                      }`}
                      title={m.label}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Milestone labels */}
          <div className="flex justify-between mt-3">
            {milestones.map((m) => (
              <div key={m.day} className="text-center" style={{ width: '20%' }}>
                <span className="text-[10px] text-text-muted block">
                  {m.emoji}
                </span>
                <span className="text-[9px] text-text-muted hidden sm:block">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Today's Session Card */}
        {todayContent && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href={`/protocolo/dia/${currentDay}`}
              className="card block group hover:shadow-elevated transition-all duration-300 mb-10 border-2 border-transparent hover:border-blush-light relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-blush to-blush-strong" />

              <div className="flex items-center gap-2 mb-3 pt-2">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: currentPhase.color }}
                >
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  HOY
                </span>
                <span className="text-small text-text-muted">
                  {todayContent.duration}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-h3 text-text mb-1">
                    {todayContent.title}
                  </h3>
                  <p className="text-small text-text-light line-clamp-2">
                    {todayContent.description}
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-blush-strong flex-shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Phase Calendar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-serif text-h3 text-text mb-6">Tu calendario</h3>

          {phases.map((phase) => (
            <div key={phase.id} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-small font-bold"
                  style={{ backgroundColor: phase.color }}
                  aria-hidden="true"
                >
                  {phase.id}
                </div>
                <div>
                  <p className="font-semibold text-text text-small">
                    {phase.nameES}
                  </p>
                  <p className="text-[11px] text-text-muted">{phase.days}</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 ml-11">
                {days
                  .filter((d) => d.phase === phase.id)
                  .map((d) => {
                    const isCompleted = completedDays.includes(d.day);
                    const isCurrent = d.day === currentDay;
                    const isLocked = d.day > currentDay;
                    const Icon = typeIcons[d.type];
                    const isMilestone = milestones.some((m) => m.day === d.day);

                    const cellClasses = `
                      relative aspect-square rounded-xl flex flex-col items-center justify-center text-center
                      transition-all duration-200 min-w-0 min-h-[44px]
                      ${
                        isCurrent
                          ? 'bg-white shadow-card border-2'
                          : isCompleted
                            ? 'bg-white shadow-soft'
                            : isLocked
                              ? 'bg-nude/50 opacity-40'
                              : 'bg-white shadow-soft hover:shadow-card'
                      }
                    `;

                    const cellContent = (
                      <>
                        {/* Completed checkmark */}
                        {isCompleted && (
                          <div
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#7CB68E' }}
                            aria-hidden="true"
                          >
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Milestone star */}
                        {isMilestone && !isCompleted && (
                          <div className="absolute -top-1 -right-1" aria-hidden="true">
                            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                          </div>
                        )}

                        <Icon
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5"
                          style={{
                            color: isLocked ? '#9B9B9B' : phase.color,
                          }}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span
                          className={`text-[10px] sm:text-[11px] font-medium ${
                            isLocked ? 'text-text-muted' : 'text-text'
                          }`}
                        >
                          {d.day === 0 ? 'Intro' : `D${d.day}`}
                        </span>
                      </>
                    );

                    if (isLocked) {
                      return (
                        <span
                          key={d.day}
                          role="presentation"
                          aria-label={`Día ${d.day}, bloqueado`}
                          className={cellClasses}
                          style={{ borderColor: 'transparent' }}
                        >
                          {cellContent}
                        </span>
                      );
                    }

                    return (
                      <Link
                        key={d.day}
                        href={`/protocolo/dia/${d.day}`}
                        aria-label={`Día ${d.day}${isCompleted ? ', completado' : isCurrent ? ', hoy' : ''}`}
                        className={cellClasses}
                        style={{
                          borderColor: isCurrent ? phase.color : 'transparent',
                        }}
                      >
                        {cellContent}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Motivational footer */}
        <motion.div
          className="text-center py-8 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-small text-text-muted italic">
            &ldquo;Cada sesión te acerca a la versión más firme de ti misma.&rdquo;
          </p>
        </motion.div>
      </div>
    </main>
  );
}
