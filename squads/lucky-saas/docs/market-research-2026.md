# Market Research — Premia SaaS
**Mercado de Software de Gestão para Corretores de Seguros — Brasil**
*Atlas (Decoder) | @analyst | 2026-05-14*

---

## 1. Tamanho de Mercado

### Mercado de Seguros (Brasil)

| Métrica | Valor | Fonte |
|---------|-------|-------|
| Volume supervisionado SUSEP (Jan–Nov 2025) | R$ 376 bi | SUSEP |
| Projeção crescimento 2025 | +8,5% | CNseg |
| Projeção crescimento 2026 | +8,0% | CNseg |
| Ramos com maior crescimento | Auto, Vida (+12,35%), Residencial | SUSEP |

### Corretores Ativos SUSEP (2026)

| Segmento | Quantidade |
|----------|-----------|
| Pessoas físicas (autônomos) | 84.987 |
| Pessoas jurídicas (corretoras) | 66.614 |
| **Total registrados** | **151.601** |
| Novos registros/dia (2026) | 34/dia (~12.400/ano) |

### TAM / SAM / SOM — Premia

| Camada | Definição | Cálculo | Valor |
|--------|-----------|---------|-------|
| **TAM** | Todos os corretores PF + micro-PJ (< 5 usuários) | ~100k × R$97 ARPU | ~R$116M ARR |
| **SAM** | Corretores digitalizáveis, tech-willing (est. 40%) | ~40k × R$97 | ~R$46M ARR |
| **SOM** | Meta realista Year 1 (0,5–1% SAM) | 500 × R$97/mês | ~R$582k ARR |

---

## 2. Análise Competitiva

### Mapa de Concorrentes

| Player | Foco | Preço/mês | Multicálculo | Target | Fraqueza principal |
|--------|------|-----------|-------------|--------|--------------------|
| **Quiver IN** (Dimensa) | Enterprise/corretoras médias | R$99/usuário | ✅ avançado | Corretoras médias-grandes | UX complexa, preço por usuário |
| **BrokerOne** (Lojacorr) | Parceiros Lojacorr | Gratuito* | ✅ 40+ seguradoras | Rede Lojacorr | *Só para parceiros — perde independência |
| **Segfy (UpFy + HFy)** | Multicálculo + gestão | R$60–R$149/usuário | ✅ 19 seguradoras | Todos os portes | UI datada, curva de aprendizado alta |
| **Moltrio** | Gestão + benefícios corporativos | Não divulgado | ❌ | Benefícios corporativos | Nichado, não atende corretor PF |
| **SGCOR** | Sistema tradicional | Não divulgado | Limitado | Corretoras estabelecidas | Produto legacy |
| **Planilhas Excel** | DIY | R$0 | ❌ | Autônomos analógicos | Sem alertas, sem CRM, sem escala |

### Posicionamento Premia

```
                    SIMPLES
                       │
          PREMIA ●     │
         (R$47–97)     │   Planilhas ●
                       │   (R$0)
PEQUENO ───────────────┼────────────── GRANDE
(autônomo)             │            (corretora)
                       │   BrokerOne ●
          Segfy ●      │   (grátis/parceiro)
         (R$60–149)    │
                       │   Quiver ●
                       │   (R$99/usr)
                    COMPLEXO
```

**Conclusão:** Premia ocupa o quadrante inexplorado — **simples + acessível + independente** para o corretor autônomo.

---

## 3. Dores do Mercado (ICP Validation)

### Dores Confirmadas pela Pesquisa

1. **Gestão por planilha** — mercado de planilhas Excel para corretores está ativo e vendendo em 2025; prova que o gap existe
2. **Renovações perdidas** — ausência de alertas automatizados = perda de comissão (quantificada na ROI Calculator do Premia)
3. **Burocracia e lentidão das seguradoras** — principais queixas em fóruns e pesquisas setoriais
4. **Falta de integração entre sistemas** — corretor usa ferramenta A para cotação, B para CRM, planilha para comissões
5. **Pressão de digitalização** — triênio 2025–2027 crítico; corretores sem tecnologia perderão clientes digitais

### Oportunidade IA

- Apenas ~25% dos corretores usam IA atualmente (2025)
- 80%+ das empresas brasileiras já adotaram alguma IA
- Gap: corretores PF são os mais atrasados → oportunidade de ser o "primeiro sistema com IA" para esse público

---

## 4. Tendências de Mercado 2026

| Tendência | Impacto no Premia | Urgência |
|-----------|------------------|---------|
| +34 novos corretores/dia | Mercado endereçável crescendo | Médio |
| Digitalização forçada por clientes digitais | Urgência de adoção de ferramentas | Alto |
| IA no processo de cotação (Foxfy/Segfy) | Premia precisa de diferencial IA | Médio |
| PWA / mobile-first | Premia já tem vantagem (Story 6.6 ✅) | Baixo |
| Vida +12,35% crescimento | Ramo a destacar no produto | Médio |

---

## 5. Insights Estratégicos

### Vantagens Competitivas Confirmadas

1. **Único independente de rede/parceria** — BrokerOne prende no ecossistema Lojacorr; Premia é neutro
2. **Preço entry-level mais baixo** — R$47 vs R$60 (Segfy) vs R$99 (Quiver IN)
3. **UX para corretor analógico** — Quiver/Segfy são complexos; mercado subestimado de PF que ainda usam planilha
4. **PWA nativa** — diferencial real vs. BrokerOne e Quiver (web-only sem push)

### Riscos a Monitorar

1. **Segfy pode lançar plano barato** — já tem tudo que Premia tem + multicálculo; se baixar preço, ameaça direta
2. **BrokerOne pode abrir para independentes** — removeria a barreira da parceria Lojacorr
3. **Multicálculo é esperado** — Story 6.10 pendente; ausência é gap competitivo vs. Segfy/Quiver

### Recomendação Principal

> O nicho **corretor autônomo PF não-parceiro-de-rede** é o mais abandonado pelo mercado atual. Quiver serve o topo, BrokerOne prende em ecossistema, Segfy é caro demais para autônomo com <50 apólices. Premia a R$47 com UX simples + alertas automáticos + portal do cliente é a **única oferta de valor claro** para os ~85k corretores PF ativos. A Story 6.3 (Stripe Checkout) é o desbloqueador crítico para capturar esse mercado antes de um player grande perceber o gap.

---

## 6. Métricas de Referência (KPI Benchmarks)

| Benchmark | Valor |
|-----------|-------|
| Ticket médio Segfy (entrada) | R$60/mês |
| Ticket médio Quiver IN | R$99/usuário/mês |
| Corretores PF ativos SUSEP | 84.987 |
| Taxa de crescimento novos corretores | +34/dia (~12.400/ano) |
| % corretores usando IA (2025) | ~25% |
| Crescimento mercado seguros 2026 | +8% |
| Corretor responde por X% das vendas BR | 80% |

---

## Fontes

- [SUSEP — Estatísticas Corretores](https://www2.susep.gov.br/safe/Corretores/estatisticas)
- [Susep registrou mais de 3 mil Corretores em 2026 — CQCS](https://cqcs.com.br/noticia/susep-ja-registrou-mais-de-3-mil-corretores-de-seguros-em-2026/)
- [Quiver by Dimensa](https://www.quiver.net.br/)
- [QUIVER IN — R$99/usuário/mês — SEGS](https://www.segs.com.br/seguros/376221-quiver-in-uma-solucao-quiver-por-apenas-r-99-por-usuario-mes)
- [Segfy — Plataforma completa](https://www.segfy.com/)
- [BrokerOne — Lojacorr](https://redelojacorr.com.br/lp-broker/)
- [Perspectivas setor seguros 2026 — Deloitte](https://www.deloitte.com/br/pt/Industries/insurance/perspectives/perspectivas-setor-seguros.html)
- [Corretor responde por 80% das vendas — InfoMoney](https://www.infomoney.com.br/carreira/corretor-responde-por-80-da-venda-de-seguros-no-pais-como-a-tecnologia-tem-mudado-a-profissao/)
- [Melhores softwares para corretoras — Segbox](https://www.segbox.com/blog-posts/softwares-para-corretoras-de-seguros)
- [Top 5 sistemas de gestão — WeWriteBetter](https://wewritebetter.com.br/blog/sistemas-de-gestao-para-corretoras-de-seguros/)
