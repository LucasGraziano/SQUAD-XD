'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle,
  ChevronRight,
  BookOpen,
  Headphones,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { getDayContent, getPhaseForDay } from '@/lib/protocol-data';

const typeConfig = {
  ebook: {
    icon: BookOpen,
    label: 'E-book',
    action: 'Leer e-book',
    bg: 'bg-gold/10',
  },
  audio: {
    icon: Headphones,
    label: 'Audio-guía',
    action: 'Escuchar guía',
    bg: 'bg-blush/10',
  },
  exercise: {
    icon: Activity,
    label: 'Ejercicio guiado',
    action: 'Comenzar sesión',
    bg: 'bg-blush-strong/10',
  },
  rest: {
    icon: CheckCircle,
    label: 'Descanso activo',
    action: 'Ver indicaciones',
    bg: 'bg-[#7CB68E]/10',
  },
};

export default function DayPageClient({ day }: { day: number }) {
  const dayNum = day;
  const content = getDayContent(dayNum);
  const phase = getPhaseForDay(dayNum);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!content) {
    return (
      <main className="min-h-screen bg-warm flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-h2 text-text mb-4">
            Día no encontrado
          </h1>
          <Link href="/protocolo" className="text-blush-strong hover:underline">
            Volver al protocolo
          </Link>
        </div>
      </main>
    );
  }

  const config = typeConfig[content.type];
  const Icon = config.icon;
  const nextDay = dayNum < 28 ? dayNum + 1 : null;

  return (
    <main className="min-h-screen bg-warm">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-nude-dark/20 sticky top-0 z-50">
        <div className="max-w-content mx-auto px-5 py-4 flex items-center gap-4">
          <Link
            href="/protocolo"
            className="flex items-center gap-1 text-text-light hover:text-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-small">Protocolo</span>
          </Link>
          <div className="flex-1" />
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: phase.color }}
          >
            Fase {phase.id}
          </span>
        </div>
      </header>

      <div className="max-w-content mx-auto px-5 py-8 md:py-12">
        {/* Day Info */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${phase.color}15` }}
            >
              <Icon
                className="w-7 h-7"
                style={{ color: phase.color }}
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-small text-text-muted">
                {phase.nameES} — {content.duration}
              </p>
              <h1 className="font-serif text-h2 text-text">{content.title}</h1>
            </div>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-body-lg text-text leading-relaxed mb-6">
            {content.description}
          </p>

          {/* Audio Player Mockup */}
          {(content.type === 'audio' || content.type === 'exercise') && (
            <div className="bg-nude rounded-2xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: phase.color }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" fill="white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-small font-semibold text-text">
                    {content.title}
                  </p>
                  <p className="text-xs text-text-muted">{content.duration}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-white rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: phase.color }}
                  initial={{ width: '0%' }}
                  animate={{ width: isPlaying ? '35%' : '0%' }}
                  transition={{ duration: isPlaying ? 8 : 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-text-muted">
                  {isPlaying ? '2:48' : '0:00'}
                </span>
                <span className="text-[10px] text-text-muted">
                  {content.duration.replace(' audio', '')}
                </span>
              </div>
            </div>
          )}

          {/* E-book section */}
          {content.type === 'ebook' && (
            <div className="bg-nude rounded-2xl p-8 text-center">
              <BookOpen
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: phase.color }}
                strokeWidth={1.5}
              />
              <p className="font-serif text-h3 text-text mb-2">
                El Desbloqueo
              </p>
              <p className="text-small text-text-light mb-4">
                E-book visual — 20 minutos de lectura
              </p>
              <button className="btn-primary">Abrir e-book</button>
            </div>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          className="card bg-nude border-0 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-text mb-2 text-small">
            Consejo del día
          </h3>
          <p className="text-small text-text-light">
            {content.type === 'ebook'
              ? 'Busca un lugar tranquilo y tómate tu tiempo. Este e-book cambiará tu perspectiva sobre tu cuerpo.'
              : dayNum <= 7
                ? 'Haz la sesión acostada, en un lugar cómodo. Puedes hacerla antes de dormir o al despertar.'
                : dayNum <= 14
                  ? 'Hoy practicarás de pie. Asegúrate de tener espacio suficiente para moverte cómodamente.'
                  : 'Ya conoces la rutina. Confía en tu cuerpo — el progreso es acumulativo.'}
          </p>
        </motion.div>

        {/* Complete Button */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.button
                key="complete"
                className="btn-primary w-full md:w-auto"
                onClick={() => setIsCompleted(true)}
                whileTap={{ scale: 0.97 }}
              >
                Marcar como completado
              </motion.button>
            ) : (
              <motion.div
                key="done"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-2 text-[#7CB68E]">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">¡Sesión completada!</span>
                </div>
                {nextDay && (
                  <Link
                    href={`/protocolo/dia/${nextDay}`}
                    className="inline-flex items-center gap-2 text-blush-strong font-semibold hover:underline"
                  >
                    Ver el día siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
