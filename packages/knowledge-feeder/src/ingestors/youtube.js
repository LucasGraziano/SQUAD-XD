'use strict';

const { YoutubeTranscript } = require('youtube-transcript');

/**
 * Ingestor for YouTube videos.
 * Fetches transcript using youtube-transcript and concatenates into raw text.
 */
async function ingestYoutube(url) {
  // Extract video ID from URL
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error(`Could not extract YouTube video ID from: ${url}`);
  }

  let transcriptParts;
  try {
    transcriptParts = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (err) {
    throw new Error(`Failed to fetch YouTube transcript: ${err.message}. Note: video must have captions enabled.`);
  }

  const rawText = transcriptParts
    .map((part) => part.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!rawText) {
    throw new Error('YouTube transcript is empty. The video may not have captions.');
  }

  // Try to get video title from the URL (best effort)
  const title = `YouTube Video (${videoId})`;

  return {
    type: 'youtube',
    source: url,
    title,
    rawText,
    meta: {
      videoId,
      segmentCount: transcriptParts.length,
    },
  };
}

function extractVideoId(url) {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

module.exports = { ingestYoutube };
