# Premia — Go-To-Market Playbook

**Versão:** 1.0  
**Data:** 2026-05-11  
**Autor:** Morgan @pm  
**Horizonte:** 18 meses (3 fases)

---

## 1. Tese de GTM

O corretor de seguros brasileiro toma decisões de ferramenta por **indicação de par** — não por anúncio. Um corretor indica para outro do mesmo grupo, da mesma associação, da mesma seguradora parceira. A estratégia é: entrar pelo corretor certo, fazer ele ter sucesso visível, e deixar a indicação acontecer naturalmente.

**Sequência:** Referral orgânico → Conteúdo (authority) → Performance ads

**Erro a evitar:** Escalar Meta Ads antes de provar retenção. CAC alto + churn alto = destruição de caixa. Ads só escalam depois que cohort retention M3 > 70%.

---

## 2. Fase 0 — Beta Fechado (Meses -2 a 0)

**Meta:** 30–50 corretores beta · NPS ≥ 60 · aha moment < 15 min validado

### Critérios de Seleção de Beta Users
- Corretores indicados pela rede pessoal (Lucas + Cabral)
- Pelo menos 50% com perfil Carlos (analógico, 150+ clientes)
- Mix de ramos: Auto, Vida, Saúde, Patrimonial
- Dispostos a dar feedback estruturado semanal

### Ativação do Beta
1. Convite manual por WhatsApp (mensagem personalizada, não blast)
2. Onboarding assistido: 1 sessão de 30 min com tela compartilhada
3. CSV import supervisionado até "aha moment" confirmado
4. Check-in semanal no primeiro mês (form de 3 perguntas)

### Critérios de Saída do Beta (Gate para Fase 1)
- [ ] NPS médio ≥ 60
- [ ] ≥ 80% dos beta users com pelo menos 1 alerta configurado
- [ ] Tempo médio até aha moment < 15 min (confirmado por analytics)
- [ ] Zero bugs críticos (P0) abertos
- [ ] ≥ 3 casos de sucesso documentados (testemunhos com foto)

---

## 3. Fase 1 — Soft Launch (Meses 1–3)

**Meta:** 100 corretores pagantes · Trial→paid ≥ 20% · Churn < 5%

### Canal Principal: Referral Program

**Mecânica:**
- Corretor indicador: **1 mês grátis** por cada indicado que converte para pago
- Indicado: **Trial de 21 dias** (vs. 14 dias padrão) + onboarding prioritário
- Compartilhamento: link único rastreado por usuário (`premia.app/ref/{code}`)

**Onde ativar referral:**
- Dashboard pós-onboarding (após aha moment): "Indique um colega e ganhe 1 mês grátis"
- E-mail automático no dia 3 do trial (se já configurou alertas)
- Mensagem WhatsApp sugerida pré-pronta para o corretor copiar e enviar

### Canal Secundário: Grupos e Associações

Mapeamento de grupos WhatsApp e comunidades prioritárias:
| Canal | Audiência estimada | Abordagem |
|-------|-------------------|-----------|
| Grupos WhatsApp de corretores SUSEP | 200–500 membros/grupo | Corretor beta apresenta organicamente |
| SINCOR regional (SP, RJ, MG) | Listas de associados | Parceria institucional (acesso a demo) |
| Grupos Telegram seguradoras (Porto, Bradesco Seguros) | 1.000+ membros | Conteúdo educativo → demo |
| Instagram corretores de seguros | Hashtags #corretordeseguros | Conteúdo orgânico (ver abaixo) |

### Canal Terciário: Conteúdo Orgânico (Instagram)

**Objetivo:** Authority + SEO de marca (não conversão direta)

**Formatos:**
- Reels: "Como organizei minha carteira de seguros com IA em 10 minutos" (POV do corretor)
- Carrossel: "3 renovações que perdi antes de usar sistema — e como evitar"
- Stories: behind-the-scenes de feature nova + pergunta (quiz do produto)

**Frequência:** 3x/semana  
**Responsável:** Lucas (conteúdo) + Cabral (copy de gancho)

---

## 4. Fase 2 — Lançamento Público (Meses 4–6)

**Meta:** Manter ritmo de crescimento → 200 pagantes ao fim do mês 6 (acima da KR base de 100)

### Critérios de Entrada na Fase 2 (Gate de Performance)
- [ ] Cohort M1 retention ≥ 75% (usuários do mês 1 ainda ativos no mês 2)
- [ ] Trial→paid ≥ 20% confirmado em 3 cohorts consecutivos
- [ ] NPS ≥ 55 (KR O2/KR3)
- [ ] Pelo menos 5 casos de sucesso com depoimento em vídeo (para criativos de anúncio)

### Meta Ads (Performance)

**Orçamento inicial:** R$2.000–3.000/mês (escalar conforme LTV confirmado)

**Estrutura de campanha:**
```
Campanha: Topo de Funil — Consciência
  └── Adset: Lookalike 1% de corretores SUSEP (base beta)
  └── Adset: Interesse em "seguros", "corretor de seguros", "SUSEP"
  └── Adset: Remarketing (visitou landing mas não cadastrou)

Campanha: Fundo de Funil — Conversão
  └── Adset: Retargeting de trial não convertido (dia 7-13)
```

**Criativos prioritários (testar):**
1. Depoimento de beta user (Carlos: "recuperei 3 renovações no primeiro mês")
2. Demo screencast: "0 a primeiro alerta em 8 minutos"
3. Comparação: "Excel vs Premia — qual você prefere?"

**Landing page:** Headline = "O sistema que o corretor de seguros brasileiro sempre precisou" + calculadora de ROI above the fold

### SEO (Orgânico — Longo Prazo)

Termos prioritários:
- "sistema para corretor de seguros" (1.200 buscas/mês)
- "software corretor de seguros SUSEP" (800/mês)
- "CRM para corretor de seguros" (600/mês)
- "controle de apólices de seguros" (400/mês)

Estratégia: 1 artigo/semana no blog + SEO on-page na landing page

---

## 5. Fase 3 — Escala (Meses 7–18)

**Meta:** 500 pagantes (KR O3) · R$48k MRR · Expandir para Roberto (Equipe)

### Expansão para Persona Roberto (Equipe)
- Ativação: corretores Profissional com > 300 clientes são abordados pro-ativamente
- Demo personalizada: "veja o relatório por produtor que o Roberto da corretora X agora tem"
- Parceria com associações: Premia como ferramenta recomendada do SINCOR

### Parcerias com Seguradoras
- Meta: 2 seguradoras parceiras (Porto Seguro, Bradesco Seguros) indicando Premia para rede de corretores vinculados
- Modelo: co-marketing (seguradora menciona Premia em comunicado para corretores)
- Incentivo: corretores da seguradora parceira ganham 1 mês grátis

### Multicorretagem (Enterprise)
- Rede de vinculados como canal de distribuição B2B2C
- Precificação sob consulta, 6+ usuários, integração contábil
- Gate: Feature de multicorretagem liberada após 50 usuários no plano Equipe

---

## 6. Métricas de Acompanhamento por Fase

| Métrica | Fase 0 | Fase 1 | Fase 2 | Fase 3 |
|---------|--------|--------|--------|--------|
| Corretores pagantes | 0 | 100 | 200 | 500 |
| Trial→paid | n/a | ≥ 20% | ≥ 20% | ≥ 22% |
| Churn mensal | n/a | < 5% | < 3% | < 3% |
| NPS | ≥ 60 (beta) | ≥ 55 | ≥ 55 | ≥ 60 |
| CAC | Orgânico (≈ R$0) | < R$150 | < R$200 | < R$150 |
| LTV | n/a | > R$1.500 | > R$1.500 | > R$2.000 |
| LTV/CAC | n/a | > 10x | > 7.5x | > 13x |

---

## 7. Referral Program — Especificação Técnica

```
Tabela: referral_codes
  - id, broker_id (dono do código), code (slug único), created_at

Tabela: referral_conversions
  - id, referral_code_id, referred_broker_id, converted_at, reward_applied_at

Lógica:
  - Ao converter trial → paid com referral_code: criar registro em referral_conversions
  - Após 30 dias de pagamento confirmado do indicado: aplicar crédito de 1 mês no plano do indicador
  - Via Stripe: criar invoice credit ou aplicar coupon no próximo ciclo
```

---

*gtm-playbook v1.0 — Premia · Morgan @pm · 2026-05-11*  
*Referências: docs/prd.md (OKRs, Pricing), docs/market-research.md (SAM, canais)*
