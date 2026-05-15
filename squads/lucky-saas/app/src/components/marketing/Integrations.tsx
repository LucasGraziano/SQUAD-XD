import { Reveal } from './Reveal'
import { MessageCircle, FileText, Mail, Shield, Smartphone, Brain } from 'lucide-react'

const integrations = [
  { icon: MessageCircle, label: 'WhatsApp', desc: 'Contato direto com 1 clique' },
  { icon: FileText,      label: 'Importação PDF', desc: 'IA extrai dados da apólice' },
  { icon: Mail,          label: 'E-mail', desc: 'Alertas direto na caixa' },
  { icon: Shield,        label: 'Mercado SUSEP', desc: 'Feito para corretores regulados' },
  { icon: Smartphone,    label: 'Mobile', desc: 'Acessa do celular, sem app' },
  { icon: Brain,         label: 'IA Integrada', desc: 'Preenche dados automaticamente' },
]

export function Integrations() {
  return (
    <section className="bg-white py-20 px-5 border-t border-[#E5E5E5]">
      <div className="max-w-[1100px] mx-auto">
        <Reveal className="text-center mb-12">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Integrado ao seu dia a dia</p>
          <h2 className="text-[28px] md:text-[34px] font-bold text-[#0D0D0D] leading-tight">
            Funciona com o que você já usa
          </h2>
          <p className="text-[15px] text-[#6B7280] mt-3 max-w-[480px] mx-auto">
            Sem curva de aprendizado. Sem importar planilhas enormes. Começa com o básico e vai crescendo.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {integrations.map((item, i) => (
            <Reveal key={item.label} animation="scale-in" delay={i * 60}>
              <div className="group flex items-start gap-4 p-5 rounded-[8px] border border-[#E5E5E5] hover:border-[#0BD904]/40 hover:bg-[rgba(11,217,4,0.02)] transition-all duration-200 cursor-default">
                <div className="w-9 h-9 rounded-[8px] bg-[rgba(11,217,4,0.08)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(11,217,4,0.14)] transition-colors">
                  <item.icon size={16} className="text-[#034001]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0D0D0D] mb-0.5">{item.label}</p>
                  <p className="text-[12px] text-[#6B7280] leading-snug">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
