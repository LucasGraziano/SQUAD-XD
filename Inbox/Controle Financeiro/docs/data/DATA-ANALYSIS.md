# Análise de Dados — Controle Financeiro Pessoal

> **Fase:** Brownfield Discovery — Phase 2 (Data Analysis)
> **Agente:** @data-engineer (Dara)
> **Data:** 2026-03-26
> **Status:** Draft

---

## 1. Análise do Modelo de Dados Atual

### 1.1 Schema do Excel (AS-IS)

| Coluna | Tipo | Preenchimento | Qualidade |
|--------|------|---------------|-----------|
| Data | Date | Manual | ✅ Consistente |
| Ano | Number | Manual (redundante) | ⚠️ Derivável da Data |
| Mês | Number | Manual (redundante) | ⚠️ Derivável da Data |
| Mês_extenso | String | Manual (redundante) | ⚠️ Derivável da Data |
| Tipo | Enum(3) | Manual | ✅ Bem classificado |
| Categoria | String | Manual | ✅ 13 categorias consistentes |
| Categoria_receita | String | Manual | ⚠️ Só preenchido para Receitas |
| Descrição | String | Manual | ⚠️ Textos curtos (1-2 palavras) |
| Valor | Currency | Manual | ✅ Consistente |

**Problemas identificados:**
- 3 colunas redundantes (Ano, Mês, Mês_extenso) — deriváveis da Data
- Categoria_receita vazia para 228 de 263 registros (87% null)
- Sem ID único por transação
- Sem campo de origem/banco
- Sem timestamp de quando foi registrado

### 1.2 Distribuição dos Dados

#### Por Tipo de Transação
| Tipo | Qtd | % | Volume (R$) |
|------|-----|---|-------------|
| Despesa | 195 | 74% | ~R$ 45.000 |
| Receita | 35 | 13% | ~R$ 30.000 |
| Aporte | 33 | 13% | ~R$ 10.000 |
| **Total** | **263** | **100%** | **R$ 85.269** |

#### Top 5 Categorias por Frequência
| Categoria | Transações | % do Total | Gasto Médio |
|-----------|-----------|-----------|-------------|
| Lazer | 65 | 25% | R$ 125/txn |
| Alimentação | 50 | 19% | R$ 117/txn |
| Transporte | 39 | 15% | R$ 72/txn |
| Investimentos | 27 | 10% | variável |
| Profissional | 12 | 5% | variável |

#### Volume Mensal Médio
- ~44 transações/mês
- ~R$ 14.200/mês movimentado
- ~32 despesas + 6 receitas + 6 aportes/mês

---

## 2. Mineração de Padrões de Classificação

### 2.1 Mapeamento Descrição → Categoria

Baseado na análise das 263 transações, identifiquei padrões claros:

#### Regras de Alta Confiança (Match Exato/Contains)

| Padrão | Categoria | Tipo | Ocorrências | Confiança |
|--------|-----------|------|-------------|-----------|
| `Uber` / `99` / `Taxi` | Transporte | Despesa | ~39 | 99% |
| `Bar` / `Balada` / `Show` | Lazer | Despesa | ~40 | 95% |
| `Restaurante` / `Delivery` / `iFood` | Alimentação | Despesa | ~35 | 95% |
| `Mercado` / `Supermercado` | Alimentação | Despesa | ~15 | 95% |
| `Role` (como receita) | Receita informal | Receita | ~22 | 90% |
| `Previdência` / `Renda Fixa` | Investimentos | Aporte | ~15 | 99% |
| `Apartamento` | Investimentos | Aporte | ~10 | 95% |
| `Curso` / `Mentoria` | Profissional | Despesa | ~8 | 90% |
| `Seguro` / `Cartão anuidade` | Cartão | Despesa | ~10 | 90% |
| `Roupa` / `Tênis` / `Loja` | Vestuário | Despesa | ~5 | 85% |
| `Aluguel` / `Condomínio` | Moradia | Despesa | ~5 | 99% |
| `Netflix` / `Spotify` / `YouTube` | Assinatura | Despesa | ~5 | 99% |
| `Farmácia` / `Médico` | Saúde | Despesa | ~3 | 90% |

#### Estimativa de Auto-Classificação

| Nível | Regras | Cobertura Estimada |
|-------|--------|-------------------|
| Match exato (descrição conhecida) | ~50 regras | ~70% das transações |
| Match parcial (contains) | ~20 regras | ~15% das transações |
| AI necessária | — | ~10% das transações |
| Manual obrigatório | — | ~5% das transações |

**Resultado: ~85% das transações podem ser auto-classificadas** com regras derivadas do histórico existente. Com AI, sobe para ~95%.

### 2.2 Casos Ambíguos

| Descrição | Possíveis Categorias | Solução |
|-----------|---------------------|---------|
| PIX genérico | Qualquer | AI baseada em valor + contexto |
| Transferência | Aporte ou Despesa | AI + padrão de valor |
| Loja sem nome | Vestuário, Lazer, ou outros | Manual / AI com baixa confiança |
| Valores redondos de PIX | Aporte ou Pagamento | AI + histórico de valores similares |

---

## 3. Modelo de Dados Proposto (TO-BE)

### 3.1 Schema: Transações (tabela principal)

```
transactions
├── id                  INT AUTO_INCREMENT PRIMARY KEY
├── date                DATE NOT NULL
├── amount              DECIMAL(10,2) NOT NULL
├── type                ENUM('despesa','receita','aporte') NOT NULL
├── category_id         INT FOREIGN KEY → categories.id
├── subcategory         VARCHAR(100) NULL
├── description_raw     VARCHAR(255) NOT NULL    -- descrição original do extrato
├── description_clean   VARCHAR(255)             -- normalizada (lowercase, sem acentos)
├── bank_source         ENUM('nubank','itau','bradesco','manual','outro')
├── classification      ENUM('rule','ai-auto','ai-review','manual') NOT NULL
├── confidence_score    DECIMAL(3,2) NULL        -- 0.00 a 1.00
├── import_batch_id     INT FOREIGN KEY → bank_imports.id NULL
├── hash                VARCHAR(64) UNIQUE       -- SHA256 para dedup
├── created_at          TIMESTAMP DEFAULT NOW()
├── updated_at          TIMESTAMP
```

### 3.2 Schema: Categorias

```
categories
├── id                  INT AUTO_INCREMENT PRIMARY KEY
├── name                VARCHAR(50) NOT NULL UNIQUE
├── type                ENUM('despesa','receita','aporte') NOT NULL
├── color               VARCHAR(7)               -- hex color para UI
├── icon                VARCHAR(10)              -- emoji
├── budget_limit        DECIMAL(10,2) NULL       -- orçamento mensal
├── parent_id           INT NULL FOREIGN KEY → categories.id  -- subcategorias
├── sort_order          INT DEFAULT 0
├── active              BOOLEAN DEFAULT TRUE
```

**Categorias iniciais (seed data):**

| ID | Nome | Tipo | Ícone | Budget Sugerido |
|----|------|------|-------|----------------|
| 1 | Alimentação | despesa | 🍔 | R$ 1.200 |
| 2 | Transporte | despesa | 🚗 | R$ 600 |
| 3 | Lazer | despesa | 🎉 | R$ 1.500 |
| 4 | Moradia | despesa | 🏠 | R$ 2.000 |
| 5 | Assinatura | despesa | 📱 | R$ 200 |
| 6 | Saúde | despesa | 💊 | R$ 300 |
| 7 | Vestuário | despesa | 👕 | R$ 400 |
| 8 | Profissional | despesa | 💼 | R$ 500 |
| 9 | Cartão | despesa | 💳 | R$ 300 |
| 10 | Cuidados Pessoais | despesa | 💇 | R$ 200 |
| 11 | Desenvolvimento | despesa | 📚 | R$ 300 |
| 12 | Relacionamento | despesa | 💑 | R$ 500 |
| 13 | Investimentos | aporte | 📈 | R$ 2.000 |
| 14 | Salário | receita | 💰 | — |
| 15 | Freelance/Role | receita | 🎯 | — |

### 3.3 Schema: Orçamentos

```
budgets
├── id                  INT AUTO_INCREMENT PRIMARY KEY
├── category_id         INT FOREIGN KEY → categories.id
├── month               INT NOT NULL (1-12)
├── year                INT NOT NULL
├── planned_amount      DECIMAL(10,2) NOT NULL
├── actual_amount       DECIMAL(10,2) DEFAULT 0  -- calculado
├── alert_sent          BOOLEAN DEFAULT FALSE
```

### 3.4 Schema: Regras de Classificação

```
classification_rules
├── id                  INT AUTO_INCREMENT PRIMARY KEY
├── pattern             VARCHAR(255) NOT NULL     -- texto ou regex
├── match_type          ENUM('exact','contains','regex','starts_with')
├── type                ENUM('despesa','receita','aporte')
├── category_id         INT FOREIGN KEY → categories.id
├── priority            INT DEFAULT 0             -- maior = testa primeiro
├── hits                INT DEFAULT 0             -- quantas vezes foi usada
├── origin              ENUM('seed','user','ai-learned')
├── created_at          TIMESTAMP DEFAULT NOW()
├── updated_at          TIMESTAMP
```

### 3.5 Schema: Importações

```
bank_imports
├── id                  INT AUTO_INCREMENT PRIMARY KEY
├── filename            VARCHAR(255) NOT NULL
├── import_date         TIMESTAMP DEFAULT NOW()
├── source_bank         ENUM('nubank','itau','bradesco','inter','outro')
├── file_format         ENUM('csv','ofx','manual')
├── transaction_count   INT NOT NULL
├── auto_classified     INT DEFAULT 0
├── manual_required     INT DEFAULT 0
├── status              ENUM('pending','processing','completed','error')
```

---

## 4. Estratégia de Auto-Classificação

### 4.1 Pipeline de Classificação (3 camadas)

```
Transação Nova
    │
    ▼
┌─────────────────────────┐
│  CAMADA 1: Regras Locais │  ← Mais rápido, custo zero
│  (exact match, contains)  │
│  Cobertura: ~85%          │
└──────────┬────────────────┘
           │ Não encontrou?
           ▼
┌─────────────────────────┐
│  CAMADA 2: AI (Claude)    │  ← Inteligente, custo mínimo
│  Prompt com contexto       │
│  Cobertura: ~10%           │
│  Threshold: ≥85% → auto   │
│             50-84% → review│
│             <50% → manual  │
└──────────┬────────────────┘
           │ Baixa confiança?
           ▼
┌─────────────────────────┐
│  CAMADA 3: Manual          │  ← Humano decide
│  Flag amarela/vermelha     │
│  Cobertura: ~5%            │
└───────────────────────────┘
```

### 4.2 Prompt de Classificação AI

```
Você é um assistente de classificação financeira pessoal brasileira.

CATEGORIAS DISPONÍVEIS:
{lista das categorias do usuário com exemplos}

TRANSAÇÃO PARA CLASSIFICAR:
- Descrição: "{description_raw}"
- Valor: R$ {amount}
- Data: {date}

HISTÓRICO SIMILAR (últimas 5 transações parecidas):
{transações similares já classificadas}

Responda em JSON:
{
  "type": "despesa|receita|aporte",
  "category": "nome da categoria",
  "confidence": 0.00-1.00,
  "reasoning": "explicação curta"
}
```

### 4.3 Feedback Loop (Aprendizado)

```
1. AI classifica transação com confiança 72% (flag amarela)
2. Usuário vê a sugestão e confirma OU corrige
3. Se confirmou → regra criada (origin: ai-learned)
4. Se corrigiu → regra criada com a categoria correta
5. Próxima transação similar → Camada 1 resolve (sem AI)
6. Progressivamente, menos transações chegam à Camada 2
```

**Projeção de evolução:**

| Mês | Regras | Auto (Camada 1) | AI (Camada 2) | Manual (Camada 3) |
|-----|--------|-----------------|----------------|-------------------|
| Mês 1 | ~50 (seed) | 70% | 20% | 10% |
| Mês 3 | ~80 | 82% | 13% | 5% |
| Mês 6 | ~100 | 90% | 7% | 3% |
| Mês 12 | ~120 | 95% | 3% | 2% |

---

## 5. Oportunidades de Analytics

### 5.1 Dashboards Essenciais

**Dashboard 1: Visão Mensal**
- Receita total vs Despesa total vs Aportes
- Saldo do mês (Receita - Despesa)
- Taxa de poupança (% da receita que vira aporte)
- Comparativo com mês anterior

**Dashboard 2: Categorias**
- Donut chart de gastos por categoria
- Trend lines (últimos 6 meses por categoria)
- Budget vs Actual (barras de progresso)
- Top 5 maiores gastos do mês

**Dashboard 3: Tendências**
- Gasto médio diário (rolling 30d)
- Evolução patrimonial (acumulado de aportes)
- Sazonalidade (qual mês gasta mais?)
- Projeção linear do próximo mês

### 5.2 Alertas Inteligentes

| Alerta | Trigger | Canal |
|--------|---------|-------|
| Orçamento excedido | categoria > 90% do budget | Email/notif |
| Gasto atípico | transação > 2x média da categoria | Email |
| Resumo semanal | Todo domingo | Email |
| Relatório mensal | Dia 1 de cada mês | Email |
| Meta de poupança | Taxa de poupança < meta | Email |

### 5.3 Insights da Base Atual (263 transações)

| Insight | Dado |
|---------|------|
| Gasto mensal médio | ~R$ 7.500 |
| Categoria dominante | Lazer (25% das transações, R$ 8.148 total) |
| Transporte médio | R$ 72/corrida (maioria Uber) |
| Frequência de comer fora | ~8x/mês |
| Taxa de aporte | ~13% das transações |
| Receita "Role" | 22 ocorrências — renda complementar significativa |

---

## 6. Estratégia de Migração

### 6.1 Migrar Excel → Google Sheets

```
1. Exportar Excel como CSV (aba Base)
2. Importar no Google Sheets
3. Adicionar colunas novas (ID, hash, confidence, classification)
4. Popular hash para todas 263 transações (dedup)
5. Popular campo 'classification' como 'manual' para todas existentes
6. Extrair regras do histórico (desc → categoria mapping)
7. Popular aba Regras com ~50 regras iniciais
8. Validar: 263 transações migradas sem perda
```

### 6.2 Parsers de Banco (Prioridade)

| Banco | Formato | Prioridade | Complexidade |
|-------|---------|-----------|--------------|
| Nubank | CSV | P0 | Baixa (formato limpo) |
| Itaú | OFX/CSV | P1 | Média (formatos variados) |
| Bradesco | CSV | P2 | Média |
| Inter | CSV | P2 | Baixa |

---

> **Próximo passo:** Brownfield Discovery Phase 3 — @ux-design-expert para definir a experiência ideal de uso.

---

*Documento gerado por @data-engineer (Dara) — Brownfield Discovery Phase 2*
*Synkra AIOX Framework*
