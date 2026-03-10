'use strict';

const { config } = require('../utils/config');
const { chunk } = require('./chunker');
const logger = require('../utils/logger');

const AGENT_NAMES = ['dev', 'architect', 'data-engineer', 'qa', 'devops', 'pm', 'po', 'analyst', 'ux-design-expert'];

// ─── Provider: Ollama ──────────────────────────────────────────────────────────
async function callOllama(systemPrompt, userPrompt) {
  const fetch = require('node-fetch');

  const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.ollamaModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
    }),
    timeout: 120000,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.message.content;
}

// ─── Provider: Anthropic ───────────────────────────────────────────────────────
async function callAnthropic(systemPrompt, userPrompt) {
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: config.anthropicApiKey });

  const resp = await client.messages.create({
    model: config.claudeModel,
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  return resp.content[0].text;
}

// ─── Unified call ─────────────────────────────────────────────────────────────
async function callLLM(systemPrompt, userPrompt) {
  if (config.provider === 'anthropic') {
    return callAnthropic(systemPrompt, userPrompt);
  }
  return callOllama(systemPrompt, userPrompt);
}

// ─── Main summarize function ──────────────────────────────────────────────────
/**
 * Processes ingested content:
 * 1. Summarizes via chunked intermediate summaries if needed
 * 2. Extracts per-agent insights (max 3 bullets each)
 */
async function summarize(ingested, targetAgents = null) {
  const { rawText, title, type } = ingested;

  logger.step(`Summarizing: "${title}" (${type}) via ${config.provider}`);

  // Step 1: chunked intermediate summaries
  const chunks = chunk(rawText);
  logger.dim(`  ${chunks.length} chunk(s) to process`);

  let combinedSummary;

  if (chunks.length === 1) {
    combinedSummary = rawText;
  } else {
    const chunkSummaries = [];
    for (let i = 0; i < chunks.length; i++) {
      logger.dim(`  Processing chunk ${i + 1}/${chunks.length}...`);
      const text = await callLLM(
        'You are a technical summarizer. Summarize the section concisely, preserving all key technical details.',
        `Summarize this content section:\n\n${chunks[i]}`
      );
      chunkSummaries.push(text);
    }
    combinedSummary = chunkSummaries.join('\n\n---\n\n');
  }

  // Step 2: structured extraction
  const systemPrompt = `You are a knowledge extraction system for an AI development team.
Extract structured knowledge and respond ONLY with valid JSON (no markdown, no explanation):
{
  "fullSummary": "Comprehensive summary 200-400 words",
  "tags": ["tag1", "tag2", "tag3"],
  "agentInsights": {
    "dev": ["bullet 1", "bullet 2"],
    "architect": ["bullet 1"],
    "data-engineer": [],
    "qa": [],
    "devops": [],
    "pm": [],
    "po": [],
    "analyst": [],
    "ux-design-expert": []
  }
}
Rules:
- Only include agents where content is genuinely relevant (empty array if not)
- Max 3 bullets per agent, each max 120 characters, actionable and specific
- tags: 3-8 lowercase keywords
- fullSummary: comprehensive and technical`;

  const userPrompt = `Extract knowledge from content titled "${title}":\n\n${combinedSummary}`;

  let parsed;
  try {
    const text = await callLLM(systemPrompt, userPrompt);
    // Strip markdown code fences if present
    const jsonText = text.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    // Find JSON object in response (Ollama sometimes adds preamble)
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}');
    const clean = jsonStart !== -1 ? jsonText.slice(jsonStart, jsonEnd + 1) : jsonText;
    parsed = JSON.parse(clean);
  } catch (err) {
    logger.warn(`Could not parse structured JSON response, using fallback: ${err.message}`);
    // Fallback: use raw summary, no per-agent insights
    parsed = {
      fullSummary: combinedSummary.slice(0, 2000),
      tags: [],
      agentInsights: {},
    };
  }

  parsed.fullSummary = parsed.fullSummary || combinedSummary.slice(0, 2000);
  parsed.tags = Array.isArray(parsed.tags) ? parsed.tags : [];
  parsed.agentInsights = parsed.agentInsights || {};

  // Remove agents with empty insights
  for (const agent of Object.keys(parsed.agentInsights)) {
    if (!Array.isArray(parsed.agentInsights[agent]) || parsed.agentInsights[agent].length === 0) {
      delete parsed.agentInsights[agent];
    }
  }

  return parsed;
}

module.exports = { summarize };
