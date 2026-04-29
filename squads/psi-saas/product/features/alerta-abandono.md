# Feature Spec — Alerta de Risco de Abandono

**Prioridade:** P0 — Feature Killer do MVP  
**Status:** Spec — aguarda validação com usuários  
**Agente responsável (quando build começar):** @dev (Dex)

---

## Por Que Esta Feature É o Diferencial

Abandono de paciente é a maior dor emocional não-operacional do psicólogo:
- Taxa de abandono precoce (antes da 5ª sessão): **40–60%** em psicoterapia (dado de literatura)
- Psicólogo interpreta abandono como **falha clínica** — mesmo quando é fator externo
- **Nenhum concorrente tem isso** — é território zero

Ao resolver isso, o produto deixa de ser "mais um software de agenda" e vira algo que nenhum psicólogo encontrou antes.

---

## Como o Sistema Detecta Risco

### Variáveis do Score de Engajamento (0–100)

| Variável | Peso | Como Mede |
|---------|------|-----------|
| Frequência de faltas recentes | 35% | Faltas nas últimas 4 semanas vs. histórico |
| Dias desde a última sessão realizada | 25% | Se > média histórica do paciente |
| Taxa de resposta a lembretes de confirmação | 20% | Últimas 4 semanas |
| Padrão de reagendamentos | 15% | Número de reagendamentos consecutivos |
| Tempo de resposta no WhatsApp (se integrado) | 5% | Opcional |

### Cálculo do Score

```javascript
// Pseudocódigo — implementação real em lib/risk-engine.ts
function calculateAbandonmentRisk(patientId: string): RiskScore {
  const patient = getPatient(patientId);
  const sessions = getLastNSessions(patientId, 8); // últimas 8 semanas
  
  const recentAbsenceRate = calcAbsenceRate(sessions, weeks: 4);
  const historicalAbsenceRate = calcAbsenceRate(sessions, weeks: 8);
  const daysSinceLastSession = getDaysSinceLastSession(patientId);
  const avgSessionInterval = getAvgSessionInterval(patientId);
  const confirmationResponseRate = getConfirmationResponseRate(patientId, weeks: 4);
  const reschedulePattern = getConsecutiveReschedules(patientId);
  
  // Score 0-100 onde 0 = sem risco, 100 = risco máximo
  const score = 
    (recentAbsenceRate / historicalAbsenceRate * 35) +
    (daysSinceLastSession / (avgSessionInterval * 1.5) * 25) +
    ((1 - confirmationResponseRate) * 20) +
    (reschedulePattern * 3.75); // máx 4 consecutivos = 15 pontos
  
  return {
    score: Math.min(score, 100),
    level: score > 70 ? 'HIGH' : score > 45 ? 'MEDIUM' : 'LOW',
    factors: getTopFactors(score, patient)
  };
}
```

### Limiares de Alerta

| Score | Nível | Ação |
|-------|-------|------|
| 0–44 | 🟢 Engajado | Nenhuma — exibir no painel como saudável |
| 45–69 | 🟡 Atenção | Destacar no painel — sem notificação push |
| 70–89 | 🟠 Risco | Notificação no app + email |
| 90–100 | 🔴 Crítico | Notificação urgente + sugestão de ação imediata |

---

## UX do Alerta

### Dashboard Principal
```
┌─────────────────────────────────────────────────────┐
│  Pacientes em Atenção                          3 →  │
│  ┌──────────────────────────────────────────────┐   │
│  │ 🔴  Ana Lima       Score 87  Última: 18 dias  │   │
│  │ 🟠  Pedro Rocha    Score 71  3 faltas seguidas│   │
│  │ 🟡  Maria Santos   Score 52  Reagendou 2x    │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Tela de Detalhe do Alerta (ao clicar)
```
┌─────────────────────────────────────────────────────┐
│  Ana Lima — Risco de Abandono ALTO                  │
│                                                     │
│  Score: 87/100                                      │
│                                                     │
│  Por que esse alerta?                               │
│  ● Última sessão realizada: há 18 dias              │
│    (sua média com ela: 8 dias)                      │
│  ● Não respondeu 3 dos últimos 4 lembretes          │
│  ● Faltou 2 sessões nas últimas 4 semanas           │
│                                                     │
│  Histórico de frequência (12 semanas)               │
│  [gráfico de barras — presença vs. falta]           │
│                                                     │
│  O que você pode fazer:                             │
│  💬 Enviar mensagem de check-in                     │
│  📅 Propor reagendamento com flexibilidade          │
│  📝 Registrar nota sobre este padrão                │
│                                                     │
│  [Dispensar Alerta]  [Registrar Contato Realizado]  │
└─────────────────────────────────────────────────────┘
```

---

## Notificação (Email + WhatsApp opcional)

**Assunto do email:** *"[Nome do paciente] pode estar se afastando"*

**Corpo:**
> Olá, [Psicólogo].
>
> Identificamos um padrão de atenção com **Ana Lima**: ela não comparece há 18 dias (sua média habitual é de 8 dias entre sessões) e não respondeu aos últimos 3 lembretes.
>
> Às vezes, um contato proativo antes que o paciente decida parar pode fazer toda a diferença.
>
> [Ver detalhes no sistema →]

---

## Cálculo de Valor para o Psicólogo

Se o alerta salvar 1 paciente por mês que teria abandonado:
- Paciente médio: R$ 200/sessão × 4 sessões/mês = **R$ 800/mês retido**
- O produto custa R$ 149/mês
- **ROI: 5,4x só com 1 paciente salvo**

Esta matemática deve estar visível na landing page e no onboarding.

---

## Considerações Éticas

- **Jamais sugerir "como manter o paciente" de forma manipulativa** — o tom deve ser sempre clínico ("fortalecer a aliança terapêutica")
- O psicólogo decide o que fazer — o produto apenas informa
- Dados de score nunca são compartilhados com o paciente
- O psicólogo pode desativar alertas para pacientes específicos (ex: fim natural de processo)

---

## Dados Necessários (Schema)

```sql
-- Tabela de sessões (base para o cálculo)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  psychologist_id UUID REFERENCES psychologists(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('confirmed', 'completed', 'absent_justified', 'absent_no_notice', 'rescheduled', 'cancelled')),
  confirmation_sent_at TIMESTAMPTZ,
  confirmation_responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de scores de abandono (calculados em background job)
CREATE TABLE abandonment_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  psychologist_id UUID REFERENCES psychologists(id),
  score NUMERIC(5,2) NOT NULL,
  level TEXT CHECK (level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  factors JSONB, -- os fatores que contribuíram
  calculated_at TIMESTAMPTZ DEFAULT now(),
  alerted_at TIMESTAMPTZ, -- quando o psicólogo foi notificado
  dismissed_at TIMESTAMPTZ -- quando psicólogo dispensou o alerta
);

-- Index para queries de dashboard
CREATE INDEX idx_scores_psychologist_level 
ON abandonment_scores(psychologist_id, level, calculated_at DESC);
```

---

## Background Job (cron)

```javascript
// Executar diariamente às 08:00 BRT
// Recalcular scores de todos os pacientes ativos

async function recalculateAllScores() {
  const activePatients = await getActivePatients();
  
  for (const patient of activePatients) {
    const score = await calculateAbandonmentRisk(patient.id);
    await upsertScore(patient.id, score);
    
    if (score.level === 'HIGH' || score.level === 'CRITICAL') {
      const lastAlert = await getLastAlert(patient.id);
      const hoursSinceLastAlert = getHoursDiff(lastAlert?.alerted_at, now());
      
      // Não notificar mais de uma vez por 72h para o mesmo paciente
      if (!lastAlert || hoursSinceLastAlert > 72) {
        await sendAlert(patient.psychologist_id, patient.id, score);
      }
    }
  }
}
```

---

## Definition of Done

- [ ] Score calculado corretamente para 10 pacientes de teste com dados simulados
- [ ] Dashboard exibe painel "Pacientes em Atenção" com score e nível
- [ ] Tela de detalhe exibe os fatores de risco em linguagem humanizada
- [ ] Email de alerta enviado automaticamente quando score ≥ 70
- [ ] Psicólogo pode dispensar alerta (e sistema não notifica novamente por 72h)
- [ ] Falso positivo testado: paciente de férias combinadas não gera alerta (flag "pausa planejada")
- [ ] Testado com 5 psicólogos beta — feedback incorporado
