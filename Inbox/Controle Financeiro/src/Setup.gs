/**
 * Controle Financeiro — Setup & Migração
 * Story 1.1: Cria estrutura do Sheets e configura tudo
 *
 * COMO USAR:
 * 1. Crie um Google Sheet novo
 * 2. Vá em Extensões > Apps Script
 * 3. Cole todos os arquivos .gs e .html
 * 4. Execute setupCompleto() para criar tudo
 */

// ============================================================
// SETUP PRINCIPAL
// ============================================================

function setupCompleto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  criarAbaTransacoes_(ss);
  criarAbaRegras_(ss);
  criarAbaConfig_(ss);
  criarAbaDashboard_(ss);
  criarMenuCustomizado_();
  popularCategoriasDefault_();
  popularRegrasSeed_();

  SpreadsheetApp.getUi().alert(
    '✅ Setup completo!\n\n' +
    '• Aba "Transações" criada\n' +
    '• Aba "Regras" criada com ' + getRegraCount_() + ' regras\n' +
    '• Aba "Config" criada com categorias\n' +
    '• Aba "Dashboard" criada\n' +
    '• Menu "💰 Financeiro" adicionado\n\n' +
    'Próximo passo: Importe seus dados do Excel ou use o menu para importar extrato do Bradesco.'
  );
}

// ============================================================
// CRIAR ABAS
// ============================================================

function criarAbaTransacoes_(ss) {
  var sheet = ss.getSheetByName('Transações');
  if (!sheet) {
    sheet = ss.insertSheet('Transações');
  }

  // Headers
  var headers = [
    'ID', 'Status', 'Data', 'Descrição', 'Descrição Limpa',
    'Tipo', 'Categoria', 'Valor', 'Confiança', 'Fonte', 'Hash'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formatação do header
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1a1a2e');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // Largura das colunas
  sheet.setColumnWidth(1, 40);   // ID
  sheet.setColumnWidth(2, 50);   // Status
  sheet.setColumnWidth(3, 100);  // Data
  sheet.setColumnWidth(4, 200);  // Descrição
  sheet.setColumnWidth(5, 150);  // Descrição Limpa
  sheet.setColumnWidth(6, 80);   // Tipo
  sheet.setColumnWidth(7, 130);  // Categoria
  sheet.setColumnWidth(8, 100);  // Valor
  sheet.setColumnWidth(9, 80);   // Confiança
  sheet.setColumnWidth(10, 80);  // Fonte
  sheet.setColumnWidth(11, 50);  // Hash (esconder depois)

  // Data validation: Tipo
  var tipoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Despesa', 'Receita', 'Aporte'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('F2:F1000').setDataValidation(tipoRule);

  // Data validation: Categoria (será populada depois pelo Config)
  atualizarValidacaoCategoria_(sheet);

  // Formato de moeda na coluna Valor
  sheet.getRange('H2:H1000').setNumberFormat('R$ #,##0.00');

  // Formato de data
  sheet.getRange('C2:C1000').setNumberFormat('dd/MM/yyyy');

  // Formatação condicional por Status
  var rules = sheet.getConditionalFormatRules();

  // 🟢 Verde
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('🟢')
    .setBackground('#d4edda')
    .setRanges([sheet.getRange('A2:K1000')])
    .build());

  // 🟡 Amarelo
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('🟡')
    .setBackground('#fff3cd')
    .setRanges([sheet.getRange('A2:K1000')])
    .build());

  // 🔴 Vermelho
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('🔴')
    .setBackground('#f8d7da')
    .setRanges([sheet.getRange('A2:K1000')])
    .build());

  sheet.setConditionalFormatRules(rules);

  // Congelar header
  sheet.setFrozenRows(1);

  // Esconder coluna Hash (K)
  sheet.hideColumns(11);
  // Esconder coluna Descrição Limpa (E)
  sheet.hideColumns(5);
}

function criarAbaRegras_(ss) {
  var sheet = ss.getSheetByName('Regras');
  if (!sheet) {
    sheet = ss.insertSheet('Regras');
  }

  var headers = ['Padrão', 'Match', 'Tipo', 'Categoria', 'Hits', 'Origem', 'Atualizado'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#16213e');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');

  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 80);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 50);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 120);

  sheet.setFrozenRows(1);
}

function criarAbaConfig_(ss) {
  var sheet = ss.getSheetByName('Config');
  if (!sheet) {
    sheet = ss.insertSheet('Config');
  }

  // Seção: Categorias de Despesa
  sheet.getRange('A1').setValue('CATEGORIAS DE DESPESA').setFontWeight('bold');
  sheet.getRange('A1').setBackground('#e74c3c').setFontColor('#fff');
  sheet.getRange('B1').setValue('Orçamento').setFontWeight('bold');
  sheet.getRange('B1').setBackground('#e74c3c').setFontColor('#fff');

  // Seção: Categorias de Receita
  sheet.getRange('D1').setValue('CATEGORIAS DE RECEITA').setFontWeight('bold');
  sheet.getRange('D1').setBackground('#27ae60').setFontColor('#fff');

  // Seção: Categorias de Aporte
  sheet.getRange('F1').setValue('CATEGORIAS DE APORTE').setFontWeight('bold');
  sheet.getRange('F1').setBackground('#2980b9').setFontColor('#fff');

  // Seção: Configurações
  sheet.getRange('H1').setValue('CONFIGURAÇÕES').setFontWeight('bold');
  sheet.getRange('H1').setBackground('#8e44ad').setFontColor('#fff');

  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(6, 180);
  sheet.setColumnWidth(8, 180);
  sheet.setColumnWidth(9, 100);

  sheet.setFrozenRows(1);
}

function criarAbaDashboard_(ss) {
  var sheet = ss.getSheetByName('Dashboard');
  if (!sheet) {
    sheet = ss.insertSheet('Dashboard');
  }

  // Será populado pela Story 1.6
  sheet.getRange('A1').setValue('📊 DASHBOARD — Controle Financeiro').setFontWeight('bold').setFontSize(14);
  sheet.getRange('A2').setValue('Execute setupDashboard() após ter transações importadas.').setFontColor('#888');
}

// ============================================================
// POPULAR DADOS DEFAULT
// ============================================================

function popularCategoriasDefault_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var config = ss.getSheetByName('Config');

  // Categorias de Despesa + Orçamento
  var despesas = [
    ['Alimentação', 1200],
    ['Transporte', 600],
    ['Lazer', 1500],
    ['Moradia', 2000],
    ['Assinatura', 200],
    ['Saúde', 300],
    ['Vestuário', 400],
    ['Profissional', 500],
    ['Cartão', 300],
    ['Cuidados Pessoais', 200],
    ['Desenvolvimento', 300],
    ['Relacionamento', 500],
  ];
  config.getRange(2, 1, despesas.length, 2).setValues(despesas);
  config.getRange('B2:B' + (despesas.length + 1)).setNumberFormat('R$ #,##0');

  // Categorias de Receita
  var receitas = [['Salário'], ['Freelance'], ['Role'], ['Investimento'], ['Outros']];
  config.getRange(2, 4, receitas.length, 1).setValues(receitas);

  // Categorias de Aporte
  var aportes = [['Previdência'], ['Renda Fixa'], ['Ações'], ['Apartamento'], ['Poupança']];
  config.getRange(2, 6, aportes.length, 1).setValues(aportes);

  // Configurações gerais
  var configs = [
    ['Confiança mín. auto', '85%'],
    ['Banco padrão', 'Bradesco'],
    ['Email relatório', ''],
    ['Dia relatório mensal', '1'],
  ];
  config.getRange(2, 8, configs.length, 2).setValues(configs);

  // Atualizar validação de categoria na aba Transações
  var txSheet = ss.getSheetByName('Transações');
  if (txSheet) {
    atualizarValidacaoCategoria_(txSheet);
  }
}

function atualizarValidacaoCategoria_(sheet) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var config = ss.getSheetByName('Config');
  if (!config) return;

  var todasCategorias = [];

  // Pegar categorias de despesa
  var despesas = config.getRange('A2:A20').getValues().flat().filter(String);
  var receitas = config.getRange('D2:D20').getValues().flat().filter(String);
  var aportes = config.getRange('F2:F20').getValues().flat().filter(String);

  todasCategorias = despesas.concat(receitas).concat(aportes);

  if (todasCategorias.length > 0) {
    var catRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(todasCategorias)
      .setAllowInvalid(true)  // Permitir valores custom
      .build();
    sheet.getRange('G2:G1000').setDataValidation(catRule);
  }
}

// ============================================================
// MENU CUSTOMIZADO
// ============================================================

function onOpen() {
  criarMenuCustomizado_();
}

function criarMenuCustomizado_() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('💰 Financeiro')
    .addItem('📥 Importar Extrato Bradesco', 'mostrarSidebarImport')
    .addItem('📋 Migrar Dados do Excel', 'migrarDadosExcel')
    .addSeparator()
    .addItem('🤖 Classificar Pendentes', 'classificarPendentes')
    .addItem('📊 Atualizar Dashboard', 'setupDashboard')
    .addSeparator()
    .addItem('⚙️ Setup Completo', 'setupCompleto')
    .addItem('🔄 Atualizar Categorias', 'atualizarCategoriasDaConfig')
    .addToUi();
}

function atualizarCategoriasDaConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var txSheet = ss.getSheetByName('Transações');
  atualizarValidacaoCategoria_(txSheet);
  SpreadsheetApp.getUi().alert('✅ Categorias atualizadas!');
}

// ============================================================
// UTILIDADES
// ============================================================

function getRegraCount_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var regras = ss.getSheetByName('Regras');
  if (!regras) return 0;
  return regras.getLastRow() - 1; // menos header
}

function getNextId_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Transações');
  return sheet.getLastRow(); // row number = ID
}

function limparDescricao_(desc) {
  if (!desc) return '';
  return desc
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\s+/g, ' ')
    .trim();
}

function gerarHash_(data, desc, valor) {
  var raw = data + '|' + desc + '|' + valor;
  var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return hash.map(function(b) {
    return ('0' + (b & 0xFF).toString(16)).slice(-2);
  }).join('').substring(0, 16); // primeiros 16 chars
}
