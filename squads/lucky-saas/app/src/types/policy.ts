import type { Client } from './client'

export type PolicyStatus = 'ativa' | 'vencida' | 'cancelada' | 'suspensa' | 'renovada'
export type PaymentFrequency = 'mensal' | 'trimestral' | 'semestral' | 'anual'

export const PAYMENT_LABELS: Record<PaymentFrequency, string> = {
  mensal: 'Mensal',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual',
}

export const POLICY_RAMOS = [
  'auto', 'vida', 'saude', 'residencial', 'empresarial', 'viagem', 'consorcio',
] as const

export const RAMO_LABELS: Record<string, string> = {
  auto: 'Auto',
  vida: 'Vida',
  saude: 'Saúde',
  residencial: 'Residencial',
  empresarial: 'Empresarial',
  viagem: 'Viagem',
  consorcio: 'Consórcio',
}

export type PolicyTab = 'todas' | 'ativas' | 'vencendo' | 'vencidas' | 'arquivadas'

export type PolicyRow = {
  id: string
  ramo: string
  seguradora: string
  start_date: string
  end_date: string
  premium_total: number
  commission_pct: number
  commission_expected: number
  status: string
  created_at: string
}

export interface Policy {
  id: string
  broker_id: string
  client_id: string
  policy_number?: string | null
  ramo: string
  seguradora: string
  start_date: string
  end_date: string
  premium_total: number
  payment_frequency: PaymentFrequency
  installments: number
  commission_pct: number
  commission_expected: number
  status: PolicyStatus
  franquia?: number | null
  notes?: string | null
  metadata: Record<string, string>
  created_at: string
  updated_at: string
  // Joined
  clients?: Client
}

export interface CreatePolicyInput {
  client_id: string
  ramo: string
  seguradora: string
  policy_number?: string
  start_date: string
  end_date: string
  premium_total: number
  payment_frequency: PaymentFrequency
  commission_pct: number
  notes?: string
  metadata?: Record<string, string>
}
