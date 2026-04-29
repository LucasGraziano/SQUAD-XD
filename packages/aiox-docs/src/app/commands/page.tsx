import { slashCommands, agentCommands, activationSyntax, autoSkills } from '@/data/commands'

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  productivity: { bg: 'bg-menta/10', text: 'text-menta', border: 'border-menta/20' },
  content: { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/20' },
  tools: { bg: 'bg-coral/10', text: 'text-coral', border: 'border-coral/20' },
  knowledge: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
}

export default function CommandsPage() {
  return (
    <div className="grid-bg">
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-gold status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">Commands</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Comandos & Ativacao</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            3 formas de interagir: <code className="text-coral font-mono text-sm">@agent</code> para ativar agentes,{' '}
            <code className="text-menta font-mono text-sm">*comando</code> para executar tasks, e{' '}
            <code className="text-gold font-mono text-sm">/slash</code> para ferramentas rapidas.
          </p>
        </div>
      </section>

      {/* Activation Syntax */}
      <section className="px-12 py-8 border-b border-surface-600">
        <h2 className="text-lg font-bold mb-4 text-text-primary">Como Ativar Agentes</h2>
        <div className="grid grid-cols-3 gap-4">
          {activationSyntax.map((syn) => (
            <div key={syn.syntax} className="rounded-xl bg-surface-800 border border-surface-600 p-5">
              <code className="text-sm font-mono text-coral block mb-2">{syn.example}</code>
              <p className="text-xs text-text-muted mb-1">Sintaxe: <code className="text-text-secondary">{syn.syntax}</code></p>
              <p className="text-xs text-text-secondary">{syn.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Commands (* prefix) */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-bold mb-2 text-text-primary">Comandos de Agente</h2>
        <p className="text-sm text-text-secondary mb-6">
          Prefixo <code className="text-menta font-mono">*</code> — executam tasks estruturadas do agente ativo
        </p>
        <div className="grid grid-cols-3 gap-3">
          {agentCommands.map((cmd) => (
            <div key={cmd.prefix} className="rounded-lg bg-surface-800 border border-surface-600 p-4">
              <code className="text-sm font-mono text-menta block mb-2">{cmd.prefix}</code>
              <p className="text-xs text-text-secondary">{cmd.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Auto Skills */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-bold mb-2 text-text-primary">Auto Skills</h2>
        <p className="text-sm text-text-secondary mb-6">
          Skills semânticas — ativam automaticamente por contexto. Sem prefixo. A IA decide quando usar com base na descrição.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {autoSkills.map((skill) => {
            const catColors = {
              design: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
              knowledge: { bg: 'bg-menta/10', text: 'text-menta', border: 'border-menta/20' },
              productivity: { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/20' },
            }[skill.category]
            return (
              <div key={skill.name} className={`rounded-xl bg-surface-800 border ${catColors.border} p-5`}>
                <div className="flex items-start justify-between mb-2">
                  <code className={`text-base font-mono font-bold ${catColors.text}`}>{skill.name}</code>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${catColors.bg} ${catColors.text} uppercase tracking-wider`}>
                    {skill.category}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-3">{skill.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.triggers.map((t) => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-900 text-text-muted border border-surface-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Slash Commands */}
      <section className="px-12 py-10 pb-20">
        <h2 className="text-lg font-bold mb-2 text-text-primary">Slash Commands</h2>
        <p className="text-sm text-text-secondary mb-6">
          Prefixo <code className="text-gold font-mono">/</code> — ferramentas de produtividade e geracao de conteudo
        </p>

        <div className="space-y-4">
          {slashCommands.map((cmd) => {
            const colors = categoryColors[cmd.category]
            return (
              <div key={cmd.name} className={`rounded-xl bg-surface-800 border ${colors.border} p-5`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <code className={`text-lg font-mono font-bold ${colors.text}`}>{cmd.name}</code>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${colors.bg} ${colors.text} uppercase tracking-wider`}>
                    {cmd.category}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-4">{cmd.description}</p>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-2">Uso</span>
                  <div className="flex flex-wrap gap-2">
                    {cmd.usage.map((u) => (
                      <code key={u} className="text-[11px] font-mono px-2.5 py-1 rounded bg-surface-900 text-text-secondary border border-surface-700">
                        {u}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
