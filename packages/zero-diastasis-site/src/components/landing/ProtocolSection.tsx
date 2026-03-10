'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const phases = [
  {
    num: 1,
    name: 'El Desbloqueo',
    days: 'Día 0',
    desc: 'E-book visual de 20 minutos que te muestra exactamente qué pasó en tu cuerpo. Un momento "ahá" que cambia cómo ves tu abdomen para siempre.',
  },
  {
    num: 2,
    name: 'La Reconexión',
    days: 'Días 1-7',
    desc: 'Audio-guías de 8 minutos que reconectan tu respiración con tu músculo profundo. Suave, sin esfuerzo — solo necesitas acostarte y escuchar.',
  },
  {
    num: 3,
    name: 'La Compresión',
    days: 'Días 8-14',
    desc: 'Ejercicios de pie, cortos y simples. Tu abdomen empieza a sentirse diferente. Es cuando empiezas a ver el cambio.',
  },
  {
    num: 4,
    name: 'El Anclaje',
    days: 'Días 15-28',
    desc: 'Formación de hábito. 12 minutos al día que consolidan los resultados. Tu nuevo tono abdominal se vuelve permanente.',
  },
];

const results = [
  'Tu abdomen se siente más firme',
  'Tu ropa queda diferente',
  'Te miras al espejo y sonríes',
  'Y todo eso sin haber hecho un solo abdominal',
];

export default function ProtocolSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="section-padding bg-warm">
      <div className="content-width">
        {inView && (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif text-h2 md:text-h1 font-bold text-text text-center mb-2"
            >
              Cómo funciona el protocolo
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-body-lg text-text-light text-center mb-12"
            >
              4 fases simples
            </motion.p>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line with animated gradient */}
              <motion.div
                className="absolute left-6 md:left-8 top-0 bottom-0 w-px origin-top"
                style={{ background: 'linear-gradient(to bottom, #A8893E, #C97B7B, #E8C5C5)' }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                aria-hidden="true"
              />

              <div className="space-y-8">
                {phases.map((phase, i) => (
                  <motion.div
                    key={phase.num}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                    className="relative pl-16 md:pl-20"
                  >
                    {/* Phase number circle */}
                    <motion.div
                      className="absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <span className="font-serif font-bold text-gold text-lg md:text-xl">
                        {phase.num}
                      </span>
                    </motion.div>

                    <div className="bg-white rounded-3xl shadow-card p-5 md:p-6 hover:shadow-elevated transition-shadow duration-300">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-serif font-bold text-h3 text-text">
                          {phase.name}
                        </h3>
                        <span className="badge text-xs">{phase.days}</span>
                      </div>
                      <p className="text-body text-text-light">{phase.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-14 text-center space-y-3"
            >
              {results.map((r, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 + i * 0.1 }}
                  className={`text-body-lg ${
                    i === results.length - 1
                      ? 'font-serif font-semibold text-text mt-4'
                      : 'text-text-light'
                  }`}
                >
                  {i < results.length - 1 ? '✦ ' : ''}
                  {r}
                </motion.p>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
