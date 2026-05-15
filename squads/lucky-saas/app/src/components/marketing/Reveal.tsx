'use client'
import { useInView } from '@/hooks/useInView'

type Animation = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-in'

const MAP: Record<Animation, string> = {
  'fade-up':    'mkt-fade-up',
  'fade-in':    'mkt-fade-in',
  'slide-left': 'mkt-slide-left',
  'slide-right':'mkt-slide-right',
  'scale-in':   'mkt-scale-in',
}

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  animation?: Animation
  threshold?: number
}

export function Reveal({ children, className = '', delay = 0, animation = 'fade-up', threshold }: Props) {
  const { ref, inView } = useInView(threshold)
  return (
    <div
      ref={ref}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={`${inView ? MAP[animation] : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}
