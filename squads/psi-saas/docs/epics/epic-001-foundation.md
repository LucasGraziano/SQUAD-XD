# Epic 001 — Foundation & Core Infrastructure

**Produto:** Vínculo  
**Agente:** @sm (River)  
**Status:** Ready  
**Prioridade:** P0 — Bloqueante para todos os outros épicos

---

## Objetivo
Estabelecer a base técnica completa do produto: autenticação, banco de dados, estrutura do projeto, design system e onboarding do psicólogo.

---

## Stories

### Story 1.1 — Project Scaffold + Design System
**Como** desenvolvedor, **quero** inicializar o projeto Next.js com todas as dependências e o design system Vínculo configurado, **para que** todas as features subsequentes usem a base visual e técnica correta.

**Critérios de Aceite:**
- [ ] `create-next-app` com TypeScript, App Router, Tailwind
- [ ] shadcn/ui instalado e configurado
- [ ] `tailwind.config.ts` com tokens de marca Vínculo (cores, fontes, border-radius, shadows)
- [ ] Fontes DM Serif Display + Inter via Google Fonts
- [ ] Supabase client configurado (browser + server)
- [ ] Variáveis de ambiente documentadas em `.env.local.example`
- [ ] Estrutura de pastas conforme `architecture.md`
- [ ] Vercel project criado e deploy automático funcionando

**Estimativa:** 4h

---

### Story 1.2 — Autenticação e Cadastro do Psicólogo
**Como** psicólogo, **quero** criar minha conta e fazer login com segurança, **para que** meus dados clínicos estejam protegidos.

**Critérios de Aceite:**
- [ ] Página de cadastro: nome completo, CRP, email, senha, cidade, especialidade
- [ ] Validação de CRP no formato correto (XX/XXXXXX)
- [ ] Página de login com email + senha
- [ ] Magic link como alternativa (Supabase Auth)
- [ ] Row Level Security ativo em todas as tabelas
- [ ] Redirect para onboarding após primeiro login
- [ ] Sessão persistida (refresh token 7 dias)
- [ ] Página de recuperação de senha

**Estimativa:** 6h

---

### Story 1.3 — Onboarding Guiado (3 passos)
**Como** psicólogo novo, **quero** configurar meu consultório em 3 passos simples, **para que** eu comece a usar o produto em menos de 10 minutos.

**Critérios de Aceite:**
- [ ] Passo 1: Horários de atendimento (dias da semana + horário início/fim)
- [ ] Passo 2: Valor padrão por sessão + moeda + ciclo de cobrança padrão
- [ ] Passo 3: Conectar WhatsApp via Z-API (instrução + QR Code) — **opcional, pode pular**
- [ ] Barra de progresso visual (1/3 → 2/3 → 3/3)
- [ ] Botão "pular" disponível em cada passo
- [ ] Ao concluir: redirect para dashboard com mensagem de boas-vindas
- [ ] Estado de onboarding salvo (se fechar e voltar, continua do passo certo)

**Estimativa:** 5h

---

### Story 1.4 — Dashboard Principal
**Como** psicólogo, **quero** ver um resumo do meu dia ao abrir o sistema, **para que** eu saiba imediatamente o que precisa de atenção.

**Critérios de Aceite:**
- [ ] Saudação personalizada ("Bom dia, Dra. Ana")
- [ ] Agenda do dia (sessões em ordem cronológica)
- [ ] Painel "Atenção" com alertas de abandono ativos
- [ ] Resumo financeiro: recebido no mês, pendente
- [ ] Acesso rápido: botão "+ Registrar sessão"
- [ ] Mobile responsive (375px mínimo)
- [ ] Loading skeleton enquanto carrega dados

**Estimativa:** 5h

---

## Dependências
- Supabase project criado ✓ (configurar antes de iniciar)
- Vercel account ✓
- Z-API conta criada (necessário para Story 1.3)

## Definition of Done do Épico
- [ ] Todas as stories implementadas e em status Done
- [ ] Deploy em produção funcionando
- [ ] RLS testado: psicólogo A não vê dados do psicólogo B
- [ ] Onboarding testado com usuário real (namorada/irmã)
