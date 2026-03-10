'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CTAButton from '@/components/ui/CTAButton';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import { PRICE } from '@/lib/constants';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
});

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const questions = [
    '¿Cuántas veces intentaste hacer dieta y tu barriga siguió igual?',
    '¿Cuántas fajas compraste que solo te apretaban pero no cambiaban nada?',
    '¿Cuántos abdominales hiciste que en realidad empeoraron las cosas?',
  ];

  return (
    <section
      ref={ref}
      className="section-padding bg-warm min-h-[90vh] flex items-center relative overflow-hidden"
    >
      {/* Subtle background gradient orbs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-blush-light/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="wide-width relative">
        {inView && (
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left column — copy */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Badge */}
              <motion.div {...fade(0)} className="mb-6">
                <span className="badge">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blush-strong opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blush-strong" />
                  </span>
                  Resultado de tu quiz personalizado
                </span>
              </motion.div>

              {/* Sub-text */}
              <motion.p
                {...fade(0.1)}
                className="text-body text-text-light max-w-lg mx-auto lg:mx-0 mb-5"
              >
                Basándonos en tus respuestas, identificamos exactamente qué está
                pasando con tu abdomen — y cómo solucionarlo.
              </motion.p>

              {/* Divider */}
              <motion.div {...fade(0.18)} className="w-16 h-0.5 bg-gradient-to-r from-blush to-gold mx-auto lg:mx-0 my-6" />

              {/* Headline */}
              <motion.h1
                {...fade(0.25)}
                className="font-serif text-h1 md:text-display font-bold text-text text-balance leading-tight mb-5"
              >
                Tu barriga de mamá{' '}
                <span className="gradient-text">NO</span> es gordura.
                <br />
                Es un músculo dormido.
              </motion.h1>

              {/* Supporting paragraph */}
              <motion.p
                {...fade(0.35)}
                className="text-body-lg text-text-light max-w-lg mx-auto lg:mx-0 mb-8"
              >
                Y por eso ninguna dieta, faja ni abdominal va a resolverlo.
              </motion.p>

              {/* Hero CTA */}
              <motion.div
                {...fade(0.45)}
                className="flex flex-col items-center lg:items-start gap-3"
              >
                <CTAButton size="xl" pulse>
                  QUIERO EMPEZAR HOY — ${PRICE.current}
                </CTAButton>
                <p className="text-xs text-text-muted">
                  Acceso inmediato &bull; Sin suscripción &bull; Garantía 28 días
                </p>
              </motion.div>
            </div>

            {/* Right column — hero image */}
            <motion.div
              {...fade(0.2)}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="relative w-full max-w-md">
                <ImagePlaceholder
                  src="/images/hero-mama.webp"
                  alt="Mamá sonriendo después de completar el protocolo Zero Diastasis"
                  width={520}
                  height={600}
                  className="rounded-3xl shadow-elevated w-full"
                  priority
                  placeholderLabel="Foto hero: mamá feliz, abdomen firme"
                />
                {/* Floating stat badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-elevated px-4 py-3 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center" aria-hidden="true">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text">5,234+ mamás</p>
                    <p className="text-[10px] text-text-muted">ya comenzaron</p>
                  </div>
                </motion.div>

                {/* Floating time badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                  className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-elevated px-3 py-2 flex items-center gap-2"
                >
                  <span className="text-lg" aria-hidden="true">⏱️</span>
                  <div>
                    <p className="text-xs font-bold text-text">8-12 min</p>
                    <p className="text-[10px] text-text-muted">por día</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Rhetorical questions — full width below */}
        {inView && (
          <div className="mt-16 lg:mt-20">
            <div className="max-w-content mx-auto">
              <div className="space-y-4 mb-10 text-center">
                {questions.map((q, i) => (
                  <motion.p
                    key={i}
                    {...fade(0.55 + i * 0.12)}
                    className="font-serif italic text-body-lg text-text-light"
                  >
                    {q}
                  </motion.p>
                ))}
              </div>

              {/* Empathy statement */}
              <motion.p
                {...fade(0.95)}
                className="text-body-lg font-semibold text-text mb-8 text-center"
              >
                No es tu culpa. Es que nadie te explicó lo que realmente pasa.
              </motion.p>

              {/* Explanation */}
              <motion.p
                {...fade(1.05)}
                className="text-body text-text-light max-w-lg mx-auto mb-8 text-center"
              >
                Después del embarazo, hay un músculo profundo en tu abdomen
                — uno que funciona como un corsé natural — que se
                &quot;duerme&quot;. Se desactiva. Deja de trabajar. Y cuando ese
                músculo no trabaja, tu barriga pierde su sostén desde adentro. Por
                eso nada de lo que intentas funciona.
              </motion.p>

              {/* Dramatic line */}
              <motion.p
                {...fade(1.2)}
                className="font-serif text-h2 md:text-h1 font-bold gradient-text text-center"
              >
                Hasta ahora.
              </motion.p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
