import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { fetchRecoveryLeads } from '@/app/(dashboard)/pipeline/actions'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))
}

function urgencyLabel(dateStr: string): { label: string; cls: string } {
  const days = Math.floor((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (days < 0) return { label: 'Vencida', cls: 'bg-[#FEE2E2] text-[#DC2626]' }
  if (days <= 30) return { label: `${days}d`, cls: 'bg-[#FEF3C7] text-[#D97706]' }
  return { label: `${days}d`, cls: 'bg-[#FEF9C3] text-[#CA8A04]' }
}

export default async function RecuperacoesPage() {
  const { data: leads } = await fetchRecoveryLeads()

  return (
    <>
      <PageHeader
        title="Recuperações"
        actions={
          <Link
            href="/pipeline"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] border border-[#D1D1D1] bg-white text-[13px] text-[#6B7280] hover:bg-[#F4F4F4] transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar ao pipeline
          </Link>
        }
      />

      <div className="px-8 py-6">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[15px] font-semibold text-[#0D0D0D] mb-1">Nenhuma recuperação cadastrada</p>
            <p className="text-[13px] text-[#6B7280]">
              Leads marcados como &quot;Perdido&quot; com data de renovação aparecem aqui.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Lead</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Telefone</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Renovação</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Notas</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Ação</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const urg = urgencyLabel(lead.expected_renewal_date!)
                  return (
                    <tr key={lead.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-semibold text-[#0D0D0D]">{lead.name}</p>
                        {lead.email && <p className="text-[12px] text-[#6B7280]">{lead.email}</p>}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#0D0D0D]">{lead.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase ${urg.cls}`}>
                            {urg.label}
                          </span>
                          <span className="text-[12px] text-[#6B7280]">{formatDate(lead.expected_renewal_date!)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#6B7280] max-w-[240px] truncate">
                        {lead.recovery_notes ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#F3F4F6] text-[#0D0D0D] text-[12px] font-medium hover:bg-[#E5E7EB] transition-colors"
                        >
                          <MessageCircle size={12} />
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
