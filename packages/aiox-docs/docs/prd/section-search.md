# PRD Shard: Global Search (FR-10)

## Requirements
- FR-10.1: Input full-width com autofocus e placeholder descritivo
- FR-10.2: Contador de resultados em tempo real
- FR-10.3: Busca client-side filtrando title, subtitle e detail
- FR-10.4: Resultados agrupados por tipo: Agents, Workflows, Commands, Experts, Articles
- FR-10.5: Cada resultado: icon + title (mono, colored) + subtitle + detail (truncated)
- FR-10.6: Link direto para pagina/anchor relevante
- FR-10.7: Estado vazio com mensagem quando 0 resultados

## Implementation
- `'use client'` com useState + useMemo
- buildIndex() pre-computa SearchResult[] de todos os data files
- Filtro case-insensitive em title + subtitle + detail
- Grouped rendering via Record<type, SearchResult[]>
