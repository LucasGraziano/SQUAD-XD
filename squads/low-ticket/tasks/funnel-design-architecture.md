---
task: Design Funnel Architecture
responsavel: "@funnel-chief"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - offer-thesis.md: Tese da oferta
  - product-blueprint.md: Estrutura do produto
  - sales-letter.md: Copy aprovada
  - type: Tipo de funil (direct, quiz, vsl, webinar)
Saida: |
  - funnel-architecture.md: Arquitetura completa do funil
  - page-specs/: Especificações por página
  - conversion-map.md: Mapa de conversão com benchmarks
Checklist:
  - "[ ] Definir tipo de funil ideal"
  - "[ ] Mapear todas as páginas e fluxos"
  - "[ ] Definir order bump e upsell/downsell"
  - "[ ] Criar specs por página"
  - "[ ] Definir mapa de conversão"
  - "[ ] Delegar implementação para @funnel-engineer"
---

# *design-funnel — Arquitetura do Funil

Arquiteta o funil de vendas completo com specs por página.

## Output: funnel-architecture.md

```markdown
# Arquitetura do Funil — [Oferta]

## Tipo: [Direct / Quiz / VSL]

## Fluxo Principal
Ad → [Página 1] → [Página 2] → ... → Thank You

## Páginas

### 1. Landing Page / VSL Page
- **URL:** /oferta
- **Objetivo:** Converter visitante em comprador
- **Copy:** sales-letter.md
- **CTA:** Botão de compra
- **Mobile:** Sim

### 2. Checkout
- **URL:** /checkout
- **Campos:** Nome, Email, Telefone, Cartão
- **Order Bump:** [produto complementar - R$X]
- **Pixel events:** InitiateCheckout, AddPaymentInfo

### 3. Upsell 1
- **URL:** /oferta-especial
- **Produto:** [upsell - R$X]
- **Timer:** 15 minutos
- **Opções:** Sim / Não obrigado

### 4. Downsell (se recusar upsell)
- **URL:** /ultima-chance
- **Produto:** [downsell - R$X]

### 5. Thank You
- **URL:** /obrigado
- **Conteúdo:** Acesso ao produto + próximos passos
- **Pixel events:** Purchase

## Automações
- Email 1: Boas-vindas + acesso (imediato)
- Email 2: Como começar (24h)
- Email 3: Dica de uso (48h)
- Abandono: Sequência de recuperação (1h, 24h, 48h)

## Monetização
| Componente | Preço | Conv. Esperada |
|-----------|-------|----------------|
| Produto principal | R$27 | 2-5% |
| Order bump | R$17 | 30-40% |
| Upsell | R$97 | 10-15% |
| Downsell | R$47 | 15-20% |
| **Ticket médio estimado** | **R$42-55** | |
```
