# Coding Standards

## TypeScript
- Strict mode enabled
- Explicit interfaces for all data types
- No `any` types
- Named exports preferred

## React/Next.js
- Server Components by default
- `'use client'` only when useState/useEffect needed
- App Router conventions (page.tsx, layout.tsx)
- No `getStaticProps` / `getServerSideProps` (App Router only)

## Tailwind CSS
- Custom colors in tailwind.config.js (surface, coral, menta, gold, text)
- Custom fonts (Inter, JetBrains Mono)
- Custom animations (pulse-slow, fade-in, slide-up)
- Utility classes directly in JSX (no @apply in CSS)
- Global CSS only for: scrollbar, glow effects, gradient text, grid background

## File Naming
- Pages: `page.tsx` in route directories
- Components: PascalCase (`Sidebar.tsx`)
- Data: kebab-case or camelCase (`mega-brain.ts`)
- Docs: kebab-case (`project-brief.md`)

## Imports
- `@/` alias for `src/` directory
- Absolute imports only (tsconfig paths configured)
