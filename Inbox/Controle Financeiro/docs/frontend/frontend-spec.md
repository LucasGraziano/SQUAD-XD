# Especificação de UX/Interface — Controle Financeiro Pessoal

> **Fase:** Brownfield Discovery — Phase 3 (Frontend/UX)
> **Agente:** @ux-design-expert (Uma)
> **Data:** 2026-03-26
> **Status:** Draft

---

## 1. Assessment de UX Atual

### 1.1 Excel como Plataforma de UX

| Aspecto | Avaliação | Nota |
|---------|-----------|------|
| Familiaridade | O usuário já domina Excel | ⭐⭐⭐⭐⭐ |
| Velocidade de entrada | Lenta (célula por célula) | ⭐⭐ |
| Feedback visual | Limitado a formatação condicional | ⭐⭐ |
| Carga cognitiva | Alta (13 categorias para lembrar) | ⭐⭐ |
| Mobile | Péssimo (Excel mobile é ruim) | ⭐ |
| Automação | Zero | ⭐ |

### 1.2 Jornada do Usuário Atual (AS-IS)

```
┌──────────────────────────────────────────────────────────────┐
│ JORNADA ATUAL: ~77 min/mês para 44 transações                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Abrir app do banco                    ⏱️ 2 min          │
│     └─ Verificar extrato do período                          │
│                                                              │
│  2. Abrir Excel no desktop                ⏱️ 1 min          │
│     └─ Navegar até última linha preenchida                   │
│                                                              │
│  3. PARA CADA transação (×44):            ⏱️ ~1.5 min/txn   │
│     ├─ a. Olhar transação no banco                           │
│     ├─ b. Digitar data no Excel                              │
│     ├─ c. Digitar descrição                                  │
│     ├─ d. DECIDIR categoria (cognitivo)    ← PAIN POINT     │
│     │     └─ "Isso é Lazer ou Alimentação?"                  │
│     ├─ e. Digitar/selecionar categoria                       │
│     ├─ f. Classificar tipo (Despesa/Receita/Aporte)          │
│     └─ g. Digitar valor                                      │
│                                                              │
│  4. Revisar erros                         ⏱️ 10 min         │
│     └─ Scroll manual verificando inconsistências             │
│                                                              │
│  5. Verificar dashboard                   ⏱️ 15 min         │
│     └─ Analisar gráficos, conferir totais                    │
│                                                              │
│  TOTAL: ~77 min/mês                                          │
│  FRUSTRAÇÃO: Alta (tarefa repetitiva + decisões forçadas)    │
└──────────────────────────────────────────────────────────────┘
```

### 1.3 Análise de Carga Cognitiva

| Decisão | Frequência | Dificuldade | Automatizável? |
|---------|-----------|------------|----------------|
| Qual categoria? | Toda transação | Média-Alta | ✅ 95% com AI |
| Qual tipo? | Toda transação | Baixa | ✅ 99% com regras |
| É a mesma transação? | Toda transação | Baixa | ✅ Hash dedup |
| O valor está certo? | Toda transação | Nenhuma | ✅ Import direto |
| Esqueci alguma? | Fim do mês | Alta | ✅ Import cobre tudo |

**Resultado:** A maioria das decisões pode ser eliminada com automação.

---

## 2. Jornada Ideal (TO-BE)

### 2.1 Fluxo Otimizado: Import → Review → Done

```
┌──────────────────────────────────────────────────────────────┐
│ JORNADA IDEAL: ~5 min/mês para 44 transações                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Download extrato CSV do banco         ⏱️ 1 min          │
│     └─ Um clique no app do banco                             │
│                                                              │
│  2. Upload no Google Sheets               ⏱️ 30 seg         │
│     └─ Arrastar para pasta do Drive                          │
│     └─ OU: botão "Importar" na planilha                      │
│                                                              │
│  3. REVISÃO em batch                      ⏱️ 2-3 min        │
│     ├─ 🟢 Auto-classificadas (85%): só conferir             │
│     ├─ 🟡 Sugestão AI (10%): confirmar ou corrigir          │
│     └─ 🔴 Manual (5%): classificar ~2-3 transações          │
│                                                              │
│  4. Dashboard atualizado automaticamente  ⏱️ 1 min          │
│     └─ Verificar insights e alertas                          │
│                                                              │
│  TOTAL: ~5 min/mês                                           │
│  FRUSTRAÇÃO: Mínima (decisões reduzidas de 44 para ~3)       │
└──────────────────────────────────────────────────────────────┘
```

**Melhoria: 77 min → 5 min = 93% de redução no tempo.**

### 2.2 Sistema de Cores para Confiança

```
🟢 VERDE — Classificado por regra (confiança 100%)
   → Auto-aplicado, sem interação necessária
   → Highlight verde claro na linha

🟡 AMARELO — Classificado por AI (confiança 50-84%)
   → Categoria sugerida aparece com background amarelo
   → Dropdown para confirmar ou trocar
   → Um clique para aceitar

🔴 VERMELHO — Não classificado (confiança < 50%)
   → Célula de categoria em vermelho
   → Dropdown aberto esperando input
   → Filtro rápido para ver só os vermelhos
```

---

## 3. Design da Interface (Google Sheets)

### 3.1 Aba: Transações (principal)

```
┌─────────┬──────────┬────────────┬─────────┬───────────────┬────────┬──────┐
│ Status  │ Data     │ Descrição  │ Tipo    │ Categoria     │ Valor  │ Conf │
├─────────┼──────────┼────────────┼─────────┼───────────────┼────────┼──────┤
│ 🟢      │ 26/03/26 │ Uber       │ Despesa │ Transporte    │ 32,50  │ RULE │
│ 🟢      │ 26/03/26 │ Restaurante│ Despesa │ Alimentação   │ 85,00  │ RULE │
│ 🟡      │ 25/03/26 │ PIX João   │ Despesa │ Lazer ▾       │ 150,00 │ AI   │
│ 🔴      │ 25/03/26 │ TED 4532   │ ???     │ [Selecione] ▾ │ 500,00 │ —    │
│ 🟢      │ 24/03/26 │ Salário    │ Receita │ Salário       │5.262,43│ RULE │
└─────────┴──────────┴────────────┴─────────┴───────────────┴────────┴──────┘

[📥 Importar Extrato]  [🔍 Filtrar: Todos ▾]  [📊 Ver Dashboard]
```

**Interações:**
- Dropdown com data validation para Tipo e Categoria
- Formatação condicional por Status (verde/amarelo/vermelho)
- Filtro rápido: "Mostrar só pendentes (🟡🔴)"
- Botão customizado "Importar Extrato" via sidebar/menu

### 3.2 Aba: Dashboard

```
┌──────────────────────────────────────────────────────┐
│                    MARÇO 2026                          │
│                                                      │
│  💰 Receita      📉 Despesas      📈 Aportes         │
│  R$ 8.500        R$ 6.200         R$ 1.800           │
│  ▲ 5% vs fev     ▼ 3% vs fev     ▲ 12% vs fev      │
│                                                      │
│  💵 Saldo: R$ 2.300  |  🏦 Taxa Poupança: 21%       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  GASTOS POR CATEGORIA          BUDGET vs REAL        │
│  ┌─────────────────┐          ┌────────────────────┐ │
│  │    [Donut Chart] │          │ Lazer    ████████░ │ │
│  │   Lazer 32%     │          │ 89% (R$1.340/1.500)│ │
│  │   Alim. 25%     │          │                    │ │
│  │   Transp 15%    │          │ Aliment. █████░░░░ │ │
│  │   Outros 28%    │          │ 62% (R$740/1.200)  │ │
│  └─────────────────┘          │                    │ │
│                               │ Transp.  ████░░░░░ │ │
│                               │ 48% (R$290/600)    │ │
│                               └────────────────────┘ │
├──────────────────────────────────────────────────────┤
│  TENDÊNCIA 6 MESES                                   │
│  R$                                                  │
│  8k ┤         ╱╲                                     │
│  7k ┤    ╱╲  ╱  ╲  ╱                                │
│  6k ┤╲  ╱  ╲╱    ╲╱                                 │
│  5k ┤ ╲╱                                             │
│     ├──┬──┬──┬──┬──┬──                               │
│       Set Out Nov Dez Jan Fev                        │
└──────────────────────────────────────────────────────┘
```

### 3.3 Aba: Config

```
┌──────────────────────────────────────────────────────┐
│                    CONFIGURAÇÕES                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  CATEGORIAS                      ORÇAMENTOS MENSAIS  │
│  ┌──────────────────┐           ┌──────────────────┐ │
│  │ ✅ Alimentação    │           │ Alimentação: 1200│ │
│  │ ✅ Transporte     │           │ Transporte:  600 │ │
│  │ ✅ Lazer          │           │ Lazer:      1500 │ │
│  │ ✅ Moradia        │           │ Moradia:    2000 │ │
│  │ ...               │           │ ...              │ │
│  │ [+ Nova Categoria]│           │                  │ │
│  └──────────────────┘           └──────────────────┘ │
│                                                      │
│  CLASSIFICAÇÃO AI               ALERTAS              │
│  ┌──────────────────┐           ┌──────────────────┐ │
│  │ Confiança mín: 85│           │ ☑ Budget > 90%   │ │
│  │ API: Claude      │           │ ☑ Gasto atípico  │ │
│  │ Modelo: Sonnet   │           │ ☑ Resumo semanal │ │
│  │ [Testar API]     │           │ ☑ Relatório mês  │ │
│  └──────────────────┘           └──────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### 3.4 Sidebar: Importação (Apps Script HTML)

```
┌──────────────────────────┐
│  📥 Importar Extrato     │
│                          │
│  Banco: [Nubank    ▾]   │
│                          │
│  Arquivo:                │
│  [Arraste o CSV aqui]    │
│  ou [Selecionar arquivo] │
│                          │
│  ──────────────────────  │
│  Preview:                │
│  42 transações           │
│  Período: 01/03 - 31/03 │
│  3 já existentes (dedup) │
│  39 novas                │
│                          │
│  [🚀 Importar 39 txns]  │
│                          │
│  ──────────────────────  │
│  Resultado:              │
│  🟢 33 auto-classificadas│
│  🟡 4 para revisar       │
│  🔴 2 manual             │
│                          │
│  [Ver pendentes →]       │
└──────────────────────────┘
```

---

## 4. Princípios de UX para Este Projeto

### 4.1 Princípio 1: Velocidade > Features

O objetivo #1 é **reduzir tempo gasto**. Cada feature deve ser avaliada por:
> "Isso economiza tempo do usuário ou adiciona trabalho?"

### 4.2 Princípio 2: Familiaridade

O usuário conhece Excel. O Google Sheets é 95% idêntico.
> Não inventar interfaces novas — usar a planilha como ela é.

### 4.3 Princípio 3: Progressive Disclosure

- **Nível 1 (default):** Aba Transações — dados e classificação
- **Nível 2 (quando quiser):** Aba Dashboard — gráficos e insights
- **Nível 3 (raro):** Aba Config — ajustes finos

### 4.4 Princípio 4: AI-First, Human-Second

A classificação deve funcionar assim:
1. Sistema decide automaticamente na maioria dos casos
2. Usuário só intervém quando necessário (~5% das vezes)
3. Cada intervenção ensina o sistema

### 4.5 Princípio 5: Batch > Individual

Processar 44 transações de uma vez é melhor que processar 1 por 1.
> O import processa tudo, o usuário revisa em batch.

---

## 5. Recomendação de Abordagem

### Google Sheets é a escolha certa para este usuário

| Fator | Por quê |
|-------|---------|
| **Perfil** | Dev/empreendedor que já usa Excel há 6+ meses |
| **Volume** | ~44 txns/mês — bem dentro do limite do Sheets |
| **Complexidade** | 13 categorias, 3 tipos — modelável em planilha |
| **Mobile** | App Google Sheets nativo (iOS/Android) |
| **Compartilhamento** | Pode compartilhar com contador/parceiro |
| **Custo** | R$ 0 (Sheets) + ~R$ 5/mês (AI API) |
| **Migração** | Excel → Sheets é copy-paste |
| **Evolução** | Looker Studio conecta direto se precisar de mais |

### Quando migrar para Web App?

Só se:
- Volume ultrapassar 200 txns/mês
- Precisar de múltiplas contas bancárias com integração direta (Open Finance)
- Quiser compartilhar como produto (SaaS)

---

## 6. Métricas de UX a Rastrear

| Métrica | Atual | Meta | Como Medir |
|---------|-------|------|------------|
| Tempo por sessão de input | ~77 min | <5 min | Tempo entre abrir e fechar |
| Decisões manuais/mês | 44 | <3 | Count de 🔴 classificações |
| Taxa de auto-classificação | 0% | >90% | 🟢/(🟢+🟡+🔴) |
| Correções de AI | — | <10% | Edits após AI classificar |
| Frequência de uso | ~1x/mês (batch) | ~1x/mês (batch) | Manter |
| Satisfação | Baixa (tarefa chata) | Alta (tarefa rápida) | Qualitativo |

---

> **Próximo passo:** Brownfield Discovery Phase 4 — @architect para consolidar findings das 3 fases.

---

*Documento gerado por @ux-design-expert (Uma) — Brownfield Discovery Phase 3*
*Synkra AIOX Framework*
