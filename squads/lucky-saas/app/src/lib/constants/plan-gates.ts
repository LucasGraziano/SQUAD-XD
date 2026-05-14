export const PLAN_HIERARCHY = {
  starter: 0,
  pro: 1,
  broker: 2,
  enterprise: 3,
} as const

export type PlanKey = keyof typeof PLAN_HIERARCHY
export type RequiredPlan = 'pro' | 'broker' | 'enterprise'

export const PLAN_DISPLAY: Record<PlanKey, { name: string; price: string }> = {
  starter: { name: 'Solo', price: 'R$47/mês' },
  pro: { name: 'Profissional', price: 'R$97/mês' },
  broker: { name: 'Equipe', price: 'R$197/mês' },
  enterprise: { name: 'Enterprise', price: 'Sob consulta' },
}

export function meetsRequirement(currentPlan: string, requiredPlan: RequiredPlan): boolean {
  // trialing users get Profissional-level access
  const normalized = currentPlan === 'trialing' ? 'pro' : currentPlan
  const currentLevel = PLAN_HIERARCHY[normalized as PlanKey] ?? 0
  const requiredLevel = PLAN_HIERARCHY[requiredPlan]
  return currentLevel >= requiredLevel
}

export interface GateConfig {
  requiredPlan: RequiredPlan
  anchor: string
  modal: 'soft' | 'hard'
  upgradeHref: string
}

export const PLAN_GATE_FEATURES: Record<string, GateConfig> = {
  'email-automatico': {
    requiredPlan: 'pro',
    anchor: 'Incluso no Profissional (R$97/mês)',
    modal: 'soft',
    upgradeHref: '/pricing?highlight=pro',
  },
  'portal-cliente': {
    requiredPlan: 'pro',
    anchor: 'Incluso no Profissional (R$97/mês)',
    modal: 'soft',
    upgradeHref: '/pricing?highlight=pro',
  },
  'assinatura-digital': {
    requiredPlan: 'pro',
    anchor: 'Incluso no Profissional (R$97/mês)',
    modal: 'soft',
    upgradeHref: '/pricing?highlight=pro',
  },
  'relatorios-avancados': {
    requiredPlan: 'pro',
    anchor: 'Incluso no Profissional (R$97/mês)',
    modal: 'soft',
    upgradeHref: '/pricing?highlight=pro',
  },
  'whatsapp-api': {
    requiredPlan: 'broker',
    anchor: 'Exclusivo do plano Equipe (R$197/mês)',
    modal: 'hard',
    upgradeHref: '/pricing?highlight=equipe',
  },
  'google-calendar': {
    requiredPlan: 'broker',
    anchor: 'Exclusivo do plano Equipe (R$197/mês)',
    modal: 'soft',
    upgradeHref: '/pricing?highlight=equipe',
  },
  'relatorio-carteira': {
    requiredPlan: 'pro',
    anchor: 'Incluso no Profissional (R$97/mês)',
    modal: 'soft',
    upgradeHref: '/pricing?highlight=pro',
  },
}
