'use strict';

const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Ingestor for web URLs.
 * Fetches HTML, strips navigation/headers/scripts, and returns clean text.
 */
async function ingestUrl(url) {
  let html;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AIOS-KnowledgeFeeder/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 15000,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    html = await response.text();
  } catch (err) {
    throw new Error(`Failed to fetch URL: ${err.message}`);
  }

  const $ = cheerio.load(html);

  // Remove noise elements
  $('script, style, nav, header, footer, aside, .nav, .navigation, .menu, .sidebar, .ads, .advertisement, .cookie-banner, iframe, noscript').remove();

  // Extract title
  const title = $('meta[property="og:title"]').attr('content')
    || $('title').text()
    || new URL(url).hostname;

  // Extract main content — prefer article/main, fallback to body
  let rawText = '';
  const mainSelectors = ['article', 'main', '[role="main"]', '.content', '.post', '.entry-content', 'body'];

  for (const sel of mainSelectors) {
    const el = $(sel);
    if (el.length > 0) {
      rawText = el.text().replace(/\s+/g, ' ').trim();
      if (rawText.length > 200) break;
    }
  }

  if (!rawText) {
    rawText = $('body').text().replace(/\s+/g, ' ').trim();
  }

  if (!rawText || rawText.length < 50) {
    throw new Error('Could not extract meaningful text from this URL. The page may require JavaScript or authentication.');
  }

  return {
    type: 'url',
    source: url,
    title: title.trim(),
    rawText,
    meta: {
      domain: new URL(url).hostname,
      length: rawText.length,
    },
  };
}

module.exports = { ingestUrl };
