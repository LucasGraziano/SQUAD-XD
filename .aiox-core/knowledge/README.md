# AIOX Knowledge Layer v2.0

Sistema de inteligencia cognitiva para agentes AIOX.
Extrai, comprime e distribui conhecimento de experts para agentes operacionais.

## Arquitetura

```
knowledge/
├── _REGISTRY.yaml        # Indice mestre (~200 tokens) - experts, dossiers, playbooks
├── _ROUTING.yaml         # Mapeamento agente → dominios/dossiers/playbooks
├── INGEST-GUIDE.md       # Guia de ingestao de conteudo
├── domains/
│   └── {dominio}/
│       ├── _index.md     # Mini-indice (~50 tokens) - 1 linha por expert
│       ├── {expert}.md   # Conhecimento comprimido v1 (~500 tokens)
│       └── {expert}-dna.md  # DNA v2 — 5 camadas (~700 tokens)
├── dossiers/
│   └── {tema}.md         # Cross-source convergencias (~1000 tokens)
├── playbooks/
│   └── {nome}.md         # Framework operacional (~800 tokens)
└── README.md
```

## 3 Niveis de Conhecimento

### 1. Expert Knowledge (por dominio)

**Formato v1 (simples):** 3 campos — principios, frameworks, heuristicas (~500 tokens)

**Formato v2 (DNA):** 5 camadas cognitivas (~700 tokens)
- **L1 Filosofias** (max 8): crencas fundamentais do expert
- **L2 Modelos Mentais** (max 6): frameworks de pensamento
- **L3 Heuristicas** (max 8): regras com NUMEROS e thresholds
- **L4 Frameworks** (max 5): processos step-by-step
- **L5 Metodologias** (max 3): implementacao A→Z

Ingestao via `/ingest` — aceita video, transcricao, texto.

### 2. Dossiers (cross-source)

Convergencias entre multiplos experts sobre um tema.
Gerados via `/dossier` ou `/dossier --auto {dominio}`.

**Formato:** (~1000 tokens)
- Convergencias: onde 3+ experts concordam
- Divergencias: onde discordam (informacao valiosa)
- Heuristicas consolidadas: regras unificadas com fonte
- Meta-frameworks: padroes emergentes entre experts

### 3. Playbooks (operacionais)

Frameworks accionaveis gerados de dossiers.
Consultados via `/playbook {nome}`.

**Formato:** (~800 tokens)
- Objetivo + Filosofia core
- Framework step-by-step
- Scripts/templates prontos
- Heuristicas com timing
- Metricas de sucesso

## Carregamento sob demanda

```
Boot     → _REGISTRY.yaml (~200 tokens)
Ativacao → _index.md dos dominios primarios (~50 tokens cada)
Pedido   → Expert/DNA/Dossier/Playbook especifico
NUNCA    → Tudo de uma vez
```

### Token Budget

| Nivel | Tokens | Quando |
|-------|--------|--------|
| Index de dominio | ~50 | Ativacao de agente |
| Expert v1 | ~500 | `*knowledge {expert}` |
| Expert DNA v2 | ~700 | `*knowledge dna:{expert}` |
| Dossier | ~1000 | `*knowledge dossier:{tema}` |
| Playbook | ~800 | `*knowledge playbook:{nome}` |
| **Max/sessao** | **5000** | Limite total |

## Como usar

### Ingerir novo expert
```
/ingest                    # Modo DNA v2 (5 camadas)
/ingest --mode simple      # Modo v1 (3 campos)
```

### Gerar dossier
```
/dossier {tema}            # Gerar de experts relevantes
/dossier --auto {dominio}  # Auto-gerar de experts do dominio
```

### Consultar playbook
```
/playbook {nome}           # Consultar existente
/playbook --generate {tema} # Gerar de dossier
```

### Dentro de um agente
```
*knowledge {dominio}              # Carregar domain index
*knowledge {expert}               # Carregar expert especifico
*knowledge dna:{expert}           # Carregar DNA v2
*knowledge dossier:{tema}         # Carregar dossier
*knowledge playbook:{nome}        # Carregar playbook
```

## Dominios disponiveis (7)

| Dominio | Experts | Agentes |
|---------|---------|---------|
| copy-persuasion | 5 | copy-chief, analyst |
| offers-pricing | 3 | pm, analyst, commander |
| sales-closing | 3 | analyst, copy-chief |
| traffic-ads | 3 | traffic-head, creative-director |
| funnels-value-ladder | 3 | funnel-chief, pm, architect |
| systems-ops | 4 | pm, sm, architect |
| psychology-influence | 3 | copy-chief, analyst, creative-director |

## Dossiers disponiveis (6)

| Dossier | Sources | Agentes |
|---------|---------|---------|
| copywriting-persuasion | 5 experts | copy-chief, creative-director |
| traffic-acquisition | 3 experts | traffic-head, creative-director |
| funnels-value-ladder | 3 experts | funnel-chief, pm |
| offers-pricing | 3 experts | pm, analyst, commander |
| risk-management | 3 experts | analyst, pm, commander |
| process-improvement | 4 experts | pm, sm, architect |

## Playbooks disponiveis (4)

| Playbook | Source Dossier | Agentes |
|----------|---------------|---------|
| operating-system | process-improvement | pm, commander, sm |
| meeting-rhythm | process-improvement | pm, commander |
| referral-system | risk-management | analyst, pm |
| sales-productivity | offers-pricing | analyst, pm |
