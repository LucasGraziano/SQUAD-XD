# /ingest — DNA Extraction v2 | AIOX Knowledge Layer

Transforma conteudo bruto (videos, cursos, livros, podcasts, transcricoes) em conhecimento comprimido no formato DNA v2 de 5 camadas cognitivas.

## Uso

```
/ingest                                    # Modo interativo — pergunta tudo
/ingest {expert-name}                      # Expert especifico
/ingest {expert-name} --domain {domain}    # Expert + dominio
/ingest {expert-name} --mode simple        # Formato legado (3 campos)
/ingest {expert-name} --merge              # Enriquecer DNA existente com nova fonte
/ingest {url}                              # Extrair de URL (YouTube, artigo, etc.)
/ingest {path/to/file.mp4}                 # Extrair de arquivo local
```

**Flags:**

| Flag | Descricao |
|------|-----------|
| `--mode simple` | Backward compat: formato antigo (Principios + Frameworks + Heuristicas) |
| `--merge` | Se DNA ja existe, enriquece com `[source: X]` tags em vez de sobrescrever |
| `--domain {slug}` | Pre-selecionar dominio |
| `--source {desc}` | Descricao da fonte (ex: "Curso X", "Livro Y") |

**Dominios disponiveis:**
`copy-persuasion` | `offers-pricing` | `sales-closing` | `traffic-ads` | `funnels-value-ladder` | `systems-ops` | `psychology-influence`

## Execucao

### 1. Coletar informacoes

Se nao fornecidas nos argumentos, apresentar:

```
DNA Extraction v2 — AIOX Knowledge Layer

1. **Expert/Autor:** Quem e a fonte? (ex: "Alex Hormozi", "Dan Kennedy")
2. **Fonte:** URL, arquivo local, ou cole o conteudo?
   - YouTube URL → busco transcricao via WebFetch
   - Artigo/blog URL → extraio conteudo via WebFetch
   - Arquivo .mp4/.mkv → preciso da transcricao (cole aqui)
   - Texto bruto → cole diretamente
3. **Descricao da fonte:** Nome do livro/curso/podcast (ex: "$100M Offers")
4. **Dominio:** Onde encaixar?
   - copy-persuasion | offers-pricing | sales-closing
   - traffic-ads | funnels-value-ladder | systems-ops | psychology-influence
5. **Modo:** DNA v2 (default) ou --mode simple (legado)?

Se o expert cobre multiplos dominios, farei ingestoes separadas.
```

### 2. Obter conteudo bruto

**Se URL (YouTube, artigo, blog):**
- Usar WebFetch para extrair conteudo da pagina
- Para YouTube: extrair transcricao/descricao disponivel
- Se WebFetch falhar: pedir ao usuario para colar o conteudo manualmente

**Se arquivo local (.mp4, .mkv, .wav):**
- Arquivos de video/audio NAO podem ser lidos diretamente
- Pedir ao usuario: "Cole a transcricao do video ou um resumo detalhado das notas"

**Se texto bruto:**
- Usar diretamente o conteudo colado pelo usuario

### 3. Comprimir em 5 camadas DNA v2

Transformar o conteudo bruto aplicando os **testes de classificacao** rigorosos para cada camada:

**Token budget: maximo 700 tokens por arquivo DNA.**

---

#### L1 Filosofias (max 8 items)

**Teste de inclusao:** "Se remover esta crenca, 50%+ das decisoes do expert mudariam?"
- Sao crencas FUNDAMENTAIS, nao dicas ou tecnicas
- Cada bullet e uma declaracao de crenca/principio existencial
- Formato: `- {declaracao de crenca}`
- Exemplo: `- Toda oferta deve ser tao boa que a pessoa se sente estupida dizendo nao`

#### L2 Modelos Mentais (max 6 items)

**Teste de inclusao:** "O expert usa isso para PENSAR, nao para FAZER?"
- Sao lentes cognitivas, frameworks de raciocinio
- Cada item tem NOME + descricao
- Formato: `- **{Nome}**: {descricao do modelo mental}`
- Exemplo: `- **Value Equation**: Outcome x Likelihood / Time x Effort — quanto maior o gap, maior o valor percebido`

#### L3 Heuristicas (max 8 items)

**Teste de inclusao:** "Tem threshold QUANTITATIVO especifico?"
- DEVE conter numeros, porcentagens, limites concretos
- Sem numero = nao e heuristica, reclassifique
- Formato: `- {regra com numero/threshold especifico}`
- Exemplo: `- Se LTV/CAC < 3x, o canal de aquisicao nao e sustentavel`

#### L4 Frameworks (max 5 items)

**Teste de inclusao:** "Tem passos SEQUENCIAIS?"
- Processos step-by-step que o expert ensina
- Cada item tem NOME + sequencia de steps
- Formato: `- **{Nome}**: Step 1 → Step 2 → Step 3...`
- Exemplo: `- **CLOSER Framework**: Clarify → Label → Overview → Sell → Explain → Reinforce`

#### L5 Metodologias (max 3 items)

**Teste de inclusao:** "E um guia de implementacao COMPLETO de A a Z?"
- Sistemas inteiros, nao steps isolados
- Descricao mais densa que frameworks
- Formato: `- **{Nome}**: {descricao completa da metodologia}`
- Exemplo: `- **Grand Slam Offer**: Identificar dream outcome → listar obstaculos → converter em solucoes → empacotar com bonus → nomear com mecanismo unico → precificar 10x valor percebido`

---

### 4. Verificar DNA existente (merge mode)

Antes de salvar, checar se o expert ja possui DNA no dominio:
- Ler `knowledge/domains/{dominio}/` para encontrar `{expert-slug}-dna.md`

**Se DNA ja existe E `--merge` ativo:**
- Carregar DNA existente
- Para cada novo item extraido, verificar se ja existe equivalente
- Novos items recebem tag `[source: {nova-fonte}]`
- Items existentes mantidos sem modificacao
- Frontmatter `source:` array recebe nova entrada
- Respeitar limites max de cada camada (nao ultrapassar mesmo com merge)
- Priorizar items com maior densidade de informacao ao atingir limite

**Se DNA ja existe E `--merge` NAO ativo:**
- Perguntar: "DNA existente encontrado para {expert} em {dominio}. Opcoes:"
  - `merge` — Enriquecer DNA existente com nova fonte
  - `overwrite` — Substituir completamente
  - `cancel` — Cancelar operacao

**Se DNA nao existe:**
- Criar novo arquivo normalmente

### 5. Salvar arquivo DNA

**Formato DNA v2 (default):**

```markdown
---
expert: "{Nome do Expert}"
domain: "{dominio-slug}"
source: ["{fonte1}", "{fonte2}"]
format: dna-v2
elements: {total de items em todas as camadas}
date: {YYYY-MM-DD}
---

## L1 Filosofias
- {crencas fundamentais}

## L2 Modelos Mentais
- **{Nome}**: {descricao}

## L3 Heuristicas
- {regras com numeros}

## L4 Frameworks
- **{Nome}**: Step 1 → Step 2 → ...

## L5 Metodologias
- **{Nome}**: {descricao completa}
```

**Path:** `knowledge/domains/{dominio}/{expert-slug}-dna.md`

**Formato Simple (--mode simple, backward compat):**

```markdown
---
expert: "{Nome do Expert}"
domain: "{dominio-slug}"
source: "{fonte}"
elements: {N}
---

## Principios-Chave
- {max 8 bullets}

## Frameworks Aplicaveis
- **{Nome}**: {descricao em 1 linha} (max 5)

## Heuristicas com Numeros
- {regras com thresholds} (max 5)
```

**Path (simple):** `knowledge/domains/{dominio}/{expert-slug}.md`

### 6. Atualizar indices

**6a. Atualizar `_index.md` do dominio:**
- Ler `knowledge/domains/{dominio}/_index.md`
- Adicionar ou atualizar linha: `- **{expert}** ({fonte}): {foco em 1 linha} [DNA v2]`

**6b. Atualizar `_REGISTRY.yaml`:**
- Ler `knowledge/_REGISTRY.yaml`
- Adicionar expert na lista do dominio (se novo)
- Incrementar `total_experts` (se novo expert)
- Atualizar campo `format: dna-v2` para o expert

### 7. Verificar routing

Checar `knowledge/_ROUTING.yaml`:
- O dominio ja esta mapeado para agentes?
- Se nao, sugerir quais agentes deveriam ter acesso

### 8. Confirmar

```
DNA extraido com sucesso!

Expert: {nome}
Arquivo: knowledge/domains/{dominio}/{slug}-dna.md
Formato: DNA v2 (5 camadas)
Dominio: {dominio}
Fonte: {descricao da fonte}
Elementos: {N} (L1:{n} + L2:{n} + L3:{n} + L4:{n} + L5:{n})
Tokens: ~{estimativa} / 700 max
Agentes com acesso: {lista via routing}
Modo: {novo | merge | overwrite}

Os agentes agora acessam via *knowledge {dominio}
```

## Modo Multi-Dominio

Se o expert cobre mais de 1 dominio:

```
{Expert} cobre multiplos dominios:
1. {dominio-1}: {foco}
2. {dominio-2}: {foco}

Criando DNA separado para cada dominio...
```

Criar 1 arquivo DNA por dominio, cada um com items relevantes aquele dominio. O token budget de 700 aplica POR ARQUIVO.

## Exemplos de Uso

### YouTube video
```
/ingest Alex Hormozi --domain offers-pricing
> URL: https://youtube.com/watch?v=xyz
> [WebFetch extrai transcricao]
> [Comprime em 5 camadas DNA]
> Salvo: knowledge/domains/offers-pricing/alex-hormozi-dna.md
```

### Enriquecer expert existente com nova fonte
```
/ingest Dan Kennedy --merge --domain copy-persuasion
> Fonte: "The Ultimate Sales Letter"
> [Carrega DNA existente]
> [Extrai novos items da nova fonte]
> [Merge com tags [source: The Ultimate Sales Letter]]
> Atualizado: knowledge/domains/copy-persuasion/dan-kennedy-dna.md
```

### Texto colado direto
```
/ingest
> Expert: Jeremy Haynes
> [Cola notas do curso "Media Buyer Secrets"]
> Dominio: traffic-ads
> [Comprime em DNA v2]
> Salvo: knowledge/domains/traffic-ads/jeremy-haynes-dna.md
```

### Modo legado (backward compat)
```
/ingest Russell Brunson --mode simple --domain funnels-value-ladder
> [Formato antigo: Principios + Frameworks + Heuristicas]
> Salvo: knowledge/domains/funnels-value-ladder/russell-brunson.md
```

## Regras de Qualidade

1. **Zero teoria** — Cada item deve ser acionavel ou representar crenca operacional real
2. **Numeros obrigatorios em L3** — Heuristica sem numero nao e heuristica
3. **Testes rigorosos** — Cada item deve passar no teste da sua camada antes de ser incluido
4. **Deduplicacao no merge** — Nao duplicar items semanticamente equivalentes
5. **700 tokens max** — Se ultrapassar, comprimir ou cortar items de menor impacto
6. **Conteudo bruto NUNCA e salvo** — Apenas DNA comprimido
7. **Source tracking** — Toda fonte deve ser rastreavel no frontmatter e nos tags de merge
