export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      brokers: {
        Row: {
          id: string
          user_id: string
          name: string
          creci: string | null
          phone: string | null
          email: string
          logo_url: string | null
          plan: 'starter' | 'pro' | 'broker'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['brokers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['brokers']['Insert']>
      }
      clients: {
        Row: {
          id: string
          broker_id: string
          name: string
          cpf_cnpj: string | null
          email: string | null
          phone: string
          birth_date: string | null
          address: Json | null
          tags: string[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at' | 'tags'> & { tags?: string[] }
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      leads: {
        Row: {
          id: string
          broker_id: string
          client_id: string | null
          name: string
          phone: string
          email: string | null
          ramo: string | null
          status: 'novo' | 'cotacao_enviada' | 'negociacao' | 'fechado' | 'perdido'
          source: 'manual' | 'manychat' | 'instagram' | 'indicacao' | 'site'
          last_activity_at: string
          closed_at: string | null
          lost_reason: string | null
          notes: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at' | 'last_activity_at' | 'metadata'> & { metadata?: Json }
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          broker_id: string
          type: 'status_change' | 'note' | 'contact'
          content: string
          previous_status: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['lead_activities']['Row'], 'id' | 'created_at'>
        Update: never
      }
      policies: {
        Row: {
          id: string
          broker_id: string
          client_id: string
          policy_number: string | null
          ramo: string
          seguradora: string
          start_date: string
          end_date: string
          premium_total: number
          payment_frequency: 'mensal' | 'trimestral' | 'semestral' | 'anual'
          installments: number
          commission_pct: number
          commission_expected: number
          commission_type: 'angariacao' | 'renovacao' | 'mista'
          status: 'ativa' | 'vencida' | 'cancelada' | 'suspensa' | 'renovada'
          parent_policy_id: string | null
          notes: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['policies']['Row'], 'id' | 'created_at' | 'updated_at' | 'commission_expected' | 'metadata' | 'installments'> & { metadata?: Json; installments?: number }
        Update: Partial<Database['public']['Tables']['policies']['Insert']>
      }
      commissions: {
        Row: {
          id: string
          broker_id: string
          policy_id: string
          expected_amount: number
          received_amount: number | null
          expected_date: string
          received_date: string | null
          status: 'pendente' | 'recebido' | 'parcial' | 'atrasado' | 'cancelado'
          divergence_amount: number | null
          reference_month: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['commissions']['Row'], 'id' | 'created_at' | 'updated_at' | 'divergence_amount'>
        Update: Partial<Database['public']['Tables']['commissions']['Insert']>
      }
      alerts: {
        Row: {
          id: string
          broker_id: string
          policy_id: string | null
          client_id: string | null
          lead_id: string | null
          type: string
          title: string
          description: string | null
          scheduled_for: string
          status: 'pending' | 'sent' | 'dismissed' | 'snoozed'
          sent_at: string | null
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['alerts']['Row'], 'id' | 'created_at' | 'metadata'> & { metadata?: Json }
        Update: Partial<Database['public']['Tables']['alerts']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// ── Convenience types ──
export type Broker = Database['public']['Tables']['brokers']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadActivity = Database['public']['Tables']['lead_activities']['Row']
export type Policy = Database['public']['Tables']['policies']['Row']
export type Commission = Database['public']['Tables']['commissions']['Row']
export type Alert = Database['public']['Tables']['alerts']['Row']
