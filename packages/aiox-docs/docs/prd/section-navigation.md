# PRD Shard: Navigation (FR-1)

## Requirements
- FR-1.1: Sidebar fixa (w-64) com links para todas as 8 secoes
- FR-1.2: Sidebar colapsavel (w-64 ↔ w-16) com toggle button
- FR-1.3: Status indicator no footer (versao AIOX v3.0 + pulsing menta dot)
- FR-1.4: Active state visual (bg-surface-600 + text-coral + font-medium)
- FR-1.5: Nav organizado em grupos: Overview, AIOX Core, Squads, Knowledge, Reference

## Component: Sidebar.tsx
- `'use client'` (usePathname para active state, useState para collapse)
- Position: fixed left-0, z-50
- Groups: 5 secoes com labels uppercase tracking-widest
- Links: icon + label (icon-only when collapsed)
- Footer: version + status dot
