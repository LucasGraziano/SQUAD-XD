# ADR-006 — Deal Room: Unificação de Leads, Cotações e Propostas

**Status:** Accepted  
**Data:** 2026-05-18  
**Autores:** @analyst (Atlas), @master (Orion)  
**Revisores:** @dev (Dex)

---

## Contexto

O Premia foi construído incrementalmente, gerando entidades separadas para o que é, na prática, um único ciclo de trabalho do corretor de seguros:

- `leads` — prospecção (tabela do Kanban)
- `quote_requests` — multicálculo enviado ao cliente
- `proposals` — proposta formal enviada à seguradora

Essas três entidades representam **estágios de uma mesma negociação**, não objetos distintos. A fragmentação resulta em:

1. 4 páginas isoladas (`/pipeline`, `/cotacoes`, `/propostas`, `/apolices`) que não se comunicam
2. Corretor navega entre páginas para completar um único ciclo de venda
3. Dados duplicados (seguradora, ramo, cliente digitados múltiplas vezes)
4. Impossibilidade de calcular taxa de conversão por estágio

---

## Decisão

**Unificar `leads`, `quote_requests` e `proposals` em uma única entidade `deal`**, implementada como evolução da tabela `quote_requests` (menor impacto de migration).

### O que muda

| Antes | Depois |
|---|---|
| 3 tabelas (`leads`, `quote_requests`, `proposals`) | 1 tabela (`quote_requests` expandida) |
| Status: `draft/sent/approved/rejected/contracted` | Status: `prospecting/draft/sent/approved/submitted/under_analysis/issued/contracted/rejected` |
| 4 páginas: `/pipeline`, `/cotacoes`, `/propostas`, `/apolices` | 3 páginas: `/pipeline`, `/deals/[id]`, `/apolices` |
| Pipeline = Kanban de leads | Pipeline = Kanban de deals (todos os estágios) |
| `/cotacoes` = multicálculo isolado | `/deals/[id]` = workspace unificado |
| `/propostas` = proposta à seguradora isolada | Estágios `submitted`/`under_analysis`/`issued` no deal |

### O que NÃO muda

- Tabela `policies` (`apolices`) — permanece como está; é o *resultado* de um deal
- Tabela `quote_items` — permanece; só renomeamos conceitualmente para `deal_items` na UI
- Todas as server actions existentes — re-exportadas com aliases de compatibilidade
- RLS existente — mantido

### Estratégia de migration

1. Expandir `quote_requests` com novos campos (nullables — zero breaking change)
2. Expandir CHECK constraint de `status`
3. Criar `deal_stage_history`
4. Migrar `leads` sem cotação para `quote_requests` com `status = 'prospecting'`
5. Migrar campos relevantes de `proposals` para `quote_requests`
6. Manter tabela `proposals` por 1 sprint como safety net, depois deprecar

---

## Consequências

### Positivas

- Um único objeto representa uma negociação completa do início ao fim
- Pipeline sempre atualizado (automação de stage em vez de atualização manual)
- Timeline de auditoria completa via `deal_stage_history`
- Taxa de conversão por estágio calculável
- Corretor trabalha em uma única página por negociação
- Reduz navegação de 4 para 3 páginas

### Negativas / Riscos

- Quebra visual do Kanban atual (migração de UI)
- Dados de `leads` sem cotação precisam de migration cuidadosa
- `proposals` com dados não linkados a `quote_requests` podem ser perdidos (mitigado: mantemos tabela por 1 sprint)
- Desenvolvedores precisam aprender a nova terminologia (deal vs. quote vs. lead)

### Mitigações

- Migration incremental com rollback possível (proposals mantida 1 sprint)
- Aliases de compatibilidade em `quotes.ts` para não quebrar código existente imediatamente
- Redirect de `/cotacoes` → `/deals` com banner explicativo

---

## Alternativas Consideradas

**Alt 1 — Manter 4 páginas com automação bidirecional (Conceito B do @analyst)**
Menor esforço, mas não resolve o problema fundamental de fragmentação. Seria técnica de remendo, não de arquitetura.

**Alt 2 — Criar tabela `deals` completamente nova e migrar tudo**
Mais limpo semanticamente, mas custo de migration muito alto com risco de perda de dados. Rejeitado em favor de evoluir `quote_requests`.

**Alt 3 — Manter como está**
Inviável: o produto já passou do ponto onde a fragmentação é aceitável. Custo de UX é alto demais.

---

## Referências

- Brainstorm do @analyst (Atlas): sessão de 2026-05-18
- Stories Epic 8: 8.1 a 8.8
- Stories afetadas: 5.13, 7.3, 7.4, 7.5, 7.6
