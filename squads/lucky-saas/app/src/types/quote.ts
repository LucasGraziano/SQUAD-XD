import type { Client } from './client'

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'contracted'

export interface QuoteRequest {
  id: string
  broker_id: string
  client_id: string
  ramo: string
  object_description: string | null
  notes: string | null
  status: QuoteStatus
  sent_at: string | null
  approved_at: string | null
  rejected_at: string | null
  contracted_at: string | null
  apolice_id: string | null
  // Epic 7.5
  renewal_quote_id?: string | null
  // Epic 7.6
  lead_id?: string | null
  // Epic 7.8
  share_token?: string
  view_count?: number
  last_viewed_at?: string | null
  created_at: string
  updated_at: string
  clients?: Client
  quote_items?: QuoteItem[]
}

export interface QuoteItem {
  id: string
  quote_request_id: string
  broker_id: string
  seguradora: string
  premium_total: number
  payment_frequency: string
  franchise_value: number | null
  coverages: string[]
  exclusions: string[]
  broker_note: string | null
  is_recommended: boolean
  sort_order: number
  created_at: string
}

export interface CreateQuoteRequestInput {
  client_id: string
  ramo: string
  object_description?: string
  notes?: string
}

export interface CreateQuoteItemInput {
  quote_request_id: string
  seguradora: string
  premium_total: number
  payment_frequency: string
  franchise_value?: number
  coverages?: string[]
  exclusions?: string[]
  broker_note?: string
  is_recommended?: boolean
}
