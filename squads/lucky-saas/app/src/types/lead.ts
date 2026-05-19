export type LeadStatus = 'novo' | 'cotacao_enviada' | 'negociacao' | 'fechado' | 'perdido'
export type LeadRamo =
  | 'acidentes_pessoais' | 'aeronautico' | 'agricola' | 'ambiental'
  | 'auto' | 'bike' | 'celular' | 'condominio' | 'consorcio' | 'credito'
  | 'cyber' | 'dao' | 'dental' | 'educacional' | 'empresarial' | 'engenharia'
  | 'fianca_locaticia' | 'funeral' | 'garantia' | 'maritimo' | 'pet'
  | 'prestamista' | 'rc_geral' | 'rc_produtos' | 'rc_profissional'
  | 'residencial' | 'riscos_operacionais' | 'saude' | 'transporte'
  | 'vida' | 'vida_grupo' | 'viagem'
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
