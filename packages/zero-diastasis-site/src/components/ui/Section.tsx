'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  alternate?: boolean;
}

export default function Section({
  id,
  children,
  className = '',
  alternate = false,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`section-padding ${alternate ? 'bg-nude-light' : 'bg-warm'} ${className}`}
    >
      <div className="content-width">{children}</div>
    </motion.section>
  );
}
