'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CTAButton from './CTAButton';
import { PRICE } from '@/lib/constants';

export default function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling ~600px (past the first CTA roughly)
      setVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-warm/80 backdrop-blur-xl border-t border-blush-light/30 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-small text-text-muted line-through">
                ${PRICE.original}
              </span>
              <span className="text-lg font-bold text-blush-strong">
                ${PRICE.current} USD
              </span>
            </div>
            <CTAButton size="lg" className="text-sm px-5 py-3 whitespace-nowrap">
              Empezar ahora
            </CTAButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
