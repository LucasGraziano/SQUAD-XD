'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CTAButton from '@/components/ui/CTAButton';
import { PRICE } from '@/lib/constants';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

export default function FinalCTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="section-padding bg-warm">
      <div className="content-width">
        {inView && (
          <>
            {/* Two paths */}
            <div className="grid md:grid-cols-2 gap-6 mb-14">
              {/* Path 1 — Stay */}
              <motion.div
                {...fade(0)}
                className="rounded-3xl border border-nude-dark/40 p-6 md:p-8 opacity-60"
              >
                <p className="text-body text-text-muted mb-3 font-medium">
                  Camino 1
                </p>
                <p className="text-body-lg text-text-muted">
                  Cerrar esta página y seguir como estás. Seguir probando cosas
                  que no funcionan. Seguir sintiéndote frustrada cada vez que te
                  miras al espejo.
                </p>
              </motion.div>

              {/* Path 2 — Invest */}
              <motion.div
                {...fade(0.15)}
                className="rounded-3xl bg-white p-6 md:p-8 shadow-elevated ring-2 ring-blush-strong/20 relative overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blush-light/20 via-transparent to-gold/10 pointer-events-none" />
                <div className="relative">
                  <p className="text-body text-blush-strong mb-3 font-semibold">
                    Camino 2
                  </p>
                  <p className="text-body-lg text-text">
                    Invertir ${PRICE.current} en ti misma. Empezar hoy un
                    protocolo de 28 días que miles de mamás ya usaron. Sentir la
                    diferencia desde la primera semana.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Emotional closing */}
            <motion.div
              {...fade(0.3)}
              className="text-center max-w-lg mx-auto mb-12"
            >
              <p className="font-serif italic text-h3 md:text-h2 text-text leading-relaxed">
                Tu cuerpo hizo algo increíble: trajo vida al mundo. Ahora
                merece que alguien cuide de él.
              </p>
              <p className="font-serif italic text-h3 md:text-h2 text-blush-strong mt-4">
                Ese alguien eres tú.
              </p>
            </motion.div>

            {/* Final CTA */}
            <motion.div {...fade(0.5)} className="text-center">
              <CTAButton size="xl" pulse>
                SÍ, QUIERO EMPEZAR ZERO DIASTASIS&trade; — ${PRICE.current}
              </CTAButton>
              <motion.div
                {...fade(0.65)}
                className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-small text-text-muted"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
                  5,234+ mamás ya empezaron
                </span>
                <span className="hidden sm:inline" aria-hidden="true">&bull;</span>
                <span>Garantía total de 28 días</span>
                <span className="hidden sm:inline" aria-hidden="true">&bull;</span>
                <span>Pago único, sin suscripción</span>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
