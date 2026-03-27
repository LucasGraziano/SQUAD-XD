# Arquitetura do Sistema — Controle Financeiro Pessoal

> **Fase:** Brownfield Discovery — Phase 1 (System Architecture)
> **Agente:** @architect (Aria)
> **Data:** 2026-03-26
> **Status:** Draft
> **Projeto:** Migração do Controle Financeiro OG V2 (Excel) para sistema automatizado

---

## 1. Visao Geral

Este documento analisa o sistema atual de controle financeiro pessoal baseado em Excel ("Controle Financeiro OG V2"), identifica limitacoes e debitos tecnicos, e propoe uma arquitetura de solucao que resolva os principais pontos de dor do usuario.

### 1.1 Escopo do Sistema Atual

| Dimensao | Valor |
|----------|-------|
| Transacoes registradas | 263 |
| Periodo coberto | 6 meses (Ago/2025 - Fev/2026) |
| Volume medio mensal | ~44 transacoes/mes |
| Tipos de transacao | 3 (Despesa, Receita, Aporte) |
| Categorias de despesa | 13 |
| Volume financeiro total | R$ 85.269,53 |
| Planilhas no arquivo | 4 (Base, Dashboard Gabarito, Planilha2, Analise Gabarito) |

---

## 2. Analise do Sistema Atual (AS-IS)

### 2.1 Como o Excel Funciona como "Sistema"

O Excel atua simultaneamente como banco de dados, interface de entrada, motor de regras e camada de visualizacao — todas as responsabilidades concentradas em um unico arquivo.

```
+-------------------------------------------------------------------+
|                    EXCEL: Controle Financeiro OG V2                |
|                                                                   |
|  +-----------------+    +---------------------+                   |
|  |   Planilha      |    |   Dashboard         |                   |
|  |   "Base"        |--->|   Gabarito          |                   |
|  |   (263 linhas)  |    |   (Formulas/Graficos)|                  |
|  |                 |    +---------------------+                   |
|  |  9 colunas:     |                                              |
|  |  Data, Ano, Mes |    +---------------------+                   |
|  |  Mes_extenso    |--->|   Analise           |                   |
|  |  Tipo, Categoria|    |   Gabarito          |                   |
|  |  Cat_receita    |    |   (Analise avancada)|                   |
|  |  Descricao      |    +---------------------+                   |
|  |  Valor          |                                              |
|  +-----------------+    +---------------------+                   |
|                         |   Planilha2         |                   |
|                         |   (Referencia)      |                   |
|                         +---------------------+                   |
+-------------------------------------------------------------------+
```

**Camadas identificadas no Excel:**

| Camada | Implementacao Excel | Limitacao |
|--------|-------------------|-----------|
| **Entrada de dados** | Digitacao manual em celulas | Zero automacao, erro humano |
| **Validacao** | Nenhuma (ou listas suspensas basicas) | Dados inconsistentes possiveis |
| **Classificacao** | Manual pelo usuario, coluna por coluna | Principal ponto de dor |
| **Armazenamento** | Arquivo .xlsx local | Sem backup, sem versionamento |
| **Processamento** | Formulas Excel (SUMIFS, VLOOKUP, etc.) | Limitado, fragil |
| **Visualizacao** | Graficos nativos do Excel | Estaticos, pouco interativos |

### 2.2 Fluxo de Dados Atual

```
  [Extrato Bancario]     [Memoria do Usuario]
        |                        |
        v                        v
  +------------------+    +------------------+
  | Abrir PDF/App    |    | Lembrar compras  |
  | do Banco         |    | em dinheiro      |
  +------------------+    +------------------+
        |                        |
        +----------+-------------+
                   |
                   v
        +---------------------+
        | ENTRADA MANUAL      |
        | no Excel            |
        | (celula por celula) |
        +---------------------+
                   |
                   v
        +---------------------+
        | CLASSIFICACAO       |
        | MANUAL              |
        | - Escolher Tipo     |
        | - Escolher Categoria|
        | - Preencher data    |
        | - Preencher valor   |
        +---------------------+
                   |
                   v
        +---------------------+
        | FORMULAS EXCEL      |
        | - SUMIFS por mes    |
        | - Totais por categ. |
        | - Dashboard auto    |
        +---------------------+
                   |
                   v
        +---------------------+
        | ANALISE VISUAL      |
        | - Dashboard Gabarito|
        | - Analise Gabarito  |
        | - Decisoes manuais  |
        +---------------------+
```

### 2.3 Pontos de Dor e Gargalos

#### Ponto de Dor #1: Classificacao Manual (CRITICO)

O usuario precisa classificar **cada uma das ~44 transacoes mensais** individualmente. Isso envolve:

- Ler a descricao do extrato bancario (muitas vezes cripetica: "PAG*JoseDaSilva", "TRANSF PIX")
- Decidir o Tipo (Despesa, Receita ou Aporte)
- Decidir a Categoria entre 13 opcoes
- Preencher a categoria de receita quando aplicavel

**Impacto:** Este e o principal motivo pelo qual o usuario quer automatizar o sistema.

#### Ponto de Dor #2: Entrada Manual de Dados

Cada transacao requer preenchimento de ate 9 campos manualmente. Com 44 transacoes/mes, sao **~396 campos preenchidos por mes**.

#### Ponto de Dor #3: Sem Integracao Bancaria

O usuario precisa alternar entre o app/site do banco e o Excel, copiando informacoes manualmente. Nao ha importacao de OFX, CSV ou integracao via API.

#### Ponto de Dor #4: Analise Limitada

As formulas do Excel oferecem apenas:
- Totais por categoria/mes (SUMIFS)
- Graficos basicos de pizza/barra
- Sem tendencias, previsoes, ou insights inteligentes

#### Ponto de Dor #5: Fragilidade do Sistema

- Formulas podem quebrar com alteracoes estruturais
- Sem validacao de dados robusta
- Arquivo local sem backup automatico
- Sem acesso mobile

### 2.4 Estimativa de Tempo Gasto

| Atividade | Tempo/Transacao | Transacoes/Mes | Tempo/Mes |
|-----------|----------------|----------------|-----------|
| Copiar dados do extrato | ~30s | 44 | ~22 min |
| Classificar tipo | ~5s | 44 | ~4 min |
| Classificar categoria | ~15s | 44 | ~11 min |
| Preencher campos restantes | ~20s | 44 | ~15 min |
| Revisar/corrigir erros | — | — | ~10 min |
| Analisar dashboards | — | — | ~15 min |
| **TOTAL** | | | **~77 min/mes** |

**Estimativa anual:** ~15 horas/ano gastas em entrada e classificacao manual de dados.

---

## 3. Debito Tecnico e Limitacoes

### 3.1 Inventario de Debitos

| # | Debito | Severidade | Impacto |
|---|--------|-----------|---------|
| DT-01 | Sem automacao de entrada de dados | ALTA | 52 min/mes em trabalho manual |
| DT-02 | Sem integracao bancaria | ALTA | Duplicacao de esforco, risco de erro |
| DT-03 | Classificacao 100% manual | CRITICA | Principal ponto de dor do usuario |
| DT-04 | Analise limitada a formulas Excel | MEDIA | Insights superficiais, sem tendencias |
| DT-05 | Arquivo local, sem backup | MEDIA | Risco de perda total de dados |
| DT-06 | Sem acesso mobile | BAIXA | Nao registra gastos em tempo real |
| DT-07 | Single-user, sem sync | BAIXA | Impossivel usar em multiplos dispositivos |
| DT-08 | Sem alertas/notificacoes | BAIXA | Sem avisos de orcamento excedido |
| DT-09 | Sem versionamento de dados | MEDIA | Impossivel rastrear mudancas |
| DT-10 | Categorias estaticas e rigidas | MEDIA | Dificil adaptar conforme habitos mudam |

### 3.2 Mapa de Risco

```
IMPACTO
  ALTO  |  DT-05    |  DT-01, DT-02  |  DT-03
        |           |                  |
 MEDIO  |  DT-09    |  DT-04, DT-10   |
        |           |                  |
 BAIXO  |  DT-07    |  DT-06, DT-08   |
        +-----------+------------------+----------
          BAIXA        MEDIA             ALTA
                    PROBABILIDADE DE IMPACTO NO DIA-A-DIA
```

---

## 4. Opcoes de Arquitetura de Solucao

### 4.1 Opcao A: Smart Excel + Scripts (Baixo esforco)

**Conceito:** Manter o Excel como base, adicionando automacoes via macros VBA ou scripts Python.

```
+-------------------------------------------------------------------+
|                     Excel + Automacao                              |
|                                                                   |
|  +------------------+     +------------------+                    |
|  | Script Python    |     | VBA Macros       |                    |
|  | - Parse CSV/OFX  |     | - Auto-fill data |                    |
|  | - Classificacao  |     | - Validacao      |                    |
|  |   por regras     |     | - Dashboard auto |                    |
|  +------------------+     +------------------+                    |
|          |                        |                               |
|          v                        v                               |
|  +------------------------------------------------+              |
|  |           Excel "Controle Financeiro"           |              |
|  |           (mesmo arquivo melhorado)             |              |
|  +------------------------------------------------+              |
+-------------------------------------------------------------------+
```

**Stack Tecnologico:**
- Excel/LibreOffice com VBA
- Python + openpyxl para scripts de importacao
- Regras de classificacao em dicionario (descricao → categoria)

**Avaliacao:**

| Criterio | Nota (1-5) | Justificativa |
|----------|-----------|---------------|
| Facilidade de implementacao | 5 | Poucas horas de trabalho |
| Curva de aprendizado | 5 | Usuario ja conhece Excel |
| Resolucao da classificacao | 2 | Apenas regras fixas, sem ML |
| Escalabilidade | 1 | Limitado ao que Excel oferece |
| Acesso mobile | 1 | Nao resolve |
| Backup/sync | 1 | Nao resolve (a menos que mude pra OneDrive) |
| **Media** | **2.5** | |

**Veredito:** Resolve parcialmente o problema de entrada, mas nao ataca a classificacao inteligente nem oferece evolucao.

---

### 4.2 Opcao B: Web App Completo (Medio esforco)

**Conceito:** Aplicacao web moderna com banco de dados, API, importacao de extratos e classificacao por ML.

```
+-------------------------------------------------------------------+
|                        Web App Stack                               |
|                                                                   |
|  +------------------+     +------------------+                    |
|  | Frontend         |     | Backend/API      |                    |
|  | Next.js + React  |     | Next.js API      |                    |
|  | - Dashboard      |     | Routes           |                    |
|  | - Formularios    |     | - Auth           |                    |
|  | - Graficos       |     | - CRUD           |                    |
|  | (Recharts/       |     | - Classificacao  |                    |
|  |  Tremor)         |     |   ML/AI          |                    |
|  +------------------+     +------------------+                    |
|          |                        |                               |
|          v                        v                               |
|  +------------------------------------------------+              |
|  |              Supabase (PostgreSQL)              |              |
|  |  - Tabela transacoes                            |              |
|  |  - Tabela categorias                            |              |
|  |  - Tabela regras_classificacao                  |              |
|  |  - RLS por usuario                              |              |
|  +------------------------------------------------+              |
|                        |                                          |
|                        v                                          |
|  +------------------------------------------------+              |
|  |         Servico de Classificacao AI             |              |
|  |  - Claude API / OpenAI API                      |              |
|  |  - Treinamento com historico do usuario          |              |
|  |  - Feedback loop (usuario corrige → modelo      |              |
|  |    aprende)                                      |              |
|  +------------------------------------------------+              |
+-------------------------------------------------------------------+
```

**Stack Tecnologico:**
- Next.js 15 (App Router) + TypeScript
- Supabase (Auth + PostgreSQL + Storage)
- Tailwind CSS + shadcn/ui
- Recharts ou Tremor para dashboards
- Claude API para classificacao inteligente
- Vercel para deploy

**Avaliacao:**

| Criterio | Nota (1-5) | Justificativa |
|----------|-----------|---------------|
| Facilidade de implementacao | 2 | Semanas de desenvolvimento |
| Curva de aprendizado | 3 | Interface nova para o usuario |
| Resolucao da classificacao | 5 | AI + feedback loop = excelente |
| Escalabilidade | 5 | Arquitetura moderna, sem limites |
| Acesso mobile | 5 | PWA responsivo, acesso de qualquer lugar |
| Backup/sync | 5 | Cloud nativo, backup automatico |
| **Media** | **4.2** | |

**Veredito:** Solucao mais completa e escalavel, porem requer investimento significativo de tempo para desenvolvimento.

---

### 4.3 Opcao C: Google Sheets + AI (Sweet Spot)

**Conceito:** Migrar para Google Sheets mantendo a familiaridade da planilha, adicionando automacao via Apps Script e classificacao inteligente via API de IA.

```
+-------------------------------------------------------------------+
|                  Google Sheets + AI Hybrid                         |
|                                                                   |
|  +--------------------------------------------------+            |
|  |            Google Sheets                          |            |
|  |  (Interface familiar para o usuario)              |            |
|  |                                                   |            |
|  |  +-------------+  +-------------+  +-----------+ |            |
|  |  | Aba "Base"  |  | Aba "Dash"  |  | Aba       | |            |
|  |  | (Transacoes)|  | (Graficos)  |  | "Config"  | |            |
|  |  +------+------+  +------+------+  +-----+-----+ |            |
|  +---------|----------------|-----------------|------+            |
|            |                |                 |                   |
|            v                v                 v                   |
|  +--------------------------------------------------+            |
|  |          Google Apps Script (Backend)              |            |
|  |                                                   |            |
|  |  +----------------+  +-------------------------+  |            |
|  |  | Parser OFX/CSV |  | Trigger Automatico      |  |            |
|  |  | - Extrato banco|  | - onEdit()              |  |            |
|  |  | - Normalizacao |  | - onFormSubmit()        |  |            |
|  |  | - Dedup        |  | - Time-driven (mensal)  |  |            |
|  |  +-------+--------+  +------------+------------+  |            |
|  |          |                        |                |            |
|  |          v                        v                |            |
|  |  +--------------------------------------------+   |            |
|  |  |       Modulo de Classificacao              |   |            |
|  |  |  1. Regras locais (descricao→categoria)    |   |            |
|  |  |  2. Se nao encontrou → chamar AI API       |   |            |
|  |  |  3. Salvar nova regra aprendida            |   |            |
|  |  +--------------------------------------------+   |            |
|  +--------------------------------------------------+            |
|                         |                                         |
|                         v                                         |
|  +--------------------------------------------------+            |
|  |           API de IA (Claude / OpenAI)             |            |
|  |                                                   |            |
|  |  Prompt: "Classifique esta transacao bancaria     |            |
|  |  nas categorias do usuario: {lista_categorias}    |            |
|  |  Transacao: {descricao} Valor: {valor}            |            |
|  |  Historico similar: {transacoes_parecidas}"        |            |
|  +--------------------------------------------------+            |
|                         |                                         |
|  +--------------------------------------------------+            |
|  |        Looker Studio (Opcional - Dashboards)      |            |
|  |  - Conecta direto ao Google Sheets                |            |
|  |  - Dashboards interativos e modernos              |            |
|  |  - Compartilhavel, acessivel por link             |            |
|  +--------------------------------------------------+            |
+-------------------------------------------------------------------+
```

**Stack Tecnologico:**
- Google Sheets (interface + armazenamento)
- Google Apps Script (automacao backend)
- Claude API ou OpenAI API (classificacao inteligente)
- Google Drive (backup automatico + versionamento)
- Looker Studio (dashboards avancados, opcional)

**Avaliacao:**

| Criterio | Nota (1-5) | Justificativa |
|----------|-----------|---------------|
| Facilidade de implementacao | 4 | Dias, nao semanas |
| Curva de aprendizado | 5 | Mesma interface de planilha |
| Resolucao da classificacao | 4 | AI via API + regras locais |
| Escalabilidade | 3 | Limitado a limites do Sheets (10M celulas) |
| Acesso mobile | 4 | App Google Sheets nativo |
| Backup/sync | 5 | Google Drive nativo, historico de versoes |
| **Media** | **4.2** | |

**Veredito:** Melhor relacao custo-beneficio. Mantem a familiaridade da planilha, adiciona AI para classificacao, e resolve quase todos os pontos de dor sem exigir desenvolvimento de uma aplicacao completa.

---

## 5. Comparativo Final

| Criterio | Opcao A (Excel+) | Opcao B (Web App) | Opcao C (Sheets+AI) |
|----------|:-----------------:|:-----------------:|:-------------------:|
| Tempo de implementacao | ~4h | ~80h | ~16h |
| Custo mensal | R$ 0 | ~R$ 50/mes | ~R$ 15/mes |
| Classificacao automatica | Regras fixas | AI + ML | AI via API |
| Acesso mobile | Nao | Sim (PWA) | Sim (app nativo) |
| Backup automatico | Nao | Sim | Sim |
| Curva de aprendizado | Zero | Media | Baixa |
| Escalabilidade | Muito baixa | Alta | Media |
| **Nota final** | **2.5/5** | **4.2/5** | **4.2/5** |

### Criterio de Desempate: Opcao B vs Opcao C

Apesar de notas finais similares, os perfis sao distintos:

| Fator | Opcao B (Web App) | Opcao C (Sheets+AI) |
|-------|:-----------------:|:-------------------:|
| Tempo ate valor | Semanas | Dias |
| Risco de abandono | Alto (interface nova) | Baixo (interface familiar) |
| Custo de manutencao | Alto (infra propria) | Baixo (Google gerencia) |
| Potencial de evolucao | Ilimitado | Limitado (mas suficiente) |
| Complexidade operacional | Alta | Baixa |

---

## 6. Arquitetura Recomendada

### Recomendacao: Opcao C (Google Sheets + AI) com Caminho para Opcao B

**Estrategia:** Implementar a Opcao C como MVP imediato, com a possibilidade de migrar para a Opcao B no futuro se as necessidades crescerem alem do que Google Sheets suporta.

### 6.1 Diagrama de Componentes

```
+====================================================================+
||                    SISTEMA FINANCEIRO v2                          ||
||                    (Google Sheets + AI)                           ||
+====================================================================+

                    +---------------------------+
                    |      USUARIO              |
                    |  (Desktop / Mobile)       |
                    +-------------+-------------+
                                  |
                    +-------------v-------------+
                    |    Google Sheets App      |
                    |    "Controle Financeiro"  |
                    +-------------+-------------+
                                  |
              +-------------------+-------------------+
              |                   |                   |
    +---------v--------+ +-------v--------+ +--------v--------+
    | Aba: Transacoes  | | Aba: Dashboard | | Aba: Config     |
    |                  | |                | |                 |
    | - Dados brutos   | | - Graficos     | | - Categorias    |
    | - Classificacao  | | - KPIs         | | - Regras        |
    | - Status AI      | | - Tendencias   | | - Orcamentos    |
    +--------+---------+ +-------+--------+ | - API Key       |
             |                   |          +---------+-------+
             +-------------------+                    |
                       |                              |
          +------------v-----------+                  |
          |  Google Apps Script    |<-----------------+
          |  (Motor de Automacao)  |
          +------------+-----------+
                       |
         +-------------+-------------+
         |             |             |
   +-----v-----+ +----v----+ +-----v------+
   | Modulo    | | Modulo  | | Modulo     |
   | Import    | | Class.  | | Report     |
   |           | |         | |            |
   | - OFX     | | - Rules | | - Mensal   |
   | - CSV     | | - AI    | | - Email    |
   | - Manual  | | - Learn | | - Alertas  |
   +-----------+ +----+----+ +------------+
                      |
                +-----v------+
                | Claude API |
                | (Class.    |
                |  Intelig.) |
                +------------+
```

### 6.2 Fluxo de Dados Detalhado

#### Fluxo Principal: Importacao e Classificacao

```
[Extrato do Banco]
  |
  |  (1) Usuario faz download do CSV/OFX
  v
[Upload no Google Drive]
  |
  |  (2) Trigger detecta novo arquivo
  v
[Apps Script: Modulo Import]
  |
  |  (3) Parse do arquivo
  |  (4) Normalizacao (data, valor, descricao)
  |  (5) Deduplicacao (evita transacoes repetidas)
  v
[Aba Transacoes: Dados Brutos Inseridos]
  |
  |  (6) Para cada transacao sem categoria:
  v
[Apps Script: Modulo Classificacao]
  |
  |  (6a) Buscar em regras locais
  |       (Aba Config → tabela descricao→categoria)
  |
  |  Match encontrado?
  |  ├── SIM → Aplicar categoria (confianca: REGRA)
  |  └── NAO → (6b) Chamar Claude API
  |                   |
  |                   v
  |            [Claude API]
  |            Prompt com:
  |            - Descricao da transacao
  |            - Valor
  |            - Lista de categorias do usuario
  |            - Ultimas 5 transacoes similares
  |                   |
  |                   v
  |            Resposta:
  |            - Categoria sugerida
  |            - Confianca (0-100%)
  |            - Justificativa
  |                   |
  |  (7) Aplicar classificacao
  |      Confianca >= 85%  → Auto-aplicar (confianca: AI-AUTO)
  |      Confianca 50-84%  → Aplicar com flag amarela (confianca: AI-REVIEW)
  |      Confianca < 50%   → Nao aplicar, flag vermelha (confianca: MANUAL)
  |
  |  (8) Salvar nova regra se usuario confirmar
  v
[Aba Dashboard: Atualizada Automaticamente]
  |
  v
[Relatorio Mensal (email automatico)]
```

#### Fluxo de Aprendizado (Feedback Loop)

```
[Usuario corrige classificacao AI]
  |
  |  (1) onEdit trigger detecta mudanca
  |       na coluna "Categoria"
  v
[Apps Script: Modulo Learn]
  |
  |  (2) Registrar: descricao X → categoria Y
  |  (3) Se descricao ja tinha regra diferente:
  |      - Atualizar com a mais recente
  |      - Manter historico de mudancas
  v
[Aba Config: Tabela de Regras Atualizada]
  |
  |  (4) Proxima transacao similar sera
  |      classificada sem chamar AI
  v
[Reducao progressiva de chamadas API]
```

### 6.3 Stack Tecnologico Detalhado

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Interface** | Google Sheets | Familiar ao usuario, acesso mobile nativo |
| **Backend** | Google Apps Script (V8 runtime) | Integrado ao Sheets, sem infra adicional |
| **AI/ML** | Claude API (claude-sonnet) | Classificacao inteligente, custo baixo |
| **Storage** | Google Sheets + Google Drive | Versionamento automatico, backup nativo |
| **Dashboards** | Google Sheets Charts + Looker Studio (fase 2) | Graficos basicos no Sheets, avancados no Looker |
| **Notificacoes** | Gmail (via Apps Script) | Relatorio mensal, alertas de orcamento |
| **Importacao** | Apps Script custom parser | OFX e CSV dos principais bancos BR |

### 6.4 Modelo de Dados

#### Aba: Transacoes (tabela principal)

| Coluna | Tipo | Descricao | Origem |
|--------|------|-----------|--------|
| ID | Auto-increment | Identificador unico | Sistema |
| Data | Date | Data da transacao | Import/Manual |
| Ano | Number | Extraido da data | Auto-calc |
| Mes | Number | Extraido da data | Auto-calc |
| Mes_extenso | String | Nome do mes | Auto-calc |
| Tipo | Enum | Despesa / Receita / Aporte | AI / Manual |
| Categoria | String | Uma das 13+ categorias | AI / Manual |
| Categoria_receita | String | Subcategoria de receita | AI / Manual |
| Descricao | String | Descricao original do extrato | Import |
| Descricao_limpa | String | Descricao normalizada | Auto-proc |
| Valor | Currency | Valor em R$ | Import/Manual |
| Confianca | Enum | REGRA / AI-AUTO / AI-REVIEW / MANUAL | Sistema |
| Fonte | Enum | IMPORT-CSV / IMPORT-OFX / MANUAL | Sistema |
| Hash | String | SHA256 para deduplicacao | Sistema |

#### Aba: Regras (base de conhecimento)

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| Padrao | String | Texto ou regex para match |
| Tipo | Enum | Despesa / Receita / Aporte |
| Categoria | String | Categoria associada |
| Hits | Number | Quantas vezes foi usada |
| Ultima_atualizacao | Date | Quando foi criada/atualizada |
| Origem | Enum | USUARIO / AI-APRENDIDO |

#### Aba: Config

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| Categorias_despesa | List | Lista editavel de categorias |
| Categorias_receita | List | Lista editavel |
| Orcamento_por_categoria | Map | Limite mensal por categoria |
| API_key | String | Chave da API Claude (encriptada) |
| Confianca_minima_auto | Number | Threshold para auto-classificar (default: 85) |
| Email_relatorio | String | Email para relatorio mensal |

### 6.5 Pontos de Integracao

| Integracao | Metodo | Frequencia | Notas |
|-----------|--------|-----------|-------|
| Claude API | HTTPS REST via UrlFetchApp | Por transacao nao classificada | ~R$ 0,002/transacao |
| Google Drive | Nativo (Drive API) | Trigger por novo arquivo | Pasta monitorada para OFX/CSV |
| Gmail | Nativo (GmailApp) | Mensal (time trigger) | Relatorio automatico |
| Looker Studio | Conector nativo Sheets | Real-time | Fase 2 |

### 6.6 Estimativa de Custos

| Item | Custo Mensal | Notas |
|------|-------------|-------|
| Google Sheets | R$ 0 | Gratuito |
| Google Apps Script | R$ 0 | Gratuito (90 min/dia de execucao) |
| Claude API (~44 transacoes) | ~R$ 2-5 | Sonnet, ~200 tokens/request |
| Looker Studio | R$ 0 | Gratuito para uso pessoal |
| **TOTAL** | **~R$ 2-5/mes** | |

### 6.7 Consideracoes de Seguranca

| Risco | Mitigacao |
|-------|----------|
| API key exposta no Sheets | Armazenar em PropertiesService (criptografado) |
| Dados financeiros no Google | Google Workspace tem criptografia em repouso e transito |
| Acesso nao autorizado | 2FA na conta Google, planilha nao compartilhada |
| Privacidade na API de AI | Descricoes de transacoes sao dados pessoais — usar API com data retention desabilitado |
| Perda de dados | Versionamento nativo do Google Drive (30 dias) |

### 6.8 Plano de Implementacao (Fases)

#### Fase 1: Migracao e Setup (Dia 1-2)

- [ ] Criar Google Sheet com estrutura de abas
- [ ] Migrar dados do Excel (263 transacoes) via copy-paste ou importacao
- [ ] Configurar aba Config com categorias e regras iniciais
- [ ] Criar formulas basicas do dashboard

#### Fase 2: Motor de Regras Local (Dia 3-4)

- [ ] Implementar Apps Script: funcao de classificacao por regras
- [ ] Popular regras iniciais a partir do historico (263 transacoes = base de treino)
- [ ] Implementar onEdit trigger para aprendizado
- [ ] Testar com transacoes existentes

#### Fase 3: Integracao AI (Dia 5-6)

- [ ] Implementar chamada a Claude API via UrlFetchApp
- [ ] Criar prompt otimizado para classificacao financeira BR
- [ ] Implementar sistema de confianca (3 niveis)
- [ ] Testar com transacoes nao classificaveis por regras

#### Fase 4: Importacao de Extratos (Dia 7-8)

- [ ] Implementar parser CSV (formato Nubank, Itau, Bradesco)
- [ ] Implementar parser OFX (formato padrao brasileiro)
- [ ] Implementar deduplicacao por hash
- [ ] Criar trigger para pasta monitorada no Drive

#### Fase 5: Dashboard e Alertas (Dia 9-10)

- [ ] Criar dashboard avancado no Sheets (graficos interativos)
- [ ] Implementar relatorio mensal por email
- [ ] Implementar alertas de orcamento excedido
- [ ] Configurar time triggers

#### Fase 6 (Futura): Evolucao

- [ ] Conectar Looker Studio para dashboards avancados
- [ ] Adicionar previsao de gastos (tendencia linear)
- [ ] Implementar metas de economia
- [ ] Avaliar necessidade de migrar para Opcao B (web app)

---

## 7. Metricas de Sucesso

| Metrica | Atual (Excel) | Meta (Sheets+AI) | Melhoria |
|---------|:-------------:|:-----------------:|:--------:|
| Tempo de entrada mensal | ~52 min | ~5 min (import) | **-90%** |
| Tempo de classificacao | ~15 min | ~2 min (revisao) | **-87%** |
| Classificacao automatica | 0% | >80% | **+80pp** |
| Acesso mobile | Nao | Sim | Habilitado |
| Backup automatico | Nao | Sim | Habilitado |
| Insights por AI | Nao | Sim | Habilitado |
| Alertas de orcamento | Nao | Sim | Habilitado |

---

## 8. Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|:------------:|:-------:|-----------|
| Classificacao AI com baixa acuracia | Media | Alto | Feedback loop + regras manuais como fallback |
| Limites do Google Apps Script (6 min/execucao) | Baixa | Medio | Processar em batches de 50 transacoes |
| Mudanca na API Claude | Baixa | Alto | Abstrair chamada AI, facil trocar provider |
| Usuario nao adotar nova interface | Baixa | Alto | Interface identica ao Excel, curva zero |
| Custos API crescerem | Muito Baixa | Baixo | Regras locais reduzem chamadas progressivamente |

---

## 9. Conclusao

O sistema atual baseado em Excel funciona, mas impoe um custo significativo de tempo e esforco manual ao usuario — principalmente na classificacao de transacoes. A Opcao C (Google Sheets + AI) representa o melhor equilibrio entre resolucao dos problemas e facilidade de implementacao:

1. **Mantem a interface familiar** — zero curva de aprendizado
2. **Automatiza a classificacao** — AI resolve o principal ponto de dor
3. **Elimina entrada manual** — importacao direta de extratos bancarios
4. **Cloud nativo** — backup, sync, acesso mobile, tudo incluido
5. **Custo minimo** — menos de R$ 5/mes
6. **Implementavel em 10 dias** — valor imediato

O caminho de evolucao para uma web app completa (Opcao B) permanece aberto caso as necessidades do usuario superem as capacidades do Google Sheets no futuro.

---

> **Proximo passo:** Brownfield Discovery Phase 2 — @data-engineer para detalhar o schema de dados e estrategia de migracao do Excel para Google Sheets.

---

*Documento gerado por @architect (Aria) — Brownfield Discovery Phase 1*
*Synkra AIOX Framework*
