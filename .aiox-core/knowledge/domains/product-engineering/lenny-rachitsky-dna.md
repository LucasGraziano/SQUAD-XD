---
expert: Lenny Rachitsky
domain: product-engineering
source: Lenny's Newsletter + Lenny's Podcast + ex-Airbnb Growth
format: dna-v3
elements: 40
---

## L1 Filosofias
- Retenção é o alicerce de todo o crescimento — sem retenção, aquisição é balde furado
- Ativação determina LTV mais que qualquer outra alavanca — o "aha moment" define quem fica
- North Star Metric orienta toda a empresa; sem ela, cada time otimiza uma coisa diferente
- Benchmarks existem para calibrar, não para copiar — entender por que você está acima ou abaixo é o insight
- Growth é a amplificação de algo que funciona — nunca a solução para algo que não funciona
- A maior oportunidade de crescimento raramente é aquisição — geralmente é ativação ou retenção
- Dados sem contexto são perigosos; contexto sem dados é opinião

## L2 Modelos Mentais
- **North Star Framework**: Identificar a 1 métrica que melhor captura o valor entregue ao cliente E que prediz receita futura — toda decisão de produto serve essa métrica
- **Growth Accounting**: Nova receita = New MRR + Expansion MRR − Churned MRR − Contraction MRR — cada componente tem alavancas próprias
- **Activation Funnel**: Sequência de eventos que leva o usuário do cadastro ao "aha moment" — cada passo tem taxa de conversão medível
- **T2D3**: Tripling, tripling, doubling, doubling, doubling — padrão de crescimento de MRR de SaaS de sucesso (de $1M a $100M ARR em ~5 anos)
- **DAU/MAU Ratio**: Mede o engajamento real — B2C viral: >50%; B2B produtivo: >20%; marketplace: >25%
- **Bow-Tie Funnel**: Acquisition → Activation → Retention → Expansion → Advocacy — o "nó" é ativação; funil de venda tradicional ignora a metade direita

## L3 Heurísticas
- B2B SaaS saudável: churn anual < 5%, NRR (Net Revenue Retention) > 110%, payback < 12 meses
- B2C consumer: retenção Day 1 > 25%, Day 7 > 10%, Day 30 > 5% (benchmarks variam por categoria)
- NPS > 50 é excelente; > 30 é bom; < 0 é sinal de problema sistêmico, não de feature
- Time to Value (TTV) para ativação: < 5 minutos para B2C viral, < 1 dia para SaaS B2B
- Usuário que atinge "aha moment" nos primeiros 7 dias tem 2-3x mais chance de reter no mês 3
- Churn de cohort não deve piorar após mês 3 — se piora, é problema de produto, não de aquisição
- Feature de retenção tem 3x mais ROI que feature de aquisição para SaaS maduro
- Expansion MRR > 20% do New MRR é sinal de product-market fit consolidado

## L4 Frameworks
- **North Star Metric Selection**: (1) Mapear o valor core que o produto entrega → (2) Encontrar o comportamento do usuário que melhor representa "receber esse valor" → (3) Testar correlação com retenção de 6 meses → (4) Verificar se é influenciável (time pode agir sobre ela) → (5) Escolher 1, não 3
  - `USE:` ao fundar produto novo ou quando a empresa não tem alinhamento sobre o que otimizar
  - `FAIL:` usar receita como North Star — receita é lagging indicator, não leading; times não sabem o que fazer diferente para mudar receita amanhã
  - `VS:` Marty Cagan foca em outcomes de usuário (comportamento); Lenny foca em North Star como ponte entre outcome de usuário e outcome de negócio — complementares
- **Activation Audit**: (1) Mapear todos os eventos do usuário nos primeiros 7 dias → (2) Calcular taxa de completude de cada evento → (3) Encontrar o evento com maior correlação com retenção de 30 dias → (4) Reduzir fricção até esse evento → (5) Medir TTV (time to value) até esse evento
  - `USE:` quando churn é alto mas NPS é ok — usuários gostam do produto mas não chegam ao valor
  - `FAIL:` otimizar etapas do onboarding sem primeiro identificar qual etapa é o aha moment — pode otimizar a coisa errada
  - `VS:` Wes Bush (PLG) foca em self-serve como caminho ao aha moment; Lenny foca em medir e otimizar qualquer caminho ao aha moment, não necessariamente self-serve
- **Growth Model Canvas**: (1) Identificar alavancas de aquisição (paid, organic, viral, sales) → (2) Calcular taxa de conversão de cada funil → (3) Mapear para North Star → (4) Calcular North Star para receita (via LTV) → (5) Identificar qual alavanca tem maior ROI marginal
  - `USE:` ao planejar investimento de growth — onde colocar o próximo real para crescer mais rápido
  - `FAIL:` SaaS early stage antes de ter product-market fit — Growth Model pressupõe produto que retém; sem retenção, mais aquisição = mais churn
  - `VS:` Hormozi foca em math de oferta (LTV/CAC como gate); Lenny foca em decomposição do crescimento em alavancas acionáveis — Hormozi valida se o negócio funciona, Lenny otimiza como crescer depois
- **Feature Audit (Usage × Love)**: Plotar cada feature em matriz 2×2: Uso alto/baixo × Amor alto/baixo → (1) Alto uso + alto amor: investir → (2) Alto uso + baixo amor: otimizar → (3) Baixo uso + alto amor: promover → (4) Baixo uso + baixo amor: remover
  - `USE:` antes de decisões de roadmap — evita construir features sem evidência
  - `FAIL:` usar apenas dados de uso sem pesquisa qualitativa ("amor") — feature pode ter alto uso por falta de alternativa, não por amor

## L5 Metodologias
- **Retenção-Primeiro antes de Escalar**: (1) Medir cohort retention de 3 e 6 meses → (2) Se curva de retenção plana > 20% (B2C) ou > 40% (B2B), há PMF sinal → (3) Fazer activation audit → (4) Dobrar TTV → (5) Só então escalar aquisição — escalar antes do PMF queima capital sem retorno
- **North Star Cascade**: North Star → Input metrics (3-5 métricas que movem a North Star) → Projetos de produto (1-3 projetos por input metric) → Experimentos (hipóteses testáveis por projeto) — cada experimento tem owner e deadline de 2 semanas

## Anti-Patterns
- **Balde Furado**: Escalar aquisição com retenção ruim → usuários entram e saem → CAC sobe, LTV não → negócio queima capital sem crescer → **Fix:** fixar retenção primeiro — se cohort de 30 dias < 20% (B2C) ou < 60% (B2B), parar aquisição paga e resolver produto
- **Vanity Metrics como North Star**: Escolher DAUs totais ou downloads como North Star → times otimizam para aquisição mas ignoram retenção → **Fix:** North Star deve correlacionar com retenção de 90 dias — testar correlação antes de declarar
- **Feature Shipping sem Activation Check**: Lançar features sem medir se aumentam ativação ou uso da North Star → product debt acumula → **Fix:** toda feature tem métrica de sucesso declarada antes do lançamento
- **NPS Mensal sem Cohort**: Medir NPS agregado esconde que clientes novos são mais felizes que antigos (ou vice-versa) → **Fix:** segmentar NPS por cohort de cadastro e por plano
- **Expansion Ignorada**: Focar apenas em new MRR e ignorar expansion MRR → deixar dinheiro na mesa → **Fix:** para SaaS B2B, expansion deve ser > 20% da receita nova; se não está, o produto não está entregando crescimento para o cliente

## Situation Map
| Situação | Framework | Sinal de Alerta |
|----------|-----------|-----------------|
| Definir a North Star Metric do produto | North Star Selection: mapear valor core → comportamento → correlação → influenciável | Se tiver 3 candidatas de "North Star", nenhuma delas é realmente a North Star — forçar escolha de 1 |
| Churn alto sem saber por quê | Activation Audit: onde os usuários param nos primeiros 7 dias? | Se TTV > 1 semana para B2B, ativação é o problema — não feature lack |
| Decidir onde investir próximo trimestre | Growth Model Canvas: qual alavanca tem maior ROI marginal agora? | Se produto tem PMF sinal fraco, nenhuma alavanca de aquisição compensa — resolver retenção primeiro |
| Roadmap lotado, não sabe o que cortar | Feature Audit (Usage × Love): matar baixo-uso + baixo-amor primeiro | Features com alto uso mas baixo amor são armadilhas — usuários usam por falta de alternativa, não por valor real |
| Founder quer escalar antes do tempo | Cohort retention check: curva plana > 20%? Se não, PMF não confirmado | T2D3 só começa com PMF confirmado — escalar antes é queimar capital |
