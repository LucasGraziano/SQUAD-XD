import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { ClaimTimeline } from '@/components/sinistros/ClaimTimeline'
import { ClaimStatusBadge } from '@/components/sinistros/ClaimStatusBadge'
import { ClaimDetailActions } from '@/components/sinistros/ClaimDetailActions'
import { getClaimById } from '@/app/actions/claims'
import { CLAIM_TYPE_LABELS } from '@/types/claim'
import { RAMO_LABELS } from '@/types/policy'

function formatDate(d: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(d + 'T12:00:00'))
}

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function SinistroDetailPage({ params }: Props) {
  const { id } = await params
  const { data: claim, updates } = await getClaimById(id)

  if (!claim) notFound()

  return (
    <>
      <PageHeader
        title={`Sinistro — ${claim.clients?.name ?? '—'}`}
        subtitle={`${CLAIM_TYPE_LABELS[claim.claim_type] ?? claim.claim_type} · ${claim.policies?.seguradora ?? '—'}`}
        actions={<ClaimStatusBadge status={claim.status} size="md" />}
      />
      <div className="flex-1 p-8">
        <div className="mb-4">
          <Link
            href="/sinistros"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0D0D0D] transition-colors"
          >
            <ChevronLeft size={14} />
            Voltar
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Left col — claim info */}
          <div className="col-span-2 space-y-4">
            {/* Info card */}
            <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
              <p className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-4">Informações</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Cliente</p>
                  <p className="text-[14px] font-medium text-[#0D0D0D]">{claim.clients?.name ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Telefone</p>
                  <p className="text-[14px] text-[#0D0D0D]">{claim.clients?.phone ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Seguradora</p>
                  <p className="text-[14px] font-medium text-[#0D0D0D]">{claim.policies?.seguradora ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Ramo</p>
                  <p className="text-[14px] text-[#0D0D0D]">
                    {claim.policies ? RAMO_LABELS[claim.policies.ramo] ?? claim.policies.ramo : '—'}
                  </p>
                </div>
                {claim.policies?.policy_number && (
                  <div>
                    <p className="text-[11px] text-[#9CA3AF] mb-0.5">Nº Apólice</p>
                    <p className="text-[14px] font-mono text-[#0D0D0D]">#{claim.policies.policy_number}</p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Data da Ocorrência</p>
                  <p className="text-[14px] text-[#0D0D0D]">{formatDate(claim.occurrence_date)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Tipo</p>
                  <p className="text-[14px] text-[#0D0D0D]">
                    {CLAIM_TYPE_LABELS[claim.claim_type] ?? claim.claim_type}
                  </p>
                </div>
                {claim.insurer_process_number && (
                  <div>
                    <p className="text-[11px] text-[#9CA3AF] mb-0.5">Nº Processo Seguradora</p>
                    <p className="text-[14px] font-mono text-[#0D0D0D]">{claim.insurer_process_number}</p>
                  </div>
                )}
                {claim.estimated_value && (
                  <div>
                    <p className="text-[11px] text-[#9CA3AF] mb-0.5">Valor Estimado</p>
                    <p className="text-[14px] font-medium text-[#0D0D0D]">{formatBRL(claim.estimated_value)}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Status Atual</p>
                  <ClaimStatusBadge status={claim.status} />
                </div>
                {claim.description && (
                  <div className="col-span-2">
                    <p className="text-[11px] text-[#9CA3AF] mb-1">Descrição</p>
                    <p className="text-[13px] text-[#4B5563] bg-[#F9FAFB] rounded-[6px] px-3 py-2.5 border border-[#E5E5E5] leading-relaxed">
                      {claim.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
              <p className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-4">Histórico</p>
              <ClaimTimeline updates={updates} />
            </div>
          </div>

          {/* Right col — actions */}
          <div>
            <ClaimDetailActions claimId={claim.id} currentStatus={claim.status} />
          </div>
        </div>
      </div>
    </>
  )
}
