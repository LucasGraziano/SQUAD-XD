# ADR-002 — Supabase como Backend Completo

**Status:** Aceito
**Data:** 2026-05-07
**Decisores:** @architect (Aria), @master (Orion)

---

## Contexto

Precisávamos de:
- **Banco de dados relacional** (apólices, clientes, comissões têm muitos relacionamentos)
- **Autenticação** (login, sessões, JWT)
- **Multi-tenancy** com isolamento de dados por cliente
- **Storage** para documentos e logos
- **Real-time** (opcional — para alertas ao vivo)
- **Velocidade de desenvolvimento** — produto precisa de MVP em semanas, não meses

**Alternativas consideradas:**

1. **Supabase** (escolhido)
2. Firebase + Firestore
3. PlanetScale (MySQL) + Clerk (auth) + AWS S3
4. Neon (PostgreSQL) + Auth.js + Cloudflare R2
5. Backend próprio (Node.js/Express + PostgreSQL)

---

## Decisão

**Supabase** como solução completa de backend (PostgreSQL + Auth + Storage + RLS).

---

## Justificativa

### Por que Supabase e não Firebase?

Firebase usa **NoSQL (Firestore)** — péssimo para o modelo de dados do Premia. A carteira de um corretor é fundamentalmente relacional:

```
cliente → apólices → comissões
apólice → renovações (self-reference chain)
apólice → pendências
apólice → sinistros → updates
```

Com Firestore, essas queries relacionais viram múltiplas queries desnaturalizadas. Com PostgreSQL, é um JOIN.

Além disso, Firebase tem limitações de RLS muito mais complexas de implementar vs Supabase RLS.

### Por que não backend próprio?

**Velocidade de desenvolvimento.** Implementar auth, sessions, JWT refresh, password reset, OAuth, RLS, migrations — do zero — são semanas de trabalho para features que o Supabase entrega em horas.

O Premia é um produto SaaS, não um backend framework. Cada hora gasta em infra de auth é uma hora não gasta em feature de produto.

### Por que Supabase e não PlanetScale + Clerk?

Dois serviços vs um. Cada integração adicional é mais código, mais env vars, mais billing, mais pontos de falha. Supabase cobre DB + Auth + Storage de forma integrada.

Além disso, PlanetScale usa MySQL (não PostgreSQL). Funcionalidades críticas do Premia dependem de PostgreSQL:
- `GENERATED ALWAYS AS` (colunas calculadas para `commission_expected`, `divergence_amount`)
- `EXTRACT()` em índices (para o job diário de aniversários)
- RLS nativo do PostgreSQL
- `JSONB` para `settings`, `metadata`, `address`

### A Decisão-Chave: RLS vs App-Level Isolation

A maior vantagem do Supabase sobre alternativas foi poder usar **RLS (Row Level Security)** nativo do PostgreSQL para isolamento multi-tenant.

**Alternativa rejeitada:** Isolamento via application logic (`WHERE broker_id = $currentBrokerId` em toda query).

**Problema com isolamento no app:** Um bug em qualquer ponto do código pode vazar dados entre corretores. O dev esquece o WHERE em uma query — catastrophe.

**Com RLS:** Mesmo que o código tenha um bug e faça `SELECT * FROM clients` sem WHERE, o banco de dados retorna apenas os clientes do broker autenticado. Defense in depth.

---

## Consequências

### Positivas
- Auth completo (email, social, MFA) sem código adicional
- RLS garante isolamento mesmo se houver bugs na camada de aplicação
- Tipos TypeScript gerados automaticamente do schema (`supabase gen types`)
- Dashboard visual do banco de dados (Supabase Studio) para debugging
- Storage integrado para documentos e logos
- Trigger automático `on_auth_user_created` → cria broker sem código adicional

### Negativas / Trade-offs
- **Vendor lock-in:** Migrar de Supabase para outro provider seria trabalhoso (auth sessions, storage URLs, RLS policies específicas)
- **Escalabilidade:** Supabase tem limites no plano gratuito e custo cresce com uso. Para 10.000+ brokers precisaríamos de plano Team/Enterprise
- **RLS complexity:** Policies de RLS são SQL puro — curva de aprendizado para devs não familiarizados com PostgreSQL security
- **Admin client:** Operações que bypassam RLS (cron jobs, webhooks) exigem `service_role_key` — vazamento desta key seria catastrófico (nunca no browser)
- **Cold starts:** Supabase Edge Functions têm cold starts; por isso optamos por Route Handlers do Next.js ao invés de Edge Functions para PDF generation

### Regras derivadas desta decisão
- NUNCA expor `SUPABASE_SERVICE_ROLE_KEY` no browser (somente server-side)
- SEMPRE usar `createClient()` de `@/lib/supabase/server` em Server Actions (nunca o admin)
- Admin client EXCLUSIVO para cron jobs e webhooks Stripe/ZapSign
- Toda nova tabela DEVE ter RLS habilitado + policy correspondente
- Migrations em `supabase/migrations/` — nunca alterar schema via Studio diretamente (sem rastreabilidade)
