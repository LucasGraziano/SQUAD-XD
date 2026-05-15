'use server'

import Groq from 'groq-sdk'
import { extractText } from 'unpdf'

export interface ExtractedPolicy {
  nome_cliente: string | null
  cpf_cnpj: string | null
  seguradora: string | null
  ramo: string | null
  numero_apolice: string | null
  start_date: string | null
  end_date: string | null
  premium_total: number | null
  commission_pct: number | null
  valor_franquia: number | null
  coberturas: string | null
  sinistro_tel: string | null
  sinistro_zap: string | null
  placa: string | null
  objeto_segurado: string | null
  periodicidade: string | null
}

const PROMPT = `Você é um extrator de dados de apólices de seguro brasileiras.
Analise o texto abaixo e retorne APENAS um JSON válido, sem explicações, sem markdown, sem blocos de código.

Campos esperados (use null se não encontrar):
{
  "nome_cliente": string | null,
  "cpf_cnpj": string | null,
  "seguradora": string | null,
  "ramo": "auto" | "vida" | "residencial" | "empresarial" | "saude" | "rural" | "viagem" | "outros" | null,
  "numero_apolice": string | null,
  "start_date": "YYYY-MM-DD" | null,
  "end_date": "YYYY-MM-DD" | null,
  "premium_total": number | null,
  "commission_pct": number | null,
  "valor_franquia": number | null,
  "coberturas": string | null,
  "sinistro_tel": string | null,
  "sinistro_zap": string | null,
  "placa": string | null,
  "objeto_segurado": string | null,
  "periodicidade": "mensal" | "trimestral" | "semestral" | "anual" | null
}

Regras:
- Datas: converta "01/06/2025" → "2025-06-01". Se só tiver mês/ano, use o primeiro dia.
- premium_total: valor numérico total do prêmio (ex: 1500.00). Ignore parcelas.
- commission_pct: percentual de comissão do corretor se aparecer (ex: 15 para 15%).
- valor_franquia: valor da franquia em reais (número, sem símbolo).
- coberturas: liste as coberturas separadas por vírgula (ex: "Colisão, Roubo/Furto, Incêndio, Danos a Terceiros").
- sinistro_tel: telefone de sinistro/SAC 24h (ex: "0800 727 4636").
- sinistro_zap: número WhatsApp de sinistro se houver.
- placa: placa do veículo se for apólice auto (ex: "ABC1D23").
- objeto_segurado: descrição do bem segurado (ex: "Honda Civic 2022", "Apartamento Rua X 123").
- periodicidade: frequência de pagamento do prêmio.

TEXTO DA APÓLICE:`

export async function extractPolicyFromPDF(formData: FormData): Promise<
  { data: ExtractedPolicy } | { error: string }
> {
  const file = formData.get('pdf') as File | null
  if (!file) return { error: 'Nenhum arquivo enviado' }
  if (file.size > 10 * 1024 * 1024) return { error: 'Arquivo muito grande (máx 10MB)' }

  // ── Step 1: extract text via unpdf (zero API cost) ─────────────────────────
  let pdfText = ''
  try {
    const buffer = await file.arrayBuffer()
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true })
    pdfText = text ?? ''
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { error: `Não foi possível ler o PDF: ${msg}` }
  }

  if (pdfText.trim().length < 30) {
    return { error: 'PDF sem texto legível. Pode ser um documento escaneado — tente um PDF gerado digitalmente.' }
  }

  // Truncate: 3000 chars cobre 99% das apólices sem desperdiçar tokens
  const truncated = pdfText.slice(0, 3000)

  // ── Step 2: send text to Groq (free: 6000 req/dia, llama-3.1-8b) ──────────
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return { error: 'Chave da API de IA não configurada (GROQ_API_KEY).' }

  try {
    const groq = new Groq({ apiKey })

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',  // grátis, rápido, suficiente para extração
      max_tokens: 512,
      temperature: 0,
      messages: [{ role: 'user', content: `${PROMPT}\n\n${truncated}` }],
    })

    const raw = response.choices[0]?.message?.content?.trim() ?? ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { error: 'IA não retornou dados estruturados. Tente novamente.' }

    const extracted = JSON.parse(jsonMatch[0]) as ExtractedPolicy
    return { data: extracted }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido'
    return { error: `Erro na extração com IA: ${msg}` }
  }
}
