# /dossier — Cross-Source Knowledge Dossier Generator

Gera dossiers cruzando conhecimento de multiplos experts para identificar convergencias, divergencias e meta-frameworks emerentes.

## Uso

```
/dossier {tema}                 — Gerar dossier sobre um tema especifico
/dossier --auto {domain}        — Auto-gerar de todos experts de um dominio
/dossier --list                 — Listar dossiers existentes
```

**Argumentos:**
- `{tema}` — Tema livre (ex: "copywriting-persuasion", "objection-handling", "scaling-offers")
- `--auto {domain}` — Nome do dominio conforme _REGISTRY.yaml (ex: copy-persuasion, traffic-ads)
- `--list` — Sem argumentos adicionais

## Execucao

### 1. Parse Input

Determinar modo de execucao:

- Se `--list`: listar todos arquivos em `.aiox-core/knowledge/dossiers/` com frontmatter (theme, sources, date)
- Se `--auto {domain}`: carregar domain de `_REGISTRY.yaml`, usar TODOS experts listados
- Se `{tema}`: solicitar ao usuario quais experts incluir, ou inferir do tema

### 2. Resolver Experts

Para cada expert identificado:

1. Consultar `_REGISTRY.yaml` para localizar dominio(s) do expert
2. Carregar arquivo do expert: `.aiox-core/knowledge/domains/{domain}/{expert-name}.md`
3. Se expert aparece em multiplos dominios, carregar TODOS os arquivos (perspectivas diferentes)
4. Se arquivo nao existe, verificar `_index.md` do dominio para conhecimento resumido

**Prioridade de fonte:** Arquivo individual do expert > _index.md do dominio

### 3. Identificar Convergencias

Analisar principios, frameworks e heuristicas de TODOS experts carregados:

- **Convergencia** = 3+ experts concordam no mesmo principio (mesmo que com palavras diferentes)
- Buscar: mesma conclusao, mesmo framework, mesma heuristica numerica
- Marcar nivel de confianca: ALTA (4+ experts) ou MEDIA (3 experts)

### 4. Identificar Divergencias

Buscar pontos onde experts DISCORDAM genuinamente:

- Abordagens opostas para o mesmo problema
- Numeros/benchmarks conflitantes
- Filosofias incompativeis
- NAO forcar divergencias — se todos concordam, registrar isso

### 5. Consolidar Heuristicas

Unificar regras praticas com numeros, sempre tagueando a fonte:

```
- Regra pratica com numero [source: expert-name]
- Outra regra [source: expert1, expert2]
```

### 6. Extrair Meta-Frameworks

Identificar padroes que EMERGEM do cruzamento mas nao existem em nenhum expert individual:

- Sequencias que se complementam entre experts
- Principios universais que transcendem dominios
- "DNA do DNA" — o que todos experts compartilham sem saber

### 7. Mapear Aplicacao por Agente

Para cada secao do dossier, indicar qual agente AIOX deve usar aquele conhecimento:

- @dev, @architect, @pm, @po, @analyst, @qa, etc.
- Agentes de squad especificos (copy-chief, traffic-head, etc.)

### 8. Gerar Arquivo

Salvar em `.aiox-core/knowledge/dossiers/{tema}.md` usando o formato:

```markdown
---
theme: "{tema}"
sources: ["{expert1}", "{expert2}", ...]
domains: ["{domain1}", ...]
elements: {count}
date: {YYYY-MM-DD}
---

## Convergencias
{Onde 3+ experts concordam — principios de ALTA CONFIANCA}

## Divergencias
{Onde experts discordam — informacao VALIOSA, nao esconder}

## Heuristicas Consolidadas
{Regras unificadas com numeros, tagueadas com [source: expert-name]}

## Meta-Frameworks
{Padroes emergentes entre experts — o "DNA do DNA"}

## Aplicacao por Agente
{Qual agente deve usar qual parte deste dossier}
```

### 9. Atualizar Registry

Adicionar entrada do novo dossier em `_REGISTRY.yaml` na secao `dossiers:`:

```yaml
dossiers:
  {tema}:
    sources: [expert1, expert2, ...]
    agents: [agent1, agent2]
    description: "Convergencias de {tema} entre {N} experts"
```

### 10. Confirmar

Reportar ao usuario:
- Arquivo salvo: path completo
- Token count aproximado (meta: <1000 tokens)
- Numero de convergencias, divergencias, heuristicas encontradas
- Experts processados com sucesso vs nao encontrados

## Regras

- **Max 1000 tokens** por dossier — comprimir sem perder substancia
- **Nunca inventar** convergencias — se so 2 experts concordam, nao e convergencia (minimo 3)
- **Divergencias sao valiosas** — nao esconder desacordos, eles informam decisoes
- **Source tags obrigatorios** em heuristicas — rastreabilidade total
- **Frontmatter YAML** obrigatorio em todo dossier
- Se expert nao tem arquivo individual, usar _index.md do dominio como fallback
