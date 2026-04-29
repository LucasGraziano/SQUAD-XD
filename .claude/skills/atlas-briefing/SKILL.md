---
name: atlas-briefing
description: >
  Activate when user asks for project status, operational context, what's happening,
  what's in progress, current state of the system, or starts a new session and asks
  for an overview. Triggered by: "status", "o que está acontecendo", "briefing",
  "contexto", "o que temos", "retomar", "recall", "onde estamos", "overview".
---

# atlas-briefing Skill

## What This Does

Provides a compact operational status report of the AIOX system and active squads.
Always run /atlas-briefing command or gather context from memory + git status.

## Activation Protocol

1. Check memory files for recent context:
   - `C:\Users\Graziano\.claude\projects\C--SQUAD-XD\memory\MEMORY.md`
   - Recent project memories for active work

2. Run git status check:
   ```
   git log --oneline -5
   git status --short
   ```

3. Check active squads:
   - `squads/psi-saas/README.md` (Vínculo — B2B SaaS psicólogos)
   - `squads/low-ticket/` (produtos info-marketing)
   - `squads/zero-diastasis/` (Zero Diástase)

4. Check pending stories:
   ```
   docs/stories/
   ```

5. Report format (compact):
   ```
   ## Status Operacional
   **Data:** {today}
   **Branch:** {current}
   **Último commit:** {message}

   ### Squads Ativos
   - psi-saas (Vínculo): {status}
   - low-ticket: {status}

   ### Próximas Ações
   - {action 1}
   - {action 2}
   ```

## When to Use This vs /atlas-briefing Command

- Skill: auto-triggered when session context is needed
- /atlas-briefing: user-invoked for full detailed briefing with all squads
