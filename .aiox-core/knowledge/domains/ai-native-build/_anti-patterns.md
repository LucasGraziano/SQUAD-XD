# Anti-Patterns — AI-Native Build

## Críticos (falha imediata)

**AP-01 | CLAUDE.md Genérico**: usar CLAUDE.md copiado de template sem personalização para o projeto → contexto sem especificidade → agente responde como se não soubesse nada do projeto → **Fix:** incluir stack, squads ativos, convenções de código, padrões específicos do projeto — quanto mais específico, melhor o agente.

**AP-02 | Sem DESIGN.md antes de UI**: pedir UI sem DESIGN.md existente → IA gera bento grids, neon, glassmorphism, cores genéricas → retrabalho de 3-5 iterações → **Fix:** criar DESIGN.md com hex exatos antes de qualquer sessão de frontend. Use `npx getdesign@latest` como base se não tiver identidade própria.

**AP-03 | LLM revisando próprio código**: pedir ao mesmo modelo que gerou o código para revisá-lo → auto-elogio garantido, bugs críticos ignorados → **Fix:** usar Codex adversarial review (`codeex colad adversarial review`) ou modelo externo diferente para code review.

**AP-04 | Modelo único para tudo**: usar Opus para formatação de texto, Sonnet para tarefas de 5 linhas, Haiku para zero → gasto 3-10x maior sem ganho de qualidade → **Fix:** Opus orquestra decisões complexas, Sonnet implementa, Haiku processa tarefas simples. Economiza 60-88% em tarefas rotineiras.

## Altos (degradação significativa)

**AP-05 | Skills sem description de trigger**: criar skill com description vaga ("usa para coisas de design") → skill nunca ativa automaticamente → **Fix:** description deve ter keywords explícitas que o usuário vai usar: "Ativa quando: 'criar componente', 'build UI', 'landing page', 'form', 'button'".

**AP-06 | Hook onde deveria ser skill**: usar hook para lógica que depende de contexto semântico → hook executa sempre, mesmo quando não relevante → system noise → **Fix:** hooks para validações determinísticas (JSON válido, arquivo existe). Skills para lógica contextual (quando usuário quer design, quando quer knowledge).

**AP-07 | Contexto acumulado sem /clear**: trabalhar 3h na mesma sessão em tarefas completamente diferentes → contexto > 100k tokens → respostas mais lentas + caras + menos focadas → **Fix:** /clear ao mudar de tarefa, /compact quando histórico longo mas contexto atual ainda relevante.

**AP-08 | Poluir contexto principal com tarefas paralelas**: rodar pesquisa longa no mesmo contexto de implementação → contexto mistura intenções → **Fix:** spawn background agent para tarefas independentes. Cada agente isolado = melhor foco + menor custo.

## Médios (qualidade reduzida)

**AP-09 | Executar sem Plan Mode**: ir direto para implementação de task complexa → erros de arquitetura descobertos tarde → **Fix:** Shift+Tab para Plan Mode antes de qualquer tarefa que mexe em múltiplos arquivos. 10 tokens de plano evitam 500 tokens de correção.

**AP-10 | Cores por nome, não por hex**: usar "teal" ou "warm gray" no DESIGN.md → IA interpreta de forma inconsistente entre sessões → **Fix:** sempre hex exato (#1A4A5A), RGB ou HSL. Nunca nomes de cores CSS ou descritivos.

**AP-11 | Esquecer de atualizar _REGISTRY.yaml**: criar novo domínio ou dossier sem registrar → knowledge layer fragmentado, agents não sabem que existe → **Fix:** toda vez que criar artifact de knowledge, atualizar _REGISTRY.yaml e _SITUATIONS.yaml se necessário.
