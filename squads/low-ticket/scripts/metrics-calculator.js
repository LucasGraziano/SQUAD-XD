#!/usr/bin/env node

/**
 * Metrics Calculator — Low-Ticket Squad
 * Calcula métricas essenciais para ofertas low-ticket:
 * - ROAS e ROAS target
 * - CPA máximo (break-even)
 * - Unit economics
 * - Sample size para A/B tests
 * - Projeção de escala
 *
 * Uso: node metrics-calculator.js <command> [options]
 *
 * Commands:
 *   unit-economics  Calcula unit economics completo
 *   cpa-target      Calcula CPA máximo sustentável
 *   roas            Calcula ROAS atual e target
 *   ab-sample       Calcula sample size para A/B test
 *   scale-forecast  Projeta resultados com aumento de budget
 */

const args = process.argv.slice(2);
const command = args[0];

function parseFlag(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return parseFloat(args[idx + 1]);
}

function unitEconomics() {
  const price = parseFlag('--price') || 19.90;
  const bumpRate = parseFlag('--bump-rate') || 0.30;
  const bumpPrice = parseFlag('--bump-price') || 4;
  const upsell1Rate = parseFlag('--upsell1-rate') || 0.15;
  const upsell1Price = parseFlag('--upsell1-price') || 9;
  const upsell2Rate = parseFlag('--upsell2-rate') || 0.08;
  const upsell2Price = parseFlag('--upsell2-price') || 29;
  const gatewayFee = parseFlag('--gateway-fee') || 0.05;
  const cpa = parseFlag('--cpa') || null;

  const aov = price
    + (bumpPrice * bumpRate)
    + (upsell1Price * upsell1Rate)
    + (upsell2Price * upsell2Rate);

  const fees = aov * gatewayFee;
  const revenue = aov - fees;
  const maxCpa = revenue;

  console.log('\n=== UNIT ECONOMICS ===\n');
  console.log(`Produto principal:     $${price.toFixed(2)}`);
  console.log(`Order Bump ($${bumpPrice} @ ${(bumpRate * 100).toFixed(0)}%):  +$${(bumpPrice * bumpRate).toFixed(2)}`);
  console.log(`Upsell 1 ($${upsell1Price} @ ${(upsell1Rate * 100).toFixed(0)}%):    +$${(upsell1Price * upsell1Rate).toFixed(2)}`);
  console.log(`Upsell 2 ($${upsell2Price} @ ${(upsell2Rate * 100).toFixed(0)}%):    +$${(upsell2Price * upsell2Rate).toFixed(2)}`);
  console.log(`─────────────────────────`);
  console.log(`AOV (Average Order):   $${aov.toFixed(2)}`);
  console.log(`Taxas (${(gatewayFee * 100).toFixed(0)}%):           -$${fees.toFixed(2)}`);
  console.log(`Revenue líquido:       $${revenue.toFixed(2)}`);
  console.log(`CPA máximo (break-even): $${maxCpa.toFixed(2)}`);
  console.log(`CPA target (30% margem): $${(maxCpa * 0.7).toFixed(2)}`);

  if (cpa) {
    const profit = revenue - cpa;
    const margin = (profit / revenue) * 100;
    console.log(`\n--- Com CPA atual de $${cpa.toFixed(2)} ---`);
    console.log(`Lucro por venda:       $${profit.toFixed(2)}`);
    console.log(`Margem:                ${margin.toFixed(1)}%`);
    console.log(`Status:                ${profit > 0 ? '🟢 LUCRATIVO' : '🔴 PREJUÍZO'}`);
  }
}

function cpTarget() {
  const aov = parseFlag('--aov') || 27;
  const gatewayFee = parseFlag('--gateway-fee') || 0.05;
  const targetMargin = parseFlag('--margin') || 0.30;

  const revenue = aov * (1 - gatewayFee);
  const maxCpa = revenue;
  const targetCpa = revenue * (1 - targetMargin);

  console.log('\n=== CPA TARGET ===\n');
  console.log(`AOV:                   $${aov.toFixed(2)}`);
  console.log(`Revenue (- taxas):     $${revenue.toFixed(2)}`);
  console.log(`CPA break-even:        $${maxCpa.toFixed(2)}`);
  console.log(`CPA target (${(targetMargin * 100).toFixed(0)}% margem): $${targetCpa.toFixed(2)}`);

  console.log(`\n--- Faixas ---`);
  console.log(`🟢 Excelente: CPA < $${(targetCpa * 0.8).toFixed(2)}`);
  console.log(`🟢 Bom:       CPA < $${targetCpa.toFixed(2)}`);
  console.log(`🟡 Atenção:   CPA $${targetCpa.toFixed(2)} - $${maxCpa.toFixed(2)}`);
  console.log(`🔴 Pausar:    CPA > $${maxCpa.toFixed(2)}`);
}

function roasCalc() {
  const spend = parseFlag('--spend') || 0;
  const revenue = parseFlag('--revenue') || 0;
  const aov = parseFlag('--aov') || 27;
  const gatewayFee = parseFlag('--gateway-fee') || 0.05;

  if (!spend || !revenue) {
    console.log('Uso: node metrics-calculator.js roas --spend 100 --revenue 300');
    return;
  }

  const roas = revenue / spend;
  const netRevenue = revenue * (1 - gatewayFee);
  const netRoas = netRevenue / spend;
  const profit = netRevenue - spend;

  console.log('\n=== ROAS ANALYSIS ===\n');
  console.log(`Spend:          $${spend.toFixed(2)}`);
  console.log(`Revenue bruto:  $${revenue.toFixed(2)}`);
  console.log(`Revenue líquido: $${netRevenue.toFixed(2)}`);
  console.log(`ROAS bruto:     ${roas.toFixed(2)}x`);
  console.log(`ROAS líquido:   ${netRoas.toFixed(2)}x`);
  console.log(`Lucro:          $${profit.toFixed(2)}`);
  console.log(`Status:         ${netRoas >= 2 ? '🟢' : netRoas >= 1 ? '🟡' : '🔴'} ${netRoas >= 2 ? 'BOM' : netRoas >= 1 ? 'BREAK-EVEN' : 'PREJUÍZO'}`);

  console.log(`\n--- Targets ---`);
  console.log(`ROAS break-even:  ${(1 / (1 - gatewayFee)).toFixed(2)}x`);
  console.log(`ROAS target (30% margem): ${(1 / (1 - gatewayFee) / 0.7).toFixed(2)}x`);
}

function abSampleSize() {
  const baseRate = parseFlag('--base-rate') || 0.03;
  const mde = parseFlag('--mde') || 0.20;
  const confidence = parseFlag('--confidence') || 0.95;
  const power = parseFlag('--power') || 0.80;

  // Simplified sample size calculation (normal approximation)
  const zAlpha = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.645;
  const zBeta = power === 0.80 ? 0.842 : power === 0.90 ? 1.282 : 0.674;

  const p1 = baseRate;
  const p2 = baseRate * (1 + mde);
  const pAvg = (p1 + p2) / 2;

  const n = Math.ceil(
    (Math.pow(zAlpha * Math.sqrt(2 * pAvg * (1 - pAvg)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2))
    / Math.pow(p2 - p1, 2)
  );

  console.log('\n=== A/B TEST SAMPLE SIZE ===\n');
  console.log(`Taxa base (controle):    ${(baseRate * 100).toFixed(1)}%`);
  console.log(`MDE (melhoria mínima):   ${(mde * 100).toFixed(0)}%`);
  console.log(`Taxa esperada (variante): ${(p2 * 100).toFixed(1)}%`);
  console.log(`Confiança:               ${(confidence * 100).toFixed(0)}%`);
  console.log(`Poder estatístico:       ${(power * 100).toFixed(0)}%`);
  console.log(`─────────────────────────`);
  console.log(`Sample size por variante: ${n.toLocaleString()}`);
  console.log(`Total necessário:         ${(n * 2).toLocaleString()}`);

  console.log(`\n--- Estimativas de tempo ---`);
  const dailyVisitors = [100, 500, 1000, 5000];
  dailyVisitors.forEach(v => {
    const days = Math.ceil((n * 2) / v);
    console.log(`  ${v.toLocaleString()} visitantes/dia → ${days} dias`);
  });
}

function scaleForecast() {
  const currentSpend = parseFlag('--spend') || 0;
  const currentCpa = parseFlag('--cpa') || 0;
  const aov = parseFlag('--aov') || 27;
  const gatewayFee = parseFlag('--gateway-fee') || 0.05;

  if (!currentSpend || !currentCpa) {
    console.log('Uso: node metrics-calculator.js scale-forecast --spend 50 --cpa 12 --aov 27');
    return;
  }

  const netAov = aov * (1 - gatewayFee);

  console.log('\n=== SCALE FORECAST ===\n');
  console.log('Budget  | Vendas | Revenue | Lucro    | Margem');
  console.log('--------|--------|---------|----------|-------');

  const multipliers = [1, 1.5, 2, 3, 5, 10];
  multipliers.forEach(mult => {
    const spend = currentSpend * mult;
    // CPA increases slightly with scale (diminishing returns)
    const scaledCpa = currentCpa * (1 + (mult - 1) * 0.05);
    const sales = Math.floor(spend / scaledCpa);
    const revenue = sales * netAov;
    const profit = revenue - spend;
    const margin = ((profit / revenue) * 100);

    console.log(
      `$${spend.toFixed(0).padStart(5)}  | ${String(sales).padStart(6)} | $${revenue.toFixed(0).padStart(7)} | $${profit.toFixed(0).padStart(7)}  | ${margin.toFixed(0)}%`
    );
  });

  console.log('\n* CPA estimado com incremento de 5% por multiplicador (diminishing returns)');
}

// Help
function showHelp() {
  console.log(`
Low-Ticket Metrics Calculator

Commands:
  unit-economics  Calcula unit economics
    --price, --bump-rate, --bump-price, --upsell1-rate, --upsell1-price,
    --upsell2-rate, --upsell2-price, --gateway-fee, --cpa

  cpa-target      Calcula CPA máximo sustentável
    --aov, --gateway-fee, --margin

  roas            Calcula ROAS atual
    --spend, --revenue, --aov, --gateway-fee

  ab-sample       Sample size para A/B test
    --base-rate, --mde, --confidence, --power

  scale-forecast  Projeção de escala
    --spend, --cpa, --aov, --gateway-fee

Examples:
  node metrics-calculator.js unit-economics --price 19.90 --cpa 12
  node metrics-calculator.js cpa-target --aov 27
  node metrics-calculator.js roas --spend 100 --revenue 300
  node metrics-calculator.js ab-sample --base-rate 0.03 --mde 0.20
  node metrics-calculator.js scale-forecast --spend 50 --cpa 12
`);
}

// Router
switch (command) {
  case 'unit-economics': unitEconomics(); break;
  case 'cpa-target': cpTarget(); break;
  case 'roas': roasCalc(); break;
  case 'ab-sample': abSampleSize(); break;
  case 'scale-forecast': scaleForecast(); break;
  default: showHelp();
}
