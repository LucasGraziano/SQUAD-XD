---
expert: Wes Bush
domain: saas-operations
source: Product-Led Growth (livro) + ProductLed.com
format: dna-v3
elements: 36
---

## L1 Filosofias
- Produto é o principal canal de vendas — não o vendedor, não o marketing, não o suporte
- Free cria hábito que paid converte — sem experiência gratuita do valor, a decisão de comprar é baseada em promessa, não em prova
- Aquisição → Ativação → Retenção → Expansão → Referência — ordem importa; inverter é desperdiçar
- Time to Value (TTV) determina conversão free→paid — quanto mais rápido o usuário sente o valor, maior a conversão
- Product Qualified Lead (PQL) converte 3-5x mais que Marketing Qualified Lead (MQL) — comportamento no produto é sinal mais forte que engajamento em marketing
- Viral não acontece sem um motivo natural de compartilhamento embutido no produto
- PLG e SLG (sales-led) não são opostos — PLG gera leads quentes para vendas fecharem mais rápido

## L2 Modelos Mentais
- **Product Qualified Lead (PQL)**: usuário que completou conjunto de ações-chave no produto = sinal de conversão; venda aborda quando PQL é atingido, não pelo calendário ou por MQL genérico
- **Time to Value (TTV)**: tempo entre cadastro e primeiro momento em que o usuário sente o valor prometido — métrica-raiz de toda ativação
- **Freemium vs. Free Trial**: Freemium = funcionalidade limitada grátis para sempre; Free Trial = produto completo por tempo limitado — escolha depende do produto e do ICP
- **Moat Matrix**: matriz de diferenciação PLG — Data Moat (produto melhora com mais dados do usuário), Network Effect (produto melhora com mais usuários), Virality (usuário naturalmente convida outros), Switching Cost (custo de saída alto após adoção)
- **Bow-Tie Funnel**: Acquisition → Activation → Retention (retenção = moat) → Expansion (upsell/cross-sell) → Advocacy — o funil não termina na compra; expansão e referência são onde o PLG compõe crescimento
- **PLG vs. SLG Spectrum**: Produto de baixo preço e alto volume → PLG puro. Produto enterprise complexo → SLG. Produto mid-market → PLG + toque de vendas no momento certo (quando PQL atingido)

## L3 Heurísticas
- TTV < 5 minutos para B2C viral; < 1 hora para SaaS B2B self-serve; < 1 dia para B2B consultivo
- Freemium saudável: conversão free→paid > 2% (B2B); > 1% (B2C com volume alto)
- Free Trial saudável: conversão trial→paid > 15% (B2B); > 5% (B2C)
- PQL scoring: 3-5 ações-chave definem PQL; time de vendas só aborda usuário PQL — contato antes = spam, depois = perde janela
- Viral coefficient (K-factor) > 1 = crescimento exponencial; > 0.5 = amplificação significativa; < 0.3 = virality não é alavanca
- Produto que retém < 40% dos usuários pagantes após 6 meses não é candidato a PLG — problema de produto, não de go-to-market
- Custo de suporte de usuário free > receita de expansão esperada = freemium destruidor de valor; recalibrar o que é grátis

## L4 Frameworks
- **PLG Flywheel**: (1) Atrair usuário com promessa de valor imediato (free/trial) → (2) Ativar com TTV mínimo → (3) Encantar com valor contínuo → (4) Monetizar quando PQL → (5) Expandir via upsell natural → (6) Referência (produto com virality embutida) → volta ao (1) com mais usuários — cada volta do flywheel acelera o próximo
  - `USE:` ao estruturar go-to-market de produto com componente free — especialmente SaaS B2B mid-market
  - `FAIL:` produto que não tem "aha moment" auto-suficiente — sem aha moment, o flywheel não gira porque não há motivo para ficar
  - `VS:` Funil linear de Brunson (Hook→Story→Offer) é sequência de persuasão; PLG Flywheel é sistema de auto-reforço via produto — Brunson funciona para produtos sem free tier; PLG para produtos onde o produto é a prova
- **PQL Scoring Framework**: (1) Identificar ações que correlacionam com conversão (olhar dados de usuários que converteram) → (2) Pesar cada ação por importância → (3) Definir threshold de PQL score → (4) Integrar com CRM para notificar vendas quando PQL atingido → (5) Testar e calibrar threshold a cada trimestre
  - `USE:` para SaaS B2B que tem trial ou freemium e time de vendas — maximiza eficiência de vendas
  - `FAIL:` produto early stage sem dados suficientes de conversão — PQL scoring precisa de base de conversões para calibrar; com < 50 conversões, usar intuição com 3 ações-chave simples
  - `VS:` MQL (Marketing Qualified Lead) é baseado em engajamento de marketing (download, webinar); PQL é baseado em comportamento no produto — PQL converte 3-5x mais
- **Free Tier Design**: (1) Identificar o "aha moment" do produto → (2) Dar acesso gratuito até o aha moment → (3) Colocar paywall logo após o aha moment → (4) Features free devem criar hábito de uso → (5) Features pagas devem ser naturalmente o próximo passo após o hábito formado
  - `USE:` ao desenhar freemium — o que é grátis é decisão estratégica, não de generosidade
  - `FAIL:` dar features demais de graça (sem incentivo para pagar) ou de menos (sem aha moment antes do paywall) — os dois extremos matam conversão
  - `VS:` Hormozi Value Equation (mais valor entregue = maior preço) se aplica ao tier pago; Free Tier Design define o que o produto entrega de graça para criar demanda pelo pago

## L5 Metodologias
- **PLG Audit para Produto Existente**: (1) Mapear TTV atual → (2) Calcular conversão free→paid ou trial→paid → (3) Identificar PQL atual (correlação de comportamento) → (4) Verificar onde usuários dropam no onboarding → (5) Redesenhar free tier para eliminar friction até aha moment → (6) Implementar PQL scoring → (7) Criar expansion trigger natural → (8) Medir K-factor de referência
- **PLG Motion do Zero**: (1) Definir aha moment → (2) Escolher modelo (freemium vs. trial vs. demo grátis) → (3) Construir onboarding que chega ao aha moment em TTV target → (4) Definir 3 ações que definem PQL → (5) Criar expansion path natural → (6) Implementar virality loop se aplicável

## Anti-Patterns
- **Paywall Prematuro**: Colocar paywall antes do usuário sentir o valor → ninguém converte porque ninguém confia → **Fix:** Free Tier Design garante aha moment antes do paywall; paywall ativa naturalmente após criar necessidade
- **Freemium sem Expansion Path**: Usuário usa grátis para sempre sem motivo para pagar → receita não cresce → **Fix:** features gratuitas criam hábito; features pagas são a continuação natural do hábito (ex: Notion gratuito → Notion para times é a expansão natural)
- **Onboarding Generic**: Onboarding igual para todos os usuários independente do caso de uso → TTV alto → ativação baixa → **Fix:** segmentar onboarding por persona no cadastro (3 perguntas) e customizar caminho ao aha moment
- **Vendas abordando não-PQL**: Time de vendas liga para qualquer trial sem olhar PQL score → desperdício de esforço e invasão da experiência do usuário → **Fix:** vendas só aborda PQL (score atingido); trial sem PQL recebe nutrição automatizada, não contato humano
- **K-factor > 0 por acidente**: Produto tem alguma referência mas sem virality loop intencional → crescimento orgânico baixo e não escalável → **Fix:** identificar o momento natural de compartilhamento no produto (ex: resultado gerado, convite para colaborar) e amplificar com incentivo ou frictionless share

## Situation Map
| Situação | Framework | Sinal de Alerta |
|----------|-----------|-----------------|
| Definir modelo de go-to-market para SaaS novo | PLG vs. SLG: complexidade do produto + ICP + preço determinam o mix | Produto enterprise (> R$10k/mês) sem white-glove onboarding = PLG puro vai falhar |
| Converter mais usuários free em pagantes | Free Tier Design: aha moment antes do paywall? PQL scoring ativo? | Se conversão < 2% com volume de free users, problema é de free tier design, não de preço |
| Montar pipeline de vendas eficiente com PLG | PQL Framework: identificar 3 comportamentos que predizem conversão | Se vendas ligam para todos os trials igualmente, PQL não está sendo usado — eficiência de vendas vai ser baixa |
| Reduzir custo de aquisição | PLG Flywheel: virality loop natural existe? TTV é curto o suficiente? | K-factor < 0.1 = virality não é alavanca real; focar em retenção e expansion primeiro |
| Produto tem retenção baixa mas acquisition ok | Activation Audit: usuários chegam ao aha moment? TTV é compatível com o prometido? | Aquisição alta + retenção baixa = produto não entrega o que promete; nenhum PLG conserta isso sem mudar o produto |
