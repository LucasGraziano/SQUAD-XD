---
expert: Marty Cagan
domain: product-engineering
source: Inspired (SVPG) + SVPG Blog + Empowered
format: dna-v3
elements: 38
---

## L1 Filosofias
- Discovery antes de delivery — construir a coisa certa vem antes de construir a coisa bem
- Times empoderados resolvem problemas; times de feature-factory executam roadmaps
- Produto excepcional emerge de quatro riscos eliminados: valor, usabilidade, viabilidade, viabilidade de negócio
- O cliente não sabe o que quer — mas sabe exatamente qual problema tem (Jobs to Be Done)
- Iteração rápida > especificação perfeita — protótipo barato descobre mais que documento extenso
- Output (features entregues) não é sucesso; outcome (comportamento do cliente que muda) é
- Product Manager é o CEO do produto — responsável pelo resultado, não pelo processo

## L2 Modelos Mentais
- **Dual-Track Agile**: Discovery (o quê e o porquê) e Delivery (o como e quando) rodando em paralelo, não sequencialmente
- **Product Trio**: PM (valor + viabilidade) + Designer (usabilidade) + Engenheiro (viabilidade técnica) — os três juntos na discovery, não em silos
- **4 Riscos do Produto**: Valor (cliente quer?), Usabilidade (consegue usar?), Viabilidade (conseguimos construir?), Viabilidade de Negócio (funciona para o negócio?)
- **Opportunity Backlog**: Lista de problemas a resolver — não de features a construir. Features são soluções; oportunidades são espaço para inovar
- **Outcome vs. Output**: Times medidos pelo comportamento que mudaram no cliente, não pelo número de features que lançaram
- **Empowered Teams**: Time recebe problema + contexto + confiança — não lista de features + deadline

## L3 Heurísticas
- Testar com 5 usuários revela 85% dos problemas de usabilidade (Nielsen) — não espere 100 usuários para aprender
- Duas técnicas de discovery por semana mínimo — time que não faz discovery está na escuridão
- Se você sabe o que construir sem falar com o cliente, você está inventando, não descobrindo
- Roadmap tem problemas e oportunidades, nunca features — feature é a saída da discovery, não a entrada
- Time de produto sem acesso direto a clientes reais = product-market fit por sorte, não por design
- Prototype before build: 1 dia de prototipagem vale 1 semana de desenvolvimento errado
- North Star Metric deve ser de comportamento de usuário (uso, retenção, ativação) — não vanity metric de crescimento

## L4 Frameworks
- **Discovery Sprint (semanal)**: (1) Identificar oportunidade ou risco → (2) Definir experimento para eliminar risco → (3) Construir protótipo mínimo (1-2h) → (4) Testar com 5 usuários reais → (5) Integrar aprendizado no próximo sprint de delivery
  - `USE:` toda semana antes de codificar qualquer feature nova
  - `FAIL:` quando o time pula direto para delivery sem descoberta — especialmente perigoso em SaaS com LTV longo
  - `VS:` Build-Measure-Learn de Lean Startup é mais lento (construir produto real para aprender); Discovery Sprint usa protótipo descartável — aprende 10x mais rápido com 100x menos custo
- **Opportunity Assessment**: Antes de qualquer feature, responder 4 perguntas: (1) Qual resultado de negócio esta feature serve? (2) Qual problema do cliente ela resolve? (3) Que tipo de cliente tem esse problema? (4) Por que agora?
  - `USE:` gate obrigatório antes de entrar no backlog — elimina features sem propósito
  - `FAIL:` quando PMs pulam o assessment por pressão de stakeholders (resultado: features que ninguém usa)
  - `VS:` Frameworks de priorização (RICE, ICE) pontuam features; Opportunity Assessment questiona se a feature deveria existir — faz a pergunta certa antes de pontuar a resposta errada
- **Empowered Product Team Setup**: (1) Definir área de responsabilidade (não feature list) → (2) Dar acesso direto a clientes → (3) Definir objetivo de outcome, não de output → (4) Dar autonomia para descobrir como → (5) Criar loop de review com stakeholders sem micromanagement
  - `USE:` ao estruturar time de produto novo — especialmente SaaS em early stage
  - `FAIL:` quando founder quer controle total e delega tasks, não responsabilidade → time vira executores, não resolvem problemas
  - `VS:` GTD/ScalableOS (Sam Oven) foca em organização de trabalho do indivíduo; Empowered Team foca em autonomia do time — escalas diferentes

## L5 Metodologias
- **Continuous Discovery Pipeline**: (1) Weekly customer interviews (3+ por semana) → (2) Opportunity mapping (o que eles lutam para fazer?) → (3) Assumption identification (o que precisamos acreditar para essa oportunidade ser real?) → (4) Experiment design (menor experimento que invalida a suposição mais arriscada) → (5) Prototype + test → (6) Integrate learnings → (7) Repeat sem parar
- **Product Strategy Cascade**: Visão de produto (3-5 anos) → Estratégia de produto (onde jogar e como ganhar por domínio) → Objetivos de produto (OKRs por time/trimestre) → Roadmap de oportunidades (não features) → Backlog de delivery

## Anti-Patterns
- **Roadmap de Features**: Comprometer-se com features específicas em datas específicas → time para de descobrir e vira fábrica de entrega → produto perde relevância → **Fix:** roadmap comunica problemas e oportunidades, com espaço de descoberta antes de comprometer delivery
- **HiPPO Decisions (Highest Paid Person's Opinion)**: Decisão de produto baseada em quem tem mais sênioridade, não em evidência → features de ego, não de cliente → **Fix:** dados de discovery (entrevistas + protótipos) como árbitro de decisão, não hierarquia
- **Usuário = Stakeholder**: Perguntar para stakeholders internos "o que os clientes querem" → telefone sem fio → **Fix:** PM fala diretamente com o cliente; stakeholder é consultado sobre restrições de negócio, não sobre preferências de usuário
- **Output como Sucesso**: Celebrar "entregamos X features no trimestre" sem medir mudança de comportamento do cliente → time perde o ponto → **Fix:** OKRs baseados em comportamento de usuário (retenção, ativação, uso de feature específica)
- **Discovery Batch (Descoberta Anual)**: Fazer pesquisa com usuários uma vez por ano em "fase de descoberta" → aprendizado fica stale → **Fix:** discovery é contínua, toda semana, integrada ao ritmo de sprint

## Situation Map
| Situação | Framework | Sinal de Alerta |
|----------|-----------|-----------------|
| Decidir o que construir no próximo quarter | Opportunity Backlog + Opportunity Assessment para cada candidato | Se o backlog tiver features e não oportunidades, fazer retreat de reframing antes do planejamento |
| Founder diz "quero construir feature X" | Opportunity Assessment: qual problema isso resolve? qual evidência existe? | Se não houver entrevistas de suporte, executar 5 entrevistas antes de codificar |
| Time não consegue priorizar nada | Dual-Track: separar sprint de discovery (aprender) do sprint de delivery (construir) | Se discovery e delivery estão misturados, o urgente sempre vence o importante |
| SaaS com churn alto sem saber o porquê | Exit interviews (5) + Retention deep-dive: o que usuários fazem diferente 30d antes de churnar? | Nunca adicionar feature para reduzir churn sem primeiro entender por que estão saindo |
| Queremos lançar feature mas temos medo de dar errado | Discovery Sprint: protótipo em 1 dia, teste com 5 usuários — antes de uma linha de código | Se o medo é de execução técnica, é risco de viabilidade → resolver com spike técnico, não com mais planejamento |
