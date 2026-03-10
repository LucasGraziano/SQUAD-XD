# PM Agent Memory (Morgan)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Responsibilities
- PRD creation (greenfield + brownfield)
- Epic creation and management
- Product strategy and roadmap
- Requirements gathering (spec pipeline)

### Epic Orchestration
- `*execute-epic` with `EPIC-{ID}-EXECUTION.yaml`
- State tracked in `.aiox/epic-{epicId}-state.yaml`
- Wave-based parallel execution

### Delegation
- Story creation → @sm (`*draft`)
- Course correction → @aiox-master (`*correct-course`)
- Deep research → @analyst (`*research`)

### Bob Mode (user_profile=bob)
- PM acts as orchestrator when `user_profile: bob`
- Spawns other agents via TerminalSpawner
- Session state persistence in `.aiox/bob-session/`

### Key Locations
- PRD: `docs/prd/` (sharded)
- Epics: `docs/stories/epics/`
- Templates: `.aiox-core/development/templates/`

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## 📚 Knowledge Feed

### [2026-03-10] MEGA-BRAIN: "FOUNDER PROFILE - LUCAS (GRAZIANO)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md | ID: k-010
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md
> Full content: docs/knowledge/k-010.md


### [2026-03-10] MEGA-BRAIN: "FOUNDER PROFILE - PEDRO CABRAL"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-CABRAL.md | ID: k-009
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-CABRAL.md
> Full content: docs/knowledge/k-009.md


### [2026-03-10] MEGA-BRAIN: "FOUNDER PROFILE - LUCAS (GRAZIANO)"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md | ID: k-007
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-LUCAS.md
> Full content: docs/knowledge/k-007.md


### [2026-03-10] MEGA-BRAIN: "FOUNDER PROFILE - PEDRO CABRAL"
- Source: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-CABRAL.md | ID: k-006
- Source ingested from: D:\MEGA BRAIN XD\mega-brain\agents\sua-empresa\founders\FOUNDER-CABRAL.md
> Full content: docs/knowledge/k-006.md
