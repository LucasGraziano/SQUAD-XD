import { Reveal } from './Reveal'

export function SocialProof() {
  return (
    <section className="bg-[#F8F8F8] py-16 px-5 border-y border-[#E5E5E5]">
      <div className="max-w-[1100px] mx-auto">

        <Reveal className="text-center mb-10">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">O que dizem os corretores</p>
          <h2 className="text-[26px] md:text-[30px] font-bold text-[#0D0D0D]">
            Resultados reais de quem usa no dia a dia
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal animation="slide-left">
            <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-6 h-full">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#0BD904] text-[14px]">★</span>
                ))}
              </div>
              <blockquote className="text-[15px] text-[#374151] leading-relaxed font-medium mb-5">
                &ldquo;Antes eu perdia renovação porque não tinha como lembrar de 80 clientes. Agora o Premia me avisa e eu só preciso ligar. No primeiro mês recuperei 3 apólices que iriam para o concorrente.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[rgba(11,217,4,0.10)] flex items-center justify-center text-[13px] font-bold text-[#034001]">
                  MR
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0D0D0D]">Marcelo R.</p>
                  <p className="text-[12px] text-[#9CA3AF]">Corretor SUSEP — São Paulo</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal animation="slide-right">
            <div className="bg-white rounded-[8px] border border-[#E5E5E5] p-6 h-full">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#0BD904] text-[14px]">★</span>
                ))}
              </div>
              <blockquote className="text-[15px] text-[#374151] leading-relaxed font-medium mb-5">
                &ldquo;Eu usava planilha e caderninho. Migrei em uma tarde. Agora tenho tudo em um lugar só — apólices, clientes, pipeline de leads. Nunca mais perdi nada.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[rgba(11,217,4,0.10)] flex items-center justify-center text-[13px] font-bold text-[#034001]">
                  JC
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0D0D0D]">Juliana C.</p>
                  <p className="text-[12px] text-[#9CA3AF]">Corretora autônoma — Curitiba</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {['MR', 'JC', 'AR', 'PB'].map((initials) => (
                <div key={initials} className="w-8 h-8 rounded-full bg-[rgba(11,217,4,0.10)] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#034001]">
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#6B7280]">
              <span className="font-semibold text-[#0D0D0D]">+50 corretores</span> já organizam sua carteira no Premia
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
