# Conformidade Regulatória — CFP + LGPD

**Criticidade:** BLOQUEANTE — produto não pode ir ao ar sem conformidade total  
**Última revisão:** Abril 2026

---

## 1. Resoluções CFP Aplicáveis

### Resolução CFP nº 001/2009 — Prontuário Psicológico
**O que exige:**
- Prontuário é OBRIGATÓRIO para toda prestação de serviço psicológico
- Deve conter:
  - Identificação do usuário/instituição
  - Avaliação da demanda e definição dos objetivos do trabalho
  - Registro da evolução do trabalho (sessão a sessão)
  - Registro de encaminhamento ou encerramento
  - Cópias de outros documentos produzidos pelo psicólogo
- Pode ser manuscrito, impresso ou **digital** (desde que seguro)
- Prazo de guarda: **mínimo 5 anos** após último registro
- Lei 13.787/2018: prazo para eliminação do prontuário: **20 anos** após último registro

**O que o produto precisa fazer:**
- [ ] Estrutura de prontuário com todos os campos obrigatórios
- [ ] Impossibilidade de deletar registros (apenas arquivar)
- [ ] Histórico imutável com timestamp de cada entrada
- [ ] Exportação de prontuário completo em PDF (para o psicólogo)
- [ ] Retenção de dados por 20 anos mínimo (política de armazenamento)

---

### Resolução CFP nº 06/2019 — Documentos Psicológicos
**O que exige:**
- Todo documento psicológico (laudo, atestado, relatório, declaração) deve seguir estrutura específica
- Deve ter: identificação do solicitante, descrição do que foi avaliado, fundamentação técnica, conclusão, assinatura e CRP

**O que o produto precisa fazer:**
- [ ] Templates de documentos em conformidade com Res. 06/2019
- [ ] Campo para número de CRP obrigatório no cadastro do psicólogo
- [ ] Assinatura digital nos documentos (ou pelo menos indicação de responsabilidade)
- [ ] PDF gerado com todos os campos obrigatórios preenchidos

---

### Resolução CFP nº 09/2024 — Tecnologias Digitais (mais recente)
**O que exige:**
- Regulamenta o atendimento mediado por TDICs (Tecnologias Digitais de Informação e Comunicação)
- **Revogou o e-Psi** (cadastro obrigatório em plataforma CFP) — plataforma encerrada em agosto 2024
- O profissional é responsável por garantir que a tecnologia usada seja:
  - Tecnicamente adequada
  - Metodologicamente pertinente
  - Eticamente respaldada
- Não define plataforma específica — cabe ao profissional demonstrar adequação
- Conformidade com LGPD é requisito implícito

**O que o produto precisa fazer:**
- [ ] Certificado SSL ativo (HTTPS obrigatório)
- [ ] Videochamada com criptografia end-to-end (ou integração com ferramenta que tenha)
- [ ] Documentação clara de segurança disponível para o psicólogo apresentar se questionado
- [ ] Política de Privacidade específica para dados clínicos

---

## 2. LGPD — Lei Geral de Proteção de Dados (Lei 13.709/2018)

### Dados Sensíveis — Atenção Máxima
Dados de saúde são classificados como **dados sensíveis** pela LGPD (Art. 5º, II).  
Isso implica:
- Tratamento requer **consentimento específico e destacado**
- Medidas de segurança reforçadas obrigatórias
- Relatório de Impacto à Proteção de Dados (RIPD) recomendado
- Encarregado (DPO) pode ser exigido dependendo do volume

### Obrigações Técnicas

| Obrigação | Implementação no Produto |
|-----------|-------------------------|
| Consentimento informado | Termo digital com checkbox explícito na criação de cada paciente |
| Finalidade específica | Dados clínicos só usados para gestão do prontuário daquele psicólogo |
| Minimização de dados | Coletar apenas o necessário — sem dados supérfluos |
| Segurança | Criptografia AES-256 at-rest + TLS 1.3 in-transit |
| Direito de acesso | Psicólogo pode exportar todos os dados de um paciente |
| Direito de exclusão | Possibilidade de anonimizar (não deletar — prazo de guarda CFP prevalece) |
| Notificação de incidente | Processo documentado para notificar ANPD em caso de vazamento (72h) |
| Portabilidade | Exportação de dados em formato aberto (CSV/JSON) |

### Modelo de Responsabilidade
- **Psicólogo = Controlador** (decide o que coletar e por quê)
- **Plataforma = Operador** (processa em nome do psicólogo)
- Contrato de DPA (Data Processing Agreement) obrigatório entre plataforma e psicólogo

---

## 3. Implementação Técnica (Supabase)

```sql
-- Row Level Security: cada psicólogo vê apenas seus pacientes
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "psicólogo vê apenas seus pacientes"
ON pacientes
USING (auth.uid() = psicologo_id);

-- Prontuário imutável — apenas INSERT, nunca UPDATE/DELETE
ALTER TABLE prontuario_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entradas de prontuário — apenas leitura e inserção"
ON prontuario_entries
FOR SELECT USING (auth.uid() = psicologo_id);

CREATE POLICY "inserir entrada de prontuário"
ON prontuario_entries
FOR INSERT WITH CHECK (auth.uid() = psicologo_id);
-- Sem UPDATE policy e sem DELETE policy = imutabilidade garantida
```

**Criptografia adicional para campos ultra-sensíveis:**
```javascript
// Campos como "conteúdo da sessão" criptografados no cliente antes de salvar
import { encrypt, decrypt } from '@/lib/crypto'; // AES-256-GCM

const encryptedContent = await encrypt(sessionNotes, userDerivedKey);
// Salva apenas o conteúdo criptografado — nem o servidor lê
```

---

## 4. Documentos Legais Necessários

- [ ] **Termos de Uso** — relação entre plataforma e psicólogo
- [ ] **Política de Privacidade** — dados do psicólogo E dos pacientes (indiretos)
- [ ] **DPA (Data Processing Agreement)** — contrato de operador x controlador
- [ ] **Termo de Consentimento do Paciente** — gerado pela plataforma, assinado digitalmente
- [ ] **Política de Retenção de Dados** — define os 20 anos de guarda
- [ ] **Plano de Resposta a Incidentes** — para notificação ANPD em 72h

---

## 5. Checklist de Conformidade Pré-Launch

- [ ] Advogado especialista em LGPD + saúde revisou os termos
- [ ] Prontuário testado contra Resolução 001/2009 (campos obrigatórios)
- [ ] Documentos testados contra Resolução 06/2019 (estrutura)
- [ ] Videochamada integrada com criptografia verificada
- [ ] RLS ativo e testado no Supabase (cada usuário vê apenas seus dados)
- [ ] Criptografia at-rest ativa no Supabase (padrão — verificar)
- [ ] HTTPS + certificado válido
- [ ] Política de backups + localização dos dados no Brasil (LGPD recomenda)
- [ ] Processo de exclusão/anonimização documentado
- [ ] Notificação de incidente: responsável definido + template de notificação ANPD

---

*Fontes: Resolução CFP 001/2009, Resolução CFP 06/2019, Resolução CFP 09/2024, Lei 13.709/2018 (LGPD), Lei 13.787/2018*
