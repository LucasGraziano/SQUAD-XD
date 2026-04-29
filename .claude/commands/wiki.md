# /wiki — Knowledge Wiki (Karpathy-style)

Sistema de conhecimento compounding. RAW → WIKI → Query. Cada sessão relevante vira conhecimento permanente.

## Uso

```
/wiki-ingest <url|path>    # Ingerir fonte no wiki
/wiki-query "<pergunta>"   # Buscar no conhecimento acumulado
/wiki-lint                 # Verificar qualidade e integridade do wiki
/wiki-status               # Ver índice e log do wiki
```

## Execução

### /wiki-ingest

```
1. Receber: URL ou path de arquivo
2. Se URL: usar defuddle parse <url> --md para extrair conteúdo limpo
3. Salvar em: C:\SQUAD XD\.aiox-core\knowledge\RAW\<topic>\YYYY-MM-DD-slug.md
4. Compilar em: C:\SQUAD XD\.aiox-core\knowledge\WIKI\<topic>\<concept>.md
5. Atualizar: WIKI/index.md e WIKI/log.md
```

Seguir protocolo completo em `.claude/skills/karpathy-wiki/SKILL.md`.

**Provenance obrigatório:**
- `[VERIFIED: source]` — confirmado via tool nessa sessão
- `[CITED: url]` — referenciado de URL viva
- `[ASSUMED]` — conhecimento de treino, não verificado → listar separadamente para confirmação

### /wiki-query

```
1. Ler WIKI/index.md para localizar artigos relevantes
2. Ler artigos encontrados
3. Sintetizar resposta com citações
4. Perguntar: "Arquivar essa resposta no wiki?"
```

### /wiki-lint

```
1. Verificar consistência de index.md vs arquivos existentes
2. Verificar links internos quebrados
3. Auto-fix: links com match único
4. Reportar: contradições, orphan pages, [ASSUMED] não confirmados
5. Append em WIKI/log.md
```

### /wiki-status

```
1. Ler WIKI/index.md — mostrar tabela de artigos
2. Ler WIKI/log.md — mostrar últimas 10 operações
3. Contar: RAW files, WIKI articles, total ingests
```

## Localização do Wiki

```
C:\SQUAD XD\.aiox-core\knowledge\
├── RAW\           ← Fontes brutas (imutáveis)
│   ├── sessions\  ← Insights de sessões
│   ├── campaigns\ ← Análises de campanha
│   ├── research\  ← Pesquisas e dumps do @spy
│   └── frameworks\ ← Frameworks e SOPs descobertos
└── WIKI\          ← Artigos compilados pelo LLM
    ├── index.md   ← Índice global (auto-mantido)
    └── log.md     ← Log de operações (append-only)
```

## Regras

- **Nunca modificar RAW/** — fontes são imutáveis
- **Sempre atualizar index.md e log.md** após qualquer operação
- **Provenance em tudo** — zero claim sem tag
- **[ASSUMED] devem ser confirmados** antes de virar copy ou decisão locked
- Se wiki não inicializado: criar RAW/ e WIKI/ com arquivos base automaticamente

---
*AIOX Knowledge Wiki — Compounding Intelligence Layer*
