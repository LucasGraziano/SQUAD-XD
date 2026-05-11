'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { ProposalList } from '@/components/propostas/ProposalList'
import { NewProposalModal } from '@/components/propostas/NewProposalModal'
import { getProposals } from '@/app/actions/proposals'
import type { Proposal, ProposalStatus } from '@/app/actions/proposals'
import { cn } from '@/lib/utils/cn'

const STATUS_TABS: { id: ProposalStatus | 'todas'; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'rascunho', label: 'Rascunho' },
  { id: 'enviada', label: 'Enviadas' },
  { id: 'em_analise', label: 'Em Análise' },
  { id: 'emitida', label: 'Emitidas' },
  { id: 'recusada', label: 'Recusadas' },
  { id: 'cancelada', label: 'Canceladas' },
]

export default function PropostasPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ProposalStatus | 'todas'>('todas')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProposals().then(data => {
      setProposals(data)
      setLoading(false)
    })
  }, [])

  const filtered = activeTab === 'todas' ? proposals : proposals.filter(p => p.status === activeTab)

  const countsMap = proposals.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <>
      <PageHeader
        title="Propostas"
        subtitle={`${proposals.filter(p => ['enviada', 'em_analise'].includes(p.status)).length} aguardando resposta`}
        actions={
          <Button size="sm" onClick={() => setModalOpen(true)}>Nova Proposta</Button>
        }
      />

      <div className="flex-1 p-8">
        {/* Tab bar */}
        <div className="flex gap-0 border-b border-[#E5E5E5] mb-6">
          {STATUS_TABS.map(tab => {
            const count = tab.id === 'todas' ? proposals.length : (countsMap[tab.id] ?? 0)
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-[#0BD904] text-[#0D0D0D]'
                    : 'border-transparent text-[#6B7280] hover:text-[#0D0D0D]'
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                    activeTab === tab.id ? 'bg-[rgba(11,217,4,0.12)] text-[#034001]' : 'bg-[#F3F4F6] text-[#6B7280]'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[13px] text-[#9CA3AF]">Carregando...</p>
          </div>
        ) : (
          <ProposalList initialProposals={filtered} />
        )}
      </div>

      <NewProposalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreated={p => setProposals(prev => [p, ...prev])}
      />
    </>
  )
}
