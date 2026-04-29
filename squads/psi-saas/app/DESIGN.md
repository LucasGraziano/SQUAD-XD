# DESIGN.md — Vínculo (psi-saas)

> Token-efficient design reference for AI code generation.
> Combines: Vínculo Brand Guidelines + Linear (structure) + Superhuman (polish) + Notion (warmth)
> Always reference this file before writing any UI component.

---

## 1. VISUAL THEME & ATMOSPHERE

Vínculo is warm authority: a platform that earns trust from healthcare professionals through
precision and calm, not excitement. The canvas is warm off-white (`#FAFAF8`) — paper, not glass.
Elements emerge through subtle hierarchy rather than decoration. No gradients on surfaces.
No rounded pill shapes on buttons. No AI slop patterns (bento grids, glowing cards, neon accents).

Think: a private clinic's dashboard designed by Linear engineers who read Notion's style guide.
Clean, structured, warm. Professional without being clinical.

**Anti-patterns — NEVER use:**
- Dark mode on any surface (Vínculo is light-native)
- Saturated bright colors as accents (no green/blue/red as primary accent)
- Gradient backgrounds on content sections
- Pill-shaped (border-radius > 12px) buttons
- Shadow-heavy cards that look like they're floating
- Marketing jargon in UI copy (escalar, converter, lead, funil, otimizar)
- Emoji in alerts, errors, or risk notifications

---

## 2. COLOR SYSTEM

### Brand Palette
```
--color-teal-900: #0D2D38;   /* deepest teal, very dark surfaces */
--color-teal-700: #1A4A5A;   /* PRIMARY BRAND — CTAs, headers, key elements */
--color-teal-500: #2A6B7C;   /* hover states on teal elements */
--color-teal-100: #E8F3F6;   /* very light teal tint, info backgrounds */
--color-teal-50:  #F0F8FA;   /* teal wash for section backgrounds */

--color-sand-900: #8C6D4F;   /* dark sand for text on sand */
--color-sand-300: #D9C9B5;   /* mid sand for borders */
--color-sand-100: #F2E8DC;   /* SECONDARY BRAND — card fills, section backgrounds */
--color-sand-50:  #FAF5EF;   /* lightest sand tint */

--color-gold-700: #8C6D35;   /* dark gold for text */
--color-gold-500: #B8955A;   /* ACCENT — badges, Pro elements, hover on special */
--color-gold-200: #E8D5B0;   /* light gold tint for badge backgrounds */
```

### Neutral Scale (warm, not cold grays)
```
--color-canvas:   #FAFAF8;   /* page background — warm off-white */
--color-surface:  #F4F4F2;   /* cards, inputs, sidebar panels */
--color-border:   #E2E2DE;   /* standard borders, dividers */
--color-line:     rgba(0,0,0,0.06);  /* whisper borders (Notion-inspired) */
--color-muted:    #6B7280;   /* secondary text, labels, captions */
--color-charcoal: #1F2937;   /* primary text */
--color-black:    rgba(0,0,0,0.92);  /* maximum contrast text — near-black warmth */
```

### Semantic Colors
```
--color-success:  #2D7D4F;   /* session confirmed, payment received */
--color-warning:  #D97706;   /* medium risk, pending actions */
--color-danger:   #C0392B;   /* abandonment risk CRITICAL, errors */
--color-info:     #2563EB;   /* informational, neutral links */
```

### Usage Rules
- Teal `#1A4A5A` on white: 8.5:1 contrast — use for all primary CTAs
- Charcoal `#1F2937` on `#FAFAF8`: 16:1 — use for all body text
- Charcoal on Sand `#F2E8DC`: 12:1 — use for highlight cards
- NEVER use Teal as a text color on Sand backgrounds (poor aesthetics)
- NEVER use Gold as a background color on large areas

---

## 3. TYPOGRAPHY

### Fonts
```css
font-family-display: 'DM Serif Display', Georgia, serif;
font-family-ui:      'Inter', system-ui, -apple-system, sans-serif;
```

### Scale
| Token | Size | Weight | Line-h | Tracking | Font | Usage |
|-------|------|--------|--------|----------|------|-------|
| display-2xl | 72px | 400 | 1.05 | -1.2px | DM Serif | Landing hero |
| display-xl | 48px | 400 | 1.1 | -0.8px | DM Serif | Section hero |
| display-lg | 36px | 400 | 1.2 | -0.5px | DM Serif | Card headers |
| heading-xl | 24px | 600 | 1.3 | -0.2px | Inter | Page titles |
| heading-lg | 20px | 600 | 1.35 | -0.1px | Inter | Section labels |
| body-lg | 18px | 400 | 1.6 | 0 | Inter | Main body |
| body-base | 16px | 400 | 1.5 | 0 | Inter | UI general |
| body-sm | 14px | 400 | 1.5 | 0 | Inter | Labels, captions |
| caption | 12px | 500 | 1.4 | 0.1px | Inter | Badges, timestamps |

### Rules
- Display headings: DM Serif Display only. Never bold. Never italic (except pull quotes)
- Numbers in data tables: `font-variant-numeric: tabular-nums` always
- Letter-spacing: negative on large headings (Linear-inspired), neutral on UI
- No ALL CAPS except badge text (max 11px, ls: 0.05em, weight: 600)

---

## 4. SPACING SYSTEM

Base unit: 4px

```
space-1:  4px    /* micro gap — icon to label */
space-2:  8px    /* tight — within components */
space-3:  12px   /* compact — card padding small */
space-4:  16px   /* default — button padding, list items */
space-5:  20px   /* relaxed — form fields */
space-6:  24px   /* comfortable — card padding */
space-8:  32px   /* section gap within blocks */
space-10: 40px   /* section separations */
space-12: 48px   /* major section padding */
space-16: 64px   /* hero padding, large sections */
space-20: 80px   /* page margins on desktop */
```

---

## 5. BORDER SYSTEM

```css
/* Notion-inspired: borders exist as whispers */
border-line:    1px solid rgba(0,0,0,0.06);   /* default — barely visible */
border-subtle:  1px solid #E2E2DE;             /* visible — cards, inputs */
border-medium:  1px solid #D1D1CC;             /* emphasis — active states */
border-strong:  2px solid #1A4A5A;             /* brand — focus rings, active tabs */
```

### Border Radius
```
radius-sm:   4px   /* badges, tags, small chips */
radius-base: 8px   /* inputs, buttons */
radius-card: 12px  /* cards, modals, dropdowns */
radius-lg:   16px  /* large panels, sheets */
```
NEVER use border-radius > 16px on structural elements. No pill buttons.

---

## 6. SHADOW SYSTEM

Notion-inspired: barely-there depth. Never use heavy box shadows.

```css
shadow-xs:  0 1px 2px rgba(0,0,0,0.04);
shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
shadow-md:  0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04);
shadow-lg:  0 8px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04);
shadow-xl:  0 20px 48px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.06);
shadow-inset: inset 0 1px 0 rgba(255,255,255,0.8);  /* top edge light */
```

---

## 7. MOTION & ANIMATION

Functional, not decorative. Animations confirm actions, guide attention. Never impress.

```css
transition-fast:   150ms ease-out;   /* hover states, focus rings */
transition-base:   250ms ease-out;   /* modals, dropdowns, tooltips */
transition-slow:   400ms ease-in-out; /* page transitions */

/* RULES:
   - Nothing > 400ms
   - No bounce/spring/elastic easing
   - Risk alerts: fade-in only — NEVER flash, shake, or pulse
   - No entrance animations on data tables
   - Skeleton loaders preferred over spinners on data fetches > 300ms
*/
```

---

## 8. COMPONENT TOKENS

### Buttons
```css
/* Primary — Teal */
btn-primary-bg:      #1A4A5A;
btn-primary-text:    #ffffff;
btn-primary-hover:   #143D4B;          /* darken 5% */
btn-primary-active:  #0F3040;          /* darken 10% */
btn-primary-radius:  8px;
btn-primary-padding: 10px 20px;        /* sm: 8px 16px / lg: 14px 28px */
btn-primary-font:    Inter 600 15px;

/* Secondary — Outlined */
btn-secondary-bg:     transparent;
btn-secondary-border: 1px solid #1A4A5A;
btn-secondary-text:   #1A4A5A;
btn-secondary-hover-bg: #F0F8FA;

/* Ghost */
btn-ghost-bg:    transparent;
btn-ghost-text:  #1F2937;
btn-ghost-hover: #F4F4F2;

/* Danger */
btn-danger-bg:   #C0392B;
btn-danger-text: #ffffff;
```

### Inputs
```css
input-bg:          #FAFAF8;
input-border:      1px solid #E2E2DE;
input-border-focus: 2px solid #1A4A5A;   /* no box-shadow focus ring */
input-radius:      8px;
input-padding:     10px 14px;
input-font:        Inter 400 15px;
input-placeholder: #9CA3AF;
input-error-border: 1px solid #C0392B;
```

### Cards
```css
card-bg:       #FAFAF8;           /* white variant: #ffffff */
card-sand-bg:  #F2E8DC;           /* highlight card */
card-border:   1px solid rgba(0,0,0,0.06);
card-radius:   12px;
card-shadow:   shadow-sm;
card-padding:  24px;

/* Risk card variant */
card-risk-border-left: 3px solid #C0392B;
card-warning-border-left: 3px solid #D97706;
card-success-border-left: 3px solid #2D7D4F;
```

### Badges
```css
badge-radius:   6px;
badge-padding:  2px 8px;
badge-font:     Inter 600 11px letter-spacing:0.04em UPPERCASE;

badge-success:  { bg: #D1FAE5; text: #2D7D4F; }
badge-warning:  { bg: #FEF3C7; text: #92400E; }
badge-danger:   { bg: #FEE2E2; text: #991B1B; }
badge-info:     { bg: #DBEAFE; text: #1E40AF; }
badge-gold:     { bg: #E8D5B0; text: #8C6D35; }  /* Pro tier */
badge-neutral:  { bg: #F4F4F2; text: #374151; }
```

### Navigation / Sidebar
```css
nav-bg:          #F4F4F2;
nav-width:        240px;
nav-item-hover:   #E8E8E6;
nav-item-active-bg:   #E8F3F6;
nav-item-active-text: #1A4A5A;
nav-item-active-font: Inter 600;
nav-item-radius:  6px;
nav-item-padding: 8px 12px;
```

---

## 9. DATA VISUALIZATION

Used for patient metrics, session evolution, abandonment risk charts.

```
chart-primary:   #1A4A5A;   /* main metric line */
chart-secondary: #B8955A;   /* secondary metric */
chart-success:   #2D7D4F;
chart-warning:   #D97706;
chart-danger:    #C0392B;
chart-bg:        #FAFAF8;
chart-grid:      rgba(0,0,0,0.06);
chart-axis-text: Inter 400 12px #6B7280;
```

---

## 10. ICONS

System: **Lucide React**

```
icon-size-sm:  16px  /* inline text, badges */
icon-size-md:  20px  /* UI elements, buttons */
icon-size-lg:  24px  /* feature icons */
icon-size-xl:  32px  /* empty states */
stroke-width:  1.5   /* NEVER 2px */
```

---

## 11. RESPONSIVE BREAKPOINTS

```css
--mobile:   375px   /* iPhone SE — minimum supported */
--sm:       640px   /* large mobile */
--md:       768px   /* tablet */
--lg:       1024px  /* laptop */
--xl:       1280px  /* desktop standard */
--2xl:      1536px  /* wide monitors */
```

Design mobile-first. Dashboard layouts switch to sidebar at `--lg`.

---

## 12. VOICE & COPY IN UI

Vínculo speaks as a competent, empathetic colleague. Not a startup. Not a bank.

```
✓ "Pronto. Seu consultório está configurado."
✓ "Ana pode estar se afastando. Última sessão há 18 dias."
✓ "R$ 200 recebido de Pedro."
✓ "Algo não funcionou aqui. Já estamos verificando."

✗ "Escale seus atendimentos com IA!"
✗ "Maximize sua conversão de leads!"
✗ "Engaje seus pacientes hoje!"
```

Forbidden words: escalar, converter, lead, funil, otimizar, maximizar, engajar (marketing sense)
Max button label: 3 words
Error messages: honest + calm. Never blame user.

---

## 13. ACCESSIBILITY

- Minimum contrast: 4.5:1 (normal text), 3:1 (large text, UI components)
- Focus ring: `outline: 2px solid #1A4A5A; outline-offset: 2px;`
- All standalone icons: `aria-label` required
- Form labels: always visible — never replace with placeholder only
- Minimum tap target: 44×44px on mobile
- Minimum font size in product: 14px (Psicólogas mais velhas lendo no celular)
- Prontuário: min 16px

---

*Vínculo DESIGN.md v1.0 — Gerado por @ux-design-expert + @aios-master*
*Inspiração: Linear (estrutura), Superhuman (polish), Notion (warmth)*
*Referência primária: squads/psi-saas/docs/brand/brand-guidelines.md*
