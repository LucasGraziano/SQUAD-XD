# Premia — Product Requirements Document (PRD)

**Versão:** 2.0
**Data:** 2026-05-11
**Status:** Aprovado — v2.0 completo
**Escopo:** v1.0 MVP (épicos 1–5 concluídos) + Epic 6 planejado

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-05-07 | 1.0 | PRD inicial — 6 épicos MVP | Morgan @pm |
| 2026-05-11 | 2.0 | Revisão completa: market research incorporado, OKRs calibrados, personas com jobs emocionais, upsell contextual, pricing atualizado, Epic 6 estruturado, todas as seções completas (FR/NFR/Pricing/Épicos/Riscos) | Morgan @pm |

---

## 1. Visão & Objetivos

### Visão de Produto

> "O sistema operacional do corretor de seguros brasileiro — a plataforma que substitui definitivamente o Excel, o caderninho e o CRM genérico, construída com a lógica nativa de seguros que nenhum outro sistema tem."

O Premia não é um CRM adaptado para seguros. É um sistema construído de dentro para fora com a lógica do corretor: vigências, ramos, seguradoras, comissões, renovações. O diferencial não está em features individuais — está em fazer o trabalho inteiro do corretor num único lugar, com zero fricção de configuração.

### Objetivos de Negócio (OKRs v2.0)

**O1 — Tração (meses 1–6)**
- KR1: 100 corretores pagantes no mês 6 pós-lançamento público
- KR2: Trial-to-paid conversion ≥ 20%
- KR3: % de trials que importam CSV nos primeiros 30 min ≥ 60%

**O2 — Retenção (meses 1–12)**
- KR1: Monthly churn < 3%
- KR2: DAU/MAU > 40%
- KR3: NPS > 55 medido no mês 3

**O3 — Receita (18 meses)**
- KR1: 500 corretores pagantes (cenário base do SOM)
- KR2: R$48k MRR (500 × R$97 ARPU médio)
- KR3: LTV/CAC > 10x

**O4 — Produto (meses 1–6)**
- KR1: Tempo médio até o "aha moment" < 15 min
- KR2: ≥ 80% dos usuários ativos com pelo menos 1 alerta configurado
- KR3: NPS de onboarding ≥ 70

### Background Context

O corretor de seguros brasileiro independente opera num mercado em crescimento estrutural (15,4% em 2023, penetração de seguros ainda em 3,8% do PIB vs. 8–12% em mercados maduros) com ferramentas que têm décadas de atraso: Excel, WhatsApp e memória. O resultado são três perdas sistêmicas — renovações perdidas por esquecimento, cross-sell invisível por falta de visibilidade, e comissões que ninguém rastreou.

O Premia resolve as três perdas com uma plataforma vertical — lógica de seguros nativa, multicarrier, mobile-first — no único quadrante de mercado ainda vazio: simples de usar, preço acessível para corretor individual, com toda a profundidade que um sistema especializado exige. O SAM acessível é de R$17,2M/ano com janela de dominância estimada de 18–36 meses antes de players maiores perceberem a oportunidade.

**Referência de mercado:** `docs/market-research.md` — análise completa de TAM/SAM/SOM, 5 concorrentes, Porter's Five Forces, recomendações estratégicas.

---

## 2. Personas

### Persona 1 — Carlos, O Corretor Analógico em Transição *(ICP Prioritário)*

**Perfil:** 45 anos, corretor há 15 anos, carteira de 150–400 clientes construída por relacionamento. Opera em Excel + WhatsApp + memória. Começou a perder renovações e sente que está no limite do que consegue gerenciar sozinho. Não é tech-first mas usa smartphone ativamente. Renda mensal R$6k–18k. ~18.000 corretores no SAM.

**Dores funcionais:**
- "Não sei quais clientes vencem esse mês sem abrir 3 planilhas"
- "Perdi uma renovação e nem sabia que tinha vencido"
- "Não consigo fazer cross-sell porque não tenho visibilidade da carteira"

**Jobs emocionais:**
- **Controle:** estar no comando da carteira, não correndo atrás dela
- **Paz de espírito:** "não fico ansioso pensando no que estou esquecendo"
- **Profissionalismo:** sentir-se moderno e organizado em frente ao cliente

**Jobs sociais:**
- Ser visto pelos clientes como corretor proativo — não reativo
- Ser referência entre colegas por usar tecnologia de ponta

**Processo de compra:** Descobre via indicação de colega ou grupo WhatsApp. Precisa de trial antes de decidir. Decisão em 1–3 semanas. Avesso a compromisso anual antecipado.

**Trigger de adoção:** Perdeu uma renovação grande recentemente (evento concreto) OU acumulou ansiedade operacional suficiente para agir (estado emocional).

**Plano esperado:** Profissional (R$97/mês)

**Momento "aha":** Importa planilha CSV → vê os alertas dos próximos 30 dias aparecerem automaticamente. Deve acontecer em < 15 min.

**Triggers de upgrade:**
- Solo → Profissional: cliente pede Portal, ou e-mail automático salva primeira renovação
- Profissional → Equipe: contrata primeiro assistente (tentativa de adicionar 2º usuário = trigger automático de upsell)

---

### Persona 2 — Juliana, A Corretora Jovem Nativa Digital *(Persona de Crescimento)*

**Perfil:** 32 anos, corretora há 3 anos, carteira de 80–200 clientes, muito ativa no Instagram, já usa RD Station mas acha genérico para seguros. Quer crescer rápido e parecer profissional desde o início. ~10.000 corretores no SAM.

**Dores funcionais:**
- "Leads do Instagram se perdem no DM, não tenho processo"
- "Quero parecer profissional mas mando PDF pelo WhatsApp"
- "Não tenho processo de cross-sell — sei que devia, não faço"

**Jobs emocionais:**
- **Competência:** sentir-se estabelecida mesmo sendo jovem no mercado
- **Confiança:** prospectar mais sem perder o controle da base atual

**Jobs sociais:**
- Parecer uma "corretora de verdade" mesmo operando solo
- Ser referência digital entre colegas da mesma geração

**Trigger de adoção:** Indicação de colega, ou frustração com CRM genérico que não entende lógica de seguros.

**Plano esperado:** Solo (R$47/mês) → Profissional conforme carteira cresce

**Momento "aha":** Envia primeiro Portal do Cliente com link personalizado e logo → cliente responde "ficou muito profissional".

**Triggers de upgrade:**
- Solo → Profissional: volume de leads atinge limite, ou precisa de PDF profissional para cliente grande
- Profissional → Equipe: relatórios avançados para apresentar para cliente empresarial

---

### Persona 3 — Roberto, O Gestor de Micro-Corretora *(Expansão — Fase 2)*

**Perfil:** 52 anos, tem 2–3 assistentes, carteira de 500+ clientes, múltiplos ramos. Já usou o Quiver e odiou o suporte e a UX. Precisa de controle consolidado sem complexidade de ERP. ~6.000 no mercado, ~2.000 acessíveis no SAM Fase 2.

**Dores funcionais:**
- "Cada assistente tem sua própria planilha, nada é consolidado"
- "Comissões chegam erradas e ninguém percebe"
- "Não tenho visão do desempenho de cada produtor"

**Jobs emocionais:**
- **Delegação sem perda de controle:** "estou no comando mesmo sem fazer tudo"
- **Segurança financeira:** saber que o negócio está saudável antes do mês acabar

**Trigger de adoção:** Procura ativa por sistema específico de seguros após insatisfação com Quiver/SegPolicy.

**Plano esperado:** Equipe (R$197/mês) → Enterprise quando disponível

**Desbloqueio de Fase 2:** Multi-usuário robusto + relatórios por produtor + multicorretagem (rede de vinculados).

---

### Upsell Contextual — Feature Transversal de Monetização

O produto deve detectar propensão a upgrade **no momento da dor**, não via e-mail de marketing. Cada "parede de plano" deve ser uma oportunidade de upgrade natural, não uma frustração.

**Componente:** `<PlanGate requiredPlan="profissional" feature="portal-cliente" modal="soft">`
- Reutilizável em todos os gates — uma implementação, múltiplos triggers
- Modal "soft": mostra o bloqueio mas não remove a navegação
- Modal "hard": bloqueia completamente (usar só para limites de dados)

**Triggers mapeados por prioridade:**

| Trigger | Upgrade | Copy Âncora | Prioridade |
|---------|---------|-------------|------------|
| Tentativa de 2º usuário | Pro → Equipe | "Trabalho em equipe requer o plano Equipe" | P0 |
| Limite de 100 clientes atingido | Solo → Pro | "Você chegou ao limite — continue crescendo" | P0 |
| Tentativa de ativar Portal do Cliente | Solo → Pro | "Uma renovação salva paga 12 meses de assinatura" | P1 |
| Toggle de e-mail automático bloqueado | Solo → Pro | "ROI calculado: X renovações/mês × comissão média" | P1 |
| Clique em WhatsApp API na sidebar | Pro → Equipe | Demo animada + calculadora de ROI embutida | P2 |

**Princípios de copy:**
- ❌ "Faça upgrade para desbloquear" → gera ressentimento
- ✅ "Você está pronto para o próximo nível" → linguagem de progresso
- ✅ "R$97/mês. Menos que um almoço de negócios por semana." → relativização de preço
- ✅ Framing de ROI concreto sempre que possível

---

## 3. Requisitos Funcionais & Não-Funcionais

### Requisitos Funcionais

#### FR-01 — Onboarding & Aha Moment
**Prioridade:** P0 · **Planos:** Todos

- [ ] Cadastro em < 60 segundos (nome, SUSEP, e-mail, senha)
- [ ] Importação CSV de apólices com mapeamento de colunas automático (papaparse)
- [ ] Detecção de vigências e geração automática de alertas dos próximos 30 dias
- [ ] Toast de confirmação: "X apólices importadas · Y alertas configurados"
- [ ] Tempo até primeiro alerta configurado: **< 15 minutos** (KR de O4)
- [ ] Checklist de onboarding gamificado (progress bar, desaparece após conclusão)

**Critério de aha moment (Carlos):** Importa CSV → vê alertas dos próximos 30 dias → sem configuração adicional.
**Critério de aha moment (Juliana):** Envia Portal do Cliente → cliente responde positivamente.

---

#### FR-02 — Gestão de Apólices
**Prioridade:** P0 · **Planos:** Todos

- [ ] CRUD completo: apólice, vigência, ramo, seguradora, prêmio, comissão, cliente
- [ ] Campos obrigatórios: número, ramo, seguradora, data vigência, valor prêmio
- [ ] Filtros: por ramo, seguradora, status (ativa/vencida/pendente), período
- [ ] Busca full-text por nome do cliente ou número da apólice
- [ ] Alertas automáticos: 60, 30, 15, 7, 1 dias antes do vencimento
- [ ] Status de comissão: prevista | recebida | vencida
- [ ] RLS: `broker_id` garante isolamento total entre corretores

---

#### FR-03 — Pipeline & CRM
**Prioridade:** P0 · **Planos:** Todos

- [ ] Kanban de pipeline: Novo Lead → Contato → Proposta → Fechado/Perdido
- [ ] Cards arrastáveis com nome, ramo interesse, valor estimado, última atividade
- [ ] Campos de lead: nome, telefone, e-mail, ramo, origem (Instagram/indicação/tráfego)
- [ ] Histórico de atividades por lead (log automático de ações)
- [ ] Cross-sell: identificação de clientes sem determinado ramo na carteira
- [ ] Filtro de carteira por ramo para identificar oportunidades de cross-sell

---

#### FR-04 — Propostas & Cotações
**Prioridade:** P1 · **Planos:** Profissional+

- [ ] Criação de proposta com: cliente, ramo, seguradora, coberturas, prêmio, validade
- [ ] Status: rascunho → enviada → aprovada → recusada → contratada
- [ ] PDF profissional gerado automaticamente com logo do corretor
- [ ] Link de visualização para o cliente (sem login)
- [ ] Conversão de proposta aprovada em apólice (1 clique)
- [ ] Histórico de versões da proposta

---

#### FR-05 — Pendências
**Prioridade:** P1 · **Planos:** Profissional+

- [ ] Registro de pendência vinculada a apólice OU lead (um dos dois obrigatório)
- [ ] Tipos: documentação, vistoria, pagamento, sinistro, outro
- [ ] Status: aberta | em andamento | resolvida | cancelada
- [ ] Prazo com alerta automático 24h antes
- [ ] Filtro por status, tipo e responsável
- [ ] Dashboard de pendências abertas na home

---

#### FR-06 — Financeiro & Comissões
**Prioridade:** P1 · **Planos:** Profissional+ (versão simplificada no Solo)

- [ ] Extrato de comissões: esperadas vs. recebidas por período
- [ ] Registro de recebimento: marca comissão como recebida + data + valor real
- [ ] Alertas de comissões atrasadas (> 30 dias sem recebimento após vigência)
- [ ] Relatório mensal: total esperado, total recebido, diferença, por seguradora
- [ ] **Solo:** Apenas extrato simplificado (total do mês, lista de apólices)
- [ ] **Profissional+:** Extrato completo, por seguradora, exportação CSV

---

#### FR-07 — E-mail Automático de Renovações
**Prioridade:** P1 · **Planos:** Profissional+

- [ ] Configuração de campanhas de renovação (template, timing, assunto)
- [ ] Envio automático via Resend: 30 dias e 7 dias antes do vencimento
- [ ] Personalização: nome do cliente, número da apólice, data de vencimento
- [ ] Link de opt-out com token JWT assinado (jose)
- [ ] Dashboard: e-mails enviados / abertos / clicados por campanha
- [ ] Toggle on/off por apólice ou por cliente
- [ ] `renewal_emails_enabled` e `renewal_email_custom_text` no perfil do corretor

---

#### FR-08 — Portal do Cliente
**Prioridade:** P1 · **Planos:** Profissional+

- [ ] Link personalizado por cliente: `premia.app/portal/{slug}`
- [ ] Exibe: apólices ativas, datas de vencimento, contato do corretor
- [ ] Logo e cor personalizáveis pelo corretor
- [ ] Acesso sem login (token na URL)
- [ ] Mobile-first: legível no celular sem zoom
- [ ] Compartilhamento direto via WhatsApp (link + mensagem pré-preenchida)

---

#### FR-09 — Relatórios
**Prioridade:** P2 · **Planos:** Profissional+

- [ ] Relatório de carteira: clientes por ramo, ticket médio, crescimento MoM
- [ ] Relatório de renovações: taxa de renovação, renovações perdidas, pipeline
- [ ] Relatório de comissões: por seguradora, por período, projeção próximo mês
- [ ] **Equipe:** Relatórios por produtor + consolidado da corretora
- [ ] Exportação PDF e CSV

---

#### FR-10 — Upsell Contextual (`<PlanGate>`)
**Prioridade:** P0 · **Planos:** Transversal

Componente reutilizável que detecta propensão a upgrade no momento da dor.

```tsx
<PlanGate requiredPlan="profissional" feature="portal-cliente" modal="soft">
  {children}
</PlanGate>
```

| Trigger | Modal | Copy | Plano destino |
|---------|-------|------|--------------|
| 2º usuário tentado | hard | "Trabalho em equipe requer o plano Equipe" | Equipe |
| 100º cliente cadastrado | hard | "Você chegou ao limite — continue crescendo" | Profissional |
| Portal do Cliente clicado | soft | "Uma renovação salva paga 12 meses" | Profissional |
| E-mail automático bloqueado | soft | "ROI calculado: X renovações × comissão" | Profissional |
| WhatsApp API na sidebar | soft | Demo animada + calculadora de ROI | Equipe |

**Calculadora de ROI embutida no modal (trigger de e-mail automático):**
- Input: "Quantas apólices na carteira?" (slider 50–500)
- Input: "Comissão média por renovação?" (campo, default R$450)
- Output: "Recuperar 2 renovações/mês = **24x** o plano Profissional"
- CTA: "Ativar por R$97/mês — menos que um almoço de negócios por semana"

---

#### FR-11 — Assinatura Digital ZapSign *(Epic 6 — Planejado)*
**Prioridade:** P0 Epic 6 · **Planos:** Profissional+

- [ ] Integração ZapSign API para assinatura de propostas e apólices
- [ ] Fluxo: Criar documento → Enviar link para signatário → Monitorar status
- [ ] Status: pendente | assinado | recusado | expirado
- [ ] Webhook para atualizar status automaticamente
- [ ] Armazenamento do documento assinado em Supabase Storage
- [ ] Notificação ao corretor quando cliente assinar

---

### Requisitos Não-Funcionais

| ID | Requisito | Critério |
|----|-----------|---------|
| NFR-01 | Performance | LCP < 2.5s, FID < 100ms, páginas de lista < 1s |
| NFR-02 | Multi-tenancy | RLS obrigatório em todas as tabelas; `broker_id` em todas as queries |
| NFR-03 | LGPD | Opt-out de e-mail via token assinado; dados exportáveis por usuário |
| NFR-04 | Mobile-first | Breakpoints: 360px (priority), 768px, 1280px |
| NFR-05 | Disponibilidade | 99.5% uptime (Vercel + Supabase SLA) |
| NFR-06 | Segurança | OWASP Top 10; sem SQL injection via Supabase client; headers HSTS |
| NFR-07 | Escalabilidade | Suportar até 10k apólices por corretor sem degradação |
| NFR-08 | Acessibilidade | WCAG 2.1 AA para fluxos críticos (onboarding, alertas, dashboard) |

---

## 4. Pricing & Planos

### Tabela de Planos

| Feature | Solo | Profissional | Equipe | Enterprise |
|---------|------|-------------|--------|-----------|
| **Preço/mês** | **R$47** | **R$97** | **R$197** | Sob consulta |
| Usuários | 1 | 1 | até 5 | Ilimitado |
| Clientes/apólices | até 100 | Ilimitado | Ilimitado | Ilimitado |
| Dashboard & alertas | ✅ | ✅ | ✅ | ✅ |
| Importação CSV | ✅ | ✅ | ✅ | ✅ |
| Pipeline (Kanban) | ✅ | ✅ | ✅ | ✅ |
| Extrato comissões (simples) | ✅ | ✅ | ✅ | ✅ |
| Propostas básicas | ✅ | ✅ | ✅ | ✅ |
| Portal do Cliente | ❌ | ✅ | ✅ | ✅ |
| E-mail automático renovações | ❌ | ✅ | ✅ | ✅ |
| Propostas avançadas (PDF) | ❌ | ✅ | ✅ | ✅ |
| Pendências | ❌ | ✅ | ✅ | ✅ |
| Extrato comissões completo | ❌ | ✅ | ✅ | ✅ |
| Relatórios | ❌ | ✅ | ✅ | ✅ |
| WhatsApp API | ❌ | ❌ | ✅ | ✅ |
| Google Calendar sync | ❌ | ❌ | ✅ | ✅ |
| Relatórios por produtor | ❌ | ❌ | ✅ | ✅ |
| Multicorretagem | ❌ | ❌ | ❌ | ✅ |
| Integração contábil | ❌ | ❌ | ❌ | ✅ |
| ZapSign assinatura digital | ❌ | ✅ | ✅ | ✅ |
| SLA suporte | — | 48h | 24h | 4h dedicado |

### Posicionamento de Preço

**Framing de ROI (copy do site e modais):**
> "Uma renovação salva = de 3 a 8 meses de assinatura. O sistema se paga no primeiro cliente."

**Calculadora de ROI (landing page + modal PlanGate):**
- Inputs: carteira (50–500 apólices), comissão média (default R$450), renovações perdidas/mês estimadas (1–10)
- Output dinâmico: "Recuperar **2 renovações/mês** já paga **24× o plano Profissional**"
- Posição: acima do fold de pricing na landing page e dentro do modal de upsell de e-mail automático

**Relativização de preço:**
- R$47 = menos que 1 almoço de negócios por mês
- R$97 = menos que 1 almoço de negócios por semana
- R$197 = menos que 1 janta de fechamento de contrato

### Decisões de Pricing Validadas

**Por que R$47 não canibaliza o Profissional:**
- Carlos (ICP, 150–400 clientes) não cabe no limite de 100 — migração inevitável
- Juliana fica 6–12 meses no Solo antes de estourar o limite
- Portal do Cliente e e-mail automático (features de maior impacto de receita) estão no Profissional
- Limite de 100 clientes é hard block, não soft warning

**Por que WhatsApp API está no Equipe (não como add-on):**
- WhatsApp API requer aprovação Meta + template approval — complexidade operacional inadequada para usuário solo
- Add-on R$29 para Profissional criaria fricção adicional e fragmentaria percepção de valor
- Bundling no Equipe (R$197) simplifica a decisão e aumenta perceived value do plano
- *Experimento futuro:* add-on WhatsApp apenas para Profissional > 6 meses como teste de ARPU expansion

**Features movidas para Solo (vs. v1.0):**
- Propostas básicas (Juliana precisa para parecer profissional desde o início)
- Extrato de comissões simplificado (Carlos precisa antes de decidir pagar mais)
- Essas mudanças aumentam perceived value do trial e melhoram trial→paid conversion

### Trial

| Parâmetro | Valor |
|-----------|-------|
| Duração | **14 dias** (variante A nos testes) |
| Plano de trial | **Profissional** (expõe o plano âncora completo) |
| Cartão na entrada | **Não** — reduz fricção de onboarding |
| Expiração | Hard block — dados preservados por 30 dias, depois anonimizados |
| Lembretes | In-app + e-mail no dia 7 e dia 13 |

*Especificação completa de billing, lifecycle de assinatura e webhooks Stripe:* `docs/billing-spec.md`

### Testes de Pricing Planejados

| Teste | Variante A | Variante B | Métrica |
|-------|------------|------------|---------|
| Duração do trial | 14 dias | 7 dias | Trial→paid conversion |
| WhatsApp add-on | Incluído no Equipe | Add-on R$29 no Pro | ARPU + churn |
| Desconto anual | Oferecer no dia 1 | Oferecer no dia 90 | % anual vs. mensal |
| Calculadora ROI | Com calculadora | Sem calculadora | Landing page conversion |

---

## 5. Épicos & Roadmap

### Epic Map — v1.0 MVP (Concluídos)

| Epic | Título | Stories | Status |
|------|--------|---------|--------|
| **1** | Fundação & Auth | 1.1–1.7 | ✅ Done |
| **2** | Gestão de Apólices | 2.1–2.x | ✅ Done |
| **3** | Pipeline & CRM | 3.1–3.x | ✅ Done |
| **4** | Alertas & Notificações | 4.1–4.x | ✅ Done |
| **5** | Expansão de Valor | 5.1–5.17 | ✅ Done |

**Epic 5 entregou:** Pendências, Propostas, E-mail automático (Resend), Portal do Cliente, Rastreamento de Comissões, Relatórios, Assinatura Digital base.

### Epic 6 — Integrações & Growth *(Planejado)*

**Objetivo:** Fechar os gaps de integração identificados no market research e ativar os triggers de upgrade P0/P1.

| Story | Título | Prioridade | Plano |
|-------|--------|------------|-------|
| 6.1 | ZapSign — Assinatura Digital completa | P0 | Profissional+ |
| 6.2 | `<PlanGate>` — Upsell contextual component | P0 | Transversal |
| 6.3 | Calculadora de ROI na landing page | P1 | — |
| 6.4 | PWA — Push notifications nativas | P1 | Todos |
| 6.5 | Google Calendar sync (vencimentos) | P2 | Equipe |
| 6.6 | WhatsApp API (templates de renovação) | P2 | Equipe |
| 6.7 | Multicálculo (multi-seguradora por ramo) | P3 | Profissional+ |

### Roadmap — 18 meses

```
Mês 1–2:   Epic 6 (P0+P1) + Soft launch beta (50 corretores)
Mês 3–4:   Lançamento público + Meta Ads + referral program
Mês 5–6:   100 pagantes (KR O1) · otimização trial→paid
Mês 7–12:  Expansão Equipe (Roberto) · Epic 6 P2+P3
Mês 13–18: 500 pagantes (KR O3) · Enterprise · Multicorretagem
```

---

## 6. Contexto Competitivo

*Análise completa em `docs/market-research.md` — Seção 5 (Porter's Five Forces) e Seção 4 (Landscape Competitivo).*

**Resumo executivo:**

| Concorrente | Ponto Forte | Ponto Fraco | Quadrante |
|-------------|-------------|-------------|-----------|
| BrokerOne | UX moderna, roadmap ativo | Preço R$149+, sem trial | Médio/Enterprise |
| Quiver | Market share estabelecido | UX dos anos 2000, suporte péssimo | Enterprise |
| SegPolicy | Compliance forte | Complexo, caro | Enterprise |
| Seguradoras (sistemas próprios) | Gratuito, integrado | Single-carrier, sem carteira cross | Locked-in |
| CRMs genéricos (RD, HubSpot) | Flexíveis | Não entendem lógica de seguros | Horizontal |

**Quadrante vazio (oportunidade Premia):** Simples + Acessível + Vertical (seguros-native). Janela de dominância: 18–36 meses.

**Gaps identificados que o Premia precisa fechar (Epic 6):**
1. Assinatura digital — todos os concorrentes têm; Premia entregou base no Epic 5, ZapSign completo é Epic 6.1
2. PWA com push notifications — diferencial mobile-first não completamente realizado
3. Integração WhatsApp — expectativa do mercado brasileiro

---

## 7. Riscos & Mitigações

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|-------|--------------|---------|-----------|
| R1 | Churn alto por falta de aha moment | Alta | Alto | Onboarding gamificado + meta < 15min + teste A/B de CSV import |
| R2 | Usuários ficam presos no Solo para sempre | Média | Alto | Feature gates hard (100 clientes) + upsell contextual (FR-10) no momento da dor |
| R3 | BrokerOne copia modelo e entra no segmento acessível | Baixa | Alto | Velocidade de execução + community moat (corretores indicando corretores) |
| R4 | Integração Resend falha em produção (e-mail automático) | Média | Médio | Retry logic + fallback de notificação in-app + dashboard de status de envio |
| R5 | Migrações de DB quebram dados em produção | Baixa | Crítico | Migrations com rollback documentado + backup automático Supabase antes de cada deploy |
| R6 | LGPD — uso indevido de dados de clientes dos corretores | Baixa | Alto | RLS garante isolamento; opt-out por token JWT; política de privacidade; DPA com Supabase |
| R7 | CAC > LTV nos primeiros 6 meses | Média | Alto | Foco em referral (CAC orgânico) antes de pagar Meta Ads; trial grátis reduz barreira |
| R8 | Roberto (Fase 2) chega antes da feature de multi-usuário robusta | Média | Médio | Workaround: cadastro manual de usuários pelo admin; priorizar Story 6.x multi-usuário |

---

## 8. Analytics & Tracking Plan

**Ferramenta:** PostHog (LGPD-friendly, SDK Next.js nativo, funnels + feature flags)

### Eventos P0 — Base de Medição dos OKRs

**Funil Aha Moment (O4/KR1 — < 15 min):**
```
signup_completed → csv_import_completed → first_alert_viewed
```
Medir: `time_since_signup_ms` em `first_alert_viewed` < 900.000ms

**Funil Trial→Paid (O1/KR2 — ≥ 20%):**
```
trial_started → onboarding_completed → plan_gate_shown → checkout_completed
```

**Upsell (O3 — Expansão):**
```
plan_gate_shown → upgrade_clicked → upgrade_completed
```
Meta por gate: Portal 15%, E-mail automático 12%, 2º usuário 25%

### Eventos Críticos de Produto

| Evento | O que mede |
|--------|-----------|
| `csv_import_completed` | Adoção de onboarding |
| `plan_gate_shown` + `upgrade_completed` | Eficácia do upsell contextual |
| `portal_viewed_by_client` | Valor entregue ao cliente final |
| `policy_renewed` (`via: email_campaign`) | ROI do e-mail automático |
| `nps_submitted` | Satisfação (OKR O2/KR3) |

### Regra LGPD
Nunca enviar ao PostHog dados pessoais de clientes do corretor (nome, CPF, número de apólice). Apenas IDs anonimizados, contagens e timestamps.

*Tracking plan completo, funnels, dashboards OKR e roadmap de implementação:* `docs/analytics-plan.md`

---

## 9. Go-To-Market & Lançamento

**Tese:** Referral orgânico → Authority → Performance Ads. Não escalar ads antes de provar cohort M1 retention ≥ 75%.

### 3 Fases

| Fase | Período | Meta | Canal Principal |
|------|---------|------|----------------|
| **Fase 0** Beta fechado | Meses -2 a 0 | 30–50 beta users · NPS ≥ 60 | Indicação pessoal + onboarding assistido |
| **Fase 1** Soft launch | Meses 1–3 | 100 pagantes · trial→paid ≥ 20% | Referral program + grupos WhatsApp/SINCOR |
| **Fase 2** Lançamento público | Meses 4–6 | 200 pagantes | Meta Ads + conteúdo Instagram |
| **Fase 3** Escala | Meses 7–18 | 500 pagantes (KR O3) | Performance + parcerias seguradoras |

### Referral Program
- Indicador ganha: **1 mês grátis** por cada indicado que converte
- Indicado ganha: **trial de 21 dias** (vs. 14 dias padrão)
- Ativação: banner no dashboard pós-aha moment + e-mail dia 3 do trial

### Gates de Saída entre Fases
- **Beta → Fase 1:** NPS ≥ 60 · aha moment < 15 min validado · zero bugs P0
- **Fase 1 → Fase 2:** Cohort M1 retention ≥ 75% · trial→paid ≥ 20% em 3 cohorts

*Playbook completo com Meta Ads, SEO, parceria com seguradoras e spec do referral program:* `docs/gtm-playbook.md`

---

*PRD v2.0 — Premia · Morgan @pm · 2026-05-11*
*Referências: docs/market-research.md · docs/billing-spec.md · docs/analytics-plan.md · docs/gtm-playbook.md · docs/architecture.md*
