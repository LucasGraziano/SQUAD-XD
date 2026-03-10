'use strict';

const { config } = require('../utils/config');

// Rough estimate: 1 token ≈ 4 characters for English text
const CHARS_PER_TOKEN = 4;

/**
 * Splits rawText into chunks of approximately maxTokens each.
 * Tries to split on paragraph/sentence boundaries when possible.
 * @param {string} text
 * @param {number} [maxTokens]
 * @returns {string[]}
 */
function chunk(text, maxTokens = config.maxChunkTokens) {
  if (!text || text.trim().length === 0) return [];

  const maxChars = maxTokens * CHARS_PER_TOKEN;

  // If text fits in a single chunk, return as-is
  if (text.length <= maxChars) {
    return [text.trim()];
  }

  const chunks = [];
  let remaining = text.trim();

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining.trim());
      break;
    }

    // Find a good break point (paragraph → sentence → word)
    let breakPoint = findBreakPoint(remaining, maxChars);
    chunks.push(remaining.slice(0, breakPoint).trim());
    remaining = remaining.slice(breakPoint).trim();
  }

  return chunks.filter((c) => c.length > 0);
}

function findBreakPoint(text, maxChars) {
  const slice = text.slice(0, maxChars);

  // Try paragraph break
  const paraBreak = slice.lastIndexOf('\n\n');
  if (paraBreak > maxChars * 0.5) return paraBreak + 2;

  // Try newline
  const lineBreak = slice.lastIndexOf('\n');
  if (lineBreak > maxChars * 0.5) return lineBreak + 1;

  // Try sentence end
  const sentenceEnd = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('! '),
    slice.lastIndexOf('? ')
  );
  if (sentenceEnd > maxChars * 0.5) return sentenceEnd + 2;

  // Try word boundary
  const wordEnd = slice.lastIndexOf(' ');
  if (wordEnd > maxChars * 0.5) return wordEnd + 1;

  // Hard cut
  return maxChars;
}

/**
 * Returns estimated token count for a string.
 */
function estimateTokens(text) {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

module.exports = { chunk, estimateTokens };
