'use strict';

const fs = require('fs').promises;
const path = require('path');
const { config } = require('../utils/config');
const logger = require('../utils/logger');

const SUPPORTED_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

/**
 * Ingestor for image files.
 * - Ollama: uses ollamaVisionModel (llama3.2-vision or llava)
 * - Anthropic: uses Claude Vision
 */
async function ingestImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mediaType = SUPPORTED_TYPES[ext];

  if (!mediaType) {
    throw new Error(`Unsupported image type: ${ext}. Supported: ${Object.keys(SUPPORTED_TYPES).join(', ')}`);
  }

  const buffer = await fs.readFile(filePath);
  const base64 = buffer.toString('base64');
  const name = path.basename(filePath);

  let description;

  if (config.provider === 'anthropic') {
    description = await describeWithAnthropic(base64, mediaType);
  } else {
    description = await describeWithOllama(base64);
  }

  return {
    type: 'image',
    source: filePath,
    title: name,
    rawText: description,
    meta: { mediaType, size: buffer.length },
  };
}

async function describeWithOllama(base64) {
  const fetch = require('node-fetch');

  logger.dim(`  Using vision model: ${config.ollamaVisionModel}`);

  const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.ollamaVisionModel,
      messages: [
        {
          role: 'user',
          content: 'Analyze this image in detail. Extract all text visible, describe diagrams, charts, or architecture. Be comprehensive for knowledge extraction.',
          images: [base64],
        },
      ],
      stream: false,
    }),
    timeout: 120000,
  });

  if (!response.ok) {
    const text = await response.text();
    // Vision model not available — return helpful message as text
    logger.warn(`Vision model "${config.ollamaVisionModel}" not available. Run: ollama pull ${config.ollamaVisionModel}`);
    return `[Image file — vision model not available. To enable: ollama pull ${config.ollamaVisionModel}]`;
  }

  const data = await response.json();
  return data.message.content;
}

async function describeWithAnthropic(base64, mediaType) {
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: config.anthropicApiKey });

  const response = await client.messages.create({
    model: config.claudeModel,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: 'Analyze this image in detail. Extract all text, diagrams, charts, or visual information. Be comprehensive for knowledge extraction.' },
        ],
      },
    ],
  });

  return response.content[0].text;
}

module.exports = { ingestImage };
