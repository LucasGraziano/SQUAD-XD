# ADR-001 — Next.js 15 App Router

**Status:** Aceito
**Data:** 2026-05-07
**Decisores:** @architect (Aria), @master (Orion)

---

## Contexto

Precisávamos escolher o framework frontend/full-stack para o Premia. Requisitos:

- **SSR/SSG** para SEO da landing page e tempo de carregamento rápido do dashboard
- **Server-side data fetching** para reduzir JS no cliente e melhorar performance percebida
- **Mutações de dados** com tipagem end-to-end (sem boilerplate de REST API)
- **TypeScript** nativo
- **Ecosystem maduro** de componentes e UI libraries

**Alternativas consideradas:**

1. **Next.js 15 App Router** (escolhido)
2. Next.js 14 Pages Router (legado)
3. Remix (React Router v7)
4. SvelteKit
5. Astro + API separada

---

## Decisão

**Next.js 15 com App Router.**

---

## Justificativa

### Por que App Router e não Pages Router?

O Pages Router está em modo legado. App Router oferece:

1. **Server Components por padrão** — componentes de página buscam dados diretamente do banco sem passar pelo browser. Zero JS enviado para funcionalidades que não precisam de interatividade.

2. **Nested Layouts** — `(dashboard)/layout.tsx` carrega sidebar, dados do broker, e contextos UMA vez para todas as sub-rotas. No Pages Router, seria necessário replicar isso em `_app.tsx` de forma mais complexa.

3. **Server Actions** — mutações tipadas sem precisar criar endpoints REST. O formulário de criar cliente não precisa de `POST /api/clients` — a action `createClient()` é chamada diretamente e revalida o cache automaticamente.

4. **Route Groups** — `(auth)`, `(dashboard)`, `(portal)` permitem layouts completamente diferentes sem refletir na URL. Elegante e sem gambiarra.

5. **Streaming e Suspense** — carregamento progressivo de componentes pesados (como gráficos de relatórios).

### Por que não Remix?

Remix tem filosofia similar (loaders/actions), mas:
- Ecosystem menor de componentes UI
- Menos adoção = menos soluções para problemas que encontraríamos
- Supabase SSR integration mais testada com Next.js

### Por que não SvelteKit?

- TypeScript integration menos madura na época
- Team skill: React >> Svelte para o produto
- Ecosystem de componentes UI muito menor

---

## Consequências

### Positivas
- Queries diretas ao Supabase no servidor sem API layer
- Server Actions eliminaram ~40% do código que seria boilerplate de REST
- Bundle JS mínimo (Server Components não enviam código)
- Revalidação automática de cache (`revalidatePath()`)

### Negativas / Trade-offs
- **Learning curve** para devs acostumados com Pages Router ou CSR puro
- Algumas libraries não funcionam em Server Components (precisam de `'use client'`)
- `@react-pdf/renderer` precisou ser isolado em API Route (não funciona em Server Components)
- Debug mais complexo — "esse erro é no servidor ou no cliente?" é uma questão recorrente

### Regras derivadas desta decisão
- `'use client'` APENAS quando necessário (useState, event handlers, browser APIs)
- Nunca usar `useEffect` para buscar dados — use Server Component
- Mutações sempre via Server Actions (nunca `fetch('/api/...')` de client component para dados próprios)
