# Vínculo — Arquitetura Técnica Completa

**Produto:** Vínculo (antes: PsiSaaS)  
**Versão:** 1.0  
**Agente:** @architect (Aria)  
**Data:** Abril 2026

---

## 1. Visão Arquitetural

### Princípios Guias
1. **Privacy by Design** — dados clínicos nunca em texto claro no servidor
2. **Mobile-first** — psicólogo acessa entre sessões, no celular
3. **Zero downtime** — consultório não pode parar por manutenção
4. **Compliance nativo** — LGPD e CFP resolvidos na arquitetura, não como afterthought

### Stack Decisão Final

```
Frontend:   Next.js 14 (App Router) + TypeScript
Backend:    Supabase (PostgreSQL + Auth + Storage + Edge Functions)
Styling:    Tailwind CSS + shadcn/ui
Payments:   Pagar.me (PIX + Boleto)
Messaging:  Z-API (WhatsApp Business — mais simples que Twilio para BR)
Email:      Resend
AI:         Anthropic Claude API (Haiku) para IA de Linhagem
Deploy:     Vercel (frontend) + Supabase Cloud (backend)
Monitoring: Vercel Analytics + Supabase Dashboard
```

---

## 2. Arquitetura de Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser/PWA)                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Next.js 14 App Router                                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │  (auth)/     │  │ (dashboard)/ │  │  (public)/   │  │   │
│  │  │  login       │  │  agenda      │  │  landing     │  │   │
│  │  │  register    │  │  pacientes   │  │  pricing     │  │   │
│  │  │              │  │  financeiro  │  │  blog        │  │   │
│  │  │              │  │  alertas     │  │              │  │   │
│  │  │              │  │  perfil      │  │              │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Crypto Layer (client-side):                                    │
│  AES-256-GCM encrypt/decrypt notas clínicas no browser         │
│  Chave derivada da senha (PBKDF2) — nunca sai do dispositivo   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / WSS (TLS 1.3)
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                         SUPABASE                                │
│                                                                 │
│  ┌─────────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │   PostgreSQL    │  │     Auth      │  │    Storage       │  │
│  │                 │  │  (JWT + RLS)  │  │  (PDFs, Docs)    │  │
│  │   Row Level     │  │               │  │  Bucket privado  │  │
│  │   Security      │  │  Magic Link   │  │  por psicólogo   │  │
│  │   em todas      │  │  Email/Senha  │  │                  │  │
│  │   as tabelas    │  │               │  │                  │  │
│  └─────────────────┘  └───────────────┘  └──────────────────┘  │
│                                                                 │
│  ┌─────────────────┐  ┌───────────────────────────────────────┐ │
│  │   Real-time     │  │         Edge Functions (Cron)         │ │
│  │  (Notificações  │  │                                       │ │
│  │   de alertas)   │  │  daily-abandonment-score (08:00 BRT)  │ │
│  │                 │  │  weekly-financial-report (seg 07:00)  │ │
│  │                 │  │  monthly-billing-cycle (dia 1, 06:00) │ │
│  └─────────────────┘  └───────────────────────────────────────┘ │
└──────────────┬──────────────────────────────────────────────────┘
               │
   ┌───────────┼───────────────────────┐
   │           │                       │
┌──▼────┐ ┌───▼────────┐ ┌────────────▼──┐ ┌──────────────────┐
│Pagar.me│ │   Z-API    │ │    Resend     │ │  Anthropic API   │
│PIX    │ │ WhatsApp   │ │   (Email)     │ │  (Claude Haiku)  │
│Boleto │ │ Business   │ │               │ │  IA de Linhagem  │
│Webhook│ │ Lembretes  │ │  Onboarding   │ │                  │
│       │ │ Cobranças  │ │  Alertas      │ │  ~R$0,05/análise │
└───────┘ └────────────┘ └───────────────┘ └──────────────────┘
```

---

## 3. Schema do Banco de Dados

### Diagrama de Entidades

```
psychologists ──┬── patients ──── session_notes
                │       │
                │       └── payments
                │       │
                │       └── abandonment_scores
                │
                ├── sessions ──── session_notes
                │
                ├── availability_slots
                │
                ├── subscriptions
                │
                └── lineage_analyses
```

### DDL Completo

```sql
-- ════════════════════════════════════════
-- PSICÓLOGOS
-- ════════════════════════════════════════
CREATE TABLE psychologists (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name         TEXT NOT NULL,
  crp               TEXT NOT NULL UNIQUE, -- ex: "06/123456"
  email             TEXT NOT NULL UNIQUE,
  phone             TEXT,
  specialty         TEXT[], -- ['TCC', 'Psicanálise', 'Gestalt']
  years_experience  INTEGER,
  city              TEXT,
  state             TEXT,
  session_price     NUMERIC(10,2),
  session_duration  INTEGER DEFAULT 50, -- em minutos
  timezone          TEXT DEFAULT 'America/Sao_Paulo',
  plan              TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'solo', 'clinico', 'pro')),
  plan_expires_at   TIMESTAMPTZ,
  whatsapp_token    TEXT, -- Z-API token (criptografado)
  onboarding_done   BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ════════════════════════════════════════
-- DISPONIBILIDADE
-- ════════════════════════════════════════
CREATE TABLE availability_slots (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id  UUID REFERENCES psychologists(id) ON DELETE CASCADE NOT NULL,
  day_of_week      INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Dom, 1=Seg...
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ════════════════════════════════════════
-- PACIENTES
-- ════════════════════════════════════════
CREATE TABLE patients (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id     UUID REFERENCES psychologists(id) ON DELETE CASCADE NOT NULL,
  full_name           TEXT NOT NULL,
  birth_date          DATE,
  email               TEXT,
  phone               TEXT NOT NULL,
  emergency_contact   JSONB, -- { name, phone, relationship }
  legal_guardian      JSONB, -- para menores
  demand_description  TEXT,  -- demanda inicial (texto livre)
  therapeutic_goals   TEXT,  -- objetivos acordados
  session_price       NUMERIC(10,2), -- pode diferir do padrão do psicólogo
  billing_cycle       TEXT DEFAULT 'per_session'
                        CHECK (billing_cycle IN ('per_session', 'weekly', 'monthly')),
  status              TEXT DEFAULT 'active'
                        CHECK (status IN ('active', 'paused', 'discharged', 'transferred', 'abandoned')),
  discharge_reason    TEXT,
  consent_signed_at   TIMESTAMPTZ,
  consent_version     TEXT DEFAULT '1.0',
  google_calendar_id  TEXT, -- ID do evento recorrente no GCal
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ════════════════════════════════════════
-- SESSÕES
-- ════════════════════════════════════════
CREATE TABLE sessions (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id            UUID REFERENCES psychologists(id) ON DELETE CASCADE NOT NULL,
  patient_id                 UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  scheduled_at               TIMESTAMPTZ NOT NULL,
  duration_minutes           INTEGER DEFAULT 50,
  modality                   TEXT DEFAULT 'in_person'
                               CHECK (modality IN ('in_person', 'online', 'group')),
  status                     TEXT DEFAULT 'scheduled'
                               CHECK (status IN (
                                 'scheduled', 'confirmed', 'completed',
                                 'absent_justified', 'absent_no_notice',
                                 'rescheduled', 'cancelled_patient', 'cancelled_psychologist'
                               )),
  confirmation_sent_at       TIMESTAMPTZ,
  confirmation_responded_at  TIMESTAMPTZ,
  reminder_sent_at           TIMESTAMPTZ,
  google_calendar_event_id   TEXT,
  recurrence_rule            TEXT, -- RRULE RFC 5545 (ex: FREQ=WEEKLY;BYDAY=MO)
  notes_for_patient          TEXT, -- visíveis no portal (não clínicas)
  created_at                 TIMESTAMPTZ DEFAULT now(),
  updated_at                 TIMESTAMPTZ DEFAULT now()
);

-- ════════════════════════════════════════
-- NOTAS CLÍNICAS (imutáveis após 24h)
-- ════════════════════════════════════════
CREATE TABLE session_notes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       UUID REFERENCES sessions(id) ON DELETE RESTRICT NOT NULL,
  psychologist_id  UUID REFERENCES psychologists(id) NOT NULL,
  patient_id       UUID REFERENCES patients(id) NOT NULL,
  content_encrypted TEXT NOT NULL, -- AES-256-GCM, client-side encrypted
  techniques       TEXT[],  -- ['TCC', 'ACT', 'Defusão cognitiva']
  themes           TEXT[],  -- ['ansiedade', 'relacionamento', 'trauma']
  tasks_prescribed TEXT[],  -- enviadas ao portal do paciente
  next_session_goals TEXT,
  edited_at        TIMESTAMPTZ, -- apenas se editado dentro de 24h
  created_at       TIMESTAMPTZ DEFAULT now()
  -- SEM updated_at — imutabilidade garantida pelo trigger abaixo
);

-- Trigger: bloqueia edição após 24h (CFP 001/2009)
CREATE OR REPLACE FUNCTION enforce_note_immutability()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.created_at < now() - INTERVAL '24 hours' THEN
    RAISE EXCEPTION 'Nota clínica imutável após 24h (Resolução CFP 001/2009)';
  END IF;
  NEW.edited_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER note_immutability_guard
  BEFORE UPDATE ON session_notes
  FOR EACH ROW EXECUTE FUNCTION enforce_note_immutability();

-- ════════════════════════════════════════
-- PAGAMENTOS
-- ════════════════════════════════════════
CREATE TABLE payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       UUID REFERENCES sessions(id),
  patient_id       UUID REFERENCES patients(id) NOT NULL,
  psychologist_id  UUID REFERENCES psychologists(id) NOT NULL,
  amount           NUMERIC(10,2) NOT NULL,
  status           TEXT DEFAULT 'pending'
                     CHECK (status IN ('pending', 'paid', 'overdue', 'waived', 'refunded')),
  billing_type     TEXT CHECK (billing_type IN ('per_session', 'weekly', 'monthly')),
  payment_method   TEXT CHECK (payment_method IN ('pix', 'boleto', 'card', 'manual', 'insurance')),
  pagarme_order_id TEXT,
  pix_qr_code      TEXT,
  pix_expires_at   TIMESTAMPTZ,
  paid_at          TIMESTAMPTZ,
  receipt_url      TEXT,
  period_start     DATE, -- para cobranças semanais/mensais
  period_end       DATE,
  reminder_count   INTEGER DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  waiver_reason    TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- ════════════════════════════════════════
-- SCORES DE ABANDONO
-- ════════════════════════════════════════
CREATE TABLE abandonment_scores (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  psychologist_id  UUID REFERENCES psychologists(id) NOT NULL,
  score            NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  level            TEXT CHECK (level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  factors          JSONB NOT NULL, -- { absence_rate: 35, days_since_last: 20, ... }
  calculated_at    TIMESTAMPTZ DEFAULT now(),
  alerted_at       TIMESTAMPTZ,
  dismissed_at     TIMESTAMPTZ,
  dismissed_reason TEXT
);

CREATE INDEX idx_scores_psychologist_active
  ON abandonment_scores(psychologist_id, level, calculated_at DESC)
  WHERE dismissed_at IS NULL;

-- ════════════════════════════════════════
-- ANÁLISES DE LINHAGEM (IA)
-- ════════════════════════════════════════
CREATE TABLE lineage_analyses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id  UUID REFERENCES psychologists(id) ON DELETE CASCADE NOT NULL,
  period_start     DATE NOT NULL,
  period_end       DATE NOT NULL,
  primary_approach TEXT,   -- 'TCC', 'Psicanálise', 'Humanista', etc.
  approach_scores  JSONB,  -- { 'TCC': 68, 'Humanista': 32, ... }
  top_techniques   JSONB,  -- [{ name: 'Reestruturação cognitiva', count: 14 }, ...]
  themes_map       JSONB,  -- { 'ansiedade': { approach: 'TCC', sessions: 8 }, ... }
  sessions_analyzed INTEGER,
  confidence       NUMERIC(5,2),
  model_used       TEXT DEFAULT 'claude-haiku-4-5',
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ════════════════════════════════════════
-- AUDIT LOG (imutável)
-- ════════════════════════════════════════
CREATE TABLE audit_log (
  id               BIGSERIAL PRIMARY KEY,
  psychologist_id  UUID REFERENCES psychologists(id),
  action           TEXT NOT NULL, -- 'VIEW_NOTE', 'EXPORT_PRONTUARIO', 'UPDATE_PATIENT', etc.
  resource_type    TEXT NOT NULL,
  resource_id      UUID,
  ip_address       INET,
  user_agent       TEXT,
  metadata         JSONB,
  created_at       TIMESTAMPTZ DEFAULT now()
);
-- Nenhum UPDATE ou DELETE permitido nesta tabela
-- RLS: psicólogo só vê seus próprios logs

-- ════════════════════════════════════════
-- ASSINATURAS
-- ════════════════════════════════════════
CREATE TABLE subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id     UUID REFERENCES psychologists(id) UNIQUE NOT NULL,
  plan                TEXT NOT NULL CHECK (plan IN ('trial', 'solo', 'clinico', 'pro')),
  status              TEXT DEFAULT 'active'
                        CHECK (status IN ('active', 'cancelled', 'past_due', 'paused')),
  pagarme_sub_id      TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end  TIMESTAMPTZ,
  cancel_at           TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (aplicada em TODAS as tabelas)

```sql
-- Template aplicado em todas as tabelas com psychologist_id:
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "{table}_isolation"
ON {table}
USING (psychologist_id = auth.uid());

-- Audit log: append-only (sem UPDATE, sem DELETE)
CREATE POLICY "audit_log_insert_only"
ON audit_log FOR INSERT
WITH CHECK (psychologist_id = auth.uid());

CREATE POLICY "audit_log_view_own"
ON audit_log FOR SELECT
USING (psychologist_id = auth.uid());
-- Sem UPDATE policy, sem DELETE policy = imutabilidade garantida
```

---

## 4. Estrutura de Pastas (Next.js)

```
vinculo/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Sidebar + header
│   │   │   ├── page.tsx            # Dashboard principal
│   │   │   ├── agenda/
│   │   │   │   ├── page.tsx        # Visão semanal
│   │   │   │   └── [date]/page.tsx # Visão diária
│   │   │   ├── pacientes/
│   │   │   │   ├── page.tsx        # Lista
│   │   │   │   ├── novo/page.tsx   # Cadastro
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx         # Perfil
│   │   │   │       ├── prontuario/      # Histórico de notas
│   │   │   │       └── financeiro/      # Pagamentos
│   │   │   ├── alertas/page.tsx    # Central de alertas
│   │   │   ├── financeiro/page.tsx # Dashboard financeiro
│   │   │   ├── linhagem/page.tsx   # IA de linhagem
│   │   │   └── configuracoes/
│   │   │       ├── perfil/
│   │   │       ├── agenda/
│   │   │       └── cobranca/
│   │   │
│   │   ├── (public)/
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── precos/page.tsx
│   │   │   └── blog/
│   │   │
│   │   └── api/
│   │       ├── webhooks/
│   │       │   ├── pagarme/route.ts    # Pagamento confirmado
│   │       │   └── zapi/route.ts       # Resposta WhatsApp
│   │       └── ai/
│   │           └── lineage/route.ts    # Proxy para Anthropic API
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui base components
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── agenda/
│   │   │   ├── week-view.tsx
│   │   │   ├── session-card.tsx
│   │   │   └── session-form.tsx
│   │   ├── pacientes/
│   │   │   ├── patient-card.tsx
│   │   │   ├── patient-form.tsx
│   │   │   └── consent-modal.tsx
│   │   ├── prontuario/
│   │   │   ├── note-editor.tsx     # Editor com encrypt/decrypt
│   │   │   ├── note-timeline.tsx
│   │   │   └── export-pdf.tsx
│   │   ├── alertas/
│   │   │   ├── abandonment-alert.tsx
│   │   │   ├── risk-badge.tsx
│   │   │   └── alert-detail.tsx
│   │   ├── financeiro/
│   │   │   ├── revenue-chart.tsx
│   │   │   ├── payment-card.tsx
│   │   │   └── invoice-generator.tsx
│   │   └── linhagem/
│   │       ├── approach-chart.tsx
│   │       ├── technique-cloud.tsx
│   │       └── insight-card.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client (singleton)
│   │   │   └── server.ts           # Server client (SSR)
│   │   ├── crypto.ts               # AES-256-GCM encrypt/decrypt
│   │   ├── risk-engine.ts          # Cálculo de score de abandono
│   │   ├── lineage-analyzer.ts     # Proxy para Claude Haiku
│   │   ├── google-calendar.ts      # Google Calendar OAuth + sync
│   │   ├── pagarme.ts              # PIX + boleto + webhooks
│   │   ├── zapi.ts                 # WhatsApp messages
│   │   └── pdf-generator.ts        # Exportação de prontuário
│   │
│   ├── hooks/
│   │   ├── use-patients.ts
│   │   ├── use-sessions.ts
│   │   ├── use-abandonment-alerts.ts
│   │   └── use-lineage.ts
│   │
│   └── types/
│       └── database.types.ts       # Gerado: `supabase gen types typescript`
│
├── supabase/
│   ├── migrations/                 # Versionamento do schema
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_triggers.sql
│   └── functions/                  # Edge functions
│       ├── daily-abandonment-score/
│       ├── weekly-financial-report/
│       └── monthly-billing/
│
├── public/
│   ├── fonts/                      # Inter (se self-hosted)
│   └── images/
│       └── logo/                   # SVG variants do logo Vínculo
│
├── tailwind.config.ts              # Tokens de marca aplicados
├── next.config.ts
└── package.json
```

---

## 5. Fluxo de Autenticação e Segurança

```
1. Psicólogo faz login (email + senha)
2. Supabase Auth retorna JWT (válido 1h, refresh token 7 dias)
3. Cliente deriva chave de criptografia da senha (PBKDF2, 100k iterations)
   → chave armazenada APENAS na memória da sessão (não no localStorage)
4. Toda nota clínica é criptografada/descriptografada no browser
5. Servidor recebe e armazena apenas ciphertext
6. No logout: chave destruída da memória → notas ilegíveis no servidor
```

### Considerações de Segurança
- Senha esquecida → usuário perde acesso às notas antigas (chave derivada da senha)
- **Solução:** no onboarding, gerar frase de recuperação de 12 palavras (BIP-39) que o psicólogo anota
- Alternativa mais simples para MVP: criptografia server-side (RLS) + comunicar limitação → migrar para client-side em v1.5

---

## 6. Integrações

### Google Calendar
```typescript
// OAuth 2.0 flow
// Scopes: calendar.events (read/write)
// Sync:
//   - Criar evento ao agendar sessão
//   - Atualizar ao reagendar
//   - Cancelar evento ao cancelar sessão
//   - Import: buscar eventos existentes no onboarding
```

### Z-API (WhatsApp)
```typescript
// Mensagens enviadas:
// 1. Confirmação de sessão (48h antes)
// 2. Lembrete final (2h antes — se não confirmou)
// 3. Link PIX após sessão realizada
// 4. Lembrete de pagamento (1x, 24h após envio do PIX)
// 5. Check-in de alerta de abandono (quando psicólogo aciona)
```

### Pagar.me
```typescript
// Fluxo PIX:
// 1. Sessão → status "completed"
// 2. Edge function cria ordem no Pagar.me
// 3. QR Code/link PIX retornado
// 4. Enviado via Z-API para paciente
// 5. Webhook Pagar.me → atualiza payment status → emite recibo
```

### Anthropic API (Claude Haiku)
```typescript
// Chamada após nota clínica ser marcada como finalizada (>24h)
// Rota: POST /api/ai/lineage
// Custo estimado: ~$0,001 por análise (< R$0,01)
// Rate limit: 1 análise por sessão, 1 compilação semanal por psicólogo
// Timeout: 10s — se falhar, analisar na próxima tentativa (graceful)
```

---

## 7. Performance e Escalabilidade

### Estratégia de Cache
```typescript
// Next.js Route Handlers com revalidation:
// - Lista de pacientes: revalidar a cada 60s (SWR)
// - Dashboard financeiro: revalidar a cada 5min
// - Alertas: real-time via Supabase Realtime

// Supabase:
// - Índices em todas as colunas de filtro comum (psychologist_id, status, scheduled_at)
// - Pg_cron para jobs pesados (não Edge Functions para evitar cold start)
```

### Estimativa de Carga (por psicólogo)
```
Sessões/mês:     ~80 (20 pacientes × 4 semanas)
Notas/mês:       ~80 (1 por sessão)
Pagamentos/mês:  ~80
Storage notas:   ~800KB/mês (10KB/nota criptografada)
Análises IA/mês: ~4 (compilação semanal)
WhatsApp msgs:   ~240 (confirmação + lembrete + PIX × 80)
```

### Custo de Infra (estimativa por fase)
| Clientes | Supabase | Vercel | Z-API | Anthropic | **Total/mês** |
|---------|---------|--------|-------|-----------|--------------|
| 0–50 | R$125 | R$100 | R$80 | R$20 | **~R$325** |
| 50–200 | R$250 | R$100 | R$200 | R$80 | **~R$630** |
| 200–500 | R$500 | R$200 | R$400 | R$200 | **~R$1.300** |
| 500–1000 | R$1.200 | R$400 | R$800 | R$500 | **~R$2.900** |

**Margem bruta esperada: >85%** em todas as fases

---

## 8. Decisões Arquiteturais Documentadas

| Decisão | Escolha | Alternativa Descartada | Motivo |
|---------|---------|----------------------|--------|
| Banco de dados | Supabase (PostgreSQL) | Firebase | RLS nativo resolve LGPD; SQL familiar; triggers para imutabilidade |
| Criptografia | AES-256-GCM client-side | Criptografia server-side | Máxima privacidade; nem o servidor lê notas |
| WhatsApp | Z-API | Twilio | Z-API mais simples para BR, documentação PT, menor custo |
| Pagamentos | Pagar.me | Stripe | PIX nativo BR, melhor suporte, menor custo transação |
| IA | Claude Haiku (Anthropic) | GPT-4o-mini | Melhor raciocínio por custo, suporte a PT-BR, LGPD-friendly |
| Deploy | Vercel | AWS/GCP | Zero config com Next.js, edge network global, preço previsível |
| Videochamada | **Fora do escopo MVP** | Daily.co, Whereby | Psicólogo já usa Zoom/Meet; complexidade desnecessária no MVP |

---

*Arquitetura v1.0 — Vínculo | @architect (Aria)*
