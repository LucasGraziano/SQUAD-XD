# Lucky SaaS — Project Brief

**Versão:** 1.0  
**Data:** 2026-05-07  
**Status:** Aprovado para desenvolvimento  
**Produto:** Lucky SaaS (nome comercial a definir — sugestões: *Apolia*, *Correto*, *Broker360*)  
**Empresa:** Lucky Corretora de Seguros (fundador-cliente interno)

---

## 1. O Problema

O corretor de seguros brasileiro trabalha num mercado altamente regulado e relacional, onde a confiança e a tempestividade do contato são a principal vantagem competitiva. O problema central é que, apesar disso, a grande maioria dos ~100.000 corretores registrados na SUSEP opera com ferramentas que têm décadas de atraso tecnológico: planilhas Excel, cadernos físicos, grupos de WhatsApp e, na melhor das hipóteses, um CRM genérico não adaptado ao fluxo específico de seguros.

Isso cria três perdas sistêmicas que sangram a receita do corretor todos os meses. A primeira é a perda de renovação: sem alertas automáticos e centralizados, apólices vencem sem que o corretor contate o cliente a tempo — e o cliente simplesmente vai para a seguradora diretamente ou para um concorrente. A segunda é a perda de oportunidade de cross-sell: o corretor que tem o cliente há cinco anos, conhece sua família, sabe que tem carro e apartamento, nunca ofereceu seguro de vida porque simplesmente não tem visibilidade sistêmica de qual cliente tem o quê e o que ainda pode ser vendido. A terceira é a perda de receita invisível: comissões calculadas errado, comissões não recebidas que ninguém percebeu, e fluxo de caixa imprevisível que impede crescimento.

O resultado macro é uma carteira que dificilmente cresce além de 200-300 clientes antes de o corretor perder o controle. O teto operacional do corretor é definido pelo limite cognitivo humano de gerenciar relacionamentos sem sistema, não pela capacidade do mercado de absorver mais seguros. Um sistema dedicado quebra esse teto.

---

## 2. A Solução Proposta

O Lucky SaaS é uma plataforma de gestão operacional completa para corretores de seguros individuais e pequenas corretoras, construída sobre três pilares:

**Pilar 1 — Nunca perca uma renovação.** Sistema de alertas proativo com 90/60/30 dias de antecedência, templates prontos de mensagem, e rastreamento de resposta do cliente. A renovação deixa de ser memória e vira processo.

**Pilar 2 — Cresça dentro da sua carteira.** Motor de cross-sell inteligente que analisa a carteira e sinaliza proativamente quais clientes têm lacunas de proteção — sem precisar que o corretor "lembre" de oferecer. A receita cresce sem necessidade de novos clientes.

**Pilar 3 — Visibilidade financeira completa.** Forecast de comissões, alertas de não recebimento, e relatórios por ramo e seguradora. O corretor sabe exatamente quanto vai receber antes de o mês acabar.

O MVP (v1.0) entrega os 6 módulos principais: Pipeline de Leads, Gestão de Apólices, Cross-sell Inteligente, Alertas de Vida do Cliente, Comissões e Financeiro, e Auxílio de Abertura/Fechamento. O módulo Multicalculo (Fase 2) é reservado para v2.0 por envolver integrações complexas com APIs proprietárias de seguradoras.

---

## 3. Mercado-Alvo

### TAM — Mercado Total Endereçável
- ~100.000 corretores registrados na SUSEP (Brasil, 2025)
- Crescimento histórico: ~5% a.a.
- ARPU potencial máximo: R$ 397/mês
- **TAM:** R$ 397 × 100.000 × 12 = **R$ 476M/ano**

### SAM — Mercado Endereçável Acessível
- Foco inicial: corretores individuais e micro-corretoras (1-5 pessoas) com carteira de 50-500 clientes
- Estimativa: ~35% do mercado nesse perfil = 35.000 corretores
- Receptíveis a SaaS (usam smartphone, têm Instagram, já pagam alguma ferramenta digital): ~40% = 14.000 corretores
- **SAM:** R$ 297 (tier médio) × 14.000 × 12 = **R$ 50M/ano**

### SOM — Mercado Obtível (18 meses)
- Meta realista com go-to-market via comunidade de corretores e marketing de indicação
- Target: 500 corretores pagantes em 18 meses (3,5% do SAM com abordagem focada)
- **SOM:** R$ 297 × 500 × 12 = **R$ 1,78M ARR em 18 meses**

### Contexto Competitivo
Não existe concorrente direto dominante para o segmento de corretores individuais. Os sistemas existentes (Quiver, SegPolicy, sistemas das próprias seguradoras) são pesados, caros, voltados para corretoras médias/grandes, ou não cobrem CRM + gestão de apólice + financeiro numa única plataforma. O Lucky SaaS tem janela de oportunidade clara para dominar o segmento de corretores individuais.

---

## 4. Proposta de Valor Única

> **"O primeiro sistema feito por corretor para corretor: nunca perca uma renovação, sempre saiba quanto vai receber, e cresça dentro da sua carteira sem contratar ninguém."**

Diferenciação vs. CRM genérico (HubSpot, RD Station):
- Lógica de seguros nativa (ramos, vigências, seguradoras, comissões) — não é adaptação
- Alertas de vencimento automáticos sem configuração manual
- Cross-sell inteligente específico para carteira de seguros
- Forecast de comissão por apólice

Diferenciação vs. sistemas legados de seguradoras:
- Interface moderna, mobile-first
- Independente de seguradora (multicarrier)
- Setup em minutos, não semanas
- Preço acessível para corretor individual

---

## 5. Modelo de Negócio

### Pricing Tiers (subscription mensal, Stripe)

| Plano | Preço | Perfil | Limites |
|-------|-------|--------|---------|
| **Starter** | R$ 197/mês | Corretor iniciante ou validando | Até 100 clientes, 200 apólices, 1 usuário |
| **Pro** | R$ 297/mês | Corretor consolidado | Até 500 clientes, 1.000 apólices, 1 usuário |
| **Broker** | R$ 397/mês | Micro-corretora | Ilimitado clientes/apólices, até 3 usuários |

**Estratégia de aquisição:**
- 14 dias free trial (sem cartão)
- Onboarding guiado com importação de planilha (reduz fricção de migração)
- Indicação: 1 mês grátis para quem indicar 1 corretor que pagar

**Unit Economics alvo:**
- CAC target: < R$ 300 (3 ciclos de payback no Starter)
- LTV estimado (24 meses churn ~3%/mês): R$ 297 × 24 × 0,73 = ~R$ 5.200 no Pro
- LTV/CAC target: > 10x

---

## 6. Riscos Principais

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Adoção lenta (corretor resistente a tecnologia) | Alta | Alto | Onboarding guiado, suporte por WhatsApp, comunidade, conteúdo educativo |
| Churn por abandono no setup | Média | Alto | Importador de planilha, concierge de setup nos primeiros 7 dias |
| Integração com seguradoras v2 (APIs não públicas) | Alta | Médio | MVP sem Multicalculo; v2.0 via parcerias negociadas |
| Compliance SUSEP / LGPD | Média | Alto | Termos claros, criptografia, DPO definido antes do lançamento |
| Competidor grande (Salesforce Insurance, etc.) | Baixa | Alto | Nicho específico, preço acessível, comunidade de corretores |
| Concentração de risco (fundador tem a corretora) | Média | Médio | Separação clara de entity, SaaS opera independente |

---

## 7. Métricas de Sucesso (KPIs)

### Métricas de Crescimento
- **MRR:** Meta R$ 50K em mês 6, R$ 150K em mês 12, R$ 500K em mês 18
- **Corretores pagantes:** 50 em mês 3, 200 em mês 9, 500 em mês 18
- **Trial-to-paid conversion:** > 25%
- **NPS:** > 50

### Métricas de Produto (Engagement)
- **DAU/MAU:** > 40% (corretor que usa todo dia)
- **Apólices cadastradas por usuário ativo:** > 50 no mês 2 pós-onboarding
- **Alertas de renovação enviados/semana por usuário:** > 3
- **Feature adoption (cross-sell):** > 30% dos usuários ativos usam em mês 3

### Métricas de Retenção
- **Monthly churn:** < 3% (target < 2% no mês 6)
- **Expansion revenue (upgrade de tier):** > 15% da base em 12 meses
- **Payback period:** < 4 meses

---

## 8. MVP Scope — v1.0

### O que entra no v1.0

| Módulo | Funcionalidades Incluídas |
|--------|--------------------------|
| Pipeline de Leads | Kanban, captura manual + webhook ManyChat, alerta 48h, histórico |
| Gestão de Apólices | CRUD apólices, alertas 90/60/30d, templates WhatsApp, histórico por cliente |
| Cross-sell Inteligente | Score básico por gap de produto, lista de oportunidades, rastreio aberto/fechado |
| Alertas de Vida | Aniversário cliente, aniversário apólice, eventos configuráveis |
| Comissões e Financeiro | Registro por apólice, forecast mensal, alerta não recebimento, relatório básico |
| Auxílio Abertura/Fechamento | Checklist por ramo, templates de proposta, integração ZapSign, welcome automático |

### Infraestrutura v1.0
- Multi-tenancy isolado por corretor (workspace próprio, RLS no Supabase)
- Autenticação Supabase Auth (email/senha + Google OAuth)
- Notificações por email (Resend) e webhooks de saída para WhatsApp
- Painel de billing com Stripe (subscription + portal de autoatendimento)
- Importador CSV de planilha (migração de Excel)

### O que NÃO entra no v1.0
- Módulo Multicalculo (integração com portais de cotação das seguradoras)
- App mobile nativo (PWA responsivo cobre mobile no v1.0)
- Multi-usuário por workspace além do tier Broker (3 usuários)
- Integração direta com sistemas das seguradoras (extrato de comissão automático)
- BI avançado / relatórios customizáveis
- API pública para integrações de terceiros

---

*Lucky SaaS — Project Brief v1.0 | Gerado por equipe de produto AI-Native | 2026-05-07*
