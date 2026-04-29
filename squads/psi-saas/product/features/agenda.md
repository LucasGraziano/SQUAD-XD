# Feature Spec — Agenda Inteligente

**Prioridade:** P0 — Core MVP (parity)

---

## Funcionalidades Core

### Cadastro de Sessão
- Data, hora, duração (50 min padrão, configurável)
- Modalidade: Presencial / Online / Grupo
- Paciente (seleção da lista)
- Recorrência: semanal, quinzenal, mensal (maioria das terapias é semanal fixa)
- Valor da sessão (pré-preenchido com o valor padrão do paciente)

### Confirmação Automática por WhatsApp
- 48h antes: "Olá [nome], confirmamos sua sessão com [psicólogo] amanhã às [hora]. Responda S para confirmar ou N para cancelar."
- 2h antes: lembrete final (apenas se não respondeu)
- Sem resposta = considerado "não confirmado" → aparece em destaque no dashboard

### Status de Sessão
- Agendada / Confirmada / Realizada / Falta justificada / Falta sem aviso / Cancelada pelo paciente / Cancelada pelo psicólogo / Reagendada

### Sincronização Google Calendar
- Import: importar eventos existentes na criação da conta
- Export: toda sessão criada aparece no Google Calendar do psicólogo
- Bidirecional opcional (cuidado com conflitos)

### Visualizações
- **Semanal** (padrão) — visão geral da agenda da semana
- **Diária** — detalhe do dia com espaçamento entre sessões
- **Mensal** — visão de ocupação / slots livres

---

## Regras de Negócio

- **Conflito de horário:** sistema bloqueia agendamento em slot ocupado
- **Intervalo mínimo:** psicólogo pode configurar intervalo mínimo entre sessões (ex: 10 min)
- **Horário de atendimento:** psicólogo define dias e horários disponíveis — sistema só permite agendamentos dentro desses limites
- **Feriados:** sistema avisa quando sessão cai em feriado nacional

---

## Integração com Cobrança

Quando sessão muda para status "Realizada":
→ Lançamento automático de cobrança no módulo financeiro  
→ PIX enviado automaticamente (se configurado)  
→ Prontuário da sessão é criado com data/hora pré-preenchida

---

## Integração com Alerta de Abandono

Status de cada sessão alimenta o score de risco:
- "Falta sem aviso" → impacta negativamente o score
- "Falta justificada" → impacto menor
- "Confirmada" → impacto positivo
- "Reagendada repetidamente" → padrão de risco
