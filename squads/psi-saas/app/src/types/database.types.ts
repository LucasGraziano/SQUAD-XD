export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ── Row types (standalone — used by Database AND as convenience exports) ──
type PsychologistRow = {
  id: string
  user_id: string
  full_name: string
  crp: string
  email: string
  phone: string | null
  avatar_url: string | null
  bio: string | null
  theoretical_orientation: string | null
  session_duration_minutes: number
  session_price_cents: number
  billing_cycle: 'per_session' | 'weekly' | 'monthly'
  timezone: string
  onboarding_completed: boolean
  onboarding_step: number
  created_at: string
  updated_at: string
}

type PatientRow = {
  id: string
  psychologist_id: string
  full_name: string
  email: string | null
  phone: string | null
  birth_date: string | null
  cpf_encrypted: string | null
  address: Json | null
  emergency_contact: Json | null
  source: string | null
  status: 'active' | 'inactive' | 'paused'
  lgpd_consent: boolean
  lgpd_consent_date: string | null
  notes: string | null
  session_price_cents: number | null
  billing_cycle: 'per_session' | 'weekly' | 'monthly' | null
  created_at: string
  updated_at: string
}

type AvailabilitySlotRow = {
  id: string
  psychologist_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_recurring: boolean
  created_at: string
}

type SessionRow = {
  id: string
  psychologist_id: string
  patient_id: string
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'
  session_number: number
  modality: 'presential' | 'online'
  price_cents: number
  billing_cycle: 'per_session' | 'weekly' | 'monthly'
  google_calendar_event_id: string | null
  whatsapp_confirmation_sent: boolean
  confirmed_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
}

type SessionNoteRow = {
  id: string
  session_id: string
  psychologist_id: string
  patient_id: string
  content_encrypted: string
  content_iv: string
  content_salt: string
  is_immutable: boolean
  immutable_at: string | null
  lineage_analysis_id: string | null
  created_at: string
  updated_at: string
}

type PaymentRow = {
  id: string
  psychologist_id: string
  patient_id: string
  session_id: string | null
  amount_cents: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
  billing_cycle: 'per_session' | 'weekly' | 'monthly'
  due_date: string
  paid_at: string | null
  pagarme_order_id: string | null
  pagarme_charge_id: string | null
  pix_qr_code: string | null
  pix_copy_paste: string | null
  receipt_sent: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

type AbandonmentScoreRow = {
  id: string
  psychologist_id: string
  patient_id: string
  score: number
  level: 'low' | 'medium' | 'high' | 'critical'
  absence_rate: number
  days_since_last_session: number
  confirmation_response_rate: number
  reschedule_pattern: number
  alert_sent: boolean
  alert_sent_at: string | null
  dismissed: boolean
  dismissed_at: string | null
  calculated_at: string
}

type LineageAnalysisRow = {
  id: string
  psychologist_id: string
  dominant_approach: string
  approach_breakdown: Json
  confidence_score: number
  notes_analyzed_count: number
  top_techniques: string[]
  top_themes: string[]
  insight: string | null
  analyzed_at: string
}

type SubscriptionRow = {
  id: string
  psychologist_id: string
  plan: 'solo' | 'clinico' | 'pro'
  status: 'active' | 'trialing' | 'cancelled' | 'past_due'
  trial_ends_at: string | null
  current_period_start: string
  current_period_end: string
  pagarme_subscription_id: string | null
  created_at: string
  updated_at: string
}

type AuditLogRow = {
  id: string
  psychologist_id: string
  action: string
  table_name: string
  record_id: string | null
  ip_address: string | null
  user_agent: string | null
  metadata: Json | null
  created_at: string
}

// ── Database interface (no circular self-references) ──────────────────────
export interface Database {
  public: {
    Tables: {
      psychologists: {
        Row: PsychologistRow
        Insert: Omit<PsychologistRow, 'id' | 'created_at' | 'updated_at' | 'phone' | 'avatar_url' | 'bio' | 'theoretical_orientation' | 'onboarding_completed' | 'onboarding_step'> & {
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          theoretical_orientation?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
        }
        Update: Partial<Omit<PsychologistRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      patients: {
        Row: PatientRow
        Insert: Omit<PatientRow, 'id' | 'created_at' | 'updated_at' | 'email' | 'phone' | 'birth_date' | 'cpf_encrypted' | 'address' | 'emergency_contact' | 'source' | 'status' | 'lgpd_consent' | 'lgpd_consent_date' | 'notes' | 'session_price_cents' | 'billing_cycle'> & {
          email?: string | null
          phone?: string | null
          birth_date?: string | null
          cpf_encrypted?: string | null
          address?: Json | null
          emergency_contact?: Json | null
          source?: string | null
          status?: 'active' | 'inactive' | 'paused'
          lgpd_consent?: boolean
          lgpd_consent_date?: string | null
          notes?: string | null
          session_price_cents?: number | null
          billing_cycle?: 'per_session' | 'weekly' | 'monthly' | null
        }
        Update: Partial<Omit<PatientRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: 'patients_psychologist_id_fkey'
            columns: ['psychologist_id']
            isOneToOne: false
            referencedRelation: 'psychologists'
            referencedColumns: ['id']
          }
        ]
      }
      availability_slots: {
        Row: AvailabilitySlotRow
        Insert: Omit<AvailabilitySlotRow, 'id' | 'created_at'>
        Update: Partial<Omit<AvailabilitySlotRow, 'id' | 'created_at'>>
        Relationships: []
      }
      sessions: {
        Row: SessionRow
        Insert: Omit<SessionRow, 'id' | 'created_at' | 'updated_at' | 'status' | 'google_calendar_event_id' | 'whatsapp_confirmation_sent' | 'confirmed_at' | 'cancelled_at' | 'cancellation_reason'> & {
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'
          google_calendar_event_id?: string | null
          whatsapp_confirmation_sent?: boolean
          confirmed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
        }
        Update: Partial<Omit<SessionRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: 'sessions_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sessions_psychologist_id_fkey'
            columns: ['psychologist_id']
            isOneToOne: false
            referencedRelation: 'psychologists'
            referencedColumns: ['id']
          }
        ]
      }
      session_notes: {
        Row: SessionNoteRow
        Insert: Omit<SessionNoteRow, 'id' | 'created_at' | 'updated_at' | 'is_immutable' | 'immutable_at' | 'lineage_analysis_id'> & {
          is_immutable?: boolean
          immutable_at?: string | null
          lineage_analysis_id?: string | null
        }
        Update: Partial<Omit<SessionNoteRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: 'session_notes_session_id_fkey'
            columns: ['session_id']
            isOneToOne: true
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          }
        ]
      }
      payments: {
        Row: PaymentRow
        Insert: Omit<PaymentRow, 'id' | 'created_at' | 'updated_at' | 'session_id' | 'status' | 'paid_at' | 'pagarme_order_id' | 'pagarme_charge_id' | 'pix_qr_code' | 'pix_copy_paste' | 'receipt_sent' | 'notes'> & {
          session_id?: string | null
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
          paid_at?: string | null
          pagarme_order_id?: string | null
          pagarme_charge_id?: string | null
          pix_qr_code?: string | null
          pix_copy_paste?: string | null
          receipt_sent?: boolean
          notes?: string | null
        }
        Update: Partial<Omit<PaymentRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: 'payments_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          }
        ]
      }
      abandonment_scores: {
        Row: AbandonmentScoreRow
        Insert: Omit<AbandonmentScoreRow, 'id' | 'alert_sent' | 'alert_sent_at' | 'dismissed' | 'dismissed_at'> & {
          alert_sent?: boolean
          alert_sent_at?: string | null
          dismissed?: boolean
          dismissed_at?: string | null
        }
        Update: Partial<Omit<AbandonmentScoreRow, 'id'>>
        Relationships: [
          {
            foreignKeyName: 'abandonment_scores_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          }
        ]
      }
      lineage_analyses: {
        Row: LineageAnalysisRow
        Insert: Omit<LineageAnalysisRow, 'id' | 'top_techniques' | 'top_themes' | 'insight' | 'analyzed_at'> & {
          top_techniques?: string[]
          top_themes?: string[]
          insight?: string | null
          analyzed_at?: string
        }
        Update: Partial<Omit<LineageAnalysisRow, 'id'>>
        Relationships: []
      }
      subscriptions: {
        Row: SubscriptionRow
        Insert: Omit<SubscriptionRow, 'id' | 'created_at' | 'updated_at' | 'trial_ends_at' | 'pagarme_subscription_id'> & {
          trial_ends_at?: string | null
          pagarme_subscription_id?: string | null
        }
        Update: Partial<Omit<SubscriptionRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      audit_log: {
        Row: AuditLogRow
        Insert: Omit<AuditLogRow, 'id' | 'created_at'>
        Update: Partial<Omit<AuditLogRow, 'id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Psychologist        = PsychologistRow
export type Patient             = PatientRow
export type AvailabilitySlot    = AvailabilitySlotRow
export type Session             = SessionRow
export type SessionNote         = SessionNoteRow
export type Payment             = PaymentRow
export type AbandonmentScore    = AbandonmentScoreRow
export type LineageAnalysis     = LineageAnalysisRow
export type Subscription        = SubscriptionRow
export type AuditLog            = AuditLogRow
