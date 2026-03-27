'use client'
import { useState } from 'react'
import { tasks, taskCategories } from '@/data/tasks'
import { workflows, workflowSelectionGuide } from '@/data/workflows'

const workflowColors: Record<string, string> = {
  PRIMARY: 'border-coral/40 bg-coral/5',
  ITERATIVE: 'border-menta/40 bg-menta/5',
  'PRE-IMPLEMENTATION': 'border-gold/40 bg-gold/5',
  ASSESSMENT: 'border-purple-500/40 bg-purple-500/5',
}

const workflowBadgeColors: Record<string, string> = {
  PRIMARY: 'bg-coral/10 text-coral border-coral/20',
  ITERATIVE: 'bg-menta/10 text-menta border-menta/20',
  'PRE-IMPLEMENTATION': 'bg-gold/10 text-gold border-gold/20',
  ASSESSMENT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

type ActiveTab = 'workflows' | 'tasks'

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workflows')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = activeCategory === 'all' || task.category === activeCategory
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="grid-bg min-h-screen">
      {/* Hero */}
      <section className="relative px-12 pt-16 pb-10 border-b border-surface-600">
        <div className="absolute inset-0 bg-gradient-to-b from-menta/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-menta status-dot" />
            <span className="text-xs text-text-muted uppercase tracking-widest">Automation Protocols</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text-menta">Workflows & Tasks</span>
          </h1>
          <p className="text-text-secondary max-w-2xl leading-relaxed">
            O AIOX orquestra desenvolvimento através de <strong className="text-menta">4 workflows primários</strong> compostos por <strong className="text-menta">207 tasks estruturadas</strong>. Cada workflow define a sequência, agentes e gates de qualidade.
          </p>

          {/* Tab Switcher */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                activeTab === 'workflows'
                  ? 'bg-menta/10 text-menta border-menta/30'
                  : 'bg-surface-800 text-text-secondary border-surface-600 hover:border-menta/20'
              }`}
            >
              4 Workflows
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                activeTab === 'tasks'
                  ? 'bg-menta/10 text-menta border-menta/30'
                  : 'bg-surface-800 text-text-secondary border-surface-600 hover:border-menta/20'
              }`}
            >
              207 Tasks
            </button>
          </div>
        </div>
      </section>

      {/* ═══ WORKFLOWS TAB ═══ */}
      {activeTab === 'workflows' && (
        <>
          {/* Selection Guide */}
          <section className="px-12 py-8 border-b border-surface-600">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Quando usar cada workflow?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {workflowSelectionGuide.map((g) => (
                <div key={g.situation} className="flex items-start gap-3 p-4 rounded-lg bg-surface-800 border border-surface-700">
                  <span className="text-menta mt-0.5 shrink-0">-</span>
                  <div>
                    <span className="text-sm text-text-primary font-medium">{g.situation}</span>
                    <span className="text-text-muted mx-2">→</span>
                    <code className="text-xs font-mono text-menta">{g.workflow}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow Cards */}
          <section className="px-12 py-10 pb-20">
            <div className="space-y-8">
              {workflows.map((wf) => (
                <div key={wf.id} className={`rounded-2xl border ${workflowColors[wf.type] || 'border-surface-600'} p-0 overflow-hidden`}>
                  {/* Header */}
                  <div className="px-8 py-6 border-b border-surface-700/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-text-primary">{wf.name}</h3>
                        <p className="text-sm text-text-secondary mt-1 max-w-2xl">{wf.description}</p>
                      </div>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${workflowBadgeColors[wf.type] || ''}`}>
                        {wf.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-xs text-text-muted">
                        <strong className="text-text-secondary">{wf.phases.length}</strong> fases
                      </span>
                      <span className="text-surface-600">|</span>
                      <span className="text-xs text-text-muted">
                        Usar quando: <em className="text-text-secondary">{wf.whenToUse}</em>
                      </span>
                    </div>
                  </div>

                  {/* Phase Timeline */}
                  <div className="px-8 py-6">
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-surface-600" />

                      <div className="space-y-4">
                        {wf.phases.map((phase, idx) => (
                          <div key={phase.number} className="relative flex items-start gap-5 pl-0">
                            {/* Step circle */}
                            <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-surface-900 border-2 border-surface-600 text-xs font-bold text-menta shrink-0">
                              {phase.number}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-2">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg">{phase.agentIcon}</span>
                                <code className="text-xs font-mono text-coral">@{phase.agent}</code>
                                <span className="text-text-muted text-xs">→</span>
                                <code className="text-[11px] font-mono text-text-secondary">{phase.task}</code>
                              </div>
                              <p className="text-sm text-text-secondary">{phase.description}</p>
                              <div className="mt-1">
                                <span className="text-[10px] text-text-muted">Output: </span>
                                <code className="text-[10px] font-mono text-menta">{phase.output}</code>
                              </div>
                            </div>

                            {/* Arrow connector */}
                            {idx < wf.phases.length - 1 && (
                              <div className="absolute left-[19px] top-10 text-surface-500 text-[10px]">↓</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ═══ TASKS TAB ═══ */}
      {activeTab === 'tasks' && (
        <>
          {/* Filter Bar */}
          <section className="px-12 py-8 border-b border-surface-600 sticky top-0 bg-surface-900/80 backdrop-blur-md z-30">
            <div className="flex flex-col gap-6">
              <div className="relative max-w-xl">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔎</span>
                <input
                  type="text"
                  placeholder="Pesquisar tarefas (ex: story, database, qa)..."
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-menta/50 focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    activeCategory === 'all'
                    ? 'bg-menta text-surface-900 border-menta'
                    : 'bg-surface-800 text-text-secondary border-surface-600 hover:border-menta/30'
                  }`}
                >
                  All Tasks
                </button>
                {taskCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      activeCategory === cat.id
                      ? 'bg-surface-600 text-menta border-menta/50 shadow-lg shadow-menta/5'
                      : 'bg-surface-800 text-text-secondary border-surface-600 hover:border-menta/30'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Task Grid */}
          <section className="px-12 py-10 pb-32">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest">
                Exibindo {filteredTasks.length} de {tasks.length} tarefas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="group p-5 rounded-2xl bg-surface-800 border border-surface-700 card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-900 text-menta border border-menta/10">
                        {task.category.toUpperCase()}
                      </span>
                      <code className="text-[10px] text-text-muted font-mono">{task.agent}</code>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-menta transition-colors">
                      {task.name}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed mb-4">
                      {task.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-700 flex items-center justify-between">
                    <code className="text-[10px] text-text-muted">{task.file}</code>
                    <span className="text-[10px] text-menta opacity-0 group-hover:opacity-100 transition-opacity">
                      Protocol Active →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="py-20 text-center rounded-3xl border border-dashed border-surface-700">
                <span className="text-4xl mb-4 block">🚫</span>
                <p className="text-text-secondary">Nenhuma tarefa encontrada para sua busca.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
