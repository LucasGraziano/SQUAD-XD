'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * Loads sync state from file, or returns empty state.
 * @param {string} stateFilePath
 * @returns {Promise<Object>}
 */
async function loadState(stateFilePath) {
  if (await fs.pathExists(stateFilePath)) {
    try {
      const content = await fs.readFile(stateFilePath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      // Corrupted state — start fresh
      return createEmptyState();
    }
  }
  return createEmptyState();
}

/**
 * Saves sync state atomically (write to temp, then rename).
 * @param {string} stateFilePath
 * @param {Object} state
 */
async function saveState(stateFilePath, state) {
  await fs.ensureDir(path.dirname(stateFilePath));
  state.lastSync = new Date().toISOString();

  const tmpPath = stateFilePath + '.tmp';
  await fs.writeFile(tmpPath, JSON.stringify(state, null, 2), 'utf-8');
  await fs.rename(tmpPath, stateFilePath);
}

/**
 * Compares current file list with previous state to detect changes.
 * @param {Object[]} currentFiles - [{ relativePath, hash }]
 * @param {Object} previousState - state object from loadState
 * @returns {{ newFiles: Object[], modifiedFiles: Object[], unchangedFiles: Object[], deletedPaths: string[] }}
 */
function getChangedFiles(currentFiles, previousState) {
  const prevFiles = previousState.files || {};
  const currentPaths = new Set();

  const newFiles = [];
  const modifiedFiles = [];
  const unchangedFiles = [];

  for (const file of currentFiles) {
    currentPaths.add(file.relativePath);
    const prev = prevFiles[file.relativePath];

    if (!prev) {
      newFiles.push(file);
    } else if (prev.hash !== file.hash) {
      modifiedFiles.push(file);
    } else {
      unchangedFiles.push(file);
    }
  }

  const deletedPaths = Object.keys(prevFiles).filter((p) => !currentPaths.has(p));

  return { newFiles, modifiedFiles, unchangedFiles, deletedPaths };
}

/**
 * Updates a single file entry in state after successful sync.
 * @param {Object} state
 * @param {string} relativePath
 * @param {string} hash
 * @param {string} knowledgeId
 */
function updateFileEntry(state, relativePath, hash, knowledgeId) {
  if (!state.files) state.files = {};
  state.files[relativePath] = {
    hash,
    syncedAt: new Date().toISOString(),
    knowledgeId,
  };
}

function createEmptyState() {
  return {
    lastSync: null,
    sourcePath: null,
    files: {},
  };
}

module.exports = { loadState, saveState, getChangedFiles, updateFileEntry };
