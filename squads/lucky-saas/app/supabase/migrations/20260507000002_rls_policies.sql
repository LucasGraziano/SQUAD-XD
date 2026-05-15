-- =============================================================
-- Lucky SaaS — RLS Policies
-- Migration: 20260507000002_rls_policies.sql
-- =============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_sell_opportunities ENABLE ROW LEVEL SECURITY;

-- Função helper no schema PUBLIC (auth schema não permite criação pelo SQL Editor)
CREATE OR REPLACE FUNCTION public.get_broker_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id FROM public.brokers WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ── BROKERS ──
CREATE POLICY "brokers_select" ON brokers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "brokers_insert" ON brokers
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "brokers_update" ON brokers
    FOR UPDATE USING (user_id = auth.uid());

-- ── CLIENTS ──
CREATE POLICY "clients_all" ON clients
    FOR ALL USING (broker_id = public.get_broker_id())
    WITH CHECK (broker_id = public.get_broker_id());

-- ── LEADS ──
CREATE POLICY "leads_all" ON leads
    FOR ALL USING (broker_id = public.get_broker_id())
    WITH CHECK (broker_id = public.get_broker_id());

-- ── LEAD ACTIVITIES ──
CREATE POLICY "lead_activities_all" ON lead_activities
    FOR ALL USING (broker_id = public.get_broker_id())
    WITH CHECK (broker_id = public.get_broker_id());

-- ── POLICIES (apólices) ──
CREATE POLICY "policies_all" ON policies
    FOR ALL USING (broker_id = public.get_broker_id())
    WITH CHECK (broker_id = public.get_broker_id());

-- ── COMMISSIONS ──
CREATE POLICY "commissions_all" ON commissions
    FOR ALL USING (broker_id = public.get_broker_id())
    WITH CHECK (broker_id = public.get_broker_id());

-- ── ALERTS ──
CREATE POLICY "alerts_all" ON alerts
    FOR ALL USING (broker_id = public.get_broker_id())
    WITH CHECK (broker_id = public.get_broker_id());

-- ── CLIENT EVENTS ──
CREATE POLICY "client_events_all" ON client_events
    FOR ALL USING (broker_id = public.get_broker_id())
    WITH CHECK (broker_id = public.get_broker_id());

-- ── CROSS SELL ──
CREATE POLICY "cross_sell_all" ON cross_sell_opportunities
    FOR ALL USING (broker_id = public.get_broker_id())
    WITH CHECK (broker_id = public.get_broker_id());
