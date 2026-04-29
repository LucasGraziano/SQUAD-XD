import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic()

const SYSTEM_PROMPT = `Você é um analisador de perfil clínico para psicólogos. Analise as notas terapêuticas fornecidas e identifique padrões de abordagem teórica.

Retorne APENAS um JSON válido (sem markdown) com esta estrutura:
{
  "dominant_approach": "string (ex: TCC, Psicanálise, Humanista, Gestalt, etc.)",
  "approach_breakdown": {
    "TCC": 0-100,
    "Psicanálise": 0-100,
    "Humanista": 0-100,
    "Gestalt": 0-100,
    "Sistêmica": 0-100,
    "Outras": 0-100
  },
  "top_techniques": ["técnica1", "técnica2", "técnica3", "técnica4", "técnica5"],
  "top_themes": ["tema1", "tema2", "tema3"],
  "insight": "Uma observação clínica relevante sobre a prática do profissional em 1-2 frases.",
  "confidence_score": 0.0-1.0
}

Os valores de approach_breakdown devem somar ~100. Base o confidence_score no volume e clareza das notas.`

export async function POST(req: NextRequest) {
  const { notes, psychologist_id } = await req.json()

  if (!notes || !Array.isArray(notes) || notes.length === 0) {
    return NextResponse.json({ error: 'Notas vazias' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const notesText = notes
    .slice(0, 50) // máximo 50 notas por análise
    .map((n, i) => `--- Nota ${i + 1} ---\n${n}`)
    .join('\n\n')

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Analise estas ${notes.length} notas clínicas e retorne o JSON de perfil:\n\n${notesText}`,
      },
    ],
  })

  const responseText = (message.content[0] as { type: string; text: string }).text

  let analysis: {
    dominant_approach: string
    approach_breakdown: Record<string, number>
    top_techniques: string[]
    top_themes: string[]
    insight: string
    confidence_score: number
  }

  try {
    analysis = JSON.parse(responseText)
  } catch {
    return NextResponse.json({ error: 'Erro ao parsear resposta da IA' }, { status: 500 })
  }

  // Salva no banco
  const { data: saved } = await supabase
    .from('lineage_analyses')
    .insert({
      psychologist_id,
      dominant_approach: analysis.dominant_approach,
      approach_breakdown: analysis.approach_breakdown,
      confidence_score: analysis.confidence_score,
      notes_analyzed_count: notes.length,
      top_techniques: analysis.top_techniques ?? [],
      top_themes: analysis.top_themes ?? [],
      insight: analysis.insight ?? null,
    })
    .select()
    .single()

  return NextResponse.json({ analysis, id: saved?.id })
}
