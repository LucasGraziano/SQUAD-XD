# DESIGN.md — Premia

> Token-efficient design reference for AI code generation.
> Stack: Next.js 15 + Tailwind CSS. Always reference before writing any UI component.

---

## 1. VISUAL THEME & ATMOSPHERE

Lucky SaaS is precision-first for the field: a tool for insurance brokers who work fast,
manage dozens of clients and renewals daily, need data at a glance — not decoration.
Canvas: light off-white (#F8F8F8). Sidebar: deep black. Single neon-green accent (#0BD904)
that reads as "go", "active", "money in".

Inspiration: Linear density + Stripe Dashboard financial clarity + Notion clean forms.
Brazilian market — professional without being corporate-gray.

Anti-patterns — NEVER use:
- Gradients on content surfaces
- Multiple accent colors (green is THE accent)
- Rounded pills on primary buttons
- Shadow-heavy floating cards
- Bento grids, glowing borders, animated backgrounds
- Red/orange as primary brand color (reserved for errors/urgency only)
- Emoji in tables, alerts or financial data

---

## 2. COLOR SYSTEM

### Brand Palette
```
#034001             text on green backgrounds, dark emphasis
#0BD904             PRIMARY ACCENT — CTAs, active states, links
rgba(11,217,4,0.10) background tint, hover on green items
rgba(11,217,4,0.05) very subtle green wash
```

### Neutral Scale
```
#0D0D0D   primary text, sidebar background
#374151   headings, strong labels
#6B7280   secondary text, metadata
#9CA3AF   placeholder, disabled labels
#D1D1D1   input borders, dividers
#E5E5E5   card borders, table dividers
#F3F4F6   table row hover, tag backgrounds
#F8F8F8   page background (canvas)
#FFFFFF   card/modal backgrounds (surface)
```

### Semantic Colors
```
error:      #DC2626 / bg #FEE2E2   destructive, form errors, vencida
warn-30d:   #D97706 / bg #FEF3C7   renewal alerts ≤30d
warn-60d:   #CA8A04 / bg #FEF9C3   renewal alerts ≤60d
success:    #16A34A / bg #DCFCE7   active/paid states
info:       #3B82F6 / bg #EFF6FF   AI-filled fields
```

---

## 3. TYPOGRAPHY

```
Font UI:      'Poppins', system-ui, sans-serif
Font numbers: ui-monospace, 'Cascadia Code', monospace

Page title:      22px semibold #0D0D0D
Section heading: 18px semibold #0D0D0D
Card title:      15px semibold #0D0D0D
Body:            14px regular  #0D0D0D
Small/meta:      13px regular  #6B7280
Label:           11px semibold uppercase tracking-wide #9CA3AF
Currency/numbers: 13-22px bold monospace #0D0D0D
```

---

## 4. SPACING & LAYOUT

```
Page padding:   px-8 py-6
Card padding:   p-4 / p-5
Section gap:    space-y-6
Form gap:       space-y-4
Inline gap:     gap-2 / gap-3
Table cell:     px-4 py-3 / px-5 py-3
Sticky header:  h-14 (56px)
Sidebar:        w-60 (240px) fixed left
```

---

## 5. COMPONENTS

### Buttons
```
Primary:   bg-[#0BD904] text-[#0D0D0D] hover:bg-[#09C003] font-semibold rounded-[6px]
Secondary: border border-[#D1D1D1] bg-white hover:bg-[#F4F4F4] rounded-[6px]
Danger:    border border-[#FECACA] text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px]
Ghost:     text-[#6B7280] hover:bg-[#F4F4F4] hover:text-[#0D0D0D] rounded-[6px]
Sizes:     h-9 px-3 text-[13px] (sm) | h-10 px-5 text-[14px] (md) | h-11 px-6 text-[15px] (lg)
```

### Inputs
```
Height:     h-9 (small) / h-[42px] (default)
Border:     border-[#D1D1D1] focus:border-[#0BD904]
Ring:       focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)]
Radius:     rounded-[6px]
Font:       text-[13-14px] text-[#0D0D0D] placeholder:text-[#9CA3AF]
Error:      border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.10)]
```

### Cards
```
bg-white rounded-[8px] border border-[#E5E5E5]
Row hover: hover:bg-[#FAFAFA] transition-colors
```

### Modals
```
Max-width: 520px (form) / 600px (complex)
Radius:    rounded-[12px]  Shadow: shadow-xl  Overlay: bg-black/40
Header:    px-6 py-4 border-b border-[#E5E5E5]
Footer:    px-6 py-4 border-t border-[#E5E5E5] flex justify-end gap-2
Body:      px-6 py-5 flex-1 overflow-y-auto
```

### Tables
```
Header: px-4 py-3 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-left
Cell:   px-4 py-3 text-[13px]
Row:    border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors
Wrap:   bg-white rounded-[8px] border border-[#E5E5E5] overflow-hidden
```

### Status Badges (all: px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase)
```
Ativa:     bg-[#DCFCE7]              text-[#16A34A]
≤30d:      bg-[#FEF3C7]              text-[#D97706]
≤60d:      bg-[#FEF9C3]              text-[#CA8A04]
Vencida:   bg-[#FEE2E2]              text-[#DC2626]
Arquivada: bg-[#F3F4F6]              text-[#6B7280]
Ramo:      bg-[rgba(11,217,4,0.08)]  text-[#034001]
```

### Sidebar
```
bg-[#0D0D0D] w-60 fixed left-0 inset-y-0
Nav item: px-3 py-2 rounded-[6px] text-[13px] text-[#9CA3AF]
Active:   bg-[rgba(11,217,4,0.12)] text-[#0BD904] font-medium
Hover:    hover:bg-white/5 hover:text-white
Logo:     px-4 py-5 border-b border-white/10
```

### Avatar Initials
```
sm: w-8 h-8 rounded-full bg-[rgba(11,217,4,0.10)] — text-[12px] font-semibold text-[#034001]
lg: w-12 h-12 rounded-full bg-[rgba(11,217,4,0.10)] — text-[18px] font-bold text-[#034001]
```

---

## 6. SIDEBAR NAV

```
Lucky (logo)
───────────────────
Dashboard
Pipeline
Apólices
Clientes
───────────────────
Alertas  [badge]
Comissões
───────────────────
Configurações (pinned bottom)
```

---

## 7. LANDING PAGE SPEC (Story 0.2)

Target: corretores SUSEP autônomos (analógicos) e corretoras pequenas (escalando).
Tone: direto, resultado-first, sem fluff. 2 min para convencer.

Sections (in order):
1. Hero        — Problema 1 linha + benefício quantificado + CTA verde + screenshot UI
2. Prova social — "X corretores" + 1 depoimento
3. Features 3x — Pipeline / Renovações / Comissões (3 cards, ícone + título + 1 linha)
4. Como funciona — 3 passos (cadastre → acompanhe → renove)
5. Pricing      — Free trial + plano mensal (simples, sem tabela complexa)
6. CTA final    — Repetir hero CTA

Copy rules:
- Headline: problema do corretor, não feature do produto
- Evitar: "plataforma", "solução", "ecossistema", "otimizar", "escalar"
- Preferir: "nunca perca", "saiba na hora", "sua carteira", "seu pipeline"
- CTA: "Começar grátis"

Visual rules for landing:
- Same color system as app (consistency)
- Sem fotos de stock de pessoas felizes
- Hero: screenshot real do dashboard ou mockup fiel
- Seções alternadas: bg-white / bg-[#F8F8F8]
- Máximo 1 botão verde por viewport
- Mobile-first: empilhar colunas
