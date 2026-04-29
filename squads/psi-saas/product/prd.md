# PRD — Product Requirements Document

**Produto:** PsiSaaS (nome provisório)  
**Versão:** 0.2 — MVP Revisado  
**Data:** Abril 2026  
**Status:** Draft — aguarda validação com entrevistas  
**Changelog v0.2:** Escopo MVP expandido com gestão de pacientes, Google Calendar, cobrança flexível, relatórios financeiros, proteção de dados reforçada e IA clínica (linhagem terapêutica). Videochamada removida do escopo.

---

## 1. Visão do Produto

### Problema
Psicólogos clínicos brasileiros são treinados para cuidar de pessoas, mas recebem zero formação em gestão de consultório. Resultado: usam WhatsApp para agendar, caderno para anotar, planilha para cobrar — e perdem pacientes sem saber por quê.

Os softwares existentes resolvem o operacional (agenda, prontuário, cobrança) mas ignoram as dores que realmente tiram o sono do psicólogo: saber se o trabalho está funcionando, evitar que pacientes abandonem, ter alguém que cuide dele também.

### Solução
Plataforma de gestão clínica inteligente que:
1. Automatiza o operacional (agenda, prontuário, cobrança)
2. Entrega inteligência clínica real (progresso do paciente, risco de abandono)
3. Cuida do profissional (benchmarking, comunidade, proteção jurídica)

### Usuário Alvo (ICP)
**Primário:** Psicólogo clínico autônomo, 3–7 anos de carreira, 15–25 pacientes/semana, capital ou cidade grande, atende presencial e online.

**Secundário:** Recém-formado (0–3 anos) montando o primeiro consultório.

---

## 2. MVP — Escopo v1.0

### Princípio de escopo
*"Paridade com o mercado + diferenciais que ninguém tem."*  
O produto precisa cobrir as expectativas básicas de qualquer psicólogo + entregar pelo menos 2 features que nenhum concorrente oferece.

### Features do MVP (v1.0)

#### Módulo 1 — Gestão de Pacientes
- [ ] Cadastro completo: dados pessoais, contato, responsável legal (menor), convênio
- [ ] Termo de consentimento digital (LGPD) gerado e assinado no onboarding do paciente
- [ ] Histórico unificado por paciente: sessões, pagamentos, documentos, notas
- [ ] Status do paciente: ativo, em pausa, alta, transferido, abandono
- [ ] Busca e filtros por status, especialidade, plano de cobrança
- [ ] Spec completa: `product/features/prontuario.md`

#### Módulo 2 — Agendamentos Inteligentes
- [ ] Criação de sessões com recorrência (semanal, quinzenal, mensal)
- [ ] **Integração Google Calendar** — sincronização bidirecional, import de agenda existente
- [ ] Confirmação automática via WhatsApp (48h antes + lembrete 2h antes)
- [ ] Status de sessão: realizada, falta justificada, falta sem aviso, reagendada, cancelada
- [ ] Detecção de conflito de horário em tempo real
- [ ] Configuração de horários de atendimento do psicólogo (bloqueio automático fora do horário)
- [ ] Spec completa: `product/features/agenda.md`

#### Módulo 3 — Notas Clínicas Seguras + IA de Linhagem
- [ ] Prontuário por sessão com texto livre (voz para texto opcional)
- [ ] Tags de técnicas e abordagens utilizadas (TCC, ACT, Psicanálise, EMDR, Gestalt, etc.)
- [ ] Histórico imutável com criptografia AES-256 (dados só legíveis pelo psicólogo autenticado)
- [ ] **IA de Linhagem Terapêutica** — analisa o padrão das notas e identifica a abordagem predominante do psicólogo, treinada com obras de domínio público
- [ ] Exportação de prontuário completo em PDF (CFP 001/2009 compliant)
- [ ] Spec completa: `product/features/notas-ia.md`

#### Módulo 4 — Cobrança Automática Flexível
- [ ] Planos de cobrança por paciente: **por sessão**, **semanal** ou **mensal**
- [ ] PIX gerado e enviado automaticamente conforme o plano escolhido
- [ ] Recibo Receita Saúde gerado automaticamente após pagamento
- [ ] Política de cancelamento configurável (cobrar ou não falta sem aviso)
- [ ] Lembrete automático de pagamento pendente (1 vez, tom gentil)
- [ ] Spec completa: `product/features/cobranca.md`

#### Módulo 5 — Relatórios Financeiros
- [ ] Dashboard: recebido no mês, pendente, inadimplente, projeção
- [ ] Histórico mensal em gráfico de linha (últimos 12 meses)
- [ ] Relatório por paciente (total pago, sessões realizadas, taxa de falta)
- [ ] Exportação CSV para declaração de IR
- [ ] Comparativo mês a mês (crescimento de receita)

#### Módulo 6 — Insights de IA
- [ ] **Alerta de Risco de Abandono** — score automático por paciente, notificação antes que o paciente suma
- [ ] **Análise de Linhagem Terapêutica** — identifica abordagem predominante nas notas (TCC, psicanálise, humanista, etc.)
- [ ] **Sugestão de intervalo entre sessões** baseada no padrão histórico do paciente
- [ ] Spec completa: `product/features/notas-ia.md` + `product/features/alerta-abandono.md`

#### Módulo 7 — Proteção de Dados e Compliance
- [ ] Criptografia AES-256-GCM nos dados clínicos (client-side — nem o servidor lê)
- [ ] Row Level Security no banco (cada psicólogo acessa apenas seus dados)
- [ ] Histórico de auditoria imutável (quem acessou, quando, qual operação)
- [ ] Conformidade CFP: Res. 001/2009 (prontuário), Res. 06/2019 (documentos), Res. 09/2024 (tecnologia digital)
- [ ] Política de retenção de dados (20 anos conforme Lei 13.787/2018)
- [ ] Localização dos servidores no Brasil (São Paulo — Supabase)
- [ ] Exportação e anonimização de dados a pedido (direito LGPD)
- [ ] Spec completa: `docs/regulatory-compliance.md`

---

## 3. Roadmap por Fase

### v1.0 — MVP (Mês 2–3)
> Objetivo: 20 beta users validando o produto

- Agenda + Prontuário + Cobrança
- **Alerta de Abandono** (feature killer)
- Compliance LGPD + CFP básico
- Onboarding assistido (guiado, não self-serve)

### v1.5 — PMF (Mês 4–5)
> Objetivo: atingir >40% "muito desapontados" no survey PMF

- **Progress Tracking** com PHQ-9 e GAD-7 integrados (enviados ao paciente via link)
- **Portal do paciente** (acesso leve — apenas confirmar sessão e ver tarefas)
- Videochamada integrada (embeder Whereby ou Daily.co)
- Melhoria do onboarding (self-serve)

### v2.0 — Growth (Mês 6–8)
> Objetivo: 100 clientes pagantes

- **Income Clarity** — benchmarking de preços por cidade/especialidade/anos
- **Between Sessions** — prescrição de exercícios e diário de humor para o paciente
- Programa de indicação (psicólogo indica colega → 1 mês grátis para ambos)
- App mobile (PWA primeiro, nativo depois)

### v3.0 — Comunidade (Mês 9–12)
> Objetivo: 300 clientes + NPS > 60

- **Fórum de intervisão** de casos (anônimo por padrão)
- Grupos de supervisão por especialidade
- Newsletter semanal com insights clínicos da base de usuários (anonimizado)
- Multi-profissional (segundo psicólogo no mesmo consultório)

### v4.0 — Marketplace (Mês 12–18)
> Objetivo: R$100k MRR combinado

- **Marketplace de supervisores** certificados
- Take rate 15–20% sobre sessões de supervisão
- Certificação de supervisores pela plataforma
- Expansão para terapeutas (não só psicólogos)

---

## 4. User Stories Prioritárias (MVP)

### Epic 1: Onboarding
- **US-001:** Como psicólogo, quero criar minha conta e cadastrar meus primeiros 3 pacientes em menos de 10 minutos, para começar a usar sem treinamento
- **US-002:** Como psicólogo, quero migrar minha agenda do Google Calendar importando eventos, para não perder histórico ao trocar de sistema

### Epic 2: Agenda
- **US-003:** Como psicólogo, quero que meus pacientes recebam confirmação automática por WhatsApp 24h antes da sessão, para reduzir faltas sem eu ter que mandar mensagem
- **US-004:** Como psicólogo, quero marcar uma sessão como "falta justificada" ou "falta sem aviso", para ter histórico de padrão de frequência por paciente
- **US-005:** Como psicólogo, quero que a cobrança da sessão seja lançada automaticamente ao confirmar o atendimento, para não esquecer de cobrar

### Epic 3: Prontuário
- **US-006:** Como psicólogo, quero registrar a evolução de cada sessão em texto livre com campo de tags (técnica usada, temas abordados), para encontrar padrões ao longo do tempo
- **US-007:** Como psicólogo, quero saber que o prontuário não pode ser deletado ou alterado retroativamente, para me sentir protegido em caso de questionamento ético
- **US-008:** Como psicólogo, quero exportar o prontuário completo de um paciente em PDF, para encaminhar em caso de transferência de cuidados

### Epic 4: Alerta de Abandono
- **US-009:** Como psicólogo, quero receber um alerta quando um paciente apresentar padrão de risco de abandono, para agir antes que ele desapareça
- **US-010:** Como psicólogo, quero ver quais fatores contribuíram para o alerta (frequência de faltas, tempo sem sessão, falta de resposta a lembretes), para entender o contexto antes de ligar

### Epic 5: Financeiro
- **US-011:** Como psicólogo, quero enviar o link de pagamento PIX automaticamente após cada sessão confirmada, para não precisar cobrar manualmente por WhatsApp
- **US-012:** Como psicólogo, quero ver um dashboard com recebido/pendente/taxa de inadimplência por mês, para saber quanto realmente estou ganhando

---

## 5. Acceptance Criteria — Feature Killer (Alerta de Abandono)

Ver spec completa em `product/features/alerta-abandono.md`

**Critérios mínimos para considerar feature completa:**
- [ ] Score calculado automaticamente para todos os pacientes ativos, sem ação manual
- [ ] Notificação via email (e opcionalmente WhatsApp) quando score cai abaixo de limiar
- [ ] Painel de "Pacientes em Risco" visível no dashboard principal
- [ ] Ao clicar no alerta, psicólogo vê: histórico de frequência, última sessão, padrão de resposta a lembretes
- [ ] Falso positivo controlado: máximo 1 alerta sem relevância por semana por psicólogo

---

## 6. Métricas de Sucesso

### Produto
| Métrica | Meta MVP | Meta PMF |
|---------|---------|---------|
| Onboarding completion (conta criada → 1º prontuário) | >70% em 24h | >85% |
| Alertas de abandono clicados (engajamento) | >50% dos alertas | >70% |
| Sessões registradas por semana (ativação) | >80% dos usuários | >90% |
| NPS (Net Promoter Score) | >30 | >50 |
| Churn mensal | <8% | <5% |

### Negócio
| Métrica | Meta Mês 3 | Meta Mês 6 | Meta Mês 12 |
|---------|-----------|-----------|------------|
| Clientes pagantes | 20 | 80 | 300 |
| MRR | R$ 2.980 | R$ 11.920 | R$ 44.700 |
| CAC médio | < R$ 500 | < R$ 400 | < R$ 300 |
| LTV:CAC | > 3x | > 6x | > 10x |
