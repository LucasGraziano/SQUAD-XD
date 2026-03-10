# Front-End Specification — Zero Diastasis™

## Gerado por: Uma (UX Design Expert)
## Data: 2026-03-09
## Workflow: brownfield-ui / Phase 1

---

## 1. Visão Geral do Projeto

### Stack Técnico
| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework | Next.js (App Router) | ^14.2.0 |
| Linguagem | TypeScript | ^5.5.0 |
| Styling | Tailwind CSS | ^3.4.0 |
| Animações | Framer Motion | ^11.0.0 |
| Ícones | Lucide React | ^0.400.0 |
| Output | Static Export (SSG) | — |

### Público-Alvo
- **Avatar:** Sofia — mãe latina, 28-42 anos, pós-parto
- **Localização:** LATAM hispânico (Colômbia > México > Puerto Rico)
- **Idioma:** Espanhol neutro
- **Dispositivo:** 90%+ mobile
- **Rede:** 2G/3G variável (LATAM)

### Métricas-Chave
| KPI | Target | Alerta |
|-----|:------:|:------:|
| TSL → Purchase | > 5% | < 3% |
| Quiz Completion | > 40% | < 30% |
| CPA | < US$12 | > US$18 |
| Page Load (LCP) | < 2.5s | > 4s |

---

## 2. Inventário do Design System

### Resultados da Auditoria

| Categoria | Instâncias | Aderência Tokens | Nota |
|-----------|:----------:|:----------------:|------|
| Cores | 287 | 98% | Excelente |
| Tipografia | 310+ | 100% | Perfeito |
| Espaçamento | 108+ | 99% | Muito bom |
| Sombras | 50+ | 100% | Perfeito |
| Border Radius | 43+ | 100% | Perfeito |
| Animações | 50+ | 100% | Consistente |
| Estados interativos | 31+ | 95% | Bom |

### Contagem por Nível Atômico

| Nível | Qtd | Exemplos |
|-------|:---:|---------|
| Atoms | 30+ | Button, Badge, Icon, Divider, SkipLink |
| Molecules | 15+ | Card, FAQItem, TestimonialCard, TrustBadge, ListItem, AudioPlayer |
| Organisms | 15 | NavHeader, HeroSection, SocialProof, FAQ, Footer, StickyBar, etc. |
| Templates | 4 | Landing, ThankYou, Dashboard, DaySession |
| Pages | 36 | /oferta, /gracias, /protocolo, /protocolo/dia/[0-28] |

### Score de Compliance
- **Design Tokens:** 97.5% (apenas 7 cores fora da paleta oficial — justificadas)
- **Acessibilidade:** WCAG 2.1 AA implementado (skip links, focus-visible, aria, reduced motion)
- **Mobile-first:** 100% dos componentes com breakpoints responsivos

---

## 3. Design Tokens

### 3.1 Paleta de Cores

#### Primárias
| Token | Hex | Contraste (sobre #FFFAF5) | Uso |
|-------|-----|:------------------------:|-----|
| `blush` | #D4A5A5 | 2.3:1 | Destaques, badges |
| `blush-strong` | #C97B7B | 3.2:1 | CTA principal, links |
| `blush-dark` | #B06868 | 4.1:1 | CTA hover |
| `nude` | #F5E6D3 | 1.2:1 | Backgrounds alternados |
| `warm` | #FFFAF5 | — | Background principal |
| `gold` | #C9A96E | 2.8:1 | Acentos, preço, timeline |

#### Texto
| Token | Hex | Contraste (sobre #FFFAF5) | Uso |
|-------|-----|:------------------------:|-----|
| `text` | #2D2D2D | 14.8:1 | Texto principal |
| `text-light` | #6B6B6B | 5.8:1 | Texto secundário |
| `text-muted` | #9B9B9B | 3.3:1 | Labels, disclaimers |

#### Semânticas
| Token | Hex | Uso |
|-------|-----|-----|
| `success` | #7CB68E | Checkmarks, progresso, completado |
| `cta-hover` | #B56A6A | Hover state do botão CTA |

### 3.2 Tipografia

| Token | Fonte | Peso | Tamanho | Line-height | Uso |
|-------|-------|:----:|:-------:|:-----------:|-----|
| `display` | Playfair Display | 700 | 3.5rem | 1.1 | Headline hero |
| `h1` | Playfair Display | 700 | 2.5rem | 1.15 | Títulos de seção |
| `h2` | Playfair Display | 700 | 2rem | 1.2 | Subtítulos |
| `h3` | Playfair Display | 700 | 1.5rem | 1.3 | Títulos de card |
| `body-lg` | Inter | 400 | 1.125rem | 1.7 | Corpo destaque |
| `body` | Inter | 400 | 1rem | 1.7 | Corpo padrão |
| `small` | Inter | 500 | 0.875rem | 1.6 | Labels, meta |

**Regras:**
- Serif (Playfair) = headlines e frases emocionais
- Sans-serif (Inter) = corpo, instruções, CTAs
- Nunca ALL CAPS em body text

### 3.3 Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `section-py` | 64px / 96px / 128px | Padding vertical de seções (mobile/tablet/desktop) |
| `section-px` | 20px / 32px | Padding horizontal de seções |
| `content-max` | 680px | Largura máxima do conteúdo TSL |
| `wide-max` | 1200px | Largura máxima para layouts wide |
| `card-padding` | 24px / 32px | Padding interno de cards |

### 3.4 Sombras

| Token | CSS | Uso |
|-------|-----|-----|
| `soft` | `0 2px 15px -3px rgba(0,0,0,0.07)` | Elevação leve (cells, badges) |
| `card` | `0 4px 25px -5px rgba(0,0,0,0.06)` | Cards padrão |
| `elevated` | `0 10px 40px -10px rgba(0,0,0,0.1)` | Cards em destaque, hover |
| `glow` | `0 0 30px rgba(201,123,123,0.15)` | Glow do CTA (hover) |

### 3.5 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `xl` | 16px | Day cells, elementos pequenos |
| `2xl` | 24px | Botões, ícones, players |
| `3xl` | 32px | Cards, containers grandes |
| `full` | 9999px | Badges, avatares, pills |

### 3.6 Animações

| Preset | Propriedades | Duração | Uso |
|--------|-------------|:-------:|-----|
| `fadeIn` | opacity 0→1, y 24→0 | 0.5-0.7s | Seções on-scroll |
| `slideUp` | opacity 0→1, y 20→0 | 0.5s | Items staggered |
| `stagger` | staggerChildren: 0.08-0.15 | — | Listas, grids |
| `accordion` | height 0→auto, opacity 0→1 | 0.3s | FAQ items |
| `pulse` | scale [1, 1.025, 1] + boxShadow | 2.4s (infinite) | CTA destaque |
| `counter` | number 0→N | 2s | Social proof counter |

**Regra:** Todos respeitam `prefers-reduced-motion: reduce`.

---

## 4. Biblioteca de Componentes

### 4.1 Atoms

#### Button
| Variante | Classes | Padding | Radius | Estados |
|----------|---------|:-------:|:------:|---------|
| `primary` | btn-primary | 16px 32px | 2xl | hover: dark+glow+scale, active: scale-down, focus: ring |
| `secondary` | btn-secondary | 16px 32px | 2xl | hover: fill+glow, active: scale-down, focus: ring |
| `xl` | btn-primary + overrides | 20px 56px | 2xl | + pulse animation opcional |

**Arquivo:** `src/components/ui/CTAButton.tsx`

#### Badge
| Variante | Background | Texto |
|----------|-----------|-------|
| `default` | bg-nude | text-text |
| `gold` | bg-gold/10 | text-gold-dark |
| `success` | bg-success/10 | text-success |
| `phase` | bg-[phase.color] | text-white |

**Arquivo:** globals.css (`.badge` class) — inline overrides em componentes

#### Divider
- Gradient: from-blush to-gold
- Width: 64px, Height: 2px
- **Arquivo:** globals.css (`.divider` class)

### 4.2 Molecules

#### Card
| Variante | Background | Sombra | Borda | Uso |
|----------|-----------|:------:|:-----:|-----|
| `default` | white | card | — | FAQ, ForYou, Protocol |
| `elevated` | white | elevated | — | Value Stack |
| `accent` | white | card | gradient-top + hover:border-blush | Today's session |
| `nude` | nude | none | — | Tips, alternates |

**Arquivo:** globals.css (`.card` class) + inline variants

#### Testimonial Card
- Avatar com iniciais (circle blush)
- 5 estrelas SVG (gold)
- Quote em itálico
- Nome, localização, tempo
- Horizontal scroll com snap no mobile
- **Arquivo:** `src/components/landing/SocialProofSection.tsx`

#### FAQ Accordion Item
- Button com aria-expanded + aria-controls
- Chevron rotação 180° no open
- AnimatePresence para height animation
- **Arquivo:** `src/components/landing/FAQSection.tsx`

#### Audio Player (mockup)
- Play/pause button circular (phase color)
- Progress bar com animação
- Timestamp mock
- **Arquivo:** `src/components/protocolo/DayPageClient.tsx`

### 4.3 Organisms

| Organismo | Background | Arquivo |
|-----------|-----------|---------|
| NavHeader | warm/85 blur | `landing/NavHeader.tsx` |
| HeroSection | warm | `landing/HeroSection.tsx` |
| SocialProofSection | nude-light | `landing/SocialProofSection.tsx` |
| MechanismSection | nude-light | `landing/MechanismSection.tsx` |
| ProtocolSection | warm | `landing/ProtocolSection.tsx` |
| ForYouSection | warm | `landing/ForYouSection.tsx` |
| ValueStackSection | warm | `landing/ValueStackSection.tsx` |
| TrustBadges | warm | `landing/TrustBadges.tsx` |
| GuaranteeSection | nude-light | `landing/GuaranteeSection.tsx` |
| FAQSection | warm | `landing/FAQSection.tsx` |
| FinalCTASection | warm | `landing/FinalCTASection.tsx` |
| Footer | warm | `landing/Footer.tsx` |
| StickyBar | warm/80 blur (mobile only) | `ui/StickyBar.tsx` |

**Padrão de alternância:** warm → nude-light → warm (cria ritmo visual)

### 4.4 Templates

#### Landing Page (`/oferta`)
```
NavHeader (sticky)
├── HeroSection (hero, badge, headline, rhetorical Qs)
├── SocialProofSection (counter + 3 testimonials)
├── MechanismSection (La Faja Invisible, 4 benefit cards)
├── ProtocolSection (4-phase timeline)
├── ForYouSection (dual-column check/x lists)
├── ValueStackSection (pricing card + comparison)
├── TrustBadges (3 trust signals)
├── GuaranteeSection (shield + 28 days)
├── FAQSection (9-item accordion)
├── FinalCTASection (two-path + emotional close)
├── Footer (disclaimer + links)
└── StickyBar (mobile-only fixed bottom CTA)
```

#### Thank You (`/gracias`)
```
├── Success animation (spring scale)
├── Headline "¡Felicidades!"
├── 4 step cards (email, ebook, day 1, tracker)
├── CTA → /protocolo
└── Support email
```

#### Protocol Dashboard (`/protocolo`)
```
Header (sticky, streak counter)
├── Day counter + phase indicator
├── Next milestone countdown
├── Progress bar with milestone markers
├── Today's session card (accent variant)
└── Phase calendar (4 phases × 7-col grid)
    └── Day cells with completion states
```

#### Day Session (`/protocolo/dia/[day]`)
```
Header (sticky, back nav, phase badge)
├── Day info (icon + title + duration)
├── Content card (description + audio player OR ebook)
├── Tip card (contextual by phase)
└── Complete button → success state → next day link
```

---

## 5. Fluxo de Páginas & Jornada do Usuário

```
[META AD] → [QUIZ externo] → [/oferta (TSL)] → [CHECKOUT externo] → [/gracias]
                                                                          │
                                                                          ▼
                                                                    [/protocolo]
                                                                          │
                                                              ┌───────────┼───────────┐
                                                              ▼           ▼           ▼
                                                         [/dia/0]   [/dia/1]   ... [/dia/28]
```

### Estados de Navegação
| Estado | Comportamento |
|--------|--------------|
| Visitante (não comprou) | Vê /oferta, CTA leva ao checkout externo |
| Comprador (pós-checkout) | Redirecionado para /gracias → /protocolo |
| Usuário ativo | Acessa /protocolo com progresso salvo |
| Dia bloqueado | Célula opaca, pointer-events-none, tabIndex -1 |

### Gestão de Estado (Atual vs Futuro)
| Dado | Atual | Futuro |
|------|-------|--------|
| Dia atual | useState(3) hardcoded | Auth + DB (Supabase/Firebase) |
| Dias completados | useState([0,1,2]) hardcoded | Persistido em backend |
| Streak | Calculado de completedDays | Backend + push notifications |
| Progresso | currentDay/28 | Backend com timestamps |

---

## 6. Requisitos de Acessibilidade

### WCAG 2.1 AA — Status

| Critério | Status | Implementação |
|----------|:------:|---------------|
| Skip link | ✅ | NavHeader.tsx → `#main-content` |
| Focus-visible | ✅ | globals.css `:focus-visible` |
| Reduced motion | ✅ | globals.css `prefers-reduced-motion` |
| aria-expanded (FAQ) | ✅ | FAQSection.tsx com aria-controls |
| aria-label (ícones) | ✅ | Ícones decorativos com aria-hidden |
| Contraste de texto | ✅ | text (#2D2D2D) sobre warm (#FFFAF5) = 14.8:1 |
| Contraste CTA | ⚠️ | blush-strong (#C97B7B) sobre warm = 3.2:1 (AA large text only) |
| Semântica HTML | ✅ | header, main, footer, nav, section |
| Landmarks | ✅ | role="contentinfo" no footer |
| Link underline | ✅ | Footer links com hover:underline |

### Pendências
- [ ] Contraste do CTA button text (white on #C97B7B = 3.6:1 — passa para large text)
- [ ] Estado disabled para botões
- [ ] Loading skeletons para transições
- [ ] Texto alternativo para imagens futuras

---

## 7. Requisitos de Performance

### Targets (Core Web Vitals)

| Métrica | Target | Justificativa |
|---------|:------:|---------------|
| LCP | < 2.5s | LATAM tem internet variável |
| FID | < 100ms | Interações rápidas no quiz/CTA |
| CLS | < 0.1 | Animações não devem causar layout shift |
| Bundle size (JS) | < 150KB | First load shared = 87.4KB atual |

### Otimizações Implementadas
- Static export (SSG) — zero server-side rendering
- Tailwind CSS purge automático
- framer-motion tree-shaking via named imports
- Lucide React named imports (não barrel import)

### Otimizações Pendentes
- [ ] Next/Image com lazy loading para futuras imagens
- [ ] Font preload via `<link rel="preload">` para Playfair Display
- [ ] Service Worker para conteúdo offline (protocolo)
- [ ] Compression (gzip/brotli) no hosting

---

## 8. Design Responsivo

### Breakpoints

| Token | Valor | Uso |
|-------|-------|-----|
| `sm` | 640px | Ajustes finos de spacing/grid |
| `md` | 768px | Layout shift principal (1 col → 2 col) |
| `lg` | 1024px | Section padding máximo |
| `xl` | 1280px | Containers wide |

### Padrões Mobile-First
- Content max-width: 680px (TSL padrão)
- Mobile padding: 20px lateral
- Touch targets: mínimo 44x44px (verificar calendar cells)
- StickyBar: visível apenas em mobile (`md:hidden`)
- Testimonials: horizontal scroll com snap no mobile, grid no desktop
- FAQ: full-width em todas as telas

### Pontos de Atenção
- Calendar grid (7 colunas) pode ficar apertado em telas < 360px
- Day cells precisam garantir min 40x40px
- NavHeader aparece apenas após scroll (40px threshold)

---

## 9. Recomendações para Próximas Fases

### Phase 2: Componentes Faltantes
1. **Loading Skeleton** — para transições de página e carregamento de dados
2. **Error Boundary** — fallback visual para erros de runtime
3. **Toast/Notification** — feedback de ações (completar sessão, etc.)
4. **Modal** — para confirmações e onboarding
5. **Progress Ring** — visualização alternativa de progresso (estilo Calm)
6. **Celebration Animation** — confetti/sparkle em milestones (dia 7, 14, 21, 28)

### Phase 3: Integração Backend
1. **Autenticação** — login pós-compra via magic link
2. **Persistência de progresso** — Supabase/Firebase para dias completados
3. **Push notifications** — lembretes diários via Service Worker
4. **Analytics** — eventos de conversão (Meta Pixel, GA4)
5. **A/B Testing** — variações de CTA, headline, preço

### Phase 4: Expansão
1. **Área de membros completa** — auth-gated com SSR
2. **Audio player real** — streaming com controle de velocidade
3. **PWA** — offline access para protocolo
4. **Internacionalização** — suporte a português para Brasil
5. **Referral system** — compartilhar progresso via WhatsApp

### Oportunidades de A/B Test
| Elemento | Variante A (atual) | Variante B |
|----------|-------------------|------------|
| CTA text | "SÍ, QUIERO EMPEZAR" | "EMPEZAR MI PROTOCOLO" |
| CTA color | #C97B7B (blush-strong) | #C9A96E (gold) |
| Price display | $19.90 (numeral) | "Menos que una pizza" |
| Social proof | 5,234+ mamás | "Más de 5,000 mamás" |
| Hero headline | "músculo dormido" | "corsé natural dormido" |

---

## Aprovação

| Dept | Status |
|------|--------|
| UX Design (Uma) | ✅ ENTREGUE |
| Architect (Aria) | ⏳ PENDENTE |
| PO (Pax) | ⏳ PENDENTE |
| PM (Morgan) | ⏳ PENDENTE |

---

*Gerado por 🎨 Uma (UX Design Expert)*
*Workflow: brownfield-ui / Phase 1*
*Projeto: Zero Diastasis™*
