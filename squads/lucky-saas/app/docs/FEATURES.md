# Premia SaaS — Inventário de Funcionalidades

**Gerado em:** 2026-05-18  
**Gerado por:** @sm (River)  
**Status do produto:** MVP completo + features de crescimento implementadas  
**Total de stories entregues:** 35+

---

## Resumo Executivo

O Premia é um CRM de seguros B2B para corretores SUSEP. Neste momento, o produto tem:

- **CRM completo** de clientes, apólices, propostas, sinistros e comissões
- **Automações** de alertas, e-mails de renovação e notificações push
- **Portal do cliente** self-service com white-label
- **Billing self-serve** com Stripe (trial 14d, upgrade, cancelamento, portal)
- **Programa de referral** com trial estendido (21d) para indicados
- **Google Calendar** sync de vencimentos
- **PWA** instalável no mobile com push notifications
- **IA** para extração de dados de apólices via PDF (Groq)
- **Importação em massa** via CSV com mapeamento automático
- **Relatórios avançados** com forecast de comissões

---

## Módulos e Funcionalidades

### 1. Autenticação & Onboarding

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Signup com email/senha | — | Todos | Supabase Auth |
| Trial gratuito 14 dias | 0.4 | — | Padrão para novos signups |
| Trial estendido 21 dias para indicados | 6.7 | — | Cookie de referral detectado no signup |
| Banner "Você foi indicado" na tela de signup | 6.7 | — | Quando cookie `premia_referral` presente |
| Onboarding checklist gamificado (5 passos) | 7.1 | Todos | Progress bar, celebração ao completar |
| "First Win" notification (primeiro alerta disparado) | 7.9 | Todos | Toast de celebração + badge |
| Formulário de perfil do corretor (nome, CRECI, SUSEP, telefone, logo) | 5.2b | Todos | Em `/configuracoes` |

---

### 2. Dashboard Principal

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| KPIs: apólices ativas, a vencer 30d, sinistros abertos, pendências vencidas | — | Todos | Cards no topo |
| Widget "Previsão de Comissão 30 dias" | 5.12 | Pro+ | Card de destaque |
| Contador de propostas em análise | 5.13 | Todos | Badge/card |
| Central de alertas (vencimentos, pendências) | — | Todos | Módulo `/alertas` |
| Empty states com CTA guiado | 7.10 | Todos | Orientação para novos usuários |
| Banner de onboarding checklist (até completar 5 passos) | 7.1 | Todos | Desaparece após completar/dispensar |
| Toast "First Win" (primeiro alerta disparado) | 7.9 | Todos | Aparece só uma vez |

---

### 3. Gestão de Clientes

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| CRUD de clientes (nome, CPF/CNPJ, telefone, email, endereço) | — | Todos | `/clientes` |
| Perfil completo do cliente com apólices ativas | — | Todos | `/clientes/[id]` |
| Histórico de renovações por cliente | 7.13 | Todos | Aba no perfil do cliente, cadeia de renovações |
| Pipeline de leads (Kanban) | — | Todos | Gestão de prospecção |
| Criar cotação direto do card do lead | 7.6 | Todos | Ação no Kanban |
| Notificação de aniversário + sugestão de cross-sell | 7.15 | Todos | Alerta automático no dia do aniversário |
| Filtro de clientes sem determinado ramo de seguro (cross-sell) | 7.12 | Todos | Lista "Clientes sem Seguro Auto" |

---

### 4. Gestão de Apólices

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| CRUD de apólices (todos os ramos) | — | Todos | `/apolices` |
| Campos por ramo (auto: placa, chassi; vida: beneficiário; etc.) | — | Todos | `metadata` JSON |
| Importação de PDF via IA (Groq + unpdf) | 2.3 | Todos | Preenche campos automaticamente, badges "✦ IA" |
| Importação em massa via CSV | 5.15 / 7.2 | Todos | Upload, preview, validação, relatório de erros |
| Template CSV para download | 5.15 | Todos | Com colunas obrigatórias e opcionais |
| Converter proposta aprovada → apólice (1 clique) | 7.4 | Todos | Dados pré-preenchidos da proposta |
| Renovar apólice com 1 clique (gera proposta de renovação) | 7.5 | Todos | Link de renovação entre apólices |
| Status flow das propostas | 7.3 | Todos | `rascunho → enviada → em_analise → emitida/recusada` |
| Controle de pendências por apólice | 5.11 | Todos | Aba "Pendências", alertas de prazo |
| Upload de documentos (laudos, fotos) via Supabase Storage | 5.3 | Pro+ | Associado a sinistros |
| Filtro "com pendências abertas" | 5.11 | Todos | Na listagem de apólices |

---

### 5. Propostas Comerciais

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Criação de proposta vinculada a cliente + apólice | 5.13 | Todos | `/propostas` |
| Status flow da proposta (rascunho → emitida/recusada) | 5.13 | Todos | Com histórico de status |
| PDF de proposta individual | 5.2 | Pro+ | Template profissional com marca do corretor |
| SUSEP no header do PDF | 5.2b | Pro+ | Abaixo do nome da corretora |
| Validade configurável do PDF (7/15/30 dias) | 5.2b | Pro+ | Dropdown na geração |
| Histórico de versões de proposta | 7.7 | Todos | Versionamento ao editar |
| Link de proposta enviável ao cliente (sem login) | 7.8 | Todos | URL pública, read-only |
| Multicálculo manual (multi-seguradora) | 5.9 | Pro+ | `/cotacoes`, N seguradoras por cotação |
| PDF comparativo multi-seguradora | 5.9 | Pro+ | Destaque "RECOMENDADO", coberturas |
| Envio de proposta PDF por e-mail | 5.2b | Pro+ | Via Resend (requer RESEND_API_KEY configurada) |

---

### 6. Sinistros

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Abertura de sinistro vinculado à apólice | 5.3 | Pro+ | Campos: data, tipo, descrição, número processo, valor |
| Status tracking (Aberto → Em Análise → Aprovado → Pago) | 5.3 | Pro+ | Histórico com timestamps |
| Nota em cada mudança de status | 5.3 | Pro+ | Auditoria completa |
| Upload de documentos do sinistro | 5.3 | Pro+ | Laudos, fotos, BO — Supabase Storage |
| Contador de sinistros abertos no dashboard | 5.3 | Pro+ | Badge/card |
| Contatos de sinistro no portal do cliente | 5.8 | Pro+ | Telefone 24h e WhatsApp da seguradora |

---

### 7. Financeiro & Comissões

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Registro de comissão por apólice (% + valor) | — | Todos | Campo na apólice |
| Previsão de comissão 30/60/90 dias | 5.12 | Pro+ | Tabela + agrupamento por mês |
| Exportar previsão como CSV | 5.12 | Pro+ | Download direto |
| Extrato histórico de comissões | 5.17 | Pro+ | Aba no `/financeiro` |
| Marcar comissão como "Recebida" (com valor real e data) | 5.17 | Pro+ | Controle manual |
| Gráfico esperado vs recebido | 5.17 | Pro+ | Visual mensal |
| Exportar extrato como CSV | 5.17 | Pro+ | Download direto |

---

### 8. Relatórios & Análises

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Relatório de Carteira (apólices por status, evolução mensal) | 5.5 | Pro+ | Aba em `/relatorios` |
| Relatório de Comissões (realizado + forecast 3m) | 5.5 | Pro+ | Aba em `/relatorios` |
| Relatório de Retenção (taxa de renovação por ramo) | 5.5 | Pro+ | Aba em `/relatorios` |
| Relatório por Seguradora (ranking por prêmio/comissão) | 5.5 | Pro+ | Aba em `/relatorios` |
| Exportar CSV de cada relatório | 5.5 | Pro+ | — |
| Filtro de período (3m/6m/12m/personalizado) | 5.5 | Pro+ | — |
| Relatório de Desempenho Operacional | 5.16 | Pro+ | Taxa de emissão, tempo médio de fechamento, taxa de renovação, ticket médio |
| Comparação com período anterior | 5.16 | Pro+ | Ex: trimestre atual vs trimestre passado |
| Score de saúde da carteira | 7.11 | Pro+ | Indicador visual do nível de risco da carteira |
| Relatório de Carteira compartilhável (PDF de portfólio) | 7.14 | Pro+ | PDF profissional para captar clientes corporativos |

---

### 9. Portal do Cliente (White-Label)

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Geração de token de acesso único por cliente | 5.1 | Pro+ | Expiração configurável: 30/60/90d ou vitalício |
| Portal público em `/portal/[token]` (sem login) | 5.1 | Pro+ | Read-only |
| Exibe: apólices ativas, vigência, prêmio, alertas de vencimento | 5.1 | Pro+ | Mobile-first |
| Logo/nome da corretora no portal (white-label) | 5.1 | Pro+ | Identidade do corretor |
| Cards expandíveis com detalhes (coberturas, bem segurado, franquia) | 5.8 | Pro+ | Clique em "Ver detalhes" |
| Contatos de sinistro clicáveis (tel: e wa.me links) | 5.8 | Pro+ | Telefone 24h e WhatsApp da seguradora |
| Botão "Solicitar Renovação" por apólice | 5.8 | Pro+ | Cria alerta para o corretor, estado "Solicitado ✓" |
| Copiar link e compartilhar via WhatsApp | 5.1 | Pro+ | Botões na página do cliente |
| Revogar acesso do cliente | 5.1 | Pro+ | Invalida token imediatamente |

---

### 10. Automações & Alertas

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Alertas de vencimento de apólice (configurable: 30/60/90 dias antes) | — | Todos | Central de alertas `/alertas` |
| Alertas de pendências com prazo vencido | 5.11 | Todos | Badge vermelho no dashboard |
| E-mails automáticos de renovação (60/30/15 dias antes) | 5.14 | Pro+ | Via Resend, templates HTML responsivos |
| Personalização do texto de abertura do e-mail | 5.14 | Pro+ | Campo livre em `/configuracoes` |
| Log de disparos de e-mail | 5.14 | Pro+ | Histórico com status em `/configuracoes` |
| Opt-out LGPD para clientes | 5.14 | Pro+ | Link "Não quero mais receber" no e-mail |
| Push notifications nativas (PWA) | 6.6 | Todos | Vencimentos 24h antes, pendências vencidas |
| Deep link da notificação → abre na apólice/pendência correta | 6.6 | Todos | Via `data.url` no payload |
| Cross-sell automático (clientes sem ramo X) | 7.12 | Todos | Lista filtrada de oportunidades |

---

### 11. Google Calendar Sync

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| OAuth 2.0 com Google Calendar | 6.8 | Equipe | Botão em `/configuracoes` → Integrações |
| Criar eventos para apólices vencendo nos próximos 90 dias | 6.8 | Equipe | Evento 7 dias antes do vencimento |
| Sync automático diário (novas apólices + remoção de deletadas) | 6.8 | Equipe | Cron job via Vercel |
| Desconectar e remover todos os eventos do Premia | 6.8 | Equipe | Toggle em `/configuracoes` |

---

### 12. Billing & Planos

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Trial de 14 dias (padrão) | 0.4 | — | Badge de dias restantes no dashboard |
| Trial de 21 dias (indicados via referral) | 6.7 | — | Quando `premia_referral` cookie detectado |
| Stripe Checkout para upgrade (Solo → Pro, Solo → Equipe, Pro → Equipe) | 6.3/0.5 | — | Server Action `createCheckoutSession` |
| Stripe Billing Portal (trocar cartão, histórico de faturas) | 6.4/0.5 | Pro/Equipe | Server Action `createPortalSession` |
| Cancelar trial imediatamente | 0.5 | — | Modal de confirmação, zero cobrança |
| Cancelar assinatura no fim do período | 0.5 | Pro/Equipe | `cancel_at_period_end: true`, badge "Cancela em [data]" |
| Reativar assinatura cancelada | 0.5 | Pro/Equipe | Remove `cancel_at_period_end` |
| Webhook Stripe para lifecycle (ativo, vencido, falha de pagamento) | 6.4 | — | `/api/webhooks/stripe` |
| E-mail de falha de pagamento | 6.4 | — | Via Resend, link para gerenciar assinatura |
| PlanGate: bloqueio contextual com modal de upsell | 6.2 | — | Componente `<PlanGate>` reutilizável |
| Calculadora de ROI no modal de upsell | 6.2 | — | Demonstra custo/benefício do upgrade |

---

### 13. Programa de Referral

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Código de referral único por corretor | 6.7 | Todos | Gerado automaticamente no onboarding |
| Link rastreável `/ref/{code}` com cookie 30 dias | 6.7 | Todos | Redireciona para landing page |
| Seção "Indique e ganhe" no dashboard | 6.7 | Todos | Componente `ReferralSection` |
| Botão "Copiar link" (clipboard API) | 6.7 | Todos | — |
| Botão "Enviar pelo WhatsApp" (link pré-formatado) | 6.7 | Todos | `wa.me/?text=...` |
| Dashboard: total indicações / convertidas / créditos ganhos | 6.7 | Todos | Stats em tempo real |
| Crédito de 1 mês grátis quando indicado assina | 6.7 | Todos | Via Stripe `customer.balance`, cron diário |
| E-mail automático ao indicador quando indicado converte | 6.7 | Todos | Via Resend |

---

### 14. PWA & Mobile

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| `manifest.json` (instalável como app) | 6.6 | Todos | `display: standalone`, ícones 192/512px |
| Service Worker (cache-first para assets estáticos) | 6.6 | Todos | Funciona parcialmente offline |
| Push notifications nativas no celular | 6.6 | Todos | Web Push API + VAPID keys |
| Subscriptions de push em `push_subscriptions` | 6.6 | Todos | Endpoint + chaves por corretor |
| Toggle "Notificações push" em `/configuracoes` | 6.6 | Todos | Ativa/desativa |
| Sugestão "Adicionar à tela inicial" após 3 sessões | 6.6 | Todos | Banner dismissível |

---

### 15. Marketing & Landing Page

| Funcionalidade | Story | Plano | Detalhe |
|---|---|---|---|
| Landing page com Hero, Features, Pricing, FAQ | 0.4 | — | `/(marketing)/page.tsx` |
| Pricing: Solo R$47 / Pro R$97 / Equipe R$197 / Enterprise | 0.4 | — | Grid responsivo |
| Trial de 14 dias sem cartão (copy atual) | 0.4 | — | Badge de resultado quantificado |
| Calculadora de ROI interativa na landing page | 6.5 | — | Slider de carteira × comissão, output dinâmico |
| Evento analytics `roi_calculator_interacted` | 6.5 | — | PostHog |
| Página de Pricing dedicada (`/pricing`) | 6.3 | — | Com Stripe Checkout integrado |

---

## Requisitos de Infraestrutura

### Variáveis de Ambiente Obrigatórias

| Variável | Para que serve | Obrigatório? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Conexão com Supabase | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client público | Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin client (webhooks, crons) | Sim |
| `STRIPE_SECRET_KEY` | Billing — Checkout, Portal, Webhooks | Sim (billing) |
| `STRIPE_WEBHOOK_SECRET` | Validar eventos do Stripe | Sim (billing) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client | Sim (billing) |
| `STRIPE_PRO_PRICE_ID` | ID do preço Pro no Stripe | Sim (billing) |
| `STRIPE_BROKER_PRICE_ID` | ID do preço Equipe no Stripe | Sim (billing) |
| `NEXT_PUBLIC_APP_URL` | Redirects pós-checkout | Sim |
| `GROQ_API_KEY` | Extração de PDF via IA | Sim (IA) |
| `RESEND_API_KEY` | E-mails automáticos e de referral | Pro+ features |
| `RESEND_FROM_EMAIL` | Remetente dos e-mails | Com Resend |
| `GOOGLE_CLIENT_ID` | OAuth Google Calendar | Equipe plan |
| `GOOGLE_CLIENT_SECRET` | OAuth Google Calendar | Equipe plan |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Push notifications | PWA |
| `VAPID_PRIVATE_KEY` | Push notifications | PWA |
| `CRON_SECRET` | Autenticar cron jobs | Crons em produção |

### Serviços Externos

| Serviço | Uso | Tier gratuito |
|---|---|---|
| Supabase | DB, Auth, Storage, RLS | Sim |
| Stripe | Billing, Webhooks, Portal | Pago em produção |
| Groq | LLM para extração de PDF | 6.000 req/dia grátis |
| Resend | E-mails transacionais | 3.000 e-mails/mês grátis |
| Google Calendar API | OAuth + sync de eventos | Gratuito |
| Vercel | Hosting + Cron Jobs | Cron grátis no free tier |

---

## O Que NÃO Está Implementado (Backlog)

| Feature | Story | Prioridade | Blocker |
|---|---|---|---|
| E-mails automáticos granulares (Resend domain) | 5.4 | P2 | `RESEND_API_KEY` + domínio verificado |
| WhatsApp Z-API (mensagens diretas) | 5.7 | P3 | Análise custo/benefício pendente |
| Multicálculo via API de seguradoras | 5.10/6.10 | P3 | Viabilidade técnica pendente |
| ZapSign: assinatura digital de documentos | 6.1 | P2 | Story pronta para dev |
| WhatsApp API oficial (templates Meta) | 6.9 | P2 | Meta Business Account + aprovação |

---

## Planos e Restrições (PlanGate)

| Feature | Solo (R$47) | Pro (R$97) | Equipe (R$197) |
|---|---|---|---|
| Clientes e apólices | Até 100 | Ilimitado | Ilimitado |
| Usuários da conta | 1 | 1 | Múltiplos |
| Portal do cliente | Bloqueado | Incluído | Incluído |
| Sinistro tracking | Bloqueado | Incluído | Incluído |
| Proposta PDF | Bloqueado | Incluído | Incluído |
| Multicálculo | Bloqueado | Incluído | Incluído |
| Relatórios avançados + forecast | Bloqueado | Incluído | Incluído |
| Previsão de comissão | Bloqueado | Incluído | Incluído |
| E-mail automático de renovação | Bloqueado | Incluído | Incluído |
| Google Calendar sync | Bloqueado | Bloqueado | Incluído |
| Exportar CSV (relatórios) | Bloqueado | Incluído | Incluído |

---

*Inventário gerado por @sm (River) em 2026-05-18. Atualizar a cada sprint usando `*stories-index` via @po ou editando este documento diretamente.*
