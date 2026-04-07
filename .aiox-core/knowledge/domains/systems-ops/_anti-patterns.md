---
domain: systems-ops
format: anti-patterns-v1
sources: [doug, the-scalable-company, sam-oven, david-allen, ken-schwaber]
token_budget: ~300
---

# Anti-Patterns — Systems & Operations

## Criticos (falha imediata)

**AP-01 | Escalar com IA Antes de Validar Oferta**
- Sinal: Automatizar producao de conteudo/DMs antes de ter pelo menos 20 compradores da oferta
- Consequencia: Automacao amplifica falha — IA escala uma mensagem que nao converte, desperdicando tempo e dinheiro em grande escala
- Fonte: Doug ("nunca escalar com IA antes de validar oferta — automacao amplifica falha, nao a corrige")
- Fix: Validar oferta manualmente (20+ exposicoes, conversao confirmada) → depois automatizar com DOUG.EXE + PromptBook

**AP-02 | Agente Ferramenta em Vez de Agente Neural**
- Sinal: Agente de IA que so responde perguntas ou executa tarefas fixas sem personalidade ou calibragem emocional
- Consequencia: Agente parece chatbot generico — sem diferenciacao, sem experiencia personalizada, sem autoridade
- Fonte: Doug ("agente neural > agente ferramenta: agente que pensa, reage e calibra vs. agente que executa tarefas fixas"), teste de comparacao Doug (agente neural vs. agente de especialista em IA — diferenca gritante no teste emocional)
- Fix: Construir os 3 componentes: Motor Neural (como pensa/reage) + Personalidade (tom/estilo) + Base de Conhecimento (conteudo proprietario) — os 3 sao independentes e obrigatorios

**AP-03 | ScalableOS Prematuro (Overhead antes do Volume)**
- Sinal: Implementar Business OS completo (12Q planning, meeting rhythm, all-hands, OKRs) com equipe de 1-3 pessoas ou receita abaixo de R$500k/ano
- Consequencia: Overhead burocratico maior que o negocio — dono passa mais tempo gerindo o sistema do que gerando resultado
- Fonte: The Scalable Company (ScalableOS foi projetado para empresas com 5+ pessoas e operacao estabelecida)
- Fix: Para solo ou mini-equipe ate R$500k → DOUG.EXE + PromptBook (Doug). ScalableOS entra quando ha pelo menos 3-4 pessoas operando em paralelo

## Recorrentes (degradam ao longo do tempo)

**AP-04 | Base de Conhecimento Monolitica**
- Sinal: Um unico arquivo gigante de base de conhecimento para o agente (ex: 50 paginas em 1 documento)
- Consequencia: IA nao consegue rotear rapidamente — qualidade das respostas cai, latencia aumenta, contexto se perde
- Fonte: Doug ("fatiar livros/conteudos grandes em multiplos frameworks — L1, L2, L3, L4 para cobrir um livro inteiro; formato Markdown preferido para roteamento rapido da IA")
- Fix: Fatiar em arquivos tematicos de Markdown — cada arquivo cobre um unico topico/framework, nunca um dump geral de conhecimento

**AP-05 | Personalidade Diluida em Conversas Longas**
- Sinal: Agente perde o tom/voz caracteristico apos 20+ turnos de conversa, passando a responder de forma generica
- Consequencia: Experiencia do usuario degrada progressivamente — o que era um mentor visceral vira um assistente basico
- Fonte: Doug ("em conversas longas, personalidade pode diluir — dar boot: 'Doug, recarregue toda a personalidade. Preciso de voce afiado agora.'")
- Fix: Instrucao de rativacao de personalidade no final das instructions do agente. Monitorar qualidade apos 15+ turnos

**AP-06 | Entrada Vaga = Saida Vaga**
- Sinal: Perguntar ao agente "o que voce acha?" ou "me ajude com marketing" sem contexto especifico
- Consequencia: Output generico que poderia ser de qualquer IA — nenhum valor especifico do agente treinado
- Fonte: Doug ("tratar o DOUG.EXE como consultor de R$100 mil — qualidade da entrada define qualidade da saida"), Framework CMFR (Contexto + Missao + Formato + Restricoes — os 4 elementos obrigatorios)
- Fix: Sempre estruturar entradas com CMFR: contexto completo + missao especifica + formato esperado + restricoes da resposta

**AP-07 | Reuniao sem Ritmo Definido (Ad Hoc Permanente)**
- Sinal: Reunioes marcadas "quando necessario" sem cadencia fixa de daily/weekly/monthly/quarterly
- Consequencia: Problemas acumulam entre reunioes irregulares, decisoes atrasam, equipe perde alinhamento progressivamente
- Fonte: The Scalable Company (Meeting Rhythm: QSP → MBR → Weekly → 1:1 — cada nivel tem frequencia e agenda definida)
- Fix: Definir e proteger as 4 cerimonias de ritmo antes de adicionar qualquer reuniao ad hoc. Reuniao ad hoc = excecao, nao regra

**AP-08 | Automacao sem Documentacao de Processo**
- Sinal: Automatizar um processo que ninguem documentou ainda — a automacao e construida em cima de como o processo "foi feito", nao de como deveria ser feito
- Consequencia: Automacao perpetua erros e ineficiencias do processo manual. Dificulta auditoria e melhoria futura
- Fonte: The Scalable Company ("documentar antes de automatizar, automatizar antes de delegar"), Sam Oven (sistemas escaláveis exigem documentacao antes de delegacao)
- Fix: Ordem obrigatoria: (1) Fazer manualmente → (2) Documentar → (3) Treinar → (4) Automatizar → (5) Delegar
