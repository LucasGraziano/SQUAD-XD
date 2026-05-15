# Arquitetura Técnica — Premia SaaS

**Versão:** 1.0 (retroativo)
**Data:** 2026-05-14
**Autor:** @architect (Aria) + @master (Orion)

---

## 1. Visão Geral

Premia é uma aplicação SaaS B2B construída como monolito modular usando **Next.js 15 App Router** com **Supabase** como backend-as-a-service. A arquitetura prioriza:

- **Simplicidade operacional:** Um único repositório, um único processo (Vercel), um único banco (Supabase)
- **Segurança por padrão:** RLS no banco de dados garante isolamento total de dados entre corretores
- **Developer Experience:** TypeScript end-to-end, Server Actions eliminam boilerplate de API, types gerados do schema Supabase
- **Performance:** Server Components reduzem JS no cliente; queries com índices estratégicos garantem < 200ms na maioria dos endpoints

---

## 2. Stack Técnico

### 2.1 Frontend

| Tecnologia | Versão | Papel |
|-----------|--------|-------|
| **Next.js** | 15.3.1 | Framework full-stack (App Router) |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.8.3 | Tipagem estática end-to-end |
| **Tailwind CSS** | 3.4.17 | Styling utility-first |
| **Radix UI** | latest | Componentes primitivos acessíveis |
| **lucide-react** | 0.511.0 | Ícones |
| **@dnd-kit** | latest | Drag and drop (Pipeline Kanban) |
| **react-hook-form** | 7.55 | Estado de formulários |
| **Zod** | 3.24 | Validação de schemas |
| **Zustand** | 5.0 | Estado client-side (minimal) |
| **@tanstack/react-query** | 5.74 | Cache de dados client-side |
| **canvas-confetti** | 1.9 | Celebração First Win |

### 2.2 Backend / Infraestrutura

| Tecnologia | Papel |
|-----------|-------|
| **Supabase Auth** | Autenticação (JWT + SSR cookies) |
| **Supabase PostgreSQL** | Banco de dados principal (v15) |
| **Supabase RLS** | Row-Level Security — isolamento multi-tenant |
| **Supabase Storage** | Documentos, logos, uploads |
| **Supabase Edge Functions** | Jobs assíncronos (futuros) |
| **Vercel** | Deploy e edge network |
| **Stripe** | Payments, subscriptions, webhooks |
| **Resend** | E-mail transacional |
| **Web Push API** | Push notifications nativas |

### 2.3 Serviços de IA

| Serviço | Uso |
|---------|-----|
| **Claude (Anthropic)** | Sugestões contextuais, análise de carteira |
| **Groq** | PDF parsing rápido (Story 2.3) |
| **Google Gemini** | Classificação de documentos |

### 2.4 Ferramentas de Produto

| Serviço | Uso |
|---------|-----|
| **PostHog** | Analytics de produto (eventos, funis, heatmaps) |
| **ZapSign** | Assinatura digital de documentos |
| **Google Calendar API** | Sync de vencimentos com calendário |
| **WhatsApp Business API** | Templates de renovação automatizados |

---

## 3. Estrutura de Rotas

### 3.1 Route Groups

```
src/app/
├── (auth)/                  # Rotas sem dashboard (público com form)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── reset-password/page.tsx
│
├── (dashboard)/             # App principal (requer autenticação)
│   ├── layout.tsx           # Sidebar + BrokerPlanProvider + ServiceWorker
│   ├── dashboard/page.tsx   # Dashboard principal
│   ├── clientes/
│   │   ├── page.tsx         # Listagem de clientes
│   │   └── [id]/page.tsx    # Perfil do cliente + histórico
│   ├── apolices/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── cotacoes/page.tsx    # Multicálculo
│   ├── propostas/page.tsx   # Pipeline de propostas
│   ├── sinistros/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── pipeline/page.tsx    # Kanban de leads
│   ├── alertas/page.tsx     # Central de alertas
│   ├── financeiro/page.tsx  # Comissões + forecast
│   ├── agenda/page.tsx      # Calendário
│   ├── crosssell/page.tsx   # Oportunidades de cross-sell
│   ├── documentos/page.tsx  # Gestão de documentos
│   ├── relatorios/page.tsx  # Relatórios avançados
│   └── configuracoes/page.tsx # Perfil, plano, integrações
│
├── (portal)/                # Portal público do cliente (token auth)
│   └── portal/[token]/
│       ├── page.tsx         # Home do portal
│       ├── apolices/page.tsx
│       └── sinistros/page.tsx
│
└── api/                     # Route Handlers
    ├── pdf/
    │   ├── proposal/[policyId]/route.ts
    │   └── relatorio/
    │       └── carteira/route.ts
    ├── relatorio/
    │   └── carteira/route.ts
    ├── cron/
    │   ├── birthday-notifications/route.ts
    │   └── renewal-alerts/route.ts
    ├── webhooks/
    │   ├── stripe/route.ts
    │   └── zapsign/route.ts
    └── push/route.ts
```

### 3.2 Páginas por Rota

| Rota | Descrição | Auth |
|------|-----------|------|
| `/dashboard` | KPIs, widgets, alertas do dia | ✅ |
| `/clientes` | Listagem + busca + filtros + importação | ✅ |
| `/clientes/[id]` | Perfil: apólices, histórico, cross-sell | ✅ |
| `/apolices` | Tabela de apólices com filtros | ✅ |
| `/apolices/[id]` | Detalhe da apólice + pendências + sinistros | ✅ |
| `/cotacoes` | Formulário multicálculo + resultado | ✅ |
| `/propostas` | Tabela de propostas + status flow | ✅ |
| `/sinistros` | Lista de sinistros + abertura | ✅ |
| `/sinistros/[id]` | Detalhe + timeline de status | ✅ |
| `/pipeline` | Kanban de leads | ✅ |
| `/alertas` | Central de alertas (vencimentos + aniversários) | ✅ |
| `/financeiro` | Comissões + forecast | ✅ |
| `/agenda` | Calendário de eventos | ✅ |
| `/crosssell` | Oportunidades identificadas | ✅ |
| `/relatorios` | Gráficos + métricas avançadas | ✅ |
| `/configuracoes` | Perfil, plano, integrações, PDF de carteira | ✅ |
| `/portal/[token]` | Portal público do cliente | Token |
| `/login`, `/signup` | Autenticação | ❌ |

---

## 4. Padrões de Arquitetura

### 4.1 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Client Component (useState, onClick, etc.)     │   │
│  │  → Server Action call (form/button)             │   │
│  └────────────────────────┬────────────────────────┘   │
│                            │ HTTP                        │
└────────────────────────────┼────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                   Next.js Server                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Server Component (async, no 'use client')      │   │
│  │  → createClient() from @/lib/supabase/server    │   │
│  │  → query Supabase directly                      │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Server Action ('use server')                   │   │
│  │  → getBrokerId() validates auth                 │   │
│  │  → Supabase mutation (insert/update/delete)     │   │
│  │  → revalidatePath() or redirect()               │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    Supabase                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  PostgreSQL + RLS                               │   │
│  │  get_broker_id() → auth.uid() → brokers.id     │   │
│  │  ALL policies: broker_id = get_broker_id()     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Cliente Supabase — 3 Tiers

```typescript
// TIER 1: Server Components + Server Actions
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
// Usa cookies() do Next.js — automático via middleware

// TIER 2: Client Components
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
// Singleton — não recria o client a cada render

// TIER 3: Admin (Service Role)
// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'
// Service role key — bypass RLS
// APENAS para cron jobs e webhooks do servidor
// NUNCA exposto ao browser
```

### 4.3 Server Actions Pattern

```typescript
// src/app/actions/[module].ts
'use server'

import { createClient } from '@/lib/supabase/server'

async function getBrokerId(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: broker } = await supabase
    .from('brokers')
    .select('id')
    .eq('user_id', user.id)
    .single()
  
  if (!broker) throw new Error('Broker not found')
  return broker.id
}

export async function createClient_action(data: FormData) {
  const brokerId = await getBrokerId()  // Sempre primeiro
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('clients')
    .insert({ broker_id: brokerId, ...data })
    
  if (error) throw error
  revalidatePath('/clientes')
}
```

### 4.4 Plan Gate Pattern

```typescript
// Feature gate: componente que envolve UI premium
import { PlanGate } from '@/components/shared/PlanGate'

// No componente:
<PlanGate featureKey="relatorio-carteira">
  <RelatorioCarteiraButton />
</PlanGate>

// PlanGate verifica via BrokerPlanProvider (React Context)
// BrokerPlanProvider é carregado no layout do dashboard

// Feature keys disponíveis:
// 'email-automatico' | 'portal-cliente' | 'assinatura-digital'
// 'relatorios-avancados' | 'relatorio-carteira' → Pro
// 'whatsapp-api' | 'google-calendar' → Broker

// Verificação server-side (API routes):
import { meetsRequirement } from '@/lib/constants/plan-gates'
if (!meetsRequirement(broker.plan, 'pro')) {
  return new Response('Upgrade required', { status: 402 })
}
```

### 4.5 PDF Generation Pattern

```typescript
// PDF gerado server-side via @react-pdf/renderer
// src/app/api/[path]/route.ts
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'

export async function GET(request: Request) {
  // 1. Auth + plan check
  // 2. Fetch data
  // 3. Render PDF
  const buffer = await renderToBuffer(
    React.createElement(MyPdfDocument, { data })
  )
  
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="doc-${date}.pdf"`,
    },
  })
}
```

---

## 5. Multi-Tenancy e Segurança

### 5.1 Estratégia de Isolamento

Premia usa **RLS (Row Level Security)** como camada primária de isolamento de dados. Cada corretor só acessa seus próprios dados — garantia dada pelo banco de dados, independente de bugs no código da aplicação.

**Função SQL central:**
```sql
CREATE OR REPLACE FUNCTION public.get_broker_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT id FROM public.brokers WHERE user_id = auth.uid() LIMIT 1;
$$;
```

**Política aplicada em todas as tabelas:**
```sql
CREATE POLICY "clients_all" ON clients
  FOR ALL 
  USING (broker_id = public.get_broker_id())
  WITH CHECK (broker_id = public.get_broker_id());
```

`SECURITY DEFINER` garante que a função roda com privilégios do owner (não do caller), evitando N+1 de auth lookups.

### 5.2 Portal do Cliente — Autenticação por Token

Clientes acessam o portal via token único. Fluxo:

```
1. Corretor gera link → sistema cria portal_access_tokens (JWT, 30 dias)
2. Cliente abre /portal/[token]
3. Middleware verifica token → extrai client_id
4. Supabase admin client busca dados do cliente (bypass RLS com service role)
5. Render server-side — cliente vê apenas seus dados
```

Token structure: `{ clientId, brokerId, exp: now + 30d }` assinado com `PORTAL_SECRET`.

### 5.3 Cron Jobs — Autenticação por Secret

```typescript
// src/app/api/cron/birthday-notifications/route.ts
export async function POST(request: Request) {
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  // ...
}
```

Cron jobs usam Supabase admin client (service role) para operar além dos limites de RLS.

---

## 6. Componentes Principais

### 6.1 Estrutura de Componentes

```
src/components/
├── ui/                    # Design system base (Button, Input, Badge, etc.)
├── layout/                # Sidebar, PageHeader, BrokerPlanProvider
├── dashboard/             # Widgets do dashboard (KPI cards, health score, etc.)
├── clientes/              # Forms, tabela, perfil, badges de status
├── apolices/              # Form, tabela, detalhes, badges
├── cotacoes/              # Multicálculo: formulário por ramo, resultado
├── propostas/             # Form, tabela, status flow
├── sinistros/             # Form, tabela, timeline de status
├── pipeline/              # KanbanBoard, KanbanColumn, LeadCard (DnD Kit)
├── alertas/               # AlertasList, AlertCard, filtros
├── financeiro/            # ComissaoTable, ForecastChart
├── relatorios/            # Charts, KPI cards
├── relatorio/             # CarteiraReport.tsx (PDF Document)
├── pdf/                   # ProposalDocument.tsx (PDF Document)
├── portal/                # Portal do cliente (público)
├── onboarding/            # OnboardingChecklist, FirstWinBanner
├── import/                # ImportModal (3 passos)
├── shared/                # PlanGate, RoiCalculator
├── configuracoes/         # Seções de configurações, RelatorioCarteiraButton
├── notifications/         # PushNotification UI
├── marketing/             # Landing page components
└── pendencies/            # PendencyList, PendencyForm
```

### 6.2 Design System

Base: Tailwind CSS + Radix UI primitivos

**Paleta principal:**
- Primary (ação): `#0BD904` (verde Premia)
- Text primary: `#0D0D0D`
- Text secondary: `#6B7280`
- Border default: `#D1D1D1`
- Background: `#F9FAFB`
- Error: `#DC2626`

**Componentes ui/ reutilizáveis:**
- `Button` — com prop `loading` (spinner automático)
- `Input`, `Label`, `Textarea`
- `Badge` — `variant: default | success | warning | error | info`
- `EmptyState` — com `icon`, `title`, `description`, `action`
- `PageHeader` — título + breadcrumb + actions

---

## 7. Banco de Dados

Ver documento dedicado: [`DATABASE.md`](./DATABASE.md)

---

## 8. Cron Jobs

| Job | Endpoint | Frequência | Descrição |
|-----|---------|-----------|-----------|
| Birthday Notifications | `POST /api/cron/birthday-notifications` | Diário 08:00 BRT | Identifica aniversariantes e cria alertas |
| Renewal Alerts | `POST /api/cron/renewal-alerts` | Diário 07:00 BRT | Cria alertas para apólices vencendo em 7/15/30/60/90 dias |

**Auth:** Header `x-cron-secret` com valor igual a `CRON_SECRET` env var.

**Scheduler:** Vercel Cron ou serviço externo (cron-job.org).

---

## 9. Variáveis de Ambiente

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=          # URL pública do projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Chave anon (client-side)
SUPABASE_SERVICE_ROLE_KEY=         # Service role (server-only, admin)

# Stripe
STRIPE_SECRET_KEY=                 # Chave secreta Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Chave pública Stripe
STRIPE_WEBHOOK_SECRET=             # Secret do webhook Stripe

# Resend (e-mail)
RESEND_API_KEY=

# ZapSign (assinatura digital)
ZAPSIGN_API_TOKEN=

# Google Calendar
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Portal do Cliente
PORTAL_SECRET=                     # Secret para JWT do portal

# Cron Jobs
CRON_SECRET=                       # Autenticação dos endpoints de cron

# PostHog (analytics)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Web Push
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

---

## 10. Decisões de Arquitetura

Ver documentos ADR detalhados em [`adrs/`](./adrs/):

| ADR | Decisão |
|-----|---------|
| [ADR-001](./adrs/ADR-001-nextjs-app-router.md) | Next.js 15 App Router vs Pages Router |
| [ADR-002](./adrs/ADR-002-supabase-backend.md) | Supabase como backend completo |
| [ADR-003](./adrs/ADR-003-server-actions.md) | Server Actions vs REST API |
| [ADR-004](./adrs/ADR-004-rls-strategy.md) | RLS como isolamento multi-tenant |
| [ADR-005](./adrs/ADR-005-plan-gating.md) | Feature gating via PlanGate component |

---

## Change Log

| Data | Autor | Descrição |
|------|-------|-----------|
| 2026-05-14 | @master (Orion) | Documento criado — arquitetura completa dos Épicos 5-7 |
