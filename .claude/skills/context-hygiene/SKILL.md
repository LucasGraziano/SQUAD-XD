---
name: context-hygiene
description: >
  Activate when context window is getting large (>80k tokens), when switching between
  completely different tasks, when starting a new unrelated feature, or when the user
  asks to "clean up", "start fresh", "new context", "clear", or "limpar contexto".
  Also triggers after completing a major task to suggest /clear or /compact.
---

# context-hygiene Skill

## What This Does

Prevents token waste and context pollution by recommending /clear or /compact at
the right moments. Based on the "context hygiene" principle from the video transcripts.

## When to Trigger

### Automatic scenarios:
- Switching from one squad (psi-saas) to a completely different one (low-ticket)
- Finishing a large feature implementation
- After 5+ consecutive tool calls on unrelated files
- Context estimate > 80k tokens

### User signals:
- "nova tarefa", "nova feature", "mudar de assunto"
- "está lento", "está confuso", "contexto sujo"

## Recommendations

### Use /clear when:
- Completely new task with no shared context
- Different squad, different codebase area
- Starting a new story from scratch

### Use /compact when:
- Same project but need to compress history
- Long debugging session that resolved
- Keeping key decisions but trimming exploration

### Use /checkpoint first when:
- Current progress should be saved before clearing
- Run `/checkpoint` then `/clear`

## Cost Reminder

Each 100k tokens in context = ~$0.30 in reads per turn.
A clean context on simple tasks can be 90% cheaper.

## Subagent Strategy (from transcrições)
For independent tasks: spawn background agent (cheaper than polluting main context)
Hierarchy: Opus 4.7 (orchestrate) → Sonnet 4.6 (implement) → Haiku 4.5 (simple tasks)
