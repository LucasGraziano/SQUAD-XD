'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Search, User, Phone, Mail, ChevronRight, AlertTriangle, Link2, Copy, Check } from 'lucide-react'
import { StaggerGroup, StaggerItem, HoverCard } from '@/components/ui/motion'
import { initials, formatDate } from '@/lib/utils'
import type { Patient } from '@/types/database.types'

interface Props { patients: Patient[] }

const statusLabel: Record<string, string> = {
  active:   'Ativo',
  inactive: 'Inativo',
  paused:   'Pausado',
}

const statusColor: Record<string, string> = {
  active:   'bg-semantic-success-bg text-semantic-success',
  inactive: 'bg-neutral-mist text-neutral-secondary',
  paused:   'bg-semantic-warning-bg text-semantic-warning',
}

export function PatientsClient({ patients }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'paused'>('all')
  const [intakeUrl, setIntakeUrl] = useState<string | null>(null)
  const [intakeLoading, setIntakeLoading] = useState(false)
  const [intakeError, setIntakeError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function generateIntakeLink() {
    setIntakeLoading(true)
    setIntakeError(null)
    try {
      const res = await fetch('/api/intake/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const data = await res.json()
      if (data.url) {
        setIntakeUrl(data.url)
      } else {
        setIntakeError(data.error ?? 'Erro ao gerar link. Tente novamente.')
      }
    } catch {
      setIntakeError('Erro de conexão. Tente novamente.')
    }
    setIntakeLoading(false)
  }

  async function copyIntakeLink() {
    if (!intakeUrl) return
    await navigator.clipboard.writeText(intakeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filtered = patients.filter((p) => {
    const matchSearch = p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search)
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  return (
    <main className="flex-1 p-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-secondary" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-input border border-neutral-border bg-white text-sm text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'active', 'paused', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-2 rounded-input text-xs font-medium transition-all ${
                filter === s
                  ? 'bg-brand-teal text-white'
                  : 'bg-white border border-neutral-border text-neutral-secondary hover:border-brand-teal/40 hover:text-brand-teal'
              }`}
            >
              {s === 'all' ? 'Todos' : statusLabel[s]}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={generateIntakeLink}
            disabled={intakeLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 border border-neutral-border hover:border-brand-teal/40 hover:text-brand-teal text-neutral-secondary text-sm font-medium px-4 py-2.5 rounded-input transition-colors whitespace-nowrap"
            title="Gera um link para o paciente preencher os próprios dados"
          >
            <Link2 size={15} />
            {intakeLoading ? 'Gerando...' : 'Link de cadastro'}
          </motion.button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/pacientes/novo"
              className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-semibold px-4 py-2.5 rounded-input transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              Novo paciente
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Intake error */}
      {intakeError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 bg-semantic-danger-bg border border-semantic-danger/20 rounded-xl px-4 py-3 text-xs text-semantic-danger"
        >
          <AlertTriangle size={14} className="flex-shrink-0" />
          {intakeError}
        </motion.div>
      )}

      {/* Intake link banner */}
      {intakeUrl && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-3 bg-brand-teal/5 border border-brand-teal/20 rounded-xl px-4 py-3"
        >
          <Link2 size={15} className="text-brand-teal flex-shrink-0" />
          <p className="text-xs text-neutral-charcoal flex-1 truncate">
            <span className="font-medium">Link gerado:</span>{' '}
            <span className="text-brand-teal">{intakeUrl}</span>
          </p>
          <button
            onClick={copyIntakeLink}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-teal hover:text-brand-teal-dark flex-shrink-0 transition-colors"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </motion.div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <User size={40} strokeWidth={1} className="mx-auto mb-3 text-neutral-border" />
          <p className="font-medium text-neutral-charcoal mb-1">
            {search || filter !== 'all' ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
          </p>
          <p className="text-sm text-neutral-secondary mb-5">
            {search || filter !== 'all' ? 'Tente outros filtros' : 'Cadastre o primeiro paciente para começar'}
          </p>
          {!search && filter === 'all' && (
            <Link
              href="/pacientes/novo"
              className="inline-flex items-center gap-2 bg-brand-teal text-white text-sm font-semibold px-5 py-2.5 rounded-input hover:bg-brand-teal-dark transition-colors"
            >
              <Plus size={16} />
              Cadastrar primeiro paciente
            </Link>
          )}
        </motion.div>
      )}

      {/* Patient grid */}
      {filtered.length > 0 && (
        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerChildren={0.04}>
          {filtered.map((patient) => (
            <StaggerItem key={patient.id}>
              <HoverCard>
                <Link href={`/pacientes/${patient.id}`} className="card-vinculo p-5 block">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-brand-teal flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {initials(patient.full_name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-neutral-charcoal text-sm truncate">
                          {patient.full_name}
                        </p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-badge flex-shrink-0 ${statusColor[patient.status]}`}>
                          {statusLabel[patient.status]}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {patient.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-secondary">
                            <Phone size={11} strokeWidth={1.5} />
                            {patient.phone}
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-secondary truncate">
                            <Mail size={11} strokeWidth={1.5} />
                            {patient.email}
                          </div>
                        )}
                        {patient.birth_date && (
                          <p className="text-xs text-neutral-secondary">
                            Nasc. {formatDate(patient.birth_date, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </p>
                        )}
                      </div>

                      {!patient.lgpd_consent && (
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-semantic-warning">
                          <AlertTriangle size={10} />
                          Termo LGPD pendente
                        </div>
                      )}
                    </div>

                    <ChevronRight size={14} className="text-neutral-secondary flex-shrink-0 mt-1" />
                  </div>
                </Link>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </main>
  )
}
