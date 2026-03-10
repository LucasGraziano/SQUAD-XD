# Funnel Launch Checklist

Checklist para validação do funil antes de receber tráfego. Validado pelo @funnel-chief.

## Páginas
- [ ] Landing page / VSL page carregando corretamente
- [ ] Checkout page funcional
- [ ] Upsell page(s) funcional
- [ ] Downsell page(s) funcional (se aplicável)
- [ ] Thank you page com acesso ao produto
- [ ] Todas as páginas com SSL (https)

## Mobile
- [ ] Todas as páginas responsivas em mobile
- [ ] Botões de CTA acessíveis sem scroll lateral
- [ ] Texto legível sem zoom
- [ ] Imagens/vídeos adaptados ao mobile
- [ ] Formulários fáceis de preencher em mobile

## Performance
- [ ] Load time < 3 segundos (desktop)
- [ ] Load time < 4 segundos (mobile / 4G)
- [ ] Imagens otimizadas (WebP, compressed)
- [ ] Lazy loading ativado para imagens below-the-fold
- [ ] Sem scripts bloqueantes desnecessários

## Copy & Design
- [ ] Headline visível acima da dobra (above the fold)
- [ ] CTA buttons visíveis sem scroll na LP
- [ ] Hierarquia visual clara (headline > subheadline > body)
- [ ] Cores do CTA contrastam com o fundo
- [ ] Zero erros de ortografia

## Checkout
- [ ] Campos mínimos necessários (nome, email, pagamento)
- [ ] Order bump aparecendo corretamente
- [ ] Preço correto exibido
- [ ] Todas as formas de pagamento ativas (cartão, pix, boleto)
- [ ] Compra teste realizada com sucesso
- [ ] Compra teste com order bump realizada

## Upsell/Downsell Flow
- [ ] Redirecionamento pós-compra para upsell (sem acesso ao produto antes)
- [ ] Botão "Sim" processa pagamento do upsell
- [ ] Botão "Não/Pular" redireciona para downsell ou thank you
- [ ] Timer de upsell funcional (se aplicável)
- [ ] Preço correto em todas as ofertas

## Integrações
- [ ] Plataforma de pagamento integrada e testada
- [ ] Email marketing recebendo leads/compradores
- [ ] Tags corretas sendo aplicadas por evento
- [ ] Área de membros/entrega do produto integrada
- [ ] Webhook disparando corretamente

## Tracking
- [ ] Pixel(s) instalado(s) em todas as páginas
- [ ] Event ViewContent na LP
- [ ] Event InitiateCheckout no checkout
- [ ] Event Purchase na thank you
- [ ] UTMs sendo capturados e armazenados
- [ ] Google Analytics (se usado) configurado

## Automações
- [ ] Email de boas-vindas dispara ao comprar
- [ ] Email de acesso ao produto com link correto
- [ ] Sequência de onboarding agendada
- [ ] Email de abandono de checkout configurado
- [ ] Notificação ao admin de nova venda

## Segurança & Legal
- [ ] Política de privacidade linkada no checkout
- [ ] Termos de uso linkados
- [ ] Checkbox de consentimento (LGPD) se necessário
- [ ] Página de suporte/contato acessível

---

## Go/No-Go

| Checks | Decisão |
|:------:|---------|
| 100% | 🟢 GO — Funil pronto para tráfego |
| 95-99% | 🟡 GO com ressalvas — Documentar pendências |
| < 95% | 🔴 NO-GO — Corrigir antes de ativar tráfego |

*Usado por: @funnel-chief (Flow), @funnel-engineer (Forge)*
