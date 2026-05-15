# PRD — Premia: CRM de Seguros para Corretores SUSEP

**Versão:** 1.0 (retroativo)
**Data:** 2026-05-14
**Status:** Aprovado — Em produção
**Autor:** @pm (Morgan) + @master (Orion)
**Épicos cobertos:** 0, 2, 5, 6, 7

---

## 1. Visão do Produto

### 1.1 Problema

O corretor de seguros brasileiro opera em um vácuo tecnológico.

Com ~130.000 corretores habilitados pela SUSEP e uma carteira nacional estimada em R$ 300 bilhões em prêmios anuais, o setor é economicamente relevante — mas operacionalmente arcaico. A realidade de 80% dos corretores autônomos e pequenas agências:

- **Gestão de carteira via planilha Excel ou Google Sheets** — sem relacionamentos, sem alertas, sem histórico estruturado
- **Renovações perdidas por falta de acompanhamento** — estudos de mercado apontam 30–40% das apólices não sendo renovadas por ausência de follow-up proativo
- **WhatsApp como único CRM** — histórico de conversas como fonte primária de dados de clientes
- **Comissões não rastreadas** — sem visibilidade de quanto vai receber, quando e de qual seguradora
- **Zero cross-sell sistematizado** — oportunidades óbvias (cliente com auto mas sem vida) nunca abordadas
- **Sem portal para cliente** — cliente não sabe o status da própria apólice sem ligar para o corretor

Ferramentas genéricas (Pipedrive, HubSpot, Salesforce) não entendem seguro: não têm conceito de apólice, ramo, SUSEP, vigência, prêmio, comissão de angariação vs renovação. O corretor tem que "hackear" uma ferramenta de vendas para fazer ela funcionar como gestão de carteira — e sempre falha.

### 1.2 Solução

**Premia** é o primeiro CRM nativo para corretores de seguros do Brasil.

Não é um CRM genérico adaptado. É um sistema construído do zero para o fluxo de trabalho real do corretor: captação de leads → cotação multicálculo → proposta PDF → apólice → alerta de renovação → renovação 1 clique → cross-sell → fidelização.

### 1.3 Proposta de Valor Central

> *"O corretor top performer do Brasil já faz tudo isso — mas manualmente. O Premia faz automaticamente."*

- Nunca mais perder uma renovação por esquecimento
- Saber em tempo real quanto vai comissionar no mês
- Converter 100% das propostas aprovadas em apólice com 1 clique
- Ter portal profissional para o cliente — sem código, sem custo extra
- Identificar cross-sell em toda a carteira de forma automática

---

## 2. Contexto de Mercado

### 2.1 Tamanho do Mercado

| Segmento | Estimativa |
|----------|-----------|
| Corretores ativos SUSEP (PF + PJ) | ~130.000 |
| Corretoras com 1–10 funcionários | ~85.000 |
| Prêmio total mercado segurador BR | R$ 300bi+/ano |
| Comissão média de angariação | 5–15% do prêmio |
| TAM (ferramentas para corretores) | R$ 2–4bi/ano |
| SAM (dispostos a pagar por SaaS) | ~40.000 corretores |
| SOM (meta Year 1) | 500 corretores pagantes |

### 2.2 Concorrentes

| Produto | Posicionamento | Limitações |
|---------|---------------|-----------|
| Segfy | Multicálculo focado | Não é CRM; sem gestão de carteira |
| Aponline | Integração com seguradoras | Caro, focado em grandes | 
| Excel/Sheets | Zero custo | Não escala, sem alertas, sem histórico |
| Pipedrive/HubSpot | CRM genérico | Não entende seguro, adaptação manual |
| Sisweb | Sistema legado desktop | UX dos anos 2000, sem mobile |

**Brecha:** Nenhum produto cobre o fluxo completo do corretor autônomo/PME de forma integrada com UX moderna.

### 2.3 Tendências

- **Digitalização forçada pós-2020:** Seguradoras exigindo processos digitais
- **SUSEP digital:** Regulação empurrando para plataformas certificadas
- **Open Insurance:** Padronização de APIs que beneficia integrações
- **WhatsApp Business API:** Novo canal de renovação massivo
- **IA generativa:** Cotação e atendimento automatizáveis

---

## 3. Personas

### 3.1 Lucas — O Corretor Autônomo

**Perfil:**
- 28–45 anos, PF habilitado SUSEP
- 200–600 clientes ativos na carteira
- Opera sozinho ou com 1 assistente
- Fatura R$ 8.000–25.000/mês em comissões
- Trabalha com 3–5 ramos: Auto, Vida, Residencial, Saúde, Empresarial

**Dores:**
- Fica sabendo do vencimento de apólice pelo próprio cliente ligando bravo
- Não sabe qual cliente tem Vida mas não tem Auto (nem consegue ver isso facilmente)
- Proposta fica no e-mail, apólice fica na pasta, comissão fica na planilha — tudo separado
- Viagem ou doença = carteira sem acompanhamento

**Jobs to be Done:**
- Receber alerta antes do vencimento para ligar e renovar
- Saber de forma rápida qual é a saúde financeira da minha carteira hoje
- Gerar proposta profissional em minutos, não horas
- Ter histórico de toda a carteira em um lugar só

**Comportamento de compra:**
- Trial gratuito de 14 dias
- Paga se vir pelo menos 1 renovação que teria perdido
- Boca a boca entre corretores é principal canal

### 3.2 Agência Pequena — Micro (3–8 corretores)

**Perfil:**
- Pessoa jurídica (LTDA ou MEI)
- 3–8 corretores operando com carteiras individuais
- Dono precisa de visão consolidada + cada corretor tem seus clientes
- Fatura R$ 50.000–150.000/mês agregado

**Dores:**
- Cada corretor usa seu próprio Excel, sem padronização
- Dono não tem visibilidade da carteira total em tempo real
- Onboarding de novo corretor leva semanas
- Relatórios para prestação de contas são construídos manualmente

**Jobs to be Done:**
- Relatório de carteira consolidado para apresentar para seguradoras
- Padronizar operação de todos os corretores
- Visibilidade de renovações de toda a equipe em uma tela

### 3.3 Corretor Enterprise (20+ corretores)

**Perfil:**
- Corretora de médio a grande porte
- API integration com seguradoras
- Precisa de relatórios de compliance
- Equipes por ramo (equipe de saúde, equipe de auto, etc.)

**Fora do escopo atual:** Enterprise está no roadmap pós-product-market-fit.

---

## 4. Requisitos do Produto

### 4.1 Épico 5 — Core da Plataforma (MVP)

#### FR-5.01 — Gestão de Clientes
- Cadastro completo: nome, CPF/CNPJ, e-mail, telefone, data de nascimento, endereço, tags, notas
- Listagem com busca, filtro por tags e por aniversariantes do mês
- Perfil individual com histórico de apólices e cross-sell

#### FR-5.02 — Gestão de Apólices
- Campos: apólice, seguradora, ramo, cliente, vigência, prêmio, comissão%, tipo de comissão
- Cálculo automático de comissão esperada (coluna generated)
- Status: ativa, vencida, cancelada, suspensa, renovada
- Importação em massa via CSV/Excel (até 500 apólices)

#### FR-5.03 — Alertas de Vencimento
- Job diário calcula apólices vencendo em 90, 60, 30, 15 e 7 dias
- Alertas in-app com badge no sidebar
- Filtro de alertas por tipo, status e data
- Marcar como enviado/dispensado

#### FR-5.04 — Proposta Comercial em PDF
- Gerada via @react-pdf/renderer no servidor
- Inclui: corretor (nome, SUSEP, logo), cliente, coberturas, prêmio, validade da proposta
- Download direto + envio por e-mail (via Resend)
- Múltiplas seguradoras (multicálculo manual — Story 5.9)

#### FR-5.05 — Portal do Cliente
- Acesso via link com token seguro (JWT, 30 dias)
- Visualização de apólices ativas do cliente
- Download de documentos
- Abertura de sinistro (formulário simples)
- Sem necessidade de conta/senha para o cliente

#### FR-5.06 — Pipeline de Vendas
- Kanban com colunas: novo, cotação enviada, negociação, fechado, perdido
- Drag & drop entre colunas (DnD Kit)
- Link lead → cotação diretamente do card
- Registro de atividades por lead

#### FR-5.07 — Sinistros
- Abertura via portal do cliente ou pelo corretor
- Status flow: aberto → em análise → aguardando docs → aprovado → pago → encerrado / negado
- Histórico de atualizações por sinistro
- Número de processo da seguradora

#### FR-5.08 — Controle de Comissões
- Lançamento manual de comissões recebidas vs esperadas
- Status: pendente, recebido, parcial, atrasado, cancelado
- Divergência calculada automaticamente
- Previsão de recebimentos por mês

#### FR-5.09 — Relatórios Avançados
- Dashboard com KPIs: carteira total, prêmio sob gestão, receita esperada no mês, taxa de renovação
- Distribuição por ramo e seguradora (barras)
- Forecast de comissões (próximos 3 meses)
- Histórico de extrato de comissões

#### FR-5.10 — Multicálculo de Cotações
- Formulário de cotação por ramo
- Campos específicos por ramo (auto: marca/modelo/ano; vida: data nascimento/cobertura; etc.)
- Resultado comparativo multi-seguradora em tabela
- Gera proposta PDF em 1 clique a partir do resultado

#### FR-5.11 — Controle de Pendências
- Pendência associada a uma apólice
- Data de vencimento + status (aberta, em andamento, resolvida)
- Badge de overdue no sidebar
- Integração com agenda

#### FR-5.12 — Importação CSV/Excel de Apólices
- Upload drag & drop
- Mapeamento automático de colunas via aliases
- Preview e validação antes de importar
- Criação automática de clientes se não existirem
- Relatório de erros linha a linha

#### FR-5.13 — Ciclo Proposta → Apólice
- Status flow: rascunho → enviada → aprovada → recusada → expirada
- Converter proposta aprovada em apólice com 1 clique
- Herda dados da proposta (seguradora, ramo, prêmio, cliente)

---

### 4.2 Épico 6 — Monetização e Engajamento

#### FR-6.01 — Assinatura Digital (ZapSign)
- Envio de proposta/apólice para assinatura via ZapSign
- Webhook de confirmação de assinatura
- Status atualizado automaticamente: enviado → assinado → recusado

#### FR-6.02 — PlanGate (Upsell Contextual)
- Feature flags por plano (starter, pro, broker, enterprise)
- Modal de upgrade no momento da dor (quando usuário tenta usar feature bloqueada)
- Soft gate: CTA amigável; Hard gate: bloqueio total

#### FR-6.03 — Pricing + Stripe Checkout
- Página de preços com 4 planos
- Checkout via Stripe
- Trial de 14 dias sem cartão

#### FR-6.04 — Stripe Billing (Webhooks)
- Lifecycle completo: subscription created/updated/deleted, payment succeeded/failed
- Atualização automática do plano no banco
- E-mail de confirmação via Resend

#### FR-6.05 — Calculadora de ROI (Landing Page)
- Simulador interativo: "Quantas apólices você tem? → Calcule quanto vai ganhar a mais renovando X% mais"
- Âncora para conversão

#### FR-6.06 — PWA + Push Notifications
- Service Worker para notificações nativas
- Push para alertas de renovação críticos
- Consentimento explícito do usuário

#### FR-6.07 — Programa de Referral
- Código de referral único por corretor
- Crédito de 1 mês grátis ao indicar corretor que converte
- Dashboard de referrals

#### FR-6.08 — Google Calendar Sync
- Sincronização de vencimentos de apólices com Google Calendar
- OAuth 2.0 para autenticação
- Eventos criados/atualizados automaticamente (broker plan)

#### FR-6.09 — WhatsApp API (Templates)
- Templates de renovação via WhatsApp Business API
- Fluxo: alerta → 1 clique → mensagem enviada via WhatsApp
- Exclusivo plano Broker

#### FR-6.10 — Multicálculo Multi-Seguradora por API
- Integração real com APIs de seguradoras por ramo
- Auto, Residencial, Vida — cotação em tempo real

---

### 4.3 Épico 7 — Core Loop & Retenção

#### FR-7.01 — Onboarding Checklist Gamificado
- Lista de tarefas guiada para ativação: importar apólice, cadastrar cliente, configurar alerta
- Progresso em % com barra visual
- Disappears when 100% complete

#### FR-7.02 — Importação CSV (revisão Épico 5 com UX melhorada)
- Modal 3 passos: upload → mapeamento → confirmação
- Pré-visualização dos dados antes de importar

#### FR-7.03 — Status Flow de Propostas
- Badge de status visual em todas as listagens
- Histórico de mudanças de status por proposta
- Notificação quando cliente aprova via portal

#### FR-7.04 — Converter Proposta → Apólice (1 Clique)
- Botão "Converter em Apólice" na proposta aprovada
- Preenche formulário de apólice com dados da proposta
- Reduz churn de dados: nenhum campo precisar ser reinserido

#### FR-7.05 — Renovação com 1 Clique
- Botão "Renovar" em apólices vencendo
- Gera proposta de renovação com dados pré-preenchidos
- Campo `renewed_by_apolice_id` rastreia cadeia de renovação
- Quote vinculado à apólice via `renewal_quote_id`

#### FR-7.06 — Pipeline: Lead → Cotação Direto
- Do card de lead no kanban, criar cotação diretamente
- Lead linkado à cotação automaticamente
- Conversão de lead sem retrabalho de digitação

#### FR-7.07 — Histórico de Versões de Proposta
- Cada edição de proposta gera um snapshot
- Timeline de versões com diff visual
- "Restaurar versão anterior"

#### FR-7.08 — Link de Proposta Público
- Token único por proposta (SHA-256, 30 dias)
- Cliente abre link sem login e vê proposta completa
- Pode aprovar/recusar via portal público
- Corretor recebe notificação

#### FR-7.09 — First Win Notification
- Quando primeiro alerta de renovação é disparado pelo sistema
- Banner celebratório (confetti) com CTA para upgrdae
- Marca primeiro win para não repetir

#### FR-7.10 — Empty States Inteligentes
- Cada módulo vazio tem CTA específico e contextual
- "Nenhuma apólice ainda? Importe sua planilha →"
- Aumenta ativação de novos usuários

#### FR-7.11 — Score de Saúde da Carteira
- Algoritmo (0–100) baseado em: % renovadas, pendências em atraso, diversificação de ramos, % com cross-sell aberto
- Gauge visual no dashboard
- Sugestões de melhoria baseadas no score

#### FR-7.12 — Cross-sell Automático
- Engine analisa carteira e identifica oportunidades
- "Você tem 47 clientes com Auto mas sem Vida — oportunidade de R$ 28k em comissão"
- Widget no dashboard + página dedicada
- Status por oportunidade: aberta, em andamento, fechada, perdida

#### FR-7.13 — Histórico de Renovações por Cliente
- Aba "Histórico de Apólices" no perfil do cliente
- Todas as apólices: ativas + encerradas
- Cadeia de renovação visual com seta
- Status badges: ativa, expirada, cancelada, renovada (com link para nova)

#### FR-7.14 — Relatório de Carteira em PDF
- PDF profissional com: resumo executivo, distribuição por ramo, top 5 seguradoras, taxa de renovação
- Download direto (`relatorio-carteira-[slug]-[data].pdf`)
- Exclusivo plano Pro+
- Geração server-side (max 500 apólices)

#### FR-7.15 — Notificação de Aniversário + Cross-sell
- Job diário identifica clientes aniversariantes
- Notificação in-app com sugestão de cross-sell contextual por faixa etária
- Botão WhatsApp com mensagem pré-formatada
- Prevenção de duplicata: 1 notificação por cliente por ano

---

## 5. Requisitos Não-Funcionais

| Requisito | Valor Alvo | Como é Alcançado |
|-----------|-----------|-----------------|
| Tempo de carregamento do dashboard | < 2s | Server Components, índices PostgreSQL |
| Geração de PDF | < 10s | renderToBuffer server-side |
| RLS (isolamento de dados) | Rígido | Políticas Supabase + get_broker_id() |
| Autenticação | Supabase Auth | JWT + cookies HttpOnly |
| Disponibilidade | 99.9% | Supabase + Vercel Edge |
| Escalabilidade | 10.000 corretores | PostgreSQL + Edge Functions |
| Segurança LGPD | Conforme | Dados de clientes isolados por broker_id |

---

## 6. Modelo de Negócio

### 6.1 Planos e Preços

| Plano | Preço | Clientes | Features |
|-------|-------|---------|----------|
| **Solo** (starter) | R$ 47/mês | Até 50 | Dashboard, alertas básicos, importação |
| **Profissional** (pro) | R$ 97/mês | Até 500 | + Portal cliente, multicálculo, relatórios, PDF carteira, assinatura digital, e-mail automático |
| **Equipe** (broker) | R$ 197/mês | Ilimitado | + WhatsApp API, Google Calendar, relatórios avançados, múltiplos usuários |
| **Enterprise** | Sob consulta | Ilimitado | + API, SLA, treinamento, integrações customizadas |

**Trial:** 14 dias grátis com acesso Profissional (sem cartão de crédito).

**Trialing:** Usuários em trial têm acesso equivalente ao plano Pro para experienciar o valor máximo da plataforma.

### 6.2 Feature Gates por Plano

| Feature Key | Plano Mínimo | Modal |
|-------------|-------------|-------|
| `email-automatico` | Pro | Soft |
| `portal-cliente` | Pro | Soft |
| `assinatura-digital` | Pro | Soft |
| `relatorios-avancados` | Pro | Soft |
| `relatorio-carteira` | Pro | Soft |
| `whatsapp-api` | Broker | Hard |
| `google-calendar` | Broker | Soft |

### 6.3 Métricas de Sucesso

| Métrica | Definição | Meta (Mês 6) |
|---------|-----------|-------------|
| MRR | Monthly Recurring Revenue | R$ 50.000 |
| Churn | % cancelamentos/mês | < 5% |
| NRR | Net Revenue Retention | > 105% |
| CAC | Custo de Aquisição por Cliente | < R$ 200 |
| LTV | Lifetime Value médio | > R$ 2.000 |
| Ativação | % usuários que importam ≥1 apólice em 7 dias | > 60% |
| Engajamento | DAU/MAU | > 40% |
| Conversão Trial→Pago | % trials que convertem | > 25% |

---

## 7. Integrações Externas

| Serviço | Propósito | Plano |
|---------|-----------|-------|
| **Stripe** | Pagamentos, subscriptions, webhooks | Todos |
| **Resend** | Transactional email (propostas, alertas, renovações) | Pro+ |
| **Supabase** | PostgreSQL, Auth, Storage, Edge Functions | Core |
| **ZapSign** | Assinatura digital de documentos | Pro+ |
| **Google Calendar API** | Sincronização de eventos de vencimento | Broker |
| **WhatsApp Business API** | Templates de renovação automatizados | Broker |
| **PostHog** | Analytics de produto (eventos, funis, funnels) | Todos |
| **Web Push API** | Notificações nativas no browser/mobile | Todos |
| **Claude API (Anthropic)** | IA para sugestões e automações | Interno |
| **Groq API** | Processamento rápido (PDF import via IA) | Interno |
| **Google Gemini** | Alternativa de IA para categorização | Interno |

---

## 8. Roadmap

### Concluído (Épicos 5, 6, 7)
- MVP completo da plataforma
- Sistema de monetização (Stripe + PlanGate)
- Core Loop de retenção (alertas, renovações, cross-sell, aniversários)
- Portal do cliente
- Relatórios avançados + PDF

### Próximos (Épicos 8+)
- Multi-usuário (agências com equipe)
- Integração real com APIs de seguradoras (multicálculo automático)
- WhatsApp Business (templates de renovação)
- App mobile nativo (React Native)
- Open Insurance compliance
- Marketplace de seguros (afiliação)

---

## 9. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Churn por dificuldade de onboarding | Alto | Alto | Onboarding checklist gamificado + empty states guiados |
| Adoção lenta por corretores mais velhos | Médio | Médio | UX simplificada, vídeo walkthrough, suporte ativo |
| Competidor lança feature similar | Médio | Baixo | Foco em integração (tudo em um lugar) vs feature parity |
| Seguradora bloqueia integração de multicálculo | Alto | Médio | Multicálculo manual como fallback (sempre disponível) |
| LGPD: vazamento de dados de clientes | Baixo | Crítico | RLS rígido + service role isolado + audit log |
| Custo de Supabase escala antes do MRR | Médio | Médio | Monitoring de uso + otimização de queries |

---

## Change Log

| Data | Autor | Descrição |
|------|-------|-----------|
| 2026-05-14 | @master (Orion) | PRD retroativo criado — documentação completa dos Épicos 5, 6 e 7 entregues |
