import { wikiLayers, knowledgeCommands } from '@/data/knowledge-system'

const wikiCommands = knowledgeCommands.filter((c) =>
  c.command.startsWith('/wiki')
)

export default function WikiPage() {
  return (
    <div className="grid-bg min-h-screen">
      {/* Hero */}
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">Knowledge Wiki — Compounding Layer</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Wiki Compounding</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Memória viva da operação. Cada sessão relevante vira conhecimento permanente.
            Adaptado do método Karpathy — o LLM escreve e mantém o wiki, você lê e pergunta.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5">
            <span className="text-xs text-blue-400 font-mono">Core principle:</span>
            <span className="text-xs text-text-secondary italic">"The wiki is a persistent, compounding artifact." — Andrej Karpathy</span>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Arquitetura em 2 Camadas</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {wikiLayers.map((layer) => (
            <div
              key={layer.id}
              className={`rounded-lg border p-5 ${layer.immutable ? 'border-surface-500 bg-surface-800/50' : 'border-blue-500/30 bg-blue-500/5'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold font-mono text-text-primary">{layer.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${layer.immutable ? 'bg-surface-700 text-text-muted border-surface-600' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  {layer.immutable ? 'IMUTÁVEL' : 'LLM escreve'}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-3">{layer.description}</p>
              <code className="text-xs text-text-muted font-mono">{layer.path}</code>
            </div>
          ))}
        </div>

        {/* Subdirectories */}
        <div className="rounded-lg border border-surface-600 bg-surface-800/30 p-4">
          <div className="text-xs font-semibold text-text-primary mb-3">Subdiretórios RAW/ por tipo de fonte</div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { dir: 'RAW/sessions/', desc: 'Insights de sessões de trabalho' },
              { dir: 'RAW/campaigns/', desc: 'Análises pós-campanha' },
              { dir: 'RAW/research/', desc: 'Pesquisas e dumps do @spy' },
              { dir: 'RAW/frameworks/', desc: 'Frameworks e SOPs descobertos' },
            ].map((item) => (
              <div key={item.dir} className="rounded border border-surface-600 bg-surface-800 p-3">
                <code className="text-xs font-mono text-gold block mb-1">{item.dir}</code>
                <span className="text-[10px] text-text-muted">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provenance */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Provenance Protocol</h2>
        <p className="text-sm text-text-secondary mb-6">
          Obrigatório em tudo que entra no wiki. Zero claim sem tag.
          <code className="text-coral font-mono text-xs ml-2">[ASSUMED]</code> deve ser confirmado antes de virar copy ou decisão locked.
        </p>
        <div className="space-y-3">
          {[
            {
              tag: '[VERIFIED: source]',
              desc: 'Confirmado via tool nessa sessão — fonte visitada e dado extraído diretamente.',
              color: 'border-menta/30 bg-menta/5',
              tagColor: 'text-menta',
              example: '[VERIFIED: reddit.com/r/pelvicfloor/comments/xyz] "frase exata do avatar"',
            },
            {
              tag: '[CITED: url]',
              desc: 'Referenciado de URL viva — informação disponível na fonte mas não verificada nessa sessão.',
              color: 'border-blue-500/30 bg-blue-500/5',
              tagColor: 'text-blue-400',
              example: '[CITED: amazon.com/product/reviews] "padrão identificado em reviews"',
            },
            {
              tag: '[ASSUMED]',
              desc: 'Conhecimento de treino do LLM — não verificado nessa sessão. Listar separadamente. Confirmar antes de usar.',
              color: 'border-gold/30 bg-gold/5',
              tagColor: 'text-gold',
              example: '[ASSUMED] comportamento inferido de padrão geral — confirmar com fonte real',
            },
          ].map((p) => (
            <div key={p.tag} className={`rounded-lg border p-4 ${p.color}`}>
              <div className="flex items-start gap-3 mb-2">
                <code className={`text-sm font-mono font-bold whitespace-nowrap ${p.tagColor}`}>{p.tag}</code>
                <span className="text-sm text-text-secondary">{p.desc}</span>
              </div>
              <code className="text-xs text-text-muted font-mono">{p.example}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Commands */}
      <section className="px-12 py-10 border-b border-surface-600">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Comandos /wiki</h2>
        <div className="space-y-2">
          {wikiCommands.map((c) => (
            <div key={c.command} className="flex items-start gap-4 rounded-lg border border-surface-600 bg-surface-800/50 p-4">
              <code className="text-sm font-mono text-coral whitespace-nowrap min-w-[160px]">{c.command}</code>
              <div className="flex-1">
                <div className="text-sm text-text-primary mb-1">{c.description}</div>
                <div className="text-xs text-text-muted font-mono">{c.mode}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wiki vs DNA */}
      <section className="px-12 py-10">
        <h2 className="text-lg font-semibold text-text-primary mb-6">Wiki vs Outras Camadas</h2>
        <div className="rounded-lg border border-surface-600 bg-surface-800/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800">
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider">Camada</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider">O que guarda</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium text-xs uppercase tracking-wider">Atualizado por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                { layer: 'DNA / Experts', what: 'Modelos cognitivos de experts — estático', by: '/ingest', color: 'text-coral' },
                { layer: 'Dossiers', what: 'Convergências cross-source — periódico', by: '/dossier', color: 'text-gold' },
                { layer: 'Playbooks', what: 'Frameworks operacionais — periódico', by: '/playbook', color: 'text-purple-400' },
                { layer: 'Wiki (RAW+WIKI)', what: 'Insights de sessão, campanhas, dados reais — compounding', by: '/wiki-ingest', color: 'text-blue-400' },
              ].map((row) => (
                <tr key={row.layer} className="hover:bg-surface-800/50 transition-colors">
                  <td className={`px-4 py-3 font-medium ${row.color}`}>{row.layer}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.what}</td>
                  <td className="px-4 py-3 font-mono text-coral text-xs">{row.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-muted mt-3 text-center">
          O Wiki é a memória viva. O DNA é a fundação estratégica. Juntos formam o conhecimento compounding.
        </p>
      </section>
    </div>
  )
}
