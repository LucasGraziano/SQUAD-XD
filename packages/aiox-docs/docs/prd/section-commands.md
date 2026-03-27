# PRD Shard: Commands (FR-5)

## Requirements
- FR-5.1: 3 activation syntaxes: @agent-name, /AIOX:agents:name, /atlas
- FR-5.2: 9 agent commands (* prefix) com descricao em grid 3-col
- FR-5.3: 8 slash commands (/ prefix) com: nome, categoria badge (productivity/content/tools), descricao completa, usage examples

## Data: commands.ts
- slashCommands[]: name, description, usage[], category
- agentCommands[]: prefix, description
- activationSyntax[]: syntax, example, description
