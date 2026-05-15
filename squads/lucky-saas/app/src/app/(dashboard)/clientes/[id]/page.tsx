'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Shield, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApolicaModal } from '@/components/apolices/ApolicaModal'
import { NovoClienteModal } from '@/components/clientes/NovoClienteModal'
import { ClientPortalSection } from '@/components/clientes/ClientPortalSection'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/types/client'
import type { Policy } from '@/types/policy'
import { RAMO_LABELS } from '@/types/policy'
import { ClientApoliceHistory } from '@/components/clientes/ClientApoliceHistory'

function formatDate(s: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(s + 'T00:00:00'))
}

function formatCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function daysUntil(s: string) {
  return Math.ceil((new Date(s).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default function ClienteProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [brokerPlan, setBrokerPlan] = useState('starter')
  const [activeTab, setActiveTab] = useState<'apolices' | 'historico'>('apolices')

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('policies').select('*').eq('client_id', id).order('end_date', { ascending: false }),
      supabase.auth.getUser().then(({ data: { user } }) =>
        user ? supabase.from('brokers').select('plan').eq('user_id', user.id).single() : Promise.resolve({ data: null })
      ),
    ]).then(([{ data: c }, { data: p }, { data: b }]) => {
      setClient(c as unknown as Client | null)
      setPolicies((p as unknown as Policy[]) ?? [])
      setBrokerPlan((b as { plan?: string } | null)?.plan ?? 'starter')
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="flex-1 flex items-center justify-center"><p className="text-[13px] text-[#9CA3AF]">Carregando...</p></div>
  if (!client) return <div className="flex-1 flex items-center justify-center"><p className="text-[13px] text-[#9CA3AF]">Cliente não encontrado.</p></div>

  const activePolicies = policies.filter(p => p.status === 'ativa')
  const totalPremium = activePolicies.reduce((sum, p) => sum + p.premium_total, 0)
  const totalCommission = activePolicies.reduce((sum, p) => sum + p.commission_expected, 0)

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F8F8F8] border-b border-[#E5E5E5] px-8 py-4">
        <Link href="/clientes" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0D0D0D] mb-3 transition-colors">
          <ArrowLeft size={13} />
          Voltar para Clientes
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(11,217,4,0.1)] flex items-center justify-center">
              <span className="text-[18px] font-bold text-[#034001]">{client.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-[20px] font-semibold text-[#0D0D0D]">{client.name}</h1>
              <div className="flex items-center gap-3 text-[13px] text-[#6B7280] mt-0.5">
                {client.phone && (
                  <a href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#0BD904] transition-colors">
                    <MessageCircle size={12} />
                    {client.phone}
                  </a>
                )}
                {client.email && <span>{client.email}</span>}
                <span>Cliente desde {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(client.created_at))}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(true)}>
              <Pencil size={14} />
              Editar
            </Button>
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Shield size={14} />
              Nova Apólice
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 space-y-6">
        {/* Financial summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Apólices ativas', value: String(activePolicies.length) },
            { label: 'Prêmio total (ativas)', value: formatCurrency(totalPremium) },
            { label: 'Comissão esperada', value: formatCurrency(totalCommission) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-[8px] border border-[#E5E5E5] p-4">
              <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">{label}</p>
              <p className="text-[22px] font-bold text-[#0D0D0D] font-mono">{value}</p>
            </div>
          ))}
        </div>

        {/* Portal */}
        <ClientPortalSection clientId={id} plan={brokerPlan} />

        {/* Tabs */}
        <div>
          <div className="flex gap-1 border-b border-[#E5E5E5] mb-4">
            {([
              { key: 'apolices', label: 'Apólices ativas' },
              { key: 'historico', label: 'Histórico de Apólices' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === key
                    ? 'border-[#0BD904] text-[#0D0D0D]'
                    : 'border-transparent text-[#6B7280] hover:text-[#0D0D0D]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'apolices' && (
            <div className="bg-white rounded-[8px] border border-[#E5E5E5] overflow-hidden">
              {policies.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-[13px] text-[#9CA3AF]">Nenhuma apólice cadastrada.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F3F4F6]">
                      {['Ramo', 'Seguradora', 'Vigência', 'Prêmio', 'Status'].map((h) => (
                        <th key={h} className="px-5 py-2.5 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {policies.map((p) => {
                      const days = daysUntil(p.end_date)
                      return (
                        <tr key={p.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                          <td className="px-5 py-3">
                            <span className="px-2 py-0.5 rounded-[4px] bg-[rgba(11,217,4,0.08)] text-[#034001] text-[11px] font-medium">
                              {RAMO_LABELS[p.ramo] ?? p.ramo}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-[13px] text-[#6B7280]">{p.seguradora}</td>
                          <td className="px-5 py-3 text-[13px] text-[#6B7280] whitespace-nowrap">
                            {formatDate(p.start_date)} → {formatDate(p.end_date)}
                          </td>
                          <td className="px-5 py-3 text-[13px] font-mono text-[#0D0D0D]">
                            {formatCurrency(p.premium_total)}
                          </td>
                          <td className="px-5 py-3">
                            {days < 0
                              ? <span className="px-2 py-0.5 rounded-[4px] bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold uppercase">Vencida</span>
                              : days <= 30
                              ? <span className="px-2 py-0.5 rounded-[4px] bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold uppercase">{days}d</span>
                              : <span className="px-2 py-0.5 rounded-[4px] bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold uppercase">Ativa</span>
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'historico' && (
            <ClientApoliceHistory clientId={id} />
          )}
        </div>
      </div>

      <ApolicaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        preselectedClient={client}
        onCreated={(p) => setPolicies(prev => [p, ...prev])}
      />
      <NovoClienteModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        client={client}
        onUpdated={(updated) => setClient(updated)}
      />
    </>
  )
}
