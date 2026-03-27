# Frontend Spec — Sistema de Controle Financeiro Pessoal

**Fase:** Brownfield Discovery — Phase 3 (UX/Frontend Analysis)
**Agente:** @ux-design-expert (Uma)
**Data:** 2026-03-26
**Versao:** 1.0

---

## 1. Avaliacao de UX Atual (Excel como Plataforma)

### 1.1 Forcas do Excel como Interface

| Forca | Descricao |
|-------|-----------|
| **Familiaridade total** | Lucas ja domina Excel; zero curva de aprendizado |
| **Flexibilidade de schema** | Colunas podem ser adicionadas/removidas sem migracao |
| **Formulas nativas** | SUMIFs, VLOOKUPs e tabelas dinamicas funcionam sem codigo |
| **Visualizacao imediata** | Dados e dashboards no mesmo arquivo |
| **Portabilidade** | Arquivo unico, funciona offline, facil backup |
| **Validacao por dropdown** | Listas de categorias ja implementadas com Data Validation |

### 1.2 Limitacoes do Excel como Interface

| Limitacao | Impacto no Usuario | Severidade |
|-----------|---------------------|------------|
| **Entrada 100% manual** | Cada transacao exige 5+ campos digitados a mao | CRITICA |
| **Zero integracao bancaria** | Copiar dados do app do banco para o Excel | CRITICA |
| **Classificacao cognitiva** | Decidir entre 13 categorias para cada transacao | ALTA |
| **Sem automacao de padroes** | Mesmo fornecedor recorrente exige classificacao toda vez | ALTA |
| **Dashboard estatico** | Graficos nao atualizam automaticamente com novos dados | MEDIA |
| **Sem alertas** | Nenhuma notificacao de anomalias ou limites ultrapassados | MEDIA |
| **Sem mobile** | Impossivel registrar gastos fora do desktop | MEDIA |
| **Propenso a erros de digitacao** | Valores, datas e descricoes podem conter typos | MEDIA |
| **Sem historico de edicao granular** | Dificil rastrear correcoes feitas | BAIXA |

### 1.3 Estrutura Atual das Abas

| Aba | Funcao | Complexidade |
|-----|--------|--------------|
| **Base** | Dados brutos: data, descricao, categoria, valor, tipo | Baixa (tabela plana) |
| **Dashboard Gabarito** | Resumos visuais: totais por mes, por categoria | Media (formulas + graficos) |
| **Planilha2** | Tabelas de referencia (categorias, tipos) | Baixa (lookup tables) |
| **Analise Gabarito** | Dashboards analiticos: tendencias, comparativos | Alta (graficos compostos) |

### 1.4 Analise de Carga Cognitiva

**Decisoes por transacao:**

| Passo | Tipo de Decisao | Carga Cognitiva |
|-------|-----------------|-----------------|
| Digitar data | Recall (lembrar formato) | Baixa |
| Digitar descricao | Transcricao (copiar do extrato) | Baixa |
| Escolher categoria | Classificacao (13 opcoes) | **ALTA** |
| Digitar valor | Transcricao (copiar do extrato) | Baixa |
| Escolher tipo | Classificacao (3 opcoes) | Baixa-Media |

**Carga total por transacao:** ~60-90 segundos (estimativa)
- Transcricao: ~20s (data + descricao + valor)
- Classificacao: ~15-30s (pensar na categoria correta)
- Navegacao: ~10-15s (alternar entre extrato e Excel)
- Verificacao: ~10-15s (conferir se digitou correto)

**Carga total para 263 transacoes em 6 meses:**
- ~44 transacoes/mes
- ~45-66 minutos/mes de trabalho manual
- ~4.5-6.5 horas em 6 meses apenas para entrada de dados

### 1.5 Pontos Propensos a Erro

| Ponto | Tipo de Erro | Frequencia Estimada |
|-------|-------------|---------------------|
| Digitacao de valor | Troca de virgula/ponto, digito errado | 2-5% das transacoes |
| Categoria errada | Classificacao subjetiva (ex: "iFood" = Alimentacao ou Lazer?) | 5-10% das transacoes |
| Data incorreta | Formato errado ou data do extrato vs. data do lancamento | 1-3% das transacoes |
| Transacao esquecida | Pular linha no extrato | 3-5% do total |
| Duplicata | Digitar mesma transacao duas vezes | 1-2% das transacoes |

**Impacto:** Erros de 5-10% na classificacao significam que os dashboards de analise por categoria podem estar distorcidos em ate 10%, comprometendo decisoes financeiras.

---

## 2. Mapeamento da Jornada do Usuario

### 2.1 Jornada Atual (AS-IS)

```
JORNADA ATUAL — Registro de Transacoes Financeiras
=====================================================

[1] PREPARACAO (~2 min)
    |
    +-- Abrir app do banco no celular ou internet banking
    +-- Navegar ate extrato do periodo
    +-- Abrir Excel no desktop
    +-- Localizar ultima transacao registrada
    |
    v
[2] LOOP DE ENTRADA (repete para cada transacao, ~60-90s cada)
    |
    +-- [2a] Ler transacao no extrato bancario
    |     |
    |     +-- Identificar data
    |     +-- Ler descricao (muitas vezes criptica: "PAG*JoseDaSilva")
    |     +-- Ler valor
    |
    +-- [2b] Alternar para Excel (Alt+Tab ou troca de tela)
    |
    +-- [2c] Digitar data na coluna A
    |
    +-- [2d] Digitar descricao na coluna B
    |     |
    |     +-- Decisao: usar descricao do banco ou reescrever?
    |     +-- Muitas vezes simplifica: "PAG*JoseDaSilva" -> "Aluguel"
    |
    +-- [2e] CLASSIFICAR CATEGORIA (ponto critico)
    |     |
    |     +-- Abrir dropdown com 13 opcoes
    |     +-- Pensar: "isso e Alimentacao, Saude ou Lazer?"
    |     +-- Para itens ambiguos: hesitacao de 5-15 segundos
    |     +-- Selecionar categoria
    |
    +-- [2f] Digitar valor na coluna D
    |     |
    |     +-- Cuidado com formato (R$ 1.234,56 vs 1234.56)
    |
    +-- [2g] Selecionar tipo (Despesa / Receita / Aporte)
    |     |
    |     +-- Na maioria das vezes e "Despesa" (baixa decisao)
    |
    +-- [2h] Voltar ao extrato bancario para proxima transacao
    |
    +-- (REPETIR 2a-2h para cada transacao restante)
    |
    v
[3] VERIFICACAO (~5-10 min por sessao)
    |
    +-- Comparar total do Excel com total do extrato
    +-- Se divergente: procurar transacao faltante ou duplicada
    +-- Corrigir erros encontrados
    |
    v
[4] ANALISE (~5 min)
    |
    +-- Navegar para aba Dashboard Gabarito
    +-- Verificar totais por categoria
    +-- Navegar para aba Analise Gabarito
    +-- Observar tendencias
    +-- (Sem alertas automaticos — precisa interpretar visualmente)
    |
    v
[5] FIM DA SESSAO
    +-- Salvar arquivo
    +-- Fechar Excel
    +-- Proxima sessao: repetir tudo em 1-4 semanas
```

### 2.2 Pontos de Dor Mapeados

| Etapa | Dor | Intensidade | Frequencia |
|-------|-----|-------------|------------|
| 2b | Alternar entre telas constantemente | Alta | Toda transacao |
| 2d | Reescrever descricoes cripticas do banco | Media | ~40% das transacoes |
| 2e | Decidir categoria entre 13 opcoes | **Muito Alta** | Toda transacao |
| 2f | Formato de valor inconsistente | Media | ~10% das transacoes |
| 3 | Conferencia manual de totais | Alta | Toda sessao |
| Global | Tempo total gasto (~1h/mes) | **Muito Alta** | Mensal |
| Global | Procrastinacao (adia por ser tedioso) | Alta | Frequente |

### 2.3 Momentos de Abandono

A procrastinacao e o maior risco. Quando o usuario acumula transacoes por semanas, o volume gera:
- Sensacao de "tarefa pesada" ao abrir o Excel
- Maior chance de erros (memoria do gasto ja se perdeu)
- Menor precisao na classificacao (pressa para terminar logo)
- Possibilidade de abandonar o controle financeiro por completo

---

## 3. Visao de UX Ideal (TO-BE)

### 3.1 Fluxo de Importacao Inteligente

```
JORNADA IDEAL — Importacao com Classificacao por IA
=====================================================

[1] IMPORTACAO (~30 segundos)
    |
    +-- Abrir aplicacao web
    +-- Arrastar arquivo CSV/OFX do banco para area de drop
    |   (ou colar dados copiados do extrato)
    +-- Sistema faz parse automatico:
    |     +-- Detecta banco pelo formato
    |     +-- Extrai data, descricao, valor
    |     +-- Identifica duplicatas com transacoes existentes
    |
    v
[2] CLASSIFICACAO POR IA (~1-2 minutos para lote inteiro)
    |
    +-- IA classifica cada transacao automaticamente
    +-- Exibe lista com indicadores de confianca:
    |
    |   VERDE  (>=90% confianca) — Classificacao automatica
    |   Ex: "NETFLIX" -> Assinaturas [v] confianca 98%
    |
    |   AMARELO (60-89% confianca) — Sugestao para revisar
    |   Ex: "PAG*JoseDaSilva" -> Moradia? [?] confianca 72%
    |
    |   VERMELHO (<60% confianca) — Necessita input manual
    |   Ex: "PIX RECEBIDO" -> ??? [!] sem contexto
    |
    +-- Acoes em lote:
    |     +-- [Aprovar Todos Verdes] — um clique
    |     +-- Revisar amarelos individualmente (dropdown inline)
    |     +-- Preencher vermelhos manualmente
    |
    v
[3] CONFIRMACAO (~10 segundos)
    |
    +-- Resumo pre-importacao:
    |     "42 transacoes | 38 auto-classificadas | 3 revisadas | 1 manual"
    +-- Botao [Confirmar Importacao]
    +-- Transacoes salvas no banco de dados
    |
    v
[4] DASHBOARD AUTOMATICO (tempo zero — ja esta atualizado)
    |
    +-- Visao mensal atualizada instantaneamente
    +-- Alertas automaticos aparecem:
    |     "Lazer 40% acima da media dos ultimos 3 meses"
    |     "Alimentacao dentro do orcamento (78% utilizado)"
    +-- Nenhuma acao necessaria — apenas consumir informacao
    |
    v
[5] FIM
    +-- Tempo total: ~2-3 minutos (vs. ~45-66 minutos no Excel)
    +-- Reducao: 95% do tempo eliminado
```

### 3.2 Tela de Importacao — Wireframe Conceitual

```
+------------------------------------------------------------------+
|  IMPORTAR TRANSACOES                                    [X Fechar]|
+------------------------------------------------------------------+
|                                                                    |
|  +------------------------------------------------------------+  |
|  |                                                              |  |
|  |     Arraste o arquivo CSV ou OFX aqui                       |  |
|  |                                                              |  |
|  |     ou [Escolher Arquivo]  [Colar do Extrato]               |  |
|  |                                                              |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Banco detectado: Bradesco          Periodo: Jan/2026              |
|  Transacoes encontradas: 42         Duplicatas ignoradas: 3        |
|                                                                    |
|  +------------------------------------------------------------+  |
|  | # | Data       | Descricao           | Categoria    | Valor  | |
|  |---|------------|---------------------|--------------|--------| |
|  | 1 | 05/01/2026 | NETFLIX             | Assinaturas  | -39,90 | |
|  |   |            |                     | [v] 98%      |        | |
|  | 2 | 06/01/2026 | SUPERMERCADO BIG    | Alimentacao  | -287,45| |
|  |   |            |                     | [v] 95%      |        | |
|  | 3 | 10/01/2026 | PAG*JoseDaSilva     | Moradia [?]  |-1200,00| |
|  |   |            |                     | [?] 72%      |        | |
|  | 4 | 15/01/2026 | PIX RECEBIDO        | [Selecionar] | +500,00| |
|  |   |            |                     | [!] manual   |        | |
|  +------------------------------------------------------------+  |
|                                                                    |
|  [Aprovar Todos Verdes (38)]    [Confirmar Importacao]             |
|                                                                    |
+------------------------------------------------------------------+
```

### 3.3 Dashboard Principal — Wireframe Conceitual

```
+------------------------------------------------------------------+
|  FINANCAS PESSOAIS            Marco 2026       [< Fev] [Abr >]   |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------+  +------------------+  +------------------+ |
|  | RECEITAS         |  | DESPESAS         |  | SALDO            | |
|  | R$ 8.500,00      |  | R$ 6.234,00      |  | R$ 2.266,00      | |
|  | +2.3% vs mes ant |  | -5.1% vs mes ant |  | Taxa poupanca:   | |
|  |                  |  |                  |  | 26.7%            | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                    |
|  GASTOS POR CATEGORIA               ORCAMENTO                     |
|  +------------------------+  +-------------------------------+    |
|  |                        |  |                               |    |
|  |    [Donut Chart]       |  | Alimentacao  ████████░░ 78%   |    |
|  |                        |  | Moradia      ██████████ 100%  |    |
|  |  Alimentacao   28%     |  | Transporte   █████░░░░░ 52%  |    |
|  |  Moradia       22%     |  | Saude        ██░░░░░░░░ 23%  |    |
|  |  Transporte    15%     |  | Lazer        ████████████ !   |    |
|  |  Lazer         12%     |  |              120% ACIMA       |    |
|  |  Outros        23%     |  | Assinaturas  ██████░░░░ 65%  |    |
|  |                        |  |                               |    |
|  +------------------------+  +-------------------------------+    |
|                                                                    |
|  ALERTAS                                                           |
|  +------------------------------------------------------------+  |
|  | [!] Lazer 40% acima da media dos ultimos 3 meses            |  |
|  | [i] Assinaturas: novo servico detectado (Disney+ R$33,90)   |  |
|  | [v] Alimentacao dentro do orcamento pelo 3o mes consecutivo |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  TRANSACOES RECENTES                          [Ver Todas >]       |
|  +------------------------------------------------------------+  |
|  | 25/03 | iFood              | Alimentacao | -45,90  | [Editar]| |
|  | 24/03 | Uber               | Transporte  | -23,50  | [Editar]| |
|  | 23/03 | Farmacia Drogasil  | Saude       | -89,00  | [Editar]| |
|  | 22/03 | Spotify            | Assinaturas | -21,90  | [Editar]| |
|  +------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### 3.4 Tela de Transacoes (Estilo Planilha)

Para manter a familiaridade com Excel, a tela de transacoes deve ser uma **tabela editavel inline**:

```
+------------------------------------------------------------------+
|  TRANSACOES            [Filtrar v]  [Buscar...]  [+ Adicionar]    |
+------------------------------------------------------------------+
|  Mes: [Marco 2026 v]  Categoria: [Todas v]  Tipo: [Todos v]      |
+------------------------------------------------------------------+
|  Data       | Descricao              | Categoria     | Valor     ||
|-------------|------------------------|---------------|-----------|+
|  25/03/2026 | iFood                  | Alimentacao   | -45,90    ||
|  24/03/2026 | Uber                   | Transporte    | -23,50    ||
|  23/03/2026 | Farmacia Drogasil      | Saude         | -89,00    ||
|  22/03/2026 | Spotify                | Assinaturas   | -21,90    ||
|  ...        | ...                    | ...           | ...       ||
+------------------------------------------------------------------+
|  Total: R$ -6.234,00       42 transacoes       [Exportar CSV]     |
+------------------------------------------------------------------+

Comportamento:
- Clicar em qualquer celula = edicao inline (como Excel)
- Tab = proxima celula
- Enter = proxima linha
- Categoria = dropdown inline ao clicar
- Ctrl+Z = desfazer
- Ordenar por qualquer coluna (clicar no cabecalho)
```

### 3.5 Experiencia Mobile

```
MOBILE — Adicao Rapida
+-------------------------+
|  [<]  ADICIONAR GASTO   |
+-------------------------+
|                         |
|  R$ [         0,00    ] |
|                         |
|  [Alimentacao  v]       |
|                         |
|  Descricao (opcional):  |
|  [                    ] |
|                         |
|  [   SALVAR   ]        |
|                         |
+-------------------------+

MOBILE — Resumo Diario (Push Notification)
+-------------------------+
| Resumo de hoje:         |
| 3 gastos | R$ 159,40    |
| Alimentacao: R$ 89,50   |
| Transporte: R$ 69,90    |
| [Ver detalhes]          |
+-------------------------+

MOBILE — Categorizar por Swipe
+-------------------------+
| PIX RECEBIDO R$ 500,00  |
|                         |
|  <-- Receita   Aporte -->|
|                         |
| SUPERMERCADO R$ -287,00  |
|                         |
|  <-- Aliment.   Saude -->|
+-------------------------+
```

---

## 4. As 13 Categorias — Analise e Recomendacoes

### 4.1 Categorias Atuais

| # | Categoria | Tipo Predominante | Frequencia Estimada |
|---|-----------|-------------------|---------------------|
| 1 | Alimentacao | Despesa | Alta (diaria) |
| 2 | Moradia | Despesa | Baixa (mensal fixo) |
| 3 | Transporte | Despesa | Alta (diaria) |
| 4 | Saude | Despesa | Media (semanal) |
| 5 | Educacao | Despesa | Baixa (mensal) |
| 6 | Lazer | Despesa | Media (semanal) |
| 7 | Vestuario | Despesa | Baixa (mensal) |
| 8 | Assinaturas | Despesa | Baixa (mensal fixo) |
| 9 | Impostos | Despesa | Baixa (mensal/anual) |
| 10 | Investimentos | Aporte | Baixa (mensal) |
| 11 | Servicos | Despesa | Media |
| 12 | Presentes | Despesa | Baixa (eventual) |
| 13 | Outros | Despesa | Media (catch-all) |

### 4.2 Problemas de Classificacao Identificados

**Ambiguidades conhecidas:**
- iFood: Alimentacao ou Lazer? (depende se e refeicao ou pedido social)
- Farmacia: Saude ou Beleza? (mistura remedios e cosmeticos)
- Uber/99: Transporte ou Lazer? (depende do destino)
- Mercado Livre: Vestuario, Eletronicos ou Outros? (depende do produto)

**Recomendacao:** A IA deve aprender padroes do usuario. Se Lucas sempre classifica iFood como Alimentacao, o sistema deve replicar isso automaticamente.

### 4.3 Modelo de Aprendizado de Classificacao

```
Prioridade de classificacao:
1. Regra exata do usuario (ex: "NETFLIX" = sempre Assinaturas)
2. Historico do usuario (ex: "iFood" classificado 95% como Alimentacao)
3. Padrao do fornecedor (ex: supermercados = Alimentacao)
4. Modelo de IA generico (NLP na descricao)
5. Fallback: marcar como "Outros" + flag para revisao
```

---

## 5. Principios de UX para Este Projeto

### 5.1 Principio 1: Velocidade Acima de Features

> O usuario quer gastar MENOS tempo com financas, nao mais.

**Implicacoes:**
- Cada tela deve ter no maximo 1 acao principal
- Import + classificacao de 40 transacoes em menos de 3 minutos
- Zero configuracao inicial alem de "importar primeiro arquivo"
- Nenhum tutorial obrigatorio — interface auto-explicativa

### 5.2 Principio 2: Padroes Familiares

> O usuario e desenvolvedor e domina Excel. Nao reinventar a roda.

**Implicacoes:**
- Tabelas editaveis inline (nao formularios modais)
- Atalhos de teclado (Tab, Enter, Ctrl+Z)
- Filtros por coluna
- Exportar para CSV sempre disponivel
- Nunca esconder dados brutos atras de abstraccoes

### 5.3 Principio 3: Revelacao Progressiva

> Interface simples por padrao, detalhes sob demanda.

**Implicacoes:**
- Dashboard mostra resumo → clicar para detalhar
- Lista de transacoes mostra campos essenciais → expandir para metadata
- Configuracoes avancadas escondidas em menu secundario
- Primeiro uso: tela de importacao, nada mais

### 5.4 Principio 4: IA-First na Classificacao

> Reduzir decisoes manuais a quase zero.

**Implicacoes:**
- Classificacao automatica ANTES de mostrar ao usuario
- Usuario apenas VALIDA, nao DECIDE
- Aprendizado continuo: cada correcao melhora o modelo
- Meta: 90%+ de classificacao automatica apos 2 meses de uso
- Transparencia: sempre mostrar por que a IA escolheu aquela categoria

### 5.5 Principio 5: Lote Acima de Individual

> Processar 40 transacoes de uma vez, nao uma por uma.

**Implicacoes:**
- Import em lote como fluxo principal (nao "adicionar transacao")
- "Aprovar todos" como acao primaria
- Filtrar e editar em massa (ex: "todas as transacoes iFood → Alimentacao")
- Revisao por excecao: so mostrar o que precisa de atencao

---

## 6. Abordagem de Interface Recomendada

### 6.1 Opcoes Avaliadas

| Abordagem | Prós | Contras | Nota (1-5) |
|-----------|------|---------|------------|
| **Google Sheets + Sidebar** | Zero hosting, familiar, formulas nativas | Limitado em UX, sem IA nativa, sidebar lenta | 2 |
| **Web App (Next.js)** | Controle total, IA integrada, mobile-ready | Requer hosting, banco de dados, mais dev | 4 |
| **Spreadsheet-like Web UI** | Familiaridade Excel + poder de web app | Complexidade de implementacao do grid | 3.5 |
| **Electron Desktop App** | Offline, nativo, performante | Over-engineering, sem mobile | 2 |
| **PWA com UI hibrida** | Melhor dos dois mundos: web + mobile + offline | Requer Service Worker, mais complexidade | 4.5 |

### 6.2 Recomendacao: PWA com Next.js + UI Hibrida

**Justificativa:**

1. **Next.js** ja e a stack do projeto (packages/aiox-docs e packages/zero-diastasis-site usam Next.js)
2. **PWA** permite instalar no celular sem app store, funciona offline para consulta
3. **UI hibrida** combina tabela editavel (familiaridade Excel) com componentes ricos (graficos, drag-and-drop)
4. **Supabase** como backend (ja mencionado no ecossistema MCP) oferece auth, banco e RLS de graca no tier free
5. **Edge functions** do Supabase podem rodar a classificacao por IA server-side

### 6.3 Stack Tecnica Proposta

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Framework** | Next.js 14+ (App Router) | Ja usado no projeto, SSR + CSR |
| **UI Base** | Tailwind CSS | Ja usado no projeto |
| **Tabela Editavel** | TanStack Table (react-table v8) | Leve, headless, Excel-like |
| **Graficos** | Recharts ou Chart.js | Simples, boa DX, leve |
| **Drag & Drop** | react-dropzone | Import de arquivos |
| **Estado** | Zustand | Leve, sem boilerplate |
| **Backend** | Supabase (Postgres + Auth + Edge Functions) | Free tier, RLS, real-time |
| **IA Classificacao** | Claude API (via Edge Function) | Mesmo ecossistema AIOX |
| **PWA** | next-pwa | Offline + instalavel |
| **Parser CSV/OFX** | papaparse + ofx-js | Parse de arquivos bancarios |

### 6.4 Arquitetura de Paginas

```
/                          → Dashboard (visao mensal)
/importar                  → Tela de importacao (drag & drop + classificacao IA)
/transacoes                → Lista editavel de transacoes (estilo planilha)
/transacoes/[id]           → Detalhe de transacao (mobile)
/categorias                → Gerenciar categorias e regras de classificacao
/relatorios                → Analises avancadas e comparativos
/configuracoes             → Preferencias, exportacao, conta
```

### 6.5 Modelo de Dados Simplificado

```
transacoes
----------
id              UUID (PK)
user_id         UUID (FK -> auth.users)
data            DATE
descricao       TEXT
descricao_banco TEXT (original do extrato)
categoria_id    UUID (FK -> categorias)
valor           DECIMAL(12,2)
tipo            ENUM('despesa', 'receita', 'aporte')
confianca_ia    DECIMAL(3,2)  -- 0.00 a 1.00
classificado_por ENUM('ia_auto', 'ia_sugestao', 'manual')
fonte           TEXT  -- 'csv_bradesco', 'manual', 'ofx_nubank'
hash_extrato    TEXT  -- para deteccao de duplicatas
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ

categorias
----------
id              UUID (PK)
user_id         UUID (FK -> auth.users)
nome            TEXT
icone           TEXT
cor             TEXT (hex)
orcamento       DECIMAL(12,2) (nullable)
ativa           BOOLEAN
ordem           INTEGER

regras_classificacao
--------------------
id              UUID (PK)
user_id         UUID (FK -> auth.users)
padrao          TEXT  -- regex ou texto exato
categoria_id    UUID (FK -> categorias)
prioridade      INTEGER
tipo_match      ENUM('exato', 'contem', 'regex')
criado_por      ENUM('usuario', 'ia_aprendido')
acuracia        DECIMAL(3,2)
usos            INTEGER
```

---

## 7. Metricas de Sucesso de UX

### 7.1 KPIs Primarios

| Metrica | Baseline (Excel) | Meta (Aplicacao) | Melhoria |
|---------|-------------------|-------------------|----------|
| Tempo por sessao de importacao | 45-66 min/mes | 3-5 min/mes | **93% reducao** |
| Tempo por transacao | 60-90 seg | 3-5 seg (revisao) | **95% reducao** |
| Taxa de classificacao automatica | 0% | 90%+ apos 2 meses | N/A |
| Erros de classificacao | 5-10% | <2% | **75% reducao** |
| Frequencia de uso | 1x/mes (procrastina) | Semanal ou apos cada extrato | **4x mais frequente** |

### 7.2 KPIs Secundarios

| Metrica | Meta |
|---------|------|
| Time to first import (onboarding) | < 2 minutos |
| Taxa de aprovacao em lote (sem correcao) | > 85% |
| Transacoes que precisam de input manual | < 5% |
| Tempo para visualizar dashboard apos importacao | 0 seg (automatico) |
| NPS do usuario (auto-avaliacao) | >= 8 |

---

## 8. Fluxo de Onboarding Proposto

```
ONBOARDING — Primeira Vez
============================

[1] Tela de Boas-Vindas
    "Importe seu primeiro extrato bancario e veja a magica acontecer."
    [Comecar]

[2] Importar Primeiro Arquivo
    Area de drag & drop
    Suporte: CSV (Bradesco, Nubank, Itau, Inter) + OFX
    Parse automatico + preview dos dados

[3] Revisar Classificacao da IA
    IA classifica todas as transacoes
    Usuario revisa e corrige o que for necessario
    "Cada correcao ensina o sistema. Na proxima vez, sera automatico."

[4] Confirmar Categorias
    Mostrar as 13 categorias padrao
    "Quer adicionar ou remover alguma?"
    [Usar padrao] [Personalizar]

[5] Dashboard Pronto
    Dashboard completo com os dados importados
    "Pronto! Seu painel financeiro esta no ar."
    [Importar mais meses] [Explorar dashboard]
```

---

## 9. Acessibilidade e Responsividade

### 9.1 Breakpoints

| Breakpoint | Dispositivo | Layout |
|------------|-------------|--------|
| < 640px | Mobile | Cards empilhados, tabela horizontal scroll |
| 640-1024px | Tablet | Grid 2 colunas, tabela compacta |
| > 1024px | Desktop | Layout completo, tabela estilo planilha |

### 9.2 Acessibilidade Basica

- Contraste minimo WCAG AA (4.5:1 para texto)
- Navegacao por teclado completa (Tab, Enter, Esc)
- Labels em todos os campos de formulario
- Feedbacks visuais E textuais (nao depender apenas de cor)
- Focus visible em todos os elementos interativos

---

## 10. Riscos de UX e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| IA classificar errado gera desconfianca | Alta (inicio) | Alto | Mostrar confianca %, permitir correcao facil, aprender rapido |
| Usuario preferir Excel pela inércia | Media | Alto | Garantir que import + revisao seja mais rapido que digitar |
| Formato de CSV varia entre bancos | Alta | Medio | Parser adaptativo + templates por banco + fallback manual |
| Sobrecarga de features no dashboard | Media | Medio | Revelacao progressiva — comecar simples, expandir sob demanda |
| Performance com muitos dados | Baixa (263 transacoes e pouco) | Baixo | Paginacao server-side, virtual scrolling se crescer |
| Perda de dados (confianca) | Baixa | Muito Alto | Backup automatico, exportar CSV, historico de edicoes |

---

## 11. Proximos Passos (Recomendacoes para @architect e @dev)

1. **@architect:** Validar stack tecnica proposta (Next.js + Supabase + TanStack Table)
2. **@architect:** Definir arquitetura de classificacao por IA (Edge Function vs. API Route)
3. **@data-engineer:** Detalhar schema do banco (DDL completo baseado no modelo da secao 6.5)
4. **@dev:** Protipar tela de importacao (drag & drop + parse CSV Bradesco)
5. **@dev:** Protipar tabela editavel inline com TanStack Table
6. **@pm:** Priorizar: MVP = Import + Classificacao IA + Dashboard basico
7. **@qa:** Definir cenarios de teste para acuracia da classificacao por IA

---

## Apendice A: Comparativo de Tempo (Excel vs. Aplicacao)

```
CENARIO: Importar 44 transacoes de um mes
==========================================

EXCEL (atual):
  Preparacao:                    2 min
  Entrada de dados (44 x 75s):  55 min
  Verificacao:                   8 min
  Analise do dashboard:          5 min
  ----------------------------------------
  TOTAL:                         ~70 min

APLICACAO (proposta):
  Importar CSV:                  0.5 min
  Revisar classificacao IA:      2 min (so amarelos e vermelhos)
  Confirmar:                     0.1 min
  Dashboard (automatico):        0 min
  ----------------------------------------
  TOTAL:                         ~2.6 min

ECONOMIA POR MES:              ~67 minutos (96% de reducao)
ECONOMIA POR ANO:              ~13.4 horas
```

---

## Apendice B: Mapa de Emocoes do Usuario

| Etapa (Atual) | Emocao | Etapa (Proposta) | Emocao |
|----------------|--------|-------------------|--------|
| Abrir Excel depois de semanas | Culpa, resistencia | Abrir app e arrastar arquivo | Neutro, rapido |
| Digitar transacao por transacao | Tedio, frustacao | Ver IA classificar tudo | Surpresa positiva |
| Decidir categoria ambigua | Duvida, fadiga decisoria | Revisar sugestao da IA | Confianca, controle |
| Descobrir erro nos totais | Ansiedade, irritacao | Totais calculados automaticamente | Tranquilidade |
| Ver dashboard final | Satisfacao (se correto) | Ver dashboard instantaneo | Satisfacao + insights |
| Fechar Excel | Alivio ("acabou") | Fechar app | Sensacao de "facil" |

---

*Documento gerado por @ux-design-expert (Uma) — Brownfield Discovery Phase 3*
*Synkra AIOX Framework v4.0*
