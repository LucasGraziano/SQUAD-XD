export type ClaimStatus =
  | 'open'
  | 'analyzing'
  | 'awaiting_docs'
  | 'approved'
  | 'paid'
  | 'closed'
  | 'denied'

export type ClaimType = 'colisao' | 'roubo' | 'incendio' | 'alagamento' | 'outros'

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  open: 'Aberto',
  analyzing: 'Em Análise',
  awaiting_docs: 'Aguardando Docs',
  approved: 'Aprovado',
  paid: 'Pago',
  closed: 'Encerrado',
  denied: 'Negado',
}

export const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  colisao: 'Colisão',
  roubo: 'Roubo',
  incendio: 'Incêndio',
  alagamento: 'Alagamento',
  outros: 'Outros',
}

export const CLAIM_STATUS_COLORS: Record<ClaimStatus, string> = {
  open: '#D97706',
  analyzing: '#6366F1',
  awaiting_docs: '#F59E0B',
  approved: '#059669',
  paid: '#0BD904',
  closed: '#6B7280',
  denied: '#EF4444',
}

export const CLAIM_STATUS_FLOW: ClaimStatus[] = [
  'open',
  'analyzing',
  'awaiting_docs',
  'approved',
  'paid',
]

export interface Claim {
  id: string
  broker_id: string
  policy_id: string
  client_id: string
  occurrence_date: string
  claim_type: ClaimType
  description?: string | null
  insurer_process_number?: string | null
  estimated_value?: number | null
  status: ClaimStatus
  created_at: string
  updated_at: string
  policies?: { policy_number?: string | null; ramo: string; seguradora: string } | null
  clients?: { name: string; phone: string } | null
}

export interface ClaimUpdate {
  id: string
  claim_id: string
  broker_id: string
  old_status?: string | null
  new_status: string
  note?: string | null
  created_at: string
}

export interface CreateClaimInput {
  policy_id: string
  client_id: string
  occurrence_date: string
  claim_type: ClaimType
  description?: string
  insurer_process_number?: string
  estimated_value?: number
}
