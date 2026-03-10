---
task: Audit Existing Materials
responsavel: "@commander"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - docs: Caminho para materiais existentes (textos, métricas, links)
  - current_metrics: Métricas atuais (CPA, CTR, ROAS) se disponíveis
Saida: |
  - audit-report.md: Diagnóstico completo
  - optimization-priorities.md: Prioridades de otimização
Checklist:
  - "[ ] Coletar materiais do usuário"
  - "[ ] Distribuir para análise paralela"
  - "[ ] Consolidar diagnósticos"
  - "[ ] Priorizar otimizações"
  - "[ ] Apresentar relatório com ações recomendadas"
---

# *audit — Auditoria de Materiais Existentes

Executa análise paralela de todos os materiais existentes e gera diagnóstico com prioridades de otimização.

## Uso

```
@commander *audit --docs ./materiais/
@commander *audit --docs ./materiais/ --metrics "CPA:15,CTR:1.2%,ROAS:1.5"
```

## Fluxo de Execução

### Fase 1: Análise Paralela

Commander distribui materiais para análise simultânea:

```
Commander
  ├── @intel-chief → Analisa posicionamento vs concorrência
  ├── @copy-chief → Audita copy (headlines, CTA, persuasão)
  ├── @creative-director → Audita criativos (visual, scroll-stop)
  ├── @traffic-head → Analisa métricas (CPA, CTR, ROAS)
  └── @funnel-chief → Audita funil (drop-off, UX, velocidade)
```

### Fase 2: Consolidação

Commander consolida todos os diagnósticos em audit-report.md com:

- Score por departamento (1-10)
- Problemas identificados com severidade
- Quick wins (melhorias fáceis de alto impacto)
- Melhorias estruturais (requerem mais trabalho)

### Fase 3: Priorização

Commander gera optimization-priorities.md ordenado por:

1. **Impacto x Esforço** — quick wins primeiro
2. **Gargalo principal** — o que está limitando mais o resultado
3. **Ações recomendadas** — com agente responsável por cada uma

## Output

```
📊 AUDIT REPORT — [nome da oferta]

Score Geral: 6.2/10

| Departamento | Score | Status |
|-------------|-------|--------|
| Inteligência | 7/10 | ⚠️ Posicionamento genérico |
| Copy | 5/10 | ❌ Headlines fracas, sem urgência |
| Criativos | 6/10 | ⚠️ Sem variação, fadiga criativa |
| Funil | 7/10 | ⚠️ Checkout com atrito |
| Tráfego | 5/10 | ❌ CPA alto, públicos saturados |

🎯 TOP 3 QUICK WINS:
1. Gerar 10 novos hooks (@hook-master) — Impacto: Alto
2. Testar 3 novos públicos (@media-buyer) — Impacto: Alto
3. Remover campo desnecessário do checkout (@funnel-engineer) — Impacto: Médio

📋 AÇÕES DETALHADAS:
[lista completa por prioridade]
```
