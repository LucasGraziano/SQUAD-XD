'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Trash2, Pencil } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { NovoClienteModal } from '@/components/clientes/NovoClienteModal'
import { CsvImportModal } from '@/components/shared/CsvImportModal'
import { BirthdayFilterBadge } from '@/components/clientes/BirthdayFilterBadge'
import { EmptyState, FilterEmptyState } from '@/components/ui/EmptyState'
import { createClient } from '@/lib/supabase/client'
import { deleteClient } from '@/app/(dashboard)/apolices/actions'
import type { Client } from '@/types/client'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(iso))
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editClient, setEditClient] = useState<Client | undefined>(undefined)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [birthdayFilter, setBirthdayFilter] = useState(false)

  const currentMonth = new Date().getMonth() + 1

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser()
      .then(async ({ data: { user } }) => {
        if (!user) return
        const brokerResult = await supabase.from('brokers').select('id').eq('user_id', user.id).single()
        const broker = brokerResult.data as { id: string } | null
        if (!broker) return
        const { data } = await supabase
          .from('clients')
          .select('*')
          .eq('broker_id', broker.id)
          .order('name')
        setClients((data as Client[]) ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter((c) => {
    if (search) {
      const s = search.toLowerCase()
      const matchesName = c.name.toLowerCase().includes(s)
      const matchesPhone = c.phone?.includes(search.replace(/\D/g, '')) ?? false
      const matchesEmail = c.email?.toLowerCase().includes(s) ?? false
      const matchesCpf = c.cpf_cnpj?.replace(/\D/g, '').includes(search.replace(/\D/g, '')) ?? false
      if (!matchesName && !matchesPhone && !matchesEmail && !matchesCpf) return false
    }
    if (birthdayFilter) {
      if (!c.birth_date) return false
      const m = new Date(c.birth_date + 'T00:00:00').getMonth() + 1
      if (m !== currentMonth) return false
    }
    return true
  })

  async function handleDeleteClient(id: string) {
    setDeleting(true)
    await deleteClient(id)
    setClients(prev => prev.filter(c => c.id !== id))
    setDeleteConfirmId(null)
    setDeleting(false)
  }

  return (
    <>
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] shadow-xl p-6 w-[360px]">
            <p className="text-[15px] font-semibold text-[#0D0D0D] mb-2">Excluir cliente?</p>
            <p className="text-[13px] text-[#6B7280] mb-5">
              O cliente e todas as suas apólices associadas podem ser afetados. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 h-9 rounded-[6px] border border-[#D1D1D1] text-[13px] text-[#6B7280] hover:bg-[#F8F8F8] transition-colors">Cancelar</button>
              <button onClick={() => handleDeleteClient(deleteConfirmId)} disabled={deleting} className="flex-1 h-9 rounded-[6px] bg-[#DC2626] text-white text-[13px] font-semibold hover:bg-[#B91C1C] disabled:opacity-60 transition-colors">
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
      <PageHeader
        title="Clientes"
        actions={
            <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCsvOpen(true)}>Importar Clientes</Button>
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus size={14} />
              Novo Cliente
            </Button>
          </div>
        }
      />
      <div className="flex-1 p-8">

        <div className="flex items-center gap-3 mb-6">
          <div className="relative max-w-[320px]">
            <Search size={14} className="absolute left-3 top-[50%] -translate-y-[50%] text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white pl-8 pr-3 text-[13px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors"
            />
          </div>
          <BirthdayFilterBadge
            active={birthdayFilter}
            onToggle={() => setBirthdayFilter((v) => !v)}
          />
        </div>

        {loading ? (
          <p className="text-[13px] text-[#9CA3AF]">Carregando...</p>
        ) : clients.length === 0 ? (
          <EmptyState
            illustration="clients"
            title="Cadastre seu primeiro cliente"
            description="Comece adicionando um cliente para gerenciar suas apólices e propostas."
            primaryCta={{ label: 'Novo cliente', onClick: () => setModalOpen(true) }}
          />
        ) : filtered.length === 0 ? (
          <FilterEmptyState
            term={birthdayFilter ? 'Aniversariantes do mês' : search}
            onClear={() => { setSearch(''); setBirthdayFilter(false) }}
          />
        ) : (
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  {['Nome', 'Telefone', 'Email', 'Cliente desde', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[rgba(11,217,4,0.1)] flex items-center justify-center flex-shrink-0">
                          <span className="text-[12px] font-semibold text-[#034001]">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[13px] font-medium text-[#0D0D0D]">{client.name}</span>
                        {client.birth_date && new Date(client.birth_date + 'T00:00:00').getMonth() + 1 === currentMonth && (
                          <span title="Aniversário este mês">🎂</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-[#6B7280]">{client.phone}</td>
                    <td className="px-5 py-3 text-[13px] text-[#6B7280]">{client.email ?? '—'}</td>
                    <td className="px-5 py-3 text-[13px] text-[#6B7280]">{formatDate(client.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/clientes/${client.id}`} className="text-[12px] text-[#0BD904] font-medium hover:underline">
                          Ver perfil →
                        </Link>
                        <button
                          onClick={() => { setEditClient(client); setModalOpen(true) }}
                          className="p-1 rounded text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
                          title="Editar cliente"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(client.id)}
                          className="p-1 rounded text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                          title="Excluir cliente"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NovoClienteModal
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditClient(undefined) }}
        client={editClient}
        onCreated={(newClient) => setClients((prev) => [newClient, ...prev].sort((a, b) => a.name.localeCompare(b.name)))}
        onUpdated={(updated) => setClients((prev) => prev.map(c => c.id === updated.id ? updated : c).sort((a, b) => a.name.localeCompare(b.name)))}
      />
      <CsvImportModal
        open={csvOpen}
        onOpenChange={setCsvOpen}
        mode="clientes"
        onDone={() => {
          const supabase = createClient()
          supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return
            const brokerResult = await supabase.from('brokers').select('id').eq('user_id', user.id).single()
            const broker = brokerResult.data as { id: string } | null
            if (!broker) return
            const { data } = await supabase.from('clients').select('*').eq('broker_id', broker.id).order('name')
            setClients((data as Client[]) ?? [])
          })
        }}
      />
    </>
  )
}
