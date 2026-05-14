import Link from 'next/link'
import { AlertTriangle, Shield, Bell, TrendingUp, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import type { Lead } from '@/types/lead'
import { RAMO_LABELS } from '@/types/lead'
import { getCalendarEvents } from '@/app/actions/calendar'
import { UpcomingEventsWidget } from '@/components/agenda/UpcomingEventsWidget'
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist'
import { FirstWinBanner } from '@/components/dashboard/FirstWinBanner'
import { PortfolioHealthWidget } from '@/components/dashboard/PortfolioHealthWidget'
import { CrossSellWidget } from '@/components/dashboard/CrossSellWidget'
import { BirthdayNotificationCard } from '@/components/dashboard/BirthdayNotificationCard'
import { getPortfolioHealthScore } from '@/app/actions/portfolio'
import { detectCrossSellOpportunities } from '@/lib/portfolio/cross-sell'

function hoursAgo(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60)
}

function formatCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let stuckLeads: Lead[] = []
  let pipelineSummary: Record<string, number> = {}
  let renewalsCritical: { id: string; client_name: string; ramo: string; end_date: string; days: number }[] = []
  let activePoliciesCount = 0
  let pendingAlertsCount = 0
  let commissionThisMonth = 0
  let openClaimsCount = 0
  let onboardingProgress: Record<string, boolean | string | null> | null = null
  let showFirstWinBanner = false
  let crossSellOpportunities: Awaited<ReturnType<typeof detectCrossSellOpportunities>> = []

  // Próximas atividades da agenda (próximos 7 dias, não concluídas, max 3)
  const now = new Date().toISOString()
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const [upcomingEventsResult, healthScore] = await Promise.all([
    getCalendarEvents({ from: now, to: in7Days, includeDone: false }),
    user ? getPortfolioHealthScore() : Promise.resolve(null),
  ])
  // Cross-sell opportunities (needs brokerId — fetched inside if(user) block)
  // Deferred to after broker fetch below
  const nextEvents = upcomingEventsResult.slice(0, 3)

  if (user) {
    const brokerResult = await supabase
      .from('brokers')
      .select('id, onboarding_progress, first_alert_fired_at, first_win_seen_at')
      .eq('user_id', user.id)
      .single()

    const broker = brokerResult.data as { id: string; onboarding_progress?: Record<string, boolean | string | null>; first_alert_fired_at?: string | null; first_win_seen_at?: string | null } | null
    if (broker?.onboarding_progress) onboardingProgress = broker.onboarding_progress
    if (broker?.first_alert_fired_at && !broker?.first_win_seen_at) {
      const firedAt = new Date(broker.first_alert_fired_at).getTime()
      showFirstWinBanner = (Date.now() - firedAt) < 48 * 60 * 60 * 1000
    }
    if (broker) {
      const today = new Date().toISOString().split('T')[0]
      const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const [leadsRes, policiesRes, renewalsRes, alertsRes, claimsRes] = await Promise.all([
        supabase
          .from('leads')
          .select('*')
          .eq('broker_id', broker.id)
          .not('status', 'in', '("fechado","perdido")')
          .order('last_activity_at', { ascending: true }),

        supabase
          .from('policies')
          .select('id', { count: 'exact', head: true })
          .eq('broker_id', broker.id)
          .eq('status', 'ativa')
          .gte('end_date', today),

        supabase
          .from('policies')
          .select('id, ramo, end_date, clients(name)')
          .eq('broker_id', broker.id)
          .eq('status', 'ativa')
          .gte('end_date', today)
          .lte('end_date', in30Days)
          .order('end_date', { ascending: true })
          .limit(5),

        supabase
          .from('alerts')
          .select('id', { count: 'exact', head: true })
          .eq('broker_id', broker.id)
          .eq('status', 'pending')
          .lte('scheduled_for', in30Days),

        supabase
          .from('claims')
          .select('id', { count: 'exact', head: true })
          .eq('broker_id', broker.id)
          .in('status', ['open', 'analyzing', 'awaiting_docs']),
      ])

      const allLeads = (leadsRes.data as Lead[]) ?? []
      stuckLeads = allLeads.filter((l) => hoursAgo(l.last_activity_at ?? l.created_at) > 48)
      pipelineSummary = allLeads.reduce<Record<string, number>>((acc, l) => {
        acc[l.status] = (acc[l.status] ?? 0) + 1
        return acc
      }, {})

      activePoliciesCount = policiesRes.count ?? 0
      pendingAlertsCount = alertsRes.count ?? 0
      openClaimsCount = claimsRes.count ?? 0

      renewalsCritical = ((renewalsRes.data ?? []) as Array<{
        id: string; ramo: string; end_date: string;
        clients: { name: string } | null
      }>).map((p) => ({
        id: p.id,
        client_name: p.clients?.name ?? '—',
        ramo: p.ramo,
        end_date: p.end_date,
        days: Math.ceil((new Date(p.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      }))

      // Comissão esperada de apólices que vencem nos próximos 30d (renovações)
      const { data: commData } = await supabase
        .from('policies')
        .select('commission_expected')
        .eq('broker_id', broker.id)
        .eq('status', 'ativa')
        .gte('end_date', today)
        .lte('end_date', in30Days)

      commissionThisMonth = ((commData ?? []) as Array<{ commission_expected: number }>)
        .reduce((sum, p) => sum + (p.commission_expected ?? 0), 0)

      // Story 7.12: Cross-sell opportunities
      try {
        crossSellOpportunities = await detectCrossSellOpportunities(broker.id)
      } catch { /* non-critical, ignore */ }
    }
  }

  const statusLabels: Record<string, string> = {
    novo: 'Novos',
    cotacao_enviada: 'Cotação',
    negociacao: 'Negociação',
  }

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="flex-1 p-8">

        {/* First Win Banner — Story 7.9 */}
        <FirstWinBanner visible={showFirstWinBanner} />

        {/* Onboarding checklist gamificado */}
        {onboardingProgress && !onboardingProgress.dismissed && (
          <OnboardingChecklist progress={onboardingProgress as unknown as Parameters<typeof OnboardingChecklist>[0]['progress']} />
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-[#DC2626]" />
              <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Leads Parados</p>
            </div>
            <p className="text-[32px] font-bold text-[#DC2626] leading-none">{stuckLeads.length}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-2">Sem atividade há +48h</p>
          </div>

          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-[#D97706]" />
              <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Renovações</p>
            </div>
            <p className="text-[32px] font-bold text-[#D97706] leading-none">{renewalsCritical.length}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-2">Vencem em 30 dias</p>
          </div>

          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-[#0BD904]" />
              <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Carteira Ativa</p>
            </div>
            <p className="text-[32px] font-bold text-[#0D0D0D] leading-none">{activePoliciesCount}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-2">Apólices vigentes</p>
          </div>

          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bell size={14} className="text-[#6B7280]" />
              <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Alertas</p>
            </div>
            <p className="text-[32px] font-bold text-[#0D0D0D] leading-none">{pendingAlertsCount}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-2">Pendentes nos próx. 30d</p>
          </div>

          <Link href="/sinistros" className="bg-white rounded-[8px] border border-[#E5E5E5] p-5 hover:border-[#D97706] transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={14} className="text-[#D97706]" />
              <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">Sinistros</p>
            </div>
            <p className="text-[32px] font-bold text-[#D97706] leading-none">{openClaimsCount}</p>
            <p className="text-[12px] text-[#9CA3AF] mt-2">Em aberto</p>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Renovações críticas */}
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] font-semibold text-[#0D0D0D]">Renovações Críticas</p>
              <Link href="/apolices?tab=vencendo" className="text-[12px] text-[#0BD904] font-medium hover:underline">
                Ver todas →
              </Link>
            </div>
            {renewalsCritical.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] py-4 text-center">Nenhuma renovação crítica. ✓</p>
            ) : (
              <div className="space-y-2">
                {renewalsCritical.map((r) => (
                  <Link
                    key={r.id}
                    href="/apolices?tab=vencendo"
                    className="flex items-center justify-between p-3 rounded-[6px] bg-[#FFFBEB] hover:bg-[#FEF3C7] transition-colors"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-[#0D0D0D]">{r.client_name}</p>
                      <p className="text-[11px] text-[#6B7280]">
                        {RAMO_LABELS[r.ramo as keyof typeof RAMO_LABELS] ?? r.ramo}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${
                      r.days <= 7 ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      {r.days}d
                    </span>
                  </Link>
                ))}
                {commissionThisMonth > 0 && (
                  <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between">
                    <p className="text-[12px] text-[#6B7280]">Comissão nas renovações</p>
                    <p className="text-[12px] font-semibold text-[#0BD904]">{formatCurrency(commissionThisMonth)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Leads parados */}
          <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] font-semibold text-[#0D0D0D]">Leads Parados</p>
              <Link href="/pipeline" className="text-[12px] text-[#0BD904] font-medium hover:underline">
                Ver pipeline →
              </Link>
            </div>
            {stuckLeads.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] py-4 text-center">Nenhum lead parado. ✓</p>
            ) : (
              <div className="space-y-2">
                {stuckLeads.slice(0, 5).map((lead) => (
                  <Link
                    key={lead.id}
                    href="/pipeline"
                    className="flex items-center justify-between p-3 rounded-[6px] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-[#0D0D0D]">{lead.name}</p>
                      <p className="text-[11px] text-[#6B7280]">
                        {lead.ramo ? RAMO_LABELS[lead.ramo] : 'Sem ramo'} · {Math.floor(hoursAgo(lead.last_activity_at ?? lead.created_at) / 24)}d sem atividade
                      </p>
                    </div>
                    <AlertTriangle size={14} className="text-[#DC2626] flex-shrink-0" />
                  </Link>
                ))}
                {stuckLeads.length > 5 && (
                  <Link href="/pipeline" className="block text-center text-[12px] text-[#6B7280] hover:text-[#0BD904] py-1">
                    +{stuckLeads.length - 5} mais no pipeline
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Legacy static onboarding removed — replaced by OnboardingChecklist above */}

        {/* Saúde da Carteira — Story 7.11 */}
        {healthScore && (
          <div className="mt-4">
            <PortfolioHealthWidget data={healthScore} />
          </div>
        )}

        {/* Cross-sell — Story 7.12 */}
        {crossSellOpportunities.length > 0 && (
          <div className="mt-4">
            <CrossSellWidget opportunities={crossSellOpportunities} />
          </div>
        )}

        {/* Birthday notifications — Story 7.15 */}
        <div className="mt-4">
          <BirthdayNotificationCard />
        </div>

        {/* Próximas Atividades */}
        <div className="mt-4">
          <UpcomingEventsWidget events={nextEvents} />
        </div>

        {/* Pipeline summary bar */}
        {Object.keys(pipelineSummary).length > 0 && (
          <div className="mt-4 bg-white rounded-[8px] border border-[#E5E5E5] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] font-semibold text-[#0D0D0D]">Pipeline — Resumo</p>
              <Link href="/pipeline" className="text-[12px] text-[#0BD904] font-medium hover:underline">
                Ver tudo →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(statusLabels).map(([status, label]) => (
                <div key={status} className="text-center">
                  <p className="text-[28px] font-bold text-[#0D0D0D]">{pipelineSummary[status] ?? 0}</p>
                  <p className="text-[12px] text-[#6B7280] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
