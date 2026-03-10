'use strict';

const fs = require('fs').promises;
const path = require('path');

/**
 * Ingestor for plain text files (.txt, .md, .js, .ts, .json, etc.)
 * Reads file content directly and returns it as raw text.
 */
async function ingestText(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();
  const name = path.basename(filePath);

  return {
    type: 'text',
    source: filePath,
    title: name,
    rawText: content,
    meta: {
      extension: ext,
      size: Buffer.byteLength(content, 'utf-8'),
    },
  };
}

module.exports = { ingestText };
