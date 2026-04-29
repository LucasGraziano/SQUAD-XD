---
date: 2026-04-09
project: Vínculo (psi-saas)
session: Pipeline completa — Subscription, Landing, Legal, Infra, UX
status: DONE
---

# Checkpoint — Vínculo Pipeline Completa

## O que foi construído nesta sessão

### Epic 1 — Subscription Gate
- `src/lib/subscription.ts` — corrigido bug TypeScript de discriminated union (`active: true as const`)
- `src/app/(dashboard)/planos/page.tsx` + `planos-client.tsx` — página de planos com 3 tiers (Solo R$79, Clínico R$149, Pro R$249)
- `src/components/layout/sidebar.tsx` — link "Plano" com ícone Gem adicionado
- `src/app/(dashboard)/layout.tsx` — subscription gate: redireciona para /planos quando trial expirado
- `src/middleware.ts` — `x-pathname` header + `/planos` nos protectedPrefixes

### Epic 2 — Auto-payment & WhatsApp
- `src/app/(dashboard)/agenda/agenda-client.tsx` — auto-cria pagamento e dispara WhatsApp quando sessão marcada como 'completed'
- `src/app/api/cron/whatsapp-reminders/route.ts` — cron de lembretes 48h e 2h antes (protegido por CRON_SECRET)
- `vercel.json` — cron whatsapp `*/30 * * * *` + cron score diário `0 11 * * *` (08h BRT)

### Epic 3 — Landing Page (rewrite completo via Conclave experts)
- `src/app/(public)/page.tsx` — rewrite completo com Big Idea, PainInstaller, BeforeAfter, FAQ (6 perguntas), FinalCTA
- Experts consultados: Hard Copy (Kinshu/MPV), Jim Edwards (FRED/PASTOR), Agora Inc (Big Idea/4Ps), Doug (Tensão/PMN)
- Headline: "Seu paciente dá 7 sinais antes de abandonar a terapia. Nenhum sistema detectava isso."

### Epic 4 — Páginas Legais
- `src/app/(public)/termos/page.tsx` — Termos de Uso com 8 seções (LGPD, CFP Res. 001/2009, cancelamento, etc.)
- `src/app/(public)/privacidade/page.tsx` — Política de Privacidade com 7 seções (operador de dados, AES-256-GCM, LGPD)

### Infraestrutura & SEO
- `src/app/(public)/layout.tsx` — metadata completa com OG tags, Twitter Card, robots
- `src/app/sitemap.ts` — sitemap com 5 URLs públicas
- `src/app/robots.ts` — robots.txt bloqueando `/dashboard`, `/api/`, etc.
- `src/app/not-found.tsx` — 404 branded com link de volta ao início
- `vercel.json` — dual cron configurado

### Dashboard UX
- `src/app/(dashboard)/dashboard/dashboard-client.tsx` — empty state `GettingStarted` com 3 passos quando `totalPatients === 0`

### Email Transacional (Resend)
- `src/lib/email.ts` — `sendWelcomeEmail` + `sendAbandonmentAlertEmail`
- `src/app/auth/callback/route.ts` — dispara welcome email em novos cadastros (count === 0)
- `package.json` — `resend ^4.0.0` adicionado como dependência

## Variáveis de ambiente necessárias (produção)
```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@vinculo.app
CRON_SECRET=<random-string>
NEXT_PUBLIC_APP_URL=https://vinculo.app
```

## Stack atual
- Next.js 14 App Router + TypeScript strict
- Supabase (`pnsopiqtlflsqsaigxnm`) — PostgreSQL + RLS + SSR
- Framer Motion (Reveal, StaggerGroup, AnimatedCounter, ShimmerText, FloatingShape)
- Tailwind CSS com design tokens do Vínculo (brand-teal, brand-sand, brand-gold)
- Z-API (WhatsApp), Resend (Email), Vercel Cron

## Próximos passos sugeridos
1. `npm install` para instalar `resend`
2. Criar og-image.png (1200×630) para OG tags
3. Configurar RESEND_API_KEY no Vercel para produção
4. Pagar.me integration (billing real) — Epic 5 pendente
5. Google Calendar sync — Epic 5 pendente
6. Deploy para produção
