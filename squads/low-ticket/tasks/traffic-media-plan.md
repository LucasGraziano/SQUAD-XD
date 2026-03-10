---
task: Create Media Plan
responsavel: "@traffic-head"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - product_price: Preço do produto
  - budget: Orçamento disponível
  - platforms: Plataformas (meta, google, tiktok)
  - duration: Duração da campanha
Saida: |
  - media-plan.md: Plano de mídia completo
  - budget-allocation.yaml: Alocação de orçamento
  - cpa-targets.md: CPA targets por canal
Checklist:
  - "[ ] Calcular unit economics"
  - "[ ] Definir CPA target"
  - "[ ] Alocar orçamento por plataforma"
  - "[ ] Definir fases (teste → otimização → escala)"
  - "[ ] Delegar estrutura de campanhas para @media-buyer"
  - "[ ] Preparar dashboard com @metrics-analyst"
---

# *media-plan — Plano de Mídia

Plano completo com orçamento, CPA targets e fases.

## Output: media-plan.md

```markdown
# Plano de Mídia — [Oferta]

## Unit Economics
| Métrica | Valor |
|---------|-------|
| Preço do produto | R$27 |
| Ticket médio (com bumps) | R$45 |
| Custo do produto | R$0 |
| Taxa plataforma (10%) | R$4.50 |
| **CPA target máximo** | **R$18** |
| **CPA target ideal** | **R$12** |
| **Lucro por venda (ideal)** | **R$28.50** |

## Orçamento
| Fase | Duração | Budget/dia | Budget total |
|------|---------|-----------|-------------|
| Teste | 7 dias | R$50 | R$350 |
| Otimização | 14 dias | R$80 | R$1.120 |
| Escala | Ongoing | R$200+ | Variável |

## Distribuição por Plataforma
| Plataforma | % Budget | Fase Teste |
|-----------|---------|-----------|
| Meta Ads | 70% | R$35/dia |
| Google Ads | 20% | R$10/dia |
| TikTok Ads | 10% | R$5/dia |

## Fases

### Fase 1: TESTE (7 dias)
- 3-5 públicos diferentes
- 3-5 criativos por público
- Budget: 2-3x CPA target por adset
- Kill rule: sem conversão após gastar 2x CPA → pausar
- Win rule: 3+ conversões abaixo CPA target → marcar winner

### Fase 2: OTIMIZAÇÃO (14 dias)
- Escalar winners do teste
- Testar novos criativos com públicos vencedores
- Ajustar CPA targets baseado em dados reais
- Introduzir retargeting

### Fase 3: ESCALA (ongoing)
- Aumentar budget 20-30% a cada 2-3 dias
- Expansão horizontal (novos públicos similares)
- Expansion vertical (mais budget nos winners)
- Diversificar plataformas
```
