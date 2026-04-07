---
domain: funnels-value-ladder
format: anti-patterns-v1
token_budget: ~300
---

# Anti-Patterns — Funnels & Value Ladder

## Criticos (falha imediata)

**AP-01 | Value ladder sem porta de entrada barata**
- Sinal: produto mais barato na oferta ja tem ticket alto (acima de R$1k) sem produto de entrada menor
- Consequencia: cliente chega no high-ticket sem experiencia previa com o vendedor — conversao baixa, custo de aquisicao alto
- Fonte: Doug (micro-produto como porta), Brunson (Value Ladder sequencial)
- Fix: criar micro-produto consumivel em menos de 1h como primeira porta. Deve entregar uma vitoria rapida que justifica o proximo nivel

**AP-02 | Upsell antes da primeira entrega do produto base**
- Sinal: oferta de produto adicional feita imediatamente apos o checkout, antes do cliente ter consumido nada
- Consequencia: arrependimento de compra, aumento de chargeback, sensacao de "pegadinha"
- Fonte: Hormozi (primeira vitoria antes de upsell), Brunson (sequencia correta no funil pos-compra)
- Fix: garantir que o cliente consuma e obtenha resultado minimo com o produto base. Upsell somente apos evidencia de resultado ou onboarding completo

**AP-03 | Construir funil complexo antes de validar oferta**
- Sinal: investir semanas em paginas, automacoes e VSL antes de ter qualquer prova de que a oferta converte
- Consequencia: meses de trabalho em estrutura para uma oferta que o mercado nao quer
- Fonte: Doug (GDoc simples como MVP), Hard Copy (MPV methodology)
- Fix: validar a oferta com GDoc ou pagina basica (texto + link de pagamento) antes de construir funil completo. Primeiro venda, depois otimize a embalagem

## Recorrentes (degradam ao longo do tempo)

**AP-04 | Ignorar ascensao (sem rota clara do barato ao caro)**
- Sinal: cada produto existe de forma isolada, sem gatilho ou convite para o proximo nivel dentro da experiencia do produto
- Consequencia: ciclo de vida de cliente curto, LTV baixo, dependencia de aquisicao constante de novos clientes
- Fonte: Doug (Teia de Ofertas, Loop de Compras), Brunson (Funnel Stacking)
- Fix: cada produto deve conter o gancho para o proximo nivel — seja no onboarding, na entrega ou no momento de maior satisfacao do cliente

**AP-05 | Funil sem follow-up apos compra (zero onboarding)**
- Sinal: cliente compra e recebe apenas acesso ao produto sem sequencia de boas-vindas ou guia de primeiro passo
- Consequencia: cliente nao consome o produto, nao obtem resultado, nao ascende — e pede reembolso ou desaparece
- Fonte: Doug (janela de 24-72h pos-compra), Brunson (sequencia de onboarding como parte do funil)
- Fix: implementar sequencia minima de onboarding nas primeiras 24-72h — 1 email de boas-vindas com primeiro passo claro + 1 email de vitoria rapida em 48h. Brunson: tratar onboarding como etapa do funil, nao bonus opcional
