# Architecture Shard: Page Layer

## Route Map

| Route | File | Rendering | Description |
|-------|------|-----------|-------------|
| `/` | `app/page.tsx` | SSG | Home: hero, stats, how-it-works, features, L1-L4 |
| `/constitution/` | `app/constitution/page.tsx` | SSG+Client | 6 articles, severity, AIOX+MB overview |
| `/aiox/` | `app/aiox/page.tsx` | SSG | 12 agents, delegation matrix |
| `/workflows/` | `app/workflows/page.tsx` | Client | 207 tasks filterable + workflow diagrams |
| `/commands/` | `app/commands/page.tsx` | SSG | Activation, agent cmds, slash cmds |
| `/squads/` | `app/squads/page.tsx` | SSG | 29 agents in hierarchy |
| `/mega-brain/` | `app/mega-brain/page.tsx` | SSG | 14 experts, DNA, sync, company |
| `/search/` | `app/search/page.tsx` | Client | Global search |

## Layout
- `app/layout.tsx`: Root layout with Sidebar + `<main className="ml-64">`
- All pages share same grid-bg background
- Hero sections with gradient overlays per section color
