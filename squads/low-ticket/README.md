# Low-Ticket Squad

Equipe hierárquica de **18 agentes AI** focada em **criar, testar e escalar ofertas de baixo custo (low-ticket)**.

## Visão Geral

| Aspecto | Valor |
|---------|-------|
| **Agentes** | 18 (1 Commander + 6 Chiefs + 11 Especialistas) |
| **Departamentos** | 6 (Intel, Copy, Creative, Funnel, Traffic, Product) |
| **Workflows** | 5 (New Offer, Audit, Email Nurture, Scaling, Daily Monitor) |
| **Tasks** | 27 |
| **Templates** | 8 |
| **Checklists** | 5 |
| **Scripts** | 2 |

## Hierarquia

```
                         🎖️ Atlas (Commander)
                                │
        ┌──────┬────────┬───────┼────────┬──────┬──────┐
        │      │        │       │        │      │
      🧠Sage ✍️Quill  🎨Pixel 🔧Flow  📊Boost 📦Blueprint
      Intel   Copy    Creative Funnel  Traffic Product
        │      │        │       │        │
    ┌───┤   ┌──┼──┐  ┌──┤   ┌───┤    ┌───┤
    │   │   │  │  │  │  │   │   │    │   │
  ⛏️Scout 🖊️Ink 🪝Snap 🖌️Vega ⚙️Forge 🎯Bid 📈Pulse
  🔍Vigil  🎬Reel     📹Frame ❓Riddle
```

## Quick Start

### Criar oferta do zero
```
@commander *new-offer --niche "seu nicho" --persona "seu público" --price 27
```

### Auditar materiais existentes
```
@commander *audit --docs ./projects/zero-diastase/
```

### Otimização contínua (ciclos semanais)
```
@commander *scale
```

### Monitoramento diário de campanhas
```
@traffic-head *daily-report
```

### Criar sequências de email
```
@copy-chief *email-strategy
```

### Acessar departamento específico
```
@copy-chief *generate-hooks --qty 15
@traffic-head *media-plan --budget 1000
@creative-director *generate-prompts --tool midjourney
@visual-designer *design-brief --type ad --format video  # Vega 🖌️
@video-editor *video-script --type ugc --duration 60s    # Frame 📹
```

## Departamentos

### 🧠 Inteligência
Pesquisa de mercado, mineração de dores/desejos, análise competitiva, definição de tese.

**Agentes:** Sage (Chief), Scout (Miner), Vigil (Analyst)

### ✍️ Copy
Textos persuasivos: cartas de vendas, hooks, roteiros, emails, quiz copy. Review formal com scorecard.

**Agentes:** Quill (Chief), Ink (Copywriter), Snap (Hook Master), Reel (Script Writer)

### 🎨 Criativo
Direção de arte, design visual, prompts para IA de imagem, roteiros de vídeo, specs de edição, thumbnails, UGC guidelines.

**Agentes:** Pixel (Director), Vega 🖌️ (Visual Designer), Frame 📹 (Video Editor)

### 🔧 Funil
Arquitetura de funil, checkout, quiz funnels, construção de páginas, integrações, tracking.

**Agentes:** Flow (Chief), Forge (Engineer), Riddle (Quiz Builder)

### 📊 Tráfego
Plano de mídia, compra de mídia, estrutura de campanhas, análise de métricas, relatórios diários.

**Agentes:** Boost (Head), Bid (Media Buyer), Pulse (Metrics Analyst)

### 📦 Produto
Formato do entregável, estrutura de conteúdo, bônus, experiência pós-compra.

**Agentes:** Blueprint (Architect)

## Workflows

### 1. New Offer Pipeline (`*new-offer`)
Pipeline de 9 fases para criar oferta do zero:
1. **Inteligência** → offer-thesis.md
2. **Produto** → product-blueprint.md
3. **Copy** → sales-letter.md, hooks.md, vsl-script.md
4. **Review de Copy** → review-verdict.md, approved-copy/
5. **Criativos** → creative-briefs/, ad-prompts/, video-specs/
6. **Funil (arquitetura)** → funnel-architecture.md, quiz-spec.md
7. **Funil (build)** → page-implementations/, tracking-plan.md
8. **Tráfego** → media-plan.md, campaign-structure.md
9. **Email** → welcome, nurture, abandonment sequences

### 2. Audit Pipeline (`*audit`)
Diagnóstico paralelo de materiais existentes:
1. **Análise paralela** por todos os departamentos
2. **Consolidação** → audit-report.md
3. **Otimização** → ações priorizadas por impacto

### 3. Email Nurture Pipeline (`*email-nurture`)
Pipeline de email marketing completo:
1. **Estratégia** → email-strategy.md
2. **Sequências** → welcome, nurture, abandonment
3. **Upsell** → upsell-sequence.md, reactivation-sequence.md
4. **Review** → email-final-package.md

### 4. Scaling Pipeline (`*scale`)
Otimização contínua em ciclos semanais:
1. **Review de métricas** → weekly-metrics-report.md
2. **Diagnóstico** → decisões SCALE / CUT / TEST
3. **Novas variações** → criativos, copy, público (dinâmico)
4. **Deploy** → campaign-update-plan.md
5. **Medição** → cycle-results.md

### 5. Daily Monitor Pipeline (`*daily-report`)
Monitoramento diário de campanhas ativas:
1. **Coleta** → daily-report.md
2. **Análise de anomalias** → alerts.md (critical/warning/info)
3. **Recomendações** → daily-actions.md

## Templates

| Template | Uso |
|----------|-----|
| `offer-thesis-template.md` | Estrutura da tese da oferta |
| `hooks-template.md` | Geração de hooks persuasivos |
| `product-blueprint-template.md` | Blueprint do produto |
| `media-plan-template.md` | Plano de mídia pago |
| `daily-report-template.md` | Relatório diário de métricas |
| `big-idea-framework-template.md` | Framework Big Idea (5 elementos) |
| `quiz-architecture-template.md` | Arquitetura de quiz de conversão |
| `email-sequence-template.md` | Sequências de email (10 tipos) |

## Checklists

| Checklist | Uso |
|-----------|-----|
| `copy-review-checklist.md` | Scorecard de review de copy (10 pontos) |
| `campaign-launch-checklist.md` | Pré-launch de campanhas |
| `funnel-launch-checklist.md` | Pré-launch de funil |
| `offer-validation-checklist.md` | Validação de oferta |
| `ab-test-checklist.md` | Rigor estatístico em A/B tests |

## Scripts

### Metrics Calculator
```bash
# Unit economics com todos os bumps/upsells
node scripts/metrics-calculator.js unit-economics --price 19.90 --cpa 12

# CPA máximo sustentável
node scripts/metrics-calculator.js cpa-target --aov 27

# ROAS atual vs target
node scripts/metrics-calculator.js roas --spend 100 --revenue 300

# Sample size para A/B test
node scripts/metrics-calculator.js ab-sample --base-rate 0.03 --mde 0.20

# Projeção de escala
node scripts/metrics-calculator.js scale-forecast --spend 50 --cpa 12
```

### Populate Briefing
```bash
# Extrair dados de um documento para o briefing
node scripts/populate-briefing.js zero-diastase ../../docs/BRIEFING.md
```

## Projetos

### zero-diastase
Protocolo digital de 28 dias para recuperação abdominal pós-parto.
- **Status:** Briefing preenchido, pronto para audit
- **Preço:** US$19.90
- **Mercado:** LATAM hispânico
- **Ativar:** `@commander *audit --docs ./projects/zero-diastase/`

## Estrutura de Arquivos

```
squads/low-ticket/
├── squad.yaml                          # Manifest v2.0.0
├── README.md                           # Este arquivo
├── agents/                             # 18 agent definitions
│   ├── commander.md                    # 🎖️ Atlas — Chief of Staff
│   ├── intel-chief.md                  # 🧠 Sage — Intel Chief
│   ├── research-miner.md              # ⛏️ Scout — Research Miner
│   ├── competitor-analyst.md          # 🔍 Vigil — Competitor Analyst
│   ├── copy-chief.md                  # ✍️ Quill — Copy Chief
│   ├── copywriter.md                  # 🖊️ Ink — Copywriter
│   ├── hook-master.md                 # 🪝 Snap — Hook Master
│   ├── script-writer.md              # 🎬 Reel — Script Writer
│   ├── creative-director.md           # 🎨 Pixel — Creative Director
│   ├── visual-designer.md            # 🖌️ Vega — Visual Designer (v2.0)
│   ├── video-editor.md               # 📹 Frame — Video Editor (v2.0)
│   ├── funnel-chief.md               # 🔧 Flow — Funnel Chief
│   ├── funnel-engineer.md            # ⚙️ Forge — Funnel Engineer
│   ├── quiz-builder.md               # ❓ Riddle — Quiz Builder
│   ├── traffic-head.md               # 📊 Boost — Traffic Head
│   ├── media-buyer.md                # 🎯 Bid — Media Buyer
│   ├── metrics-analyst.md            # 📈 Pulse — Metrics Analyst
│   └── product-architect.md          # 📦 Blueprint — Product Architect
├── tasks/                             # 23 task definitions
├── workflows/                         # 5 workflow definitions
│   ├── new-offer-pipeline.yaml       # Pipeline completo (9 fases)
│   ├── audit-pipeline.yaml           # Diagnóstico paralelo
│   ├── email-nurture-pipeline.yaml   # Email marketing (v2.0)
│   ├── scaling-pipeline.yaml         # Otimização contínua (v2.0)
│   └── daily-monitor-pipeline.yaml   # Monitoramento diário (v2.0)
├── templates/                         # 8 templates
├── checklists/                        # 5 checklists
├── scripts/                           # 2 utility scripts (v2.0)
│   ├── metrics-calculator.js         # Unit economics, CPA, ROAS, A/B
│   └── populate-briefing.js          # Extrair dados para briefing
└── projects/                          # Projetos ativos
    └── zero-diastase/                # Primeiro projeto
        ├── briefing.md               # Briefing preenchido
        ├── materiais/                # TSL, sales page, ads, emails
        ├── screenshots/              # Prints do funil
        └── metricas/                 # Dados do Meta Ads
```

## Cross-Squad Dependencies

| Squad | Relação |
|-------|---------|
| `zero-diastasis` | App de entrega do produto (site de membros Next.js) |

---
*Low-Ticket Squad v2.0.1 — Updated 2026-03-04*
