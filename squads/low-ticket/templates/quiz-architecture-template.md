# Quiz Architecture — Template

> Use este template para arquitetar quizzes de qualificação e conversão.
> O quiz é o bridge entre o ad e a sales page — educa, qualifica e pré-vende.

---

## Informações do Quiz

- **Nome do quiz:**
- **Oferta associada:**
- **Número de perguntas:** (recomendado: 12-20)
- **Lead capture:** Sim / Não — Posição: antes do resultado / depois
- **Resultados personalizados:** Sim / Não — Quantos:
- **Taxa de conclusão target:** >60%
- **Plataforma:** (Typeform / Bucket.io / custom / outra)

---

## Estrutura de Fases

### Fase 1 — Qualificação Demográfica (2-3 perguntas)

> Objetivo: Confirmar que a pessoa é o público certo. Perguntas fáceis para criar momentum.

| # | Pergunta | Tipo | Opções | Segmento |
|---|----------|------|--------|----------|
| 1 | | Single choice | | |
| 2 | | Single choice | | |
| 3 | | Single choice | | |

**Regra de saída:** Se resposta X na pergunta Y → desqualificar gentilmente.

---

### Fase 2 — Diagnóstico de Sintomas (3-4 perguntas)

> Objetivo: Fazer a persona se reconhecer no problema. Cada pergunta aprofunda a consciência.

| # | Pergunta | Tipo | Opções | Peso (score) |
|---|----------|------|--------|:------------:|
| 4 | | Multi choice | | |
| 5 | | Single choice | | |
| 6 | | Scale (1-5) | | |
| 7 | | Single choice | | |

**Pattern interrupt depois da fase 2:**
> Slide educativo (sem pergunta): "Sabías que [dado surpreendente]? [Reframe do problema]"

---

### Fase 3 — Diagnóstico Emocional (2-3 perguntas)

> Objetivo: Tocar na dor emocional real. Isso é o que vende.

| # | Pergunta | Tipo | Opções | Peso (score) |
|---|----------|------|--------|:------------:|
| 8 | | Single choice | | |
| 9 | | Single choice | | |
| 10 | | Single choice | | |

**Pattern interrupt depois da fase 3:**
> Slide educativo: "No es tu culpa. [Explicação do mecanismo/inimigo comum]"

---

### Fase 4 — Quebra de Objeções (2-3 perguntas)

> Objetivo: Antecipar e neutralizar objeções antes da oferta.

| # | Pergunta | Tipo | Opções | Reframe |
|---|----------|------|--------|---------|
| 11 | "Já tentou resolver antes?" | Single choice | Sim,várias / Sim,1x / Não | "O problema não era você — era o método" |
| 12 | "Quanto tempo tem por dia?" | Single choice | 5min / 10min / 15min+ | "Ótimo! Nosso protocolo pede apenas X min" |
| 13 | | Single choice | | |

---

### Fase 5 — Resultado Personalizado (1 slide)

> Objetivo: Apresentar o "diagnóstico" e transicionar para a oferta.

**Lógica de resultado:**

| Score Range | Resultado | Mensagem | Urgência |
|:-----------:|-----------|----------|----------|
| 0-30% | Leve | "Boas notícias! Seu caso tem grande chance de melhoria rápida." | Baixa |
| 31-60% | Moderado | "Seu caso é comum e tem solução. Veja o que recomendamos." | Média |
| 61-100% | Significativo | "Você precisa agir agora. A boa notícia: existe um protocolo específico." | Alta |

**Elementos do slide de resultado:**
- [ ] Nome personalizado ("Tu Plan Personalizado, [Nome]")
- [ ] Score visual (barra/gráfico)
- [ ] 2-3 insights baseados nas respostas
- [ ] CTA para a página de vendas
- [ ] Timer de urgência (opcional)

---

## Lead Capture

**Posição recomendada:** Entre a Fase 4 e o Resultado

| Campo | Obrigatório | Uso |
|-------|:-----------:|-----|
| Email | Sim | Sequência de nurture + acesso ao produto |
| Nome | Sim | Personalização do resultado e emails |
| WhatsApp | Não | Remarketing (compliance LATAM) |

**Copy do lead capture:**
> "Para ver tu resultado personalizado, ingresa tu email:"
> Subtext: "Tu plan estará listo en segundos. No spam, prometido."

---

## Métricas de Performance

| Métrica | Target | Mínimo Aceitável |
|---------|:------:|:----------------:|
| Taxa de início (clique → Q1) | >80% | >60% |
| Taxa de conclusão (Q1 → resultado) | >65% | >45% |
| Lead capture rate | >50% | >30% |
| Click-to-sales-page | >70% | >50% |
| Drop-off por pergunta | <8% | <15% |

---

## Regras de Design

1. **Uma pergunta por tela** — nunca scroll em mobile
2. **Barra de progresso** — mostra quanto falta (reduz abandono)
3. **Opções com ícones/imagens** — aumenta engagement vs texto puro
4. **Máximo 4-5 opções** por pergunta
5. **Pattern interrupts** a cada 3-4 perguntas (slides educativos, dados, reframes)
6. **Mobile-first** — botões grandes, fonte legível, thumb-friendly
7. **Cores consistentes** com a marca
8. **Sem botão "voltar"** — evita loops, mantém momentum

---

## Exemplo — Zero Diastasis™

### Perguntas-chave
1. "¿Cuántos hijos tienes?" (Qualificação)
2. "¿Hace cuánto fue tu último embarazo?" (Qualificação)
3. "¿Notas un 'bulto' o separación en tu abdomen?" (Sintoma)
4. "¿Tu barriga se ve hinchada incluso en ayunas?" (Sintoma)
5. "¿Has probado ejercicios para tu abdomen sin resultados?" (Objeção)
6. **Pattern interrupt:** "¿Sabías que los abdominales tradicionales EMPEORAN la diástasis?"
7. "¿Cómo te sientes cuando te ves en el espejo?" (Emocional)
8. "¿Evitas ciertas ropas o situaciones por tu abdomen?" (Emocional)
9. "¿Cuánto tiempo tienes al día para ti?" (Objeção)
10. **Resultado personalizado** com score e recomendação

---

*Low-Ticket Squad — Quiz Architecture Template v1.0*
