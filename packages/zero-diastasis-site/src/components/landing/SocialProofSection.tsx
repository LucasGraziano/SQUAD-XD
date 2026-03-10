'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  stars: number;
  time: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'María C.',
    location: 'Bogotá, Colombia',
    quote:
      'Después de 2 embarazos, nada funcionaba. En la segunda semana ya sentía la diferencia. Mi ropa volvió a quedar como antes.',
    stars: 5,
    time: 'Hace 3 semanas',
    initials: 'MC',
  },
  {
    name: 'Ana L.',
    location: 'Ciudad de México',
    quote:
      'Lo mejor es que solo necesito 10 minutos. Con dos hijos, no tengo más. Y aun así funciona.',
    stars: 5,
    time: 'Hace 1 mes',
    initials: 'AL',
  },
  {
    name: 'Carmen R.',
    location: 'San Juan, Puerto Rico',
    quote:
      'Mi esposo fue el primero en notar el cambio. Eso me dio más motivación para seguir.',
    stars: 5,
    time: 'Hace 2 semanas',
    initials: 'CR',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`} role="img">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-gold"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function AnimatedCounter({
  target,
  inView,
}: {
  target: number;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setCount(current);

      if (step >= steps) {
        clearInterval(timer);
        setCount(target);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, target]);

  return <>{count.toLocaleString('es-LA')}</>;
}

export default function SocialProofSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="section-padding bg-nude-light">
      <div className="content-width">
        {inView && (
          <>
            {/* Floating social proof counter */}
            <motion.div {...fade(0)} className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white rounded-full shadow-soft px-6 py-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blush opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blush-strong" />
                </span>
                <p className="text-body font-semibold text-text">
                  <span className="text-blush-strong font-bold">
                    <AnimatedCounter target={5234} inView={inView} />+
                  </span>{' '}
                  mamás ya comenzaron su protocolo
                </p>
              </div>
            </motion.div>

            {/* Section heading */}
            <motion.h2
              {...fade(0.15)}
              className="font-serif text-h2 md:text-h1 font-bold text-text text-center mb-4"
            >
              Lo que dicen las mamás
            </motion.h2>
            <motion.p
              {...fade(0.2)}
              className="text-body text-text-light text-center mb-10"
            >
              Resultados reales de mamás reales
            </motion.p>

            {/* Testimonial cards */}
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  {...fade(0.25 + i * 0.15)}
                  className="min-w-[300px] md:min-w-0 snap-center bg-white rounded-3xl shadow-card p-6 flex flex-col hover:shadow-elevated transition-shadow duration-300"
                >
                  {/* Star rating */}
                  <StarRating count={t.stars} />

                  {/* Quote */}
                  <p className="text-body text-text-light italic mt-4 mb-6 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blush/20 text-blush-strong flex items-center justify-center text-sm font-bold shrink-0">
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {t.location}
                      </p>
                    </div>
                    <span className="ml-auto text-xs text-text-muted whitespace-nowrap">
                      {t.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
