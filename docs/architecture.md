# ARQUITETURA DO SISTEMA - SQUAD XD (BROWNFIELD)

## 1. Visão Arquitetural
O **SQUAD XD** utiliza uma arquitetura de monorepo distribuída, onde o core do sistema reside em `.aiox-core` e as interfaces/serviços estão em `packages/`. A comunicação entre agentes e código é mediada por arquivos de estado e prompts de sistema altamente estruturados.

## 2. Componentes de Camada

### 2.1 Camada de Orquestração (AIOX Core)
- **Local:** `.aiox-core/`
- **Função:** Contém os cérebros de todos os agentes (PM, Dev, QA, etc.).
- **Mecanismo:** Usa arquivos `.md` e `.yaml` para definir regras de comportamento e permissões de agentes.
- **Workflow:** Implementa o ciclo SM → DEV → QA através de stories em `docs/stories/`.

### 2.2 Camada de Conhecimento (Mega Brain)
- **Local:** `D:\MEGA BRAIN XD`
- **Função:** Fonte de verdade externa para estratégias de marketing, vendas e desenvolvimento.
- **Integração:** Injeção dinâmica de heurísticas em tempo de execução via protocolos `k-###`.

### 2.3 Camada de Interface (AIOX Docs)
- **Local:** `packages/aiox-docs/`
- **Tecnologia:** Next.js (App Router), Tailwind CSS.
- **Função:** Visualização e busca didática de toda a infraestrutura AIOX.

### 2.4 Camada de Produto (Zero Diástase)
- **Local:** `packages/zero-diastasis-site/`
- **Tecnologia:** Next.js / Static HTML.
- **Função:** Frontend do produto final para o usuário final.

## 3. Fluxo de Dados e Integração
1. **Ativação:** O usuário ativa um agente (ex: `@aiox-master`).
2. **Contexto:** O agente carrega o `AGENTS.md` e o `prd.md` para entender os limites.
3. **Execução:** O agente usa ferramentas (bash, replace, write_file) para realizar tarefas em qualquer pacote do monorepo.
4. **Validação:** O `@qa` executa testes e checklists definidos no core antes de qualquer commit ou push.

## 4. Padrões de Código
- **Frontend:** Estética baseada em Tailwind ( Brand DNA palette).
- **IA:** Prompting baseado em instruções YAML e Markdown rigoroso.
- **Git:** Estrutura de branches baseada em epics e stories (v4 protocol).
