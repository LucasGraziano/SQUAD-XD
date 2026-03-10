'use strict';

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { config } = require('../utils/config');

const INDEX_FILE = path.join(config.knowledgeDir, 'index.yaml');

/**
 * Generates a unique knowledge ID (k-NNN).
 */
async function generateId() {
  const index = await loadIndex();
  const existing = index.entries || [];
  const nextNum = existing.length + 1;
  return `k-${String(nextNum).padStart(3, '0')}`;
}

/**
 * Loads or initializes the knowledge index.
 */
async function loadIndex() {
  await fs.ensureDir(config.knowledgeDir);

  if (await fs.pathExists(INDEX_FILE)) {
    const content = await fs.readFile(INDEX_FILE, 'utf-8');
    return yaml.load(content) || { entries: [] };
  }

  return { entries: [] };
}

/**
 * Saves knowledge to docs/knowledge/{id}.md and updates index.yaml.
 * @param {Object} ingested - {type, source, title, rawText, meta}
 * @param {Object} processed - {fullSummary, tags, agentInsights}
 * @param {string[]} agents - list of relevant agents
 * @returns {Promise<{id, filePath}>}
 */
async function save(ingested, processed, agents) {
  await fs.ensureDir(config.knowledgeDir);

  const id = await generateId();
  const date = new Date().toISOString().split('T')[0];
  const filePath = path.join(config.knowledgeDir, `${id}.md`);

  // Build markdown content
  const lines = [
    `# ${ingested.title}`,
    '',
    `**ID:** ${id}  `,
    `**Source:** ${ingested.source}  `,
    `**Type:** ${ingested.type}  `,
    `**Date:** ${date}  `,
    `**Agents:** ${agents.join(', ') || 'none'}  `,
    `**Tags:** ${(processed.tags || []).join(', ')}  `,
    '',
    '## Summary',
    '',
    processed.fullSummary || '',
    '',
  ];

  if (Object.keys(processed.agentInsights || {}).length > 0) {
    lines.push('## Agent Insights', '');
    for (const [agent, insights] of Object.entries(processed.agentInsights)) {
      if (insights && insights.length > 0) {
        lines.push(`### ${agent}`, '');
        insights.forEach((b) => lines.push(`- ${b}`));
        lines.push('');
      }
    }
  }

  if (ingested.rawText && ingested.rawText.length > 0) {
    lines.push('## Raw Content', '', '```', ingested.rawText.slice(0, 10000), '```', '');
  }

  await fs.writeFile(filePath, lines.join('\n'), 'utf-8');

  // Update index
  const index = await loadIndex();
  index.entries = index.entries || [];
  index.entries.push({
    id,
    title: ingested.title,
    source: ingested.source,
    type: ingested.type,
    date,
    agents,
    tags: processed.tags || [],
    file: `${id}.md`,
  });

  await fs.writeFile(INDEX_FILE, yaml.dump(index, { lineWidth: 120 }), 'utf-8');

  return { id, filePath };
}

/**
 * Lists all knowledge entries from index.yaml.
 * @param {string} [agentFilter] - filter by agent name
 * @returns {Promise<Object[]>}
 */
async function list(agentFilter = null) {
  const index = await loadIndex();
  let entries = index.entries || [];

  if (agentFilter) {
    entries = entries.filter((e) => e.agents && e.agents.includes(agentFilter));
  }

  return entries;
}

/**
 * Search entries by text in title/tags/source.
 * @param {string} query
 * @returns {Promise<Object[]>}
 */
async function search(query) {
  const index = await loadIndex();
  const entries = index.entries || [];
  const q = query.toLowerCase();

  return entries.filter((e) =>
    (e.title && e.title.toLowerCase().includes(q)) ||
    (e.source && e.source.toLowerCase().includes(q)) ||
    (e.tags && e.tags.some((t) => t.toLowerCase().includes(q)))
  );
}

module.exports = { save, list, search, loadIndex };
