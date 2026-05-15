import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { AlertTriangle } from 'lucide-react'
import { PortalPolicyCard } from '@/components/portal/PortalPolicyCard'

interface Props {
  params: Promise<{ token: string }>
}

function daysTo(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default async function PortalPage({ params }: Props) {
  const { token } = await params

  let supabase
  try {
    supabase = createAdminClient()
  } catch {
    notFound()
  }

  const { data: tokenRecord } = await supabase
    .from('client_portal_tokens')
    .select('id, client_id, broker_id, expires_at')
    .eq('token', token)
    .is('revoked_at', null)
    .maybeSingle()

  if (!tokenRecord) notFound()

  const tokenData = tokenRecord as { id: string; client_id: string; broker_id: string; expires_at: string | null }

  if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) notFound()

  const [clientRes, policiesRes, brokerRes] = await Promise.all([
    supabase.from('clients').select('name, phone, email').eq('id', tokenData.client_id).single(),
    supabase.from('policies')
      .select('id, ramo, seguradora, policy_number, start_date, end_date, premium_total, payment_frequency, status, valor_franquia, metadata')
      .eq('client_id', tokenData.client_id)
      .eq('broker_id', tokenData.broker_id)
      .in('status', ['ativa', 'vencida'])
      .order('end_date', { ascending: true }),
    supabase.from('brokers').select('name, phone').eq('id', tokenData.broker_id).single(),
  ])

  const client = clientRes.data as { name: string; phone?: string; email?: string } | null
  const policies = (policiesRes.data ?? []) as {
    id: string; ramo: string; seguradora: string; policy_number?: string | null
    start_date: string; end_date: string; premium_total: number; payment_frequency: string
    status: string; valor_franquia?: number | null; metadata?: Record<string, string> | null
  }[]
  const broker = brokerRes.data as { name: string; phone?: string } | null

  if (!client) notFound()

  const activePolicies = policies.filter(p => p.status === 'ativa')
  const expiringIn30 = activePolicies.filter(p => { const d = daysTo(p.end_date); return d >= 0 && d <= 30 })

  function safeDaysTo(d: string) { return Math.max(0, daysTo(d)) }

  const brokerPhone = broker?.phone?.replace(/\D/g, '') ?? ''
  const whatsappUrl = brokerPhone
    ? `https://wa.me/55${brokerPhone}?text=${encodeURIComponent('Olá! Preciso de ajuda com minha apólice.')}`
    : null

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-[#0D0D0D] px-4 py-4">
        <div className="max-w-[600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C8 2 6.5 3.5 6.5 5.5C6.5 7.5 8 9 10 9C12 9 13.5 7.5 13.5 5.5C13.5 3.5 12 2 10 2Z" fill="#0BD904" />
              <path d="M4 7C2 7 0.5 8.5 0.5 10.5C0.5 12.5 2 14 4 14C6 14 7.5 12.5 7.5 10.5C7.5 8.5 6 7 4 7Z" fill="#0BD904" opacity="0.7" />
              <path d="M16 7C14 7 12.5 8.5 12.5 10.5C12.5 12.5 14 14 16 14C18 14 19.5 12.5 19.5 10.5C19.5 8.5 18 7 16 7Z" fill="#0BD904" opacity="0.7" />
            </svg>
            <span className="text-[14px] font-semibold text-white">{broker?.name ?? 'Meu Corretor'}</span>
          </div>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[rgba(11,217,4,0.15)] text-[#0BD904] text-[12px] font-medium hover:bg-[rgba(11,217,4,0.25)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar com corretor
            </a>
          )}
        </div>
      </header>

      <div className="max-w-[600px] mx-auto px-4 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#0D0D0D] mb-1">Olá, {client.name.split(' ')[0]}!</h1>
          <p className="text-[14px] text-[#6B7280]">
            Aqui estão suas apólices. Toque em qualquer card para ver coberturas e contatos de sinistro.
          </p>
        </div>

        {/* Renewal alert */}
        {expiringIn30.length > 0 && (
          <div className="mb-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-[8px] p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-[#D97706] flex-shrink-0" />
              <p className="text-[13px] font-semibold text-[#D97706]">
                {expiringIn30.length} apólice{expiringIn30.length !== 1 ? 's' : ''} vencendo em breve
              </p>
            </div>
            <p className="text-[12px] text-[#92400E]">
              Toque em cada card e clique em "Solicitar Renovação" para avisar seu corretor.
            </p>
          </div>
        )}

        {/* Policies */}
        <div className="mb-4">
          <p className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
            Suas Apólices ({activePolicies.length} ativa{activePolicies.length !== 1 ? 's' : ''})
          </p>
          {activePolicies.length === 0 ? (
            <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-6 text-center">
              <p className="text-[13px] text-[#9CA3AF]">Nenhuma apólice ativa no momento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activePolicies.map(p => {
                const days = safeDaysTo(p.end_date)
                const isExpiring = days <= 30
                return (
                  <PortalPolicyCard
                    key={p.id}
                    policy={p}
                    isExpiring={isExpiring}
                    daysLeft={days}
                    token={token}
                    brokerWhatsappUrl={whatsappUrl}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#E5E5E5] text-center">
          <p className="text-[11px] text-[#9CA3AF] mb-1">Portal do cliente por</p>
          <p className="text-[12px] font-semibold text-[#6B7280]">{broker?.name ?? 'Corretor'}</p>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-[12px] text-[#0BD904] hover:underline"
            >
              Falar com meu corretor no WhatsApp →
            </a>
          )}
          <p className="text-[10px] text-[#D1D5DB] mt-4">Powered by Premia</p>
        </div>
      </div>
    </div>
  )
}
