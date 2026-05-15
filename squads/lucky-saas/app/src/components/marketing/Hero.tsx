import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

function RenewalsMockup() {
  const items = [
    { name: 'João Silva', type: 'Auto', days: 5, urgency: 'overdue' as const },
    { name: 'Maria Costa', type: 'Vida', days: 12, urgency: 'soon' as const },
    { name: 'Pedro Alves', type: 'Saúde', days: 28, urgency: 'soon' as const },
    { name: 'Ana Lima', type: 'Residencial', days: 44, urgency: 'ok' as const },
  ]

  const urgencyConfig = {
    overdue: { dot: 'bg-[#DC2626]', badge: 'bg-[#FEE2E2] text-[#DC2626]', label: 'Vencida' },
    soon:    { dot: 'bg-[#D97706]', badge: 'bg-[#FEF3C7] text-[#D97706]', label: '' },
    ok:      { dot: 'bg-[#0BD904]', badge: 'bg-[#F3F4F6] text-[#6B7280]', label: '' },
  }

  return (
    <div className="w-full rounded-[14px] border border-[#E5E5E5] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.10)] overflow-hidden">
      {/* Chrome bar */}
      <div className="h-9 bg-[#0D0D0D] flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#D97706]/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#0BD904]/50" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="h-3.5 w-32 rounded-[4px] bg-white/10" />
        </div>
      </div>

      {/* Layout */}
      <div className="flex" style={{ height: 252 }}>
        {/* Sidebar */}
        <div className="w-12 bg-[#0D0D0D] flex flex-col gap-1 pt-2 px-1.5 shrink-0">
          {['D', 'P', 'A', 'C'].map((l, i) => (
            <div
              key={l}
              className={`h-8 rounded-[5px] flex items-center justify-center text-[9px] font-semibold ${
                i === 2 ? 'bg-[rgba(11,217,4,0.15)] text-[#0BD904]' : 'text-[#6B7280]'
              }`}
            >
              {l}
            </div>
          ))}
        </div>

        {/* Alerts panel */}
        <div className="flex-1 bg-[#FAFAFA] p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
              <span className="text-[10px] font-bold text-[#0D0D0D]">Alertas de Renovação</span>
            </div>
            <span className="text-[9px] text-[#9CA3AF]">2 urgentes</span>
          </div>

          <div className="space-y-1.5 flex-1">
            {items.map((item) => {
              const cfg = urgencyConfig[item.urgency]
              return (
                <div key={item.name} className="bg-white rounded-[6px] border border-[#E5E5E5] px-2.5 py-2 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-[#0D0D0D] truncate">{item.name}</p>
                    <p className="text-[8px] text-[#9CA3AF]">{item.type} · vence em {item.days}d</p>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-[3px] text-[8px] font-semibold shrink-0 ${cfg.badge}`}>
                    {cfg.label || `${item.days}d`}
                  </span>
                  <div className="w-10 h-5 rounded-[4px] bg-[rgba(37,211,102,0.12)] flex items-center justify-center shrink-0">
                    <span className="text-[7px] font-bold text-[#25D366]">WA</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Alert footer */}
      <div className="h-8 bg-[#FEF3C7] border-t border-[#FDE68A] flex items-center px-3 gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
        <span className="text-[9px] font-medium text-[#D97706]">
          Premia avisa 30 dias antes — você chega antes do concorrente
        </span>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative bg-white pt-20 pb-24 px-5 overflow-hidden mkt-dot-grid">
      {/* Hero glow */}
      <div className="absolute inset-0 mkt-hero-glow pointer-events-none" />

      <div className="relative max-w-[1100px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-14">

          {/* Copy */}
          <div className="flex-1 max-w-[520px]">
            <div className="mkt-fade-in inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[rgba(11,217,4,0.30)] bg-[rgba(11,217,4,0.06)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0BD904]" />
              <span className="text-[12px] text-[#374151] font-medium">Corretores economizam 8h por semana com o Premia</span>
            </div>

            <h1 className="mkt-fade-up mkt-d-100 text-[38px] md:text-[50px] font-bold text-[#0D0D0D] leading-[1.1] tracking-tight mb-5">
              Quantas renovações você perdeu esse ano{' '}
              <span className="text-[#0BD904]">sem saber?</span>
            </h1>

            <p className="mkt-fade-up mkt-d-200 text-[17px] text-[#6B7280] leading-relaxed mb-8 max-w-[460px]">
              Premia monitora sua carteira inteira e avisa 30 dias antes de cada vencimento. Nunca mais perca um cliente para o concorrente.
            </p>

            <div className="mkt-fade-up mkt-d-300 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="mkt-pulse-green inline-flex items-center justify-center gap-2 h-12 px-7 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[15px] font-bold hover:bg-[#09C003] transition-colors"
              >
                Começar grátis agora
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[6px] border border-[#D1D1D1] bg-white text-[#374151] text-[15px] font-medium hover:bg-[#F4F4F4] transition-colors"
              >
                <Play size={14} className="text-[#6B7280]" />
                Ver como funciona
              </Link>
            </div>

            <p className="mkt-fade-up mkt-d-400 mt-4 text-[12px] text-[#9CA3AF]">
              14 dias grátis · Sem cartão de crédito · Cancele quando quiser
            </p>
          </div>

          {/* Floating mockup */}
          <div className="mkt-scale-in mkt-d-200 flex-1 w-full max-w-[500px] mx-auto lg:mx-0">
            <div className="mkt-float">
              <RenewalsMockup />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
