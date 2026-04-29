---
expert: "Matheus Bressan"
domain: traffic-ads
source: ["Do Zero aos 1000 USD (ZDM Prime)", "Como Vender Low Ticket em Dolar em outras Linguas"]
format: dna-v3
elements: 35
date: 2026-04-14
---

## L1 Filosofias
- Modele o que ja funciona em vez de criar do zero — taxa de acerto modelando e muito superior a criacao; grandes empresas tem mais volume de modelagem do que criacao original
- Venda fora do Brasil: mercados estrangeiros tem menos concorrencia, CPC mais barato e conversao mais simples que o mercado brasileiro saturado
- A oferta e o negocio — se o funil for bom, criativo mediano vende; se for ruim, nem o melhor criativo salva
- Nao se apaixone por oferta ruim — dados decidem, nao esperanca; oferta sensivel a qualquer mudanca de orcamento e oferta ruim
- Escalar e consequencia — so escala quem tem criativo validado + oferta boa + upsell + tracking avancado: esses sao pre-requisitos, nao opcionais
- Nunca duplique campanha para escalar — duplicacao com mesmo criativo fragmenta o aprendizado do algoritmo; toda escala e vertical dentro de 1 campanha

## L2 Modelos Mentais
- **Leilao do Facebook**: quem coloca mais dinheiro leva os melhores clientes — modelar para o mesmo idioma e competir com quem ja esta escalado e tem mais budget; levar para outro idioma e competir em mercado virgem sem concorrencia escalada
- **Fogueira dos Criativos**: campanha de escala e uma fogueira que precisa de lenha nova (criativos validados) constantemente — sem novos criativos, a escala apaga naturalmente mesmo com produto bom
- **Vendas Faceis vs Convencimento**: Facebook entrega conversoes faceis primeiro — vende nos primeiros dias e para = oferta nao convence quem esta frio, so pegou quem ja queria comprar
- **Oferta Sensivel**: oferta ruim e hipersensivel — para de vender ao menor aumento de orcamento ou com o passar dos dias; oferta boa aguenta variacoes de orcamento sem quebrar
- **Validacao por ROI, nao por Vendas**: uma venda nao valida um criativo — ROI < 1.0 significa prejuizo independentemente do numero de vendas; o que importa e o retorno sobre investimento

## L3 Heuristicas
- ROI minimo 2.0 para considerar criativo validado com orcamento baixo (R$10-25/dia); ROI 1.8 e o minimo absoluto para campanha de escala
- Deixar minimo 3 dias + gastar 1 comissao inteira por criativo antes de qualquer analise — antes disso os dados sao insuficientes
- Orcamento ideal de teste: R$25/criativo/dia (= meia comissao) para ter dados confiaveis com custo controlado
- 5 criativos validados com 5-10 vendas cada = pre-escala pronta (25-50 vendas totais no produto principal)
- Aumentar orcamento maximo 30% a cada 2 horas — acima disso destroi o aprendizado do algoritmo e a campanha volta para fase de aprendizado
- Hook rate minimo 50% — abaixo disso criar variacoes de gancho antes de criar novos criativos do zero
- Apos 10 criativos diferentes sem ROI >= 2.0 — oferta esta ruim; parte para a proxima sem hesitar
- Campanha de escala permanece com ROI >= 1.5 — abaixo desse piso, reducao progressiva de orcamento (mesma logica inversa do aumento de 30%)

## L4 Frameworks
- **Teste de Criativo**: subir 5 criativos (R$10-25/dia cada) → deixar 3 dias + gastar 1 comissao → analisar ROI → pausar perdedores (ROI < 1.6) → aumentar campeao → fazer variacoes de gancho nos vencedores
  - `USE:` toda oferta nova — primeira campanha valida criativo + oferta simultaneamente; nao ha outra opcao para oferta do zero
  - `FAIL:` pausar criativo que vendeu mas deu prejuizo — "mas ele vendeu" e a armadilha classica; ROI < 1.0 com vendas = prejuizo real; **Fix:** criterio e sempre ROI, nunca volume de vendas isolado
  - `VS:` Hard Copy usa Fase 1 com R$50/dia × 3 adsets × 9 criativos; Bressan usa R$10-25/dia × 5 criativos — Bressan e acessivel para iniciante com orcamento limitado; Hard Copy e mais rapido para quem tem budget maior
- **Escala 1 Campanha CBO**: juntar todos criativos validados em CBO 11x → orcamento inicial = n criativos × 1 comissao → deixar 1 dia quieto → aumentar 30% a cada 2h se ROI > 1.8 → manter ate plato ROI 1.5 → alimentar com novos criativos validados
  - `USE:` apos pre-escala completa (5 criativos validados + upsell + tracking avancado) — nunca antes; e a ultima etapa
  - `FAIL:` escalar sem upsell → ROI que estava 1.8 cai para 1.2 ao aumentar orcamento → inicia prejuizo → abandona a escala prematuramente; **Fix:** funil de upsell montado e funcionando e pre-requisito absoluto
  - `VS:` outros ensinam duplicar campanha para escalar; Bressan usa 1 campanha vertical — 1 campanha retém o aprendizado acumulado do algoritmo; duplicacao fragmenta dado e desperdiça inteligencia gerada
- **Variacao de Gancho**: pegar criativo que vendeu → trocar so os primeiros 3-4 segundos → manter toda a comunicacao principal → subir dentro do mesmo adset → Facebook distribui budget para o melhor automaticamente
  - `USE:` sempre que criativo validado tiver hook rate < 50% — hook fraco com corpo bom e a melhor oportunidade de criar novos criativos rapidamente
  - `FAIL:` fazer variacao de gancho em criativo que nao vendeu → se o corpo nao convence, mais pessoas entrando pelo gancho apenas aumentam o custo; **Fix:** variacao de gancho so em criativo que ja vendeu
  - `VS:` Hard Copy isola hooks na Creative Testing Matrix; Bressan reutiliza ganchos entre criativos por reaproveitamento — Bressan e mais iterativo e rapido; Hard Copy e mais sistematico e cientifico

## L5 Metodologias
- **Modelagem Cultural para Outro Idioma**: espionar biblioteca de anuncios FB com filtro ativo >1 semana → identificar oferta PT-BR com quiz+VSL em nicho grande (emagrecimento/relacionamento/disfuncao eretil) → verificar se o link do anuncio bate com o link real (sem cloaker) → nunca modelar para o mesmo idioma → traduzir copy + criar avatar IA + lipsync → subir em espanhol/outro idioma sem concorrencia local
- **Pre-Escala Obrigatoria**: 5 criativos validados (5-10 vendas cada, ROI >= 1.8) + melhorar entregavel para reduzir reembolso + funil de 2 upsells + 1 downsell montado + tracking avancado server-side (GTM + GA4 + webhook) → so entao comecar escala na campanha CBO unica

## Anti-Patterns
- **Duplicar Campanha para Escalar**: winner com bom ROI → duplicar campanha com mesmo criativo → algoritmo entra em fase de aprendizado novamente → ROI instavel → fragmentacao de budget → **Fix:** escala e sempre vertical dentro de 1 campanha; nunca duplicar com o mesmo criativo
- **Apaixonar por Oferta Meia-Boca**: vende pingado, gera esperanca, continua gastando em testes → tempo e dinheiro perdidos → **Fix:** 10 criativos diferentes sem ROI 2.0 = oferta ruim; definir esse limite antes de comecar e essencial para nao se iludir
- **Analisar Metricas Irrelevantes Primeiro**: CTR alto, custo por clique baixo, finalicoes de compra — mas sem ROI positivo → nao importa nada antes de verificar ROI; metricas intermediarias so servem para diagnosticar *por que* o ROI esta ruim, nao para validar o criativo

## Situation Map
| Situacao | Framework | Sinal de Alerta |
|----------|-----------|-----------------|
| Testar nova oferta do zero | Teste de Criativo: 5 criativos, R$10-25/dia, 3 dias minimo + 1 comissao | Analisar antes de 3 dias = dados insuficientes = decisao errada |
| Criativo vendeu mas hook rate < 50% | Variacao de Gancho: trocar so os primeiros 3-4s, manter corpo | Fazer variacao de gancho em criativo que nao vendeu = inutil |
| Oferta vende com R$10 mas para com R$25 | Diagnostico de Oferta Ruim: oferta sensivel = oferta ruim, parte para proxima | Achar que e problema de estrutura de trafego = diagnostico errado |
| Pronto para escalar | Escala 1 Campanha CBO: so apos 5 criativos + upsell + tracking | Escalar sem upsell = ROI colapsa com aumento de orcamento |
