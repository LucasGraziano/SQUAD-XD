# Onboarding Guide — Premia SaaS

**Para:** Novos desenvolvedores entrando no projeto
**Data:** 2026-05-14
**Autor:** @master (Orion)

---

## 1. O que é o Premia?

Premia é um **CRM B2B SaaS para corretores de seguros habilitados SUSEP**. O produto resolve um problema real: corretores gerenciam carteiras de 200–600 clientes em planilhas Excel e perdem renovações por falta de acompanhamento sistemático.

**Stack:** Next.js 15 App Router + Supabase (PostgreSQL + Auth + RLS) + Stripe + TypeScript

**Localização do código:** `squads/lucky-saas/app/`

Para entender o produto completo antes de codar: leia [`docs/prd/PRD-premia-saas.md`](../prd/PRD-premia-saas.md).

---

## 2. Pré-requisitos

```bash
# Versões necessárias
node --version    # >= 18.x (recomendado: 20.x LTS)
npm --version     # >= 9.x
git --version     # qualquer versão recente

# Ferramentas opcionais mas recomendadas
supabase --version  # Supabase CLI para desenvolvimento local
gh --version        # GitHub CLI para PRs
```

**Contas necessárias:**
- Supabase (projeto já existe — peça variáveis de ambiente para o lead)
- Stripe (test mode keys)
- Resend (API key de teste)

---

## 3. Setup do Ambiente

### 3.1 Clonar e Instalar

```bash
# O repositório está em SQUAD XD — navegue para o squad
cd "squads/lucky-saas/app"

# Instalar dependências
npm install
```

### 3.2 Variáveis de Ambiente

Copie o template e preencha com os valores do projeto:

```bash
cp .env.example .env.local
```

Variáveis críticas para desenvolvimento:

```bash
# Supabase — obtenha no dashboard do projeto
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Nunca expor no browser

# Stripe — use test keys (prefixadas com sk_test_)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...    # Gerado ao criar webhook no Stripe

# Portal do Cliente
PORTAL_SECRET=qualquer-string-aleatoria-longa-aqui

# Cron Jobs (pode ser qualquer string para dev)
CRON_SECRET=dev-cron-secret-123

# Email (opcional para dev local — pode deixar vazio)
RESEND_API_KEY=re_...

# Analytics (opcional para dev)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Web Push (opcional para dev)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

### 3.3 Supabase Local (Recomendado)

Para desenvolver sem depender do projeto remoto:

```bash
# Inicializar Supabase local (primeira vez)
supabase init

# Subir banco local com Docker
supabase start
# → Acesse o studio em http://localhost:54323

# Aplicar todas as migrations
supabase db push

# Gerar tipos TypeScript do schema
supabase gen types typescript --local > src/types/database.ts
```

Após `supabase start`, use as variáveis locais:
```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[key da saída do supabase start]
SUPABASE_SERVICE_ROLE_KEY=[service_role key da saída]
```

### 3.4 Rodar o Projeto

```bash
# Desenvolvimento
npm run dev
# → http://localhost:3000

# Type check
npm run typecheck

# Lint
npm run lint

# Build de produção (verifica erros de build)
npm run build
```

### 3.5 Criar Usuário de Teste

Com Supabase local rodando:
1. Acesse http://localhost:54323 (Supabase Studio)
2. Authentication → Users → Add user
3. Ou use a UI em http://localhost:3000/signup

O trigger `on_auth_user_created` cria automaticamente o registro em `brokers` ao signup.

---

## 4. Estrutura do Projeto

```
squads/lucky-saas/app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, Signup, Reset
│   │   ├── (dashboard)/        # App principal (autenticado)
│   │   │   ├── layout.tsx      # ← LEIA ISSO PRIMEIRO
│   │   │   ├── dashboard/      # Dashboard com widgets
│   │   │   ├── clientes/       # Listagem + [id]/page.tsx
│   │   │   ├── apolices/       # Tabela + [id]/page.tsx
│   │   │   ├── cotacoes/       # Multicálculo
│   │   │   ├── propostas/      # Status flow
│   │   │   ├── sinistros/      # Claims + [id]
│   │   │   ├── pipeline/       # Kanban leads
│   │   │   ├── alertas/        # Central de alertas
│   │   │   ├── financeiro/     # Comissões
│   │   │   ├── agenda/         # Calendário
│   │   │   ├── crosssell/      # Oportunidades
│   │   │   ├── relatorios/     # Charts
│   │   │   └── configuracoes/  # Settings + plano
│   │   ├── (portal)/           # Portal público do cliente
│   │   └── api/                # Route Handlers (PDF, cron, webhooks)
│   │
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Design system base
│   │   ├── layout/             # Sidebar, PageHeader
│   │   ├── shared/             # PlanGate, etc.
│   │   └── [feature]/          # Componentes por feature
│   │
│   ├── lib/                    # Utilitários e lógica de negócio
│   │   ├── supabase/
│   │   │   ├── server.ts       # Client server-side (SSR)
│   │   │   ├── client.ts       # Client browser (singleton)
│   │   │   └── admin.ts        # Service role (cron/webhooks)
│   │   ├── constants/
│   │   │   ├── plan-gates.ts   # Feature flags por plano
│   │   │   └── ramos.ts        # Ramos de seguro
│   │   ├── clients/
│   │   │   ├── renewal-history.ts    # Histórico de renovações
│   │   │   └── birthday-crosssell.ts # Cross-sell por aniversário
│   │   ├── portfolio/
│   │   │   ├── cross-sell.ts   # Engine de cross-sell
│   │   │   ├── health-score.ts # Score de saúde
│   │   │   └── report-data.ts  # Dados para relatório PDF
│   │   └── jobs/
│   │       └── birthday-notifications.ts  # Job de aniversários
│   │
│   ├── app/actions/            # Server Actions (mutations)
│   │   ├── clients.ts
│   │   ├── policies.ts
│   │   ├── proposals.ts
│   │   └── ...
│   │
│   └── types/
│       └── database.ts         # Tipos gerados do schema Supabase
│
├── supabase/
│   ├── migrations/             # 21 migrations (ordem cronológica)
│   └── config.toml             # Config local do Supabase
│
└── docs/                       # Documentação (você está aqui)
    ├── prd/                    # Product Requirements
    ├── architecture/           # Arquitetura + ADRs + Database
    ├── use-cases/              # Use cases documentados
    ├── guides/                 # Guias (este arquivo)
    └── stories/                # Stories de desenvolvimento
```

---

## 5. Padrões de Código

### 5.1 Server Actions (Mutations)

Toda mutação de dados usa Server Actions em `src/app/actions/`:

```typescript
// src/app/actions/clients.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// SEMPRE começa com autenticação
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

export async function createClient_example(data: { name: string; phone: string }) {
  const brokerId = await getBrokerId()  // ← SEMPRE primeiro
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('clients')
    .insert({ broker_id: brokerId, ...data })
    
  if (error) throw error
  revalidatePath('/clientes')  // Invalida cache do Next.js
}
```

### 5.2 Server Components (Queries)

Páginas que buscam dados do banco são Server Components (sem 'use client'):

```typescript
// src/app/(dashboard)/clientes/page.tsx
// Sem 'use client' — roda no servidor
import { createClient } from '@/lib/supabase/server'

export default async function ClientesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  // RLS garante isolamento — query retorna apenas dados do broker autenticado
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('name')
  
  return <ClientesTable clients={clients ?? []} />
}
```

### 5.3 Client Components (Interatividade)

Use 'use client' apenas quando necessário (useState, onClick, etc.):

```typescript
// src/components/clientes/ClientesTable.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'  // ← client.ts, não server.ts

export function ClientesTable({ clients: initialClients }) {
  const [clients, setClients] = useState(initialClients)
  const supabase = createClient()  // Singleton browser client
  
  // ...
}
```

### 5.4 Feature Gates (PlanGate)

Para funcionalidades premium:

```typescript
// No componente (client-side check via Context):
import { PlanGate } from '@/components/shared/PlanGate'

<PlanGate featureKey="relatorio-carteira">
  <RelatorioCarteiraButton />
</PlanGate>

// Em API Routes (server-side check obrigatório):
import { meetsRequirement } from '@/lib/constants/plan-gates'

export async function GET(request: Request) {
  // ... autenticar broker
  if (!meetsRequirement(broker.plan, 'pro')) {
    return new Response('Plan upgrade required', { status: 402 })
  }
  // ...
}
```

### 5.5 Nomenclatura e Convenções

- **Arquivos:** `kebab-case.ts` para lib/utils; `PascalCase.tsx` para componentes
- **Imports:** Sempre absolutos (`@/lib/...`, `@/components/...`)
- **Tipos:** Gerados do Supabase em `src/types/database.ts` — use `Database['public']['Tables']['clients']['Row']`
- **Componentes UI:** Sempre reutilize `src/components/ui/` antes de criar novo
- **Paleta de cores:** Sempre use as variáveis da paleta Premia (ver `DESIGN.md` ou `ARCHITECTURE.md` seção 6.2)

---

## 6. Entendendo o RLS

**Row Level Security (RLS)** é a camada de segurança mais importante do sistema. Funciona assim:

1. Todo usuário autenticado tem um `auth.uid()` (UUID do Supabase Auth)
2. A função `get_broker_id()` mapeia `auth.uid() → brokers.id`
3. TODA tabela tem policy: `broker_id = get_broker_id()`
4. Isso garante que a query `SELECT * FROM clients` retorna APENAS os clientes do broker logado — mesmo sem WHERE clause no código

**Consequência prática:** Você nunca precisa adicionar `WHERE broker_id = ?` manualmente nas queries dentro de Server Components/Actions — o RLS faz isso automaticamente.

**Exceção:** `supabase/admin.ts` usa service role que bypassa RLS. Use APENAS para cron jobs e webhooks (nunca em código que processa requests de usuários).

---

## 7. Fluxo de Desenvolvimento

### 7.1 Ciclo de uma Story

```
@sm *draft → Story criada em docs/stories/X.Y.story.md
     ↓
@po *validate → Story validada e marcada "Ready"
     ↓
@dev *develop → Implementação (checkboxes tasks → [x])
     ↓
TypeCheck + Lint passando → Status "Ready for Review"
     ↓
@po *validate → Aprovação final → Status "Done"
     ↓
@devops *push → Push + PR para master
```

### 7.2 Antes de Commitar

```bash
# Sempre verificar
npm run typecheck    # Zero erros TypeScript
npm run lint         # Zero warnings/erros ESLint
npm run build        # Build de produção sem erros
```

### 7.3 Criar Nova Feature

1. Leia a story correspondente em `docs/stories/[epic].[story].story.md`
2. Crie migration SQL se houver mudança de schema: `supabase/migrations/[timestamp]_[feature].sql`
3. Rode `supabase gen types` para atualizar tipos
4. Implemente server action em `src/app/actions/[module].ts`
5. Crie componentes em `src/components/[feature]/`
6. Conecte na página em `src/app/(dashboard)/[route]/page.tsx`
7. Adicione PlanGate se a feature for premium
8. Atualize o File List na story

---

## 8. Troubleshooting Comum

### "Broker not found" em Server Actions

Causa: Usuário autenticado mas sem registro em `brokers`.

Solução: Verificar se o trigger `on_auth_user_created` está ativo no Supabase. No local: `supabase db reset` e recriar usuário.

### TypeScript error: "Property 'X' does not exist on type 'never'"

Causa: Resultado do Supabase retornou `null` e não foi tipado.

Solução: Sempre verificar `if (!data) throw new Error(...)` antes de acessar propriedades.

### RLS bloqueando query esperada

Causa: Query sem autenticação válida ou `broker_id` não definido.

Solução: Verificar se o usuário está autenticado (cookies); no admin client, confirmar que está usando `SUPABASE_SERVICE_ROLE_KEY` e não `ANON_KEY`.

### Import de componente React falha em API Route

Causa: Tentando importar componente React (com JSX) em route handler que não suporta.

Solução: Para PDF, use `React.createElement(Component, props)` ao invés de JSX diretamente. Ver `src/app/api/relatorio/carteira/route.ts` como referência.

### Supabase local não sobe

```bash
supabase stop
docker ps -a  # Verificar containers
supabase start
```

---

## 9. Documentação de Referência

| Documento | Localização | Para que serve |
|-----------|-------------|---------------|
| PRD completo | `docs/prd/PRD-premia-saas.md` | Entender o produto, personas, requisitos |
| Arquitetura | `docs/architecture/ARCHITECTURE.md` | Stack, patterns, routes, env vars |
| Schema do banco | `docs/architecture/DATABASE.md` | Todas as tabelas, índices, RLS, migrations |
| Use cases | `docs/use-cases/USE-CASES.md` | Fluxos de usuário documentados |
| Stories index | `docs/stories/_INDEX.md` | Visão geral de todo o backlog |
| ADRs | `docs/architecture/adrs/` | Por que tomamos cada decisão técnica |
| DESIGN.md | `DESIGN.md` | Paleta, tipografia, componentes UI |

---

## 10. Contatos e Recursos

- **Repositório:** `C:\SQUAD XD\squads\lucky-saas\app\`
- **Branch principal:** `master`
- **Supabase Dashboard:** Peça URL para o lead técnico
- **Stripe Dashboard:** Test mode em dashboard.stripe.com
- **Documentação Next.js App Router:** https://nextjs.org/docs/app
- **Documentação Supabase:** https://supabase.com/docs

---

*Dúvidas sobre o produto: leia o PRD. Dúvidas técnicas: leia ARCHITECTURE.md. Dúvidas sobre uma feature específica: leia a story correspondente em `docs/stories/`. — Orion, @master*
