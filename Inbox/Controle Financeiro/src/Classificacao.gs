/**
 * Controle Financeiro — Motor de Classificação
 * Story 1.2: Classificação por regras + feedback loop
 *
 * 3 camadas:
 * Camada 1: Regras locais (exact > contains > starts_with) — ~85%
 * Camada 2: Ollama local (futuro, Story 1.3) — ~10%
 * Camada 3: Manual (🔴) — ~5%
 */

// ============================================================
// REGRAS SEED (extraídas das 263 transações do histórico)
// ============================================================

function popularRegrasSeed_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var regras = ss.getSheetByName('Regras');
  if (!regras) return;

  var hoje = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy');

  var seeds = [
    // Transporte
    ['uber', 'contains', 'Despesa', 'Transporte', 0, 'seed', hoje],
    ['99', 'exact', 'Despesa', 'Transporte', 0, 'seed', hoje],
    ['taxi', 'contains', 'Despesa', 'Transporte', 0, 'seed', hoje],
    ['cabify', 'contains', 'Despesa', 'Transporte', 0, 'seed', hoje],
    ['combustivel', 'contains', 'Despesa', 'Transporte', 0, 'seed', hoje],
    ['gasolina', 'contains', 'Despesa', 'Transporte', 0, 'seed', hoje],
    ['estacionamento', 'contains', 'Despesa', 'Transporte', 0, 'seed', hoje],
    ['pedagio', 'contains', 'Despesa', 'Transporte', 0, 'seed', hoje],

    // Alimentação
    ['restaurante', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['ifood', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['delivery', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['mercado', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['supermercado', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['padaria', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['lanchonete', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['rappi', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['pizzaria', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['hamburgueria', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['cafe', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],
    ['starbucks', 'contains', 'Despesa', 'Alimentação', 0, 'seed', hoje],

    // Lazer
    ['bar', 'exact', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['balada', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['show', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['cinema', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['teatro', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['festa', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['ingresso', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['parque', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['viagem', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['hotel', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],
    ['airbnb', 'contains', 'Despesa', 'Lazer', 0, 'seed', hoje],

    // Moradia
    ['aluguel', 'contains', 'Despesa', 'Moradia', 0, 'seed', hoje],
    ['condominio', 'contains', 'Despesa', 'Moradia', 0, 'seed', hoje],
    ['iptu', 'contains', 'Despesa', 'Moradia', 0, 'seed', hoje],
    ['luz', 'exact', 'Despesa', 'Moradia', 0, 'seed', hoje],
    ['energia', 'contains', 'Despesa', 'Moradia', 0, 'seed', hoje],
    ['agua', 'exact', 'Despesa', 'Moradia', 0, 'seed', hoje],
    ['gas', 'exact', 'Despesa', 'Moradia', 0, 'seed', hoje],
    ['internet', 'contains', 'Despesa', 'Moradia', 0, 'seed', hoje],

    // Assinatura
    ['netflix', 'contains', 'Despesa', 'Assinatura', 0, 'seed', hoje],
    ['spotify', 'contains', 'Despesa', 'Assinatura', 0, 'seed', hoje],
    ['youtube', 'contains', 'Despesa', 'Assinatura', 0, 'seed', hoje],
    ['amazon prime', 'contains', 'Despesa', 'Assinatura', 0, 'seed', hoje],
    ['disney', 'contains', 'Despesa', 'Assinatura', 0, 'seed', hoje],
    ['hbo', 'contains', 'Despesa', 'Assinatura', 0, 'seed', hoje],
    ['icloud', 'contains', 'Despesa', 'Assinatura', 0, 'seed', hoje],
    ['google one', 'contains', 'Despesa', 'Assinatura', 0, 'seed', hoje],

    // Saúde
    ['farmacia', 'contains', 'Despesa', 'Saúde', 0, 'seed', hoje],
    ['drogaria', 'contains', 'Despesa', 'Saúde', 0, 'seed', hoje],
    ['medico', 'contains', 'Despesa', 'Saúde', 0, 'seed', hoje],
    ['dentista', 'contains', 'Despesa', 'Saúde', 0, 'seed', hoje],
    ['hospital', 'contains', 'Despesa', 'Saúde', 0, 'seed', hoje],
    ['plano de saude', 'contains', 'Despesa', 'Saúde', 0, 'seed', hoje],
    ['consulta', 'contains', 'Despesa', 'Saúde', 0, 'seed', hoje],
    ['academia', 'contains', 'Despesa', 'Saúde', 0, 'seed', hoje],

    // Profissional
    ['curso', 'contains', 'Despesa', 'Profissional', 0, 'seed', hoje],
    ['mentoria', 'contains', 'Despesa', 'Profissional', 0, 'seed', hoje],
    ['livro', 'contains', 'Despesa', 'Desenvolvimento', 0, 'seed', hoje],

    // Cartão
    ['seguro', 'contains', 'Despesa', 'Cartão', 0, 'seed', hoje],
    ['anuidade', 'contains', 'Despesa', 'Cartão', 0, 'seed', hoje],
    ['taxa', 'contains', 'Despesa', 'Cartão', 0, 'seed', hoje],
    ['iof', 'contains', 'Despesa', 'Cartão', 0, 'seed', hoje],

    // Vestuário
    ['roupa', 'contains', 'Despesa', 'Vestuário', 0, 'seed', hoje],
    ['tenis', 'contains', 'Despesa', 'Vestuário', 0, 'seed', hoje],
    ['calcado', 'contains', 'Despesa', 'Vestuário', 0, 'seed', hoje],
    ['renner', 'contains', 'Despesa', 'Vestuário', 0, 'seed', hoje],
    ['zara', 'contains', 'Despesa', 'Vestuário', 0, 'seed', hoje],
    ['c&a', 'contains', 'Despesa', 'Vestuário', 0, 'seed', hoje],

    // Cuidados Pessoais
    ['barbearia', 'contains', 'Despesa', 'Cuidados Pessoais', 0, 'seed', hoje],
    ['cabelo', 'contains', 'Despesa', 'Cuidados Pessoais', 0, 'seed', hoje],
    ['salao', 'contains', 'Despesa', 'Cuidados Pessoais', 0, 'seed', hoje],

    // Receita
    ['salario', 'contains', 'Receita', 'Salário', 0, 'seed', hoje],
    ['role', 'exact', 'Receita', 'Role', 0, 'seed', hoje],
    ['freelance', 'contains', 'Receita', 'Freelance', 0, 'seed', hoje],

    // Aporte
    ['previdencia', 'contains', 'Aporte', 'Previdência', 0, 'seed', hoje],
    ['renda fixa', 'contains', 'Aporte', 'Renda Fixa', 0, 'seed', hoje],
    ['apartamento', 'contains', 'Aporte', 'Apartamento', 0, 'seed', hoje],
    ['poupanca', 'contains', 'Aporte', 'Poupança', 0, 'seed', hoje],
    ['tesouro', 'contains', 'Aporte', 'Renda Fixa', 0, 'seed', hoje],
    ['cdb', 'contains', 'Aporte', 'Renda Fixa', 0, 'seed', hoje],
    ['acoes', 'contains', 'Aporte', 'Ações', 0, 'seed', hoje],
  ];

  if (regras.getLastRow() <= 1) {
    regras.getRange(2, 1, seeds.length, 7).setValues(seeds);
  }
}

// ============================================================
// CLASSIFICAÇÃO POR REGRAS (CAMADA 1)
// ============================================================

/**
 * Classifica uma transação baseado nas regras da aba "Regras"
 * @param {string} descricao - Descrição da transação
 * @param {number} valor - Valor (positivo ou negativo)
 * @return {Object|null} {tipo, categoria, confianca, regraIndex}
 */
function classificarPorRegras(descricao, valor) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var regrasSheet = ss.getSheetByName('Regras');
  if (!regrasSheet || regrasSheet.getLastRow() <= 1) return null;

  var regras = regrasSheet.getRange(2, 1, regrasSheet.getLastRow() - 1, 7).getValues();
  var descLimpa = limparDescricao_(descricao);

  // Prioridade: exact > starts_with > contains
  var matchExact = null;
  var matchStarts = null;
  var matchContains = null;

  for (var i = 0; i < regras.length; i++) {
    var padrao = limparDescricao_(regras[i][0]);
    var matchType = regras[i][1];
    var tipo = regras[i][2];
    var categoria = regras[i][3];

    if (!padrao || !categoria) continue;

    var matched = false;

    if (matchType === 'exact' && descLimpa === padrao) {
      matchExact = { tipo: tipo, categoria: categoria, confianca: 'REGRA', regraIndex: i + 2 };
      break; // exact match = melhor possível
    } else if (matchType === 'starts_with' && descLimpa.indexOf(padrao) === 0) {
      if (!matchStarts) {
        matchStarts = { tipo: tipo, categoria: categoria, confianca: 'REGRA', regraIndex: i + 2 };
      }
    } else if (matchType === 'contains' && descLimpa.indexOf(padrao) !== -1) {
      if (!matchContains) {
        matchContains = { tipo: tipo, categoria: categoria, confianca: 'REGRA', regraIndex: i + 2 };
      }
    }
  }

  var result = matchExact || matchStarts || matchContains;

  // Incrementar hit counter
  if (result) {
    var hitCell = regrasSheet.getRange(result.regraIndex, 5);
    hitCell.setValue((hitCell.getValue() || 0) + 1);
  }

  return result;
}

/**
 * Classifica uma transação (pipeline completo)
 * Camada 1: Regras → Camada 2: (futuro Ollama) → Camada 3: Manual
 */
function classificarTransacao(descricao, valor) {
  // Camada 1: Regras locais
  var resultado = classificarPorRegras(descricao, valor);
  if (resultado) {
    return {
      tipo: resultado.tipo,
      categoria: resultado.categoria,
      confianca: 'REGRA',
      status: '🟢'
    };
  }

  // Camada 2: Inferência simples por valor
  if (valor > 0) {
    return {
      tipo: 'Receita',
      categoria: '',
      confianca: 'INFERIDO',
      status: '🟡'
    };
  }

  // Camada 3: Manual
  return {
    tipo: valor < 0 ? 'Despesa' : '',
    categoria: '',
    confianca: '',
    status: '🔴'
  };
}

// ============================================================
// CLASSIFICAR TRANSAÇÕES PENDENTES
// ============================================================

function classificarPendentes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Transações');
  if (!sheet || sheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert('Nenhuma transação encontrada.');
    return;
  }

  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
  var classificados = 0;

  for (var i = 0; i < data.length; i++) {
    var status = data[i][1];  // Col B: Status
    if (status === '🔴' || status === '' || status === '🟡') {
      var desc = data[i][3];  // Col D: Descrição
      var valor = data[i][7]; // Col H: Valor

      if (!desc) continue;

      var result = classificarTransacao(desc, valor);

      var row = i + 2;

      // Só atualizar se encontrou algo melhor
      if (result.status === '🟢' || (status === '🔴' && result.status === '🟡')) {
        sheet.getRange(row, 2).setValue(result.status);          // Status
        if (result.tipo) sheet.getRange(row, 6).setValue(result.tipo);        // Tipo
        if (result.categoria) sheet.getRange(row, 7).setValue(result.categoria);  // Categoria
        sheet.getRange(row, 9).setValue(result.confianca);       // Confiança
        classificados++;
      }
    }
  }

  SpreadsheetApp.getUi().alert(
    '🤖 Classificação concluída!\n\n' +
    '✅ ' + classificados + ' transações classificadas.\n' +
    'Verifique as 🟡 (sugeridas) e 🔴 (manuais).'
  );
}

// ============================================================
// FEEDBACK LOOP (onEdit trigger)
// ============================================================

/**
 * Trigger instalável: quando o usuário edita a categoria,
 * cria/atualiza uma regra automaticamente.
 *
 * SETUP: Vá em Gatilhos (ícone relógio) → Adicionar gatilho
 * → onEditFeedback → De planilha → Ao editar
 */
function onEditFeedback(e) {
  if (!e) return;

  var sheet = e.source.getActiveSheet();
  if (sheet.getName() !== 'Transações') return;

  var col = e.range.getColumn();
  var row = e.range.getRow();
  if (row <= 1) return;

  // Coluna 7 = Categoria, Coluna 6 = Tipo
  if (col !== 7 && col !== 6) return;

  var desc = sheet.getRange(row, 4).getValue();       // Descrição
  var tipo = sheet.getRange(row, 6).getValue();        // Tipo
  var categoria = sheet.getRange(row, 7).getValue();   // Categoria
  var confianca = sheet.getRange(row, 9).getValue();   // Confiança atual

  if (!desc || !categoria) return;

  // Se era 🔴 ou 🟡 e o usuário editou, atualizar status para 🟢
  var status = sheet.getRange(row, 2).getValue();
  if (status === '🔴' || status === '🟡') {
    sheet.getRange(row, 2).setValue('🟢');
    sheet.getRange(row, 9).setValue('MANUAL');
  }

  // Criar/atualizar regra
  var descLimpa = limparDescricao_(desc);
  if (descLimpa.length < 2) return;

  var ss = e.source;
  var regrasSheet = ss.getSheetByName('Regras');
  if (!regrasSheet) return;

  var hoje = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy');

  // Verificar se regra já existe
  var regras = regrasSheet.getLastRow() > 1
    ? regrasSheet.getRange(2, 1, regrasSheet.getLastRow() - 1, 7).getValues()
    : [];

  var found = false;
  for (var i = 0; i < regras.length; i++) {
    if (limparDescricao_(regras[i][0]) === descLimpa) {
      // Atualizar regra existente
      var regraRow = i + 2;
      regrasSheet.getRange(regraRow, 3).setValue(tipo);
      regrasSheet.getRange(regraRow, 4).setValue(categoria);
      regrasSheet.getRange(regraRow, 6).setValue('aprendido');
      regrasSheet.getRange(regraRow, 7).setValue(hoje);
      found = true;
      break;
    }
  }

  if (!found) {
    // Criar nova regra
    var newRow = regrasSheet.getLastRow() + 1;
    regrasSheet.getRange(newRow, 1, 1, 7).setValues([
      [descLimpa, 'contains', tipo, categoria, 0, 'aprendido', hoje]
    ]);
  }
}
