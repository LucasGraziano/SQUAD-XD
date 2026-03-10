---
task: Build Quiz Funnel
responsavel: "@quiz-builder"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - persona: Descrição da persona
  - segmentation_rules: Regras de segmentação
  - quiz_copy: Textos das perguntas e resultados
  - product_blueprint: Estrutura do produto
Saida: |
  - quiz-spec.md: Especificação completa do quiz
  - quiz-logic.yaml: Lógica condicional e scoring
Checklist:
  - "[ ] Definir objetivo do quiz (segmentar, educar, qualificar)"
  - "[ ] Criar perguntas (5-10)"
  - "[ ] Definir lógica de scoring"
  - "[ ] Criar resultados personalizados"
  - "[ ] Definir ponto de lead capture"
  - "[ ] Mapear CTA por resultado"
  - "[ ] Submeter para revisão do @funnel-chief"
---

# *build-quiz — Quiz Funnel

Cria quiz funnel completo com lógica condicional e segmentação.

## Uso

```
@quiz-builder *build-quiz --questions 7 --segments 3
```

## Estrutura do Quiz

### 1. Intro Page
```markdown
# [Headline do Quiz]
## [Sub-headline com promessa de resultado personalizado]

"Descubra [resultado] ideal para você em apenas 2 minutos"

[Botão: Começar Quiz]
```

### 2. Perguntas (5-10)

```yaml
questions:
  - id: q1
    type: multiple-choice
    text: "[Pergunta 1]"
    purpose: segmentation  # segmentation | education | qualification
    options:
      - label: "[Opção A]"
        score: { segment_a: 3, segment_b: 1 }
        tag: "tag_a"
      - label: "[Opção B]"
        score: { segment_a: 1, segment_b: 3 }
        tag: "tag_b"
    branching: null  # ou id da próxima pergunta condicional

  - id: q2
    type: scale
    text: "De 1 a 5, quanto [X]?"
    purpose: qualification
    # ...
```

### 3. Lead Capture (antes do resultado)
```markdown
# Quase lá! Seu resultado está pronto.

Para receber seu resultado personalizado:

[Nome]
[Email]
[Botão: Ver Meu Resultado]
```

### 4. Resultados Personalizados

```yaml
results:
  - id: result_a
    condition: "segment_a >= 8"
    title: "[Título do Resultado A]"
    description: "[Descrição personalizada]"
    recommendation: "[Produto/oferta recomendada]"
    cta: "[CTA específico para este segmento]"
    cta_url: "/oferta-a"

  - id: result_b
    condition: "segment_b >= 8"
    title: "[Título do Resultado B]"
    # ...
```

## Tipos de Pergunta

| Tipo | Uso | UX |
|------|-----|-----|
| `multiple-choice` | Segmentação | 2-4 opções com ícones |
| `scale` | Qualificação | Slider 1-5 ou 1-10 |
| `yes-no` | Filtro rápido | Dois botões |
| `image-choice` | Engajamento | Opções visuais clicáveis |

## Métricas do Quiz

| Métrica | Benchmark |
|---------|-----------|
| Completion rate | >60% |
| Lead capture rate | >40% |
| Time to complete | 1-3 minutos |
| Result → CTA click | >30% |
