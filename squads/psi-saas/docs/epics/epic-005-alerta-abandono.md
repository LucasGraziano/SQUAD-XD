# Epic 005 — Alerta de Risco de Abandono (Feature Killer)

**Produto:** Vínculo  
**Agente:** @sm (River)  
**Status:** Ready  
**Dependência:** Epic 002 + Epic 004 concluídos (precisa de dados de sessões e pagamentos)

---

## Objetivo
Nenhum psicólogo do Vínculo perde um paciente sem ter sido avisado antes. O sistema detecta o padrão de desengajamento e notifica com contexto claro para o profissional agir.

---

## Stories

### Story 5.1 — Engine de Cálculo de Score de Risco
**Como** sistema, **quero** calcular diariamente o score de engajamento de cada paciente ativo, **para que** o psicólogo receba alertas baseados em dados reais.

**Critérios de Aceite:**
- [ ] Edge Function rodando diariamente às 08:00 BRT
- [ ] Score 0–100 calculado com 4 variáveis ponderadas:
  - Frequência de faltas recentes (35%)
  - Dias desde a última sessão realizada (25%)
  - Taxa de resposta a confirmações WhatsApp (20%)
  - Padrão de reagendamentos consecutivos (15%) ← se ≥3 regendamentos = risco alto
- [ ] Resultado salvo em `abandonment_scores` com nível: LOW / MEDIUM / HIGH / CRITICAL
- [ ] Pacientes com pausa planejada (`status = 'paused'`) excluídos do cálculo
- [ ] Pacientes em alta/abandono excluídos
- [ ] Mesma sessão não gera dois alertas em < 72h

**Estimativa:** 8h

---

### Story 5.2 — Notificação de Alerta (Email + Dashboard)
**Como** psicólogo, **quero** ser notificado quando um paciente apresenta risco de abandono, **para que** eu possa agir antes que ele desapareça.

**Critérios de Aceite:**
- [ ] Email enviado quando score ≥ 70 (HIGH) pela primeira vez ou após 72h sem dismissal
- [ ] Assunto: "[nome do paciente] pode estar se afastando"
- [ ] Corpo: última sessão há X dias, X faltas nas últimas 4 semanas, taxa de resposta
- [ ] Badge no dashboard: "Atenção (N)" com número de alertas ativos
- [ ] Painel "Pacientes em Atenção" no dashboard: lista ordenada por score (CRITICAL primeiro)
- [ ] Psicólogo pode configurar: receber alerta por WhatsApp também (opt-in)

**Estimativa:** 5h

---

### Story 5.3 — Tela de Detalhe do Alerta e Ações
**Como** psicólogo, **quero** ver o contexto completo do alerta e ter ações claras disponíveis, **para que** eu saiba exatamente o que aconteceu e o que fazer.

**Critérios de Aceite:**
- [ ] Tela de detalhe: score, nível, fatores que contribuíram (em linguagem humanizada)
- [ ] Gráfico de frequência: últimas 12 semanas (presença vs. falta, visual claro)
- [ ] Ações disponíveis:
  - "Enviar check-in" → abre template de mensagem WhatsApp editável pelo psicólogo
  - "Registrar contato realizado" → marca que já entrou em contato
  - "Pausar alertas deste paciente" → por 30 dias (férias combinadas, etc.)
  - "Dispensar alerta" → com campo de motivo
- [ ] Após ação: sistema não envia novo alerta por 72h
- [ ] Histórico de alertas anteriores para o mesmo paciente

**Estimativa:** 6h

---

## Definition of Done do Épico
- [ ] Score calculado corretamente para 10 pacientes simulados com dados conhecidos
- [ ] Email de alerta chegando na caixa de entrada (não spam) com conteúdo correto
- [ ] Dashboard mostrando alertas em tempo real
- [ ] Tela de detalhe com gráfico de frequência funcionando
- [ ] Teste: paciente de férias com `status = 'paused'` NÃO gera alerta
- [ ] Teste: paciente que faltou 3× seguidas → alerta HIGH gerado em até 24h
