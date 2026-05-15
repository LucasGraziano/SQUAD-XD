# Use Cases — Premia SaaS

**Versão:** 1.0 (retroativo)
**Data:** 2026-05-14
**Autor:** @analyst (Atlas) + @master (Orion)

---

## Convenção

Cada use case segue o formato:
- **Ator:** Quem executa a ação
- **Pré-condição:** O que precisa ser verdadeiro antes
- **Fluxo principal:** Passos do caminho feliz
- **Fluxos alternativos:** Desvios comuns
- **Pós-condição:** Estado do sistema após conclusão
- **Valor de negócio:** Por que isso importa

---

## UC-01 — Gestão de Clientes

**Épico:** 5 | **Stories:** 5.1 (indireta), 7.15

**Ator:** Corretor (broker autenticado)

**Pré-condição:** Usuário autenticado, em `/clientes`

**Fluxo Principal:**
1. Corretor abre `/clientes` — sistema exibe tabela de clientes com busca e filtros
2. Clica em "Novo Cliente" → modal de cadastro
3. Preenche: nome, CPF/CNPJ, telefone (obrigatório), e-mail, data de nascimento, endereço, tags, notas
4. Salva → cliente criado, tabela atualizada
5. Clica no nome do cliente → abre `/clientes/[id]`
6. Perfil exibe: dados cadastrais, apólices ativas, oportunidades de cross-sell, histórico completo de apólices
7. Pode editar dados, adicionar notas, ver histórico de renovações

**Fluxos Alternativos:**
- **FA-01 (Importação em Massa):** Clientes criados automaticamente durante importação CSV se não existirem (match por CPF/CNPJ ou nome)
- **FA-02 (Filtro Aniversariantes):** Badge "Aniversariantes do mês" filtra clientes cujo `birth_date` está no mês atual; 🎂 emoji destaca na listagem
- **FA-03 (Busca):** Busca por nome filtra em tempo real (debounced)

**Pós-condição:** Cliente cadastrado disponível em toda a plataforma (apólices, alertas, cross-sell)

**Valor de Negócio:** Centraliza histórico do cliente que antes ficava fragmentado entre WhatsApp, e-mail e planilha.

---

## UC-02 — Gestão de Apólices

**Épico:** 5 | **Stories:** FR-5.02, 5.12, 5.13, 7.04

**Ator:** Corretor

**Pré-condição:** Cliente existente no sistema

**Fluxo Principal:**
1. Corretor abre `/apolices` — tabela com todas as apólices (filtros por status, ramo, seguradora, validade)
2. Clica em "Nova Apólice" → formulário
3. Preenche: cliente (busca por nome), número de apólice, seguradora, ramo, vigência (início-fim), prêmio total, % comissão, tipo, frequência de pagamento, notas
4. Sistema calcula automaticamente `commission_expected = premium_total * commission_pct / 100`
5. Salva → apólice criada, alerta de renovação agendado automaticamente (90/60/30/15/7 dias antes)
6. Corretor acessa `/apolices/[id]` → detalhe com pendências, sinistros, comissões

**Fluxos Alternativos:**
- **FA-01 (Converter de Proposta):** Proposta aprovada → botão "Converter em Apólice" → formulário pré-preenchido, nenhum campo digitado novamente
- **FA-02 (Renovação):** Apólice vencendo → botão "Renovar" → gera cotação de renovação com dados pré-preenchidos → aprovação → nova apólice com `parent_policy_id` linkado
- **FA-03 (Importação):** Importar planilha de apólices (até 500 linhas) → mapeamento de colunas → importação em lote

**Pós-condição:** Apólice registrada, alertas configurados, comissão rastreável

**Valor de Negócio:** Elimina planilha. Garante que 100% das apólices têm alertas de renovação ativados desde o momento do cadastro.

---

## UC-03 — Alertas Automáticos de Renovação

**Épico:** 5, 7 | **Stories:** FR-5.03, 7.09

**Ator:** Sistema (cron job) → Corretor

**Pré-condição:** Apólice ativa com `end_date` no futuro; cron job rodando diariamente 07:00 BRT

**Fluxo Principal:**
1. Cron job executa diariamente
2. Busca apólices com `status = 'ativa'` e `end_date` nos próximos 90, 60, 30, 15 e 7 dias
3. Para cada apólice no threshold (sem alerta já existente no período): cria registro em `alerts` com `type = 'renewal'`, `scheduled_for = today`
4. Corretor abre dashboard → badge vermelho no sidebar mostra count de alertas pendentes
5. Abre `/alertas` → lista filtrada por tipo e status
6. Para cada alerta: pode marcar como "Enviado" (liga para o cliente e renova) ou "Dispensar"
7. Botão "Renovar com 1 Clique" → gera proposta de renovação pré-preenchida

**Fluxos Alternativos:**
- **FA-01 (First Win):** Quando o primeiro alerta de renovação é disparado na conta, banner celebratório aparece no dashboard
- **FA-02 (Push Notification):** Se corretor habilitou push, recebe notificação nativa no browser/mobile
- **FA-03 (Aniversário):** Cron separado dispara alertas `type = 'birthday'` para clientes aniversariantes

**Pós-condição:** Corretor ciente de todas as renovações do dia; zero renovações perdidas por esquecimento

**Valor de Negócio:** Este é o **core value proposition** do Premia. Uma renovação perdida = meses de comissão perdida + risco de perder o cliente.

---

## UC-04 — Multicálculo de Cotação

**Épico:** 5 | **Stories:** 5.9, 5.13, 7.03, 7.06, 7.07, 7.08

**Ator:** Corretor

**Pré-condição:** Usuário em `/cotacoes`

**Fluxo Principal:**
1. Corretor seleciona ramo (Auto, Vida, Saúde, Residencial, Empresarial)
2. Preenche formulário específico do ramo:
   - **Auto:** Marca, modelo, ano, valor FIPE, placa, condutor principal, CEP
   - **Vida:** Nome segurado, data de nascimento, cobertura desejada, beneficiários
   - **Saúde:** Número de vidas, faixa etária, cobertura
   - **Residencial:** Endereço, valor do imóvel, tipo de construção
3. Preenche cotações para cada seguradora manualmente (multicálculo manual — Story 5.9)
4. Sistema exibe tabela comparativa com prêmios e comissões por seguradora
5. Corretor seleciona a melhor opção → clica "Gerar Proposta PDF"
6. PDF gerado server-side com logo do corretor, dados do cliente, coberturas, prêmio, validade
7. Download direto ou envio por e-mail

**Fluxos Alternativos:**
- **FA-01 (Link Compartilhável):** Proposta tem token público → cliente abre sem login e vê proposta completa → pode aprovar ou recusar via portal
- **FA-02 (Histórico de Versões):** Cada edição da proposta gera snapshot. Corretor pode ver histórico e restaurar versão anterior
- **FA-03 (Do Pipeline):** Lead no kanban → "Criar Cotação" → formulário pré-preenchido com dados do lead
- **FA-04 (Renovação):** Cotação marcada como `renewal_quote_id` linkado à apólice original

**Pós-condição:** Proposta gerada em PDF, cliente notificado, histórico salvo

**Valor de Negócio:** Elimina horas de trabalho manual em Excel para fazer proposta. Proposta profissional = mais credibilidade = mais conversão.

---

## UC-05 — Portal do Cliente

**Épico:** 5 | **Stories:** 5.1, 5.8

**Ator:** Cliente do corretor (usuário não-autenticado)

**Pré-condição:** Corretor enviou link do portal para o cliente; token válido (30 dias)

**Fluxo Principal:**
1. Cliente recebe link `/portal/[token]` via WhatsApp ou e-mail
2. Abre no browser — sem necessidade de criar conta ou senha
3. Vê suas apólices ativas: seguradora, ramo, vigência, prêmio, status
4. Pode baixar documentos (apólice PDF, proposta)
5. Pode abrir sinistro (formulário simples com tipo, data, descrição)
6. Status do sinistro atualizado em tempo real pelo corretor

**Fluxos Alternativos:**
- **FA-01 (Token Expirado):** Link expirado → página de erro com instrução para pedir novo link ao corretor
- **FA-02 (Proposta Pública):** Link de proposta (diferente do portal) → cliente vê proposta e pode aprovar/recusar → corretor recebe notificação in-app

**Pós-condição:** Cliente tem visibilidade dos seus seguros sem depender de ligar para o corretor

**Valor de Negócio:** Diferencial de posicionamento do corretor — "Você tem acesso ao seu portal de seguros 24/7". Reduz ligações de suporte. Aumenta percepção de profissionalismo.

---

## UC-06 — Importação em Massa de Apólices

**Épico:** 5, 7 | **Stories:** 5.15, 7.02

**Ator:** Corretor (novo usuário ou migrando da planilha)

**Pré-condição:** Usuário tem planilha Excel ou CSV de apólices existentes

**Fluxo Principal:**
1. Corretor abre modal de importação (botão "Importar" em `/clientes` ou `/apolices`)
2. **Passo 1 — Upload:** Drag & drop ou seleção de arquivo (.csv, .xlsx, .xls). Sistema faz parse e detecta cabeçalhos
3. **Passo 2 — Mapeamento:** Para cada coluna do arquivo, corretor mapeia ao campo do Premia. Sistema sugere mapeamento automático via aliases (ex: "Nome do Cliente" → `cliente_nome`, "Data Início" → `inicio_vigencia`)
4. **Passo 3 — Confirmação:** Preview mostra quantas linhas serão importadas + erros de validação linha a linha
5. Corretor confirma → Server Action processa importação em lote
6. Clientes criados automaticamente se não existirem
7. Alertas de renovação configurados para todas as apólices importadas
8. Resultado: "X apólices importadas, Y com erro" + lista de erros

**Fluxos Alternativos:**
- **FA-01 (Erros de Validação):** Linha com campo obrigatório faltando ou data inválida → pulada, listada na seção de erros. Linhas válidas são importadas normalmente
- **FA-02 (Limite):** Máximo de 500 linhas por importação (plan-gated para volumes maiores futuramente)

**Pós-condição:** Carteira inteira migrada para o Premia em minutos, não horas

**Valor de Negócio:** Onboarding rápido é crítico para ativação. Corretor que migra a carteira inteira no Day 1 tem muito mais chance de virar cliente pago.

---

## UC-07 — Pipeline de Vendas (Leads)

**Épico:** 5 | **Stories:** FR-5.06, 7.06

**Ator:** Corretor

**Pré-condição:** Usuário em `/pipeline`

**Fluxo Principal:**
1. Corretor vê kanban com colunas: Novo → Cotação Enviada → Negociação → Fechado / Perdido
2. Clica "+" em uma coluna para adicionar lead: nome, telefone, e-mail, ramo de interesse, origem (manual/manychat/Instagram/indicação)
3. Drag & drop do card para mover entre colunas
4. Em cada card: clica "Ver detalhes" → histórico de atividades
5. Adiciona notas/atividades (tipo: contato, nota, mudança de status)
6. "Criar Cotação" no card → abre formulário de cotação pré-preenchido com dados do lead

**Fluxos Alternativos:**
- **FA-01 (Lead → Cliente):** Quando lead é fechado → opção de converter em cliente
- **FA-02 (Razão de Perda):** Ao mover para "Perdido" → campo para razão de perda (price/timing/competitor/other)

**Pós-condição:** Processo de vendas rastreável, atividades registradas, conversão mensurável

**Valor de Negócio:** Corretor sabia intuitivamente que tinha leads "quentes" — mas não tinha onde rastrear sistematicamente. Com pipeline, pode priorizar o trabalho e medir conversão.

---

## UC-08 — Controle de Sinistros

**Épico:** 5 | **Stories:** 5.3

**Ator:** Corretor (abertura) e Cliente (via portal)

**Pré-condição:** Apólice ativa

**Fluxo Principal (abertura pelo corretor):**
1. Em `/sinistros` → "Abrir Sinistro"
2. Seleciona apólice → preenche: data da ocorrência, tipo (colisão/roubo/incêndio/alagamento/outros), descrição, valor estimado, número processo seguradora
3. Status inicial: `open`
4. Atualiza status conforme seguradora avança: analyzing → awaiting_docs → approved → paid → closed
5. Cada mudança de status registra nota no histórico

**Fluxo Alternativo (abertura pelo cliente via portal):**
1. Cliente no portal → "Abrir Sinistro" → formulário simplificado
2. Corretor recebe notificação → inicia acompanhamento

**Pós-condição:** Sinistro rastreável com histórico completo, visível para cliente no portal

**Valor de Negócio:** "Onde está meu sinistro?" é a pergunta mais estressante que o cliente faz. Portal + tracking = menos ligações + cliente mais satisfeito.

---

## UC-09 — Controle de Comissões

**Épico:** 5 | **Stories:** 5.12, 5.17

**Ator:** Corretor

**Pré-condição:** Apólices cadastradas com `commission_pct`

**Fluxo Principal:**
1. Dashboard financeiro em `/financeiro` exibe: comissões esperadas no mês (por apólice), comissões recebidas, divergências
2. Corretor lança comissão recebida: seleciona apólice, informa valor recebido e data
3. Sistema calcula divergência = recebido - esperado (coluna GENERATED)
4. Status: pendente → recebido (ou parcial, atrasado, cancelado)
5. Extrato histórico mostra todos os recebimentos passados com filtro por período
6. Forecast dos próximos 3 meses baseado em apólices com vencimento futuro

**Pós-condição:** Visibilidade total de fluxo de caixa de comissões

**Valor de Negócio:** Corretor geralmente não sabe exatamente quando vai receber de cada seguradora. Forecast de comissões = planejamento financeiro do negócio.

---

## UC-10 — Relatório de Carteira (PDF)

**Épico:** 7 | **Story:** 7.14

**Ator:** Corretor (plano Pro+)

**Pré-condição:** Usuário com plano Pro ou superior; em `/configuracoes`

**Fluxo Principal:**
1. Corretor clica "Gerar Relatório de Carteira" em `/configuracoes`
2. Sistema faz check de plano (PlanGate — Pro+)
3. API Route `GET /api/relatorio/carteira` executa:
   - Busca dados: total de clientes, apólices ativas, prêmio anual total, distribuição por ramo, top 5 seguradoras, taxa de renovação
   - Gera PDF via @react-pdf/renderer no servidor
4. Download automático: `relatorio-carteira-[slug]-[YYYY-MM-DD].pdf`
5. PDF contém: cabeçalho com nome/SUSEP do corretor, resumo executivo, gráfico de barras por ramo (SVG), top seguradoras, footer "Gerado pelo Premia"

**Fluxos Alternativos:**
- **FA-01 (Plano insuficiente):** Modal PlanGate com CTA de upgrade para Pro
- **FA-02 (Timeout):** Se carteira grande (>500 apólices), gera com limite de 500 mais recentes + nota no rodapé
- **FA-03 (Loading):** Botão mostra spinner + "Gerando..." durante processamento

**Pós-condição:** PDF profissional disponível para envio a clientes corporativos ou seguradoras

**Valor de Negócio:** "Tenho R$ 2 milhões em prêmio sob gestão" com documento. Usado em reuniões com RH de empresas para prospecção B2B.

---

## UC-11 — Notificação de Aniversário + Cross-sell

**Épico:** 7 | **Story:** 7.15

**Ator:** Sistema (cron) → Corretor

**Pré-condição:** Clientes com `birth_date` preenchido; cron job rodando 08:00 BRT

**Fluxo Principal:**
1. Cron job verifica clientes com `MONTH(birth_date) = current_month AND DAY(birth_date) = current_day`
2. Para cada aniversariante (não notificado ainda neste ano — check em `birthday_notifications_log`):
   - Calcula idade atual
   - Determina sugestão de cross-sell por faixa etária:
     - 18–25 anos → "Seguro Auto — primeira habilitação"
     - 25–40 anos → "Seguro de Vida — crescimento de família"
     - 40–60 anos → "Seguro Saúde premium"
     - 60+ anos → "Seguro de Vida Vitalício"
   - Insere alerta `type = 'birthday'` em `alerts`
   - Registra em `birthday_notifications_log` (year = ano atual)
3. Corretor abre dashboard → widget `BirthdayNotificationCard` exibe aniversariantes do dia
4. Cada card: 🎂 nome, idade, sugestão de cross-sell
5. Botão "Enviar Parabéns no WhatsApp" → abre WhatsApp com mensagem pré-formatada: "Olá [Nome], feliz aniversário! 🎉 Aproveitando a data, já pensou em [sugestão]?"

**Pós-condição:** Corretor contactou o cliente em data memorável com pretexto natural de cross-sell

**Valor de Negócio:** Aniversário é o pretexto de contato com maior taxa de abertura socialmente. Corretores top performers já fazem isso manualmente — Premia automatiza.

---

## UC-12 — Cross-sell Automático de Carteira

**Épico:** 7 | **Story:** 7.12

**Ator:** Sistema (engine) → Corretor

**Pré-condição:** Carteira com múltiplos clientes e apólices

**Fluxo Principal:**
1. Engine de cross-sell analisa carteira periodicamente:
   - Cliente com Auto mas sem Vida → score alto + sugestão "Vida"
   - Cliente com Residencial mas sem Auto → sugestão "Auto"
   - Cliente pessoa jurídica sem Empresarial → sugestão "Empresarial"
2. Widget no dashboard: "Você tem X clientes com Auto mas sem Vida — R$ Y em comissão potencial"
3. Corretor acessa `/crosssell` → lista de oportunidades com score, reason e status
4. Clica em oportunidade → vai para perfil do cliente → pode criar cotação diretamente
5. Marca oportunidade como: em andamento / fechada / perdida / dispensar (snooze até data)

**Pós-condição:** Nenhuma oportunidade óbvia de cross-sell passa despercebida na carteira

**Valor de Negócio:** Cross-sell é o crescimento de receita mais barato (cliente existente, sem custo de aquisição). Corretor que não faz cross-sell sistematicamente deixa dinheiro na mesa.

---

## UC-13 — Histórico de Renovações por Cliente

**Épico:** 7 | **Story:** 7.13

**Ator:** Corretor

**Pré-condição:** Cliente com histórico de apólices (renovadas e/ou encerradas)

**Fluxo Principal:**
1. Corretor abre perfil do cliente `/clientes/[id]`
2. Clica na aba "Histórico de Apólices"
3. Sistema exibe TODAS as apólices do cliente (ativas + encerradas), ordenadas por `end_date DESC`
4. Cada linha: número, seguradora, ramo, prêmio, vigência, status (badge colorido)
5. Apólices renovadas mostram: "Renovada por → #[número da nova]" com link para nova apólice
6. Totalizador no topo: X apólices, Y ativas, prêmio total ativo: R$ Z

**Pós-condição:** Histórico completo da relação com o cliente acessível em segundos

**Valor de Negócio:** "Qual era o prêmio do ano passado?" — pergunta que todo cliente faz e que o corretor leva 20 minutos para responder pesquisando e-mails. Com histórico, resposta em segundos = confiança do cliente.

---

## UC-14 — Agenda Integrada

**Épico:** 5, 6 | **Stories:** 5.6, 6.8

**Ator:** Corretor

**Pré-condição:** Usuário em `/agenda`

**Fluxo Principal:**
1. Corretor vê calendário mensal/semanal com eventos
2. Eventos automáticos: vencimentos de apólices (gerados pelo sistema), aniversários de clientes
3. Corretor cria eventos manuais: reunião com cliente, renovação agendada
4. Se Google Calendar sincronizado (plano Broker): eventos bidirecionais com Google Calendar
5. Notificação de agenda via alertas in-app

**Valor de Negócio:** Corretor tem visão do dia/semana sem precisar ir em várias ferramentas separadas.

---

## Resumo de Casos de Uso por Epic

| UC | Nome | Epic | Stories | Status |
|----|------|------|---------|--------|
| UC-01 | Gestão de Clientes | 5 | 5.1 | Live |
| UC-02 | Gestão de Apólices | 5 | 5.12, 5.13 | Live |
| UC-03 | Alertas de Renovação | 5, 7 | FR-5.03, 7.09 | Live |
| UC-04 | Multicálculo de Cotação | 5, 7 | 5.9, 7.03–7.08 | Live |
| UC-05 | Portal do Cliente | 5 | 5.1, 5.8 | Live |
| UC-06 | Importação em Massa | 5, 7 | 5.15, 7.02 | Live |
| UC-07 | Pipeline de Vendas | 5, 7 | FR-5.06, 7.06 | Live |
| UC-08 | Controle de Sinistros | 5 | 5.3 | Live |
| UC-09 | Controle de Comissões | 5 | 5.12, 5.17 | Live |
| UC-10 | Relatório de Carteira PDF | 7 | 7.14 | Live (Pro+) |
| UC-11 | Aniversário + Cross-sell | 7 | 7.15 | Live |
| UC-12 | Cross-sell Automático | 7 | 7.12 | Live |
| UC-13 | Histórico de Renovações | 7 | 7.13 | Live |
| UC-14 | Agenda Integrada | 5, 6 | 5.6, 6.8 | Live (Broker) |

---

## Change Log

| Data | Autor | Descrição |
|------|-------|-----------|
| 2026-05-14 | @master (Orion) | Documento criado — 14 use cases documentados dos Épicos 5-7 |
