'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Reveal } from './Reveal'

const faqs = [
  {
    q: 'Preciso instalar algum software ou aplicativo?',
    a: 'Não. O Premia roda 100% no navegador — funciona em qualquer celular, tablet ou computador. Basta ter internet.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. Todos os dados ficam criptografados no Supabase (infraestrutura AWS) com política de acesso por corretor (RLS). Você é o único que vê sua carteira.',
  },
  {
    q: 'Funciona para todos os ramos de seguros?',
    a: 'Sim — Auto, Vida, Saúde, Residencial, Empresarial, Viagem e Consórcio. Você pode filtrar sua carteira e pipeline por ramo.',
  },
  {
    q: 'Posso importar minha carteira atual?',
    a: 'Sim. Você pode importar apólices em PDF e a IA extrai os dados automaticamente. Importação por CSV está prevista para a próxima versão.',
  },
  {
    q: 'Quanto o Premia me economiza por mês?',
    a: 'Na média, corretores relatam economizar 8 horas por semana em tarefas manuais — montar alertas, buscar contatos, conferir vencimentos. A R$97/mês com 4 semanas de trabalho, são R$0,42 por hora economizada. O retorno aparece na primeira renovação que você não perderia sem o Premia.',
  },
  {
    q: 'E se eu quiser cancelar?',
    a: 'Você cancela a qualquer momento pelo próprio painel, sem precisar falar com suporte. Seus dados ficam disponíveis para exportação por 30 dias após o cancelamento.',
  },
  {
    q: 'O Premia é homologado pela SUSEP?',
    a: 'O Premia é um sistema de gestão operacional — não emite apólices nem representa seguradora. Funciona como uma ferramenta de organização para o corretor SUSEP.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-[#F8F8F8] py-20 px-5 border-t border-[#E5E5E5]">
      <div className="max-w-[760px] mx-auto">
        <Reveal className="text-center mb-12">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Dúvidas frequentes</p>
          <h2 className="text-[28px] md:text-[34px] font-bold text-[#0D0D0D] leading-tight">
            Perguntas que todo corretor faz antes de começar
          </h2>
        </Reveal>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 40}>
              <div
                className={`rounded-[8px] border bg-white overflow-hidden transition-all duration-200 ${
                  open === i ? 'border-[#0BD904]/40 shadow-[0_0_0_1px_rgba(11,217,4,0.15)]' : 'border-[#E5E5E5]'
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-[14px] font-semibold text-[#0D0D0D] pr-4">{faq.q}</span>
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                    {open === i
                      ? <Minus size={11} className="text-[#0BD904]" />
                      : <Plus size={11} className="text-[#6B7280]" />
                    }
                  </span>
                </button>
                {open === i && (
                  <div className="px-5 pb-4">
                    <p className="text-[14px] text-[#6B7280] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
