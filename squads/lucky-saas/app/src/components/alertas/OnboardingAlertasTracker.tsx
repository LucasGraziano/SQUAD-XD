'use client'

import { useEffect } from 'react'
import { updateOnboardingStep } from '@/app/actions/onboarding'

export function OnboardingAlertasTracker() {
  useEffect(() => {
    updateOnboardingStep('viewed_alertas').catch(() => {})
  }, [])

  return null
}
