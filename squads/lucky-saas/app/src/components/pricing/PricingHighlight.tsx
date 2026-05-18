'use client'

import { useEffect } from 'react'
import type { Plan } from '@/lib/stripe'

export function PricingHighlight({ plan }: { plan: Plan }) {
  useEffect(() => {
    const el = document.getElementById(`plan-${plan}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [plan])

  return null
}
