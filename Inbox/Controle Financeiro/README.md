# 💰 Controle Financeiro — Google Sheets + Auto-Classificação

Sistema pessoal de controle financeiro com importação de extratos Bradesco (CSV/OFX), classificação automática por regras e dashboard visual.

## Setup Rápido (5 minutos)

### 1. Criar a planilha

1. Acesse [Google Sheets](https://sheets.google.com) e crie uma nova planilha
2. Renomeie para **"Controle Financeiro"**

### 2. Copiar o código

1. Vá em **Extensões > Apps Script**
2. Apague o conteúdo padrão
3. Crie os seguintes arquivos (clique em **+** > **Script**):

| Arquivo no Apps Script | Arquivo fonte |
|------------------------|---------------|
| `Setup` | `src/Setup.gs` |
| `Classificacao` | `src/Classificacao.gs` |
| `ImportBradesco` | `src/ImportBradesco.gs` |
| `Dashboard` | `src/Dashboard.gs` |

4. Crie um arquivo HTML (clique em **+** > **HTML**):

| Arquivo no Apps Script | Arquivo fonte |
|------------------------|---------------|
| `ImportSidebar` | `src/ImportSidebar.html` |

5. **Salve** (Ctrl+S)

### 3. Executar o setup

1. No Apps Script, selecione a função `setupCompleto` no dropdown
2. Clique em **▶ Executar**
3. Autorize as permissões quando solicitado
4. Aguarde a mensagem de confirmação

### 4. Configurar o trigger de aprendizado

1. No Apps Script, vá em **Acionadores** (ícone de relógio no menu lateral)
2. Clique em **+ Adicionar acionador**
3. Configure:
   - Função: `onEditFeedback`
   - Evento: `Ao editar`
   - Planilha: (a planilha atual)
4. Salve

## Como Usar

### Importar Extrato

1. Na planilha, vá em **💰 Financeiro > 📥 Importar Extrato Bradesco**
2. Arraste ou selecione o arquivo CSV ou OFX do Bradesco
3. Confira o preview (total, novas, duplicatas)
4. Clique em **🚀 Importar**

### Classificação Automática

As transações são classificadas em 3 camadas:

| Camada | Método | Status |
|--------|--------|--------|
| 1 | Regras (80+ padrões) | 🟢 Auto |
| 2 | Inferência simples | 🟡 Revisar |
| 3 | Manual | 🔴 Manual |

### Ensinar o sistema

Quando você corrige uma transação 🟡 ou 🔴:
1. Edite a **Categoria** na coluna G
2. O sistema aprende automaticamente e cria uma nova regra
3. Na próxima vez, transações similares serão classificadas como 🟢

### Dashboard

- Vá em **💰 Financeiro > 📊 Atualizar Dashboard**
- Use o dropdown de mês para navegar entre períodos
- KPIs, budget tracking e gráficos são gerados automaticamente

## Estrutura das Abas

| Aba | Função |
|-----|--------|
| **Transações** | Todas as transações importadas |
| **Regras** | Regras de classificação (auto-aprendizado) |
| **Config** | Categorias e orçamentos |
| **Dashboard** | KPIs, gráficos e budget tracking |

## Formatos Suportados

- **CSV Bradesco** — Separador `;`, encoding ISO-8859-1
- **OFX Bradesco** — Formato bancário padrão

## Custo

**R$ 0/mês** — 100% Google Sheets + Apps Script, sem APIs externas.
