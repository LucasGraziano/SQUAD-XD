'use strict';

/**
 * Routes knowledge to relevant agents based on content tags and insights.
 * Uses the agentInsights map from summarizer — agents with non-empty insights
 * are considered relevant. Applies keyword-based heuristics as fallback.
 *
 * For Mega Brain content (meta.source === 'mega-brain'), uses deterministic
 * routing based on DNA layer / content type before keyword fallback.
 */

const AGENT_KEYWORDS = {
  architect: ['architecture', 'system design', 'pattern', 'hexagonal', 'microservice', 'monolith', 'ddd', 'clean architecture', 'cqrs', 'event sourcing', 'api design', 'integration', 'scalability'],
  'data-engineer': ['database', 'schema', 'sql', 'migration', 'postgres', 'mysql', 'mongodb', 'redis', 'index', 'query', 'orm', 'supabase', 'rls', 'row level security', 'data model'],
  'ux-design-expert': ['ux', 'ui', 'design', 'wireframe', 'user interface', 'user experience', 'figma', 'accessibility', 'color', 'typography', 'layout', 'component', 'design system'],
  pm: ['product', 'feature', 'requirement', 'roadmap', 'epic', 'user story', 'backlog', 'stakeholder', 'market', 'strategy', 'business'],
  po: ['acceptance criteria', 'story', 'sprint', 'definition of done', 'prioritization', 'backlog grooming', 'value', 'user needs'],
  dev: ['code', 'implementation', 'pattern', 'refactor', 'typescript', 'javascript', 'node', 'react', 'vue', 'function', 'class', 'algorithm', 'library', 'package', 'debugging'],
  qa: ['testing', 'test', 'quality', 'bug', 'coverage', 'e2e', 'unit test', 'integration test', 'jest', 'playwright', 'regression', 'validation'],
  devops: ['ci/cd', 'docker', 'kubernetes', 'deploy', 'pipeline', 'github actions', 'infrastructure', 'monitoring', 'logging', 'devops', 'container', 'cloud', 'aws', 'vercel'],
  analyst: ['research', 'analysis', 'market', 'competitor', 'data', 'metrics', 'report', 'trend', 'insight', 'study'],
};

// ─── Mega Brain: DNA Layer → Agent mapping ──────────────────────────────────
const MEGA_BRAIN_DNA_ROUTING = {
  'FILOSOFIAS': ['analyst', 'pm', 'po'],
  'MODELOS-MENTAIS': ['architect', 'analyst', 'ux-design-expert'],
  'HEURISTICAS': ['po', 'dev', 'qa'],
  'FRAMEWORKS': ['architect', 'dev', 'analyst'],
  'METODOLOGIAS': ['dev', 'sm', 'qa'],
};

// ─── Mega Brain: Empresa content → Agent mapping ────────────────────────────
const MEGA_BRAIN_EMPRESA_ROUTING = {
  'company': ['dev', 'architect', 'data-engineer', 'qa', 'devops', 'pm', 'po', 'analyst', 'ux-design-expert', 'sm'],
  'founder': ['pm', 'sm'],
  'product': ['ux-design-expert', 'dev', 'po', 'analyst'],
  'brand': ['ux-design-expert'],
};

// ─── Mega Brain: Content type → Agent mapping ───────────────────────────────
const MEGA_BRAIN_CONTENT_ROUTING = {
  'dossier': ['analyst', 'pm', 'architect'],
  'playbook': ['dev', 'pm', 'po'],
};

/**
 * Routes Mega Brain content to agents based on deterministic mapping.
 * @param {Object} meta - { source, mbType, dnaLayer, category }
 * @returns {string[]|null} - agent list, or null to fall through to other routing
 */
function routeMegaBrain(meta) {
  if (!meta || meta.source !== 'mega-brain') return null;

  const agents = new Set();

  // DNA routing
  if (meta.mbType === 'dna' && meta.dnaLayer) {
    const layer = meta.dnaLayer.toUpperCase();
    const mapped = MEGA_BRAIN_DNA_ROUTING[layer];
    if (mapped) {
      mapped.forEach((a) => agents.add(a));
      return Array.from(agents);
    }
  }

  // Empresa routing
  if (meta.mbType === 'empresa' && meta.category) {
    const mapped = MEGA_BRAIN_EMPRESA_ROUTING[meta.category];
    if (mapped) {
      mapped.forEach((a) => agents.add(a));
      return Array.from(agents);
    }
  }

  // Content type routing (dossiers, playbooks)
  if (meta.mbType && MEGA_BRAIN_CONTENT_ROUTING[meta.mbType]) {
    const mapped = MEGA_BRAIN_CONTENT_ROUTING[meta.mbType];
    mapped.forEach((a) => agents.add(a));
    return Array.from(agents);
  }

  // No specific MB mapping found — fall through
  return null;
}

/**
 * Determine which agents should receive knowledge entries.
 *
 * Routing priority:
 *   1. User override (--agents flag)
 *   2. Claude agentInsights (from summarizer)
 *   3. Mega Brain deterministic routing (if meta.source === 'mega-brain')
 *   4. Keyword fallback (tags + summary text)
 *
 * @param {Object} processed - output from summarizer: {fullSummary, tags, agentInsights, meta}
 * @param {string[]} [override] - user-specified agent list (skips auto-routing)
 * @returns {string[]} - list of agent IDs
 */
function route(processed, override = null) {
  // 1. User explicitly selected agents
  if (override && override.length > 0) {
    const allKnown = new Set([...Object.keys(AGENT_KEYWORDS), 'sm']);
    return override.filter((a) => allKnown.has(a));
  }

  const relevantAgents = new Set();

  // 2. Primary: use agents that have non-empty insights from Claude
  if (processed.agentInsights) {
    for (const [agent, insights] of Object.entries(processed.agentInsights)) {
      if (Array.isArray(insights) && insights.length > 0) {
        relevantAgents.add(agent);
      }
    }
  }

  if (relevantAgents.size > 0) {
    return Array.from(relevantAgents);
  }

  // 3. Mega Brain deterministic routing (before keyword fallback)
  const mbAgents = routeMegaBrain(processed.meta || {});
  if (mbAgents && mbAgents.length > 0) {
    return mbAgents;
  }

  // 4. Fallback: keyword matching on tags
  if (processed.tags && processed.tags.length > 0) {
    const tagsText = processed.tags.join(' ').toLowerCase();
    const summaryText = (processed.fullSummary || '').toLowerCase().slice(0, 1000);
    const combined = `${tagsText} ${summaryText}`;

    for (const [agent, keywords] of Object.entries(AGENT_KEYWORDS)) {
      if (keywords.some((kw) => combined.includes(kw))) {
        relevantAgents.add(agent);
      }
    }
  }

  return Array.from(relevantAgents);
}

module.exports = { route, routeMegaBrain };
