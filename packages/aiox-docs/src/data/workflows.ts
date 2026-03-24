export interface WorkflowPhase {
  number: number
  agent: string
  agentIcon: string
  task: string
  output: string
  description: string
}

export interface Workflow {
  id: string
  name: string
  type: string
  description: string
  phases: WorkflowPhase[]
  whenToUse: string
}

export const workflows: Workflow[] = [
  {
    id: 'story-development-cycle',
    name: 'Story Development Cycle (SDC)',
    type: 'PRIMARY',
    description: 'Full 4-phase workflow for all development work. Create → Validate → Implement → QA Review.',
    whenToUse: 'New story from epic, any development task',
    phases: [
      { number: 1, agent: 'sm', agentIcon: '🌊', task: 'create-next-story.md', output: 'story.md', description: 'Create story from PRD/epic' },
      { number: 2, agent: 'po', agentIcon: '🎯', task: 'validate-next-story.md', output: 'GO/NO-GO verdict', description: '10-point validation checklist' },
      { number: 3, agent: 'dev', agentIcon: '💻', task: 'dev-develop-story.md', output: 'Working code', description: 'Implement with CodeRabbit self-healing' },
      { number: 4, agent: 'qa', agentIcon: '✅', task: 'qa-gate.md', output: 'PASS/FAIL verdict', description: '7-point quality gate' },
    ],
  },
  {
    id: 'qa-loop',
    name: 'QA Loop',
    type: 'ITERATIVE',
    description: 'Automated review-fix cycle. @qa reviews → verdict → @dev fixes → re-review (max 5 iterations).',
    whenToUse: 'QA found issues, need iteration',
    phases: [
      { number: 1, agent: 'qa', agentIcon: '✅', task: 'qa-review', output: 'APPROVE/REJECT/BLOCKED', description: 'Review code quality and criteria' },
      { number: 2, agent: 'dev', agentIcon: '💻', task: 'dev-apply-qa-fixes', output: 'Fixed code', description: 'Apply fixes from QA feedback' },
      { number: 3, agent: 'qa', agentIcon: '✅', task: 'qa-re-review', output: 'Final verdict', description: 'Re-review after fixes (max 5x)' },
    ],
  },
  {
    id: 'spec-pipeline',
    name: 'Spec Pipeline',
    type: 'PRE-IMPLEMENTATION',
    description: 'Transform informal requirements into executable spec. 6 phases with complexity-based phase skipping.',
    whenToUse: 'Complex feature needs spec before coding',
    phases: [
      { number: 1, agent: 'pm', agentIcon: '📋', task: 'spec-gather', output: 'requirements.json', description: 'Gather requirements (never skip)' },
      { number: 2, agent: 'architect', agentIcon: '📐', task: 'spec-assess', output: 'complexity.json', description: 'Assess complexity (5 dimensions, score 1-25)' },
      { number: 3, agent: 'analyst', agentIcon: '🔍', task: 'spec-research', output: 'research.json', description: 'Research dependencies (skip if SIMPLE)' },
      { number: 4, agent: 'pm', agentIcon: '📋', task: 'spec-write', output: 'spec.md', description: 'Write specification (never skip)' },
      { number: 5, agent: 'qa', agentIcon: '✅', task: 'spec-critique', output: 'critique.json', description: 'Critique spec (APPROVED/NEEDS_REVISION/BLOCKED)' },
      { number: 6, agent: 'architect', agentIcon: '📐', task: 'spec-plan', output: 'implementation.yaml', description: 'Implementation plan (if APPROVED)' },
    ],
  },
  {
    id: 'brownfield-discovery',
    name: 'Brownfield Discovery',
    type: 'ASSESSMENT',
    description: '10-phase technical debt assessment for existing codebases. Data collection → drafting → validation → finalization.',
    whenToUse: 'Joining existing project, legacy assessment',
    phases: [
      { number: 1, agent: 'architect', agentIcon: '📐', task: 'analyze-brownfield', output: 'system-architecture.md', description: 'System architecture analysis' },
      { number: 2, agent: 'data-engineer', agentIcon: '🗄️', task: 'db-schema-audit', output: 'SCHEMA.md + DB-AUDIT.md', description: 'Database audit (if DB exists)' },
      { number: 3, agent: 'ux-design-expert', agentIcon: '🎨', task: 'frontend-spec', output: 'frontend-spec.md', description: 'Frontend specification' },
      { number: 4, agent: 'architect', agentIcon: '📐', task: 'tech-debt-draft', output: 'technical-debt-DRAFT.md', description: 'Technical debt draft' },
      { number: 5, agent: 'data-engineer', agentIcon: '🗄️', task: 'db-review', output: 'db-specialist-review.md', description: 'Database specialist review' },
      { number: 6, agent: 'ux-design-expert', agentIcon: '🎨', task: 'ux-review', output: 'ux-specialist-review.md', description: 'UX specialist review' },
      { number: 7, agent: 'qa', agentIcon: '✅', task: 'qa-review', output: 'qa-review.md', description: 'QA gate (APPROVED/NEEDS WORK)' },
      { number: 8, agent: 'architect', agentIcon: '📐', task: 'finalize', output: 'technical-debt-assessment.md', description: 'Final assessment document' },
      { number: 9, agent: 'analyst', agentIcon: '🔍', task: 'executive-report', output: 'TECHNICAL-DEBT-REPORT.md', description: 'Executive summary report' },
      { number: 10, agent: 'pm', agentIcon: '📋', task: 'epic-stories', output: 'Epic + stories', description: 'Create epic and stories for fixes' },
    ],
  },
]

export const workflowSelectionGuide = [
  { situation: 'New story from epic', workflow: 'Story Development Cycle' },
  { situation: 'QA found issues, need iteration', workflow: 'QA Loop' },
  { situation: 'Complex feature needs spec', workflow: 'Spec Pipeline → then SDC' },
  { situation: 'Joining existing project', workflow: 'Brownfield Discovery' },
  { situation: 'Simple bug fix', workflow: 'SDC only (YOLO mode)' },
]
