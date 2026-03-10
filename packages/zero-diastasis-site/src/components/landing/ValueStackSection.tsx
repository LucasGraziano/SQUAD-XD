'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { VALUE_STACK, PRICE } from '@/lib/constants';
import CTAButton from '@/components/ui/CTAButton';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

export default function ValueStackSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const totalValue = VALUE_STACK.reduce((sum, item) => sum + item.value, 0);

  return (
    <section ref={ref} id="pricing" className="section-padding bg-warm">
      <div className="wide-width">
        {inView && (
          <>
            <motion.h2
              {...fade(0)}
              className="font-serif text-h2 md:text-h1 font-bold text-text text-center mb-12"
            >
              Todo lo que recibes hoy
            </motion.h2>

            {/* Product mockup */}
            <motion.div {...fade(0.05)} className="flex justify-center mb-12">
              <div className="relative">
                <ImagePlaceholder
                  src="/images/product-mockup.webp"
                  alt="Mockup del protocolo Zero Diastasis: ebook, audio-guías y tracker de progreso"
                  width={700}
                  height={400}
                  className="rounded-3xl w-full max-w-2xl"
                  placeholderLabel="Mockup: iPad con ebook + iPhone con audio-guía + tracker impreso"
                />
              </div>
            </motion.div>

            {/* Value stack card */}
            <motion.div
              {...fade(0.1)}
              className="bg-white rounded-3xl shadow-elevated p-6 md:p-8 mb-10 max-w-content mx-auto"
            >
              <div className="space-y-4">
                {VALUE_STACK.map((item, i) => (
                  <motion.div
                    key={i}
                    {...fade(0.15 + i * 0.08)}
                    className={`flex justify-between items-start gap-4 pb-4 ${
                      i < VALUE_STACK.length - 1
                        ? 'border-b border-nude-dark/30'
                        : ''
                    }`}
                  >
                    <div className="flex-1">
                      {item.bonus && (
                        <span className="inline-block bg-gold/10 text-gold-dark text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-1.5">
                          Bonus #{item.bonus}
                        </span>
                      )}
                      <p className="text-body text-text">{item.name}</p>
                    </div>
                    <span className="text-body font-medium text-text-muted whitespace-nowrap">
                      ${item.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Totals */}
              <motion.div {...fade(0.6)} className="mt-8 pt-6 border-t-2 border-nude">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-body-lg font-semibold text-text">
                    Valor total
                  </span>
                  <span className="text-body-lg font-semibold text-text">
                    ${totalValue}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-body text-text-muted">
                    Precio normal
                  </span>
                  <span className="text-body text-text-muted line-through">
                    ${PRICE.original}
                  </span>
                </div>

                {/* Current price */}
                <div className="text-center mt-6">
                  <span className="badge bg-gold/10 text-gold-dark font-bold mb-3 inline-block">
                    Ahorras {PRICE.discount}%
                  </span>
                  <div className="text-display md:text-[4rem] font-bold text-gold font-serif leading-none mb-1">
                    ${PRICE.current}
                  </div>
                  <p className="text-body text-text-muted">USD — pago único</p>
                </div>
              </motion.div>
            </motion.div>

            {/* CTA */}
            <motion.div {...fade(0.7)} className="text-center mb-16 max-w-content mx-auto">
              <CTAButton size="xl" pulse>
                SÍ, QUIERO EMPEZAR — ${PRICE.current}
              </CTAButton>
              <motion.p
                {...fade(0.8)}
                className="mt-4 text-small text-text-muted flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Pago seguro &bull; Acceso inmediato &bull; Garantía 28 días
              </motion.p>
            </motion.div>

            {/* Why this price */}
            <motion.div
              {...fade(0.8)}
              className="text-center max-w-lg mx-auto"
            >
              <h3 className="font-serif font-bold text-h3 text-text mb-6">
                ¿Por qué ${PRICE.current}?
              </h3>
              <div className="space-y-2 text-body text-text-light mb-6">
                <p>Una abdominoplastia cuesta $5,000 - $10,000.</p>
                <p>Un gimnasio, $40 - $80 al mes.</p>
                <p>Un nutricionista, $100+ por sesión.</p>
                <p>Una faja de compresión, $30 - $50.</p>
              </div>
              <p className="text-body-lg font-semibold text-text mb-4">
                Zero Diastasis&trade; cuesta menos que una pizza familiar.
              </p>
              <p className="text-body text-text-light">
                Un solo pago. Sin suscripción. Sin cobros ocultos. Acceso de
                por vida al protocolo completo.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
