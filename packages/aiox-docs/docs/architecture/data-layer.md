# Architecture Shard: Data Layer

## Pattern
TypeScript Data Files — constantes tipadas em `src/data/`.

## Files

| File | Exports | Records |
|------|---------|---------|
| `agents.ts` | Agent interface, aioxAgents[], lowTicketAgents[], allAgents[], getAgent() | 30 agents |
| `commands.ts` | Command interface, slashCommands[], agentCommands[], activationSyntax[] | 8+9+3 entries |
| `constitution.ts` | Article interface, articles[], severityColors | 6 articles |
| `mega-brain.ts` | Expert, DnaLayer interfaces, experts[], dnaLayers[], megaBrainStats, companyContext, dossierCategories[], lowTicketWorkflows[] | 14 experts |
| `tasks.ts` | Task interface, tasks[], taskCategories[], totalTasks | 207 tasks, 19 cats |
| `workflows.ts` | Workflow, WorkflowPhase interfaces, workflows[], workflowSelectionGuide[] | 4 workflows |

## Principles
- Zero runtime dependencies (no fetch, no API)
- Type-safe with explicit interfaces
- Easy to update (edit .ts, rebuild)
- Pre-computed at build time (SSG)
