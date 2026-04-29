/**
 * Vínculo — Animation System
 * Framer Motion variants usados em toda a aplicação.
 * Filosofia: naturais, não mecânicos. Nada que pareça template.
 */

import type { Variants, Transition } from 'framer-motion'

// ── Easings ────────────────────────────────────────────────────
export const ease = {
  smooth:    [0.4, 0, 0.2, 1] as const,
  snappy:    [0.2, 0, 0, 1]   as const,
  spring:    { type: 'spring', stiffness: 260, damping: 20 } as Transition,
  springFirm:{ type: 'spring', stiffness: 380, damping: 30 } as Transition,
} as const

// ── Base Variants ──────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: ease.smooth } },
}

export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.smooth } },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45 } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: ease.smooth } },
}

export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.smooth } },
}

export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.smooth } },
}

// ── Stagger Container ──────────────────────────────────────────
// Wrap children com este container para stagger automático
export function staggerContainer(staggerChildren = 0.1, delayChildren = 0): Variants {
  return {
    hidden:  {},
    visible: { transition: { staggerChildren, delayChildren } },
  }
}

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.smooth } },
}

// ── Page Transition ────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: ease.smooth } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

// ── Card Hover ─────────────────────────────────────────────────
export const cardHover = {
  rest:  { y: 0,    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' },
  hover: { y: -3,   boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)', transition: { duration: 0.25, ease: ease.smooth } },
} as Variants

// ── Number Counter ─────────────────────────────────────────────
// Usado nos stats do hero e do dashboard
export const counterVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { ...ease.spring, delay: 0.1 } },
}

// ── Alert / Badge Pulse ────────────────────────────────────────
export const pulseBadge: Variants = {
  initial: { scale: 1 },
  pulse:   {
    scale: [1, 1.15, 1],
    transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
  },
}

// ── Sidebar Nav Indicator ──────────────────────────────────────
export const navIndicator: Variants = {
  inactive: { opacity: 0, scaleX: 0 },
  active:   { opacity: 1, scaleX: 1, transition: { ...ease.springFirm } },
}

// ── Hero Floating Shape ────────────────────────────────────────
export function floatingShape(duration = 6, delay = 0): Variants {
  return {
    initial: { y: 0, opacity: 0.6 },
    animate: {
      y: [-8, 8, -8],
      opacity: [0.5, 0.8, 0.5],
      transition: { duration, repeat: Infinity, ease: 'easeInOut', delay },
    },
  }
}

// ── Gradient Shimmer ───────────────────────────────────────────
export const shimmer: Variants = {
  initial: { backgroundPosition: '200% 0' },
  animate: {
    backgroundPosition: '-200% 0',
    transition: { duration: 2.5, repeat: Infinity, ease: 'linear' },
  },
}
