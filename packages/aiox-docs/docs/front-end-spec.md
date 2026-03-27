# Frontend Specification — AIOX Documentation Site

**Author:** @ux-design-expert (Uma)
**Date:** 2026-03-25
**Status:** Approved

---

## 1. Design Philosophy

**Inspiracao:** emailhacker.ai/brand-dna — dark tech minimalist
**Principio:** Clareza > Decoracao. Cada pixel serve a um proposito.

## 2. Design System

### 2.1 Color Palette

| Token | Hex | Uso |
|-------|-----|-----|
| `surface-900` | `#0A0A0F` | Background principal |
| `surface-800` | `#111118` | Cards, sidebar |
| `surface-700` | `#1A1A24` | Hover states, borders internos |
| `surface-600` | `#222230` | Borders, dividers |
| `surface-500` | `#2A2A3A` | Active states |
| `coral` | `#E8837C` | Accent primario, CTAs, agentes AIOX |
| `coral-light` | `#F2A49F` | Hover do coral |
| `coral-dark` | `#D4635C` | Active do coral |
| `menta` | `#7ECEC1` | Accent secundario, workflows, success |
| `menta-light` | `#A8E0D6` | Hover do menta |
| `menta-dark` | `#5BB5A6` | Active do menta |
| `gold` | `#D4A574` | Accent terciario, Mega Brain, squads |
| `gold-light` | `#E8C9A8` | Hover do gold |
| `gold-dark` | `#B8874F` | Active do gold |
| `text-primary` | `#F0F0F5` | Texto principal |
| `text-secondary` | `#9999AA` | Texto secundario |
| `text-muted` | `#666677` | Labels, metadata |

### 2.2 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Inter | 800 (extrabold) | 48px / text-5xl |
| H2 | Inter | 700 (bold) | 24px / text-xl |
| H3 | Inter | 600 (semibold) | 16px / text-sm |
| Body | Inter | 400 (regular) | 14px / text-sm |
| Small | Inter | 400 | 12px / text-xs |
| Micro | Inter | 500 | 10px / text-[10px] |
| Code | JetBrains Mono | 400-600 | 11-13px |

### 2.3 Spacing

- **Page padding:** `px-12` (48px)
- **Section vertical:** `py-10` (40px)
- **Card padding:** `p-5` a `p-6` (20-24px)
- **Grid gap:** `gap-3` a `gap-6` (12-24px)
- **Border radius:** `rounded-xl` (12px) cards, `rounded-lg` (8px) buttons, `rounded-full` badges

### 2.4 Effects

| Effect | CSS |
|--------|-----|
| Glow coral | `box-shadow: 0 0 20px rgba(232,131,124,0.15)` |
| Glow menta | `box-shadow: 0 0 20px rgba(126,206,193,0.15)` |
| Glow gold | `box-shadow: 0 0 20px rgba(212,165,116,0.15)` |
| Card hover | `translateY(-2px) + border-color change` |
| Grid background | `60px grid, rgba(255,255,255,0.02)` |
| Status dot | `pulsing animation 2s infinite` |
| Gradient text | `linear-gradient(135deg, coral, gold)` |

## 3. Component Inventory

### Atoms
- **StatusDot** — pulsing indicator (menta=online)
- **Badge** — `text-[10px]` pill with color variants
- **CodeBlock** — monospace with surface-800 bg
- **GradientText** — coral-to-gold gradient
- **Icon** — emoji-based (no icon library)

### Molecules
- **StatCard** — icon + value + label with gradient border
- **AgentCard** — icon + name + title + role + commands + exclusive
- **WorkflowDiagram** — timeline with numbered phases
- **CommandCard** — name + category badge + description + usage
- **ExpertCard** — name + focus + DNA layers expandable
- **ArticleCard** — number + severity + rules + enforcement

### Organisms
- **Sidebar** — fixed left, collapsible, nav groups
- **HeroSection** — gradient overlay + title + description + CTAs
- **FilterBar** — category pills + search input
- **DelegationMatrix** — table with color-coded flows
- **SearchResults** — grouped by type with links

### Pages
- `/` — Home (hero + stats + how-it-works + features + architecture)
- `/constitution/` — 6 articles with severity
- `/aiox/` — 12 core agents detailed
- `/workflows/` — Tasks catalog (207 tasks, filterable) + workflow diagrams
- `/commands/` — Activation + agent commands + slash commands
- `/squads/` — Hierarchy (Commander > Chiefs > Specialists)
- `/mega-brain/` — DNA system + experts + sync + company
- `/search/` — Global search

## 4. Responsive Strategy

- **Desktop-first** (primary target: 1440px+)
- **Tablet:** Grid cols reduce (3→2→1)
- **Sidebar:** Collapses to icon-only on small screens
- **No mobile-specific optimizations** (desktop documentation tool)

## 5. Accessibility

- **Contrast:** All text passes WCAG AA on dark backgrounds
- **Focus states:** Visible focus rings on interactive elements
- **Semantic HTML:** `nav`, `main`, `section`, `article`, `table`
- **Language:** `lang="pt-BR"` on html element
