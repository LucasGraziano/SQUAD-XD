'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lock, ShieldCheck, Zap } from 'lucide-react';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

interface TrustBadge {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const badges: TrustBadge[] = [
  { icon: Lock, label: 'Pago 100% seguro' },
  { icon: ShieldCheck, label: '28 días de garantía' },
  { icon: Zap, label: 'Acceso inmediato' },
];

export default function TrustBadges() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="py-8 bg-white">
      <div className="content-width">
        {inView && (
          <div className="flex justify-center items-start gap-4 md:gap-8">
            {badges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={i}
                  {...fade(i * 0.12)}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-gold" aria-hidden="true" />
                  </div>
                  <span className="text-xs md:text-sm text-text-muted font-medium">
                    {badge.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
