# Vínculo — Plataforma Clínica para Psicólogos

> "Você passou anos aprendendo a cuidar de pessoas. A gente cuida do resto."

## Status
**Fase:** Discovery (Semanas 1–4)  
**Próxima milestone:** Entrevistas qualitativas + landing page de validação  
**Decisão estratégica:** CONDITIONAL GO (Conclave 08/04/2026, confiança 76%)

---

## O Produto

SaaS B2B para psicólogos clínicos brasileiros com posicionamento diferenciado:  
**não é só gestão operacional — é inteligência clínica + bem-estar do profissional.**

### Diferencial central
Nenhum concorrente atual resolve as dores de Camada 3 do psicólogo:
- Abandono de paciente sem aviso (fracasso pessoal percebido)
- Falta de evidência de progresso terapêutico
- Isolamento profissional / burnout
- Medo de cobrar / precificação errada

### Feature Killer do MVP
**Alerta de Risco de Abandono** — detecta padrão de desengajamento antes que o paciente vá embora.

---

## Estrutura do Projeto

```
psi-saas/
├── README.md                    ← este arquivo
├── docs/
│   ├── market-research.md       ← pesquisa de mercado completa
│   ├── regulatory-compliance.md ← CFP + LGPD
│   ├── competitor-analysis.md   ← análise detalhada dos concorrentes
│   ├── business-model.md        ← modelo de negócio, pricing, unit economics
│   └── brand-identity.md        ← nome, posicionamento, tom de voz
├── product/
│   ├── prd.md                   ← Product Requirements Document completo
│   ├── features/                ← specs de cada feature
│   │   ├── alerta-abandono.md   ← feature killer do MVP
│   │   ├── prontuario.md
│   │   ├── agenda.md
│   │   └── cobranca.md
│   └── ux/
│       └── flows.md             ← fluxos principais do usuário
├── tech/
│   └── stack.md                 ← decisões técnicas, arquitetura, LGPD
└── go-to-market/
    ├── gtm.md                   ← estratégia completa de go-to-market
    ├── interview-script.md      ← roteiro entrevistas qualitativas
    └── landing-page-copy.md     ← copy da landing de validação
```

---

## Mercado

| Métrica | Dado |
|---------|------|
| TAM | 547.000 psicólogos registrados no CFP |
| Crescimento | +15%/ano, 120k novos/ano |
| ARPU alvo | R$149/mês (plano Clínico) |
| Meta 12 meses | 300 clientes → ~R$45k MRR |

---

## Timeline

| Fase | Período | Objetivo |
|------|---------|----------|
| 0 — Discovery | Sem 1–4 | Entrevistas + Regulatório + Validação |
| 1 — MVP | Mês 2–3 | Produto funcional com feature killer |
| 2 — PMF | Mês 4–6 | Progress tracking + portal paciente |
| 3 — Growth | Mês 7–12 | Comunidade + parcerias + 300 clientes |
| 4 — Marketplace | Mês 12–18 | Supervisores + take rate |

---

## Stack Técnica (decisão)
**Next.js + Supabase + Pagar.me**  
Detalhes: `tech/stack.md`

---

## Decisões Documentadas
- Conclave estratégico: `.aiox/conclaves/conclave-2026-04-08-saas-psicologos.md`
- Pesquisa de mercado original: `../low-ticket/docs/market-research-psicologos-saas.md`
