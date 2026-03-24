import AgentCard from '@/components/AgentCard'
import { aioxAgents } from '@/data/agents'

export default function AioxAgentsPage() {
  return (
    <div className="px-12 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-text-muted uppercase tracking-widest">AIOX Core</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Core Agents</h1>
        <p className="text-sm text-text-secondary max-w-2xl">
          12 agentes especializados que formam o núcleo do AIOX. Cada um com persona única,
          comandos exclusivos e área de autoridade definida pela Constitution.
        </p>
      </div>

      {/* Activation guide */}
      <div className="mb-8 p-5 rounded-xl bg-surface-800 border border-coral/20">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Como ativar</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <code className="text-xs font-mono text-coral">@agent-name</code>
            <p className="text-xs text-text-muted mt-1">Ex: <code className="text-coral">@dev</code></p>
          </div>
          <div>
            <code className="text-xs font-mono text-menta">/AIOX:agents:name</code>
            <p className="text-xs text-text-muted mt-1">Ex: <code className="text-menta">/AIOX:agents:architect</code></p>
          </div>
          <div>
            <code className="text-xs font-mono text-gold">*command</code>
            <p className="text-xs text-text-muted mt-1">Ex: <code className="text-gold">*help</code>, <code className="text-gold">*develop</code></p>
          </div>
        </div>
      </div>

      {/* Authority matrix quickref */}
      <div className="mb-8 p-5 rounded-xl bg-surface-800 border border-surface-600">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Delegation Matrix (Exclusive Operations)</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {[
            { op: 'git push / PR create', agent: '@devops (Gage)', icon: '🚀' },
            { op: 'Epic orchestration / PRD', agent: '@pm (Morgan)', icon: '📋' },
            { op: 'Story validation (GO/NO-GO)', agent: '@po (Pax)', icon: '🎯' },
            { op: 'Story creation', agent: '@sm (River)', icon: '🌊' },
            { op: 'Architecture decisions', agent: '@architect (Aria)', icon: '📐' },
            { op: 'Schema DDL / RLS', agent: '@data-engineer (Dara)', icon: '🗄️' },
            { op: 'Quality gate verdicts', agent: '@qa (Quinn)', icon: '✅' },
            { op: 'Framework governance', agent: '@aiox-master (Orion)', icon: '👑' },
          ].map((row) => (
            <div key={row.op} className="flex items-center gap-2 text-xs py-1">
              <span>{row.icon}</span>
              <span className="text-text-muted">{row.op}</span>
              <span className="text-text-muted mx-1">→</span>
              <code className="text-coral font-mono text-[10px]">{row.agent}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-3 gap-4">
        {aioxAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} basePath="/aiox/" />
        ))}
      </div>
    </div>
  )
}
