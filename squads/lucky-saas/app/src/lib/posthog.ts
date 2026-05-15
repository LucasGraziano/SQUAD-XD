import posthog from 'posthog-js'

function isAvailable(): boolean {
  return typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_POSTHOG_KEY
}

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (!isAvailable()) return
  posthog.capture(event, properties)
}

export function capturePlanGateShown(feature: string, requiredPlan: string, currentPlan: string) {
  captureEvent('plan_gate_shown', { feature, required_plan: requiredPlan, current_plan: currentPlan })
}

export function captureUpgradeClicked(feature: string, requiredPlan: string, currentPlan: string) {
  captureEvent('upgrade_clicked', {
    feature,
    required_plan: requiredPlan,
    current_plan: currentPlan,
    source: 'plan_gate',
  })
}
