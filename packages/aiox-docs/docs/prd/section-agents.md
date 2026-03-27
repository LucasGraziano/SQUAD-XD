# PRD Shard: Core Agents (FR-3)

## Requirements
- FR-3.1: Quick reference pills com @id para cada agente (anchor scroll)
- FR-3.2: Card expandido com: icon, name, title, zodiac, archetype, role, commands (cmd+desc), exclusive ops, collaborates, story permissions, blocked ops, coderabbit integration, key principle
- FR-3.3: Cores unicas por agente (border-color diferente)
- FR-3.4: Delegation Matrix table (4 flows: Git Push, Schema Design, Story Flow, Epic Flow)
- FR-3.5: Seção de story permissions com badges de permissao/bloqueio

## Data: agents.ts
- 12 aioxAgents com interface Agent completa
- Campos: id, name, icon, title, role, tier, system, zodiac, archetype, commands[], exclusive[], collaborates[], department, storyPermissions[], blockedOps[], coderabbit, keyPrinciple
