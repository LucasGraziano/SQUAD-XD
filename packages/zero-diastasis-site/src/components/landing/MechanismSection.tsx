'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Feather, UtensilsCrossed, Shield, Clock } from 'lucide-react';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

const benefits = [
  { icon: Feather, label: 'Sin ejercicio pesado' },
  { icon: UtensilsCrossed, label: 'Sin dieta' },
  { icon: Shield, label: 'Sin cirugía' },
  { icon: Clock, label: 'Solo 8-12 min/día' },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

export default function MechanismSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="section-padding bg-nude-light">
      <div className="wide-width">
        {inView && (
          <>
            {/* Badge */}
            <motion.div {...fade(0)} className="text-center mb-4">
              <span className="badge">La Faja Invisible&trade;</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              {...fade(0.1)}
              className="font-serif text-h2 md:text-h1 font-bold text-text text-center mb-12"
            >
              Descubre La Faja Invisible&trade;
            </motion.h2>

            {/* Two-column layout: image + content */}
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-14">
              {/* Image */}
              <motion.div {...fade(0.15)} className="flex justify-center">
                <ImagePlaceholder
                  src="/images/mechanism-breathing.webp"
                  alt="Mujer realizando ejercicio de respiración suave del protocolo Zero Diastasis"
                  width={520}
                  height={480}
                  className="rounded-3xl shadow-elevated w-full max-w-md"
                  placeholderLabel="Foto: mamá haciendo respiración suave, ambiente cálido"
                />
              </motion.div>

              {/* Content */}
              <div>
                {/* Quote block */}
                <motion.blockquote
                  {...fade(0.2)}
                  className="border-l-4 border-gold pl-6 py-2 mb-8"
                >
                  <p className="font-serif italic text-body-lg text-text-light">
                    &ldquo;Si en lugar de forzar los músculos del abdomen, los
                    reactivas con respiración profunda, el cuerpo vuelve a
                    sostenerse solo.&rdquo;
                  </p>
                </motion.blockquote>

                {/* Metaphor */}
                <motion.p
                  {...fade(0.3)}
                  className="text-body text-text-light mb-6"
                >
                  Imagina un interruptor de luz. Puedes golpear la pared para que
                  prenda… o simplemente presionar el interruptor. Zero Diastasis&trade;
                  es el interruptor. No fuerza nada — reactiva lo que ya tienes.
                </motion.p>

                {/* Description */}
                <motion.p
                  {...fade(0.4)}
                  className="text-body text-text-light"
                >
                  Nosotras tomamos esa técnica, la simplificamos para mamás reales
                  con vidas reales, y creamos Zero Diastasis&trade; — un protocolo
                  de 28 días que reactiva tu corsé natural con ejercicios suaves de
                  respiración.
                </motion.p>
              </div>
            </div>

            {/* Benefit cards 2x2 */}
            <motion.div
              {...fade(0.5)}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto"
            >
              {benefits.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
                  className="bg-white rounded-3xl shadow-card p-5 md:p-6 flex flex-col items-center text-center gap-3 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-blush-light/50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blush-strong" aria-hidden="true" />
                  </div>
                  <span className="text-small font-medium text-text">
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
