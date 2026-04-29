# Epic 002 — Gestão de Pacientes + Agenda Inteligente

**Produto:** Vínculo  
**Agente:** @sm (River)  
**Status:** Ready  
**Dependência:** Epic 001 concluído

---

## Objetivo
O psicólogo consegue cadastrar pacientes, gerenciar toda a agenda com confirmação automática via WhatsApp e integração com Google Calendar.

---

## Stories

### Story 2.1 — Cadastro e Perfil de Paciente
**Como** psicólogo, **quero** cadastrar um novo paciente com todos os dados necessários e gerar o termo de consentimento digital, **para que** esteja em conformidade com a LGPD desde o primeiro contato.

**Critérios de Aceite:**
- [ ] Formulário: nome, nascimento, email, telefone, contato de emergência
- [ ] Campo: demanda inicial (texto livre)
- [ ] Campo: valor por sessão (padrão = valor configurado, mas editável por paciente)
- [ ] Campo: ciclo de cobrança (por sessão / semanal / mensal)
- [ ] Geração automática do termo de consentimento digital
- [ ] Envio do termo via WhatsApp (link para assinar digitalmente com timestamp)
- [ ] Status do paciente: Ativo por padrão
- [ ] Listagem de pacientes com busca por nome e filtro por status

**Estimativa:** 6h

---

### Story 2.2 — Agenda Semanal + Criação de Sessões
**Como** psicólogo, **quero** criar sessões na minha agenda com recorrência automática, **para que** não precise agendar uma a uma manualmente toda semana.

**Critérios de Aceite:**
- [ ] Visão semanal da agenda (seg–dom)
- [ ] Criar sessão: paciente, data/hora, duração, modalidade, recorrência (semanal/quinzenal/mensal/única)
- [ ] Validação de conflito de horário em tempo real
- [ ] Edição e cancelamento de sessão individual ou de toda a recorrência
- [ ] Destaque visual por status (agendada, confirmada, realizada, falta)
- [ ] Visão diária com lista ordenada de sessões

**Estimativa:** 8h

---

### Story 2.3 — Confirmação Automática via WhatsApp
**Como** psicólogo, **quero** que meus pacientes recebam confirmação automática pelo WhatsApp antes de cada sessão, **para que** eu não precise confirmar manualmente e as faltas diminuam.

**Critérios de Aceite:**
- [ ] Envio automático 48h antes: "Olá [nome], confirmando sua sessão com [psicólogo] amanhã às [hora]. Responda S para confirmar ou N para cancelar."
- [ ] Lembrete 2h antes (apenas se não respondeu)
- [ ] Resposta "S" → sessão marcada como confirmada no sistema
- [ ] Resposta "N" → notificação para o psicólogo + sessão marcada como cancelada
- [ ] Se WhatsApp não conectado: email como fallback
- [ ] Psicólogo pode desativar lembretes por sessão ou por paciente

**Estimativa:** 6h

---

### Story 2.4 — Integração Google Calendar
**Como** psicólogo, **quero** que minha agenda do Vínculo sincronize com meu Google Calendar, **para que** eu veja tudo em um só lugar.

**Critérios de Aceite:**
- [ ] OAuth 2.0 com Google Calendar (scope: calendar.events)
- [ ] Ao criar sessão no Vínculo → evento criado no Google Calendar
- [ ] Ao cancelar/reagendar → evento atualizado no Google Calendar
- [ ] Import inicial: importar eventos existentes do Google Calendar ao conectar
- [ ] Psicólogo pode desconectar a integração nas configurações
- [ ] Graceful fallback: se Google Calendar indisponível, sistema continua funcionando

**Estimativa:** 8h

---

### Story 2.5 — Registro Rápido de Sessão Realizada
**Como** psicólogo, **quero** registrar que uma sessão foi realizada em até 3 toques, **para que** o prontuário e a cobrança sejam acionados sem fricção.

**Critérios de Aceite:**
- [ ] Botão "Registrar sessão" acessível na agenda e no dashboard
- [ ] Selecionar: Realizada / Falta justificada / Falta sem aviso / Reagendada
- [ ] Se "Realizada": abre editor de nota clínica (opcional — pode salvar depois)
- [ ] Ao confirmar: cobrança lançada automaticamente (se configurado)
- [ ] Feedback visual imediato (toast de confirmação)
- [ ] Histórico de status da sessão visível na timeline do paciente

**Estimativa:** 4h

---

## Definition of Done do Épico
- [ ] Psicólogo cadastra paciente em < 3 minutos
- [ ] Agenda semanal funcional com recorrência
- [ ] WhatsApp enviando confirmações automaticamente (testado com 2 pacientes reais)
- [ ] Google Calendar sincronizando nos dois sentidos
- [ ] Mobile: todas as telas funcionais em 375px
