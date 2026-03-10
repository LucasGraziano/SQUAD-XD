#!/usr/bin/env node
'use strict';

const { program } = require('commander');
const path = require('path');
const ora = require('ora');
const { config, validate } = require('./utils/config');
const logger = require('./utils/logger');
const { ingest } = require('./ingestors');
const { summarize } = require('./processors/summarizer');
const { route } = require('./processors/router');
const { save, list, search } = require('./writers/knowledge-store');
const { writeToAgents } = require('./writers/memory-writer');

program
  .name('aios-feed')
  .description('AIOS Knowledge Feeder — ingest PDFs, images, YouTube, URLs and text into agent memory')
  .version('1.0.0');

// ─── add command ───────────────────────────────────────────────────────────────
program
  .command('add <source>')
  .description('Ingest a file path or URL into the knowledge store')
  .option('-a, --agents <agents>', 'Comma-separated list of agents to target (e.g. dev,architect)')
  .action(async (source, opts) => {
    try {
      validate();
    } catch (err) {
      logger.error(err.message);
      process.exit(1);
    }

    const agentsOverride = opts.agents
      ? opts.agents.split(',').map((a) => a.trim()).filter(Boolean)
      : null;

    logger.header('AIOS Knowledge Feeder');

    // Resolve relative paths
    const resolvedSource = source.startsWith('http') ? source : path.resolve(process.cwd(), source);

    const spinner = ora({ text: 'Ingesting source...', color: 'cyan' }).start();

    try {
      spinner.text = '[1/4] Ingesting source...';
      const ingested = await ingest(resolvedSource);
      spinner.succeed(`Ingested: "${ingested.title}" (${ingested.type})`);

      spinner.start('[2/4] Summarizing with Claude...');
      const processed = await summarize(ingested, agentsOverride);
      spinner.succeed(`Summary generated. Tags: ${(processed.tags || []).join(', ')}`);

      spinner.start('[3/4] Routing to agents...');
      const agents = route(processed, agentsOverride);
      spinner.succeed(`Relevant agents: ${agents.length > 0 ? agents.join(', ') : 'none (saving to knowledge store only)'}`);

      spinner.start('[4/4] Writing to knowledge store...');
      const { id, filePath } = await save(ingested, processed, agents);

      if (agents.length > 0) {
        await writeToAgents(agents, ingested, processed, id);
      }

      spinner.stop();
      logger.header('Complete');
      logger.success(`Knowledge ID: ${id}`);
      logger.info(`  File: ${filePath}`);
      logger.info(`  Index: ${path.join(config.knowledgeDir, 'index.yaml')}`);
      if (agents.length > 0) {
        logger.info(`  MEMORY.md updated for: ${agents.join(', ')}`);
      }
    } catch (err) {
      spinner.fail(`Error: ${err.message}`);
      logger.error(err.stack || err.message);
      process.exit(1);
    }
  });

// ─── serve command ─────────────────────────────────────────────────────────────
program
  .command('serve')
  .description('Start the Web UI server')
  .option('-p, --port <port>', 'Port to listen on', String(config.defaultPort))
  .action(async (opts) => {
    try {
      validate();
    } catch (err) {
      logger.error(err.message);
      process.exit(1);
    }

    const port = parseInt(opts.port, 10);
    const { start } = require('./server');

    logger.header('AIOS Knowledge Feeder — Web UI');
    logger.info(`Starting server on port ${port}...`);

    start(port);

    // Open browser after short delay
    setTimeout(async () => {
      try {
        const open = require('open');
        await open(`http://localhost:${port}`);
        logger.success(`Browser opened at http://localhost:${port}`);
      } catch (_) {
        logger.info(`Open your browser at: http://localhost:${port}`);
      }
    }, 1000);

    logger.dim('Press Ctrl+C to stop the server');
  });

// ─── sync-mb command ──────────────────────────────────────────────────────────
program
  .command('sync-mb')
  .description('Sync knowledge from Mega Brain into AIOS agents')
  .option('-s, --source <path>', 'Path to Mega Brain root (overrides config)')
  .option('-f, --full', 'Force full resync (ignore sync state)')
  .option('-t, --type <type>', 'Filter type: dna, dossiers, playbooks, empresa')
  .option('-a, --agents <agents>', 'Override agent routing (comma-separated)')
  .option('-d, --dry-run', 'Show what would be synced without writing')
  .action(async (opts) => {
    try {
      validate();
    } catch (err) {
      logger.error(err.message);
      process.exit(1);
    }

    const { scanMegaBrainKnowledge, scanMegaBrainEmpresa, parseDnaYaml, parseMdDocument, computeFileHash } = require('./ingestors/mega-brain');
    const { loadState, saveState, getChangedFiles, updateFileEntry } = require('./utils/sync-state');

    const mbConfig = config.megaBrain || {};
    const sourcePath = opts.source || mbConfig.sourcePath;

    if (!sourcePath) {
      logger.error('Mega Brain source path not configured. Use --source or set megaBrain.sourcePath in core-config.yaml');
      process.exit(1);
    }

    const agentsOverride = opts.agents
      ? opts.agents.split(',').map((a) => a.trim()).filter(Boolean)
      : null;

    // Build type filter
    let typeFilter = null;
    if (opts.type) {
      typeFilter = { dna: false, dossiers: false, playbooks: false, empresa: false };
      if (opts.type === 'empresa') {
        typeFilter.empresa = true;
      } else if (typeFilter.hasOwnProperty(opts.type)) {
        typeFilter[opts.type] = true;
      } else {
        logger.error(`Unknown type: ${opts.type}. Valid: dna, dossiers, playbooks, empresa`);
        process.exit(1);
      }
    }

    logger.header('AIOS Knowledge Feeder — Mega Brain Sync');
    logger.info(`Source: ${sourcePath}`);
    logger.info(`Mode: ${opts.full ? 'full resync' : 'incremental'}`);
    if (opts.type) logger.info(`Type filter: ${opts.type}`);
    if (opts.dryRun) logger.info('DRY RUN — no files will be written');

    const spinner = ora({ text: 'Scanning Mega Brain...', color: 'cyan' }).start();

    try {
      // 1. Scan files
      const knowledgeFiles = (!typeFilter || typeFilter.dna || typeFilter.dossiers || typeFilter.playbooks)
        ? await scanMegaBrainKnowledge(sourcePath, mbConfig.knowledgePath || 'knowledge', typeFilter)
        : [];

      const empresaFiles = (!typeFilter || typeFilter.empresa)
        ? await scanMegaBrainEmpresa(sourcePath, mbConfig.empresaPath || 'agents/sua-empresa')
        : [];

      const allFiles = [...knowledgeFiles, ...empresaFiles];
      spinner.succeed(`Found ${allFiles.length} files (${knowledgeFiles.length} knowledge, ${empresaFiles.length} empresa)`);

      if (allFiles.length === 0) {
        logger.warn('No files found to sync.');
        return;
      }

      // 2. Compute hashes
      spinner.start('Computing file hashes...');
      for (const file of allFiles) {
        file.hash = await computeFileHash(file.absolutePath);
      }
      spinner.succeed('Hashes computed');

      // 3. Load state and detect changes
      const stateFilePath = mbConfig.syncStateFile || path.join(config.projectRoot, '.aios/mb-sync-state.json');
      const state = opts.full ? { lastSync: null, sourcePath: null, files: {} } : await loadState(stateFilePath);
      const { newFiles, modifiedFiles, unchangedFiles } = getChangedFiles(allFiles, state);

      const toProcess = [...newFiles, ...modifiedFiles];

      logger.info(`Changes: ${newFiles.length} new, ${modifiedFiles.length} modified, ${unchangedFiles.length} unchanged`);

      if (toProcess.length === 0) {
        logger.success('Everything is up to date. Nothing to sync.');
        return;
      }

      if (opts.dryRun) {
        logger.header('Dry Run — Would sync:');
        for (const f of toProcess) {
          const status = newFiles.includes(f) ? 'NEW' : 'MODIFIED';
          logger.info(`  [${status}] ${f.relativePath} (${f.mbType}/${f.category})`);
        }
        logger.header(`Total: ${toProcess.length} files would be synced`);
        return;
      }

      // 4. Process each file
      const stats = { processed: 0, agents: new Set(), errors: 0 };

      for (let i = 0; i < toProcess.length; i++) {
        const file = toProcess[i];
        const label = `[${i + 1}/${toProcess.length}] ${path.basename(file.absolutePath)}`;
        spinner.start(`${label} — ingesting...`);

        try {
          // Ingest
          let ingested;
          if (file.absolutePath.endsWith('.yaml') || file.absolutePath.endsWith('.yml')) {
            ingested = await parseDnaYaml(file.absolutePath, file);
          } else {
            ingested = await parseMdDocument(file.absolutePath, file);
          }

          // Summarize
          spinner.text = `${label} — summarizing...`;
          const processed = await summarize(ingested, agentsOverride);

          // Attach meta for router
          processed.meta = ingested.meta;

          // Route
          spinner.text = `${label} — routing...`;
          const agents = route(processed, agentsOverride);

          // Save
          spinner.text = `${label} — saving...`;
          const { id } = await save(ingested, processed, agents);

          if (agents.length > 0) {
            await writeToAgents(agents, ingested, processed, id);
            agents.forEach((a) => stats.agents.add(a));
          }

          // Update state
          updateFileEntry(state, file.relativePath, file.hash, id);
          state.sourcePath = sourcePath;
          stats.processed++;

          spinner.succeed(`${label} → ${id} → agents: ${agents.join(', ') || 'none'}`);
        } catch (err) {
          spinner.fail(`${label} — ERROR: ${err.message}`);
          stats.errors++;
        }
      }

      // 5. Save state
      await saveState(stateFilePath, state);

      // 6. Summary
      logger.header('Sync Complete');
      logger.success(`Processed: ${stats.processed}/${toProcess.length} files`);
      logger.info(`  Agents updated: ${stats.agents.size > 0 ? Array.from(stats.agents).join(', ') : 'none'}`);
      logger.info(`  Knowledge store: ${path.join(config.knowledgeDir, 'index.yaml')}`);
      logger.info(`  Sync state: ${stateFilePath}`);
      if (stats.errors > 0) {
        logger.warn(`  Errors: ${stats.errors}`);
      }
    } catch (err) {
      spinner.fail(`Error: ${err.message}`);
      logger.error(err.stack || err.message);
      process.exit(1);
    }
  });

// ─── list command ──────────────────────────────────────────────────────────────
program
  .command('list')
  .description('List ingested knowledge entries')
  .option('-a, --agent <agent>', 'Filter by agent name')
  .action(async (opts) => {
    try {
      const entries = await list(opts.agent || null);

      if (entries.length === 0) {
        logger.info('No knowledge entries found.');
        return;
      }

      logger.header(`Knowledge Store (${entries.length} entries)`);

      for (const e of entries) {
        logger.info(`[${e.id}] ${e.title}`);
        logger.dim(`       Type: ${e.type} | Date: ${e.date} | Agents: ${(e.agents || []).join(', ')}`);
        logger.dim(`       Tags: ${(e.tags || []).join(', ')}`);
      }
    } catch (err) {
      logger.error(err.message);
      process.exit(1);
    }
  });

// ─── search command ────────────────────────────────────────────────────────────
program
  .command('search <query>')
  .description('Search knowledge entries by title, tags, or source')
  .action(async (query) => {
    try {
      const entries = await search(query);

      if (entries.length === 0) {
        logger.info(`No results for: "${query}"`);
        return;
      }

      logger.header(`Search Results for "${query}" (${entries.length})`);

      for (const e of entries) {
        logger.success(`[${e.id}] ${e.title}`);
        logger.dim(`       Source: ${e.source}`);
        logger.dim(`       Tags: ${(e.tags || []).join(', ')} | Agents: ${(e.agents || []).join(', ')}`);
      }
    } catch (err) {
      logger.error(err.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no command given
if (process.argv.length < 3) {
  program.help();
}
