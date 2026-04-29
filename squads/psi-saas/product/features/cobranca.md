# Feature Spec — Cobrança Automática

**Prioridade:** P0 — Core MVP (parity)  
**Integração:** Pagar.me (BR-first, PIX nativo)

---

## Por Que Esta Feature É Crítica

O psicólogo tem **bloqueio emocional** com cobrança — cobrar parece antiético, lembrar de dívida parece agressivo. O produto precisa fazer isso POR ELE, de forma gentil e automática, para que ele nunca precise ter essa conversa constrangedora.

---

## Fluxo de Cobrança Automática

```
Sessão REALIZADA
      ↓
Lançar cobrança no sistema (automático)
      ↓
Enviar link PIX por WhatsApp (configurável: imediato ou após 1h)
      ↓
Pagamento recebido? → Marcar como pago + emitir recibo
      ↓
Não pago em 24h? → Lembrete automático gentil
      ↓
Não pago em 72h? → Alerta para o psicólogo (sem lembrar o paciente de novo)
```

**Tom da mensagem de cobrança:**
> "Olá [nome]! Aqui está o link para o pagamento da sua sessão de hoje (R$ [valor]): [link PIX]
> 
> Qualquer dúvida, estou à disposição. Abraços!"

*Nunca: "Seu pagamento está em atraso." — tom gentil sempre.*

---

## Funcionalidades

### Configuração por Paciente
- Valor padrão da sessão
- Forma de cobrança: PIX automático / boleto / manual (para quem usa plano de saúde)
- Política de cancelamento: cobrar ou não cobrar falta sem aviso (configurável)
- Desconto configurável (ex: psicólogos que cobram menos de alguns pacientes)

### Dashboard Financeiro
- Recebido no mês
- Pendente (a receber)
- Inadimplente (>7 dias sem pagamento)
- Projeção do mês (baseada na agenda)
- Histórico mensal (gráfico de linha)

### Recibo Receita Saúde
- Geração automática após pagamento confirmado
- Formato correto para reembolso INSS/plano de saúde
- Nome, CRP, data, valor, CPF do paciente
- Download PDF + envio por email automático

### Gestão de Inadimplência
- Lista de pacientes com pagamento pendente > X dias (configurável)
- Template de mensagem de cobrança (gentil) que o psicólogo pode adaptar
- Histórico de cobranças por paciente
- **O sistema nunca envia cobrança automática além do 1º lembrete — decisão humana sempre**

---

## Schema Básico

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  patient_id UUID REFERENCES patients(id),
  psychologist_id UUID REFERENCES psychologists(id),
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'waived', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('pix', 'boleto', 'card', 'manual')),
  pix_link TEXT,
  paid_at TIMESTAMPTZ,
  receipt_url TEXT,
  reminder_count INTEGER DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Integração Pagar.me

```javascript
// Criar cobrança PIX
const charge = await pagarme.orders.create({
  customer: { name: patient.name, email: patient.email, type: 'individual' },
  items: [{ amount: session.price_cents, description: 'Sessão de psicoterapia', quantity: 1 }],
  payments: [{ payment_method: 'pix', pix: { expires_in: 86400 } }] // 24h
});

const pixLink = charge.charges[0].last_transaction.qr_code_url;
// Enviar pixLink via WhatsApp para o paciente
```
