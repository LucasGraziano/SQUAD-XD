import { getDeals } from '@/app/actions/deals'
import { DEAL_STAGE_LABELS, DEAL_STAGE_COLORS } from '@/lib/constants/deal-stages'
import type { DealSummary } from '@/app/actions/deals'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function DealRow({ deal }: { deal: DealSummary }) {
  const recommended = deal.deal_items.find(i => i.is_recommended) ?? deal.deal_items[0]
  const colorCls = DEAL_STAGE_COLORS[deal.stage] ?? 'text-[#9CA3AF] bg-[#F3F4F6]'

  return (
    <Link
      href={`/deals/${deal.id}`}
      className="flex items-center gap-4 px-6 py-4 hover:bg-[#F8F8F8] transition-colors border-b border-[#F3F4F6] last:border-0"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#0D0D0D] truncate">
          {deal.clients?.name ?? '—'}
        </p>
        <p className="text-[12px] text-[#9CA3AF] mt-0.5">{deal.ramo}</p>
      </div>

      <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-[4px] ${colorCls}`}>
        {DEAL_STAGE_LABELS[deal.stage]}
      </span>

      <p className="shrink-0 text-[13px] font-medium text-[#374151] w-28 text-right">
        {recommended ? formatBRL(recommended.premium_total) : '—'}
      </p>

      <p className="shrink-0 text-[12px] text-[#9CA3AF] w-24 text-right">
        {new Date(deal.created_at).toLocaleDateString('pt-BR')}
      </p>
    </Link>
  )
}

export default async function DealsPage() {
  const deals = await getDeals({ limit: 200 })

  const contracted = deals.filter(d => d.stage === 'contracted')
  const rejected = deals.filter(d => d.stage === 'rejected')
  const active = deals.filter(d => d.stage !== 'contracted' && d.stage !== 'rejected')

  return (
    <>
      <PageHeader
        title="Negociações"
        subtitle={`${active.length} ativa${active.length !== 1 ? 's' : ''} · ${contracted.length} contratada${contracted.length !== 1 ? 's' : ''}`}
        actions={
          <Link
            href="/pipeline"
            className="h-9 px-4 rounded-[6px] bg-[#0BD904] text-[#034001] text-[13px] font-semibold hover:bg-[#09C003] transition-colors inline-flex items-center"
          >
            Ver Pipeline →
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto p-8">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-[15px] font-semibold text-[#374151]">Nenhuma negociação ainda</p>
            <p className="text-[13px] text-[#9CA3AF]">Inicie pelo Pipeline para criar seu primeiro deal.</p>
            <Link
              href="/pipeline"
              className="mt-2 h-9 px-4 rounded-[6px] bg-[#0BD904] text-[#034001] text-[13px] font-semibold hover:bg-[#09C003] transition-colors inline-flex items-center"
            >
              Ir para Pipeline
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] overflow-hidden">
            {/* Header row */}
            <div className="flex items-center gap-4 px-6 py-3 bg-[#F8F8F8] border-b border-[#E5E5E5]">
              <p className="flex-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Cliente / Ramo</p>
              <p className="shrink-0 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide">Estágio</p>
              <p className="shrink-0 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide w-28 text-right">Prêmio</p>
              <p className="shrink-0 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide w-24 text-right">Criado</p>
            </div>

            {active.length > 0 && (
              <>
                <p className="px-6 py-2 text-[11px] font-semibold text-[#6B7280] bg-[#FAFAFA] border-b border-[#F3F4F6]">
                  Ativas ({active.length})
                </p>
                {active.map(d => <DealRow key={d.id} deal={d} />)}
              </>
            )}

            {contracted.length > 0 && (
              <>
                <p className="px-6 py-2 text-[11px] font-semibold text-[#065F46] bg-[rgba(11,217,4,0.04)] border-b border-[#F3F4F6]">
                  Contratadas ({contracted.length})
                </p>
                {contracted.map(d => <DealRow key={d.id} deal={d} />)}
              </>
            )}

            {rejected.length > 0 && (
              <>
                <p className="px-6 py-2 text-[11px] font-semibold text-[#9CA3AF] bg-[#FAFAFA] border-b border-[#F3F4F6]">
                  Recusadas / Arquivadas ({rejected.length})
                </p>
                {rejected.map(d => <DealRow key={d.id} deal={d} />)}
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
