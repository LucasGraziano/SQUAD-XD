'use strict';

const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');

// ─── DNA layer names (match Mega Brain folder/file naming) ──────────────────
const DNA_LAYERS = ['FILOSOFIAS', 'MODELOS-MENTAIS', 'HEURISTICAS', 'FRAMEWORKS', 'METODOLOGIAS'];

// ─── Empresa document categories ────────────────────────────────────────────
const EMPRESA_CATEGORIES = {
  'COMPANY-CONTEXT': 'company',
  'FOUNDER-': 'founder',
  'QUIZ-': 'product',
  'README': null, // skip
};

/**
 * Computes SHA-256 hash for a file (change detection).
 * @param {string} filePath
 * @returns {Promise<string>}
 */
async function computeFileHash(filePath) {
  const content = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Scans Mega Brain knowledge/ directory recursively.
 * Returns list of discovered files with metadata.
 * @param {string} basePath - path to mega-brain root
 * @param {string} knowledgePath - relative path (default: 'knowledge')
 * @param {Object} [typeFilter] - { dna, dossiers, playbooks }
 * @returns {Promise<Object[]>}
 */
async function scanMegaBrainKnowledge(basePath, knowledgePath, typeFilter) {
  const knowledgeDir = path.join(basePath, knowledgePath);
  const files = [];

  if (!await fs.pathExists(knowledgeDir)) {
    return files;
  }

  // Scan DNA
  if (!typeFilter || typeFilter.dna) {
    const dnaPersonsDir = path.join(knowledgeDir, 'dna', 'persons');
    if (await fs.pathExists(dnaPersonsDir)) {
      const persons = await fs.readdir(dnaPersonsDir);
      for (const person of persons) {
        const personDir = path.join(dnaPersonsDir, person);
        const stat = await fs.stat(personDir);
        if (!stat.isDirectory()) continue;

        const yamlFiles = (await fs.readdir(personDir)).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));
        for (const yamlFile of yamlFiles) {
          const layerName = path.basename(yamlFile, path.extname(yamlFile));
          files.push({
            absolutePath: path.join(personDir, yamlFile),
            relativePath: path.relative(basePath, path.join(personDir, yamlFile)),
            mbType: 'dna',
            person,
            dnaLayer: layerName,
            category: 'dna',
          });
        }
      }
    }

    // Also scan dna/skills/
    const dnaSkillsDir = path.join(knowledgeDir, 'dna', 'skills');
    if (await fs.pathExists(dnaSkillsDir)) {
      const persons = await fs.readdir(dnaSkillsDir);
      for (const person of persons) {
        const personDir = path.join(dnaSkillsDir, person);
        const stat = await fs.stat(personDir);
        if (!stat.isDirectory()) continue;

        const yamlFiles = (await fs.readdir(personDir)).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));
        for (const yamlFile of yamlFiles) {
          files.push({
            absolutePath: path.join(personDir, yamlFile),
            relativePath: path.relative(basePath, path.join(personDir, yamlFile)),
            mbType: 'dna',
            person,
            dnaLayer: path.basename(yamlFile, path.extname(yamlFile)),
            category: 'dna-skill',
          });
        }
      }
    }
  }

  // Scan Dossiers
  if (!typeFilter || typeFilter.dossiers) {
    const dossiersDir = path.join(knowledgeDir, 'dossiers');
    if (await fs.pathExists(dossiersDir)) {
      await scanMdRecursive(dossiersDir, basePath, 'dossier', files);
    }
  }

  // Scan Playbooks
  if (!typeFilter || typeFilter.playbooks) {
    const playbooksDir = path.join(knowledgeDir, 'playbooks');
    if (await fs.pathExists(playbooksDir)) {
      await scanMdRecursive(playbooksDir, basePath, 'playbook', files);
    }
  }

  return files;
}

/**
 * Scans agents/sua-empresa/ for company context.
 * @param {string} basePath - path to mega-brain root
 * @param {string} empresaPath - relative path (default: 'agents/sua-empresa')
 * @returns {Promise<Object[]>}
 */
async function scanMegaBrainEmpresa(basePath, empresaPath) {
  const empresaDir = path.join(basePath, empresaPath);
  const files = [];

  if (!await fs.pathExists(empresaDir)) {
    return files;
  }

  // Scan root MD files
  const rootFiles = (await fs.readdir(empresaDir)).filter((f) => f.endsWith('.md'));
  for (const file of rootFiles) {
    const category = detectEmpresaCategory(file);
    if (!category) continue;

    files.push({
      absolutePath: path.join(empresaDir, file),
      relativePath: path.relative(basePath, path.join(empresaDir, file)),
      mbType: 'empresa',
      person: null,
      dnaLayer: null,
      category,
    });
  }

  // Scan founders/
  const foundersDir = path.join(empresaDir, 'founders');
  if (await fs.pathExists(foundersDir)) {
    const founderFiles = (await fs.readdir(foundersDir)).filter((f) => f.endsWith('.md'));
    for (const file of founderFiles) {
      files.push({
        absolutePath: path.join(foundersDir, file),
        relativePath: path.relative(basePath, path.join(foundersDir, file)),
        mbType: 'empresa',
        person: null,
        dnaLayer: null,
        category: 'founder',
      });
    }
  }

  // Scan products/
  const productsDir = path.join(empresaDir, 'products');
  if (await fs.pathExists(productsDir)) {
    const productFiles = (await fs.readdir(productsDir)).filter((f) => f.endsWith('.md'));
    for (const file of productFiles) {
      files.push({
        absolutePath: path.join(productsDir, file),
        relativePath: path.relative(basePath, path.join(productsDir, file)),
        mbType: 'empresa',
        person: null,
        dnaLayer: null,
        category: 'product',
      });
    }
  }

  return files;
}

/**
 * Parses a DNA YAML file into individual knowledge items.
 * @param {string} filePath
 * @param {Object} fileMeta - { person, dnaLayer, relativePath }
 * @returns {Promise<Object>} - standard ingestor format
 */
async function parseDnaYaml(filePath, fileMeta) {
  const content = await fs.readFile(filePath, 'utf-8');
  let items;

  try {
    items = yaml.load(content);
  } catch (err) {
    // If YAML parse fails, treat as raw text
    return parseMdDocument(filePath, fileMeta);
  }

  // Build a readable text from DNA items
  const lines = [];
  const personLabel = fileMeta.person || 'unknown';
  const layerLabel = fileMeta.dnaLayer || 'unknown';

  lines.push(`# DNA: ${personLabel} — ${layerLabel}`);
  lines.push('');

  if (Array.isArray(items)) {
    for (const item of items) {
      const nome = item.nome || item.name || item.titulo || 'Unnamed';
      const desc = item.descricao || item.description || item.resumo || '';
      const fonte = item.fonte || item.source || '';
      lines.push(`## ${nome}`);
      if (desc) lines.push(desc);
      if (fonte) lines.push(`> Source: ${fonte}`);
      lines.push('');
    }
  } else if (typeof items === 'object' && items !== null) {
    // Handle object format (key-value pairs)
    for (const [key, value] of Object.entries(items)) {
      lines.push(`## ${key}`);
      if (typeof value === 'string') {
        lines.push(value);
      } else if (typeof value === 'object') {
        lines.push(yaml.dump(value, { lineWidth: 120 }));
      }
      lines.push('');
    }
  }

  const rawText = lines.join('\n');
  const title = `DNA: ${personLabel} — ${layerLabel}`;

  return {
    type: 'mega-brain',
    source: filePath,
    title,
    rawText,
    meta: {
      source: 'mega-brain',
      person: personLabel,
      dnaLayer: layerLabel,
      mbType: 'dna',
      category: fileMeta.category || 'dna',
      itemCount: Array.isArray(items) ? items.length : Object.keys(items || {}).length,
    },
  };
}

/**
 * Reads an MD document as raw text with title extraction.
 * @param {string} filePath
 * @param {Object} fileMeta - { mbType, category, relativePath }
 * @returns {Promise<Object>} - standard ingestor format
 */
async function parseMdDocument(filePath, fileMeta) {
  const content = await fs.readFile(filePath, 'utf-8');
  const fileName = path.basename(filePath, path.extname(filePath));

  // Extract title from first # heading or use filename
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : fileName;

  return {
    type: 'mega-brain',
    source: filePath,
    title,
    rawText: content,
    meta: {
      source: 'mega-brain',
      person: fileMeta.person || null,
      dnaLayer: fileMeta.dnaLayer || null,
      mbType: fileMeta.mbType,
      category: fileMeta.category,
    },
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function scanMdRecursive(dir, basePath, category, files) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scanMdRecursive(fullPath, basePath, category, files);
    } else if (entry.name.endsWith('.md')) {
      files.push({
        absolutePath: fullPath,
        relativePath: path.relative(basePath, fullPath),
        mbType: category,
        person: null,
        dnaLayer: null,
        category,
      });
    }
  }
}

function detectEmpresaCategory(fileName) {
  const upper = fileName.toUpperCase();
  if (upper === 'README.MD') return null; // skip
  if (upper.startsWith('COMPANY-CONTEXT')) return 'company';
  if (upper.startsWith('FOUNDER')) return 'founder';
  return 'company'; // default for other root MD files
}

module.exports = {
  scanMegaBrainKnowledge,
  scanMegaBrainEmpresa,
  parseDnaYaml,
  parseMdDocument,
  computeFileHash,
};
