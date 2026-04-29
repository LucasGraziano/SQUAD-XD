# Decisões Técnicas — Stack e Arquitetura

**Data:** Abril 2026  
**Status:** Decisão — não renegociar sem motivo técnico sólido

---

## Stack Principal

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| **Frontend** | Next.js 14 (App Router) | SSR para SEO landing page + SPA para app; TypeScript nativo |
| **Banco de dados** | Supabase (PostgreSQL) | RLS nativo resolve LGPD; auth incluído; storage para PDFs; real-time para notificações |
| **Autenticação** | Supabase Auth | Magic link + email/senha; sem complexidade extra |
| **Pagamentos** | Pagar.me | PIX nativo BR; boleto; split de pagamento (para marketplace v4) |
| **Estilização** | Tailwind CSS + shadcn/ui | Velocidade de desenvolvimento; design system pronto |
| **Deploy** | Vercel | DX excelente com Next.js; edge functions; domínio .com.br fácil |
| **WhatsApp** | Twilio (WhatsApp Business API) ou Z-API | Lembretes, cobranças, check-ins |
| **Email** | Resend | API simples, boa deliverability, template com React |
| **Background Jobs** | Supabase Edge Functions + cron | Score de abandono calculado diariamente |
| **Armazenamento** | Supabase Storage | PDFs de prontuário + documentos; bucket privado por psicólogo |

---

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (Browser/PWA)             │
│                    Next.js App Router               │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / WSS
┌──────────────────────▼──────────────────────────────┐
│                  SUPABASE                           │
│  ┌──────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │  PostgreSQL  │  │   Auth      │  │  Storage  │  │
│  │  + RLS       │  │   (JWT)     │  │  (PDFs)   │  │
│  └──────────────┘  └─────────────┘  └───────────┘  │
│  ┌──────────────┐  ┌─────────────┐                 │
│  │  Real-time   │  │    Edge     │                 │
│  │  (notifs)    │  │  Functions  │                 │
│  └──────────────┘  └──────┬──────┘                 │
└─────────────────────────── │ ──────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐   ┌───────▼──────┐   ┌──────▼──────┐
   │  Pagar.me   │   │    Twilio    │   │   Resend    │
   │  (PIX/blt)  │   │  (WhatsApp)  │   │   (Email)   │
   └─────────────┘   └──────────────┘   └─────────────┘
```

---

## Segurança e LGPD

### Row Level Security (Supabase)
```sql
-- Psicólogo só vê seus próprios dados
-- Aplicado em TODAS as tabelas com psychologist_id

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandonment_scores ENABLE ROW LEVEL SECURITY;

-- Policy padrão (replicar em todas as tabelas)
CREATE POLICY "isolation_by_psychologist"
ON {table}
USING (psychologist_id = auth.uid());
```

### Criptografia de Dados Clínicos
```typescript
// lib/crypto.ts
// Conteúdo das sessões criptografado no cliente antes de enviar
// Chave derivada da senha do usuário (PBKDF2) — nem o servidor acessa

import { subtle } from 'crypto';

export async function encryptNote(content: string, userKey: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(content);
  
  const encrypted = await subtle.encrypt(
    { name: 'AES-GCM', iv },
    userKey,
    encoded
  );
  
  // Retorna: base64(iv) + '.' + base64(encrypted)
  return `${btoa(String.fromCharCode(...iv))}.${btoa(String.fromCharCode(...new Uint8Array(encrypted)))}`;
}
```

### Localizaçao dos Dados
- **Supabase região: South America (São Paulo)** — dados dentro do Brasil (LGPD recomenda)
- Backups automáticos: diários, retidos por 30 dias

---

## Estrutura de Pastas (Next.js)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── pacientes/
│   │   │   ├── page.tsx          # Lista de pacientes
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Perfil do paciente
│   │   │       └── prontuario/   # Histórico
│   │   ├── agenda/
│   │   ├── financeiro/
│   │   └── alertas/
│   └── api/
│       ├── webhooks/             # Pagar.me + Twilio webhooks
│       └── cron/                 # Background jobs (Edge Functions)
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── agenda/
│   ├── prontuario/
│   ├── cobranca/
│   └── alertas/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── crypto.ts
│   ├── risk-engine.ts            # Cálculo de risco de abandono
│   ├── whatsapp.ts
│   └── pagarme.ts
└── types/
    └── database.types.ts         # Gerado pelo Supabase CLI
```

---

## Custo de Infra

| Fase | Usuários | Custo/mês |
|------|---------|-----------|
| Beta | 0–50 | ~R$ 300–500 |
| Growth | 50–300 | ~R$ 600–1.200 |
| Escala | 300–1000 | ~R$ 1.500–3.500 |
| Marketplace | 1000+ | ~R$ 4.000–8.000 |

*Margem bruta esperada: >80% em todas as fases — SaaS com boa margem estrutural*

---

## Alternativa No-Code (se Lucas travar no técnico)

Se a implementação Next.js + Supabase demorar > 8 semanas:

| Camada | Alternativa |
|--------|------------|
| Frontend + BDD | Bubble.io |
| Automações | N8N (Lucas já conhece!) |
| WhatsApp | ManyChat / UChat (Lucas já conhece!) |
| Pagamentos | Pagar.me via webhook → N8N |

**Vantagem:** Lucas já conhece N8N, ManyChat, UChat — pode fazer MVP funcional em 2–3 semanas  
**Desvantagem:** Escalabilidade limitada, custo Bubble cresce com usuários, vendor lock-in  
**Decisão:** Se travar em 4 semanas no Next.js, pivotar para no-code sem drama

---

## Decisões Postergadas (não decidir agora)

- [ ] App nativo (iOS/Android) — PWA primeiro, nativo apenas após PMF
- [ ] IA clínica avançada — pós PMF, quando tiver dados suficientes para treinar
- [ ] Multi-idioma — português primeiro; espanhol apenas na expansão LATAM
- [ ] Integração com planos de saúde — complexidade regulatória alta, postergar
