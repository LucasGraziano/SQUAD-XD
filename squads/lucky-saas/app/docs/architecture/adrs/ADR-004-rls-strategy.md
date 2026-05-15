# ADR-004 — Estratégia de Isolamento Multi-Tenant via RLS

**Status:** Aceito
**Data:** 2026-05-07
**Decisores:** @architect (Aria), @data-engineer (Dara), @master (Orion)

---

## Contexto

O Premia é um SaaS multi-tenant: múltiplos corretores (tenants) compartilham o mesmo banco de dados. O isolamento de dados é **crítico** — um corretor não pode ver os dados de outro corretor.

**Estratégias de isolamento multi-tenant consideradas:**

1. **Database-per-tenant:** Um banco PostgreSQL por corretor
2. **Schema-per-tenant:** Um schema (`schema_corretor_X`) por corretor no mesmo banco
3. **Row-level isolation via application code:** `WHERE broker_id = $currentBrokerId` em toda query
4. **Row-level isolation via RLS** (escolhido)

---

## Decisão

**RLS (Row Level Security) nativo do PostgreSQL** com uma função helper `get_broker_id()`.

---

## Justificativa

### Por que não Database-per-tenant?

- **Custo inviável:** Premia começa com plano gratuito do Supabase e cresce. 1.000 corretores = 1.000 projetos Supabase = custo astronômico.
- **Operação complexa:** Migrations, backups, e atualizações em 1.000 bancos diferentes é inviável para equipe pequena.
- **Justificado apenas para grandes Enterprise** com compliance rigoroso (PCI-DSS, HIPAA) — não é o caso.

### Por que não Schema-per-tenant?

- Mesmos problemas de escala que database-per-tenant, menos graves
- PostgreSQL tem limite prático de ~1.000 schemas em performance aceitável
- Migrations em múltiplos schemas é complexo

### Por que não Application-Level Isolation?

Isolamento via application code (`WHERE broker_id = ...` em toda query):

**Problema fundamental:** Um único bug no código de aplicação pode expor dados de todos os tenants.

Exemplos reais de falhas:
```typescript
// Dev cansado esquece o WHERE
const clients = await supabase.from('clients').select('*')  // VAZA TODOS OS CLIENTES

// Query de debug fica em produção
const allAlerts = await supabase.from('alerts').select('*').eq('status', 'pending')
// Retorna alertas de TODOS os brokers

// Paginação implementada errada
const page = await supabase.from('policies').range(0, 49)
// Primeiras 50 apólices de QUALQUER broker
```

Cada query nova que qualquer dev escreve é um ponto potencial de falha. Com equipe crescendo, isso é insustentável.

### Por que RLS?

**Defense in depth:** O banco de dados garante isolamento independente do código.

```sql
-- Uma vez configurada, esta policy age em TODA query:
CREATE POLICY "clients_all" ON clients
  FOR ALL 
  USING (broker_id = public.get_broker_id())
  WITH CHECK (broker_id = public.get_broker_id());
```

Agora, `SELECT * FROM clients` (sem nenhum WHERE) retorna APENAS os clientes do broker autenticado. O isolamento é garantido pelo banco, não pelo código.

### A função `get_broker_id()` — Decisão de Design

```sql
CREATE OR REPLACE FUNCTION public.get_broker_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT id FROM public.brokers WHERE user_id = auth.uid() LIMIT 1;
$$;
```

**Por que `SECURITY DEFINER`?** Sem ele, a função rodaria com as permissões do usuário chamador. Com `SECURITY DEFINER`, roda com permissões do owner (que tem acesso à tabela `brokers`). Isso evita que o usuário precise de permissões diretas na tabela `brokers` para a função funcionar.

**Por que `STABLE`?** Indica ao PostgreSQL que a função retorna o mesmo resultado para os mesmos inputs dentro de uma transaction. O planner pode cachear chamadas repetidas — importante para políticas que são verificadas em cada row de cada query.

**Por que na schema `public` e não `auth`?** O schema `auth` no Supabase é gerenciado internamente e não permite criação de funções customizadas via SQL editor.

---

## Implementação

### Toda nova tabela deve seguir este padrão:

```sql
-- 1. Criar tabela COM broker_id
CREATE TABLE nova_tabela (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    -- ... outros campos
);

-- 2. Habilitar RLS (obrigatório — desabilitado por padrão)
ALTER TABLE nova_tabela ENABLE ROW LEVEL SECURITY;

-- 3. Criar policy
CREATE POLICY "nova_tabela_all" ON nova_tabela
  FOR ALL 
  USING (broker_id = public.get_broker_id())
  WITH CHECK (broker_id = public.get_broker_id());
```

### Casos Especiais

**Portal do Cliente:** Clientes acessam via token, não via session de auth. O código do portal usa `admin client` (service role) que bypassa RLS — o isolamento é garantido via lógica de aplicação (validar token → extrair client_id → filtrar por client_id explicitamente).

**Cron Jobs:** Mesma situação — admin client bypassa RLS, cron filtra explicitamente por broker ou processa todos.

**Tabela `brokers`:** RLS própria usando `user_id = auth.uid()` diretamente (sem `get_broker_id()` para evitar recursão).

---

## Consequências

### Positivas
- Isolamento garantido pelo banco — bugs de aplicação não vazam dados entre corretores
- Queries mais simples no código de aplicação (sem WHERE broker_id em todo lugar)
- Supabase RLS é battle-tested — usado em produção por milhares de projetos
- Auditoria: qualquer SELECT retornará apenas dados do tenant correto — logs limpos

### Negativas / Trade-offs
- **Admin operations:** Qualquer operação cross-tenant (cron, relatório de plataforma) exige service role key — deve ser estritamente controlada
- **Debugging:** Query no Supabase Studio como admin vê todos os dados (sem RLS) — pode causar confusão sobre o que usuário vê
- **Curva de aprendizado:** Devs não familiarizados com PostgreSQL security podem ter dificuldade para entender por que uma query "funciona" sem WHERE
- **Portal:** Exceção ao modelo (admin client) — requer atenção especial para não vazar dados

### Regras derivadas desta decisão
- TODA nova tabela com dados de broker: RLS habilitado + policy `broker_id = get_broker_id()`
- NUNCA usar admin client em paths de usuário (Server Components, Server Actions)
- Admin client EXCLUSIVO para: cron jobs, webhooks externos, operações de admin
- Cheklist de code review: toda nova tabela tem RLS? toda nova query de admin tem filtro explícito?
