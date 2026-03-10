'use client';

import { motion } from 'framer-motion';
import { CHECKOUT_URL } from '@/lib/constants';

interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  size?: 'lg' | 'xl';
  className?: string;
  pulse?: boolean;
}

export default function CTAButton({
  children,
  href,
  size = 'lg',
  className = '',
  pulse = false,
}: CTAButtonProps) {
  const sizeClasses =
    size === 'xl'
      ? 'px-10 py-5 text-lg md:text-xl md:px-14 md:py-6'
      : 'px-8 py-4 text-body-lg';

  const link = href ?? CHECKOUT_URL;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-primary ${sizeClasses} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      animate={
        pulse
          ? {
              scale: [1, 1.025, 1],
              boxShadow: [
                '0 0 0 0 rgba(201,123,123,0)',
                '0 0 24px 4px rgba(201,123,123,0.25)',
                '0 0 0 0 rgba(201,123,123,0)',
              ],
            }
          : undefined
      }
      transition={
        pulse
          ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          : undefined
      }
    >
      {children}
    </motion.a>
  );
}
