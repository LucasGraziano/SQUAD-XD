import type { QuoteStatus } from '@/types/quote'

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft:      'Rascunho',
  sent:       'Enviada',
  approved:   'Aprovada',
  rejected:   'Recusada',
  contracted: 'Contratada',
}

export const QUOTE_STATUS_COLORS: Record<QuoteStatus, string> = {
  draft:      'text-[#6B7280] bg-[#F3F4F6]',
  sent:       'text-[#2563EB] bg-[#EFF6FF]',
  approved:   'text-[#034001] bg-[rgba(11,217,4,0.10)]',
  rejected:   'text-[#DC2626] bg-[#FEE2E2]',
  contracted: 'text-[#166534] bg-[#DCFCE7]',
}

export const ALLOWED_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  draft:      ['sent'],
  sent:       ['approved', 'rejected'],
  approved:   ['contracted', 'rejected'],
  rejected:   ['draft'],
  contracted: [],
}

export const QUOTE_STATUS_ACTIONS: Record<QuoteStatus, { label: string; next: QuoteStatus }[]> = {
  draft:      [{ label: 'Marcar como Enviada', next: 'sent' }],
  sent:       [{ label: 'Aprovar', next: 'approved' }, { label: 'Recusar', next: 'rejected' }],
  approved:   [{ label: 'Recusar', next: 'rejected' }],
  rejected:   [{ label: 'Reabrir como Rascunho', next: 'draft' }],
  contracted: [],
}
