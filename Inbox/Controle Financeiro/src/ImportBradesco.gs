/**
 * Controle Financeiro — Parser Bradesco + Importação
 * Story 1.4: Importa extratos CSV/OFX do Bradesco
 */

// ============================================================
// MOSTRAR SIDEBAR
// ============================================================

function mostrarSidebarImport() {
  var html = HtmlService.createHtmlOutputFromFile('ImportSidebar')
    .setTitle('📥 Importar Extrato')
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

// ============================================================
// PARSER CSV BRADESCO
// ============================================================

/**
 * Parse de CSV do Bradesco
 * Formato esperado:
 * - Separador: ; (ponto e vírgula)
 * - Encoding: ISO-8859-1 (tratado pelo upload)
 * - Colunas: Data;Histórico;Valor;Saldo
 * - Valores com espaços e sinal negativo
 */
function parseBradescoCSV(csvContent) {
  var linhas = csvContent.split('\n');
  var transacoes = [];
  var headerFound = false;

  for (var i = 0; i < linhas.length; i++) {
    var linha = linhas[i].trim();
    if (!linha) continue;

    // Detectar header
    if (linha.toLowerCase().indexOf('data') !== -1 && linha.toLowerCase().indexOf('hist') !== -1) {
      headerFound = true;
      continue;
    }

    // Pular linhas antes do header e linhas de separação
    if (!headerFound) continue;
    if (linha.indexOf('----') !== -1) continue;

    // Separar por ; e limpar aspas
    var cols = linha.split(';').map(function(c) {
      return c.replace(/"/g, '').trim();
    });

    if (cols.length < 3) continue;

    var data = parseDataBradesco_(cols[0]);
    var descricao = cols[1];
    var valorStr = cols[2];

    if (!data || !descricao) continue;

    var valor = parseValorBradesco_(valorStr);
    if (isNaN(valor) || valor === 0) continue;

    transacoes.push({
      data: data,
      descricao: descricao,
      descricaoLimpa: limparDescricao_(descricao),
      valor: valor,
      tipo: valor < 0 ? 'Despesa' : 'Receita',
      valorAbs: Math.abs(valor)
    });
  }

  return transacoes;
}

// ============================================================
// PARSER OFX BRADESCO
// ============================================================

function parseBradescoOFX(ofxContent) {
  var transacoes = [];

  // Regex para extrair blocos STMTTRN
  var blocos = ofxContent.split('<STMTTRN>');

  for (var i = 1; i < blocos.length; i++) {
    var bloco = blocos[i].split('</STMTTRN>')[0] || blocos[i];

    var data = extrairCampoOFX_(bloco, 'DTPOSTED');
    var valor = extrairCampoOFX_(bloco, 'TRNAMT');
    var desc = extrairCampoOFX_(bloco, 'MEMO') || extrairCampoOFX_(bloco, 'NAME');

    if (!data || !desc) continue;

    // Parse data OFX: 20260326 → Date
    var ano = parseInt(data.substring(0, 4));
    var mes = parseInt(data.substring(4, 6)) - 1;
    var dia = parseInt(data.substring(6, 8));
    var dateObj = new Date(ano, mes, dia);

    var valorNum = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNum)) continue;

    transacoes.push({
      data: dateObj,
      descricao: desc.trim(),
      descricaoLimpa: limparDescricao_(desc),
      valor: valorNum,
      tipo: valorNum < 0 ? 'Despesa' : 'Receita',
      valorAbs: Math.abs(valorNum)
    });
  }

  return transacoes;
}

function extrairCampoOFX_(bloco, campo) {
  var regex = new RegExp('<' + campo + '>([^<\\n]+)');
  var match = bloco.match(regex);
  return match ? match[1].trim() : null;
}

// ============================================================
// DETECTAR FORMATO E PARSE
// ============================================================

function detectarEParsear(conteudo) {
  if (conteudo.indexOf('<OFX>') !== -1 || conteudo.indexOf('<STMTTRN>') !== -1) {
    return { formato: 'OFX', transacoes: parseBradescoOFX(conteudo) };
  }
  return { formato: 'CSV', transacoes: parseBradescoCSV(conteudo) };
}

// ============================================================
// PREVIEW (chamado do sidebar)
// ============================================================

function previewImport(conteudo) {
  var resultado = detectarEParsear(conteudo);
  var txns = resultado.transacoes;

  if (txns.length === 0) {
    return { erro: 'Nenhuma transação encontrada no arquivo. Verifique o formato.' };
  }

  // Verificar duplicatas
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Transações');
  var hashesExistentes = {};

  if (sheet && sheet.getLastRow() > 1) {
    var hashes = sheet.getRange(2, 11, sheet.getLastRow() - 1, 1).getValues();
    hashes.forEach(function(h) { if (h[0]) hashesExistentes[h[0]] = true; });
  }

  var novas = 0;
  var duplicatas = 0;

  txns.forEach(function(t) {
    var hash = gerarHash_(
      Utilities.formatDate(t.data, 'America/Sao_Paulo', 'yyyy-MM-dd'),
      t.descricaoLimpa,
      t.valorAbs.toString()
    );
    if (hashesExistentes[hash]) {
      duplicatas++;
    } else {
      novas++;
    }
  });

  // Período
  var datas = txns.map(function(t) { return t.data.getTime(); });
  var menor = new Date(Math.min.apply(null, datas));
  var maior = new Date(Math.max.apply(null, datas));

  return {
    formato: resultado.formato,
    total: txns.length,
    novas: novas,
    duplicatas: duplicatas,
    periodo: Utilities.formatDate(menor, 'America/Sao_Paulo', 'dd/MM/yyyy') +
      ' a ' + Utilities.formatDate(maior, 'America/Sao_Paulo', 'dd/MM/yyyy')
  };
}

// ============================================================
// IMPORTAR (chamado do sidebar)
// ============================================================

function executarImport(conteudo) {
  var resultado = detectarEParsear(conteudo);
  var txns = resultado.transacoes;

  if (txns.length === 0) {
    return { erro: 'Nenhuma transação encontrada.' };
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Transações');
  if (!sheet) {
    return { erro: 'Aba Transações não encontrada. Execute setupCompleto() primeiro.' };
  }

  // Coletar hashes existentes
  var hashesExistentes = {};
  if (sheet.getLastRow() > 1) {
    var hashes = sheet.getRange(2, 11, sheet.getLastRow() - 1, 1).getValues();
    hashes.forEach(function(h) { if (h[0]) hashesExistentes[h[0]] = true; });
  }

  var importadas = 0;
  var verdes = 0;
  var amarelas = 0;
  var vermelhas = 0;
  var puladas = 0;

  txns.forEach(function(t) {
    var dataStr = Utilities.formatDate(t.data, 'America/Sao_Paulo', 'yyyy-MM-dd');
    var hash = gerarHash_(dataStr, t.descricaoLimpa, t.valorAbs.toString());

    // Skip duplicata
    if (hashesExistentes[hash]) {
      puladas++;
      return;
    }

    // Classificar
    var classificacao = classificarTransacao(t.descricao, t.valor);

    // Usar tipo da classificação se encontrado, senão inferir do valor
    var tipo = classificacao.tipo || t.tipo;
    var categoria = classificacao.categoria || '';

    var nextRow = sheet.getLastRow() + 1;
    var id = nextRow - 1;

    sheet.getRange(nextRow, 1, 1, 11).setValues([[
      id,                         // A: ID
      classificacao.status,       // B: Status
      t.data,                     // C: Data
      t.descricao,                // D: Descrição
      t.descricaoLimpa,           // E: Descrição Limpa
      tipo,                       // F: Tipo
      categoria,                  // G: Categoria
      t.valorAbs,                 // H: Valor (sempre positivo)
      classificacao.confianca,    // I: Confiança
      'IMPORT',                   // J: Fonte
      hash                        // K: Hash
    ]]);

    hashesExistentes[hash] = true;
    importadas++;

    if (classificacao.status === '🟢') verdes++;
    else if (classificacao.status === '🟡') amarelas++;
    else vermelhas++;
  });

  return {
    importadas: importadas,
    puladas: puladas,
    verdes: verdes,
    amarelas: amarelas,
    vermelhas: vermelhas
  };
}

// ============================================================
// HELPERS
// ============================================================

function parseDataBradesco_(dataStr) {
  if (!dataStr) return null;
  // Formato: dd/MM/yyyy ou dd/MM/yy
  var partes = dataStr.split('/');
  if (partes.length !== 3) return null;

  var dia = parseInt(partes[0]);
  var mes = parseInt(partes[1]) - 1;
  var ano = parseInt(partes[2]);
  if (ano < 100) ano += 2000;

  if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;
  return new Date(ano, mes, dia);
}

function parseValorBradesco_(valorStr) {
  if (!valorStr) return NaN;
  // Remove espaços, troca vírgula por ponto
  var limpo = valorStr.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(limpo);
}
