#!/usr/bin/env node

/**
 * Populate Briefing — Low-Ticket Squad
 * Extrai informações de documentos fonte e preenche o briefing template de um projeto.
 *
 * Uso: node populate-briefing.js <project-name> <source-doc>
 *
 * Exemplo:
 *   node populate-briefing.js zero-diastase ../../docs/BRIEFING-AIOS-SQUAD-ZERO-DIASTASE.md
 *
 * O script lê o documento fonte, extrai seções relevantes e exibe
 * as informações organizadas para preencher o briefing.
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const projectName = args[0];
const sourceDoc = args[1];

if (!projectName || !sourceDoc) {
  console.log(`
Populate Briefing — Low-Ticket Squad

Uso: node populate-briefing.js <project-name> <source-doc>

Exemplo:
  node populate-briefing.js zero-diastase ../../docs/BRIEFING.md

O script analisa o documento fonte e extrai:
  - Informações básicas (nome, preço, nicho)
  - Persona (público, dor, desejo)
  - Oferta (produto, bônus, garantia)
  - Funil (tipo, fluxo, bump, upsell)
  - Tráfego (plataforma, orçamento)
  - Quiz (perguntas, segmentação)
  - TSL (ângulo, tamanho)
`);
  process.exit(0);
}

const projectDir = path.resolve(__dirname, '..', 'projects', projectName);
const briefingPath = path.join(projectDir, 'briefing.md');

if (!fs.existsSync(projectDir)) {
  console.error(`Projeto não encontrado: ${projectDir}`);
  console.log(`Crie o projeto primeiro com a estrutura padrão.`);
  process.exit(1);
}

const sourcePath = path.resolve(sourceDoc);
if (!fs.existsSync(sourcePath)) {
  console.error(`Documento fonte não encontrado: ${sourcePath}`);
  process.exit(1);
}

const content = fs.readFileSync(sourcePath, 'utf-8');

// Extract key information
const sections = {
  prices: [],
  personas: [],
  products: [],
  funnels: [],
  keywords: new Set(),
};

// Find prices (US$XX.XX or R$XX.XX patterns)
const priceRegex = /(?:US\$|R\$|USD?\s*)\$?\s*(\d+[\.,]?\d*)/gi;
let match;
while ((match = priceRegex.exec(content)) !== null) {
  sections.prices.push(match[0]);
}

// Find age ranges
const ageRegex = /(\d{2})\s*[-–]\s*(\d{2})\s*(?:anos|years|años)/gi;
while ((match = ageRegex.exec(content)) !== null) {
  sections.personas.push(`Idade: ${match[1]}-${match[2]}`);
}

// Count sections
const headingRegex = /^#{1,3}\s+(.+)$/gm;
const headings = [];
while ((match = headingRegex.exec(content)) !== null) {
  headings.push(match[1].trim());
}

console.log(`
=== ANÁLISE DO DOCUMENTO FONTE ===

Documento: ${sourcePath}
Tamanho: ${content.length} caracteres (${content.split('\n').length} linhas)
Seções encontradas: ${headings.length}

--- Preços encontrados ---
${[...new Set(sections.prices)].join(', ') || 'Nenhum'}

--- Faixas etárias ---
${sections.personas.join(', ') || 'Nenhuma'}

--- Seções do documento ---
${headings.map((h, i) => `  ${i + 1}. ${h}`).join('\n')}

--- Status ---
Briefing existente: ${fs.existsSync(briefingPath) ? '✅ Sim' : '❌ Não'}
${fs.existsSync(briefingPath) ?
    `Briefing tamanho: ${fs.statSync(briefingPath).size} bytes` :
    `Criar com: cp templates/briefing-template.md projects/${projectName}/briefing.md`}

Próximo passo: Preencha o briefing com as informações acima.
Se o briefing já existe e está preenchido, use:
  @commander *audit --docs ./projects/${projectName}/
`);
