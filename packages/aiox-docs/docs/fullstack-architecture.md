# Fullstack Architecture — AIOX Documentation Site

**Author:** @architect (Aria)
**Date:** 2026-03-25
**Status:** Approved

---

## 1. Architecture Decision

### Tipo: Static Site (JAMstack)
Nao ha backend, API ou banco de dados. O site e 100% estatico, gerado em build time pelo Next.js e servido como HTML/CSS/JS puro.

### Justificativa
- Dados sao fixos (mudam apenas quando o framework muda)
- Zero custo de hosting (Vercel free tier, GitHub Pages, ou local)
- Performance maxima (pre-rendered HTML)
- Zero superficie de ataque (sem API, sem BD)

## 2. Tech Stack

| Camada | Tecnologia | Versao | Justificativa |
|--------|-----------|--------|--------------|
| Framework | Next.js | 14.2 | App Router, static export, TypeScript nativo |
| Styling | Tailwind CSS | 3.4 | Utility-first, design system customizavel |
| Language | TypeScript | 5.4 | Type safety, autocompletion |
| Fonts | Google Fonts | - | Inter + JetBrains Mono via CDN |
| Build | next build | - | Static export (`output: 'export'`) |

## 3. Project Structure

```
packages/aiox-docs/
├── .aiox/
│   └── environment-report.json
├── docs/                          # Phase 1-2 artifacts
│   ├── project-brief.md
│   ├── prd.md
│   ├── front-end-spec.md
│   ├── fullstack-architecture.md
│   ├── prd/                       # Sharded PRD
│   │   ├── section-navigation.md
│   │   ├── section-agents.md
│   │   ├── section-workflows.md
│   │   ├── section-commands.md
│   │   ├── section-squads.md
│   │   ├── section-megabrain.md
│   │   ├── section-constitution.md
│   │   └── section-search.md
│   ├── architecture/              # Sharded Architecture
│   │   ├── data-layer.md
│   │   ├── component-layer.md
│   │   └── page-layer.md
│   ├── framework/
│   │   ├── source-tree.md
│   │   ├── tech-stack.md
│   │   └── coding-standards.md
│   └── stories/                   # Development stories
├── public/                        # Static assets
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── layout.tsx             # Root layout (Sidebar + main)
│   │   ├── globals.css            # Global styles + Tailwind
│   │   ├── page.tsx               # Home
│   │   ├── aiox/page.tsx          # Core Agents
│   │   ├── commands/page.tsx      # Commands
│   │   ├── constitution/page.tsx  # Constitution
│   │   ├── mega-brain/page.tsx    # Mega Brain
│   │   ├── search/page.tsx        # Global Search
│   │   ├── squads/page.tsx        # Low-Ticket Squad
│   │   └── workflows/page.tsx     # Workflows & Tasks
│   ├── components/                # Reusable components
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   ├── AgentCard.tsx          # Agent display card
│   │   ├── StatCard.tsx           # Metric display card
│   │   └── WorkflowDiagram.tsx    # Timeline diagram
│   └── data/                      # Structured data (TypeScript)
│       ├── agents.ts              # 30 agents (12 AIOX + 18 Low-Ticket)
│       ├── commands.ts            # Slash + agent commands
│       ├── constitution.ts        # 6 constitutional articles
│       ├── mega-brain.ts          # 14 experts + DNA + company context
│       ├── tasks.ts               # 207 tasks in 19 categories
│       └── workflows.ts           # 4 primary workflows
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 4. Data Architecture

### Pattern: TypeScript Data Files
Dados sao definidos como constantes TypeScript tipadas em `src/data/`. Cada arquivo exporta interfaces + arrays de dados.

```
src/data/
├── agents.ts      → Agent[], aioxAgents[], lowTicketAgents[]
├── commands.ts    → Command[], slashCommands[], agentCommands[]
├── constitution.ts → Article[], severityColors
├── mega-brain.ts  → Expert[], DnaLayer[], companyContext
├── tasks.ts       → Task[], taskCategories[]
└── workflows.ts   → Workflow[], workflowSelectionGuide[]
```

### Vantagens
- Zero latencia (dados embutidos no bundle)
- Type safety completo
- Facil de atualizar (editar .ts e rebuildar)
- Sem dependencias externas

## 5. Rendering Strategy

| Pagina | Rendering | Client JS |
|--------|-----------|-----------|
| `/` | Static (SSG) | Minimal |
| `/constitution/` | Static | Nenhum (ou minimal via user edit) |
| `/aiox/` | Static | Nenhum |
| `/workflows/` | Static + Client | useState para filtros |
| `/commands/` | Static | Nenhum |
| `/squads/` | Static | Nenhum |
| `/mega-brain/` | Static | Nenhum |
| `/search/` | Client-only | useState + useMemo para busca |

### `'use client'` necessario apenas em:
- `Sidebar.tsx` (usePathname, useState para collapse)
- `search/page.tsx` (useState para query, useMemo para filtro)
- `workflows/page.tsx` (useState para filtros de task)

## 6. Build & Deploy

```bash
# Development
npm run dev          # Next.js dev server na porta 3456

# Production build
npm run build        # Gera /out/ com HTML estatico

# Servir localmente
npx serve out/       # Serve arquivos estaticos
```

### Build Output
- ~11 paginas HTML pre-renderizadas
- ~87KB shared JS (React + Next.js runtime)
- ~11KB client JS para search page
- Total: <100KB first load por pagina

## 7. Performance Budget

| Metrica | Target | Atual |
|---------|--------|-------|
| First Load JS (shared) | < 100KB | ~87KB |
| Page-specific JS | < 15KB | ~11KB max |
| Build time | < 30s | ~10s |
| Pages generated | 11 | 11 |
| TypeScript errors | 0 | 0 |

## 8. Security

- **Nenhuma API exposta** (static files only)
- **Nenhum dado sensivel** (tudo e documentacao publica)
- **CSP headers** podem ser adicionados no hosting
- **Subresource Integrity** para fonts externas (opcional)
