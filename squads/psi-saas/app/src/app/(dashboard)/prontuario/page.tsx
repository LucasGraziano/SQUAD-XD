'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, ChevronRight, Lock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'

const supabase = createClient()
import { StaggerGroup, StaggerItem } from '@/components/ui/motion'
import { initials } from '@/lib/utils'

type PatientSummary = {
  id: string
  full_name: string
  status: string
  session_count: number
  last_session_at: string | null
  note_count: number
}

export default function ProntuarioIndexPage() {
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: psy } = await supabase
        .from('psychologists')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (!psy) return

      const { data: pats } = await supabase
        .from('patients')
        .select('id, full_name, status')
        .eq('psychologist_id', psy.id)
        .order('full_name')

      if (!pats || pats.length === 0) { setPatients([]); return }

      // Load all sessions + notes in 2 queries (avoid N+1)
      const patientIds = pats.map(p => p.id)
      const [{ data: allSessions }, { data: allNotes }] = await Promise.all([
        supabase.from('sessions')
          .select('patient_id, status, scheduled_at')
          .in('patient_id', patientIds)
          .eq('status', 'completed'),
        supabase.from('session_notes')
          .select('patient_id')
          .in('patient_id', patientIds),
      ])

      // Build lookup maps
      const sessionMap = new Map<string, { count: number; last: string | null }>()
      for (const s of allSessions ?? []) {
        const cur = sessionMap.get(s.patient_id) ?? { count: 0, last: null }
        cur.count++
        if (!cur.last || s.scheduled_at > cur.last) cur.last = s.scheduled_at
        sessionMap.set(s.patient_id, cur)
      }
      const noteCountMap = new Map<string, number>()
      for (const n of allNotes ?? []) {
        noteCountMap.set(n.patient_id, (noteCountMap.get(n.patient_id) ?? 0) + 1)
      }

      const enriched = pats.map(p => ({
        ...p,
        session_count: sessionMap.get(p.id)?.count ?? 0,
        note_count: noteCountMap.get(p.id) ?? 0,
        last_session_at: sessionMap.get(p.id)?.last ?? null,
      }))

      setPatients(enriched)
    } finally {
      setLoading(false)
    }
  }

  const filtered = patients.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header title="Prontuários" subtitle="Histórico clínico por paciente" />

      <main className="flex-1 p-6 max-w-3xl space-y-5">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-secondary" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar paciente..."
            className="w-full pl-10 pr-4 py-2.5 rounded-input border border-neutral-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
        </div>

        {/* Privacy notice */}
        <div className="flex items-center gap-2 text-xs text-neutral-secondary">
          <Lock size={11} />
          As notas clínicas são criptografadas — você precisará inserir sua senha ao abrir cada prontuário.
        </div>

        {/* Patient list */}
        {loading ? (
          <p className="text-sm text-neutral-secondary">Carregando...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={40} strokeWidth={1} className="mx-auto mb-3 text-neutral-border" />
            <p className="text-sm text-neutral-secondary">
              {search ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
            </p>
          </div>
        ) : (
          <StaggerGroup className="space-y-2" staggerChildren={0.05}>
            {filtered.map((patient) => (
              <StaggerItem key={patient.id}>
                <Link href={`/prontuario/${patient.id}`}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className="card-vinculo p-4 flex items-center gap-4 hover:border-brand-teal/30 transition-all cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {initials(patient.full_name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-charcoal text-sm">{patient.full_name}</p>
                      <p className="text-xs text-neutral-secondary mt-0.5">
                        {patient.session_count} sessão{patient.session_count !== 1 ? 'ões' : ''} realizadas
                        {patient.note_count > 0 && ` · ${patient.note_count} nota${patient.note_count !== 1 ? 's' : ''}`}
                        {patient.last_session_at && (
                          <> · Última: {new Date(patient.last_session_at).toLocaleDateString('pt-BR')}</>
                        )}
                      </p>
                    </div>

                    {/* Status + chevron */}
                    <div className="flex items-center gap-3">
                      {patient.status !== 'active' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-badge bg-neutral-mist text-neutral-secondary">
                          {patient.status === 'paused' ? 'Pausado' : 'Inativo'}
                        </span>
                      )}
                      <ChevronRight size={15} className="text-neutral-secondary" />
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </main>
    </>
  )
}
