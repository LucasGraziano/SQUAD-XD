'use strict';

const path = require('path');
const fs = require('fs');

// Resolve project root (finds directory containing .aios-core)
function findProjectRoot() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    const marker = path.join(dir, '.aios-core');
    if (fs.existsSync(marker)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(__dirname, '../../../../');
}

const PROJECT_ROOT = findProjectRoot();

function resolveAgentsDir(root) {
  // Support both .aiox-core and .aios-core
  const aiox = path.join(root, '.aiox-core', 'development', 'agents');
  if (fs.existsSync(aiox)) return aiox;
  return path.join(root, '.aios-core', 'development', 'agents');
}

const envPath = path.join(PROJECT_ROOT, '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config();
}

// Load core-config.yaml for megaBrain settings
let coreConfig = {};
try {
  const yaml = require('js-yaml');
  const coreConfigPaths = [
    path.join(PROJECT_ROOT, '.aiox-core', 'core-config.yaml'),
    path.join(PROJECT_ROOT, '.aios-core', 'core-config.yaml'),
  ];
  for (const cp of coreConfigPaths) {
    if (fs.existsSync(cp)) {
      coreConfig = yaml.load(fs.readFileSync(cp, 'utf-8')) || {};
      break;
    }
  }
} catch (_) {
  // Graceful fallback — core-config not available
}

const mbConfig = coreConfig.megaBrain || {};

const config = {
  projectRoot: PROJECT_ROOT,

  // Provider: 'ollama' (local, free) or 'anthropic' (API key required)
  provider: process.env.KNOWLEDGE_FEEDER_PROVIDER || 'ollama',

  // Ollama (local)
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2',
  ollamaVisionModel: process.env.OLLAMA_VISION_MODEL || 'llama3.2-vision',

  // Anthropic (cloud, requires API key)
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  claudeModel: process.env.KNOWLEDGE_FEEDER_MODEL || 'claude-haiku-4-5-20251001',

  // Storage
  knowledgeDir: path.join(PROJECT_ROOT, 'docs', 'knowledge'),
  agentsDir: resolveAgentsDir(PROJECT_ROOT),

  // Server
  defaultPort: parseInt(process.env.KNOWLEDGE_FEEDER_PORT || '3333', 10),

  // Limits
  maxChunkTokens: 2000,
  maxMemoryItems: 20,

  // Mega Brain integration
  megaBrain: {
    enabled: mbConfig.enabled || false,
    sourcePath: mbConfig.sourcePath || null,
    knowledgePath: mbConfig.knowledgePath || 'knowledge',
    empresaPath: mbConfig.empresaPath || 'agents/sua-empresa',
    syncStateFile: path.join(PROJECT_ROOT, mbConfig.syncStateFile || '.aios/mb-sync-state.json'),
    syncMode: mbConfig.syncMode || 'incremental',
    types: mbConfig.types || { dna: true, dossiers: true, playbooks: true, empresa: true },
  },
};

function validate() {
  if (config.provider === 'anthropic' && !config.anthropicApiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY not set. Add it to your .env or switch to Ollama:\n' +
      '  KNOWLEDGE_FEEDER_PROVIDER=ollama (default)'
    );
  }
}

module.exports = { config, validate };
