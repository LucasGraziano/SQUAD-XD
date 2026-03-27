export default function CheckpointsPage() {
  return (
    <div className="grid-bg">
      {/* Hero */}
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-menta/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-menta status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">Tooling</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Checkpoint & Recall</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Sistema de persistencia de contexto entre sessoes. Salva snapshots automaticos do progresso
            e permite retomar qualquer conversa em outro ambiente sem perder contexto.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-bold mb-2 text-text-primary">Como Funciona</h2>
        <p className="text-sm text-text-secondary mb-6">
          Dois comandos complementares que juntos formam o sistema de memoria entre sessoes.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {/* /checkpoint */}
          <div className="rounded-2xl bg-surface-800 border border-surface-600 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center">
                <span className="text-lg">📌</span>
              </div>
              <div>
                <code className="text-coral font-mono text-sm font-bold">/checkpoint</code>
                <p className="text-xs text-text-muted">Salvar contexto</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Cria um snapshot do estado atual da conversa. Inclui o que fizemos, decisoes tomadas,
              arquivos modificados e proximos passos.
            </p>
            <div className="space-y-2">
              <div className="rounded-lg bg-surface-900 p-3">
                <code className="text-xs font-mono text-coral">/checkpoint</code>
                <p className="text-xs text-text-muted mt-1">Cria com titulo automatico</p>
              </div>
              <div className="rounded-lg bg-surface-900 p-3">
                <code className="text-xs font-mono text-coral">/checkpoint &quot;Landing Page v2&quot;</code>
                <p className="text-xs text-text-muted mt-1">Cria com titulo customizado</p>
              </div>
              <div className="rounded-lg bg-surface-900 p-3">
                <code className="text-xs font-mono text-coral">/checkpoint --tag feature,ui</code>
                <p className="text-xs text-text-muted mt-1">Cria com tags para busca</p>
              </div>
            </div>
          </div>

          {/* /recall */}
          <div className="rounded-2xl bg-surface-800 border border-surface-600 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-menta/10 border border-menta/20 flex items-center justify-center">
                <span className="text-lg">🔄</span>
              </div>
              <div>
                <code className="text-menta font-mono text-sm font-bold">/recall</code>
                <p className="text-xs text-text-muted">Restaurar contexto</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Lista e carrega checkpoints salvos. Permite retomar qualquer sessao anterior
              em um novo ambiente, mantendo o contexto completo.
            </p>
            <div className="space-y-2">
              <div className="rounded-lg bg-surface-900 p-3">
                <code className="text-xs font-mono text-menta">/recall</code>
                <p className="text-xs text-text-muted mt-1">Lista ultimos 10 checkpoints</p>
              </div>
              <div className="rounded-lg bg-surface-900 p-3">
                <code className="text-xs font-mono text-menta">/recall --last</code>
                <p className="text-xs text-text-muted mt-1">Carrega o mais recente</p>
              </div>
              <div className="rounded-lg bg-surface-900 p-3">
                <code className="text-xs font-mono text-menta">/recall --search &quot;landing&quot;</code>
                <p className="text-xs text-text-muted mt-1">Busca por palavra-chave</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-bold mb-2 text-text-primary">Automacao</h2>
        <p className="text-sm text-text-secondary mb-6">
          Checkpoints sao criados automaticamente — voce nao precisa lembrar de salvar.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-5">
            <div className="text-2xl mb-3">🤖</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">Auto-Checkpoint</h3>
            <p className="text-xs text-text-secondary">
              Orion cria checkpoints automaticamente ao completar projetos, features ou milestones significativos.
            </p>
          </div>
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-5">
            <div className="text-2xl mb-3">📝</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">Auto-Docs</h3>
            <p className="text-xs text-text-secondary">
              Sempre que algo novo e criado no projeto, o aiox-docs e atualizado automaticamente para refletir as mudancas.
            </p>
          </div>
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-5">
            <div className="text-2xl mb-3">🌍</div>
            <h3 className="text-sm font-bold text-text-primary mb-2">Portabilidade</h3>
            <p className="text-xs text-text-secondary">
              Checkpoints ficam no repo Git — acessiveis de qualquer maquina com acesso ao repositorio.
            </p>
          </div>
        </div>
      </section>

      {/* Checkpoint Structure */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-bold mb-2 text-text-primary">Estrutura do Checkpoint</h2>
        <p className="text-sm text-text-secondary mb-6">
          Cada checkpoint e um arquivo Markdown com frontmatter YAML em <code className="text-coral font-mono text-xs">.claude/checkpoints/</code>
        </p>

        <div className="rounded-xl bg-surface-900 border border-surface-600 p-6 font-mono text-sm">
          <div className="text-text-muted mb-1">---</div>
          <div><span className="text-menta">date:</span> <span className="text-text-secondary">2026-03-26</span></div>
          <div><span className="text-menta">title:</span> <span className="text-text-secondary">&quot;Sistema de Checkpoints&quot;</span></div>
          <div><span className="text-menta">branch:</span> <span className="text-text-secondary">&quot;master&quot;</span></div>
          <div><span className="text-menta">story:</span> <span className="text-text-secondary">null</span></div>
          <div><span className="text-menta">tags:</span> <span className="text-text-secondary">[feature, recall]</span></div>
          <div><span className="text-menta">last_commit:</span> <span className="text-text-secondary">&quot;d43a3b1&quot;</span></div>
          <div><span className="text-menta">created_by:</span> <span className="text-text-secondary">&quot;orion&quot;</span></div>
          <div className="text-text-muted mb-3">---</div>
          <div className="text-gold">## O que fizemos</div>
          <div className="text-text-muted">Resumo das acoes realizadas...</div>
          <div className="text-gold mt-2">## Estado atual</div>
          <div className="text-text-muted">Estado do projeto...</div>
          <div className="text-gold mt-2">## Decisoes tomadas</div>
          <div className="text-text-muted">Decisoes importantes...</div>
          <div className="text-gold mt-2">## Proximos passos</div>
          <div className="text-text-muted">O que falta fazer...</div>
        </div>
      </section>

      {/* Flow Diagram */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-bold mb-6 text-text-primary">Fluxo do Sistema</h2>

        <div className="flex items-center justify-center gap-4">
          {/* Step 1 */}
          <div className="rounded-xl bg-surface-800 border border-coral/30 p-4 text-center w-48">
            <div className="text-2xl mb-2">💻</div>
            <p className="text-xs font-bold text-coral">Trabalho na Sessao</p>
            <p className="text-xs text-text-muted mt-1">Desenvolvimento, features, fixes</p>
          </div>

          <div className="text-text-muted text-xl">→</div>

          {/* Step 2 */}
          <div className="rounded-xl bg-surface-800 border border-gold/30 p-4 text-center w-48">
            <div className="text-2xl mb-2">📌</div>
            <p className="text-xs font-bold text-gold">Checkpoint Criado</p>
            <p className="text-xs text-text-muted mt-1">Automatico ou via /checkpoint</p>
          </div>

          <div className="text-text-muted text-xl">→</div>

          {/* Step 3 */}
          <div className="rounded-xl bg-surface-800 border border-surface-600 p-4 text-center w-48">
            <div className="text-2xl mb-2">☁️</div>
            <p className="text-xs font-bold text-text-primary">Salvo no Repo</p>
            <p className="text-xs text-text-muted mt-1">.claude/checkpoints/*.md</p>
          </div>

          <div className="text-text-muted text-xl">→</div>

          {/* Step 4 */}
          <div className="rounded-xl bg-surface-800 border border-menta/30 p-4 text-center w-48">
            <div className="text-2xl mb-2">🔄</div>
            <p className="text-xs font-bold text-menta">Recall em Nova Sessao</p>
            <p className="text-xs text-text-muted mt-1">/recall --last</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="px-12 py-8">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Checkpoint & Recall System v1.0</span>
          <span>Storage: .claude/checkpoints/ — Git-tracked</span>
        </div>
      </section>
    </div>
  )
}
