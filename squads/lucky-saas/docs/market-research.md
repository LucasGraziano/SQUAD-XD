# Market Research Report: Premia

**Versão:** 1.0 (em elaboração)
**Data:** 2026-05-11
**Analista:** Atlas (@analyst)
**Status:** Rascunho — seções 1–4 completas, 5–7 em andamento

> **Como usar este documento:** Cada seção inclui um bloco `> 💡 Implicações para o Produto` com insights acionáveis diretos para roadmap, copy e estratégia. Este relatório é vivo — atualizar à medida que novos dados de uso aparecerem.

---

## Sumário Executivo

O Premia opera num mercado de **R$123M/ano de TAM** (106.000 corretores SUSEP × R$97 ARPU médio), com SAM acessível de **R$17,2M/ano** e SOM realista de **R$582k–1,75M ARR em 18 meses** dependendo do GTM.

**O mercado está mal-atendido e o timing é favorável.** Nenhum concorrente ocupa o quadrante estratégico do Premia — simples, acessível, lógica de seguros nativa, multicarrier. O maior concorrente ainda é o Excel. A janela de dominância é de 18–36 meses antes de players com mais recursos perceberem a oportunidade.

**O produto está pronto. O desafio agora é distribuição.**

O Premia implementou paridade ou superioridade de features em relação a todos os concorrentes relevantes (Quiver, SegPolicy, BrokerOne). O gap mais crítico é assinatura digital via ZapSign (já no stack). O risco número um não é produto — é descoberta.

**Três insights que devem mudar a estratégia imediatamente:**

1. **O job emocional "paz de espírito" é o argumento de venda mais poderoso e o mais subutilizado.** O corretor individual opera com altíssima carga mental. O copy deve ser "pare de carregar a carteira inteira na cabeça", não "aumente sua eficiência".

2. **O substituto mais perigoso não é o Quiver — é o assistente administrativo.** Framing subutilizado: "R$97/mês vs. R$2.000/mês de assistente — e o Premia não tira férias". Corretores com secretária são na verdade clientes melhores (usam o sistema para estruturar o trabalho do assistente).

3. **A importação CSV é a feature de maior impacto no negócio.** Não pelo que faz, mas pelo que desbloqueia: o momento "aha" do trial deve acontecer em < 15 minutos. O KPI #1 de onboarding é % de trials que importam CSV nos primeiros 30 minutos.

**Sequência de prioridades para os próximos 6 meses:**
1. Programa de indicação ativo antes de qualquer investimento em ads
2. Campanha de migração Quiver ("importe em 15 minutos")
3. Assinatura digital ZapSign (P0 de produto)
4. Calculadora de ROI no site ("uma renovação salva = 12 meses pagos")
5. Primeira aproximação ao SINCOR-SP

**SAM Fase 2 desbloqueado:** Quando o Premia tiver multi-usuário robusto + relatórios por produtor, o SAM se expande em +R$38M ao incluir micro-corretoras (5–20 pessoas) — mais que dobrando o mercado acessível sem mudar o produto radicalmente.

---

## 1. Objetivos da Pesquisa & Metodologia

### 1.1 Objetivos

Esta pesquisa informa 5 decisões concretas de negócio:

1. **Priorização de roadmap** — quais features têm maior impacto percebido no mercado
2. **Validação de pricing** — os tiers R$47/R$97/R$197 vs. benchmarks de mercado e disposição a pagar real
3. **Go-to-market** — canais de aquisição com melhor ROI para corretores SUSEP
4. **Posicionamento** — onde o Premia se situa vs. BrokerOne, Quiver, SegPolicy e CRMs genéricos
5. **TAM/SAM/SOM refinado** — atualizar os números do project-brief com premissas mais conservadoras e defensáveis

### 1.2 Perguntas Específicas

- Qual % dos ~100k corretores SUSEP já usa algum software dedicado de gestão?
- Qual é o churn típico em SaaS vertical B2B para pequenos negócios no Brasil?
- Quais são os critérios de decisão de compra do corretor individual?
- Qual feature gera mais retenção nos concorrentes diretos?

### 1.3 Critérios de Sucesso

- Identificar pelo menos 3 oportunidades concretas de posicionamento diferenciado
- Validar (ou revisar) o SOM de R$1,78M ARR em 18 meses
- Mapear pelo menos 2 ameaças não óbvias ao modelo atual

### 1.4 Metodologia

- **Fontes primárias:** Observação do BrokerOne (principal referência), entrevistas informais com corretores via Instagram/WhatsApp
- **Fontes secundárias:** Dados SUSEP 2024, relatórios setoriais CNseg, análise de concorrentes via produto + pricing público
- **Frameworks aplicados:** TAM/SAM/SOM (bottom-up), Porter's Five Forces, Jobs-to-be-Done, Customer Journey
- **Limitações:** Ausência de pesquisa quantitativa formal com amostra representativa — os dados de penetração de SaaS no segmento são estimativas. Validar com primeiros 50 clientes pagantes.

---

## 2. Visão Geral do Mercado

### 2.1 Definição do Mercado

**Categoria:** Software vertical B2B (SaaS) para gestão operacional de corretores de seguros

**Escopo geográfico:** Brasil — Fase 1. LATAM (México, Colômbia) — Fase 3+

**Segmentos incluídos:**
- Corretores pessoa física registrados na SUSEP (autônomos)
- Micro-corretoras com 1–5 colaboradores, faturamento < R$500k/ano
- Corretores vinculados a bancos/financeiras em transição para independência

**Posição na cadeia de valor:**
```
Seguradora → Corretor → Cliente Final
                ↑
            [Premia atua aqui]
            (orquestra a operação do corretor)
```

O Premia não intermedita a venda — orquestra a operação: pipeline, apólices, comissões, comunicação, financeiro.

> 💡 **Implicação para o Produto:** O posicionamento correto não é "CRM para corretores" (muito genérico) nem "sistema de apólices" (muito limitado). É **"sistema operacional do corretor"** — tudo que acontece entre o cliente assinar e a apólice vencer. Esse framing diferencia de CRMs horizontais e de sistemas de emissão das seguradoras ao mesmo tempo.

---

### 2.2 Tamanho de Mercado

**Premissas:**
- SUSEP 2024: ~106.000 corretores pessoas físicas ativos
- Crescimento histórico: ~5% a.a.
- Penetração estimada de SaaS dedicado no segmento: 8–12%
- ARPU médio de mercado (ferramentas similares): R$150–350/mês

#### TAM — Total Addressable Market
Todos os corretores SUSEP × ARPU médio do plano âncora (Profissional R$97):

**106.000 × R$97 × 12 = R$123M/ano**

> ⚠️ O project-brief usava R$476M/ano com ARPU de R$397 (tier mais alto). A revisão conservadora usa o tier de maior volume esperado. O TAM de R$476M permanece válido como teto teórico, mas para planejamento operacional usar R$123M.

#### SAM — Serviceable Addressable Market
Corretores individuais/micro-corretoras com carteira 50–500 clientes, digitalmente receptíveis:

- ~35% do total no perfil-alvo = 37.100 corretores
- ~40% desses são "SaaS-receptíveis" = **14.800 corretores**

**14.800 × R$97 × 12 = R$17,2M/ano**

**Expansão Fase 2 (corretoras médias 5–20 pessoas):**
- ~8.000 corretoras médias no mercado brasileiro
- Desbloqueadas quando o Premia tiver multi-usuário + relatórios por produtor
- SAM ampliado: +R$8.000 × R$397 × 12 = +R$38M → **SAM total Fase 2: R$55M/ano**

> 💡 **Por que excluir corretoras médias agora:** (1) Exigem multi-usuário com permissões granulares — escopo 40–60% maior. (2) Já usam Quiver/SegPolicy — custo de switching alto. (3) Requerem outbound sales, incompatível com GTM self-service atual. A exclusão é de **sequência**, não de mercado — corretoras médias são o Fase 2 natural quando clientes individuais crescem com o produto.

#### SOM — Serviceable Obtainable Market (18 meses)

| Cenário | Corretores pagantes | ARR |
|---------|---------------------|-----|
| Conservador (GTM orgânico) | 500 | **R$582k** |
| Base (orgânico + ads) | 900 | **R$1,05M** |
| Otimista (parceria SINCOR) | 1.500 | **R$1,75M** |

> 💡 **Implicação para o Produto:** O cenário otimista (1.500 corretores) requer um canal diferente — parceria com SINCOR estadual ou programa de co-marketing com seguradoras (ex: Porto Seguro oferece Premia como benefício para sua rede). Isso precisa virar uma iniciativa de BD paralela ao GTM orgânico a partir do mês 6.

---

## 3. Tendências de Mercado & Drivers

### 3.1 Tendências Principais

#### T1 — Digitalização Forçada Pós-Pandemia *(impacto: alto)*
A pandemia acelerou em ~5 anos a adoção de ferramentas digitais por profissionais liberais. Corretores que não se digitalizaram perderam carteira para concorrentes que mantiveram contato remoto. O mercado já foi educado sobre "por que digitalizar" — o Premia não precisa vender esse conceito, só o "por que eu".

> 💡 **Implicação para o Produto:** O copy não deve começar em "você precisa se digitalizar". Deve começar em "você já sabe que precisa — aqui está a ferramenta certa para corretor". Evitar tom educativo/evangelizador.

#### T2 — Crescimento Estrutural do Mercado de Seguros *(impacto: alto)*
O setor cresceu 15,4% em 2023 (SUSEP), superando o PIB consistentemente. Penetração de seguros no Brasil ainda é 3,8% do PIB vs. 8–12% em mercados maduros. Mais apólices = mais operação para o corretor = dor que só cresce.

> 💡 **Implicação para o Produto:** Feature de multi-ramo é obrigatória — o corretor que hoje só faz Auto vai expandir para Vida e Saúde conforme o mercado cresce. O Premia deve ser o sistema que cresce junto com a carteira do corretor, não só com o mercado atual dele.

#### T3 — SaaS Vertical Ganhando vs. CRM Horizontal *(impacto: alto)*
Toast (restaurantes), Procore (construção), Veeva (farmacêutico) no exterior. Omie (contabilidade), Doctoralia (saúde), Sienge (construção) no Brasil. O padrão se repete: vertical especializado bate horizontal genérico quando a dor é específica o suficiente.

> 💡 **Implicação para o Produto:** O diferencial "feito por corretor para corretor" não é só slogan — é arquitetura. Vigências, ramos, SUSEP, comissão por apólice: esses conceitos devem ser first-class citizens no produto, não adaptações de um CRM genérico. Cada vez que o Premia precisar de um "workaround" para modelar um conceito de seguros, é um signal de dívida técnica de posicionamento.

#### T4 — Pressão Regulatória SUSEP/LGPD *(impacto: médio, subestimado)*
SUSEP exige rastreabilidade de operações. LGPD impõe consentimento e auditoria de dados de clientes. Corretores em Excel não conseguem demonstrar compliance. Seguradoras parceiras começam a exigir compliance dos corretores credenciados.

> 💡 **Implicação para o Produto:** Ângulo de venda subestimado: o Premia como ferramenta de **compliance regulatório**, não só produtividade. "Sua corretora em conformidade com SUSEP e LGPD em 1 dia." Isso muda o interlocutor — não é só o corretor que decide, mas o contador/advogado que orienta ele. Feature futura: relatório de compliance exportável para auditoria.

#### T5 — WhatsApp Business API como Canal de Distribuição *(impacto: médio)*
Corretores já vivem no WhatsApp. A API permite integrar comunicação com o sistema de gestão — alertas automáticos de renovação, confirmações, propostas via chat.

> 💡 **Implicação para o Produto:** Feature do plano Equipe (R$197), mas pode ser o driver de upgrade mais poderoso. Testar como add-on R$29/mês no plano Profissional antes de incluir no plano Equipe — pode ser a feature que move um corretor de R$97 para R$126 sem mudar de tier.

---

### 3.2 Drivers de Crescimento

1. **Crescimento orgânico da carteira:** Cada corretor que passa de 200 clientes sente a dor exponencialmente — o produto se vende pela dor, não pelo marketing
2. **Indicação entre corretores:** Mercado altamente relacional (grupos WhatsApp, SINCOR) — NPS alto + programa de indicação = CAC tendendo a zero
3. **Abandono de sistemas legados:** Quiver e similares têm UX dos anos 2000 — qualquer produto moderno vence no benchmark de experiência
4. **Trial sem atrito:** 14 dias sem cartão remove a principal objeção do corretor individual

### 3.3 Inibidores de Mercado

| Inibidor | Impacto | Mitigação atual | Gap |
|----------|---------|-----------------|-----|
| Resistência cultural à mudança (50+ anos, Excel há 20 anos) | Alto | Importação CSV | Onboarding assistido via vídeo/chat |
| Sensibilidade ao preço ("R$97 é caro para software") | Médio | Trial 14 dias, framing de ROI | Calculadora de ROI interativa no site |
| Conectividade limitada no interior | Baixo-Médio | — | PWA com modo offline (roadmap) |
| Pulverização do mercado (sem canal centralizado) | Alto | — | Parcerias SINCOR/seguradoras |

---

## 4. Análise de Clientes

### 4.1 Perfis de Segmento

---

#### Segmento 1: O Corretor Analógico em Transição *(ICP prioritário)*

- **Descrição:** Corretor com 8–20 anos de mercado, carteira de 150–400 clientes construída por relacionamento. Opera hoje em Excel + WhatsApp + memória. Começou a perder renovações e sente que está no limite do que consegue gerenciar sozinho.
- **Tamanho estimado:** ~18.000 corretores no SAM
- **Perfil:** 38–52 anos, majoritariamente masculino, cidades médias e grandes. Ramos principal: Auto e Vida. Não é tech-first mas usa smartphone ativamente. Renda mensal R$6k–18k.
- **Dores principais:**
  - "Não sei quais clientes vencem esse mês sem abrir 3 planilhas"
  - "Perdi uma renovação e nem sabia que tinha vencido"
  - "Não consigo fazer cross-sell porque não tenho visibilidade da carteira"
- **Processo de compra:** Descobre via indicação de colega ou grupo WhatsApp. Precisa de trial antes de decidir. Decisão em 1–3 semanas. Avesso a compromisso anual antecipado.
- **Disposição a pagar:** R$97–197/mês se o ROI for demonstrado com clareza ("uma renovação salva = 12 meses pagos")

> 💡 **Implicação para o Produto:** Este segmento decide pelo **alívio de dor imediato**, não por features. O onboarding deve mostrar "aqui estão os 7 clientes que vencem nos próximos 30 dias" nos primeiros 5 minutos — antes do corretor precisar cadastrar qualquer coisa. A importação CSV deve ser o step 1 do onboarding, não opcional.

---

#### Segmento 2: O Corretor Jovem Nativo Digital *(persona de crescimento)*

- **Descrição:** Corretor com 1–5 anos de mercado, montando carteira do zero. Já usa Instagram para prospecção, entende de ferramentas digitais, mas não tem budget para sistemas caros. Quer crescer rápido e parecer profissional.
- **Tamanho estimado:** ~10.000 corretores no SAM
- **Perfil:** 25–35 anos, cidades com internet estável, multi-ramo. Compara o Premia com Notion, Trello, CRMs que já conhece.
- **Dores principais:**
  - "Quero parecer profissional para o cliente, não mandar PDF no WhatsApp"
  - "Preciso de um portal para o cliente ver as apólices sem me ligar"
  - "Quero automatizar os lembretes de renovação mas não sei programar"
- **Disposição a pagar:** R$47–97/mês. Sensível ao preço mas converte bem com trial self-service.

> 💡 **Implicação para o Produto:** Este segmento compra pela **imagem profissional**, não pela dor de gestão (ainda não tem 200 clientes para sentir a dor). O Portal do Cliente (link personalizado, PDF de proposta com logo) é o diferencial decisivo aqui — não os alertas de vencimento. Considerar posicionar o tier Solo (R$47) explicitamente como "para quem está começando".

---

#### Segmento 3: O Gestor de Micro-Corretora *(Fase 2 — expansão)*

- **Descrição:** Dono de corretora com 2–4 produtores, carteira consolidada de 500+ clientes, já usa algum sistema mas está insatisfeito com UX ou preço. Precisa de multi-usuário e visibilidade por produtor.
- **Tamanho estimado:** ~6.000 no mercado, ~2.000 acessíveis no SAM Fase 2
- **Dores principais:**
  - "Não sei o desempenho de cada produtor sem fazer planilha manual"
  - "O sistema atual (Quiver) é caro, feio e o suporte é horrível"
  - "Precisamos de algo mais profissional para apresentar para seguradoras parceiras"
- **Disposição a pagar:** R$197–397/mês. Menos sensível ao preço, mais sensível à estabilidade e suporte.

> 💡 **Implicação para o Produto:** Gatilho de entrada neste segmento: relatório de desempenho por produtor (Story 5.16 já implementada) + multi-usuário (plano Equipe). O upgrade do Segmento 1 para Segmento 3 acontece naturalmente — o corretor individual contrata um assistente e de repente precisa do plano Equipe. Monitorar esse padrão nos primeiros clientes.

---

### 4.2 Jobs-to-be-Done

#### Jobs Funcionais *(o que o corretor precisa fazer)*
- Nunca perder uma renovação por falta de aviso com antecedência suficiente
- Saber exatamente quanto vai receber de comissão antes do mês acabar
- Identificar clientes com lacunas de proteção para oferecer cross-sell sem esforço de pesquisa
- Gerar e enviar propostas de forma profissional (PDF com logo, portal online)
- Responder dúvidas do cliente sem precisar abrir 5 planilhas diferentes

#### Jobs Emocionais *(como o corretor quer se sentir)*
- **Controle:** "Estou no controle da carteira, não correndo atrás dela"
- **Profissionalismo:** "Sou um corretor moderno, não um cara com caderno"
- **Segurança financeira:** "Sei que o negócio está saudável antes de o mês acabar"
- **Paz de espírito:** "Não fico ansioso pensando 'o que estou esquecendo?'"

#### Jobs Sociais *(como o corretor quer ser percebido)*
- Ser visto pelos clientes como corretor organizado e proativo — não reativo
- Ser referência entre colegas por usar tecnologia de ponta
- Parecer uma corretora "de verdade" mesmo operando solo

> 💡 **Implicação para Copy e Produto:** O job emocional **"paz de espírito / reduzir ansiedade"** é o mais poderoso e o mais subestimado no copy atual. O corretor individual opera com altíssima carga mental — múltiplas seguradoras, ramos, vencimentos, clientes. O Premia não é só produtividade: é **tranquilidade operacional**. Headline sugerida: *"Pare de carregar a sua carteira inteira na cabeça."* O job social "parecer profissional" é o driver principal do Segmento 2 e da feature Portal do Cliente.

---

### 4.3 Jornada do Cliente — Segmento 1 (ICP)

| Etapa | O que acontece | Oportunidade / Risco |
|-------|---------------|---------------------|
| **Descoberta** | Colega menciona o Premia num grupo WhatsApp ou Instagram | Canal principal = indicação. Investir no programa de referral antes de ads. |
| **Consideração** | Compara com Excel atual e talvez Quiver. Critérios: facilidade de migração, preço, "parece fácil" | Site deve ter demo em vídeo de < 2 min mostrando importação CSV → alertas aparecendo |
| **Decisão (trial)** | Clica em "teste grátis", cria conta, entra no produto | ⚠️ Friction point: se não ver valor em 30 min, abandona o trial |
| **Momento "aha"** | Importa planilha CSV → vê os alertas de vencimento dos próximos 30 dias aparecerem | Este é o KPI #1 do onboarding. Tempo até o "aha" deve ser < 15 min |
| **Conversão** | Passa o cartão após ver o produto funcionando com os dados reais dele | Oferecer desconto de 20% no primeiro mês para remover última objeção |
| **Uso contínuo** | Verifica alertas diariamente, relatórios financeiros semanalmente | Feature mais usada no mês 1: alertas. Mês 3+: financeiro. Mês 6+: relatórios |
| **Churn risk** | Se o trial não capturou os dados reais ou se o produto bugou durante onboarding | Monitorar "trial sem importação CSV" como proxy de risco de não-conversão |
| **Advocacia** | Salva a primeira renovação que teria perdido → conta para colega corretor | Momento "aha" de advocacy é mensurável. Pedir NPS e testemunho logo após esse evento. |

> 💡 **Implicação para o Produto:** A importação CSV é a feature de maior impacto no negócio — não pelo que faz, mas pelo que desbloqueia (o "aha" moment). Qualquer bug ou limitação no parser de CSV (Story 5.15) deve ser tratado como P0. O KPI de onboarding a monitorar: % de trials que importam CSV nos primeiros 30 min.

---

## 5. Landscape Competitivo

### 5.1 Estrutura do Mercado

O mercado de software para corretores de seguros no Brasil é **fragmentado e imaturo**:
- Nenhum player tem dominância clara no segmento de corretor individual
- Os sistemas existentes foram construídos para corretoras médias/grandes e adaptados "para baixo"
- CRMs genéricos preenchem o vazio mas sem lógica de seguros nativa
- Intensidade competitiva: **baixa a média** — o maior concorrente ainda é o Excel

---

### 5.2 Análise dos Principais Concorrentes

#### 🔵 BrokerOne *(referência técnica)*

- **Pontos fortes:** Dashboard robusto com KPIs, módulo de propostas, email marketing integrado, gestão de pendências, relatório de desempenho operacional
- **Pontos fracos:** UX pesada, curva de aprendizado alta, provavelmente fora do range de preço do corretor individual
- **Posicionamento:** Corretoras médias/grandes
- **Pricing estimado:** R$300–800+/mês

> 💡 **Implicação para o Produto:** BrokerOne é o "norte de features" — o Premia já implementou ou tem no roadmap a maior parte. A vantagem está na **simplicidade de onboarding** e no **preço acessível**, não em superar em features brutas.

---

#### 🟡 Quiver *(concorrente direto mais citado)*

- **Pontos fortes:** Reconhecimento de marca, cobre o básico (apólices, alertas, relatórios simples), integração com algumas seguradoras
- **Pontos fracos:** Interface datada (anos 2000–2010), suporte precário, sem pipeline de leads/CRM, sem portal do cliente, sem mobile funcional, pricing pouco transparente
- **Posicionamento:** Corretores com carteira consolidada que nunca migraram
- **Pricing estimado:** R$150–400/mês

> 💡 **Implicação para o Produto:** Quiver é o **alvo de migração mais fácil**. Corretores insatisfeitos mas com medo de perder dados históricos. Feature prioritária de aquisição: **"importe do Quiver em 15 minutos"** (via CSV exportado do Quiver). Potencial de campanha de conquista direta.

---

#### 🟠 SegPolicy *(concorrente nicho)*

- **Pontos fortes:** Foco em conformidade e rastreabilidade (ângulo regulatório), módulos de sinistro desenvolvidos
- **Pontos fracos:** Sem CRM/pipeline, interface técnica, pouca presença digital, preço elevado para individual
- **Posicionamento:** Corretoras médias preocupadas com compliance

> 💡 **Implicação para o Produto:** SegPolicy venceu no compliance mas perdeu na usabilidade. O Premia pode combinar interface moderna + argumentação SUSEP/LGPD — dominando quem hoje escolhe entre "bonito ou conforme".

---

#### 🔴 Portais das Seguradoras *(pseudo-concorrente)*

- **Pontos fortes:** Custo zero, integração nativa com os produtos da seguradora
- **Pontos fracos:** Monosseguradora — não funciona como visão consolidada; corretor com 3–5 seguradoras precisa de 3–5 sistemas; sem CRM, sem financeiro consolidado

> 💡 **Implicação para o Produto:** Oportunidade de **parceria estratégica** — propor integração com portais de seguradoras (Porto, Bradesco, SulAmérica). O Premia agrega tudo numa visão única. Modelo Toast/processadoras: seguradoras ganham, corretor ganha, Premia ganha canal de distribuição.

---

#### ⚫ CRMs Genéricos — HubSpot / RD Station / Pipedrive *(substitutos)*

- **Pontos fortes:** Interface moderna, ecossistema rico, reconhecimento de marca
- **Pontos fracos:** Sem lógica nativa de seguros (apólice, vigência, ramo, comissão), corretor precisa "hackear" o CRM, sem alertas de vencimento por vigência, sem forecast de comissão, HubSpot Starter R$450+/mês
- **Posicionamento:** Corretores jovens com afinidade digital sem alternativa melhor

> 💡 **Implicação para o Produto:** Corretor que usa HubSpot é o **lead mais qualificado** — já paga por software e já entende o valor de CRM. Criar conteúdo direcionado: "Por que o HubSpot não funciona para corretor de seguros" + campanha de migração com comparativo de preço.

---

### 5.3 Mapa de Posicionamento

```
                    ALTO PREÇO
                        │
         SegPolicy      │    Portais
         (compliance)   │    Seguradoras
                        │    (mono-carrier)
 COMPLEXO ──────────────┼──────────────── SIMPLES
         Quiver         │
         (legado)       │    ✅ PREMIA
                        │    (multicarrier +
         HubSpot/RD     │     simples + acessível)
         (genérico)     │
                        │
                    BAIXO PREÇO
```

**A brecha que o Premia ocupa:** Simples + acessível + lógica de seguros nativa + multicarrier. Nenhum concorrente atual ocupa esse quadrante.

---

### 5.4 Comparativo de Features

| Feature | Premia | Quiver | BrokerOne | HubSpot | SegPolicy |
|---------|--------|--------|-----------|---------|-----------|
| Pipeline de leads / CRM | ✅ | ❌ | ✅ | ✅ | ❌ |
| Gestão de apólices multicarrier | ✅ | ✅ | ✅ | ❌ | ✅ |
| Alertas de vencimento automáticos | ✅ | ✅ | ✅ | ❌ | ✅ |
| Portal do cliente | ✅ | ❌ | ? | ❌ | ❌ |
| Forecast de comissão | ✅ | ✅ | ✅ | ❌ | ✅ |
| Email marketing de renovações | ✅ | ❌ | ✅ | ✅ (add-on) | ❌ |
| Importação CSV em massa | ✅ | ? | ? | ✅ | ? |
| Relatório de desempenho | ✅ | ❌ | ✅ | ✅ | ❌ |
| Interface moderna / mobile-first | ✅ | ❌ | ? | ✅ | ❌ |
| Preço para corretor individual | ✅ R$47+ | ⚠️ R$150+ | ❌ | ❌ R$450+ | ❌ |

> 💡 **Implicação para o Produto:** O Premia já tem paridade ou superioridade em praticamente todas as dimensões relevantes. O risco não é de features — é de **distribuição e descoberta**. O melhor produto nem sempre ganha. A prioridade agora deve ser GTM, não mais features.

---

### 5.5 Gaps do Premia vs. Concorrentes

Análise honesta dos gaps reais identificados — o que os concorrentes têm que o Premia ainda não tem:

| Gap | Impacto | Complexidade | Prioridade |
|-----|---------|--------------|------------|
| Assinatura digital (ZapSign — já no stack) | Alto | Baixa | **P0 — Epic 6** |
| PWA com notificações push nativas | Médio | Média | **P1 — Epic 6** |
| Multicálculo automático (API seguradoras) | Alto | Muito alta | **P2 — via parceria** |
| Integração contábil (Omie / Conta Azul) | Médio | Média | **P2 — após 300 clientes** |
| Multicorretagem / rede de vinculados | Médio | Alta | **Fase 2 — Enterprise** |

**Gap 1 — Assinatura Digital:** ZapSign já está previsto no stack mas não implementado. Fecha o ciclo proposta→assinatura dentro do Premia sem fricção — o cliente assina no portal sem sair do sistema. Alta prioridade.

**Gap 2 — App / PWA:** Interface é responsiva mas sem notificações push nativas. PWA resolve 80% do problema antes de um app nativo completo. O corretor em visita presencial precisa de notificações confiáveis.

**Gap 3 — Multicálculo automático:** Cotação simultânea em múltiplas seguradoras via API. Gap mais impactante mas mais complexo — APIs proprietárias, parcerias formais, 6–18 meses. Avaliar parceria com agregadores (ex: Thinkseg, Thinksurance) antes de construir internamente.

**Gap 4 — Integração contábil:** Corretor PJ precisa lançar comissões no Omie/Conta Azul. O export CSV (Story 5.17) resolve parcialmente. Integração via API é feature de retenção de médio prazo — o corretor que integra o Premia com o contador fica para sempre.

**Gap 5 — Multicorretagem:** Escritório "mãe" com múltiplos corretores vinculados, cada um com carteira isolada. Modelo Enterprise natural — não é o ICP atual.

> 💡 **Implicação para o Produto:** O gap mais acionável imediatamente é a **assinatura digital via ZapSign** — está no stack planejado, tem alta percepção de valor, e complementa diretamente o Portal do Cliente já implementado. Priorizar como primeira story do Epic 6.

---

## 6. Análise da Indústria (Porter's Five Forces)

### ⚡ Poder dos Fornecedores — MÉDIO

**Fornecedores relevantes:** Supabase, Vercel, Resend, Stripe, ZapSign, APIs de seguradoras (futuro)

- Supabase, Vercel e Resend são commodities — poder de barganha baixo individualmente
- Stripe tem poder moderado no Brasil mas tem concorrentes (Pagar.me, Ebanx, Mercado Pago)
- **Risco real:** APIs das seguradoras para multicálculo — cada seguradora é fornecedor monopolista dos seus próprios dados. Poder de barganha: **alto** nesse segmento específico

> 💡 **Implicação para o Produto:** A dependência crítica não é de infraestrutura SaaS — é das **APIs proprietárias das seguradoras** para o multicálculo futuro. Construir multicálculo manual (Story 5.9) suficientemente robusto para não precisar das APIs no curto prazo. Quando negociar integrações, começar pelas maiores (Porto, Bradesco, SulAmérica).

---

### 👥 Poder dos Compradores — MÉDIO-BAIXO

- Compradores individuais com ticket pequeno (R$97/mês) — poder mínimo isoladamente
- Alta pulverização: 14.000+ corretores no SAM sem organização coletiva de compra
- Custo de switching **cresce com o tempo** — dados de 2–3 anos no sistema = lock-in natural
- Corretores têm baixa consciência de alternativas — não fazem benchmarking ativo

> 💡 **Implicação para o Produto:** O lock-in natural cresce com o tempo de uso. Isso significa que **os primeiros 90 dias são críticos** — se o corretor criar hábito diário, o churn cai drasticamente. Investir em onboarding e suporte ativo nos primeiros 3 meses de cada cliente.

---

### ⚔️ Rivalidade Competitiva — BAIXA-MÉDIA

- Mercado fragmentado, nenhum player com mais de ~5% do SAM
- Concorrentes principais (Quiver, SegPolicy) têm produto legado, sem capacidade de inovação rápida
- BrokerOne atende segmento diferente — não conflita diretamente no ticket
- Rivalidade tende a aumentar conforme o mercado se torna mais visível

> 💡 **Implicação para o Produto:** A janela de baixa rivalidade é limitada — estimativa de 18–36 meses. Usar esse tempo para construir dois moats: (1) **dados dos corretores** (lock-in) e (2) **marca na comunidade** (NPS + indicações = vantagem de distribuição que dinheiro não compra rapidamente).

---

### 🚪 Ameaça de Novos Entrantes — MÉDIA

**Barreiras existentes:** Conhecimento de domínio (lógica de seguros), relacionamento com comunidade, dados históricos dos clientes, 6–12 meses de desenvolvimento para MVP funcional

**Facilitadores de entrada:** Stack moderno acessível (Next.js + Supabase = custo baixo), mercado claramente mal-atendido atrai fundadores, VC brasileiro olhando para SaaS vertical B2B

**Risco:** Startup bem-financiada entra com produto similar e queima dinheiro em aquisição (freemium agressivo ou preço abaixo do custo)

> 💡 **Implicação para o Produto:** A maior barreira de entrada não é a tecnologia — é a **reputação na comunidade**. Um concorrente com mais dinheiro copia as features em 6 meses, mas não copia 500 corretores que confiam no produto e indicam ativamente. Investir em comunidade (grupo exclusivo, conteúdo educativo, presença no SINCOR) é construção de moat, não só marketing.

---

### 🔄 Ameaça de Substitutos — MÉDIA

**Substitutos reais:**
- Excel + WhatsApp + memória — custo zero, familiaridade máxima, o mais persistente
- Google Sheets customizado — corretor tech-savvy, baixo custo, alto esforço
- Sistemas internos das seguradoras — resolve parcialmente para mono-seguradora
- **Assistente administrativo** — R$1.500–2.500/mês vs. R$97/mês do Premia

**O substituto mais perigoso:** O assistente administrativo. Corretor com secretária não sente a dor operacional — pode não ver necessidade do sistema até a secretária sair.

> 💡 **Implicação para o Produto:** Argumento subutilizado no copy: *"R$97/mês vs. R$2.000/mês de assistente — e o Premia não tira férias, não falta, e não pede aumento."* Corretores que já têm assistente são na verdade **clientes melhores** — usam o sistema para supervisionar e estruturar o trabalho do assistente.

---

### 📊 Sumário Porter's Five Forces

| Força | Intensidade | Tendência | Implicação Principal |
|-------|------------|-----------|---------------------|
| Poder dos Fornecedores | Médio | Crescente | Evitar dependência de API proprietária no curto prazo |
| Poder dos Compradores | Médio-Baixo | Decrescente com lock-in | Onboarding ativo nos primeiros 90 dias é prioridade |
| Rivalidade Competitiva | Baixa-Média | Crescente | Janela de 18–36 meses — construir moat de comunidade |
| Ameaça de Novos Entrantes | Média | Crescente | Reputação na comunidade é barreira intransponível para imitadores |
| Ameaça de Substitutos | Média | Estável | Framing "R$97 vs. assistente de R$2.000" é argumento subutilizado |

**Conclusão:** O ambiente atual é favorável — a janela está aberta. O risco não é de concorrência imediata, mas de inércia: sem presença de marca e lock-in de dados nos próximos 18 meses, um entrante bem-financiado pode ocupar o espaço.

---

## 7. Avaliação de Oportunidades & Recomendações Estratégicas

### 7.1 Oportunidades Identificadas

**Oportunidade 1: Programa de Migração do Quiver**
- **Potencial:** ~3.000–5.000 corretores ativos no Quiver, insatisfação alta com UX e suporte
- **O que requer:** Landing page "Migre do Quiver em 15 minutos", importador CSV compatível com o export do Quiver, 2 meses de desconto para migrantes
- **Risco:** Quiver pode reagir com redução de preço ou melhoria emergencial de produto

**Oportunidade 2: Canal SINCOR Estadual**
- **Potencial:** SINCOR-SP tem ~25.000 corretores associados — acesso a 1/4 do SAM via um único canal
- **O que requer:** Reunião com diretoria, proposta de co-marketing (comissão ou desconto), evento de demonstração para associados
- **Risco:** Ciclo de venda longo com entidades associativas, burocracia

**Oportunidade 3: Compliance como Driver de Venda**
- **Potencial:** Abre interlocutores novos (contador do corretor, seguradoras parceiras que exigem compliance SUSEP/LGPD de sua rede)
- **O que requer:** Landing page com ângulo regulatório, relatório exportável de auditoria (feature simples), parceria com contadores especializados em corretores
- **Risco:** Argumentação de compliance exige rigor técnico — não pode ser promessa vaga

**Oportunidade 4: Expansão LATAM**
- **Potencial:** México (~80.000 agentes AMIS 2024) + Colômbia (~20.000) = TAM adicional R$150M+
- **Status:** Prematura — foco total no Brasil até 1.000 clientes pagantes

---

### 7.2 Recomendações Estratégicas

#### Go-to-Market — Sequência Recomendada

**Mês 1–6 (tração orgânica):**
1. Comunidade primeiro — grupo WhatsApp exclusivo para clientes, conteúdo no Instagram sobre gestão de carteira, presença em grupos de corretores existentes
2. Programa de indicação — 1 mês grátis para quem indicar 1 corretor que pagar (antes de qualquer ads)
3. Campanha Quiver — landing page de migração + importador compatível com CSV do Quiver

**Mês 6–12 (escalar o que funciona):**
4. Primeiro canal pago — Meta Ads com segmentação por interesse em seguros + lookalike de clientes pagantes
5. Primeiro SINCOR — abordar SINCOR-SP com proposta de parceria
6. Conteúdo SEO — artigos "como organizar carteira de seguros", "alertas de vencimento para corretor"

**Mês 12–18 (expansão):**
7. Inside sales — primeiro SDR para converter trials longos e abordar usuários Quiver ativamente
8. Seguradoras como canal — proposta de integração/parceria com Porto Seguro e Bradesco
9. Plano Enterprise — micro-corretoras como novo segmento com multi-usuário

---

#### Pricing — Validações Recomendadas

- **Teste A/B no trial:** 14 dias vs. 7 dias — qual gera mais conversão paga?
- **Ancoragem Solo:** Garantir que o plano Solo (R$47) pareça claramente limitado — não uma opção confortável a longo prazo
- **Add-on WhatsApp API:** Testar R$29/mês como add-on antes de incluir no plano Equipe — pode ser o maior driver de upgrade do Profissional
- **Anual com desconto:** Oferecer 2 meses grátis no plano anual a partir do mês 3 de uso — momento em que o cliente criou hábito e churn é menor

---

#### Produto — Prioridades Baseadas na Pesquisa

| Prioridade | Feature | Justificativa da Pesquisa |
|-----------|---------|--------------------------|
| P0 | Assinatura digital (ZapSign) | Gap competitivo de alto impacto, já no stack |
| P0 | Onboarding guiado (CSV como step 1) | Momento "aha" em < 15 min = KPI #1 de conversão |
| P1 | PWA com notificações push | Corretor em campo precisa de alertas no celular |
| P1 | Calculadora de ROI no site | Converte o Segmento 1 que duvida do preço |
| P2 | Relatório de compliance SUSEP/LGPD | Abre ângulo de venda regulatório e novos interlocutores |
| P2 | Integração Omie / Conta Azul | Retenção de longo prazo do corretor PJ |
| Fase 2 | Multicálculo automático (API seguradoras) | Maior gap competitivo — viável via parceria com agregador |

---

#### Mitigação de Riscos

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Concorrente bem-financiado entra no segmento | Média | Moat de comunidade + lock-in de dados nos próximos 18 meses |
| Quiver reage com redução de preço | Baixa | Premia não compete só em preço — compra jornada completa |
| Conversão do trial abaixo de 15% | Média | Onboarding ativo: chat, vídeos, template CSV, ligação no dia 3 |
| Churn alto nos primeiros 3 meses | Média | Customer success proativo: contato dia 3, 7, 14, 30 do trial |
| Seguradoras bloqueiam dados para integração | Baixa | Multicálculo manual como alternativa funcional permanente |

---

## Apêndices

### A. Fontes de Dados
- SUSEP — Estatísticas do Mercado Segurador 2024
- CNseg — Relatório Setorial 2023
- Observação direta do BrokerOne (produto referência)
- Project-brief Premia v1.0 (`squads/lucky-saas/docs/project-brief.md`)
- PRD Premia v1.0 (`squads/lucky-saas/docs/prd.md`)

### B. Glossário
- **SUSEP:** Superintendência de Seguros Privados — órgão regulador brasileiro
- **SINCOR:** Sindicato dos Corretores de Seguros — associação estadual
- **Ramo:** Tipo de seguro (Auto, Vida, Saúde, Residencial, etc.)
- **Vigência:** Período de validade de uma apólice (início → fim)
- **Prêmio:** Valor pago pelo cliente pelo seguro
- **Comissão:** Percentual do prêmio repassado ao corretor pela seguradora

---

*Documento gerado por Atlas (@analyst) — Synkra AIOX · Premia Market Research v1.0*
*Última atualização: 2026-05-11*
