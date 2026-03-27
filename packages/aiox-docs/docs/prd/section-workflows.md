# PRD Shard: Workflows & Tasks (FR-4 + FR-8)

## Workflow Requirements (FR-4)
- FR-4.1: Selection guide (5 situacoes → workflow recomendado)
- FR-4.2: 3 modos de execucao com prompts count e descricao
- FR-4.3: WorkflowDiagram com timeline, numbered phases, agent icon, output badge
- FR-4.4: QA Loop: 6 commands, 3 verdicts (APPROVE/REJECT/BLOCKED), escalation triggers
- FR-4.5: 7-point quality gate checklist
- FR-4.6: Spec Pipeline: 3 complexity classes (SIMPLE/STANDARD/COMPLEX) com scores

## Task Requirements (FR-8)
- FR-8.1: 19 categorias filtraveis via pills
- FR-8.2: Search input com busca em tempo real
- FR-8.3: Grid de task cards (nome, agente, descricao, arquivo)
- FR-8.4: Contador dinamico "Exibindo X de Y tarefas"

## Data: tasks.ts + workflows.ts
- 207 tasks com: name, file, agent, description, category
- 4 workflows com phases[], whenToUse, type
