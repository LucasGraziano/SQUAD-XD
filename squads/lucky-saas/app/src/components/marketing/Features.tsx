'use client'

import { Reveal } from './Reveal'

function PipelineMockup() {
  const cols = [
    { label: 'Novo', color: '#9CA3AF', cards: [{ name: 'João S.', type: 'Auto' }, { name: 'Bia M.', type: 'Vida' }] },
    { label: 'Cotação', color: '#3B82F6', cards: [{ name: 'Pedro A.', type: 'Saúde' }] },
    { label: 'Negoc.', color: '#D97706', cards: [{ name: 'Ana L.', type: 'Residencial' }, { name: 'Carlos R.', type: 'Auto' }] },
    { label: 'Fechado', color: '#0BD904', cards: [{ name: 'Fernanda T.', type: 'Vida' }] },
  ]

  return (
    <div className="bg-[#F8F8F8] rounded-[12px] border border-[#E5E5E5] shadow-[0_16px_48px_rgba(0,0,0,0.08)] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold text-[#0D0D0D]">Pipeline de Leads</span>
        <span className="text-[11px] text-[#9CA3AF]">16 leads ativos</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cols.map((col) => (
          <div key={col.label}>
            <div className="flex items-center gap-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: col.color }} />
              <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-wide truncate">{col.label}</span>
            </div>
            <div className="space-y-1.5">
              {col.cards.map((card) => (
                <div key={card.name} className="bg-white rounded-[6px] border border-[#E5E5E5] px-2 py-1.5">
                  <p className="text-[9px] font-semibold text-[#0D0D0D] truncate">{card.name}</p>
                  <p className="text-[8px] text-[#9CA3AF] mt-0.5">{card.type}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
        <span className="text-[9px] text-[#D97706] font-medium">2 leads parados há mais de 7 dias</span>
      </div>
    </div>
  )
}

function AlertsMockup() {
  const items = [
    { name: 'João Silva', type: 'Auto', days: 5, value: '2.400', urgency: 'overdue' as const },
    { name: 'Maria Costa', type: 'Vida', days: 12, value: '1.800', urgency: 'soon' as const },
    { name: 'Pedro Alves', type: 'Saúde', days: 28, value: '3.200', urgency: 'soon' as const },
    { name: 'Ana Lima', type: 'Residencial', days: 45, value: '890', urgency: 'ok' as const },
  ]

  const cfg = {
    overdue: { dot: 'bg-[#DC2626]', badge: 'bg-[#FEE2E2] text-[#DC2626]', label: 'Vencida' },
    soon:    { dot: 'bg-[#D97706]', badge: 'bg-[#FEF3C7] text-[#D97706]', label: '' },
    ok:      { dot: 'bg-[#0BD904]', badge: 'bg-[#F3F4F6] text-[#6B7280]',  label: '' },
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E5E5] shadow-[0_16px_48px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#F0F0F0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
          <span className="text-[13px] font-semibold text-[#0D0D0D]">Alertas de Renovação</span>
        </div>
        <span className="text-[11px] font-medium text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-[4px]">2 urgentes</span>
      </div>
      <div className="divide-y divide-[#F5F5F5]">
        {items.map((item) => {
          const c = cfg[item.urgency]
          return (
            <div key={item.name} className="flex items-center gap-3 px-5 py-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0D0D0D]">{item.name}</p>
                <p className="text-[11px] text-[#9CA3AF]">{item.type} · R$ {item.value}/ano</p>
              </div>
              <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold shrink-0 ${c.badge}`}>
                {c.label || `${item.days}d`}
              </span>
              <div className="w-9 h-9 rounded-[8px] bg-[rgba(37,211,102,0.10)] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[rgba(37,211,102,0.20)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.556 4.1 1.524 5.824L.057 23.999l6.302-1.454A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.878 0-3.632-.512-5.138-1.398l-.36-.215-3.742.864.944-3.648-.236-.374A9.927 9.927 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CommissionsMockup() {
  const months = [
    { label: 'Jan', pct: 60, value: 'R$ 4.9k' },
    { label: 'Fev', pct: 75, value: 'R$ 6.1k' },
    { label: 'Mar', pct: 68, value: 'R$ 5.5k' },
    { label: 'Abr', pct: 88, value: 'R$ 7.2k' },
    { label: 'Mai', pct: 100, value: 'R$ 8.2k' },
  ]

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E5E5] shadow-[0_16px_48px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* Metric cards */}
      <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-b border-[#F0F0F0]">
        {[
          { label: 'Previsto', value: 'R$ 8.240' },
          { label: 'Recebido', value: 'R$ 5.600' },
          { label: 'Apólices', value: '24' },
        ].map((m) => (
          <div key={m.label} className="px-4 py-4">
            <p className="text-[20px] font-bold text-[#0D0D0D] leading-none">{m.value}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-1">{m.label}</p>
          </div>
        ))}
      </div>
      {/* Bar chart */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Comissões por mês</p>
        <div className="space-y-2.5">
          {months.map((m) => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="text-[11px] text-[#9CA3AF] w-6 shrink-0">{m.label}</span>
              <div className="flex-1 bg-[#F3F4F6] rounded-full h-2">
                <div className="h-2 rounded-full bg-[#0BD904] transition-all" style={{ width: `${m.pct}%` }} />
              </div>
              <span className="text-[11px] font-semibold text-[#0D0D0D] w-12 text-right shrink-0">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const sections = [
  {
    tag: 'Pipeline de Leads',
    title: 'Veja onde cada oportunidade está parada',
    description: 'Arraste cada prospect entre etapas — do primeiro contato ao fechamento. Coluna por coluna, você sabe exatamente quem está quente e quem precisa de atenção.',
    bullets: ['Funil visual estilo kanban', 'Notas e histórico por lead', 'Filtro por ramo e status'],
    Mockup: PipelineMockup,
    flip: false,
  },
  {
    tag: 'Alertas de Renovação',
    title: 'Chegue antes do concorrente — sempre',
    description: 'Premia avisa 30 dias antes de cada apólice vencer. Você chega na frente, faz a cotação e fecha a renovação antes de o cliente considerar outra corretora.',
    bullets: ['Alerta automático 30 dias antes', 'WhatsApp direto em 1 clique', 'Histórico de renovações por cliente'],
    Mockup: AlertsMockup,
    flip: true,
  },
  {
    tag: 'Controle de Comissões',
    title: 'Saiba exatamente quanto vai entrar esse mês',
    description: 'Veja o que vai receber, o que já entrou e quais apólices estão gerando mais receita. Chega de planilha para saber se a comissão da seguradora veio.',
    bullets: ['Previsão mensal automática', 'Histórico por seguradora', 'Relatório exportável em 1 clique'],
    Mockup: CommissionsMockup,
    flip: false,
  },
]

export function Features() {
  return (
    <section id="features" className="bg-white py-24 px-5">
      <div className="max-w-[1100px] mx-auto">
        <Reveal className="text-center mb-20">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Funcionalidades</p>
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#0D0D0D] leading-tight">
            Tudo que o corretor precisa.
            <br className="hidden md:block" />
            <span className="text-[#0BD904]"> Nada que não precisa.</span>
          </h2>
        </Reveal>

        <div className="space-y-28">
          {sections.map((section) => (
            <div
              key={section.tag}
              className={`flex flex-col ${section.flip ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-16`}
            >
              {/* Copy */}
              <Reveal
                animation={section.flip ? 'slide-right' : 'slide-left'}
                className="flex-1 max-w-[460px]"
              >
                <p className="text-[11px] font-bold text-[#0BD904] uppercase tracking-wider mb-3">{section.tag}</p>
                <h3 className="text-[24px] md:text-[32px] font-bold text-[#0D0D0D] leading-tight mb-4">
                  {section.title}
                </h3>
                <p className="text-[16px] text-[#6B7280] leading-relaxed mb-6">
                  {section.description}
                </p>
                <ul className="space-y-2.5">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[14px] text-[#374151]">
                      <span className="w-5 h-5 rounded-full bg-[rgba(11,217,4,0.12)] flex items-center justify-center shrink-0">
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="#034001" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Mockup */}
              <Reveal
                animation={section.flip ? 'slide-left' : 'slide-right'}
                className="flex-1 w-full max-w-[520px]"
              >
                <section.Mockup />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
