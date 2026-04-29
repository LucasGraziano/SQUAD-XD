'use client'

/**
 * Vínculo — Motion Primitives
 * Wrappers de uso fácil para animações comuns.
 * Todos são Client Components (Framer Motion requer browser).
 */

import { motion, useInView, useAnimation, type Variants } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { fadeUp, staggerContainer, staggerItem, pageVariants, cardHover } from '@/lib/animations'

// ── Reveal on Scroll ──────────────────────────────────────────
interface RevealProps {
  children: ReactNode
  variants?: Variants
  className?: string
  delay?: number
  once?: boolean
}

export function Reveal({ children, variants = fadeUp, className, delay = 0, once = true }: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start('visible')
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      custom={delay}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger Group ─────────────────────────────────────────────
interface StaggerGroupProps {
  children: ReactNode
  className?: string
  staggerChildren?: number
  delayChildren?: number
  once?: boolean
}

export function StaggerGroup({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0,
  once = true,
}: StaggerGroupProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-40px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start('visible')
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={staggerContainer(staggerChildren, delayChildren)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger Item ───────────────────────────────────────────────
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

// ── Page Wrapper ───────────────────────────────────────────────
export function PageMotion({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Hover Card ─────────────────────────────────────────────────
export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={cardHover}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Animated Number Counter ───────────────────────────────────
import { animate as animateValue } from 'framer-motion'

interface CounterProps {
  from?: number
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 1.4,
  prefix = '',
  suffix = '',
  className,
  decimals = 0,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView || !ref.current) return
    const node = ref.current
    const controls = animateValue(from, to, {
      duration,
      ease: [0.2, 0, 0, 1],
      onUpdate(value) {
        node.textContent = prefix + value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + suffix
      },
    })
    return () => controls.stop()
  }, [isInView, from, to, duration, prefix, suffix, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}{from.toFixed(decimals)}{suffix}
    </span>
  )
}

// ── Floating Shape (decorativo) ───────────────────────────────
interface FloatingProps {
  className?: string
  duration?: number
  delay?: number
}

export function FloatingShape({ className, duration = 6, delay = 0 }: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    />
  )
}

// ── Pulse Badge ────────────────────────────────────────────────
export function PulseDot({ className }: { className?: string }) {
  return (
    <span className={`relative flex h-2.5 w-2.5 ${className}`}>
      <motion.span
        animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        className="absolute inline-flex h-full w-full rounded-full bg-semantic-danger opacity-75"
      />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-semantic-danger" />
    </span>
  )
}

// ── Text Gradient Shimmer ──────────────────────────────────────
// Usa ouro/branco — legível em qualquer fundo escuro
export function ShimmerText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      style={{
        background: 'linear-gradient(90deg, #F2E8DC 0%, #B8955A 30%, #ffffff 55%, #CDB07A 75%, #F2E8DC 100%)',
        backgroundSize: '250% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
      animate={{ backgroundPosition: ['0% center', '250% center'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      className={className}
    >
      {children}
    </motion.span>
  )
}
