# Lucky SaaS — Frontend Specification

**Versão:** 1.0  
**Data:** 2026-05-07  
**Agent:** @ux-design-expert (Uma)  
**Referência de design:** `squads/lucky-saas/app/DESIGN.md`  
**Referência de requisitos:** `squads/lucky-saas/docs/prd.md`

---

## 1. Visão Geral da Interface

### Princípio Central
Interface operacional de uso diário. O corretor abre o sistema cedo e fecha tarde. Tudo que importa precisa estar a 1-2 cliques. Nada escondido em menus de 3 níveis.

### Shell da Aplicação

```
Sidebar (240px, dark #0D0D0D) + Content Area (flex, light #F8F8F8)
```

O layout é fixo em desktop. No mobile (<768px), o sidebar colapsa em drawer com overlay.

### Roteamento (Next.js App Router)

```
/                           → redirect para /dashboard
/login                      → auth page (full screen, sem sidebar)
/onboarding                 → flow de setup inicial (sem sidebar)
/dashboard                  → página principal
/pipeline                   → kanban de leads
/apolices                   → lista de apólices
/apolices/[id]              → detalhe da apólice
/clientes                   → lista de clientes
/clientes/[id]              → perfil do cliente
/crosssell                  → oportunidades de cross-sell
/alertas                    → central de alertas
/financeiro                 → forecast e financeiro
/financeiro/relatorios      → relatórios
/documentos                 → templates e processos de abertura
/configuracoes              → configurações da conta
/configuracoes/integrações  → webhook, ManyChat, ZapSign
/configuracoes/billing      → plano e pagamento (Stripe portal)
```

---

## 2. Autenticação

### Tela de Login (`/login`)

Layout: centralized card, sem sidebar. Background: `#0D0D0D` com trevo de 4 folhas em watermark sutil (opacity 0.03).

```
┌─────────────────────────────────────┐
│  [Trevo icon]  LUCKY SAAS           │
│                                     │
│  Entrar na sua conta                │
│                                     │
│  [Email input]                      │
│  [Senha input]                      │
│                                     │
│  [Entrar] ← botão primary green     │
│                                     │
│  [Continuar com Google]             │
│                                     │
│  Esqueci minha senha                │
│  ─────────────────────────────      │
│  Não tem conta? Começar trial 14d   │
└─────────────────────────────────────┘
```

**Card:** bg `#FFFFFF`, border-radius 12px, border 1px `#E5E5E5`, padding 40px, max-width 400px.  
**Logo:** "LUCKY SAAS" em Atyp Display 20px, bold, cor `#0D0D0D`. Trevo svg 24px, cor `#0BD904`.  
**Botão Google:** bg `#FFFFFF`, border 1.5px `#D1D1D1`, icon Google 16px à esquerda, text "Continuar com Google".  
**States:** loading spinner no botão ao submeter; erro inline abaixo dos inputs (não toast).

### Redefinição de Senha
Standard — email enviado pela Supabase Auth. Página simples de confirmação.

---

## 3. Onboarding Flow (`/onboarding`)

**Só aparece no primeiro login.** Progresso: 4 passos. Top: progress bar linear (sem passos numerados visíveis no mobile).

### Step 1 — Dados da Corretora
```
Qual é o nome da sua corretora?          [Input: texto]
Seu SUSEP (opcional):                    [Input: número]
Quantos clientes você tem hoje?          [Select: < 50 | 50-200 | 200-500 | 500+]
```

### Step 2 — Configurar Ramos
```
Quais ramos você trabalha? (marque todos)
☐ Auto   ☐ Vida   ☐ Saúde   ☐ Residencial   ☐ Empresarial   ☐ Consórcio   ☐ Viagem
```
(multiselect com chips visuais, não checkboxes simples)

### Step 3 — Importar Base (opcional)
```
Você tem uma planilha de clientes/apólices?

[Importar CSV agora]    [Pular por agora]

↓ Se importar:
  Template para download → Preview → Confirmar importação
```

### Step 4 — Tour Rápido (opcional)
3 slides de orientação: Dashboard → Alertas → Pipeline. Botão "Começar" ao final.

---

## 4. Dashboard (`/dashboard`)

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ PAGE HEADER: "Bom dia, Carlos" + data + [Nova Apólice] btn │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ALERTAS CRÍTICOS HOJE  ← row de cards de urgência         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Renovações   │ │ Leads Parados│ │ Aniversários │        │
│  │ Críticas     │ │              │ │ Hoje         │        │
│  │ 🔴 3 hoje   │ │ ⚠ 2 leads   │ │ 🎂 1 cliente │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│  ┌──────────────────────┐  ┌────────────────────────────┐  │
│  │  FORECAST DO MÊS     │  │  PIPELINE — RESUMO         │  │
│  │  R$ 12.450 esperados │  │  8 leads ativos            │  │
│  │  R$ 7.200 recebidos  │  │  3 propostas enviadas      │  │
│  │  R$ 820 em atraso    │  │  1 fechamento próximo      │  │
│  └──────────────────────┘  └────────────────────────────┘  │
│                                                             │
│  RENOVAÇÕES PRÓXIMAS 30 DIAS  ← tabela compacta           │
│  Cliente | Ramo | Seguradora | Vence em | Ação            │
│  ─────────────────────────────────────────────────────     │
│  Ana Santos  | Auto  | Porto Seguro | 8 dias | [Contatar] │
│  João Lima   | Vida  | Caixa Seg.   | 12 dias| [Contatar] │
│  ...                                               [+ ver] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cards de Alertas Críticos
- `bg: #FFFFFF`, `border: 1px solid #E5E5E5`, `border-radius: 8px`
- Ícone (Lucide) + label + contagem grande + link "Ver todos"
- Estado vazio (0 alertas): card mantém tamanho com texto "Nenhum alerta — tudo ok" + ícone `#D1D1D1`
- Ícones: Bell (renovações), AlertTriangle (leads parados), Gift (aniversários) — sem emoji

### Forecast Card
- Duas colunas: valor total previsto (display) e breakdown (body-sm)
- Progress bar de 4px para cada linha (recebido, a receber, em atraso)
- Cores: sucesso para recebido, âmbar para a receber, vermelho para em atraso
- Link "Ver relatório completo" no rodapé do card

### Tabela de Renovações Próximas
- Max 5 linhas no dashboard, com link "Ver todas" que vai para `/apolices?filter=vencendo-30d`
- Botão [Contatar] abre modal com template WhatsApp
- Coluna "Vence em" usa badge colorido: < 7 dias = vermelho, 7-15 = âmbar, 15-30 = amarelo claro

---

## 5. Pipeline (`/pipeline`)

### Layout
Page header com título "Pipeline de Leads" + botão "Novo Lead" (primary).

```
[Novo] [Buscar leads...] [Filtro: Ramo ▾] [Filtro: Fonte ▾]

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ NOVO (3)     │ │ COTAÇÃO (5)  │ │ NEGOCIAÇÃO(2)│ │ FECHADO (12) │ │ PERDIDO (4)  │
│──────────────│ │──────────────│ │──────────────│ │──────────────│ │──────────────│
│ [Card Lead]  │ │ [Card Lead]  │ │ [Card Lead]  │ │ [Card Lead]  │ │ [Card Lead]  │
│ [Card Lead]  │ │ [Card Lead]  │ │ [Card Lead]  │ │              │ │              │
│ [Card Lead]  │ │              │ │              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

Scroll horizontal quando colunas não cabem na tela.

### Card do Lead
```
┌─────────────────────────────────────┐
│ [badge: PARADO ⚠]  (só se > 48h)   │
│ Ana Santos                          │
│ [Auto] [Instagram]                  │
│ Fone: (11) 99999-9999               │
│                                     │
│ 3 dias no estágio                   │
│ [WhatsApp ↗]  [Ver detalhes →]      │
└─────────────────────────────────────┘
```

- Card: bg `#FFFFFF`, border 1px `#E5E5E5`, border-radius 8px, padding 16px
- Badge PARADO: bg `#FEE2E2`, text `#DC2626`, font 11px bold
- Badge do ramo: `lucky-green-subtle` + `lucky-green-dark`
- Badge da fonte (Instagram, Indicação, Site): bg `#F3F4F6`, text `#6B7280`
- Drag handle: icon GripVertical `#D1D1D1`, aparece no hover do card

### Drawer de Detalhe do Lead
Slide-in pela direita (400px no desktop, full-width no mobile).

```
[X] Ana Santos                    [Mover para ▾]
────────────────────────────────────────────
Contato: (11) 99999-9999 [WhatsApp ↗] [Ligar]
Email: ana@email.com
Ramo de interesse: Auto
Fonte: Instagram
Entrou em: 04/05/2026

────────────────────────────────────────────
ANOTAÇÃO RÁPIDA
[textarea placeholder: "Registrar contato, detalhe ou próximo passo..."]
[Salvar Anotação]

────────────────────────────────────────────
HISTÓRICO
● Movido para "Cotação" — 06/05 14:23
● Anotação: "Interessado, quer cotação de 2 carros" — 05/05 10:11
● Lead criado via ManyChat — 04/05 09:45
```

### Modal Novo Lead
Form simples, drawer ou modal:
- Nome* (obrigatório)
- Telefone* (obrigatório, formato automático)
- Email (opcional)
- Ramo de interesse (select: Auto | Vida | Saúde | Residencial | Empresarial | Viagem | Consórcio)
- Fonte (select: Instagram | Indicação | Site | WhatsApp | Outro)
- Observação inicial (textarea, opcional)

---

## 6. Apólices (`/apolices`)

### Lista

```
PAGE HEADER: Apólices [Nova Apólice] [Importar CSV]

FILTROS:
[Buscar cliente ou número...] [Ramo ▾] [Seguradora ▾] [Status ▾] [Período ▾]

TABS: Todas | Ativas | Vencendo em 30d | Vencidas | Arquivadas

TABELA:
Cliente         | Ramo        | Seguradora   | Vigência       | Prêmio     | Comissão | Status    | Ações
─────────────────────────────────────────────────────────────────────────────────────────────────────────
Ana Santos      | Auto        | Porto Seguro | 01/12 → 01/12/27| R$ 1.800  | R$ 360   | [ATIVA]   | [···]
João Lima       | Vida        | Caixa Seg.   | 15/01 → 15/01/27| R$ 3.600  | R$ 720   | [7 dias]  | [···]
Maria Costa     | Saúde       | Amil         | 01/03 → 01/03/27| R$ 8.400  | R$ 840   | [ATIVA]   | [···]
```

- Coluna Status: badge conforme DESIGN.md (ativa/vence-30d/vence-60d/vencida/cancelada)
- Coluna Ações: menu de 3 pontos [Editar | Renovar | Arquivar | Ver histórico]
- Linha com vencimento < 30 dias: fundo `#FFFBEB` (muito sutil)
- Linha vencida: fundo `#FFF5F5`
- Valores: JetBrains Mono, alinhados à direita
- Paginação: 25 por página, links Anterior/Próxima + contador "Mostrando 1-25 de 347"

### Detalhe da Apólice (`/apolices/[id]`)

```
← Voltar para Apólices

[ATIVA] Apólice Auto — Ana Santos                    [Editar] [···]
Nº Porto Seguro: 0001234-5                Vigência: 01/12/2026 → 01/12/2027

────────────────────────────────────────── 
INFORMAÇÕES DA APÓLICE
Seguradora:  Porto Seguro          Ramo: Auto
Veículo:     Honda Civic 2022      Placa: ABC-1234
Prêmio:      R$ 1.800,00           Pagamento: Anual

COMISSÃO
Percentual:  20%                   Valor esperado: R$ 360,00
Status:      Pendente              Data esperada:  01/01/2027

──────────────────────────────────────────
ALERTAS DE RENOVAÇÃO
✓ Alerta 90 dias → enviado em 03/09/2026
● Alerta 60 dias → agenda: 03/10/2026
● Alerta 30 dias → agenda: 03/11/2026

──────────────────────────────────────────
HISTÓRICO
● Alerta 90 dias marcado como "Contatado" — 04/09/2026
● Apólice cadastrada — 01/12/2025
```

Drawer lateral no desktop (não navega para nova página). Em mobile, página dedicada.

### Modal Nova Apólice / Editar Apólice
Form em seções colapsáveis:

**Seção 1 — Apólice**
- Cliente* (autocomplete de clientes cadastrados + opção "Criar novo cliente")
- Ramo*
- Seguradora*
- Número da apólice (opcional)

**Seção 2 — Vigência e Prêmio**
- Data início vigência*
- Data fim vigência*
- Prêmio total (R$)*
- Forma de pagamento: Anual | Semestral | Mensal
- % de comissão*
- Comissão calculada (auto: readonly)

**Seção 3 — Informações Específicas do Ramo** (condicional)
- Auto: placa, modelo, ano, chassi (opcional)
- Vida: CPF do segurado, capital segurado
- Residencial: endereço, área construída
- Empresarial: CNPJ, ramo de atividade

---

## 7. Clientes (`/clientes` e `/clientes/[id]`)

### Lista de Clientes
Tabela simples. Colunas: Nome | CPF/CNPJ | Telefone | Apólices Ativas | Último Contato | Ações.

### Perfil do Cliente (`/clientes/[id]`)

```
← Voltar

Ana Santos                              [Editar] [Nova Apólice]
(11) 99999-9999 · ana@email.com · CPF: ***.***.789-00
Cliente desde: Jan 2024

────────────────────────────────────────────────────────
RESUMO FINANCEIRO
Total de prêmios: R$ 1.800/ano     Comissão total: R$ 360/ano
Última renovação: Dez 2025

APÓLICES ATIVAS (2)
[Auto - Porto Seguro - Vence dez/2027] → [Ver detalhes]
[Vida - Caixa Seg. - Vence mar/2026]  → [Ver detalhes]

OPORTUNIDADES DE CROSS-SELL
⚡ Sem seguro residencial — cliente com perfil compatível [Iniciar]

EVENTOS DE VIDA
🎂 Aniversário: 14/08 (próximo em 98 dias)
+ Adicionar evento

HISTÓRICO DE CONTATOS
● Contato de renovação enviado — WhatsApp — 10/05/2026 14:30
● Apólice de Vida cadastrada — 03/03/2026
● Apólice de Auto cadastrada — 01/12/2025
```

Sem emoji na versão final — substituir por ícones Lucide com cor correspondente.

---

## 8. Cross-sell (`/crosssell`)

### Layout

```
PAGE HEADER: "Cross-sell Inteligente"
Subtítulo: "X oportunidades identificadas na sua carteira"

TABS: Abertas (X) | Em Andamento (X) | Fechadas | Perdidas

FILTROS: [Ramo sugerido ▾] [Score ▾] [Cliente ▾]

LISTA DE OPORTUNIDADES:
┌─────────────────────────────────────────────────────────────────┐
│ ⚡ Alta prioridade                                    ★★★★★     │
│                                                                  │
│ João Lima → Proposta de Vida                                     │
│ Tem: Auto (14 meses). Sem proteção de vida cadastrada.           │
│                                                                  │
│ [Iniciar Abordagem]  [Ver perfil]  [Dispensar por 90d]          │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                                                       ★★★☆☆     │
│                                                                  │
│ Maria Costa → Seguro Auto                                        │
│ Tem: Saúde + Residencial. Sem auto cadastrado.                   │
│                                                                  │
│ [Iniciar Abordagem]  [Ver perfil]  [Dispensar por 90d]          │
└─────────────────────────────────────────────────────────────────┘
```

Cada card: bg `#FFFFFF`, border 1px `#E5E5E5`, border-radius 8px, padding 20px.

Score: 5 estrelas, estrelas preenchidas em `#0BD904`, vazias em `#E5E5E5`.

Banner de alta prioridade (score 5): top-left tag "⚡ Alta prioridade" — usar ícone Zap, cor `#D97706`.

### Drawer de Oportunidade
Ao clicar "Iniciar Abordagem":
- Status muda para "Em Andamento"
- Drawer abre com:
  - Resumo do cliente e apólices existentes
  - Template de abordagem (editável) para o ramo sugerido
  - Campo de anotação
  - Botões: "Marcar como Fechado" (abre form para vincular apólice) | "Marcar como Perdido" (pede motivo)

---

## 9. Alertas (`/alertas`)

### Layout

```
PAGE HEADER: "Alertas"   [Marcar todos como lidos]

TABS: Hoje (X) | Semana (X) | Todos | Arquivados

FILTROS: [Tipo ▾] [Ramo ▾]

LISTA:
┌─────────────────────────────────────────────────────┐
│ [Bell icon vermelho]  RENOVAÇÃO CRÍTICA             │
│ Ana Santos — Auto — Porto Seguro                    │
│ Vence em 7 dias (01/12/2026)                        │
│                                                     │
│ [Enviar WhatsApp]  [Enviar Email]  [Marcar Feito]  │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ [Gift icon verde]  ANIVERSÁRIO HOJE                 │
│ Roberto Campos — faz 52 anos hoje                   │
│                                                     │
│ [Enviar Mensagem]  [Marcar Feito]                  │
└─────────────────────────────────────────────────────┘
```

Tipos de ícone por alerta:
- Renovação crítica (≤ 7d): `Bell` cor `#DC2626`
- Renovação próxima (8-30d): `Bell` cor `#D97706`
- Aniversário: `Gift` cor `#0BD904`
- Aniversário de apólice: `Calendar` cor `#2563EB`
- Lead parado: `AlertTriangle` cor `#D97706`
- Comissão atrasada: `DollarSign` cor `#DC2626`
- Evento de vida: `Star` cor `#8B5CF6`

### Modal de Mensagem WhatsApp
Ao clicar "Enviar WhatsApp":
```
┌────────────────────────────────────────────┐
│ Mensagem para Ana Santos                   │
│                                            │
│ [textarea com template pré-preenchido]     │
│ "Oi Ana! Tudo bem? Seu seguro auto está    │
│ vencendo em 7 dias (01/12/2026). Posso     │
│ te ajudar a renovar? ..."                  │
│                                            │
│ [Abrir WhatsApp ↗]  [Cancelar]            │
└────────────────────────────────────────────┘
```
"Abrir WhatsApp" → `window.open('https://wa.me/55[telefone]?text=[mensagem encoded]')`.

---

## 10. Financeiro (`/financeiro`)

### Layout Principal

```
PAGE HEADER: "Financeiro"  [Mês: Maio 2026 ◂ ▸]

TOP CARDS ROW:
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Previsto/mês   │ │ Recebido       │ │ A Receber      │ │ Em Atraso      │
│ R$ 12.450      │ │ R$ 7.200       │ │ R$ 5.250       │ │ R$ 820         │
│                │ │ ████████░░ 58% │ │ ██████░░░░ 42% │ │ ██░░░░░░░░ 7%  │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘

PRÓXIMAS COMISSÕES — tabela
Apólice          | Cliente     | Seguradora   | Esperado em  | Valor    | Status
────────────────────────────────────────────────────────────────────────────────
AP-001234 Auto   | Ana Santos  | Porto Seguro | 01/06/2026   | R$ 360   | [PENDENTE]
AP-005678 Vida   | João Lima   | Caixa Seg.   | 15/06/2026   | R$ 720   | [PENDENTE]
AP-009012 Saúde  | Maria Costa | Amil         | 01/05/2026   | R$ 840   | [ATRASADO]  ← linha vermelha

AÇÕES EM LINHA: [Registrar Recebimento] · [Marcar como Pago]
```

### Registrar Recebimento (modal)
- Apólice (readonly)
- Data de recebimento*
- Valor recebido* (se diferente do esperado, mostra delta em vermelho)
- Forma de recebimento (Depósito | PIX | Outro)
- Observação

### Relatórios (`/financeiro/relatorios`)
Filtros: Período (mês/trimestre/semestre/ano/custom) + Seguradora + Ramo.

Tabela: Seguradora | Ramos | Apólices Ativas | Prêmio Total | Com. Esperada | Com. Recebida | Delta.

Exportação: botão "Exportar CSV" (top-right).

---

## 11. Documentos (`/documentos`)

### Layout

```
PAGE HEADER: "Documentos e Processos"

TABS: Checklists | Templates de Proposta | Assinaturas Pendentes

────────────────────────────────────────────────────────────────
CHECKLISTS POR RAMO:
[Auto] [Vida] [Saúde] [Residencial] [Empresarial] [Viagem]

CONTEÚDO DO CHECKLIST (ao selecionar ramo "Auto"):
Documentação necessária — Seguro Auto

Obrigatórios:
☐ CNH do(s) condutor(es) principal(is)
☐ Documento do veículo (CRV/CRLV)
☐ CPF do proprietário
☐ Comprovante de endereço (últimos 3 meses)

Opcionais:
☐ Histórico de sinistros
☐ Certificado de curso de pilotagem (para redução de prêmio)
```

Progresso salvo por processo aberto (pode ter múltiplos processos simultâneos).

### Templates de Proposta
Lista de templates por ramo. Botão "Editar Template" → editor simples de texto com variáveis (`{nome_cliente}`, `{ramo}`, `{seguradora}`, `{premium}`, `{vigencia_inicio}`, `{vigencia_fim}`).

"Gerar Proposta" → seleciona cliente e preenche variáveis → preview PDF → Download | Enviar por Email | Enviar para Assinatura (ZapSign).

---

## 12. Configurações (`/configuracoes`)

### Sidebar de Configurações
```
Minha Conta
Corretora
Integrações    ← ManyChat webhook + ZapSign
Mensagens Automáticas
Importação
Plano e Billing
```

### Integrações

**ManyChat:**
```
Sua URL de Webhook:
https://lucky-saas.com.br/api/webhooks/[ID único]

[Copiar URL]

Como configurar: [Link para tutorial]
Campos mapeados: nome → name | telefone → phone | ramo → insurance_type
```

**ZapSign:**
```
API Key:  [input mascarado]
Status: ● Conectado | ○ Desconectado

[Testar conexão]  [Salvar]
```

### Mensagens Automáticas
Edição de templates:
- Renovação (90d, 60d, 30d)
- Boas-vindas (fechamento de lead)
- Aniversário do cliente
- Aniversário de apólice

Variables disponíveis exibidas como chips clicáveis que inserem a variável no textarea.

### Plano e Billing
- Card do plano atual (Starter / Pro / Broker) com limites e uso atual
- Botão "Gerenciar Plano" → redireciona para Stripe Customer Portal
- Histórico de faturas (últimas 6)

---

## 13. Estados Globais

### Empty States (por seção)
- Pipeline sem leads: ícone Users, "Seu pipeline está vazio", subtítulo "Adicione seu primeiro lead para começar a acompanhar suas negociações", CTA "Adicionar Lead"
- Apólices sem dados: ícone Shield, "Nenhuma apólice cadastrada ainda", subtítulo, CTA "Cadastrar Apólice" + link "Importar planilha"
- Alertas sem alertas: ícone Bell, "Nenhum alerta hoje", subtítulo "Tudo em dia! Novos alertas aparecerão aqui conforme as datas se aproximam."
- Cross-sell sem dados: ícone Zap, "Sem oportunidades identificadas", subtítulo "Adicione mais apólices para o sistema identificar oportunidades de cross-sell"

### Loading States
Skeleton para todas as tabelas e cards. Nunca spinner isolado sem layout.

### Toast Notifications
- Posição: top-right, 320px de largura
- Auto-dismiss: 4 segundos
- Tipos: success (border-left `#16A34A`), error (border-left `#DC2626`), info (border-left `#2563EB`)
- Exemplos: "Apólice salva com sucesso" | "Erro ao salvar — tente novamente" | "Lead movido para Cotação"
- Sem emoji, sem ícone de check/x excessivamente grande

### Error States (páginas)
- 404: "Página não encontrada" + link para Dashboard
- 500: "Algo deu errado" + botão "Recarregar" + link para suporte
- Acesso negado: "Você não tem permissão" + link para Dashboard

---

## 14. Componentes Compartilhados

### `<AppShell>` — Layout raiz
Props: `children`. Compõe: Sidebar + main content div.

### `<Sidebar>` — Navegação lateral
Props: `user`, `plan`, `activeRoute`. Inclui: logo, nav items, footer user area.

### `<PageHeader>` — Cabeçalho de página
Props: `title`, `subtitle?`, `actions?` (ReactNode). Altura 56px, sticky.

### `<DataTable>` — Tabela genérica
Props: `columns`, `data`, `loading`, `pagination`, `onRowClick?`, `rowClassName?`.
Inclui: skeleton loading, empty state customizável, paginação.

### `<FilterBar>` — Barra de filtros
Props: `filters` (array de config), `onChange`, `values`. Compõe select/input conforme tipo de cada filtro.

### `<Drawer>` — Painel lateral deslizante
Props: `open`, `onClose`, `title`, `children`, `width?` (default 400px). Overlay no mobile.

### `<Modal>` — Diálogo centralizado
Props: `open`, `onClose`, `title`, `children`, `actions?`. Max-width 560px.

### `<Badge>` — Status
Props: `variant` (ativa | vence-30d | vence-60d | vencida | cancelada | novo-lead), `children`.

### `<AlertCard>` — Card de alerta do dashboard
Props: `type` (renovacao | aniversario | lead-parado | comissao), `title`, `subtitle`, `count`, `onAction`.

### `<EmptyState>` — Estado vazio
Props: `icon` (Lucide component), `title`, `description`, `action?` ({label, onClick}).

### `<WhatsAppModal>` — Modal de envio de mensagem
Props: `open`, `onClose`, `contactName`, `phone`, `defaultTemplate`.

---

## 15. Formulários — Regras Gerais

- Validação inline (abaixo do campo, texto `12px #DC2626`)
- Campos obrigatórios: asterisco na label (`*`), sem texto "campo obrigatório" verboso
- Submit button: disabled + loading spinner durante request
- Formatação automática: telefone `(11) 99999-9999`, CPF `000.000.000-00`, valores `R$ 0,00`
- Focus visible em todos os inputs (acessibilidade)
- Tab order lógico (top-to-bottom, left-to-right)

---

## 16. Internacionalização

Língua: Português Brasileiro exclusivamente. `pt-BR`.

Formatação de datas: `dd/MM/yyyy` (01/12/2026).  
Formatação monetária: `R$ 1.800,00` (separador decimal vírgula, milhar ponto).  
Timezone: `America/Sao_Paulo` para todos os alertas e timestamps.

---

*Lucky SaaS — Frontend Spec v1.0 | @ux-design-expert — Uma | Squad lucky-saas | 2026-05-07*
