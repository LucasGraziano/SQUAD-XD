'use strict';

const path = require('path');
const { ingestText } = require('./text');
const { ingestPdf } = require('./pdf');
const { ingestImage } = require('./image');
const { ingestYoutube } = require('./youtube');
const { ingestUrl } = require('./url');

const TEXT_EXTENSIONS = new Set(['.txt', '.md', '.markdown', '.js', '.ts', '.jsx', '.tsx', '.json', '.yaml', '.yml', '.csv', '.html', '.xml', '.py', '.rb', '.go', '.rs', '.java', '.cs', '.cpp', '.c', '.h', '.sh', '.bash']);
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

/**
 * Factory: detects source type and routes to the correct ingestor.
 * @param {string} source - file path or URL
 * @returns {Promise<{type, source, title, rawText, meta}>}
 */
async function ingest(source) {
  // Detect URL types
  if (source.startsWith('http://') || source.startsWith('https://')) {
    if (isYoutubeUrl(source)) {
      return ingestYoutube(source);
    }
    return ingestUrl(source);
  }

  // File-based detection
  const ext = path.extname(source).toLowerCase();

  if (ext === '.pdf') {
    return ingestPdf(source);
  }

  if (IMAGE_EXTENSIONS.has(ext)) {
    return ingestImage(source);
  }

  if (TEXT_EXTENSIONS.has(ext) || ext === '') {
    return ingestText(source);
  }

  // Default: try text ingestor for unknown extensions
  return ingestText(source);
}

function isYoutubeUrl(url) {
  return url.includes('youtube.com/watch') ||
    url.includes('youtu.be/') ||
    url.includes('youtube.com/shorts/') ||
    url.includes('youtube.com/embed/');
}

module.exports = { ingest };
