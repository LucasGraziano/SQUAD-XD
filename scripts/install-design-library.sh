#!/bin/bash
# install-design-library.sh — instala todos os 70 brands do npx getdesign@latest
# Uso: bash scripts/install-design-library.sh
# Re-executar para atualizar com --force: bash scripts/install-design-library.sh --force

FORCE=""
if [ "$1" == "--force" ]; then
  FORCE="--force"
  echo "Modo --force ativado: sobrescrevendo brands existentes"
fi

OUT_DIR=".aiox-core/knowledge/design-systems/brands"
mkdir -p "$OUT_DIR"

BRANDS=(
  airbnb airtable apple binance bmw bmw-m bugatti cal claude clay
  clickhouse cohere coinbase composio cursor elevenlabs expo ferrari
  figma framer hashicorp ibm intercom kraken lamborghini linear.app
  lovable mastercard meta minimax mintlify miro mistral.ai mongodb
  nike notion nvidia ollama opencode.ai pinterest playstation posthog
  raycast renault replicate resend revolut runwayml sanity sentry
  shopify slack spacex spotify starbucks stripe supabase superhuman
  tesla theverge together.ai uber vercel vodafone voltagent warp
  webflow wired wise x.ai zapier
)

TOTAL=${#BRANDS[@]}
COUNT=0
FAILED=()

for brand in "${BRANDS[@]}"; do
  COUNT=$((COUNT + 1))
  FILE="$OUT_DIR/${brand}.md"

  if [ -f "$FILE" ] && [ -z "$FORCE" ]; then
    echo "[$COUNT/$TOTAL] SKIP $brand (já existe)"
    continue
  fi

  echo "[$COUNT/$TOTAL] Instalando $brand..."
  if npx getdesign@latest add "$brand" --out "$FILE" 2>/dev/null; then
    echo "[$COUNT/$TOTAL] OK $brand"
  else
    echo "[$COUNT/$TOTAL] FAIL $brand"
    FAILED+=("$brand")
  fi
done

echo ""
echo "=== CONCLUÍDO ==="
echo "Total: $TOTAL brands"
echo "Instalados: $((TOTAL - ${#FAILED[@]}))"

if [ ${#FAILED[@]} -gt 0 ]; then
  echo "Falhas: ${FAILED[*]}"
fi
