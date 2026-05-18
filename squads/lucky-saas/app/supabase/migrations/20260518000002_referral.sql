-- Story 6.7: Referral Program
CREATE TABLE referral_codes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id  UUID NOT NULL UNIQUE REFERENCES brokers(id) ON DELETE CASCADE,
  code       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE referral_conversions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id   UUID NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  referred_broker_id UUID NOT NULL UNIQUE REFERENCES brokers(id) ON DELETE CASCADE,
  converted_at       TIMESTAMPTZ,
  reward_applied_at  TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE brokers ADD COLUMN IF NOT EXISTS referral_code_id UUID REFERENCES referral_codes(id);

-- RLS
ALTER TABLE referral_codes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_conversions ENABLE ROW LEVEL SECURITY;

-- Corretor vê apenas seu próprio código
CREATE POLICY "broker sees own referral code"
  ON referral_codes FOR SELECT
  USING (broker_id IN (SELECT id FROM brokers WHERE user_id = auth.uid()));

-- Qualquer pessoa pode consultar código pelo code (para validar referral no signup)
CREATE POLICY "public can read code by code"
  ON referral_codes FOR SELECT
  USING (true);

-- Corretor vê suas conversões (onde ele é o dono do código)
CREATE POLICY "broker sees own conversions"
  ON referral_conversions FOR SELECT
  USING (referral_code_id IN (
    SELECT rc.id FROM referral_codes rc
    JOIN brokers b ON rc.broker_id = b.id
    WHERE b.user_id = auth.uid()
  ));

-- Índices
CREATE INDEX idx_referral_codes_code        ON referral_codes(code);
CREATE INDEX idx_referral_codes_broker_id   ON referral_codes(broker_id);
CREATE INDEX idx_referral_conv_code_id      ON referral_conversions(referral_code_id);
CREATE INDEX idx_referral_conv_referred     ON referral_conversions(referred_broker_id);
CREATE INDEX idx_referral_conv_converted_at ON referral_conversions(converted_at) WHERE converted_at IS NOT NULL;
