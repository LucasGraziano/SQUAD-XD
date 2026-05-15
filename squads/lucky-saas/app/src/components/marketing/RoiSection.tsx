import { RoiCalculator } from '@/components/shared/RoiCalculator'

export function RoiSection() {
  return (
    <section id="roi" className="bg-[#F8F8F8] py-20 px-5 border-t border-[#E5E5E5]">
      <div className="max-w-[600px] mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
            Calculadora de ROI
          </p>
          <h2 className="text-[28px] md:text-[34px] font-bold text-[#0D0D0D] leading-tight mb-3">
            Quanto você está perdendo?
          </h2>
          <p className="text-[15px] text-[#6B7280]">
            Ajuste os números da sua carteira e veja o impacto real.
          </p>
        </div>

        <RoiCalculator context="landing" />
      </div>
    </section>
  )
}
