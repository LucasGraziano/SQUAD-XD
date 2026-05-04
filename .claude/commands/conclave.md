# /conclave - Multi-Agent Deliberation

Convoca multiplos agentes AIOX para deliberar sobre uma decisao e produzir uma recomendacao sintetizada.

## Uso

```
/conclave {pergunta}                              # Auto-seleciona agentes operacionais (v2 + knowledge-backed)
/conclave --agents copy-chief,analyst {pergunta}  # Agentes operacionais especificos
/conclave --size small|medium|large {pergunta}    # Controla tamanho do painel
/conclave --v1 {pergunta}                         # Modo legado v1 (sem CRITIC/ADVOCATE/SYNTHESIZER)
/conclave --experts {pergunta}                    # Experts do knowledge debatem (auto-selecao)
/conclave --experts hormozi,brunson,hard-copy {pergunta}  # Experts especificos pelo ID
/conclave --mini product-architect,capital-allocator {pergunta}  # Mini-conclave: 2 agentes, deliberacao rapida
```

## MODO --experts (Expert Knowledge Debate)

Quando a flag `--experts` estiver presente, o modo de operacao muda completamente:
- Em vez de agentes operacionais (commander, analyst, pm...), os **experts reais do knowledge system** debatem
- Cada expert fala com a voz e os frameworks DELE — Hormozi soa como Hormozi, Brunson soa como Brunson
- Os experts discordam entre si quando seus frameworks conflitam — isso e o objetivo
- Ao final, o Commander operacional sintetiza o debate aplicando ao CONTEXTO REAL do usuario (budget, tempo, habilidades)

### Experts disponíveis

| Expert ID | Nome | Dominios Primarios | Tom / Estilo |
|-----------|------|--------------------|--------------|
| `hormozi` | Alex Hormozi | offers-pricing | Direto, matematico, Value Equation acima de tudo |
| `brunson` | Russell Brunson | funnels, copy | Entusiasta, Value Ladder, Hook-Story-Offer |
| `hard-copy` | Hard Copy (Kleiver) | copy, traffic, funnels | Cinematico, Kinshu, MPV, executa rapido |
| `doug` | Doug | psychology, copy, systems | Sistemico, Dissecacao Neural, 8 territorios |
| `jim-edwards` | Jim Edwards | copy | Modular, templates, FRED, PAS/PASTOR |
| `kobata` | Diogo Kobata | copy, traffic | Volumetrico, Ed 100x, lateralizacao de angulos |
| `jeremy-miner` | Jeremy Miner | sales | NEPQ, perguntas, tonalidade, CDD |
| `cole-gordon` | Cole Gordon | sales | 7 Crenças, processo de call, scorecard |
| `blair-warren` | Blair Warren | psychology | 5 Drivers, permissao, self-verification |
| `agora-inc` | Agora Inc | copy | Big Idea, 4Ps, Copy Length Matrix |
| `jeremy-haynes` | Jeremy Haynes | traffic, funnels | Tornado Creative, Hammer, escala agressiva |
| `scalable` | The Scalable Company | systems | ScalableOS, cadencia, estrutura de time |
| `sam-oven` | Sam Oven | systems, funnels | Purple Ocean, Bridge Framework, nicho unico |

### Auto-selecao de experts (sem nomes especificados)

Se `--experts` sem IDs, selecionar 3-4 experts baseado nas palavras-chave da pergunta:

| Palavras-chave | Experts sugeridos |
|----------------|-------------------|
| oferta, preco, valor, promessa | hormozi, brunson, hard-copy |
| copy, hook, headline, texto | hard-copy, jim-edwards, agora-inc, kobata |
| funil, VSL, checkout, conversao | brunson, hard-copy, sam-oven |
| ads, trafego, criativo, escala | kobata, jeremy-haynes, hard-copy |
| vendas, call, fechamento, objecao | jeremy-miner, cole-gordon, hormozi |
| estrategia, plano, modelo de negocio | hormozi, brunson, sam-oven, scalable |
| psicologia, persuasao, emocao | blair-warren, doug, hard-copy |
| sistema, processo, time, operacao | scalable, sam-oven, doug |

### Execucao do modo --experts

#### Passo E1: Carregar perfil dos experts selecionados

Para cada expert, ler o arquivo de knowledge correspondente em `.aiox-core/knowledge/domains/`.
Extrair: L1 Filosofias, L2 Modelos Mentais, L4 Frameworks (especialmente campos VS: que revelam tensoes com outros experts).

#### Passo E2: Gerar perspectiva autêntica de cada expert

Cada perspectiva DEVE:
- Usar a terminologia e os nomes de framework do expert (ex: Hormozi diz "Grand Slam Offer", nao "boa oferta")
- Referenciar pelo menos 1 framework especifico do expert com seu nome proprio
- Revelar a TENSAO com pelo menos 1 outro expert no painel quando existir conflito real (usar os campos VS: do DNA v3)
- Soar como SE o expert estivesse falando — primeira pessoa, estilo direto do expert

Formato de perspectiva:

```markdown
### {Nome do Expert} — "{frase que resume a posição deles em 1 linha}"

**{Nome do Framework Principal que ele usaria aqui}**

{2-3 paragrafos na voz do expert, usando a terminologia dele, aplicando o framework ao problema especifico}

**Onde discordo de {outro expert no painel}:**
{tensao real entre os frameworks — baseada no campo VS: do DNA v3}

**O que eu faria agora:**
{recomendacao concreta e especifica, no estilo do expert}
```

#### Passo E3: Debate cruzado (round de replicas)

Apos todas as perspectivas, gerar 2-3 replicas cruzadas curtas onde experts respondem diretamente uns aos outros:

```markdown
## Debate

**{Expert A} para {Expert B}:**
"{replica direta, em 3-5 linhas, no estilo do Expert A}"

**{Expert B} para {Expert A}:**
"{replica de volta}"
```

Isso deve refletir conflitos REAIS entre os frameworks (ex: Hard Copy empurra MPV rapido, Hormozi diria que voce precisa de Grand Slam antes de gastar R$1 em ads).

#### Passo E4: CRITIC Score (igual v2 padrao)

Avaliar cada perspectiva de expert nos 5 criterios (evidence, logic, completeness, actionability, risk).

#### Passo E5: Stress Test (igual v2 padrao)

Atacar o consenso emergente entre os experts.

#### Passo E6: Sintese do Commander (CONTEXTUALIZACAO)

O Commander operacional fecha o debate aplicando ao contexto REAL do usuario.

**IMPORTANTE:** O Commander deve carregar as memorias do usuario antes de sintetizar:
- Ler `C:\Users\Graziano\.claude\projects\C--SQUAD-XD\memory\user_lucas_profile.md`
- Ler `C:\Users\Graziano\.claude\projects\C--SQUAD-XD\memory\project_company_context.md`

O Commander nao repete os frameworks dos experts — ele traduz o debate para decisao aplicada:
- "Dado que voce tem R$800/mes de sobra e 2h/dia..."
- "Considerando que o Cabral e o arquiteto de oferta e voce e o operador..."
- "Com reserva de R$6K e CLT como runway..."

Formato da sintese do Commander:

```markdown
## Sintese do Commander — Aplicado ao Seu Contexto

**O que os experts concordam (independente do framework):**
{consenso real entre eles}

**A tensao que mais importa para voce:**
{o conflito mais relevante dado o contexto do usuario}

**Traducao para sua realidade:**
{como o debate se aplica especificamente ao budget, tempo, skills e momento do usuario}

**Veredicto:** {GO / NO-GO / CONDITIONAL}
**Confianca:** {0-100}%

**Plano de acao (sua realidade, nao a teoria dos experts):**
1. {acao}
2. {acao}
3. {acao}

**Contingencias:**
- Se {condicao}: {plano B}
```

### Formato de saida completo (--experts)

```
========================================================
  CONCLAVE EXPERTS — {N} Experts Convocados
========================================================

## Pergunta
{pergunta original}

## Painel de Experts
{lista com nome + expertise em 1 linha cada}

---

## Perspectivas

{perspectiva de cada expert no formato E2}

---

## Debate

{replicas cruzadas do passo E3}

---

## CRITIC Score

{tabela padrao v2}

---

## Stress Test

{formato padrao v2}

---

## Sintese do Commander

{contextualizacao ao usuario real — passo E6}

========================================================
— Conclave Experts encerrado.
  Os experts falam de frameworks universais.
  O Commander fala da sua realidade especifica.
  A decisao e sua.
========================================================
```

## MODO --mini (Mini-Conclave — Deliberacao Rapida)

Quando a flag `--mini` estiver presente com 2 agentes especificados, executa um mini-conclave sem os roles CRITIC/ADVOCATE/SYNTHESIZER.

**Formato:**
```
/conclave --mini {agent1},{agent2} {pergunta}
```

**Casos de uso:**
- Resolver tensao entre dois experts/agentes especificos rapidamente
- Decisao binaria (ex: PLG vs. sales-led, freemium vs. trial)
- ~150 tokens totais — ideal quando o contexto ja esta cheio
- Quando voce sabe exatamente quais dois perspectives precisa

**Execucao:**

1. Gerar perspectiva autentica de cada um dos 2 agentes (formato padrao v2)
2. Gerar 1 replica cruzada de cada agente para o outro (~3 linhas cada)
3. Sintese curta (~5 linhas): concordancia, tensao central, recomendacao

**Formato de saida:**
```
========================================================
  MINI-CONCLAVE — {agent1} vs. {agent2}
========================================================

## Pergunta
{pergunta}

---

### {Agent 1} — "{posicao em 1 linha}"
{perspectiva em 3-4 linhas}

### {Agent 2} — "{posicao em 1 linha}"
{perspectiva em 3-4 linhas}

---

## Replica

**{Agent 1}:** "{replica direta para {Agent 2} em 3 linhas}"
**{Agent 2}:** "{replica direta para {Agent 1} em 3 linhas}"

---

## Sintese
**Concordam em:** {1 ponto de consenso}
**Tensao central:** {o conflito real}
**Recomendacao:** {decisao clara + condicao}

========================================================
```

**Pares pre-configurados (tension detection automatico):**

| Pergunta contendo... | Mini-conclave sugerido |
|---------------------|----------------------|
| PLG vs. sales, freemium vs. paid | `product-architect,capital-allocator` |
| hook vs. oferta, criativo vs. landing | `hook-master,funnel-chief` |
| copy emocional vs. copy logico | `copy-chief,analyst` |
| escalar vs. consolidar, trafego vs. orgânico | `traffic-head,pm` |
| produto vs. marketing | `product-architect,copy-chief` |

---

## MODO --experts (Expert Knowledge Debate)

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
| product-architect | ICP, MVP, PMF, product discovery, PLG/SLG | product-engineering, saas-operations |
| hook-master | Hooks, atenção nos primeiros 3s, criativo | traffic-ads, copy-persuasion |
| capital-allocator | Unit economics, LTV/CAC, pricing tiers | offers-pricing, systems-ops |
| intel-chief | Inteligencia competitiva, positioning, blue ocean | offers-pricing, sales-closing |

## Notas

- O valor do Conclave esta na TENSAO entre perspectivas, nao no consenso
- Nunca force concordancia — divergencia e informacao valiosa
- O Conclave e consultivo — o usuario toma a decisao final
- Para decisoes triviais, use um agente individual em vez do Conclave
- **Knowledge-backed (v3, default):** Antes de gerar perspectivas, o engine detecta automaticamente keywords na pergunta, carrega experts e dossiers relevantes do knowledge layer, e injeta como contexto em cada perspectiva. Os agentes fundamentam opinioes em frameworks reais, nao em intuicao de role.
- **Tension detection (v3):** Quando a pergunta acionar uma tensao conhecida (PLG vs. sales-led, copy emocional vs. logico, etc.), o sistema sugere automaticamente um mini-conclave pre-configurado com os agentes certos.
- **v2 (default):** Inclui 3 deliberation roles (CRITIC, DEVIL'S ADVOCATE, SYNTHESIZER) apos as perspectivas
- **--mini (v3):** 2 agentes, sem CRITIC/ADVOCATE/SYNTHESIZER, ~150 tokens. Ideal para tensoes especificas ou quando o contexto esta quase cheio.
- **--v1 (backward compat):** Pula etapas 3b/3c/3d, usa apenas sintese simples como na versao original
- v2 produz um Veredicto Final com GO/NO-GO/CONDITIONAL e score de confianca 0-100%
- **--experts (v3):** Substitui agentes operacionais pelos experts reais do knowledge system — cada expert fala com seus frameworks proprios, tensoes mapeadas via campos VS: do DNA v3, Commander sintetiza ao contexto real do usuario. Use quando quiser ouvir "o que Hormozi diria vs. o que Brunson diria" em vez de perspectivas por papel operacional
- Compound situations (`_SITUATIONS.yaml`) incluem `conclave_suggested: true` com o comando pre-configurado — quando o router detectar CS-XXX, sugerir o conclave diretamente
