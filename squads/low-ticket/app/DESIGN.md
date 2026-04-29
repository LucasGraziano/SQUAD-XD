# DESIGN.md — Low-Ticket Squad
# ⚠️ PLACEHOLDER — Preencher com identidade visual real do squad
# Por enquanto, usando tokens genéricos de alto impacto para info-produtos digitais
# Inspiração base: shopify (bold, conversion) + framer (motion) + zapier (friendly orange)

> Este arquivo precisa ser personalizado com as cores e fontes reais do squad.
> Para personalizar: peça ao @ux-design-expert para criar brand-guidelines primeiro,
> depois gere um DESIGN.md definitivo com `npx getdesign@latest` + brand customization.

---

## STATUS: PLACEHOLDER v0.1
**Ação necessária:** Lucas definir identidade visual do Low-Ticket Squad antes de usar.

---

## 1. VISUAL THEME & ATMOSPHERE

Info-produto de alta conversão: bold, energético, direto. Sem hesitação.
O design comunica urgência e valor — não sofisticação acadêmica.
Cores primárias quentes, tipografia grande e assertiva, CTAs impossíveis de ignorar.

**Anti-patterns:**
- Sem minimalismo excessivo (parece corporativo, não converte)
- Sem paletas frias (azul clínico mata o senso de urgência)
- Sem fontes serif delicadas (precisamos de impacto visual)

---

## 2. COLOR SYSTEM (PLACEHOLDER — substituir)

```
/* SUBSTITUIR com cores reais do squad */
--color-primary:   #FF6B35;   /* laranja quente — energia, urgência, ação */
--color-secondary: #1A1A2E;   /* azul-escuro — contraste, autoridade */
--color-accent:    #FFD700;   /* dourado — destaque, valor, premium */

--color-canvas:    #FFFFFF;
--color-surface:   #F8F8F8;
--color-border:    #E5E5E5;
--color-text:      #1A1A2E;
--color-muted:     #6B7280;

--color-success:   #22C55E;
--color-warning:   #F59E0B;
--color-danger:    #EF4444;
```

---

## 3. TYPOGRAPHY (PLACEHOLDER — substituir)

```
font-display: 'Sora', 'Montserrat', system-ui, sans-serif;
font-ui:      'Inter', system-ui, sans-serif;

/* Escala */
display-2xl: 64px / weight 800 / ls -1px
display-xl:  48px / weight 700 / ls -0.5px
display-lg:  36px / weight 700 / ls -0.3px
heading:     24px / weight 600
body-lg:     18px / weight 400 / lh 1.6
body:        16px / weight 400 / lh 1.5
small:       14px / weight 400
```

---

## 4. SPACING

Base: 4px
```
xs:   4px  | sm: 8px  | md: 16px | lg: 24px | xl: 32px | 2xl: 48px | 3xl: 64px
```

---

## 5. BORDERS & RADIUS

```
radius-sm:   4px
radius-base: 8px
radius-card: 12px
radius-pill: 9999px   /* permitido aqui — CTAs pill funcionam bem em info-produto */

border: 1px solid #E5E5E5
border-strong: 2px solid var(--color-primary)
```

---

## 6. SHADOWS

```
shadow-sm:  0 1px 3px rgba(0,0,0,0.08)
shadow-md:  0 4px 16px rgba(0,0,0,0.12)
shadow-cta: 0 8px 32px rgba(255,107,53,0.35)  /* shadow colorido no CTA primário */
```

---

## 7. MOTION

```
transition-fast:  150ms ease-out
transition-base:  250ms ease-out
transition-hover: 200ms ease
```

---

## 8. CTA BUTTON (alta conversão)

```css
/* O botão mais importante do squad */
.btn-cta {
  background: var(--color-primary);
  color: white;
  font-weight: 700;
  font-size: 18px;
  padding: 16px 32px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(255,107,53,0.35);
  transition: transform 150ms, box-shadow 150ms;
}
.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255,107,53,0.45);
}
```

---

## 9. BRANDS DE REFERÊNCIA (até definir identidade própria)

Para landing pages do squad, usar como inspiração:
- `shopify.md` — bold, conversão, e-commerce
- `framer.md` — motion-first, impactante
- `zapier.md` — laranja amigável, info-produto

---

*Low-Ticket Squad DESIGN.md v0.1 — PLACEHOLDER | Precisa de identidade visual real*
