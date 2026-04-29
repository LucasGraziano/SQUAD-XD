import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-border px-6 h-16 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="font-serif text-xl text-brand-teal">Vínculo</Link>
        <Link href="/register" className="text-sm text-brand-teal hover:text-brand-teal-dark font-medium transition-colors">
          Criar conta grátis
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs text-neutral-secondary uppercase tracking-widest mb-3">Documento legal</p>
        <h1 className="font-serif text-3xl text-neutral-charcoal mb-2">Política de Privacidade</h1>
        <p className="text-sm text-neutral-secondary mb-10">Última atualização: abril de 2026</p>

        <div className="prose prose-sm max-w-none text-neutral-charcoal space-y-8">

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">1. Quem somos</h2>
            <p className="text-neutral-secondary leading-relaxed">
              O Vínculo é uma plataforma de gestão clínica para psicólogos brasileiros.
              Atuamos como <strong>operador de dados</strong> conforme a LGPD (Lei 13.709/2018):
              processamos dados em nome do psicólogo (controlador), que é o responsável legal
              pelo tratamento dos dados de seus pacientes.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">2. Dados coletados</h2>
            <p className="text-neutral-secondary leading-relaxed mb-3">Coletamos dois tipos de dados:</p>
            <div className="space-y-4">
              <div className="bg-neutral-off-white rounded-lg p-4">
                <p className="font-medium text-neutral-charcoal text-sm mb-2">Dados do psicólogo (usuário direto)</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-secondary">
                  <li>Nome completo, CRP, e-mail, telefone</li>
                  <li>Dados de configuração da conta (valor por sessão, horários)</li>
                  <li>Dados de acesso (IP, timestamp) para auditoria de segurança</li>
                </ul>
              </div>
              <div className="bg-neutral-off-white rounded-lg p-4">
                <p className="font-medium text-neutral-charcoal text-sm mb-2">Dados dos pacientes (tratados pelo psicólogo)</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-secondary">
                  <li>Dados de identificação (nome, contato, data de nascimento)</li>
                  <li>Histórico de sessões e agendamentos</li>
                  <li>Notas clínicas — <strong>criptografadas AES-256-GCM no navegador</strong>. O Vínculo não tem acesso ao conteúdo.</li>
                  <li>Dados financeiros (valores cobrados, status de pagamento)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">3. Como usamos os dados</h2>
            <ul className="list-disc pl-6 space-y-2 text-neutral-secondary">
              <li>Prestação do serviço de gestão clínica contratado</li>
              <li>Envio de lembretes automáticos via WhatsApp (com consentimento explícito do paciente)</li>
              <li>Cálculo do score de risco de abandono (processado internamente, não compartilhado)</li>
              <li>Comunicações sobre a conta (cobranças, atualizações de segurança)</li>
              <li>Não utilizamos dados para publicidade, não vendemos dados a terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">4. Armazenamento e segurança</h2>
            <ul className="list-disc pl-6 space-y-2 text-neutral-secondary">
              <li>Dados armazenados em servidores no Brasil (Supabase — região São Paulo)</li>
              <li>Notas clínicas: criptografia AES-256-GCM client-side, chave nunca transmitida</li>
              <li>Conexões via HTTPS/TLS 1.3</li>
              <li>Audit log de todos os acessos a prontuários com timestamp</li>
              <li>Backups diários criptografados</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">5. Seus direitos (LGPD)</h2>
            <p className="text-neutral-secondary leading-relaxed mb-3">Como titular de dados, você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-secondary">
              <li>Confirmar a existência de tratamento de seus dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a portabilidade ou exclusão dos seus dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
            </ul>
            <p className="text-neutral-secondary leading-relaxed mt-3">
              Solicitações: <strong>privacidade@vinculo.app</strong> — respondidas em até 15 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">6. Retenção de dados</h2>
            <p className="text-neutral-secondary leading-relaxed">
              Dados de conta são mantidos enquanto a assinatura estiver ativa.
              Após cancelamento, os dados ficam disponíveis para exportação por 30 dias,
              sendo excluídos automaticamente ao final deste prazo.
              Prontuários exportados em PDF são de responsabilidade exclusiva do psicólogo.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-neutral-charcoal mb-3">7. Contato</h2>
            <p className="text-neutral-secondary leading-relaxed">
              Encarregado de Dados (DPO): <strong>privacidade@vinculo.app</strong>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-neutral-border py-8 px-6 mt-16">
        <div className="max-w-4xl mx-auto flex justify-between text-xs text-neutral-secondary">
          <span>© {new Date().getFullYear()} Vínculo</span>
          <div className="flex gap-5">
            <Link href="/termos" className="hover:text-brand-teal transition-colors">Termos</Link>
            <Link href="/privacidade" className="text-brand-teal">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
