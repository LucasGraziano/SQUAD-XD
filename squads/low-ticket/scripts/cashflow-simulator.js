#!/usr/bin/env node

/**
 * Cashflow Simulator — Low-Ticket Squad
 * Simula cenários financeiros completos para ofertas low-ticket LATAM.
 *
 * Uso: node cashflow-simulator.js <command> [options]
 *
 * Commands:
 *   full-simulation     Simulação completa com 3 cenários
 *   ltv-projection      Projeção de LTV por período (7, 30, 60, 90 dias)
 *   sensitivity         Análise de sensibilidade (impacto de variações)
 *   kill-thresholds     Gerar thresholds de kill/iterate/scale
 *   country-comparison  Comparar viabilidade por país LATAM
 */

const args = process.argv.slice(2);
const command = args[0];

function parseFlag(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return parseFloat(args[idx + 1]);
}

function parseStringFlag(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1];
}

// ── UNIT ECONOMICS ENGINE ──────────────────────────────────

function calculateUnitEconomics(params) {
  const {
    price = 19,
    bumpPrice = 9,
    bumpRate = 0.35,
    upsell1Price = 47,
    upsell1Rate = 0.20,
    upsell2Price = 29,
    upsell2Rate = 0.15,
    gatewayFee = 0.05
  } = params;

  const aov = price
    + (bumpPrice * bumpRate)
    + (upsell1Price * upsell1Rate)
    + (upsell2Price * upsell2Rate);

  const fees = aov * gatewayFee;
  const netRevenue = aov - fees;

  return { price, bumpPrice, bumpRate, upsell1Price, upsell1Rate, upsell2Price, upsell2Rate, aov, fees, netRevenue, gatewayFee };
}

// ── FULL SIMULATION ────────────────────────────────────────

function fullSimulation() {
  const params = {
    price: parseFlag('--price') || 19,
    bumpPrice: parseFlag('--bump-price') || 9,
    bumpRate: parseFlag('--bump-rate') || 0.35,
    upsell1Price: parseFlag('--upsell1-price') || 47,
    upsell1Rate: parseFlag('--upsell1-rate') || 0.20,
    upsell2Price: parseFlag('--upsell2-price') || 29,
    upsell2Rate: parseFlag('--upsell2-rate') || 0.15,
    gatewayFee: parseFlag('--gateway-fee') || 0.05
  };

  const budget = parseFlag('--budget') || 500;
  const days = parseFlag('--days') || 30;

  const ue = calculateUnitEconomics(params);

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║     CASHFLOW SIMULATOR — LOW-TICKET LATAM       ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  console.log('── UNIT ECONOMICS ─────────────────────────────────');
  console.log(`  Front-end:          $${ue.price.toFixed(2)}`);
  console.log(`  Bump ($${ue.bumpPrice} @ ${(ue.bumpRate*100).toFixed(0)}%):     +$${(ue.bumpPrice * ue.bumpRate).toFixed(2)}`);
  console.log(`  Upsell 1 ($${ue.upsell1Price} @ ${(ue.upsell1Rate*100).toFixed(0)}%): +$${(ue.upsell1Price * ue.upsell1Rate).toFixed(2)}`);
  console.log(`  Upsell 2 ($${ue.upsell2Price} @ ${(ue.upsell2Rate*100).toFixed(0)}%): +$${(ue.upsell2Price * ue.upsell2Rate).toFixed(2)}`);
  console.log(`  ─────────────────────────────`);
  console.log(`  AOV:                $${ue.aov.toFixed(2)}`);
  console.log(`  Taxas (${(ue.gatewayFee*100).toFixed(0)}%):        -$${ue.fees.toFixed(2)}`);
  console.log(`  Revenue líquido:    $${ue.netRevenue.toFixed(2)}`);
  console.log(`  CPA breakeven:      $${ue.netRevenue.toFixed(2)}`);
  console.log(`  CPA target (30%m):  $${(ue.netRevenue * 0.7).toFixed(2)}`);

  // 3 scenarios
  const scenarios = [
    { name: '🟢 OTIMISTA', cpaMultiplier: 0.6, cvrMultiplier: 1.3 },
    { name: '🟡 REALISTA', cpaMultiplier: 1.0, cvrMultiplier: 1.0 },
    { name: '🔴 PESSIMISTA', cpaMultiplier: 1.5, cvrMultiplier: 0.7 }
  ];

  const baseCpa = parseFlag('--cpa') || (ue.netRevenue * 0.7);
  const dailyBudget = budget / days;

  console.log('\n── SIMULAÇÃO DE CENÁRIOS ──────────────────────────');
  console.log(`  Budget total: $${budget} | Duração: ${days} dias | Daily: $${dailyBudget.toFixed(2)}/dia\n`);

  console.log('  Cenário       | CPA     | Vendas | Revenue  | Lucro    | ROAS  | LTV Meta');
  console.log('  ──────────────|─────────|────────|──────────|──────────|───────|─────────');

  scenarios.forEach(s => {
    const cpa = baseCpa * s.cpaMultiplier;
    const sales = Math.floor(budget / cpa);
    const revenue = sales * ue.netRevenue;
    const profit = revenue - budget;
    const roas = revenue / budget;
    const ltvMet = ue.netRevenue >= (cpa * 2) ? '✅' : '❌';

    console.log(
      `  ${s.name.padEnd(14)} | $${cpa.toFixed(2).padStart(5)}  | ${String(sales).padStart(6)} | $${revenue.toFixed(0).padStart(8)} | $${profit.toFixed(0).padStart(8)} | ${roas.toFixed(2).padStart(5)}x | ${ltvMet} ${ue.netRevenue.toFixed(2)} vs ${(cpa*2).toFixed(2)}`
    );
  });

  console.log('\n  * LTV Meta: LTV 30d ≥ 2x CPA (regra de escala)');

  // Monthly projection
  console.log('\n── PROJEÇÃO MENSAL (cenário realista) ─────────────');
  const months = [1, 2, 3, 6];
  const monthlySales = Math.floor(budget / baseCpa);
  console.log('  Mês | Budget   | Vendas | Revenue   | Lucro acum. | Clientes');
  console.log('  ────|──────────|────────|───────────|─────────────|─────────');

  let accumProfit = 0;
  let accumClients = 0;
  months.forEach(m => {
    const mBudget = budget * m;
    const mSales = monthlySales * m;
    const mRevenue = mSales * ue.netRevenue;
    accumProfit += (mRevenue - budget);
    accumClients += monthlySales;
    console.log(
      `  ${String(m).padStart(3)}  | $${mBudget.toFixed(0).padStart(8)} | ${String(mSales).padStart(6)} | $${mRevenue.toFixed(0).padStart(9)} | $${accumProfit.toFixed(0).padStart(11)} | ${String(accumClients).padStart(8)}`
    );
  });
}

// ── LTV PROJECTION ─────────────────────────────────────────

function ltvProjection() {
  const params = {
    price: parseFlag('--price') || 19,
    bumpPrice: parseFlag('--bump-price') || 9,
    bumpRate: parseFlag('--bump-rate') || 0.35,
    upsell1Price: parseFlag('--upsell1-price') || 47,
    upsell1Rate: parseFlag('--upsell1-rate') || 0.20,
    upsell2Price: parseFlag('--upsell2-price') || 29,
    upsell2Rate: parseFlag('--upsell2-rate') || 0.15,
    gatewayFee: parseFlag('--gateway-fee') || 0.05
  };

  const subscriptionPrice = parseFlag('--sub-price') || 19;
  const subscriptionRate = parseFlag('--sub-rate') || 0.10;
  const churnRate = parseFlag('--churn') || 0.15;
  const crossSellPrice = parseFlag('--cross-price') || 37;
  const crossSellRate = parseFlag('--cross-rate') || 0.05;

  const ue = calculateUnitEconomics(params);

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║          LTV PROJECTION — BY PERIOD             ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const periods = [
    { days: 0, label: 'Dia 0 (Compra)', base: ue.aov, add: 0 },
    { days: 7, label: 'Dia 7', base: ue.aov, add: 0 },
    { days: 30, label: 'Dia 30', base: ue.aov, add: subscriptionPrice * subscriptionRate },
    { days: 60, label: 'Dia 60', base: ue.aov, add: (subscriptionPrice * subscriptionRate * 2 * (1 - churnRate)) + (crossSellPrice * crossSellRate) },
    { days: 90, label: 'Dia 90', base: ue.aov, add: (subscriptionPrice * subscriptionRate * 3 * Math.pow(1 - churnRate, 2)) + (crossSellPrice * crossSellRate * 1.5) }
  ];

  console.log('  Período    | LTV Bruto | Taxas   | LTV Líquido | Componentes');
  console.log('  ───────────|───────────|─────────|─────────────|──────────────────');

  periods.forEach(p => {
    const ltv = p.base + p.add;
    const fees = ltv * params.gatewayFee;
    const netLtv = ltv - fees;

    let components = `Front($${params.price})`;
    if (p.days >= 0) components += ` + Bump + Ups`;
    if (p.days >= 30) components += ` + Sub`;
    if (p.days >= 60) components += ` + Cross`;

    console.log(
      `  ${p.label.padEnd(11)} | $${ltv.toFixed(2).padStart(9)} | $${fees.toFixed(2).padStart(7)} | $${netLtv.toFixed(2).padStart(11)} | ${components}`
    );
  });

  const cpa = parseFlag('--cpa') || (ue.netRevenue * 0.7);
  console.log(`\n  CPA atual/target: $${cpa.toFixed(2)}`);
  console.log(`  LTV 30d / CPA ratio: ${((ue.aov + subscriptionPrice * subscriptionRate) * (1 - params.gatewayFee) / cpa).toFixed(2)}x`);
  console.log(`  Meta: ≥ 2.0x para escalar`);
}

// ── SENSITIVITY ANALYSIS ───────────────────────────────────

function sensitivityAnalysis() {
  const params = {
    price: parseFlag('--price') || 19,
    bumpPrice: parseFlag('--bump-price') || 9,
    bumpRate: parseFlag('--bump-rate') || 0.35,
    upsell1Price: parseFlag('--upsell1-price') || 47,
    upsell1Rate: parseFlag('--upsell1-rate') || 0.20,
    upsell2Price: parseFlag('--upsell2-price') || 29,
    upsell2Rate: parseFlag('--upsell2-rate') || 0.15,
    gatewayFee: parseFlag('--gateway-fee') || 0.05
  };

  const budget = parseFlag('--budget') || 500;
  const baseCpa = parseFlag('--cpa') || 15;

  const ue = calculateUnitEconomics(params);

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║       SENSITIVITY ANALYSIS — WHAT IF?           ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // CPA sensitivity
  console.log('── Se CPA mudar... ────────────────────────────────');
  console.log('  CPA      | Vendas | Revenue  | Lucro    | ROAS  | Decisão');
  console.log('  ─────────|────────|──────────|──────────|───────|────────');

  const cpaVariations = [-30, -20, -10, 0, 10, 20, 30, 50];
  cpaVariations.forEach(pct => {
    const cpa = baseCpa * (1 + pct / 100);
    const sales = Math.floor(budget / cpa);
    const revenue = sales * ue.netRevenue;
    const profit = revenue - budget;
    const roas = revenue / budget;
    const decision = profit > budget * 0.3 ? 'SCALE' : profit > 0 ? 'ITERATE' : 'KILL';
    const icon = decision === 'SCALE' ? '🟢' : decision === 'ITERATE' ? '🟡' : '🔴';

    console.log(
      `  $${cpa.toFixed(2).padStart(6)} (${pct >= 0 ? '+' : ''}${pct}%) | ${String(sales).padStart(6)} | $${revenue.toFixed(0).padStart(8)} | $${profit.toFixed(0).padStart(8)} | ${roas.toFixed(2).padStart(5)}x | ${icon} ${decision}`
    );
  });

  // Bump rate sensitivity
  console.log('\n── Se Bump Rate mudar... ──────────────────────────');
  console.log('  Bump Rate | AOV     | Net Rev | Impacto/venda');
  console.log('  ──────────|─────────|─────────|──────────────');

  [0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.50].forEach(rate => {
    const p = { ...params, bumpRate: rate };
    const ueVar = calculateUnitEconomics(p);
    const diff = ueVar.netRevenue - ue.netRevenue;
    console.log(
      `  ${(rate * 100).toFixed(0).padStart(5)}%     | $${ueVar.aov.toFixed(2).padStart(7)} | $${ueVar.netRevenue.toFixed(2).padStart(7)} | ${diff >= 0 ? '+' : ''}$${diff.toFixed(2)}`
    );
  });

  // Upsell 1 rate sensitivity
  console.log('\n── Se Upsell 1 Rate mudar... ──────────────────────');
  console.log('  Up1 Rate | AOV     | Net Rev | Impacto/venda');
  console.log('  ─────────|─────────|─────────|──────────────');

  [0.05, 0.10, 0.15, 0.20, 0.25, 0.30].forEach(rate => {
    const p = { ...params, upsell1Rate: rate };
    const ueVar = calculateUnitEconomics(p);
    const diff = ueVar.netRevenue - ue.netRevenue;
    console.log(
      `  ${(rate * 100).toFixed(0).padStart(5)}%    | $${ueVar.aov.toFixed(2).padStart(7)} | $${ueVar.netRevenue.toFixed(2).padStart(7)} | ${diff >= 0 ? '+' : ''}$${diff.toFixed(2)}`
    );
  });
}

// ── KILL THRESHOLDS ────────────────────────────────────────

function killThresholds() {
  const params = {
    price: parseFlag('--price') || 19,
    bumpPrice: parseFlag('--bump-price') || 9,
    bumpRate: parseFlag('--bump-rate') || 0.35,
    upsell1Price: parseFlag('--upsell1-price') || 47,
    upsell1Rate: parseFlag('--upsell1-rate') || 0.20,
    upsell2Price: parseFlag('--upsell2-price') || 29,
    upsell2Rate: parseFlag('--upsell2-rate') || 0.15,
    gatewayFee: parseFlag('--gateway-fee') || 0.05
  };

  const ue = calculateUnitEconomics(params);
  const cpaTarget = ue.netRevenue * 0.7;

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║     KILL / ITERATE / SCALE — THRESHOLDS         ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  console.log('── THRESHOLDS CALCULADOS ──────────────────────────\n');

  console.log('  🟢 SCALE (aumentar budget)');
  console.log(`     CPA < $${cpaTarget.toFixed(2)} por 3+ dias consecutivos`);
  console.log(`     ROAS > ${(ue.netRevenue / cpaTarget).toFixed(2)}x estável`);
  console.log(`     CTR > 1.5% (Meta Ads)`);
  console.log(`     CVR > 2.0% (LP)`);
  console.log(`     Volume: ≥ 5 vendas/dia`);

  console.log('\n  🟡 ITERATE (ajustar e retestar)');
  console.log(`     CPA entre $${cpaTarget.toFixed(2)} e $${ue.netRevenue.toFixed(2)}`);
  console.log(`     ROAS entre 1.0x e ${(ue.netRevenue / cpaTarget).toFixed(2)}x`);
  console.log(`     CTR entre 0.5% e 1.5%`);
  console.log(`     CVR entre 1.0% e 2.0%`);

  console.log('\n  🔴 KILL (pausar imediatamente)');
  console.log(`     CPA > $${(ue.netRevenue * 1.3).toFixed(2)} por 3+ dias`);
  console.log(`     ROAS < 1.0x com spend > $${(ue.netRevenue * 10).toFixed(0)}`);
  console.log(`     CTR < 0.5% após 1000+ impressões`);
  console.log(`     CVR < 0.5% após 500+ cliques`);
  console.log(`     Zero conversões após gastar $${(cpaTarget * 5).toFixed(0)}`);

  console.log('\n── JANELAS DE TESTE ──────────────────────────────');
  console.log(`     Teste de criativo:  3-5 dias, $${(cpaTarget * 3).toFixed(0)}-$${(cpaTarget * 5).toFixed(0)} por variação`);
  console.log(`     Teste de audiência:  5-7 dias, $${(cpaTarget * 5).toFixed(0)}-$${(cpaTarget * 10).toFixed(0)} por segmento`);
  console.log(`     Teste de LP:         7-14 dias, mín. 200 visitantes por variante`);
  console.log(`     Teste de preço:      14+ dias, mín. 100 vendas por variante`);

  console.log('\n── MÍNIMOS DE DADOS ──────────────────────────────');
  console.log(`     Decisão sobre criativo:  ≥ 1000 impressões`);
  console.log(`     Decisão sobre LP:        ≥ 200 cliques`);
  console.log(`     Decisão sobre oferta:    ≥ 50 checkouts iniciados`);
  console.log(`     Decisão sobre escala:    ≥ 3 dias consecutivos de dados`);
}

// ── COUNTRY COMPARISON ─────────────────────────────────────

function countryComparison() {
  const params = {
    price: parseFlag('--price') || 19,
    bumpPrice: parseFlag('--bump-price') || 9,
    bumpRate: parseFlag('--bump-rate') || 0.35,
    upsell1Price: parseFlag('--upsell1-price') || 47,
    upsell1Rate: parseFlag('--upsell1-rate') || 0.20,
    upsell2Price: parseFlag('--upsell2-price') || 29,
    upsell2Rate: parseFlag('--upsell2-rate') || 0.15,
    gatewayFee: parseFlag('--gateway-fee') || 0.05
  };

  const budget = parseFlag('--budget') || 500;
  const ue = calculateUnitEconomics(params);

  // Estimated CPMs and conversion rates by country
  const countries = [
    { code: 'CO', name: 'Colômbia', cpm: 3.5, ctr: 1.2, cvr: 2.5, cardRate: 0.65 },
    { code: 'MX', name: 'México', cpm: 5.0, ctr: 1.0, cvr: 2.0, cardRate: 0.55 },
    { code: 'CR', name: 'Costa Rica', cpm: 6.0, ctr: 0.9, cvr: 1.8, cardRate: 0.70 },
    { code: 'CL', name: 'Chile', cpm: 4.5, ctr: 1.1, cvr: 2.2, cardRate: 0.75 },
    { code: 'PE', name: 'Peru', cpm: 2.5, ctr: 1.3, cvr: 2.0, cardRate: 0.45 },
    { code: 'AR', name: 'Argentina', cpm: 2.0, ctr: 1.5, cvr: 1.5, cardRate: 0.30 }
  ];

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║    COUNTRY COMPARISON — LATAM VIABILITY         ║');
  console.log('╚══════════════════════════════════════════════════╝\n');
  console.log(`  Budget: $${budget} | AOV: $${ue.aov.toFixed(2)} | Net Rev: $${ue.netRevenue.toFixed(2)}\n`);

  console.log('  País       | CPM   | CTR   | CVR   | CPA est. | Vendas | Lucro    | Cartão | Score');
  console.log('  ───────────|───────|───────|───────|──────────|────────|──────────|────────|──────');

  const scored = countries.map(c => {
    const impressions = (budget / c.cpm) * 1000;
    const clicks = impressions * (c.ctr / 100);
    const effectiveClicks = clicks * c.cardRate;
    const sales = Math.floor(effectiveClicks * (c.cvr / 100));
    const cpa = sales > 0 ? budget / sales : 999;
    const revenue = sales * ue.netRevenue;
    const profit = revenue - budget;

    // Score: lower CPA = better, higher card rate = better
    const cpaScore = Math.max(0, 10 - (cpa / ue.netRevenue) * 5);
    const volumeScore = Math.min(10, sales / 5);
    const cardScore = c.cardRate * 10;
    const score = ((cpaScore + volumeScore + cardScore) / 3).toFixed(1);

    return { ...c, impressions, clicks, sales, cpa, revenue, profit, score: parseFloat(score) };
  });

  scored.sort((a, b) => b.score - a.score);

  scored.forEach((c, i) => {
    const icon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    console.log(
      `${icon} ${c.name.padEnd(10)} | $${c.cpm.toFixed(1).padStart(4)}  | ${c.ctr.toFixed(1).padStart(4)}% | ${c.cvr.toFixed(1).padStart(4)}% | $${c.cpa.toFixed(2).padStart(7)}  | ${String(c.sales).padStart(6)} | $${c.profit.toFixed(0).padStart(8)} | ${(c.cardRate*100).toFixed(0).padStart(4)}%   | ${c.score.toFixed(1)}`
    );
  });

  console.log('\n  * CPM/CTR/CVR são estimativas baseadas em benchmarks LATAM');
  console.log('  * Card Rate = % do público com cartão internacional/digital');
  console.log('  * Score = média ponderada de CPA, volume e taxa de cartão');
}

// ── HELP ───────────────────────────────────────────────────

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════╗
║       CASHFLOW SIMULATOR — LOW-TICKET LATAM     ║
╚══════════════════════════════════════════════════╝

Commands:
  full-simulation     Simulação completa com 3 cenários
    --budget, --days, --price, --bump-price, --bump-rate,
    --upsell1-price, --upsell1-rate, --upsell2-price,
    --upsell2-rate, --gateway-fee, --cpa

  ltv-projection      Projeção de LTV por período
    --price, --sub-price, --sub-rate, --churn,
    --cross-price, --cross-rate, --cpa

  sensitivity         Análise de sensibilidade
    --budget, --cpa, --price, --bump-rate, --upsell1-rate

  kill-thresholds     Thresholds de kill/iterate/scale
    --price, --bump-price, --bump-rate, etc.

  country-comparison  Viabilidade por país LATAM
    --budget, --price, --bump-rate, etc.

Examples:
  node cashflow-simulator.js full-simulation --budget 500 --cpa 12
  node cashflow-simulator.js ltv-projection --price 19 --cpa 12
  node cashflow-simulator.js sensitivity --budget 500 --cpa 15
  node cashflow-simulator.js kill-thresholds --price 19
  node cashflow-simulator.js country-comparison --budget 500
`);
}

// ── ROUTER ─────────────────────────────────────────────────

switch (command) {
  case 'full-simulation': fullSimulation(); break;
  case 'ltv-projection': ltvProjection(); break;
  case 'sensitivity': sensitivityAnalysis(); break;
  case 'kill-thresholds': killThresholds(); break;
  case 'country-comparison': countryComparison(); break;
  default: showHelp();
}
