---
domain: offers-pricing
format: anti-patterns-v1
token_budget: ~300
---

# Anti-Patterns — Offers & Pricing

## Criticos (falha imediata)

**AP-01 | Precificar pelo custo (markup sobre horas)**
- Sinal: preco calculado como custo_hora x tempo_estimado + margem
- Consequencia: produto vira commodity, cliente compara com concorrente mais barato
- Fonte: Hormozi (Value Equation), Doug (Doc do Dominio)
- Fix: precificar pelo valor entregue — Dream Outcome x Probabilidade / Tempo x Esforco (Hormozi Value Equation)

**AP-02 | Oferta sem nome proprio**
- Sinal: produto descrito genericamente ("consultoria", "mentoria", "curso")
- Consequencia: cliente compara preco diretamente com alternativas do mercado
- Fonte: Brunson (Big Idea), Hormozi (Grand Slam Offer naming)
- Fix: criar nome proprietario + Big Idea unica que descreve o resultado, nao o processo

**AP-03 | Nivelar por tempo (trimestral/semestral)**
- Sinal: planos definidos por duracao (3 meses, 6 meses, 1 ano)
- Consequencia: cliente sempre escolhe o menor periodo; sem incentivo para ascensao
- Fonte: Doug (Niveis de Acesso)
- Fix: nivelar por stack de entrega e velocidade de resultado, nao por tempo

## Recorrentes (degradam ao longo do tempo)

**AP-04 | Upsell agressivo antes da primeira entrega**
- Sinal: oferta de produto adicional feita imediatamente apos compra, sem o cliente ter consumido o produto base
- Consequencia: arrependimento de compra, aumento de chargeback, desconfianca na marca
- Fonte: Hormozi (primeira vitoria antes de upsell), Brunson (sequencia correta no funil)
- Fix: garantir primeira vitoria rapida com o produto base antes de qualquer upsell

**AP-05 | Escassez fabricada**
- Sinal: "vagas limitadas" ou "promocao termina hoje" sem criterio real verificavel
- Consequencia: destroi credibilidade quando cliente percebe o ciclo se repetindo
- Fonte: Hormozi, Doug (escassez deve ser estrutural)
- Fix: criar escassez real — vagas limitadas por capacidade operacional real, janela de preco real atrelada ao criterio de demanda (Haynes)
