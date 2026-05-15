export const RAMOS = [
  { value: 'auto', label: 'Auto' },
  { value: 'vida', label: 'Vida' },
  { value: 'saude', label: 'Saúde' },
  { value: 'residencial', label: 'Residencial' },
  { value: 'empresarial', label: 'Empresarial' },
  { value: 'viagem', label: 'Viagem' },
  { value: 'consorcio', label: 'Consórcio' },
  { value: 'previdencia', label: 'Previdência' },
] as const

export type Ramo = typeof RAMOS[number]['value']

export const LEAD_SOURCES = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'site', label: 'Site' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'manual', label: 'Manual' },
  { value: 'manychat', label: 'ManyChat' },
] as const

export type LeadSource = typeof LEAD_SOURCES[number]['value']

export const LEAD_STATUSES = [
  { value: 'novo', label: 'Novo', color: 'text-blue-600' },
  { value: 'cotacao_enviada', label: 'Cotação Enviada', color: 'text-amber-600' },
  { value: 'negociacao', label: 'Negociação', color: 'text-orange-600' },
  { value: 'fechado', label: 'Fechado', color: 'text-green-600' },
  { value: 'perdido', label: 'Perdido', color: 'text-gray-500' },
] as const

export type LeadStatus = typeof LEAD_STATUSES[number]['value']
