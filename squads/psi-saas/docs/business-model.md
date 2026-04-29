# Modelo de Negócio — PsiSaaS

**Data:** Abril 2026

---

## Proposta de Valor Central

> "O único SaaS para psicólogos que cuida do profissional tanto quanto ele cuida dos pacientes."

**Para quem:** Psicólogos clínicos brasileiros, autônomos ou em consultório pequeno  
**Problema:** Dores operacionais + dores clínicas + dores emocionais — nenhum concorrente resolve as três  
**Solução:** Plataforma que automatiza o operacional, entrega inteligência clínica e cuida do bem-estar do profissional

---

## Modelo de Receita

### Receita Primária — SaaS Recorrente (MRR)

| Plano | Preço | Público | Features âncora |
|-------|-------|---------|-----------------|
| **Solo** | R$ 79/mês | Recém-formados (0–3 anos) | Agenda + Prontuário + Cobrança automática |
| **Clínico** | R$ 149/mês | Intermediários (3–7 anos) | + Alerta abandono + Progress tracking + Portal paciente + Benchmark preços |
| **Pro** | R$ 249/mês | Sênior / Clínica | + Comunidade + IA clínica + Multi-profissional + Prioridade suporte |

**Sem plano gratuito permanente** — apenas trial de 30 dias sem cartão.  
*Racional: freemium nesse nicho não converte bem (PsiNota evidenciou isso). Trial com limite de tempo cria urgência.*

### Receita Secundária — Marketplace de Supervisão (v2)

- Psicólogos supervisores cadastrados na plataforma
- Psicólogos usuários contratam sessões de supervisão dentro da plataforma
- **Take rate: 15–20%** sobre o valor de cada sessão
- Supervisão média: R$ 200–400/sessão → plataforma recebe R$ 30–80 por transação

*Quando ativar: após 300+ usuários ativos — critical mass para o marketplace fazer sentido*

### Receita Terciária — Upsells Futuros
- Cursos / Capacitações em gestão de consultório (dentro da plataforma)
- Consultoria de precificação personalizada
- Relatórios avançados de BI (dashboard para clínicas com múltiplos profissionais)

---

## Unit Economics

### Por cliente (plano Clínico — R$149/mês)

| Métrica | Cálculo | Valor |
|---------|---------|-------|
| ARPU | — | R$ 149/mês |
| Churn estimado | 4%/mês (benchmark SaaS saúde BR) | 4% |
| LTV médio | R$149 ÷ 0,04 | **R$ 3.725** |
| CAC via orgânico | Estimativa (conteúdo + indicação) | **R$ 150–300** |
| CAC via pago | Estimativa (Instagram Ads nicho) | **R$ 400–600** |
| Payback orgânico | R$250 ÷ R$149 | **~2 meses** |
| Payback pago | R$500 ÷ R$149 | **~4 meses** |
| LTV:CAC orgânico | R$3.725 ÷ R$250 | **~15x** |

*LTV:CAC acima de 3x é saudável. 15x é excelente — indica modelo de crescimento lucrativo.*

### Metas de MRR

| Período | Clientes | MRR estimado | Como chegar lá |
|---------|---------|-------------|----------------|
| Mês 3 (beta) | 20 | R$ 2.980 | Beta fechado com entrevistados |
| Mês 6 | 80 | R$ 11.920 | Orgânico + indicação |
| Mês 9 | 180 | R$ 26.820 | Parcerias pós + conteúdo |
| Mês 12 | 300 | R$ 44.700 | Growth consolidado |
| Mês 18 | 600+ | R$ 89.400+ | Com marketplace ativo |

---

## Estrutura de Custos (estimativa)

### Infraestrutura (Supabase + Vercel + extras)

| Item | Custo mensal | Quando |
|------|-------------|--------|
| Supabase Pro | R$ 125 (~$25) | Desde o lançamento |
| Vercel Pro | R$ 100 (~$20) | Desde o lançamento |
| Pagar.me (2,5% + R$0,40/transação) | Variável | — |
| WhatsApp Business API (lembretes) | ~R$ 200 | Desde o lançamento |
| Armazenamento extra (prontuários) | ~R$ 50–200 | Escala com usuários |
| **Total infra (0–200 users)** | **~R$ 500–700/mês** | — |
| **Total infra (500–1000 users)** | **~R$ 2.000–3.500/mês** | — |

### Break-even operacional (infra + tempo)
- Com 20 clientes no plano Clínico: R$ 2.980 MRR cobre infra (~R$500) com sobra
- Break-even real (incluindo tempo de Lucas como custo): negociável — é projeto side-income primeiro

---

## Análise de Precificação vs. Concorrentes

| Produto | Menor plano | Maior plano | Posicionamento |
|---------|-------------|-------------|----------------|
| Psicoplanner | R$ 39 | R$ 99 | Preço baixo |
| GestorPsi | R$ 49 | R$ 149 | Tradicional |
| PsicoManager | R$ 59 | R$ 169 | Robusto |
| **PsiNota AI** | **Grátis** | **R$ 247** | IA + freemium |
| Sinappsy | R$ 79 | R$ 199 | Multi-profissional |
| PsychAssistant | R$ 69,90 | R$ 119,90 | Gestão + IA superficial |
| **Nosso produto** | **R$ 79** | **R$ 249** | Clinical intelligence |

**Conclusão:** Nosso teto de R$249 está alinhado com PsiNota (R$247) — o produto mais premium do mercado atual. Isso valida que há espaço para cobrar mais se o diferencial for real.

---

## Hipóteses de Crescimento a Validar

1. **Hipótese CAC:** Psicólogos indicam muito entre si → CAC orgânico pode ser < R$150 via programa de indicação
2. **Hipótese retenção:** Progress tracking aumenta percepção de valor → churn cai abaixo de 3%
3. **Hipótese upsell:** Psicólogos no plano Solo fazem upgrade quando agenda fica cheia (>15 pacientes) → ACV cresce
4. **Hipótese marketplace:** Com 300+ usuários, surgem supervisores dispostos a usar a plataforma

---

## Riscos do Modelo

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Churn alto por custo de troca | Médio | Alto | Onboarding para novos psicólogos (não migrantes) |
| PsiNota copia alerta de abandono | Alto | Médio | Comunidade é defensável — features, não |
| Preço R$149 não converte | Médio | Alto | Testar R$99 como entrada com R$149 como padrão |
| Marketplace não decola | Médio | Médio | Receita primária (MRR) não depende do marketplace |
| Regulatório CFP muda | Baixo | Alto | Acompanhar CFP, arquitetura flexível |
