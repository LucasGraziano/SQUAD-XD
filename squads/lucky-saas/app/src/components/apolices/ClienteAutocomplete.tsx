'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { searchClients, createClientAction } from '@/app/(dashboard)/apolices/actions'
import type { Client, TipoPessoa } from '@/types/client'

function formatPhone(v: string) {
  const n = v.replace(/\D/g, '').slice(0, 11)
  if (n.length <= 2) return n.length ? `(${n}` : ''
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
}

export interface ClientePrefill {
  name?: string
  phone?: string
  cpf_cnpj?: string
  tipo_pessoa?: TipoPessoa
  email?: string
  birth_date?: string
  cep?: string
}

interface Props {
  value: Client | null
  onChange: (client: Client | null) => void
  error?: string
  prefill?: ClientePrefill
}

const LABEL = 'text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1 block'
const INPUT = 'h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-[13px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors'

export function ClienteAutocomplete({ value, onChange, error, prefill }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Client[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showInlineCreate, setShowInlineCreate] = useState(false)

  // Inline create form
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newCpf, setNewCpf] = useState('')
  const [newBirthDate, setNewBirthDate] = useState('')
  const [newCep, setNewCep] = useState('')
  const [newTipo, setNewTipo] = useState<TipoPessoa>('pf')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setShowInlineCreate(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleQueryChange(q: string) {
    setQuery(q)
    if (!q.trim()) { setResults([]); setOpen(false); return }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const clients = await searchClients(q)
      setResults(clients)
      setOpen(true)
      setLoading(false)
    }, 300)
  }

  function selectClient(client: Client) {
    onChange(client)
    setQuery('')
    setOpen(false)
    setShowInlineCreate(false)
  }

  function clearSelection() {
    onChange(null)
    setQuery('')
    setResults([])
  }

  function openInlineCreate() {
    setNewName(prefill?.name ?? query)
    setNewPhone(prefill?.phone ?? '')
    setNewEmail(prefill?.email ?? '')
    setNewCpf(prefill?.cpf_cnpj ?? '')
    setNewTipo(prefill?.tipo_pessoa ?? 'pf')
    setNewBirthDate(prefill?.birth_date ?? '')
    setNewCep(prefill?.cep ?? '')
    setCreateError(null)
    setShowInlineCreate(true)
    setOpen(false)
  }

  // Auto-open inline form when prefill arrives and no client selected
  useEffect(() => {
    if (prefill?.name && !value) {
      openInlineCreate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill])

  async function handleCreate() {
    if (!newName.trim() || !newPhone.trim()) {
      setCreateError('Nome e telefone são obrigatórios.')
      return
    }
    setCreating(true)
    setCreateError(null)
    const result = await createClientAction({
      name: newName.trim(),
      phone: newPhone,
      email: newEmail || undefined,
      cpf_cnpj: newCpf || undefined,
      birth_date: newBirthDate || undefined,
      cep: newCep || undefined,
      tipo_pessoa: newTipo,
    })
    setCreating(false)
    if (result.error) { setCreateError(result.error); return }
    selectClient(result.data as Client)
    setShowInlineCreate(false)
  }

  if (value) {
    return (
      <div className="flex items-center justify-between h-[42px] rounded-[6px] border border-[#0BD904] bg-[rgba(11,217,4,0.05)] px-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[rgba(11,217,4,0.15)] flex items-center justify-center">
            <User size={12} className="text-[#034001]" />
          </div>
          <span className="text-[14px] font-medium text-[#0D0D0D]">{value.name}</span>
          <span className="text-[12px] text-[#6B7280]">{value.phone}</span>
        </div>
        <button onClick={clearSelection} className="p-1 rounded text-[#9CA3AF] hover:text-[#0D0D0D] transition-colors">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <User size={14} className="absolute left-3 top-[50%] -translate-y-[50%] text-[#9CA3AF]" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Buscar por nome, CPF ou telefone..."
          className={`h-[42px] w-full rounded-[6px] border bg-white pl-8 pr-3 text-[14px] text-[#0D0D0D] placeholder:text-[#9CA3AF] outline-none transition-colors ${
            error ? 'border-[#DC2626]' : 'border-[#D1D1D1] focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)]'
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[46px] left-0 right-0 z-50 bg-white border border-[#E5E5E5] rounded-[8px] shadow-lg overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-[13px] text-[#9CA3AF]">Buscando...</div>
          )}
          {!loading && results.length === 0 && query && (
            <div className="px-4 py-3 text-[13px] text-[#9CA3AF]">Nenhum cliente encontrado.</div>
          )}
          {results.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => selectClient(client)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F8F8] transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                <User size={13} className="text-[#6B7280]" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#0D0D0D]">{client.name}</p>
                <p className="text-[11px] text-[#9CA3AF]">{client.phone}</p>
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={openInlineCreate}
            className="w-full flex items-center gap-2 px-4 py-2.5 border-t border-[#F3F4F6] hover:bg-[#F0FDF4] transition-colors text-left"
          >
            <Plus size={14} className="text-[#0BD904]" />
            <span className="text-[13px] font-medium text-[#0BD904]">
              {query ? `Criar cliente: "${query}"` : 'Criar novo cliente'}
            </span>
          </button>
        </div>
      )}

      {/* Inline create form — campos completos */}
      {showInlineCreate && (
        <div className="mt-2 p-4 border border-[#D1D1D1] rounded-[8px] bg-[#FAFAFA] space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Novo cliente</p>
            <button type="button" onClick={() => setShowInlineCreate(false)} className="text-[#9CA3AF] hover:text-[#0D0D0D]">
              <X size={14} />
            </button>
          </div>

          {/* Tipo PF/PJ */}
          <div className="flex gap-2">
            {(['pf', 'pj'] as TipoPessoa[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setNewTipo(t)}
                className={`flex-1 h-8 rounded-[6px] text-[12px] font-medium border transition-colors ${
                  newTipo === t
                    ? 'bg-[#0BD904] border-[#0BD904] text-white'
                    : 'border-[#D1D1D1] text-[#6B7280] hover:border-[#0BD904]'
                }`}
              >
                {t === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={LABEL}>Nome *</label>
              <input className={INPUT} placeholder={newTipo === 'pj' ? 'Razão Social' : 'Nome completo'} value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Telefone *</label>
              <input className={INPUT} placeholder="(11) 99999-9999" value={newPhone} onChange={(e) => setNewPhone(formatPhone(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={LABEL}>Email</label>
              <input type="email" className={INPUT} placeholder="email@exemplo.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>{newTipo === 'pj' ? 'CNPJ' : 'CPF'}</label>
              <input className={INPUT} placeholder={newTipo === 'pj' ? '00.000.000/0001-00' : '000.000.000-00'} value={newCpf} onChange={(e) => setNewCpf(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={LABEL}>{newTipo === 'pj' ? 'Data Abertura' : 'Nascimento'}</label>
              <input type="date" className={INPUT} value={newBirthDate} onChange={(e) => setNewBirthDate(e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>CEP</label>
              <input className={INPUT} placeholder="00000-000" value={newCep} onChange={(e) => setNewCep(e.target.value)} />
            </div>
          </div>

          {createError && <p className="text-[12px] text-[#DC2626]">{createError}</p>}
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleCreate} loading={creating} type="button">
              Criar e selecionar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowInlineCreate(false)} type="button">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {error && <span className="text-[12px] text-[#DC2626] mt-1 block">{error}</span>}
    </div>
  )
}
