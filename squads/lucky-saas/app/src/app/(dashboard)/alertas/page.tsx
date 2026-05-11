import { PageHeader } from '@/components/layout/page-header'
import { AlertasList } from '@/components/alertas/AlertasList'
import { fetchAlerts } from './actions'
import { getPendencies } from '@/app/actions/pendencies'

export default async function AlertasPage() {
  const [{ data: pending, count: pendingCount }, { data: dismissed }, overduePendencies] = await Promise.all([
    fetchAlerts('pending'),
    fetchAlerts('dismissed'),
    getPendencies({ status: 'open' }),
  ])

  const today = new Date().toISOString().split('T')[0]
  const overdueOnly = overduePendencies.filter(p => p.due_date && p.due_date < today)

  const totalCount = pendingCount + overdueOnly.length

  return (
    <>
      <PageHeader
        title="Alertas"
        subtitle={totalCount > 0
          ? `${totalCount} alerta${totalCount !== 1 ? 's' : ''} pendente${totalCount !== 1 ? 's' : ''}`
          : 'Tudo em dia'
        }
      />
      {overdueOnly.length > 0 && (
        <div className="px-8 pt-6">
          <p className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wider mb-3">
            Pendências Vencidas ({overdueOnly.length})
          </p>
          <div className="space-y-2 mb-6">
            {overdueOnly.map(p => (
              <div key={p.id} className="flex items-start gap-4 rounded-[8px] border border-[#E5E5E5] p-4 bg-[#FEF2F2]">
                <div className="w-9 h-9 rounded-[8px] bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0">
                  <span className="text-[14px]">⚠️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0D0D0D]">{p.title}</p>
                  {p.description && <p className="text-[12px] text-[#6B7280] mt-0.5">{p.description}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] text-[#DC2626] font-medium">
                      Prazo: {p.due_date ? new Intl.DateTimeFormat('pt-BR').format(new Date(p.due_date + 'T12:00:00')) : '—'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-[3px] bg-[#FEE2E2] text-[#DC2626] text-[10px] font-semibold uppercase">
                      {p.priority === 'high' ? 'Alta' : p.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <AlertasList pending={pending} dismissed={dismissed} />
    </>
  )
}
