'use strict';

const fs = require('fs-extra');
const path = require('path');
const { config } = require('../utils/config');
const logger = require('../utils/logger');

const SECTION_HEADER = '## 📚 Knowledge Feed';
const MAX_ITEMS = config.maxMemoryItems;

/**
 * Appends knowledge insights to the MEMORY.md of each relevant agent.
 * - Creates the '## 📚 Knowledge Feed' section if it doesn't exist
 * - Enforces max MAX_ITEMS entries (archives oldest)
 * - Format: concise entry with 3 bullets + reference to full file
 *
 * @param {string[]} agents - agent IDs (e.g. ['dev', 'architect'])
 * @param {Object} ingested - {type, source, title}
 * @param {Object} processed - {agentInsights, tags}
 * @param {string} knowledgeId - e.g. 'k-001'
 */
async function writeToAgents(agents, ingested, processed, knowledgeId) {
  const date = new Date().toISOString().split('T')[0];

  for (const agent of agents) {
    const memoryPath = getMemoryPath(agent);

    if (!memoryPath) {
      logger.warn(`No MEMORY.md found for agent: ${agent}`);
      continue;
    }

    // Ensure file exists
    await fs.ensureFile(memoryPath);
    let content = await fs.readFile(memoryPath, 'utf-8');

    // Build the new entry
    const insights = (processed.agentInsights || {})[agent] || [];
    const bullets = insights.slice(0, 3);
    const sourceLabel = `${ingested.type.toUpperCase()}: "${ingested.title}"`;

    const entry = buildEntry(date, sourceLabel, ingested.source, knowledgeId, bullets);

    // Inject or append section
    content = upsertSection(content, entry);

    await fs.writeFile(memoryPath, content, 'utf-8');
    logger.success(`  Updated MEMORY.md → agents/${agent}`);
  }
}

function getMemoryPath(agent) {
  // Handle ux-design-expert → ux directory mapping
  const dirMap = {
    'ux-design-expert': 'ux',
  };
  const dirName = dirMap[agent] || agent;
  return path.join(config.agentsDir, dirName, 'MEMORY.md');
}

function buildEntry(date, sourceLabel, source, knowledgeId, bullets) {
  const bulletLines = bullets.length > 0
    ? bullets.map((b) => `- ${b}`).join('\n')
    : `- Source ingested from: ${source}`;

  return [
    `### [${date}] ${sourceLabel}`,
    `- Source: ${truncate(source, 80)} | ID: ${knowledgeId}`,
    bulletLines,
    `> Full content: docs/knowledge/${knowledgeId}.md`,
    '',
  ].join('\n');
}

function upsertSection(content, newEntry) {
  const sectionIdx = content.indexOf(SECTION_HEADER);

  if (sectionIdx === -1) {
    // Section doesn't exist — append at end
    const separator = content.endsWith('\n') ? '\n' : '\n\n';
    return `${content}${separator}${SECTION_HEADER}\n\n${newEntry}`;
  }

  // Section exists — insert new entry right after the header
  const afterHeader = sectionIdx + SECTION_HEADER.length;
  const before = content.slice(0, afterHeader);
  const after = content.slice(afterHeader);

  let updated = `${before}\n\n${newEntry}${after}`;

  // Enforce max items limit
  updated = enforceLimit(updated);

  return updated;
}

function enforceLimit(content) {
  const sectionIdx = content.indexOf(SECTION_HEADER);
  if (sectionIdx === -1) return content;

  const beforeSection = content.slice(0, sectionIdx + SECTION_HEADER.length);
  const sectionContent = content.slice(sectionIdx + SECTION_HEADER.length);

  // Count entries (each starts with '### [')
  const entryPattern = /^### \[/gm;
  const matches = [...sectionContent.matchAll(entryPattern)];

  if (matches.length <= MAX_ITEMS) return content;

  // Find the start of the oldest entries (beyond MAX_ITEMS)
  const keepFrom = matches[matches.length - MAX_ITEMS].index;
  const trimmed = sectionContent.slice(keepFrom);

  return `${beforeSection}\n\n<!-- Older entries archived. See docs/knowledge/index.yaml -->\n\n${trimmed}`;
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + '...';
}

module.exports = { writeToAgents };
