# /conclave - Multi-Agent Deliberation

Convoca multiplos agentes AIOX para deliberar sobre uma decisao e produzir uma recomendacao sintetizada.

## Uso

```
/conclave {pergunta}                    # Auto-seleciona agentes relevantes (v2 com deliberation roles)
/conclave --agents copy-chief,analyst {pergunta}  # Agentes especificos
/conclave --size small|medium|large {pergunta}    # Controla tamanho do painel
/conclave --v1 {pergunta}                         # Modo legado v1 (sem CRITIC/ADVOCATE/SYNTHESIZER)
```

## Execucao

### 1. Parsear input

Extrair:
- `question`: a pergunta/decisao a deliberar
- `agents`: lista de agentes (opcional, se nao fornecido, auto-selecionar)
- `size`: small (3), medium (4), large (6) — default: medium
- `--v1`: flag opcional para modo legado (pula etapas 3b/3c/3d de deliberation roles)

### 2. Selecionar agentes

Se agentes nao especificados, auto-selecionar baseado na pergunta:

| Palavras-chave | Agentes sugeridos |
|----------------|-------------------|
| copy, hook, headline, texto | copy-chief, creative-director |
| preco, oferta, margem, pricing | pm, analyst |
| funil, conversao, quiz, checkout | funnel-chief |
| ads, trafego, criativo, campanha | traffic-head, creative-director |
| arquitetura, tech, stack, database | architect, dev |
| estrategia, timeline, recurso | commander |

Sempre incluir commander se size >= medium.

### 3. Coletar perspectivas

Para CADA agente selecionado, gerar uma perspectiva genuina baseada na expertise:

```markdown
### {agent-name} ({expertise focus})

**Posicao:** {recomendacao em 1 frase}

**Raciocinio:**
- {argumento 1 baseado na expertise}
- {argumento 2}

**Risco:** {1 preocupacao ou tradeoff}

**Confianca:** {ALTA/MEDIA/BAIXA}
```

IMPORTANTE: Cada perspectiva deve refletir GENUINAMENTE a expertise do agente. O copy-chief pensa em persuasao, o pm pensa em margens, o analyst pensa em dados. NAO faca todos concordarem — tensao e valiosa.

### 3b. CRITIC Scoring (v2 only — skip if --v1)

Apos TODAS as perspectivas coletadas, executar o papel de CRITIC:

- Avaliar cada perspectiva em 5 criterios (0-100):
  - **evidence_quality**: As afirmacoes sao respaldadas por dados/experiencia?
  - **logic_consistency**: O raciocinio e internamente consistente?
  - **completeness**: Pontos cegos foram abordados?
  - **actionability**: A recomendacao pode ser executada?
  - **risk_awareness**: Os riscos estao devidamente identificados?
- Gerar tabela de scoring (Agente x Criterio)
- Identificar os argumentos mais fracos
- Sinalizar afirmacoes com baixa evidencia

Formato de saida:
```markdown
## CRITIC Score

| Agente | Evidencia | Logica | Completude | Acionabilidade | Riscos | Media |
|--------|-----------|--------|------------|----------------|--------|-------|
| {agent} | {0-100} | {0-100} | {0-100} | {0-100} | {0-100} | {avg} |

**Score Geral:** {media ponderada}/100

**Argumentos Fracos:**
1. {argumento fraco + por que}
2. {argumento fraco + por que}
3. {argumento fraco + por que}

**Alertas de Baixa Evidencia:**
- {claim sem dados suficientes}
```

### 3c. DEVIL'S ADVOCATE Stress Test (v2 only — skip if --v1)

Atacar o consenso emergente:

- Identificar o ponto de consenso mais forte e desafia-lo sistematicamente
- Encontrar a premissa oculta que todos estao assumindo mas ninguem declarou
- Descrever o cenario especifico onde esta recomendacao falha catastroficamente
- Revisar a avaliacao de risco considerando vulnerabilidades encontradas

Formato de saida:
```markdown
## Stress Test

**Consenso Atacado:** {ponto de consenso + ataque}

**Premissa Oculta:** {a premissa que ninguem questionou}

**Cenario de Falha:** {descricao do cenario catastrofico}

**Top 3 Vulnerabilidades:**
1. {vulnerabilidade + impacto} — Severidade: ALTA/MEDIA/BAIXA
2. {vulnerabilidade + impacto} — Severidade: ALTA/MEDIA/BAIXA
3. {vulnerabilidade + impacto} — Severidade: ALTA/MEDIA/BAIXA

**Risco Revisado:** {avaliacao recalibrada}
```

### 3d. SYNTHESIZER Integration (v2 only — skip if --v1)

Sintese final integrando TUDO:

- Recomendacao integrada considerando: perspectivas dos agentes + scores do CRITIC + desafios do ADVOCATE
- Score de confianca calibrado (0-100%) considerando vulnerabilidades encontradas
- Veredicto: GO / NO-GO / CONDITIONAL
- Plano de acao com contingencias
- Condicoes a cumprir (se CONDITIONAL)

Formato de saida:
```markdown
## Veredicto Final

**Veredicto:** {GO / NO-GO / CONDITIONAL}
**Confianca:** {0-100}%

**Recomendacao Integrada:**
{recomendacao final que incorpora todas as perspectivas, criticas e stress test}

**Plano de Acao:**
1. {acao + responsavel + prazo}
2. {acao + responsavel + prazo}
3. {acao + responsavel + prazo}

**Contingencias:**
- Se {condicao}: {plano B}
- Se {condicao}: {plano B}

**Riscos Residuais Aceitos:**
- {risco aceito + justificativa}
```

### 4. Carregar knowledge relevante

Para cada agente, checar se existe knowledge no dominio correspondente:
- Ler `.aiox-core/knowledge/_ROUTING.yaml` para saber quais dominios o agente usa
- Se existe knowledge, usar os principios/heuristicas para fundamentar a perspectiva

### 5. Sintetizar

Apos todas as perspectivas (e deliberation roles se v2):

#### Formato v1 (--v1) ou fallback:
```markdown
========================================================
  CONCLAVE — Deliberacao Concluida
========================================================

## Pergunta
{pergunta original}

## Painel
{lista de agentes convocados com expertise}

---

{perspectivas de cada agente}

---

## Sintese

**Consenso:** {onde todos concordam}

**Tensao:** {onde divergem — isso e VALIOSO, nao esconder}

**Recomendacao:** {decisao final com raciocinio}

**Proximos passos:**
1. {acao concreta 1}
2. {acao concreta 2}
3. {acao concreta 3}

**Confianca geral:** {ALTA/MEDIA/BAIXA}

========================================================
```

#### Formato v2 (default):
```markdown
========================================================
  CONCLAVE v2 — Deliberacao Concluida
========================================================

## Pergunta
{pergunta original}

## Painel
{lista de agentes convocados com expertise}

---

{perspectivas de cada agente}

---

## Sintese

**Consenso:** {onde todos concordam}

**Tensao:** {onde divergem — isso e VALIOSO, nao esconder}

---

## CRITIC Score

| Agente | Evidencia | Logica | Completude | Acionabilidade | Riscos | Media |
|--------|-----------|--------|------------|----------------|--------|-------|
| {agent} | {score} | {score} | {score} | {score} | {score} | {avg} |

**Score Geral:** {media}/100
**Argumentos Fracos:** {top 3}
**Alertas:** {low-evidence flags}

---

## Stress Test

**Consenso Atacado:** {ponto + ataque}
**Premissa Oculta:** {assumption}
**Cenario de Falha:** {worst case}
**Top 3 Vulnerabilidades:** {ranked}
**Risco Revisado:** {recalibrated}

---

## Veredicto Final

**Veredicto:** {GO / NO-GO / CONDITIONAL}
**Confianca:** {0-100}%

**Recomendacao Integrada:** {final recommendation}

**Plano de Acao:**
1. {acao + responsavel + prazo}
2. {acao + responsavel + prazo}
3. {acao + responsavel + prazo}

**Contingencias:** {if CONDITIONAL}
**Riscos Residuais:** {accepted risks}

========================================================
```

### 6. Salvar deliberacao (se importante)

Se a deliberacao e sobre uma decisao importante do projeto, salvar em:
`.aiox/conclaves/conclave-{YYYY-MM-DD}-{slug}.md`

Formato:
```markdown
---
date: {YYYY-MM-DD}
question: "{pergunta}"
agents: [{lista}]
verdict: "{recomendacao em 1 linha}"
confidence: {ALTA/MEDIA/BAIXA}
---

{conteudo completo da deliberacao}
```

## Agentes disponiveis

| Agent ID | Expertise | Dominios |
|----------|-----------|----------|
| copy-chief | Persuasao, triggers emocionais, messaging | copy-persuasion, psychology-influence |
| traffic-head | Performance de ads, audiences, scaling | traffic-ads |
| creative-director | Impacto visual, scroll-stop, testing | traffic-ads, psychology-influence |
| funnel-chief | Conversao, fluxo de funil, value ladder | funnels-value-ladder |
| analyst | Dados de mercado, concorrencia, objecoes | offers-pricing, sales-closing |
| pm | Modelo de negocio, margens, ROI | offers-pricing, systems-ops |
| architect | Viabilidade tecnica, escalabilidade | systems-ops |
| commander | Alinhamento estrategico, recursos, timeline | offers-pricing, systems-ops |

## Notas

- O valor do Conclave esta na TENSAO entre perspectivas, nao no consenso
- Nunca force concordancia — divergencia e informacao valiosa
- O Conclave e consultivo — o usuario toma a decisao final
- Para decisoes triviais, use um agente individual em vez do Conclave
- Knowledge Layer e consultado automaticamente para fundamentar perspectivas
- **v2 (default):** Inclui 3 deliberation roles (CRITIC, DEVIL'S ADVOCATE, SYNTHESIZER) apos as perspectivas
- **--v1 (backward compat):** Pula etapas 3b/3c/3d, usa apenas sintese simples como na versao original
- v2 produz um Veredicto Final com GO/NO-GO/CONDITIONAL e score de confianca 0-100%
