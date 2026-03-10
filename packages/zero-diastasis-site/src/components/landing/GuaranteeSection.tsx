'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { PROTOCOL } from '@/lib/constants';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

export default function GuaranteeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="section-padding bg-nude-light relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="content-width text-center relative">
        {inView && (
          <>
            {/* Shield icon with ring animation */}
            <motion.div {...fade(0)} className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 text-gold" aria-hidden="true" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gold/30"
                  animate={{ scale: [1, 1.3, 1.3], opacity: [0.6, 0, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div {...fade(0.1)} className="mb-6">
              <span className="inline-block bg-gold/10 text-gold-dark text-sm font-bold uppercase tracking-wider px-5 py-2 rounded-full">
                {PROTOCOL.guarantee} días de garantía
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              {...fade(0.2)}
              className="font-serif text-h2 md:text-h1 font-bold text-text mb-6"
            >
              Tu tranquilidad es importante.
            </motion.h2>

            {/* Description */}
            <motion.p
              {...fade(0.3)}
              className="text-body-lg text-text-light max-w-lg mx-auto mb-6"
            >
              Si en {PROTOCOL.guarantee} días no sientes ninguna diferencia, te
              devolvemos cada centavo. Sin preguntas. Sin complicaciones. Solo
              escríbenos y listo.
            </motion.p>

            {/* Bold statement */}
            <motion.p
              {...fade(0.4)}
              className="text-body-lg font-semibold text-text"
            >
              El riesgo es cero. El potencial es enorme.
            </motion.p>
          </>
        )}
      </div>
    </section>
  );
}
