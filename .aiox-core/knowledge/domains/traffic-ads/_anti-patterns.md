---
domain: traffic-ads
format: anti-patterns-v1
token_budget: ~300
---

# Anti-Patterns — Traffic & Ads

## Criticos (falha imediata)

**AP-01 | Escalar antes de validar criativo**
- Sinal: aumentar budget de ads antes de atingir 20+ exposicoes no criativo sem sinal claro de conversao
- Consequencia: escalar uma falha — queimar orcamento em criativo que nao funciona em escala maior
- Fonte: Haynes (DSL), Hard Copy (kill rules)
- Fix: validar mensagem e criativo com budget minimo (20+ exposicoes, 48h) antes de qualquer escala. Medir CTR e CPL antes de dobrar budget

**AP-02 | Kill rule inexistente**
- Sinal: manter ad rodando por mais de 72h sem criterio claro de pausa baseado em metrica
- Consequencia: queimar budget em ads perdedores por dias ou semanas
- Fonte: Hard Copy, Haynes
- Fix: definir kill rules antes de subir qualquer campanha. Regra base: CTR < 1% em 48h = pausar. CPL 3x acima do meta = pausar

**AP-03 | Crescer audiencia sem qualificacao**
- Sinal: conteudo de entretenimento, trends ou humor que nao conecta com o comprador ideal
- Consequencia: muitos seguidores, zero compradores — audiencia inflada sem capacidade de monetizacao
- Fonte: Doug (Money Brand, Z4)
- Fix: Money Brand Doug — cada conteudo deve qualificar o viewer como potencial comprador. Z4 como filtro narrativo de quem fica e quem sai

## Recorrentes (degradam ao longo do tempo)

**AP-04 | Testar audiencia antes de testar criativo**
- Sinal: criar multiplos ad sets com audiencias diferentes usando o mesmo criativo
- Consequencia: conclusao errada sobre o que funciona — audiencia leva credito ou culpa que e do criativo
- Fonte: Haynes (criativo e a variavel #1)
- Fix: manter audiencia constante, variar criativo. Somente apos validar criativo, testar variacoes de audiencia

**AP-05 | Escalar sem sistema de show rate**
- Sinal: gerar leads via paid ads sem sequencia de confirmacao e nurture pre-call (email + SMS)
- Consequencia: taxa de no-show alta (40-70%), custo por call realizada explode, CAC distorcido
- Fonte: Haynes (Hammer Strategy)
- Fix: implementar Hammer Strategy antes de escalar — 12 emails + 4 SMS em 48h apos lead gerado. Show rate de 80%+ antes de aumentar volume de leads
