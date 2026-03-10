# Campaign Launch Checklist

Checklist para lançamento de campanha de tráfego. Deve ser validado pelo @traffic-head antes de ativar qualquer campanha.

## Pre-Launch: Estratégia
- [ ] CPA target definido e validado contra unit economics
- [ ] Orçamento de teste alocado (mín. 5x CPA target por adset)
- [ ] Plataforma(s) selecionada(s) e conta(s) ativa(s)
- [ ] Kill rules documentadas (quando pausar)
- [ ] Scale rules documentadas (quando escalar)

## Pre-Launch: Criativos
- [ ] Mínimo 3 criativos por adset
- [ ] Criativos aprovados pelo @creative-director
- [ ] Copy dos ads aprovada pelo @copy-chief
- [ ] Formatos corretos por plataforma (1:1, 9:16, 16:9)
- [ ] Textos primary, headline e description preenchidos

## Pre-Launch: Públicos
- [ ] Mínimo 3 públicos diferentes para teste
- [ ] Públicos sem sobreposição excessiva (< 20%)
- [ ] Lookalikes configurados (se disponíveis)
- [ ] Custom audiences criadas (retargeting)
- [ ] Exclusões configuradas (compradores, leads quentes)

## Pre-Launch: Funil
- [ ] Landing page testada e funcional
- [ ] Checkout testado (compra de teste realizada)
- [ ] Order bump funcional
- [ ] Upsell/downsell pages funcionais
- [ ] Thank you page com acesso ao produto
- [ ] Velocidade < 3s em mobile

## Pre-Launch: Tracking
- [ ] Pixel Meta instalado e verificado
- [ ] Google Tag instalado (se Google Ads)
- [ ] Events configurados (ViewContent, InitiateCheckout, Purchase)
- [ ] UTMs padronizados em todos os ads
- [ ] Conversão API configurada (CAPI / server-side)
- [ ] Teste de evento disparado com sucesso

## Pre-Launch: Automações
- [ ] Email de boas-vindas configurado e testado
- [ ] Sequência de abandono configurada (1h, 24h, 48h)
- [ ] Tags/segmentos no email marketing configurados
- [ ] Webhook de compra → CRM funcional

## Launch Day
- [ ] Campanha revisada 1 última vez (budget, schedule, targeting)
- [ ] Horário de ativação adequado (não sexta à noite)
- [ ] Monitoramento agendado (check 2h, 6h, 24h após ativar)
- [ ] Dashboard de métricas acessível
- [ ] Notificações de gasto configuradas

## Post-Launch (primeiras 24h)
- [ ] Ads aprovados pela plataforma (sem rejeições)
- [ ] Impressões sendo entregues normalmente
- [ ] Pixel disparando corretamente
- [ ] Landing page sem erros
- [ ] Primeiras métricas alinhadas com expectativas

---

## Go/No-Go Decision

| Checks completos | Decisão |
|:----------------:|---------|
| 100% (todas) | 🟢 GO — Lançar campanha |
| 90-99% | 🟡 CONDITIONAL — Lançar com itens pendentes documentados |
| < 90% | 🔴 NO-GO — Resolver pendências antes de lançar |

*Usado por: @traffic-head (Boost), @media-buyer (Bid)*
