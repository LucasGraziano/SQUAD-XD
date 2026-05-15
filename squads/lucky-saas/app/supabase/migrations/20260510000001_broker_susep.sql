-- Lucky SaaS — Adiciona campo SUSEP ao perfil do corretor
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS susep TEXT;
