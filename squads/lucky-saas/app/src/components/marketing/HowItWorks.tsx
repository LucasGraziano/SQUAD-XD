import { Reveal } from './Reveal'

const steps = [
  {
    num: '01',
    title: 'Cadastre clientes e apólices',
    description: 'Importe um PDF — a IA preenche tudo sozinha. Ou cadastre na mão em menos de 1 minuto. Sem planilha, sem caderninho.',
  },
  {
    num: '02',
    title: 'Acompanhe cada lead no pipeline',
    description: 'Cada prospect em uma etapa visual. Arraste, anote, mova. Você sabe exatamente quem está quente e quem ficou parado.',
  },
  {
    num: '03',
    title: 'Receba alertas e renove na hora certa',
    description: 'Premia avisa 30 dias antes do vencimento. Você chega antes do concorrente, faz a cotação e fecha a renovação.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="bg-[#F8F8F8] py-20 px-5 border-t border-[#E5E5E5]">
      <div className="max-w-[1100px] mx-auto">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Como funciona</p>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#0D0D0D] leading-tight">
            Três passos. Nunca mais perde uma renovação.
          </h2>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-0 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[22px] left-[calc(16.66%+22px)] right-[calc(16.66%+22px)] h-px bg-gradient-to-r from-[#E5E5E5] via-[#0BD904]/30 to-[#E5E5E5]" />

          {steps.map((step, i) => (
            <Reveal key={step.num} animation="fade-up" delay={i * 150} className="flex-1 flex flex-col items-center text-center px-6 mb-10 md:mb-0">
              <div className="w-11 h-11 rounded-full bg-[#0D0D0D] border-2 border-[#0D0D0D] flex items-center justify-center mb-6 relative z-10 shadow-[0_0_0_6px_#F8F8F8]">
                <span className="text-[12px] font-bold text-[#0BD904]">{step.num}</span>
              </div>
              <h3 className="text-[15px] font-semibold text-[#0D0D0D] mb-3">{step.title}</h3>
              <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-[240px]">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
