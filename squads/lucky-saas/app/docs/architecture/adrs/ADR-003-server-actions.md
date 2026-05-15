# ADR-003 — Server Actions vs REST API para Mutações

**Status:** Aceito
**Data:** 2026-05-07
**Decisores:** @architect (Aria), @master (Orion)

---

## Contexto

Toda aplicação SaaS precisa de mutações de dados: criar cliente, atualizar apólice, lançar comissão, etc.

A questão é: **como o frontend dispara essas mutações?**

**Alternativas consideradas:**

1. **Server Actions** do Next.js App Router (escolhido)
2. REST API própria (`/api/clients`, `/api/policies`, etc.)
3. tRPC (TypeScript RPC)
4. GraphQL (Relay, Apollo)

---

## Decisão

**Server Actions** (`'use server'` directive do Next.js 15).

---

## Justificativa

### O problema com REST API própria

Para fazer um cliente POSTar um formulário via REST, você precisa:

1. Criar rota `POST /api/clients/route.ts`
2. Parsear e validar o body
3. Autenticar o usuário (middleware ou dentro da route)
4. Chamar o Supabase
5. Retornar JSON com status code correto
6. No cliente: `fetch('/api/clients', { method: 'POST', body: JSON.stringify(data) })`
7. Handle loading state, error state
8. Revalidar o cache manualmente

**Resultado:** ~80 linhas para cada endpoint CRUD básico.

### O que Server Actions eliminam

```typescript
// src/app/actions/clients.ts
'use server'
export async function createClient(data: FormData) {
  const brokerId = await getBrokerId()  // Auth em 2 linhas
  const supabase = await createClient()
  const { error } = await supabase.from('clients').insert({ broker_id: brokerId, name: data.get('name') })
  if (error) throw error
  revalidatePath('/clientes')  // Cache invalidado automaticamente
}

// No componente (Server Component):
<form action={createClient}>
  <input name="name" />
  <button type="submit">Criar</button>
</form>
```

**Resultado:** ~15 linhas. Sem fetch, sem JSON, sem loading state manual (Next.js gerencia).

### Vantagens específicas do projeto

1. **Tipagem end-to-end:** A action é uma função TypeScript — o componente que a chama recebe erros de tipo em compile time. Com REST, você precisaria de zod + OpenAPI + codegen para ter o mesmo.

2. **Co-localização:** A action está no mesmo projeto que o componente. Refatorar um campo? O TypeScript aponta todos os lugares que precisam mudar.

3. **Revalidação automática:** `revalidatePath('/clientes')` invalida o cache do Server Component automaticamente — próximo `GET /clientes` busca dados frescos.

4. **Segurança implícita:** Server Actions só executam no servidor — nunca há risco de expor lógica de negócio para o browser.

5. **Simplicidade operacional:** Não há API layer separado para documentar, versionar ou fazer break-changes.

### Por que não tRPC?

tRPC oferece vantagens similares (tipagem end-to-end), mas:
- Adiciona camada de abstração desnecessária quando Server Actions já existem
- Setup mais complexo (router, context, provider, hooks)
- Server Actions são nativos do Next.js — sem dependência adicional

### Por que não GraphQL?

GraphQL é excelente para APIs públicas com múltiplos consumers. O Premia é uma aplicação SaaS fechada com um único consumer (o próprio frontend). A complexidade do GraphQL não compensa.

---

## Consequências

### Positivas
- ~60% menos boilerplate de API
- Tipagem end-to-end sem codegen
- Revalidação automática de cache
- Nenhum endpoint REST para documentar/manter

### Negativas / Trade-offs
- **Não é uma API pública:** Clientes (seguradoras, outras ferramentas) não podem chamar a "API" do Premia — não existe uma. Para integrações externas futuras, precisaríamos criar Route Handlers específicos.
- **Debug:** Server Actions aparecem como POST para `/_next/action` no DevTools — menos intuitivo que uma REST call com endpoint claro.
- **Compatibilidade:** Algumas UI libraries esperam `onSubmit` com dados de formulário — precisa adaptar para Server Actions.
- **Streaming complexo:** Operações longas (PDF grande) precisam de Route Handler, não Server Action, para streaming de response.

### Exceções — Quando usar Route Handlers

1. **PDF Generation** (`/api/relatorio/carteira/route.ts`): Retorna `application/pdf` — não é possível via Server Action
2. **Webhooks externos** (`/api/webhooks/stripe/route.ts`): Stripe não chama Server Actions
3. **Cron Jobs** (`/api/cron/birthday-notifications/route.ts`): Scheduler externo precisa de endpoint HTTP
4. **Portal público** (`/portal/[token]`): Token auth diferente de session auth

### Regras derivadas desta decisão
- Mutações de dados → Server Action em `src/app/actions/[module].ts`
- Retorno de arquivos/blobs → Route Handler em `src/app/api/[path]/route.ts`
- Webhooks e cron → Route Handler exclusivamente
- Nunca criar REST endpoints para substituir o que Server Actions já fazem
