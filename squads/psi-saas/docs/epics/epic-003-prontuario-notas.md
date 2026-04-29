# Epic 003 — Prontuário + Notas Clínicas + IA de Linhagem

**Produto:** Vínculo  
**Agente:** @sm (River)  
**Status:** Ready  
**Dependência:** Epic 002 concluído

---

## Objetivo
Prontuário eletrônico seguro, imutável e em conformidade com CFP 001/2009, com IA que identifica a linhagem terapêutica do psicólogo a partir das suas próprias notas.

---

## Stories

### Story 3.1 — Editor de Notas Clínicas com Criptografia
**Como** psicólogo, **quero** registrar a evolução de cada sessão em um editor seguro, **para que** o conteúdo seja legível apenas por mim, mesmo que os servidores sejam comprometidos.

**Critérios de Aceite:**
- [ ] Editor de texto rico (negrito, itálico, listas)
- [ ] Botão de voz para texto (Web Speech API — sem custo)
- [ ] Tags de técnicas utilizadas (TCC, ACT, EMDR, Gestalt, Psicanálise, Sistêmica, IFS, DBT, Humanista + custom)
- [ ] Tags de temas da sessão (texto livre + sugestões automáticas)
- [ ] Campo de tarefas prescritas (lista)
- [ ] Campo de objetivos para a próxima sessão
- [ ] Criptografia AES-256-GCM **no browser** antes de enviar ao servidor
- [ ] Chave derivada da senha (PBKDF2) — apenas na memória da sessão
- [ ] Indicador visual "🔒 Nota criptografada — apenas você pode ler"

**Estimativa:** 10h

---

### Story 3.2 — Imutabilidade e Histórico de Prontuário
**Como** psicólogo, **quero** ter certeza de que meu prontuário é imutável e auditável, **para que** eu esteja protegido em caso de questionamento ético ou legal.

**Critérios de Aceite:**
- [ ] Notas editáveis apenas dentro de 24h (trigger no PostgreSQL bloqueia após isso)
- [ ] Após 24h: apenas "notas adicionais" (append-only) são permitidas
- [ ] Timeline do paciente: todas as sessões em ordem cronológica
- [ ] Cada entrada exibe: data/hora, status da sessão, técnicas, temas (sem descriptografar até clicar)
- [ ] Ao clicar em uma nota: descriptografia no browser, exibição do conteúdo
- [ ] Audit log: toda visualização registrada com timestamp

**Estimativa:** 6h

---

### Story 3.3 — Exportação de Prontuário em PDF (CFP Compliant)
**Como** psicólogo, **quero** exportar o prontuário completo de um paciente em PDF, **para que** possa encaminhar para outro profissional ou apresentar ao CRP se necessário.

**Critérios de Aceite:**
- [ ] PDF gerado no browser (após descriptografar notas no cliente)
- [ ] Cabeçalho: logo Vínculo + nome do psicólogo + CRP + data de exportação
- [ ] Seções: Identificação do paciente, Demanda inicial, Objetivos, Histórico de sessões
- [ ] Cada sessão: data, status, duração, técnicas utilizadas, conteúdo da nota
- [ ] Rodapé: "Exportado de Vínculo em [data] — uso exclusivo do profissional responsável"
- [ ] Download imediato (não envia por email — segurança)
- [ ] Registro no audit log

**Estimativa:** 5h

---

### Story 3.4 — IA de Linhagem Terapêutica (MVP)
**Como** psicólogo, **quero** ver um painel que mostre qual abordagem terapêutica estou usando predominantemente, **para que** eu possa refletir sobre minha prática clínica.

**Critérios de Aceite:**
- [ ] Job semanal analisa todas as notas dos últimos 30 dias
- [ ] Notas descriptografadas no cliente → apenas resultado JSON vai para a API
- [ ] Claude Haiku classifica: abordagem predominante + técnicas + temas
- [ ] Painel "Meu Perfil Clínico" com:
  - Barra horizontal: % de cada abordagem (TCC 68%, Humanista 32%)
  - Lista das top 5 técnicas utilizadas com contagem
  - Mapa: tema → abordagem predominante
  - Insight em texto: "Nas últimas 4 semanas você integrou mais elementos de ACT"
- [ ] Confiança da classificação exibida (ex: "Análise de 24 sessões — 82% de confiança")
- [ ] Feature pode ser desativada em configurações
- [ ] Disclaimer: "Análise baseada em padrões linguísticos — não substitui supervisão clínica"

**Estimativa:** 10h

---

## Definition of Done do Épico
- [ ] Nota clínica salva, criptografada e legível apenas pelo psicólogo autenticado
- [ ] Trigger de imutabilidade testado (tentativa de editar nota antiga retorna erro)
- [ ] PDF exportado com todos os campos CFP 001/2009
- [ ] IA de linhagem funcionando para 3 abordagens diferentes (testado com notas reais)
- [ ] Psicólogo não consegue ler notas sem estar autenticado
