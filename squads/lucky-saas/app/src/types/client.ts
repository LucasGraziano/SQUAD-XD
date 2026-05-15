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
