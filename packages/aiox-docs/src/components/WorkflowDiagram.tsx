import { Workflow } from '@/data/workflows'

export default function WorkflowDiagram({ workflow }: { workflow: Workflow }) {
  return (
    <div className="rounded-xl bg-surface-800 border border-surface-600 overflow-hidden card-hover">
      <div className="p-5 border-b border-surface-600">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-text-primary">{workflow.name}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-coral/10 text-coral">
            {workflow.type}
          </span>
        </div>
        <p className="text-xs text-text-secondary">{workflow.description}</p>
        <p className="text-xs text-text-muted mt-1">
          <span className="text-menta">Quando usar:</span> {workflow.whenToUse}
        </p>
      </div>

      <div className="p-5">
        <div className="relative">
          {workflow.phases.map((phase, i) => (
            <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-surface-700 border border-surface-500 flex items-center justify-center text-xs font-mono text-coral">
                  {phase.number}
                </div>
                {i < workflow.phases.length - 1 && (
                  <div className="w-px h-8 bg-surface-600 my-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{phase.agentIcon}</span>
                  <code className="text-[11px] font-mono text-menta">@{phase.agent}</code>
                  <span className="text-text-muted text-xs">→</span>
                  <code className="text-[10px] font-mono text-text-muted bg-surface-700 px-1.5 py-0.5 rounded">
                    {phase.output}
                  </code>
                </div>
                <p className="text-xs text-text-secondary">{phase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
