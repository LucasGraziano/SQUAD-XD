---
date: 2026-04-09
project: Vínculo (psi-saas)
session: Sprint de gaps — auth, compliance, email, UX, intake
status: DONE
---

# Checkpoint — Sprint de Gaps do Vínculo

## O que foi implementado

### Auth (flows corrigidos)
- `src/app/auth/reset-password/page.tsx` — página de redefinição de senha (faltava, forgot-password redirecionava para o vazio)
  - Detecta sessão ativa após link do email
  - Chama `supabase.auth.updateUser({ password })`
  - Feedback de erro se link expirado, sucesso e redirect ao concluir

### Compliance — LGPD
- `src/lib/validations.ts` — `registerSchema` ganhou campo `termsAccepted: z.boolean().refine(v => v === true)`
- `src/app/(auth)/register/page.tsx` — checkbox explícito "Li e concordo com os Termos de Uso e a Política de Privacidade, incluindo o tratamento dos dados dos meus pacientes como operador conforme a LGPD"
  - Componente `TermsCheckbox` controlado (React state + RHF)
  - Mensagem de erro animada se não marcado

### Email transacional
- `src/lib/email.ts` — `sendTrialExpiringEmail(to, name, daysLeft)` adicionado
- `src/app/api/cron/trial-expiry/route.ts` — cron que busca subscriptions com `status = 'trial'` expirando em 3 dias e envia o email
- `vercel.json` — terceiro cron adicionado: `0 12 * * *` (09h BRT)

### UX / Error handling
- `src/app/(dashboard)/error.tsx` — Error Boundary do dashboard (botão "Tentar novamente")
- `src/app/(dashboard)/loading.tsx` — Skeleton loading animado para todas as páginas do dashboard (stats, sessões, ações)

### Intake link público
- `src/app/intake/[token]/page.tsx` — formulário público para o paciente preencher os próprios dados (nome, email, phone, birth_date, observações)
- `src/app/api/intake/generate/route.ts` — gera token único (48 bytes hex, validade 7 dias)
- `src/app/api/intake/submit/route.ts` — valida token + cria patient + marca token como used
- `supabase/migrations/004_intake_tokens.sql` — tabela `intake_tokens` com RLS
- `src/app/(dashboard)/pacientes/patients-client.tsx` — botão "Link de cadastro" na toolbar que gera e exibe URL copiável
- `src/app/robots.ts` — `/intake` bloqueado para indexação

## Tabela resumo de todos os gaps implementados (2 sessões)

| Item | Status |
|------|--------|
| Subscription gate (/planos) | ✅ |
| WhatsApp reminders cron | ✅ |
| Score recalculate cron | ✅ |
| Landing page rewrite (Conclave experts) | ✅ |
| Termos + Privacidade | ✅ |
| OG tags + sitemap + robots + 404 | ✅ |
| Dashboard empty state (GettingStarted) | ✅ |
| Email transacional (welcome + abandonment) | ✅ |
| Reset password page | ✅ |
| Checkbox de termos no register | ✅ |
| Email "trial expirando em 3 dias" | ✅ |
| Error boundary + Loading skeleton | ✅ |
| Intake link público para pacientes | ✅ |

## Pendente para próxima sessão
- `supabase db push` para aplicar migration 004
- `npm install` para instalar `resend`
- Pagar.me (billing real) — Epic 5
- Google Calendar sync — Epic 5
- Sessões recorrentes — agenda-client.tsx
- og-image.png (1200×630) para OG tags
- Configurar RESEND_API_KEY + CRON_SECRET no Vercel
