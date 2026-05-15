export type LeadStatus = 'novo' | 'cotacao_enviada' | 'negociacao' | 'fechado' | 'perdido'
export type LeadRamo = 'auto' | 'vida' | 'saude' | 'residencial' | 'empresarial' | 'viagem' | 'consorcio'
export type LeadSource = 'instagram' | 'indicacao' | 'site' | 'manual' | 'manychat'
export type ActivityType = 'status_change' | 'note' | 'contact'

export const PIPELINE_COLUMNS: { status: LeadStatus; label: string }[] = [
  { status: 'novo', label: 'Novo' },
  { status: 'cotacao_enviada', label: 'Cotação Enviada' },
  { status: 'negociacao', label: 'Negociação' },
  { status: 'fechado', label: 'Fechado' },
  { status: 'perdido', label: 'Perdido' },
]

export const RAMO_LABELS: Record<LeadRamo, string> = {
  auto: 'Auto',
  vida: 'Vida',
  saude: 'Saúde',
  residencial: 'Residencial',
  empresarial: 'Empresarial',
  viagem: 'Viagem',
  consorcio: 'Consórcio',
}

export const SOURCE_LABELS: Record<LeadSource, string> = {
  instagram: 'Instagram',
  indicacao: 'Indicação',
  site: 'Site',
  manual: 'Manual',
  manychat: 'ManyChat',
}

export interface Lead {
  id: string
  broker_id: string
  client_id?: string | null
  name: string
  phone: string
  email?: string | null
  ramo?: LeadRamo | null
  status: LeadStatus
  source?: LeadSource | null
  notes?: string | null
  last_activity_at?: string | null
  expected_renewal_date?: string | null
  recovery_notes?: string | null
  created_at: string
  updated_at: string
}

export interface LeadActivity {
  id: string
  lead_id: string
  broker_id: string
  type: ActivityType
  content: string
  previous_status?: string | null
  created_at: string
}

export interface CreateLeadInput {
  name: string
  phone: string
  email?: string
  ramo?: LeadRamo
  source?: LeadSource
  notes?: string
}
