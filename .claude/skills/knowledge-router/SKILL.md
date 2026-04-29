---
name: knowledge-router
description: >
  Activate when a question requires strategic, marketing, persuasion, copywriting,
  sales, funnel, traffic, offer, psychology, design, or product knowledge.
  Routes to the correct expert DNA, dossier, or playbook in the knowledge layer.
  Triggered by: "como escrever", "copy", "oferta", "funil", "tráfego", "vendas",
  "psicologia", "persuasão", "estratégia", "posicionamento", "preço", "design system",
  "produto", "feature", "saas", "lançamento".
---

# knowledge-router Skill

## What This Does

Routes queries to the correct knowledge layer artifact instead of relying on
generic LLM knowledge. Prevents low-quality generic answers on specialized topics.

## Domain Map

### Info-Marketing (7 domínios existentes)
| Situação | Expert/Dossier | Arquivo |
|---------|---------------|---------|
| Copy de vendas, headline | doug-bross, gary-halbert | domains/copy-persuasion/ |
| Estrutura de oferta | alex-hormozi | domains/offers-pricing/ |
| Closing, objeções | jordan-belfort | domains/sales-closing/ |
| Facebook/Instagram ads | ryan-deiss | domains/traffic-ads/ |
| VSL, funnel | russell-brunson | domains/funnels-value-ladder/ |
| Operacional, sistemas | alex-charfen | domains/systems-ops/ |
| Gatilhos mentais | robert-cialdini | domains/psychology-influence/ |

### AI-Native Build (domínio novo — 2026-04-29)
| Situação | Expert/Arquivo |
|---------|---------------|
| Configurar Claude Code, CLAUDE.md, squads | mateus-dias-dna.md |
| Skills, hooks, CLIs, reduzir tokens | chase-dna.md |
| DESIGN.md, tokens de design, anti-AI-slop | alon-dna.md |
| Decisão entre experts | _decision-map.md |
| O que não fazer | _anti-patterns.md |

### Cross-Domain Dossiers
| Situação | Dossier |
|---------|---------|
| Sistema completo AI-native (10 fontes) | ai-native-operator-system.md |
| Escalar negócio digital | high-ticket-vs-low-ticket.md |

### Playbooks Disponíveis
| Situação | Playbook |
|---------|---------|
| Setup de projeto AI-native do zero | ai-native-project-setup.md |
| OS operacional da empresa | operating-system.md |
| Cadência de reuniões | meeting-rhythm.md |

### Quick Router
1. Check `_SITUATIONS.yaml` for situational routing
2. Load Registry: `.aiox-core/knowledge/_REGISTRY.yaml`
3. Load Domain Index: `domains/{domain}/_index.md`
4. Load specific expert/dossier

## Token Budget
- Index check: ~150 tokens
- Expert DNA: ~700 tokens
- Dossier: ~1000 tokens
- Max per session: 5000 tokens

## Usage Pattern
```
*knowledge copy-persuasion/doug
*knowledge dossier:ai-native-operator-system
*knowledge situation:criar-oferta-irresistivel
```
