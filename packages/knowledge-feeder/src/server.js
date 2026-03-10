'use strict';

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { config } = require('./utils/config');
const logger = require('./utils/logger');
const { ingest } = require('./ingestors');
const { summarize } = require('./processors/summarizer');
const { route } = require('./processors/router');
const { save, list, search } = require('./writers/knowledge-store');
const { writeToAgents } = require('./writers/memory-writer');

// SSE clients registry
const sseClients = new Set();

function broadcast(type, message) {
  const data = logger.sseMessage(type, message);
  for (const client of sseClients) {
    client.write(`data: ${data}\n\n`);
  }
}

function createServer(port = config.defaultPort) {
  const app = express();
  const upload = multer({ dest: path.join(require('os').tmpdir(), 'aios-kf-uploads') });

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // SSE endpoint for real-time log streaming
  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));

    res.write(`data: ${logger.sseMessage('info', 'Connected to AIOS Knowledge Feeder')}\n\n`);
  });

  // Process a URL or YouTube link
  app.post('/api/ingest/url', async (req, res) => {
    const { url, agents: agentsOverride } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'url is required' });
    }

    res.json({ status: 'processing', message: 'Processing started' });

    processSource(url, null, agentsOverride ? agentsOverride.split(',').map((a) => a.trim()) : null).catch((err) => {
      broadcast('error', `Failed: ${err.message}`);
    });
  });

  // Process uploaded files
  app.post('/api/ingest/file', upload.array('files'), async (req, res) => {
    const files = req.files;
    const agentsOverride = req.body.agents
      ? req.body.agents.split(',').map((a) => a.trim())
      : null;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    res.json({ status: 'processing', message: `Processing ${files.length} file(s)` });

    for (const file of files) {
      // Rename with original extension so ingestors detect type correctly
      const originalExt = path.extname(file.originalname).toLowerCase();
      const renamedPath = file.path + originalExt;
      await fs.move(file.path, renamedPath, { overwrite: true });

      processSource(renamedPath, file.originalname, agentsOverride)
        .catch((err) => broadcast('error', `Failed ${file.originalname}: ${err.message}`))
        .finally(() => fs.remove(renamedPath).catch(() => {}));
    }
  });

  // List knowledge entries
  app.get('/api/knowledge', async (req, res) => {
    try {
      const { agent } = req.query;
      const entries = await list(agent || null);
      res.json({ entries });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Search knowledge
  app.get('/api/knowledge/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) return res.status(400).json({ error: 'q parameter required' });
      const entries = await search(q);
      res.json({ entries });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // List available agents
  app.get('/api/agents', (_req, res) => {
    res.json({
      agents: ['dev', 'architect', 'data-engineer', 'qa', 'devops', 'pm', 'po', 'analyst', 'ux-design-expert'],
    });
  });

  async function processSource(source, displayName, agentsOverride) {
    const name = displayName || source;
    broadcast('step', `[1/4] Ingesting: ${name}`);

    const ingested = await ingest(source);
    broadcast('step', `[2/4] Processing with Claude: "${ingested.title}"`);

    const processed = await summarize(ingested, agentsOverride);
    broadcast('step', `[3/4] Routing to agents...`);

    const agents = route(processed, agentsOverride);
    broadcast('info', `  Relevant agents: ${agents.join(', ') || 'none'}`);

    broadcast('step', `[4/4] Writing to knowledge store...`);
    const { id, filePath } = await save(ingested, processed, agents);

    if (agents.length > 0) {
      await writeToAgents(agents, ingested, processed, id);
    }

    broadcast('success', `Done! Knowledge ID: ${id} | File: docs/knowledge/${id}.md`);
    if (agents.length > 0) {
      broadcast('info', `  MEMORY.md updated for: ${agents.join(', ')}`);
    }
  }

  return app;
}

function start(port = config.defaultPort) {
  const app = createServer(port);

  app.listen(port, () => {
    logger.success(`AIOS Knowledge Feeder running at http://localhost:${port}`);
  });

  return app;
}

module.exports = { createServer, start };
