# Epic 004 — Cobrança Automática + Financeiro

**Produto:** Vínculo  
**Agente:** @sm (River)  
**Status:** Ready  
**Dependência:** Epic 002 concluído

---

## Objetivo
Psicólogo nunca mais precisa cobrar paciente manualmente. PIX vai automaticamente, recibo é gerado, relatórios mostram a saúde financeira real do consultório.

---

## Stories

### Story 4.1 — Cobrança Automática por Sessão (PIX)
**Como** psicólogo, **quero** que o link de pagamento PIX seja enviado automaticamente ao paciente após cada sessão realizada, **para que** eu nunca precise cobrar pelo WhatsApp.

**Critérios de Aceite:**
- [ ] Ao marcar sessão como "Realizada": PIX criado no Pagar.me automaticamente
- [ ] Link PIX enviado via WhatsApp para o paciente (configurável: imediato ou após 1h)
- [ ] Mensagem gentil: "Olá [nome]! Segue o link para o pagamento de hoje (R$ [valor]): [link]. Qualquer dúvida, estou à disposição!"
- [ ] Webhook Pagar.me → ao pagar: status atualizado para "paid"
- [ ] Notificação para o psicólogo: "Pedro pagou R$ 200 ✓"
- [ ] PIX com validade configurável (padrão: 24h)

**Estimativa:** 8h

---

### Story 4.2 — Cobranças Semanais e Mensais
**Como** psicólogo, **quero** configurar cobrança semanal ou mensal para certos pacientes, **para que** eu não precise gerar PIX a cada sessão individualmente.

**Critérios de Aceite:**
- [ ] Por paciente: configurar ciclo (por sessão / semanal / mensal)
- [ ] Cobrança semanal: gerada automaticamente toda segunda-feira pela manhã referente à semana anterior
- [ ] Cobrança mensal: gerada automaticamente no dia 1 referente ao mês anterior
- [ ] Valor calculado: número de sessões realizadas × valor por sessão
- [ ] PIX enviado automaticamente ao gerar
- [ ] Histórico de cobranças por período visível no perfil do paciente

**Estimativa:** 6h

---

### Story 4.3 — Recibo Receita Saúde + Gestão de Inadimplência
**Como** psicólogo, **quero** que o recibo seja gerado automaticamente após o pagamento e que eu veja claramente quem está inadimplente, **para que** não precise controlar isso manualmente.

**Critérios de Aceite:**
- [ ] Recibo no formato Receita Saúde gerado automaticamente após pagamento confirmado
- [ ] Recibo enviado por email ao paciente (e disponível para download)
- [ ] Lembrete automático de pagamento: 1 vez, 24h após o PIX não ser pago (tom gentil)
- [ ] Após 72h sem pagamento: alerta para o psicólogo (sem novo lembrete ao paciente)
- [ ] Lista de inadimplentes no dashboard financeiro (nome, valor, dias em atraso)
- [ ] Psicólogo pode marcar pagamento como "dispensado" (com motivo)

**Estimativa:** 6h

---

### Story 4.4 — Dashboard Financeiro e Relatórios
**Como** psicólogo, **quero** ver um dashboard com a saúde financeira real do meu consultório, **para que** saiba exatamente quanto estou ganhando e onde estou perdendo.

**Critérios de Aceite:**
- [ ] Cards principais: Recebido no mês, A receber, Inadimplente, Projeção do mês
- [ ] Gráfico de linha: receita mensal últimos 12 meses
- [ ] Taxa de inadimplência em % (em relação ao total cobrado)
- [ ] Ticket médio por sessão
- [ ] Top 5 pacientes por receita gerada
- [ ] Relatório por paciente: sessões realizadas, total pago, total pendente
- [ ] Exportação CSV para declaração de IR
- [ ] Filtros: por mês, por período customizado, por paciente

**Estimativa:** 8h

---

## Definition of Done do Épico
- [ ] PIX gerado e enviado automaticamente após sessão realizada (testado end-to-end)
- [ ] Webhook Pagar.me atualizando status em tempo real
- [ ] Recibo enviado ao paciente após pagamento
- [ ] Dashboard financeiro exibindo dados reais de pelo menos 1 mês de uso
- [ ] Export CSV funcionando e importando corretamente no Excel/Sheets
