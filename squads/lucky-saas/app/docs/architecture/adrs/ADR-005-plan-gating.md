# ADR-005 — Estratégia de Feature Gating por Plano

**Status:** Aceito
**Data:** 2026-05-10 (Story 6.2 — PlanGate)
**Decisores:** @architect (Aria), @pm (Morgan), @master (Orion)

---

## Contexto

O Premia tem 4 planos (starter, pro, broker, enterprise) com features diferentes. Precisávamos de uma estratégia para:

1. **Bloquear features premium** para usuários sem o plano correto
2. **Mostrar upsell contextual** ("Upgrade para acessar") no momento em que o usuário tenta usar a feature
3. **Garantir** que o bloqueio funcione tanto no frontend (UX) quanto no backend (segurança)
4. **Não quebrar trial:** Usuários em trial têm acesso Pro por 14 dias

**Alternativas consideradas:**

1. **Feature flags centralizados** (LaunchDarkly, PostHog flags, Unleash)
2. **Verificação hardcoded** em cada componente (`if (broker.plan === 'pro') ...`)
3. **Componente PlanGate + constants** (escolhido)
4. **Middleware de plano** (Next.js middleware verificando plano antes de servir a página)

---

## Decisão

**Componente `PlanGate` + constantes em `plan-gates.ts` + verificação server-side em API routes.**

---

## Justificativa

### Por que não feature flags externos (LaunchDarkly, etc.)?

- **Custo desnecessário:** Feature flags externos são para A/B testing e progressive rollout. O gating de plano é binário e estável — não precisa de SDK externo.
- **Latência:** Cada flag check adiciona uma network call (ou cache com TTL). Para verificações síncronas em componentes, inaceitável.
- **Complexidade:** Adicionar outro serviço para algo que pode ser uma simples função JavaScript.

### Por que não verificação hardcoded?

```typescript
// MAL: hardcoded em cada lugar
if (broker.plan !== 'pro' && broker.plan !== 'broker') {
  return <UpgradeModal />
}
```

Problemas:
- Adicionar novo plano = buscar em todo o codebase
- Lógica de hierarquia (broker > pro > starter) duplicada em múltiplos lugares
- Sem localização central de qual feature exige qual plano
- Sem padronização do modal de upsell

### A Solução: Constants + Component + Function

**1. Central de verdade: `plan-gates.ts`**

```typescript
export const PLAN_HIERARCHY = { starter: 0, pro: 1, broker: 2, enterprise: 3 }

export function meetsRequirement(currentPlan: string, requiredPlan: RequiredPlan): boolean {
  const normalized = currentPlan === 'trialing' ? 'pro' : currentPlan
  const currentLevel = PLAN_HIERARCHY[normalized as PlanKey] ?? 0
  return currentLevel >= PLAN_HIERARCHY[requiredPlan]
}

export const PLAN_GATE_FEATURES: Record<string, GateConfig> = {
  'relatorio-carteira': { requiredPlan: 'pro', modal: 'soft', anchor: '...' },
  'whatsapp-api':       { requiredPlan: 'broker', modal: 'hard', anchor: '...' },
  // ...
}
```

**2. Componente reutilizável: `PlanGate`**

```typescript
<PlanGate featureKey="relatorio-carteira">
  <RelatorioCarteiraButton />
</PlanGate>
// Se plano suficiente: renderiza o filho
// Se insuficiente: renderiza modal de upgrade (soft ou hard)
```

**3. Verificação server-side nas API Routes**

```typescript
// Segurança: client-side gate é UX, não segurança
if (!meetsRequirement(broker.plan, 'pro')) {
  return new Response('Upgrade required', { status: 402 })
}
```

### Por que dois gates (frontend + backend)?

**Frontend gate (PlanGate component):** UX — esconde o botão/feature para não confundir o usuário. Apresenta modal de upgrade contextual.

**Backend gate (meetsRequirement em API routes):** Segurança — mesmo que o usuário bypasse o frontend (inspecionar elemento, curl), o servidor recusa.

*Frontend gate sem backend gate = segurança por obscuridade (inaceitável).*
*Backend gate sem frontend gate = usuário vê o botão mas recebe 402 (UX ruim).*

### Trialing — Decisão de Design

```typescript
const normalized = currentPlan === 'trialing' ? 'pro' : currentPlan
```

Usuários em trial (14 dias) têm acesso equivalente ao Pro. Isso é estratégico:
- **Ativação:** Usuário experimenta o valor completo da plataforma durante o trial
- **Conversão:** Quando o trial acaba, já está viciado nas features Pro
- **Sem surpresa:** Nenhuma feature "some" quando o trial acaba — apenas fica gated com CTA de upgrade

### Soft vs Hard Gate

```typescript
modal: 'soft' | 'hard'
```

- **Soft:** Modal com CTA de upgrade mas usuário pode fechar e continuar navegando. Para features "extras" (relatório PDF, e-mail automático)
- **Hard:** Modal sem botão de fechar. Para features críticas sem alternativa (WhatsApp API, funcionalidades de equipe). Força a decisão de upgrade ou não.

---

## Consequências

### Positivas
- Um lugar para definir o que cada plano pode usar (`PLAN_GATE_FEATURES`)
- Lógica de hierarquia de planos em um único `meetsRequirement()`
- `PlanGate` reutilizável — adicionar gate em nova feature = 3 linhas de código
- Upsell contextual padronizado — mesmo look & feel em toda a plataforma
- Trialing dá acesso Pro — estratégico para conversão

### Negativas / Trade-offs
- **Não é granular:** O sistema atual é binário por feature (tem ou não tem). Não suporta limites numéricos ("starter: até 50 clientes, pro: até 500"). Para isso, precisaríamos de lógica adicional.
- **Sem rollout gradual:** Não dá para dar acesso a uma feature para 10% dos usuários Pro — seria necessário feature flag externo
- **Context dependency:** `PlanGate` depende de `BrokerPlanProvider` estar no layout — novo dev pode estranhar o erro sem o provider

### Regras derivadas desta decisão
- TODA nova feature premium: registrar em `PLAN_GATE_FEATURES` + wrap com `<PlanGate>`
- TODA API route de feature premium: verificar com `meetsRequirement()` server-side
- Trialing SEMPRE tratado como Pro — nunca mostrar gating para usuário em trial
- Usar `soft` para features de conveniência; `hard` para features sem substituto

### Extensão Futura

Para limites numéricos (ex: "máximo de X clientes por plano"), criar:
```typescript
// plan-limits.ts (ainda não existe)
export const PLAN_LIMITS = {
  clients: { starter: 50, pro: 500, broker: Infinity },
  // ...
}
```
