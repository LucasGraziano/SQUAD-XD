import Link from 'next/link'
import { Reveal } from './Reveal'
import { ArrowRight } from 'lucide-react'

export function CtaFinal() {
  return (
    <section className="relative bg-[#0D0D0D] py-24 px-5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[rgba(11,217,4,0.05)] blur-[80px]" />
      </div>

      <div className="relative max-w-[680px] mx-auto text-center">
        <Reveal animation="fade-up">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0BD904]" />
            <span className="text-[12px] text-[#9CA3AF] font-medium">Gratuito para sempre no plano básico</span>
          </div>

          <h2 className="text-[32px] md:text-[42px] font-bold text-white leading-[1.15] tracking-tight mb-5">
            Sua carteira não para de crescer.
            <br />
            <span className="text-[#0BD904]">Sua gestão também não deveria.</span>
          </h2>

          <p className="text-[16px] text-[#6B7280] mb-9 leading-relaxed max-w-[480px] mx-auto">
            Comece grátis hoje. Em 5 minutos seu pipeline está rodando e os alertas de renovação, configurados.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="mkt-pulse-green inline-flex items-center gap-2 h-12 px-8 rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[15px] font-bold hover:bg-[#09C003] transition-colors"
            >
              Começar grátis agora
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center h-12 px-6 rounded-[6px] border border-white/10 text-[#9CA3AF] text-[14px] font-medium hover:border-white/20 hover:text-white transition-colors"
            >
              Já tenho conta
            </Link>
          </div>

          <p className="mt-5 text-[12px] text-[#4B4B4B]">
            Sem cartão de crédito · Cancele quando quiser · +50 corretores confiam no Premia
          </p>
        </Reveal>
      </div>
    </section>
  )
}
