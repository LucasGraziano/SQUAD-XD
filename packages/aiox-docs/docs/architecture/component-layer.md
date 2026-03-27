# Architecture Shard: Component Layer

## Components

### Server Components (default)
- `AgentCard` — renders agent data, no interactivity
- `StatCard` — metric display with gradient border
- `WorkflowDiagram` — timeline with phases

### Client Components ('use client')
- `Sidebar` — usePathname (active state), useState (collapse)

### Page-level Client
- `search/page.tsx` — useState + useMemo for search
- `workflows/page.tsx` — useState for category filter + search

## Composition Pattern
Pages import data directly from `src/data/` and render components inline.
No prop drilling beyond 1 level. No global state. No context providers.
