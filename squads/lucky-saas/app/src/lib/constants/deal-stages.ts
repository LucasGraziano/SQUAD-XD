export const DEAL_STAGES = [
  'prospecting',
  'draft',
  'sent',
  'approved',
  'submitted',
  'under_analysis',
  'issued',
  'contracted',
  'rejected',
] as const

export type DealStage = typeof DEAL_STAGES[number]

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  prospecting:    'Prospecção',
  draft:          'Em Cotação',
  sent:           'Enviada',
  approved:       'Aprovada',
  submitted:      'Com Seguradora',
  under_analysis: 'Em Análise',
  issued:         'Emitida',
  contracted:     'Contratada',
  rejected:       'Recusada',
}

export const DEAL_STAGE_COLORS: Record<DealStage, string> = {
  prospecting:    'text-[#6B7280] bg-[#F9FAFB]',
  draft:          'text-[#9CA3AF] bg-[#F3F4F6]',
  sent:           'text-[#2563EB] bg-[#EFF6FF]',
  approved:       'text-[#065F46] bg-[#D1FAE5]',
  submitted:      'text-[#7C3AED] bg-[#EDE9FE]',
  under_analysis: 'text-[#B45309] bg-[#FEF3C7]',
  issued:         'text-[#0369A1] bg-[#E0F2FE]',
  contracted:     'text-[#166534] bg-[#DCFCE7]',
  rejected:       'text-[#DC2626] bg-[#FEE2E2]',
}

export const DEAL_TRANSITIONS: Record<DealStage, DealStage[]> = {
  prospecting:    ['draft', 'rejected'],
  draft:          ['sent', 'rejected'],
  sent:           ['approved', 'rejected'],
  approved:       ['submitted', 'rejected'],
  submitted:      ['under_analysis', 'rejected'],
  under_analysis: ['issued', 'rejected'],
  issued:         ['contracted'],
  contracted:     [],
  rejected:       ['draft'],
}

// Estágios exibidos no Kanban do Pipeline
export const PIPELINE_STAGES: DealStage[] = [
  'prospecting',
  'draft',
  'sent',
  'approved',
  'submitted',
  'under_analysis',
  'issued',
]
// contracted e rejected saem do kanban (vão para /apolices e arquivo)
