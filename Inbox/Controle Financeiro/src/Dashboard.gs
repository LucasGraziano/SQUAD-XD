/**
 * Controle Financeiro — Dashboard (aba nativa do Sheets)
 * Visual limpo e profissional direto na planilha
 */

function setupDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName('Dashboard');
  if (!dash) dash = ss.insertSheet('Dashboard');

  dash.clear();
  dash.clearConditionalFormatRules();

  // Remover gráficos antigos
  var charts = dash.getCharts();
  for (var c = 0; c < charts.length; c++) dash.removeChart(charts[c]);

  // Setup grid
  dash.setColumnWidth(1, 20);   // margem
  dash.setColumnWidth(2, 160);
  dash.setColumnWidth(3, 120);
  dash.setColumnWidth(4, 20);   // separador
  dash.setColumnWidth(5, 160);
  dash.setColumnWidth(6, 120);
  dash.setColumnWidth(7, 20);   // separador
  dash.setColumnWidth(8, 160);
  dash.setColumnWidth(9, 120);
  dash.setColumnWidth(10, 20);  // separador
  dash.setColumnWidth(11, 160);
  dash.setColumnWidth(12, 120);

  // Fundo geral dark
  dash.getRange('A1:N50').setBackground('#1a1a2e');

  // Obter dados
  var mesRecente = getMesRecente_();
  if (!mesRecente) {
    dash.getRange('B3').setValue('Nenhuma transação encontrada.').setFontColor('#888').setFontSize(12);
    return;
  }

  // ── HEADER ──
  dash.getRange('B2:L2').merge();
  dash.getRange('B2').setValue('DASHBOARD FINANCEIRO')
    .setFontSize(18).setFontWeight('bold').setFontColor('#ffffff')
    .setHorizontalAlignment('left');

  // Filtro mês
  dash.getRange('B3').setValue('Período:').setFontColor('#888').setFontSize(10);
  dash.getRange('C3').setValue(mesRecente).setFontColor('#fff').setFontWeight('bold').setFontSize(11)
    .setBackground('#16213e').setHorizontalAlignment('center');
  dash.getRange('C3').setBorder(true, true, true, true, false, false, '#2d2d5e', SpreadsheetApp.BorderStyle.SOLID);

  // Dropdown
  var meses = getMesesDisponiveis_();
  if (meses.length > 0) {
    dash.getRange('C3').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(meses).setAllowInvalid(false).build()
    );
  }

  var mesAno = mesRecente;
  var data = calcularTudo_(mesAno);

  // ── KPI CARDS (Row 5-7) ──
  renderKPICard_(dash, 5, 2, 'RECEITA', data.kpis.receita, data.ant.receita, '#27ae60', '#d4edda');
  renderKPICard_(dash, 5, 5, 'DESPESAS', data.kpis.despesa, data.ant.despesa, '#e74c3c', '#f8d7da', true);
  renderKPICard_(dash, 5, 8, 'SALDO', data.kpis.receita - data.kpis.despesa, null, '#6c5ce7', '#e8e0ff');
  renderKPICard_(dash, 5, 11, 'APORTES', data.kpis.aportes, data.ant.aportes, '#0984e3', '#d6eaf8');

  // ── GRÁFICO DONUT (Row 10) ──
  if (Object.keys(data.gastos).length > 0) {
    criarGraficoDonut_(dash, data.gastos, mesAno);
  }

  // ── GRÁFICO TENDÊNCIA (Row 10, ao lado) ──
  criarGraficoTendencia_(dash, data.tendencia);

  // ── BUDGET TRACKING (Row 24) ──
  renderBudget_(dash, data.budget, 24);

  // ── TOP 5 GASTOS (Row 24, ao lado do budget) ──
  renderTopGastos_(dash, data.topGastos, 24);

  // ── STATUS + TAXA POUPANÇA (Row 38) ──
  renderStatusEPoupanca_(dash, data.kpis, 38);

  // Congelar
  dash.setFrozenRows(3);

  SpreadsheetApp.getUi().alert('✅ Dashboard atualizado para ' + mesAno + '!');
}

// ============================================================
// KPI CARD
// ============================================================

function renderKPICard_(dash, row, col, titulo, valor, valorAnt, corPrincipal, corFundo, inverteDelta) {
  // Fundo do card
  dash.getRange(row, col, 3, 2).setBackground(corFundo);
  dash.getRange(row, col, 3, 2).setBorder(
    true, true, true, true, false, false, corPrincipal, SpreadsheetApp.BorderStyle.SOLID
  );

  // Top bar (cor accent)
  dash.getRange(row, col, 1, 2).setBackground(corPrincipal);

  // Título
  dash.getRange(row, col).setValue(titulo)
    .setFontColor('#ffffff').setFontSize(10).setFontWeight('bold');

  // Valor
  dash.getRange(row + 1, col, 1, 2).merge();
  dash.getRange(row + 1, col).setValue(valor)
    .setNumberFormat('R$ #,##0.00').setFontSize(16).setFontWeight('bold')
    .setFontColor('#1a1a2e').setHorizontalAlignment('center');

  // Delta vs mês anterior
  if (valorAnt !== null && valorAnt !== undefined && valorAnt > 0) {
    var pct = ((valor - valorAnt) / Math.abs(valorAnt) * 100);
    var seta = pct >= 0 ? '▲' : '▼';
    var corDelta = pct >= 0 ? '#27ae60' : '#e74c3c';
    if (inverteDelta) corDelta = pct >= 0 ? '#e74c3c' : '#27ae60';

    dash.getRange(row + 2, col, 1, 2).merge();
    dash.getRange(row + 2, col).setValue(seta + ' ' + Math.abs(pct).toFixed(1) + '% vs anterior')
      .setFontColor(corDelta).setFontSize(9).setHorizontalAlignment('center');
  } else {
    dash.getRange(row + 2, col, 1, 2).merge();
    dash.getRange(row + 2, col).setValue('—').setFontColor('#999').setFontSize(9).setHorizontalAlignment('center');
  }
}

// ============================================================
// GRÁFICOS
// ============================================================

function criarGraficoDonut_(dash, gastos, mesAno) {
  var cats = Object.keys(gastos);
  var startRow = 50; // dados ocultos

  dash.getRange(startRow, 2).setValue('Categoria');
  dash.getRange(startRow, 3).setValue('Valor');
  for (var i = 0; i < cats.length; i++) {
    dash.getRange(startRow + 1 + i, 2).setValue(cats[i]);
    dash.getRange(startRow + 1 + i, 3).setValue(gastos[cats[i]]);
  }

  var dataRange = dash.getRange(startRow, 2, cats.length + 1, 2);

  var chart = dash.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(dataRange)
    .setPosition(10, 2, 0, 0)
    .setOption('title', 'Gastos por Categoria — ' + mesAno)
    .setOption('titleTextStyle', { color: '#ffffff', fontSize: 12, bold: true })
    .setOption('pieHole', 0.45)
    .setOption('backgroundColor', '#1a1a2e')
    .setOption('legend', { position: 'right', textStyle: { color: '#cccccc', fontSize: 11 } })
    .setOption('pieSliceTextStyle', { color: '#ffffff', fontSize: 10 })
    .setOption('chartArea', { left: 20, top: 40, width: '55%', height: '80%' })
    .setOption('colors', ['#6c5ce7','#00b894','#e17055','#0984e3','#fdcb6e','#e84393','#00cec9','#ff7675','#a29bfe','#55efc4','#fab1a0','#81ecec'])
    .setOption('width', 520)
    .setOption('height', 300)
    .build();

  dash.insertChart(chart);
}

function criarGraficoTendencia_(dash, tendencia) {
  var startRow = 65;

  dash.getRange(startRow, 2).setValue('Mês');
  dash.getRange(startRow, 3).setValue('Receita');
  dash.getRange(startRow, 4).setValue('Despesa');
  dash.getRange(startRow, 5).setValue('Aportes');

  for (var i = 0; i < tendencia.length; i++) {
    var t = tendencia[i];
    dash.getRange(startRow + 1 + i, 2).setValue(t.mes);
    dash.getRange(startRow + 1 + i, 3).setValue(t.receita);
    dash.getRange(startRow + 1 + i, 4).setValue(t.despesa);
    dash.getRange(startRow + 1 + i, 5).setValue(t.aportes);
  }

  var dataRange = dash.getRange(startRow, 2, tendencia.length + 1, 4);

  var chart = dash.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(dataRange)
    .setPosition(10, 7, 0, 0)
    .setOption('title', 'Tendência — Últimos 6 Meses')
    .setOption('titleTextStyle', { color: '#ffffff', fontSize: 12, bold: true })
    .setOption('backgroundColor', '#1a1a2e')
    .setOption('legend', { position: 'top', textStyle: { color: '#cccccc', fontSize: 11 } })
    .setOption('chartArea', { left: 60, top: 40, width: '80%', height: '70%' })
    .setOption('colors', ['#55efc4', '#ff7675', '#74b9ff'])
    .setOption('hAxis', { textStyle: { color: '#888888' }, gridlines: { color: '#2d2d5e' } })
    .setOption('vAxis', {
      textStyle: { color: '#888888' },
      gridlines: { color: '#2d2d5e' },
      format: 'R$ #,##0'
    })
    .setOption('width', 520)
    .setOption('height', 300)
    .build();

  dash.insertChart(chart);
}

// ============================================================
// BUDGET TRACKING
// ============================================================

function renderBudget_(dash, budget, startRow) {
  // Título
  dash.getRange(startRow, 2, 1, 5).merge();
  dash.getRange(startRow, 2).setValue('ORÇAMENTO vs GASTO')
    .setFontSize(12).setFontWeight('bold').setFontColor('#ffffff');

  // Header
  var hr = startRow + 1;
  dash.getRange(hr, 2).setValue('Categoria').setFontColor('#888').setFontSize(10).setFontWeight('bold');
  dash.getRange(hr, 3).setValue('Orçamento').setFontColor('#888').setFontSize(10).setFontWeight('bold');
  dash.getRange(hr, 4).setValue('Gasto').setFontColor('#888').setFontSize(10).setFontWeight('bold');
  dash.getRange(hr, 5).setValue('Progresso').setFontColor('#888').setFontSize(10).setFontWeight('bold');
  dash.getRange(hr, 6).setValue('%').setFontColor('#888').setFontSize(10).setFontWeight('bold');
  dash.getRange(hr, 2, 1, 5).setBackground('#16213e');

  var r = startRow + 2;
  for (var i = 0; i < budget.length; i++) {
    var b = budget[i];
    if (b.orcamento === 0 && b.gasto === 0) continue;

    var pct = b.orcamento > 0 ? (b.gasto / b.orcamento) : 0;
    var corPct = pct <= 0.7 ? '#27ae60' : pct <= 0.9 ? '#f39c12' : '#e74c3c';

    // Fundo alternado
    var bgRow = i % 2 === 0 ? '#16163a' : '#1a1a2e';
    dash.getRange(r, 2, 1, 5).setBackground(bgRow);

    dash.getRange(r, 2).setValue(b.categoria).setFontColor('#e0e0e0').setFontSize(11);
    dash.getRange(r, 3).setValue(b.orcamento).setNumberFormat('R$ #,##0').setFontColor('#888').setFontSize(11);
    dash.getRange(r, 4).setValue(b.gasto).setNumberFormat('R$ #,##0').setFontColor(corPct).setFontWeight('bold').setFontSize(11);

    // Barra visual
    var barFull = 10;
    var barFill = Math.min(Math.round(pct * barFull), barFull);
    var barra = '█'.repeat(barFill) + '░'.repeat(barFull - barFill);
    dash.getRange(r, 5).setValue(barra).setFontColor(corPct).setFontSize(10);

    // Porcentagem
    dash.getRange(r, 6).setValue((pct * 100).toFixed(0) + '%').setFontColor(corPct).setFontWeight('bold').setFontSize(11)
      .setHorizontalAlignment('right');

    r++;
  }
}

// ============================================================
// TOP 5 GASTOS
// ============================================================

function renderTopGastos_(dash, topGastos, startRow) {
  dash.getRange(startRow, 8, 1, 5).merge();
  dash.getRange(startRow, 8).setValue('TOP 5 MAIORES GASTOS')
    .setFontSize(12).setFontWeight('bold').setFontColor('#ffffff');

  var hr = startRow + 1;
  dash.getRange(hr, 8).setValue('Descrição').setFontColor('#888').setFontSize(10).setFontWeight('bold');
  dash.getRange(hr, 9).setValue('Categoria').setFontColor('#888').setFontSize(10).setFontWeight('bold');
  dash.getRange(hr, 10, 1, 2).merge();
  dash.getRange(hr, 10).setValue('Valor').setFontColor('#888').setFontSize(10).setFontWeight('bold');
  dash.getRange(hr, 8, 1, 4).setBackground('#16213e');

  var r = startRow + 2;
  for (var i = 0; i < topGastos.length; i++) {
    var t = topGastos[i];
    var bgRow = i % 2 === 0 ? '#16163a' : '#1a1a2e';
    dash.getRange(r, 8, 1, 4).setBackground(bgRow);

    dash.getRange(r, 8).setValue(t.desc).setFontColor('#e0e0e0').setFontSize(11);
    dash.getRange(r, 9).setValue(t.cat).setFontColor('#888').setFontSize(10);
    dash.getRange(r, 10, 1, 2).merge();
    dash.getRange(r, 10).setValue(t.valor).setNumberFormat('R$ #,##0.00')
      .setFontColor('#ff7675').setFontWeight('bold').setFontSize(11);
    r++;
  }
}

// ============================================================
// STATUS + TAXA POUPANÇA
// ============================================================

function renderStatusEPoupanca_(dash, kpis, startRow) {
  dash.getRange(startRow, 2, 1, 5).merge();
  dash.getRange(startRow, 2).setValue('STATUS DAS TRANSAÇÕES')
    .setFontSize(12).setFontWeight('bold').setFontColor('#ffffff');

  var r = startRow + 1;

  // Status cards
  var statusItems = [
    { label: '🟢 Classificadas', count: kpis.verdes, cor: '#27ae60' },
    { label: '🟡 Para Revisar', count: kpis.amarelas, cor: '#f39c12' },
    { label: '🔴 Manual', count: kpis.vermelhas, cor: '#e74c3c' }
  ];

  for (var i = 0; i < statusItems.length; i++) {
    var s = statusItems[i];
    var col = 2 + (i * 3);
    dash.getRange(r, col, 2, 2).setBackground('#16163a');
    dash.getRange(r, col, 2, 2).setBorder(true, true, true, true, false, false, s.cor, SpreadsheetApp.BorderStyle.SOLID);
    dash.getRange(r, col).setValue(s.count).setFontSize(22).setFontWeight('bold').setFontColor(s.cor).setHorizontalAlignment('center');
    dash.getRange(r + 1, col).setValue(s.label).setFontSize(10).setFontColor('#888').setHorizontalAlignment('center');
  }

  // Taxa de Poupança
  dash.getRange(startRow, 8, 1, 4).merge();
  dash.getRange(startRow, 8).setValue('TAXA DE POUPANÇA')
    .setFontSize(12).setFontWeight('bold').setFontColor('#ffffff');

  var taxa = kpis.receita > 0 ? (kpis.aportes / kpis.receita * 100) : 0;
  var corTaxa = taxa >= 20 ? '#27ae60' : taxa >= 10 ? '#f39c12' : '#e74c3c';

  dash.getRange(r, 8, 2, 2).setBackground('#16163a');
  dash.getRange(r, 8, 2, 2).setBorder(true, true, true, true, false, false, corTaxa, SpreadsheetApp.BorderStyle.SOLID);
  dash.getRange(r, 8, 1, 2).merge();
  dash.getRange(r, 8).setValue(taxa.toFixed(1) + '%')
    .setFontSize(28).setFontWeight('bold').setFontColor(corTaxa).setHorizontalAlignment('center');
  dash.getRange(r + 1, 8, 1, 2).merge();
  dash.getRange(r + 1, 8).setValue('Aportes / Receita')
    .setFontSize(10).setFontColor('#888').setHorizontalAlignment('center');

  // Total transações
  dash.getRange(r, 10, 2, 2).setBackground('#16163a');
  dash.getRange(r, 10, 2, 2).setBorder(true, true, true, true, false, false, '#6c5ce7', SpreadsheetApp.BorderStyle.SOLID);
  dash.getRange(r, 10, 1, 2).merge();
  dash.getRange(r, 10).setValue(kpis.total)
    .setFontSize(28).setFontWeight('bold').setFontColor('#a29bfe').setHorizontalAlignment('center');
  dash.getRange(r + 1, 10, 1, 2).merge();
  dash.getRange(r + 1, 10).setValue('Total Transações')
    .setFontSize(10).setFontColor('#888').setHorizontalAlignment('center');
}

// ============================================================
// DADOS CENTRALIZADOS
// ============================================================

function calcularTudo_(mesAno) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Transações');

  var kpis = { receita: 0, despesa: 0, aportes: 0, total: 0, verdes: 0, amarelas: 0, vermelhas: 0 };
  var gastos = {};
  var topGastos = [];

  if (!sheet || sheet.getLastRow() < 2) {
    return { kpis: kpis, ant: { receita: 0, despesa: 0, aportes: 0 }, gastos: {}, topGastos: [], tendencia: [], budget: [] };
  }

  var allData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).getValues();
  var partes = mesAno.split('/');
  var mesFiltro = parseInt(partes[0]);
  var anoFiltro = parseInt(partes[1]);

  // KPIs mês atual
  for (var i = 0; i < allData.length; i++) {
    var row = allData[i];
    var d = row[2];
    if (!(d instanceof Date)) continue;
    if (d.getMonth() + 1 !== mesFiltro || d.getFullYear() !== anoFiltro) continue;

    var tipo = row[5], cat = row[6], valor = row[7], status = row[1];
    if (typeof valor !== 'number') continue;

    kpis.total++;
    if (tipo === 'Receita') kpis.receita += valor;
    else if (tipo === 'Aporte') kpis.aportes += valor;
    else kpis.despesa += valor;

    if (status === '🟢') kpis.verdes++;
    else if (status === '🟡') kpis.amarelas++;
    else if (status === '🔴') kpis.vermelhas++;

    if (tipo === 'Despesa' && cat) {
      gastos[cat] = (gastos[cat] || 0) + valor;
      topGastos.push({
        desc: row[3], cat: cat, valor: valor,
        data: Utilities.formatDate(d, 'America/Sao_Paulo', 'dd/MM')
      });
    }
  }

  topGastos.sort(function(a, b) { return b.valor - a.valor; });
  topGastos = topGastos.slice(0, 5);

  // KPIs mês anterior
  var mAnt = mesAnteriorCalc_(mesFiltro, anoFiltro);
  var ant = { receita: 0, despesa: 0, aportes: 0 };
  for (var i = 0; i < allData.length; i++) {
    var row = allData[i];
    var d = row[2];
    if (!(d instanceof Date)) continue;
    if (d.getMonth() + 1 !== mAnt.mes || d.getFullYear() !== mAnt.ano) continue;
    var tipo = row[5], valor = row[7];
    if (typeof valor !== 'number') continue;
    if (tipo === 'Receita') ant.receita += valor;
    else if (tipo === 'Aporte') ant.aportes += valor;
    else ant.despesa += valor;
  }

  // Tendência 6 meses
  var tendencia = [];
  for (var n = 5; n >= 0; n--) {
    var m = mesAnteriorCalc_(mesFiltro, anoFiltro, n);
    var label = (m.mes < 10 ? '0' : '') + m.mes + '/' + m.ano;
    var t = { mes: label, receita: 0, despesa: 0, aportes: 0 };
    for (var i = 0; i < allData.length; i++) {
      var row = allData[i];
      var d = row[2];
      if (!(d instanceof Date)) continue;
      if (d.getMonth() + 1 !== m.mes || d.getFullYear() !== m.ano) continue;
      var tipo = row[5], valor = row[7];
      if (typeof valor !== 'number') continue;
      if (tipo === 'Receita') t.receita += valor;
      else if (tipo === 'Aporte') t.aportes += valor;
      else t.despesa += valor;
    }
    tendencia.push(t);
  }

  // Budget
  var config = ss.getSheetByName('Config');
  var budget = [];
  if (config) {
    var cats = config.getRange('A2:B20').getValues().filter(function(r) { return r[0]; });
    for (var i = 0; i < cats.length; i++) {
      budget.push({ categoria: cats[i][0], orcamento: cats[i][1] || 0, gasto: gastos[cats[i][0]] || 0 });
    }
  }

  return { kpis: kpis, ant: ant, gastos: gastos, topGastos: topGastos, tendencia: tendencia, budget: budget };
}

// ============================================================
// HELPERS
// ============================================================

function mesAnteriorCalc_(mes, ano, n) {
  n = n || 1;
  mes -= n;
  while (mes <= 0) { mes += 12; ano--; }
  return { mes: mes, ano: ano };
}

function getMesRecente_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Transações');
  if (!sheet || sheet.getLastRow() < 2) return null;

  var datas = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
  var maxDate = null;
  for (var i = 0; i < datas.length; i++) {
    var d = datas[i][0];
    if (d instanceof Date && (maxDate === null || d > maxDate)) maxDate = d;
  }
  if (!maxDate) return null;
  return ((maxDate.getMonth() + 1) < 10 ? '0' : '') + (maxDate.getMonth() + 1) + '/' + maxDate.getFullYear();
}

function getMesesDisponiveis_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Transações');
  if (!sheet || sheet.getLastRow() < 2) return [];

  var datas = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
  var set = {};
  for (var i = 0; i < datas.length; i++) {
    var d = datas[i][0];
    if (d instanceof Date) {
      set[((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '/' + d.getFullYear()] = true;
    }
  }
  return Object.keys(set).sort().reverse();
}

function atualizarDashboard() {
  setupDashboard();
}
