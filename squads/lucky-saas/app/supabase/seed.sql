-- =============================================================
-- Lucky SaaS — Seed para desenvolvimento
-- ATENÇÃO: Requer um usuário auth existente — atualize o user_id
-- =============================================================

-- Substitua com o UUID do seu usuário de teste no Supabase Auth
DO $$
DECLARE
    v_user_id UUID := 'SUBSTITUA-PELO-UUID-DO-USUARIO';
    v_broker_id UUID;
    v_client1_id UUID;
    v_client2_id UUID;
    v_client3_id UUID;
BEGIN
    -- Broker
    INSERT INTO brokers (user_id, name, creci, phone, email, plan, settings)
    VALUES (
        v_user_id,
        'Lucky Corretora de Seguros',
        '123456-SP',
        '(11) 99999-0001',
        'lucky@corretora.com.br',
        'pro',
        '{"ramos": ["auto", "vida", "saude", "residencial"], "cart_size": "50-200"}'::jsonb
    )
    RETURNING id INTO v_broker_id;

    -- Clients
    INSERT INTO clients (broker_id, name, phone, email, birth_date)
    VALUES (v_broker_id, 'Ana Santos', '(11) 99111-1111', 'ana@email.com', '1985-08-14')
    RETURNING id INTO v_client1_id;

    INSERT INTO clients (broker_id, name, phone, email, birth_date)
    VALUES (v_broker_id, 'João Lima', '(11) 99222-2222', 'joao@email.com', '1978-03-22')
    RETURNING id INTO v_client2_id;

    INSERT INTO clients (broker_id, name, phone, email)
    VALUES (v_broker_id, 'Maria Costa', '(11) 99333-3333', 'maria@email.com')
    RETURNING id INTO v_client3_id;

    -- Policies
    INSERT INTO policies (broker_id, client_id, ramo, seguradora, start_date, end_date, premium_total, commission_pct)
    VALUES
        (v_broker_id, v_client1_id, 'auto', 'Porto Seguro', '2025-12-01', '2026-12-01', 1800.00, 20),
        (v_broker_id, v_client2_id, 'vida', 'Caixa Seguros', '2025-01-15', '2026-01-15', 3600.00, 20),
        (v_broker_id, v_client3_id, 'saude', 'Amil', '2025-03-01', '2026-03-01', 8400.00, 10);

    -- Leads
    INSERT INTO leads (broker_id, name, phone, ramo, source, status)
    VALUES
        (v_broker_id, 'Carlos Mendes', '(11) 99444-4444', 'auto', 'instagram', 'novo'),
        (v_broker_id, 'Fernanda Oliveira', '(11) 99555-5555', 'vida', 'indicacao', 'cotacao_enviada'),
        (v_broker_id, 'Roberto Silva', '(11) 99666-6666', 'saude', 'manual', 'negociacao');

    RAISE NOTICE 'Seed concluído. Broker ID: %', v_broker_id;
END $$;
