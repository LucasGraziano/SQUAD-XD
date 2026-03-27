# PRD Shard: Mega Brain (FR-7)

## Requirements
- FR-7.1: Stats (60 items, 14 experts, 5 layers, 42 dossiers, 12 playbooks, 40 domains, 292 skill chunks)
- FR-7.2: DNA System - 5 layers cards (Filosofias, Modelos-Mentais, Heuristicas, Frameworks, Metodologias)
- FR-7.3: Architecture tree (directory listing pre-formatted)
- FR-7.4: Sync Pipeline em 4 passos: Scan → Hash → Parse → Feed
- FR-7.5: 14 Expert cards com: name, focus, icon, keyInsight, todas as layers com items
- FR-7.6: 6 dossier categories com counts e descriptions
- FR-7.7: Company context: founders (2) com age/role/focus/style/goals, products com full details
- FR-7.8: Business model 3-layer visual
- FR-7.9: 5 Low-Ticket workflows

## Data: mega-brain.ts
- experts[]: 14 entries com layers[]
- dnaLayers[]: 5 entries
- megaBrainStats, dossierCategories[], companyContext, lowTicketWorkflows[]
