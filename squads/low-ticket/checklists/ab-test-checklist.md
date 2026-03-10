# A/B Test Checklist

> Use antes de lançar qualquer teste A/B. Garante rigor estatístico e decisões data-driven.

---

## Pré-Teste

### Hipótese
- [ ] Hipótese clara e específica documentada
  - Formato: "Se mudarmos [variável], esperamos [métrica] melhore em [%] porque [razão]"
- [ ] Apenas UMA variável sendo testada (não múltiplas mudanças simultâneas)
- [ ] Variante B é significativamente diferente de A (não micro-ajustes)

### Métrica
- [ ] Métrica primária de sucesso definida (apenas UMA)
  - Ex: CTR, CPA, conversion rate, ROAS
- [ ] Métricas secundárias definidas (máx 2-3)
- [ ] Baseline da métrica primária documentado (valor atual)
- [ ] Melhoria mínima detectável definida (MDE) — geralmente 10-20%

### Tamanho de Amostra
- [ ] Sample size mínimo calculado
  - **Ads:** Mínimo 1000 impressões por variante OU 50 conversões por variante
  - **Landing pages:** Mínimo 200 visitantes por variante OU 30 conversões por variante
  - **Emails:** Mínimo 500 envios por variante
- [ ] Budget alocado suficiente para atingir o sample size
- [ ] Estimativa de tempo para atingir sample size (mínimo 3 dias, ideal 7)

### Setup
- [ ] Tráfego dividido 50/50 (ou proporção definida)
- [ ] Randomização ativa (não divisão por horário ou geografia)
- [ ] Tracking configurado e testado
- [ ] Pixel/conversão disparando corretamente em ambas variantes
- [ ] Período de teste definido: início ______ término ______

---

## Durante o Teste

- [ ] Não mexer nas variantes durante o período de teste
- [ ] Não pausar/despausar variantes individualmente
- [ ] Monitorar diariamente por anomalias técnicas (não por resultado)
- [ ] Documentar qualquer evento externo que possa afetar (promoção, feriado, etc.)

### Red Flags (pausar o teste)
- [ ] CPA > 5x target em qualquer variante → pausar e investigar
- [ ] Erro técnico (página quebrada, pixel falhando) → pausar e corrigir
- [ ] Budget esgotado antes do sample size → reavaliar

---

## Pós-Teste

### Análise
- [ ] Sample size mínimo atingido em AMBAS variantes
- [ ] Teste rodou por tempo mínimo (3+ dias)
- [ ] Significância estatística atingida (p-value < 0.05 ou 95% confiança)
  - Se p-value entre 0.05-0.10: resultado sugestivo, considerar estender teste
  - Se p-value > 0.10: sem diferença significativa, manter controle

### Resultados
| Métrica | Variante A (Controle) | Variante B | Diferença | Sig. Estatística |
|---------|:---------------------:|:----------:|:---------:|:----------------:|
| Primária: _____ | | | % | Sim/Não |
| Secundária 1: _____ | | | % | Sim/Não |
| Secundária 2: _____ | | | % | Sim/Não |

### Decisão
- [ ] **Winner claro** → Implementar variante vencedora como novo controle
- [ ] **Sem diferença significativa** → Manter controle atual, documentar aprendizado
- [ ] **Resultado surpreendente** → Investigar antes de implementar (pode ser anomalia)

### Documentação
- [ ] Resultado documentado com screenshots/dados
- [ ] Aprendizado registrado para informar próximos testes
- [ ] Próximo teste planejado (iterar sobre o winner)

---

## Regras de Ouro

1. **Nunca declare um winner antes de atingir sample size** — resultados iniciais são ruído
2. **Nunca teste mais de 1 variável por vez** — impossível saber o que causou a diferença
3. **Mínimo 3 dias** de teste — comportamento varia por dia da semana
4. **Documente TUDO** — testes não documentados são testes desperdiçados
5. **Teste ideias grandes** — micro-ajustes raramente atingem significância estatística
6. **O controle é rei** até que um challenger prove ser melhor com dados

---

## Calculadora Rápida de Sample Size

| Baseline Conv. Rate | MDE 10% | MDE 20% | MDE 30% |
|:-------------------:|:-------:|:-------:|:-------:|
| 1% | 14,900/var | 3,800/var | 1,700/var |
| 2% | 7,300/var | 1,900/var | 850/var |
| 5% | 2,800/var | 730/var | 330/var |
| 10% | 1,300/var | 350/var | 160/var |
| 20% | 600/var | 160/var | 75/var |

*Baseado em 95% confiança, 80% poder estatístico*

---

*Low-Ticket Squad — A/B Test Checklist v1.0*
