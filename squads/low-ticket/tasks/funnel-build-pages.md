---
task: Build Funnel Pages
responsavel: "@funnel-engineer"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - funnel_architecture: funnel-architecture.md do @funnel-chief
  - page_specs: page-specs/ com specs por página
  - copy: Copy aprovada (sales-letter.md, checkout copy, etc.)
  - creatives: Briefings de criativos aprovados
  - platform: Plataforma de build (elementor, clickfunnels, webflow, custom)
Saida: |
  - page-implementations/: Specs de implementação por página
  - integration-docs.md: Documentação de integrações
  - tracking-plan.md: Plano de tracking (pixels, events, UTMs)
  - test-report.md: Relatório de testes de funcionalidade
Checklist:
  - "[ ] Ler funnel-architecture.md e page-specs/"
  - "[ ] Implementar landing page / VSL page"
  - "[ ] Implementar página de checkout + order bump"
  - "[ ] Implementar upsell/downsell pages"
  - "[ ] Implementar thank you page"
  - "[ ] Configurar integrações (email, CRM, webhook)"
  - "[ ] Configurar tracking (pixels, events, UTMs)"
  - "[ ] Testar fluxo completo (compra, abandono, upsell)"
  - "[ ] Testar em mobile"
  - "[ ] Testar velocidade de carregamento (<3s)"
  - "[ ] Submeter para revisão do @funnel-chief"
---

# *build-landing / *build-checkout — Build Funnel Pages

Implementa todas as páginas do funil conforme specs do @funnel-chief.

## Uso

```
@funnel-engineer *build-landing
@funnel-engineer *build-checkout
@funnel-engineer *setup-integrations
@funnel-engineer *setup-tracking
```

## Implementação por Página

### Landing Page / VSL Page

```markdown
# Page Implementation — Landing Page

## Specs Reference: page-specs/landing-page.md

## Seções (top to bottom)
1. **Hero Section**
   - Headline: [do hooks.md aprovado]
   - Sub-headline: [do copy aprovado]
   - CTA Button: [texto + cor]
   - Hero image/video: [do creative brief]

2. **Problem Section**
   - Copy: [da sales-letter.md]
   - Elementos visuais: [ícones, imagens]

3. **Solution Section**
   - Copy: [da sales-letter.md]
   - Product mockup: [do creative brief]

4. **Social Proof**
   - Depoimentos: [3-5 testimonials]
   - Números: [resultados, clientes]

5. **Offer Stack**
   - Produto principal + valor
   - Bônus + valores individuais
   - Total vs preço real

6. **CTA Section**
   - Botão de compra
   - Garantia badge
   - Urgência element

7. **FAQ**
   - 5-7 perguntas frequentes

8. **Final CTA**
   - Último apelo + botão

## Requisitos Técnicos
- Mobile responsive: Sim
- Load time: < 3 segundos
- Lazy loading: Imagens e vídeos
- AMP: Opcional
```

### Checkout Page

```markdown
# Page Implementation — Checkout

## Campos obrigatórios
- Nome completo
- Email
- Telefone (opcional)
- Dados de pagamento

## Order Bump
- Checkbox com descrição curta
- Preço: R$[X]
- Copy: [do checkout copy]

## Trust Elements
- Cadeado SSL
- Garantia badge
- Logos de pagamento
- Depoimento rápido

## Tracking Events
- InitiateCheckout (ao carregar)
- AddPaymentInfo (ao preencher cartão)
- Purchase (ao completar)
```

## Plano de Tracking

```markdown
# Tracking Plan

## Pixels
| Pixel | ID | Páginas |
|-------|-----|---------|
| Meta Pixel | [ID] | Todas |
| Google Tag | [ID] | Todas |
| TikTok Pixel | [ID] | Todas |

## Events
| Event | Trigger | Página |
|-------|---------|--------|
| PageView | Page load | Todas |
| ViewContent | LP load | Landing |
| InitiateCheckout | Checkout load | Checkout |
| AddPaymentInfo | Card fill | Checkout |
| Purchase | Payment success | Thank You |

## UTM Structure
campaign={campaign_name}&source={platform}&medium=cpc&content={ad_id}&term={adset_id}
```

## Test Checklist

```
[ ] Fluxo de compra completo (cartão teste)
[ ] Order bump funcional
[ ] Upsell/downsell flow
[ ] Abandono → email de recuperação
[ ] Mobile: todas as páginas
[ ] Velocidade: < 3s em todas
[ ] Pixels: todos disparando corretamente
[ ] Email: automações trigando
[ ] Links: todos funcionais
[ ] Cross-browser: Chrome, Safari, Firefox
```
