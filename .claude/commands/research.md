# /research - Pesquisa Cientifica e Factual

Pesquisa artigos cientificos, livros, meta-analises e fontes factiveis sobre qualquer topico. Compila um resumo estruturado com citacoes reais.

## Uso

```
/research "diastasis recti exercise"     # Pesquisa especifica
/research "hypopressive exercises"        # Topico de fitness
/research "anti-inflammatory diet fascia" # Topico de nutricao
/research --deep "pelvic floor postpartum" # Pesquisa aprofundada
```

## Execucao

### 1. Definir escopo da pesquisa

Extrair do argumento:
- Topico principal
- Subtopicos relevantes
- Tipo de evidencia necessaria (RCT, meta-analise, revisao sistematica, livro)

### 2. Pesquisar fontes

Usar WebSearch para buscar em multiplas fontes:

```
Queries de pesquisa (executar em paralelo):
1. "{topico} systematic review" — Meta-analises
2. "{topico} randomized controlled trial" — Estudos clinicos
3. "{topico} evidence based" — Revisoes baseadas em evidencia
4. "{topico} pubmed" — Artigos em PubMed
5. "{topico} book reference" — Livros de referencia
6. "{topico} 2024 2025 2026" — Pesquisas mais recentes
```

### 3. Para cada fonte encontrada

Usar WebFetch para acessar resumos e extrair:
- Autores
- Ano de publicacao
- Journal/editora
- Principais achados
- Tamanho da amostra (se aplicavel)
- Nivel de evidencia

### 4. Compilar resultados

Formato de saida:

```markdown
# Pesquisa: {topico}
Data: {data atual}

## Resumo Executivo
{3-5 frases com os principais achados}

## Estatisticas-Chave
- {dado 1 com fonte}
- {dado 2 com fonte}
- {dado 3 com fonte}

## Evidencia Cientifica

### {Achado 1}
{Descricao do achado}
**Fonte:** {Autor et al. (Ano). Titulo. Journal, Volume, Paginas.}
**Nivel de evidencia:** {Meta-analise / RCT / Revisao / Observacional}

### {Achado 2}
...

## Mitos vs Evidencia
| Mito | Realidade | Fonte |
|------|-----------|-------|
| {mito 1} | {evidencia} | {citacao} |

## Livros de Referencia
1. {Livro 1} — {Autor, Ano, Editora}
2. {Livro 2} — ...

## Pesquisadores-Chave na Area
- {Nome} — {Instituicao, contribuicao}

## Aplicacao para Zero Diastasis
{Como esses achados se aplicam ao produto, tom acessivel}
```

### 5. Salvar pesquisa

Salvar em `packages/ebook-generator/research/{topico-slug}.md` para reutilizacao futura.

### 6. Modo --deep

Se `--deep`, adicionar:
- Busca em Google Scholar via WebSearch
- Comparacao entre estudos conflitantes
- Timeline de evolucao do conhecimento no topico
- Gaps na pesquisa atual
- Sugestoes de areas para investigar mais

### Regras

- **Apenas fontes reais:** Nunca inventar citacoes, autores ou journals
- **Priorizar meta-analises e RCTs:** Maior nivel de evidencia
- **Recencia:** Priorizar estudos de 2020-2026, mas incluir classicos se relevantes
- **Transparencia:** Se nao encontrar evidencia para uma afirmacao, dizer claramente
- **Escrita autoral:** Resumir com palavras proprias, nunca copiar abstracts

---
*AIOX Productivity — Research Command*
