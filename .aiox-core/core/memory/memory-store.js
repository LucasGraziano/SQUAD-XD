'use strict';

/**
 * Memory Store v2.0 — Persistent agent memory system
 *
 * File-based memory persistence for AIOX agents.
 * Each agent has its own memory sector with read/write access.
 * Memories are markdown files with YAML frontmatter.
 *
 * @module core/memory/memory-store
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');

const MEMORY_ROOT = path.resolve(__dirname, '../../../.aiox/memory');
const MAX_MEMORIES_PER_AGENT = 50;
const MAX_MEMORY_AGE_DAYS = 90;

/**
 * Memory types and their retention rules.
 */
const MEMORY_TYPES = {
  decision: { retention: 90, loadOnActivation: true, maxPerAgent: 20 },
  preference: { retention: -1, loadOnActivation: true, maxPerAgent: 15 },  // -1 = never expire
  context: { retention: 30, loadOnActivation: false, maxPerAgent: 10 },
  lesson: { retention: -1, loadOnActivation: true, maxPerAgent: 10 },
};

/**
 * Ensure memory directory exists for an agent.
 */
function ensureAgentDir(agentId) {
  const dir = path.join(MEMORY_ROOT, agentId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Generate a slug from text.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Save a memory for an agent.
 */
function saveMemory(agentId, { type, title, content, project = null, tags = [] }) {
  if (!MEMORY_TYPES[type]) {
    throw new Error(`Invalid memory type: ${type}. Valid: ${Object.keys(MEMORY_TYPES).join(', ')}`);
  }

  const dir = ensureAgentDir(agentId);
  const date = new Date().toISOString().split('T')[0];
  const slug = slugify(title);
  const filename = `${date}-${type}-${slug}.md`;
  const filepath = path.join(dir, filename);

  const frontmatter = [
    '---',
    `type: ${type}`,
    `title: "${title}"`,
    `agent: ${agentId}`,
    `date: ${date}`,
    project ? `project: "${project}"` : null,
    tags.length ? `tags: [${tags.join(', ')}]` : null,
    `retention: ${MEMORY_TYPES[type].retention}`,
    '---',
  ].filter(Boolean).join('\n');

  const fileContent = `${frontmatter}\n\n${content}\n`;
  fs.writeFileSync(filepath, fileContent, 'utf8');

  // Enforce max memories per type
  pruneMemories(agentId, type);

  return { filepath, filename };
}

/**
 * Load memories for an agent.
 * @param {string} agentId
 * @param {object} options - { type, onlyActivation, project, maxTokens }
 */
function loadMemories(agentId, options = {}) {
  const { type = null, onlyActivation = false, project = null, maxTokens = 2000 } = options;
  const dir = path.join(MEMORY_ROOT, agentId);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort().reverse();
  const memories = [];
  let tokenEstimate = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const parsed = parseMemory(content);
    if (!parsed) continue;

    // Filter by type
    if (type && parsed.type !== type) continue;

    // Filter by activation-only
    if (onlyActivation && !MEMORY_TYPES[parsed.type]?.loadOnActivation) continue;

    // Filter by project
    if (project && parsed.project && parsed.project !== project) continue;

    // Check expiry
    if (isExpired(parsed)) continue;

    // Token budget
    const memTokens = Math.ceil(content.length / 4);
    if (tokenEstimate + memTokens > maxTokens) break;
    tokenEstimate += memTokens;

    memories.push({ ...parsed, filename: file });
  }

  return memories;
}

/**
 * Parse a memory file's frontmatter and content.
 */
function parseMemory(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!match) return null;

  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(': ');
    if (key && rest.length) {
      let val = rest.join(': ').trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith('[') && val.endsWith(']')) val = val.slice(1, -1).split(', ');
      frontmatter[key.trim()] = val;
    }
  });

  return {
    ...frontmatter,
    content: match[2].trim(),
  };
}

/**
 * Check if a memory is expired based on retention rules.
 */
function isExpired(memory) {
  const retention = MEMORY_TYPES[memory.type]?.retention;
  if (!retention || retention === -1) return false;

  const created = new Date(memory.date);
  const now = new Date();
  const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
  return daysDiff > retention;
}

/**
 * Prune memories to stay within limits.
 */
function pruneMemories(agentId, type) {
  const dir = path.join(MEMORY_ROOT, agentId);
  if (!fs.existsSync(dir)) return;

  const maxPerType = MEMORY_TYPES[type]?.maxPerAgent || 10;
  const files = fs.readdirSync(dir)
    .filter(f => f.includes(`-${type}-`))
    .sort()
    .reverse();

  if (files.length > maxPerType) {
    const toRemove = files.slice(maxPerType);
    toRemove.forEach(f => fs.unlinkSync(path.join(dir, f)));
  }
}

/**
 * List all agents that have memories.
 */
function listAgentsWithMemory() {
  if (!fs.existsSync(MEMORY_ROOT)) return [];
  return fs.readdirSync(MEMORY_ROOT)
    .filter(f => fs.statSync(path.join(MEMORY_ROOT, f)).isDirectory());
}

/**
 * Get memory stats for an agent.
 */
function getStats(agentId) {
  const dir = path.join(MEMORY_ROOT, agentId);
  if (!fs.existsSync(dir)) return { total: 0, byType: {} };

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const byType = {};

  files.forEach(f => {
    const typeMatch = f.match(/\d{4}-\d{2}-\d{2}-(decision|preference|lesson|context)-/);
    if (typeMatch) {
      byType[typeMatch[1]] = (byType[typeMatch[1]] || 0) + 1;
    }
  });

  return { total: files.length, byType };
}

module.exports = {
  MEMORY_TYPES,
  saveMemory,
  loadMemories,
  parseMemory,
  isExpired,
  pruneMemories,
  listAgentsWithMemory,
  getStats,
  MEMORY_ROOT,
};
