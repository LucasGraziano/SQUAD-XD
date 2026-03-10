'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const results = [
  {
    name: 'Valentina M.',
    location: 'Medellín',
    weeks: 4,
    quote: 'Mi ropa volvió a quedarme como antes del embarazo.',
    beforeImage: '/images/results/valentina-before.webp',
    afterImage: '/images/results/valentina-after.webp',
  },
  {
    name: 'Daniela P.',
    location: 'CDMX',
    weeks: 3,
    quote: 'Lo mejor es que son solo 10 minutos. Con dos hijos, es perfecto.',
    beforeImage: '/images/results/daniela-before.webp',
    afterImage: '/images/results/daniela-after.webp',
  },
  {
    name: 'Isabella R.',
    location: 'Bogotá',
    weeks: 4,
    quote: 'Mi esposo fue el primero en notar el cambio.',
    beforeImage: '/images/results/isabella-before.webp',
    afterImage: '/images/results/isabella-after.webp',
  },
];

export default function ResultsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="section-padding bg-warm">
      <div className="wide-width">
        {inView && (
          <>
            <motion.div {...fade(0)} className="text-center mb-4">
              <span className="badge">Resultados reales</span>
            </motion.div>

            <motion.h2
              {...fade(0.1)}
              className="font-serif text-h2 md:text-h1 font-bold text-text text-center mb-4"
            >
              Mamás reales. Cambios reales.
            </motion.h2>

            <motion.p
              {...fade(0.15)}
              className="text-body text-text-light text-center mb-12 max-w-lg mx-auto"
            >
              Estas mamás siguieron el protocolo de 28 días. Los resultados hablan
              por sí mismos.
            </motion.p>

            {/* Results grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {results.map((r, i) => (
                <motion.div
                  key={r.name}
                  {...fade(0.2 + i * 0.15)}
                  className="bg-white rounded-3xl shadow-card overflow-hidden hover:shadow-elevated transition-shadow duration-300"
                >
                  {/* Before/After images */}
                  <div className="grid grid-cols-2 gap-px bg-nude-dark/10">
                    <div className="relative">
                      <ImagePlaceholder
                        src={r.beforeImage}
                        alt={`${r.name} antes del protocolo`}
                        width={280}
                        height={320}
                        className="w-full object-cover"
                        placeholderLabel="Antes"
                      />
                      <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-text-muted">
                        Antes
                      </span>
                    </div>
                    <div className="relative">
                      <ImagePlaceholder
                        src={r.afterImage}
                        alt={`${r.name} después del protocolo — semana ${r.weeks}`}
                        width={280}
                        height={320}
                        className="w-full object-cover"
                        placeholderLabel="Después"
                      />
                      <span className="absolute bottom-2 left-2 bg-blush-strong/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white">
                        Semana {r.weeks}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="font-serif italic text-body text-text-light mb-3">
                      &ldquo;{r.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text">{r.name}</p>
                        <p className="text-xs text-text-muted">{r.location}</p>
                      </div>
                      <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded-full">
                        {r.weeks} semanas
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Disclaimer */}
            <motion.p
              {...fade(0.7)}
              className="text-[11px] text-text-muted text-center mt-8 max-w-md mx-auto"
            >
              * Los resultados varían según cada persona. Las imágenes muestran
              resultados reales de participantes del protocolo.
            </motion.p>
          </>
        )}
      </div>
    </section>
  );
}
