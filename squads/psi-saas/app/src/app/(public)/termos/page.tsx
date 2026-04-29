import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso',
}

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav mínima */}
      <nav className="border-b border-neutral-border px-6 h-16 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="font-serif text-xl text-brand-teal">Vínculo</Link>
        <Link href="/register" className="text-sm text-brand-teal hover:text-brand-teal-dark font-medium transition-colors">
          Criar conta grátis
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs text-neutral-secondary uppercase tracking-widest mb-3">Documento legal</p>
        <h1 className="font-serif text-3xl text-neutral-charcoal mb-2">Termos de Uso</h1>
        <p className="text-sm text-neutral-secondary mb-10">Última atualização: abril de 2026</p>

        <div className="prose prose-sm max-w-none text-neutral-charcoal space-y-8">

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">1. Aceitação dos Termos</h2>
            <p className="text-neutral-secondary leading-relaxed">
              Ao criar uma conta no Vínculo, você concorda com estes Termos de Uso.
              O Vínculo é uma plataforma de gestão clínica destinada exclusivamente a psicólogos
              devidamente registrados no Conselho Federal de Psicologia (CFP) ou em conselho regional (CRP).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">2. Uso da Plataforma</h2>
            <p className="text-neutral-secondary leading-relaxed mb-3">O usuário se compromete a:</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-secondary">
              <li>Utilizar o Vínculo apenas para fins legítimos de gestão clínica</li>
              <li>Manter a confidencialidade de suas credenciais de acesso</li>
              <li>Não compartilhar o acesso à plataforma com terceiros não autorizados</li>
              <li>Cumprir o Código de Ética Profissional do Psicólogo e todas as resoluções do CFP aplicáveis</li>
              <li>Utilizar os prontuários eletrônicos em conformidade com a CFP Res. 001/2009 e 09/2024</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">3. Privacidade e LGPD</h2>
            <p className="text-neutral-secondary leading-relaxed">
              O tratamento de dados pessoais dos seus pacientes é de responsabilidade do psicólogo (controlador).
              O Vínculo atua como operador de dados, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).
              Consulte nossa <Link href="/privacidade" className="text-brand-teal hover:underline">Política de Privacidade</Link> para
              detalhes sobre coleta, armazenamento e tratamento de dados.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">4. Segurança dos Dados Clínicos</h2>
            <p className="text-neutral-secondary leading-relaxed">
              Os prontuários são criptografados com AES-256-GCM diretamente no navegador do usuário.
              A chave de criptografia nunca é transmitida para os servidores do Vínculo.
              Em caso de perda da senha de criptografia, os dados das notas clínicas são irrecuperáveis —
              o psicólogo é o único responsável pela guarda desta chave.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">5. Planos e Pagamentos</h2>
            <p className="text-neutral-secondary leading-relaxed">
              O Vínculo oferece um período de teste gratuito de 14 dias sem necessidade de cadastro de cartão.
              Após este período, a continuidade do uso está condicionada à assinatura de um dos planos disponíveis.
              O cancelamento pode ser realizado a qualquer momento, sem multa ou fidelidade.
              Não há reembolso de períodos já cobrados.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">6. Limitação de Responsabilidade</h2>
            <p className="text-neutral-secondary leading-relaxed">
              O Vínculo é uma ferramenta de apoio à gestão clínica e não substitui o julgamento clínico do profissional.
              Os alertas de risco de abandono são baseados em padrões comportamentais e não constituem diagnóstico.
              O Vínculo não se responsabiliza por decisões clínicas tomadas com base nas informações fornecidas pela plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">7. Modificações</h2>
            <p className="text-neutral-secondary leading-relaxed">
              Reservamo-nos o direito de modificar estes Termos a qualquer momento.
              Notificaremos os usuários por e-mail com antecedência mínima de 30 dias sobre alterações relevantes.
              O uso continuado da plataforma após as modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">8. Contato</h2>
            <p className="text-neutral-secondary leading-relaxed">
              Para dúvidas sobre estes Termos, entre em contato: <strong>contato@vinculo.app</strong>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-neutral-border py-8 px-6 mt-16">
        <div className="max-w-4xl mx-auto flex justify-between text-xs text-neutral-secondary">
          <span>© {new Date().getFullYear()} Vínculo</span>
          <div className="flex gap-5">
            <Link href="/termos" className="text-brand-teal">Termos</Link>
            <Link href="/privacidade" className="hover:text-brand-teal transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
