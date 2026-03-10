'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Mail, BookOpen, Calendar, Headphones } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Mail,
    title: 'Revisa tu email',
    desc: 'Te enviamos el link de acceso a tu protocolo.',
  },
  {
    icon: BookOpen,
    title: 'Lee "El Desbloqueo"',
    desc: 'Tu e-book de bienvenida — entiende qué pasó con tu cuerpo (20 min).',
  },
  {
    icon: Headphones,
    title: 'Mañana comienza tu Día 1',
    desc: 'Tu primera audio-guía de 8 minutos te estará esperando.',
  },
  {
    icon: Calendar,
    title: 'Sigue tu calendario',
    desc: 'Usa el tracker de 28 días para no perder tu racha.',
  },
];

export default function GraciasPage() {
  return (
    <main className="min-h-screen bg-warm">
      <div className="max-w-content mx-auto px-5 py-16 md:py-24">
        {/* Success Icon */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="w-24 h-24 rounded-full bg-[#7CB68E]/10 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-[#7CB68E]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-serif text-h1 md:text-display text-text mb-4">
            ¡Felicidades!
          </h1>
          <p className="text-body-lg text-text-light max-w-md mx-auto">
            Tu acceso a <span className="font-semibold text-text">Zero Diastasis™</span> está listo.
            Tu camino hacia un abdomen más firme comienza ahora.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="space-y-4 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } },
          }}
        >
          <h2 className="font-serif text-h3 text-center mb-6 text-text">
            Tus próximos pasos
          </h2>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="card flex items-start gap-4"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-nude flex items-center justify-center">
                <step.icon className="w-6 h-6 text-blush-strong" strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-small font-semibold text-gold">
                    PASO {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-text">{step.title}</h3>
                <p className="text-small text-text-light">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Access Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link
            href="/protocolo"
            className="btn-primary text-lg px-10 py-5"
          >
            Acceder a mi protocolo
          </Link>
          <p className="text-small text-text-muted mt-4">
            También te enviamos un email con este link.
          </p>
        </motion.div>

        {/* Support */}
        <motion.p
          className="text-center text-small text-text-muted mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ¿Preguntas? Escríbenos a{' '}
          <a
            href="mailto:soporte@tudominio.com"
            className="text-blush-strong hover:underline"
          >
            soporte@tudominio.com
          </a>
        </motion.p>
      </div>
    </main>
  );
}
