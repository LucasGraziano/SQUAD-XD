export type TipoPessoa = 'pf' | 'pj'

export interface Client {
  id: string
  broker_id: string
  name: string
  phone: string
  email?: string | null
  cpf_cnpj?: string | null
  birth_date?: string | null
  cep?: string | null
  tipo_pessoa?: TipoPessoa | null
  address?: Record<string, string> | null
  tags?: string[]
  notes?: string | null
  created_at: string
  updated_at: string
}

export type DocClient = {
  id: string
  name: string
  phone: string | null
  email: string | null
}

export type DocPolicy = {
  id: string
  ramo: string
  seguradora: string
  policy_number: string | null
  start_date: string
  end_date: string
  premium_total: number
  status: string
  clients: { name: string } | null
}

export type DocToken = {
  id: string
  client_id: string
  token: string
  expires_at: string | null
  created_at: string
}

export interface CreateClientInput {
  name: string
  phone: string
  email?: string
  cpf_cnpj?: string
  birth_date?: string
  cep?: string
  tipo_pessoa?: TipoPessoa
  notes?: string
}
