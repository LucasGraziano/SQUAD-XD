// Alias mapping: maps common user column names → Premia field names
export const COLUMN_ALIASES: Record<string, string> = {
  // client
  'cliente': 'cliente_nome',
  'nome': 'cliente_nome',
  'segurado': 'cliente_nome',
  'nome_cliente': 'cliente_nome',
  'nome cliente': 'cliente_nome',
  'cliente_nome': 'cliente_nome',
  // seguradora
  'seguradora': 'seguradora',
  'cia': 'seguradora',
  'companhia': 'seguradora',
  // ramo
  'ramo': 'ramo',
  'tipo_seguro': 'ramo',
  'tipo seguro': 'ramo',
  'produto': 'ramo',
  // vigencia inicio
  'inicio': 'inicio_vigencia',
  'inicio_vigencia': 'inicio_vigencia',
  'vigencia_inicio': 'inicio_vigencia',
  'vigência inicio': 'inicio_vigencia',
  'data_inicio': 'inicio_vigencia',
  'data inicio': 'inicio_vigencia',
  // vigencia fim
  'fim': 'fim_vigencia',
  'vencimento': 'fim_vigencia',
  'fim_vigencia': 'fim_vigencia',
  'vigencia_fim': 'fim_vigencia',
  'vigência fim': 'fim_vigencia',
  'validade': 'fim_vigencia',
  // premio
  'premio': 'premio_total',
  'prêmio': 'premio_total',
  'valor': 'premio_total',
  'premio_mensal': 'premio_total',
  'prêmio mensal': 'premio_total',
  'premio_total': 'premio_total',
  // numero apolice
  'numero': 'numero_apolice',
  'nº': 'numero_apolice',
  'apolice': 'numero_apolice',
  'apólice': 'numero_apolice',
  'numero_apolice': 'numero_apolice',
  // comissao
  'comissao': 'comissao_pct',
  'comissão': 'comissao_pct',
  'comissao_%': 'comissao_pct',
  'comissão %': 'comissao_pct',
  'comissao_pct': 'comissao_pct',
  // other
  'cpf': 'cpf_cliente',
  'cpf_cnpj': 'cpf_cliente',
  'telefone': 'telefone_cliente',
  'fone': 'telefone_cliente',
  'email': 'email_cliente',
  'notas': 'notas',
  'observacoes': 'notas',
  'observações': 'notas',
}

export const PREMIA_FIELDS = [
  { key: 'cliente_nome', label: 'Cliente (nome)', required: true },
  { key: 'seguradora', label: 'Seguradora', required: true },
  { key: 'ramo', label: 'Ramo', required: true },
  { key: 'inicio_vigencia', label: 'Início de Vigência', required: true },
  { key: 'fim_vigencia', label: 'Fim de Vigência', required: true },
  { key: 'premio_total', label: 'Prêmio Total (R$)', required: true },
  { key: 'numero_apolice', label: 'Número da Apólice', required: false },
  { key: 'cpf_cliente', label: 'CPF/CNPJ do Cliente', required: false },
  { key: 'telefone_cliente', label: 'Telefone do Cliente', required: false },
  { key: 'email_cliente', label: 'E-mail do Cliente', required: false },
  { key: 'comissao_pct', label: 'Comissão (%)', required: false },
  { key: 'notas', label: 'Notas', required: false },
] as const

export function autoMapColumns(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {}
  for (const h of headers) {
    const normalized = h.toLowerCase().trim().replace(/\s+/g, '_')
    const alias = COLUMN_ALIASES[normalized] || COLUMN_ALIASES[h.toLowerCase().trim()]
    if (alias) mapping[h] = alias
  }
  return mapping
}
