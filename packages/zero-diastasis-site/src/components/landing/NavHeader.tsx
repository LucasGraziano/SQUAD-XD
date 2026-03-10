'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHECKOUT_URL, PRICE } from '@/lib/constants';

export default function NavHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Skip link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>

      <AnimatePresence>
        {scrolled && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-warm/85 backdrop-blur-xl border-b border-nude-dark/10"
          >
            <div className="content-width flex items-center justify-between px-5 py-3">
              <span className="font-serif text-lg font-bold text-text">
                Zero Diastasis<span className="text-blush-strong">&trade;</span>
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="#pricing"
                  className="text-sm font-medium text-text-light hover:text-text transition-colors hidden sm:inline"
                >
                  Ver precio
                </a>
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold bg-blush-strong text-white px-4 py-2 rounded-full hover:bg-blush-dark transition-colors"
                >
                  Empezar — ${PRICE.current}
                </a>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}
