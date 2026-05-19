'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Plus, Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { NovoClienteModal } from '@/components/clientes/NovoClienteModal'
import { CsvImportModal } from '@/components/shared/CsvImportModal'
import { BirthdayFilterBadge } from '@/components/clientes/BirthdayFilterBadge'
import { EmptyState, FilterEmptyState } from '@/components/ui/EmptyState'
import { deleteClient } from '@/app/(dashboard)/apolices/actions'
import { fetchClients } from '@/app/actions/clients'
import type { Client } from '@/types/client'

const PER_PAGE = 30

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(iso))
}

function ClientesPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const birthdayFilter = searchParams.get('birthday') === '1'

  const [clients, setClients] = useState<Client[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editClient, setEditClient] = useState<Client | undefined>(undefined)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(search)

  const currentMonth = new Date().getMonth() + 1

  const load = useCallback(async () => {
    setLoading(true)
    const result = await fetchClients({ search, page, perPage: PER_PAGE })
    setClients(result.data)
    setTotalCount(result.count)
    setLoading(false)
  }, [search, page])

  useEffect(() => { load() }, [load])

  // Debounce search input → URL
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchInput) { params.set('search', searchInput); params.delete('page') }
      else params.delete('search')
      router.replace(`/clientes?${params.toString()}`)
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput]) // eslint-disable-line react-hooks/exhaustive-deps

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.replace(`/clientes?${params.toString()}`)
  }

  function setPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (p > 1) params.set('page', String(p))
    else params.delete('page')
    router.replace(`/clientes?${params.toString()}`)
  }

  async function handleDeleteClient(id: string) {
    setDeleting(true)
    await deleteClient(id)
    setDeleteConfirmId(null)
    setDeleting(false)
    load()
  }

  const totalPages = Math.ceil(totalCount / PER_PAGE)

  // Birthday filter applied client-side (only affects current page results)
  const filtered = birthdayFilter
    ? clients.filter(c => c.birth_date && new Date(c.birth_date + 'T00:00:00').getMonth() + 1 === currentMonth)
    : clients

  const hasActiveFilter = !!search || birthdayFilter

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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar cliente..."
              className="h-9 w-full rounded-[6px] border border-[#D1D1D1] bg-white pl-8 pr-3 text-[13px] placeholder:text-[#9CA3AF] outline-none focus:border-[#0BD904] transition-colors"
            />
          </div>
          <BirthdayFilterBadge
            active={birthdayFilter}
            onToggle={() => setParam('birthday', birthdayFilter ? null : '1')}
          />
        </div>

        {loading ? (
          <p className="text-[13px] text-[#9CA3AF]">Carregando...</p>
        ) : totalCount === 0 && !hasActiveFilter ? (
          <EmptyState
            illustration="clients"
            title="Cadastre seu primeiro cliente"
            description="Comece adicionando um cliente para gerenciar suas apólices e propostas."
            primaryCta={{ label: 'Novo cliente', onClick: () => setModalOpen(true) }}
          />
        ) : filtered.length === 0 ? (
          <FilterEmptyState
            term={birthdayFilter ? 'Aniversariantes do mês' : search}
            onClear={() => { setSearchInput(''); setParam('search', null); setParam('birthday', null) }}
          />
        ) : (
          <>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-[12px] text-[#9CA3AF]">
                  {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, totalCount)} de {totalCount} clientes
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-3 h-8 rounded-[6px] border border-[#D1D1D1] text-[12px] text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={13} /> Anterior
                  </button>
                  <span className="text-[12px] text-[#6B7280] px-1">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1 px-3 h-8 rounded-[6px] border border-[#D1D1D1] text-[12px] text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <NovoClienteModal
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditClient(undefined) }}
        client={editClient}
        onCreated={() => load()}
        onUpdated={() => load()}
      />
      <CsvImportModal
        open={csvOpen}
        onOpenChange={setCsvOpen}
        mode="clientes"
        onDone={() => load()}
      />
    </>
  )
}

export default function ClientesPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8"><p className="text-[13px] text-[#9CA3AF]">Carregando...</p></div>}>
      <ClientesPageInner />
    </Suspense>
  )
}
