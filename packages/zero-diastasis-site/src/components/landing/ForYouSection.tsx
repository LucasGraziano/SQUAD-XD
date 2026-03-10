'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X } from 'lucide-react';

const forYou = [
  'Tuviste un bebé (hace meses o años) y tu abdomen no volvió a ser el mismo.',
  'Ya probaste fajas, dietas o abdominales y nada funcionó de verdad.',
  'Quieres algo suave que puedas hacer desde tu casa, en pocos minutos.',
  'Sientes que perdiste la conexión con tu cuerpo después del embarazo.',
  'Buscas un método seguro y respaldado por anatomía real, no modas.',
];

const notForYou = [
  'Buscas resultados mágicos de la noche a la mañana.',
  'No estás dispuesta a dedicar 8-12 minutos diarios.',
  'Prefieres cirugía como primera opción sin explorar alternativas.',
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

export default function ForYouSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="section-padding bg-warm">
      <div className="content-width">
        {inView && (
          <>
            <motion.h2
              {...fade(0)}
              className="font-serif text-h2 md:text-h1 font-bold text-text text-center mb-10"
            >
              ¿Es para ti?
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* For you */}
              <motion.div
                {...fade(0.1)}
                className="bg-white rounded-3xl shadow-card p-6 md:p-8"
              >
                <h3 className="font-serif font-bold text-h3 text-text mb-5">
                  Zero Diastasis&trade; es para ti si:
                </h3>
                <ul className="space-y-4">
                  {forYou.map((item, i) => (
                    <motion.li
                      key={i}
                      {...fade(0.2 + i * 0.08)}
                      className="flex gap-3 items-start"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-green-50 flex items-center justify-center" aria-hidden="true">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </span>
                      <span className="text-body text-text-light">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Not for you */}
              <motion.div
                {...fade(0.2)}
                className="bg-white rounded-3xl shadow-card p-6 md:p-8"
              >
                <h3 className="font-serif font-bold text-h3 text-text mb-5">
                  No es para ti si:
                </h3>
                <ul className="space-y-4">
                  {notForYou.map((item, i) => (
                    <motion.li
                      key={i}
                      {...fade(0.35 + i * 0.08)}
                      className="flex gap-3 items-start"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center" aria-hidden="true">
                        <X className="w-3.5 h-3.5 text-red-500" />
                      </span>
                      <span className="text-body text-text-light">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
