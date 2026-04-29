# Feature Spec — Prontuário Eletrônico

**Prioridade:** P0 — Core MVP (parity)  
**Conformidade:** CFP Resolução 001/2009 + LGPD + Lei 13.787/2018

---

## Campos Obrigatórios (CFP 001/2009)

Todo prontuário deve conter:
1. **Identificação do paciente** — nome, data de nascimento, contato, responsável legal (se menor)
2. **Demanda inicial** — o que trouxe o paciente à terapia (registro livre)
3. **Objetivos do trabalho** — o que será trabalhado (atualizado ao longo do processo)
4. **Evolução por sessão** — registro de cada atendimento
5. **Encaminhamentos** — se o paciente foi encaminhado para outro profissional
6. **Encerramento** — motivo de encerramento do processo (alta, abandono, encaminhamento, etc.)
7. **Documentos produzidos** — laudos, relatórios, atestados vinculados ao paciente

---

## Estrutura da Evolução por Sessão

```
Data: [automático]
Duração: [50 min / personalizado]
Modalidade: [Presencial / Online]
Status: [Realizada / Falta justificada / Falta sem aviso / Reagendada]

Evolução: [texto livre — campo principal]
Técnicas utilizadas: [tags — TCC, ACT, Psicanálise, EMDR, Gestalt, etc.]
Temas abordados: [tags livres — família, trabalho, ansiedade, etc.]
Tarefas prescritas: [lista — para o portal do paciente futuramente]
Próxima sessão: [data sugerida]
```

---

## Regras de Imutabilidade (LGPD + CFP)

- Entradas de evolução **não podem ser deletadas ou editadas** após 24h
- Dentro das 24h: pode editar com registro de "editado às [hora]"
- Após 24h: apenas **anotações adicionais** — nunca sobrescrever
- Logs de acesso: toda visualização de prontuário é registrada com timestamp e IP

---

## Schema

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID REFERENCES psychologists(id) NOT NULL,
  full_name TEXT NOT NULL,
  birth_date DATE,
  email TEXT,
  phone TEXT,
  emergency_contact JSONB,
  legal_guardian JSONB, -- para menores
  demand_description TEXT, -- demanda inicial
  therapeutic_goals TEXT, -- objetivos do trabalho
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'discharged', 'transferred', 'abandoned')),
  discharge_reason TEXT,
  consent_signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) NOT NULL,
  psychologist_id UUID REFERENCES psychologists(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  content_encrypted TEXT NOT NULL, -- AES-256-GCM encrypted
  techniques TEXT[], -- array de tags
  themes TEXT[], -- array de tags
  tasks_prescribed TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  edited_at TIMESTAMPTZ, -- apenas se editado dentro de 24h
  -- SEM updated_at para garantir imutabilidade
  CONSTRAINT no_future_notes CHECK (created_at <= now() + interval '1 hour')
);

-- Trigger para bloquear UPDATE após 24h
CREATE OR REPLACE FUNCTION prevent_note_edit_after_24h()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.created_at < now() - interval '24 hours' THEN
    RAISE EXCEPTION 'Não é possível editar registros com mais de 24 horas (CFP 001/2009)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_note_immutability
BEFORE UPDATE ON session_notes
FOR EACH ROW EXECUTE FUNCTION prevent_note_edit_after_24h();
```

---

## Exportação PDF

Formato obrigatório do PDF exportado:
- Cabeçalho: nome do psicólogo + CRP + data de exportação
- Identificação do paciente (dados básicos)
- Linha do tempo de sessões (data, status, duração)
- Conteúdo de cada evolução (descriptografado na exportação pelo psicólogo autenticado)
- Assinatura digital (nome + CRP + data)
- Rodapé: "Documento exportado de [nome do produto] em [data] — uso exclusivo do psicólogo responsável"
