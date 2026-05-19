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
  'acidentes_pessoais',
  'aeronautico',
  'agricola',
  'ambiental',
  'auto',
  'bike',
  'celular',
  'condominio',
  'consorcio',
  'credito',
  'cyber',
  'dao',
  'dental',
  'educacional',
  'empresarial',
  'engenharia',
  'fianca_locaticia',
  'funeral',
  'garantia',
  'maritimo',
  'pet',
  'prestamista',
  'rc_geral',
  'rc_produtos',
  'rc_profissional',
  'residencial',
  'riscos_operacionais',
  'saude',
  'transporte',
  'vida',
  'vida_grupo',
  'viagem',
] as const

export const RAMO_LABELS: Record<string, string> = {
  acidentes_pessoais:  'Acidentes Pessoais',
  aeronautico:         'Aeronáutico',
  agricola:            'Agrícola / Rural',
  ambiental:           'Ambiental',
  auto:                'Auto',
  bike:                'Bicicleta',
  celular:             'Celular',
  condominio:          'Condomínio',
  consorcio:           'Consórcio',
  credito:             'Crédito',
  cyber:               'Cyber',
  dao:                 'D&O',
  dental:              'Dental',
  educacional:         'Educacional',
  empresarial:         'Empresarial',
  engenharia:          'Engenharia',
  fianca_locaticia:    'Fiança Locatícia',
  funeral:             'Funeral',
  garantia:            'Garantia',
  maritimo:            'Marítimo',
  pet:                 'Pet',
  prestamista:         'Prestamista',
  rc_geral:            'RC Geral',
  rc_produtos:         'RC Produtos',
  rc_profissional:     'RC Profissional',
  residencial:         'Residencial',
  riscos_operacionais: 'Riscos Operacionais',
  saude:               'Saúde',
  transporte:          'Transporte',
  vida:                'Vida',
  vida_grupo:          'Vida em Grupo',
  viagem:              'Viagem',
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
  metadata: Record<string, string> | null
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
