import Papa from 'papaparse'

export type ImportRow = {
  cliente_nome: string
  seguradora: string
  ramo: string
  inicio_vigencia: string
  fim_vigencia: string
  premio_total: number
  numero_apolice?: string
  cpf_cliente?: string
  telefone_cliente?: string
  email_cliente?: string
  comissao_pct?: number
  notas?: string
}

export type ImportError = {
  line: number
  message: string
  raw: Record<string, string>
}

const REQUIRED = ['cliente_nome', 'seguradora', 'ramo', 'inicio_vigencia', 'fim_vigencia', 'premio_total'] as const

function parseDate(s: string): string | null {
  if (!s) return null
  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  // Try DD/MM/YYYY
  const parts = s.split('/')
  if (parts.length === 3) {
    const [d, m, y] = parts
    if (y.length === 4) return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return null
}

export function parseCsvContent(content: string): { rows: ImportRow[]; errors: ImportError[] } {
  const parsed = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.toLowerCase().trim().replace(/\s+/g, '_'),
  })

  const rows: ImportRow[] = []
  const errors: ImportError[] = []

  if (parsed.errors.length > 0) {
    errors.push({ line: 0, message: `Erro ao ler CSV: ${parsed.errors[0].message}`, raw: {} })
    return { rows, errors }
  }

  for (let i = 0; i < parsed.data.length; i++) {
    const raw = parsed.data[i]
    const line = i + 2

    const missing = REQUIRED.filter(k => !raw[k]?.trim())
    if (missing.length > 0) {
      errors.push({ line, message: `Campos obrigatórios ausentes: ${missing.join(', ')}`, raw })
      continue
    }

    const inicio = parseDate(raw.inicio_vigencia?.trim())
    const fim = parseDate(raw.fim_vigencia?.trim())

    if (!inicio) { errors.push({ line, message: 'inicio_vigencia inválido (use YYYY-MM-DD ou DD/MM/YYYY)', raw }); continue }
    if (!fim) { errors.push({ line, message: 'fim_vigencia inválido (use YYYY-MM-DD ou DD/MM/YYYY)', raw }); continue }

    const premio = parseFloat(raw.premio_total?.replace(',', '.'))
    if (isNaN(premio) || premio <= 0) { errors.push({ line, message: 'premio_total deve ser um número positivo', raw }); continue }

    rows.push({
      cliente_nome: raw.cliente_nome.trim(),
      seguradora: raw.seguradora.trim(),
      ramo: raw.ramo.trim().toLowerCase().replace(/\s+/g, '_'),
      inicio_vigencia: inicio,
      fim_vigencia: fim,
      premio_total: premio,
      numero_apolice: raw.numero_apolice?.trim() || undefined,
      cpf_cliente: raw.cpf_cliente?.trim() || undefined,
      telefone_cliente: raw.telefone_cliente?.trim() || undefined,
      email_cliente: raw.email_cliente?.trim() || undefined,
      comissao_pct: raw.comissao_pct ? parseFloat(raw.comissao_pct.replace(',', '.')) || undefined : undefined,
      notas: raw.notas?.trim() || undefined,
    })
  }

  return { rows, errors }
}
