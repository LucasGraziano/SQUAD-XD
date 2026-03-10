/* AIOS Knowledge Feeder — Frontend JS */
'use strict';

// ─── SSE Connection ────────────────────────────────────────────────────────────
let evtSource = null;

function connectSSE() {
  if (evtSource) evtSource.close();
  evtSource = new EventSource('/api/events');

  evtSource.onopen = () => {
    setStatus('connected', 'Connected');
  };

  evtSource.onmessage = (e) => {
    try {
      const { type, message } = JSON.parse(e.data);
      appendLog(type, message);
      if (type === 'success' || type === 'error') {
        setStatus('connected', 'Ready');
        setProcessing(false);
        loadHistory();
      }
    } catch (_) {
      appendLog('dim', e.data);
    }
  };

  evtSource.onerror = () => {
    setStatus('', 'Disconnected — retrying...');
    setTimeout(connectSSE, 3000);
  };
}

// ─── Status ────────────────────────────────────────────────────────────────────
function setStatus(cls, text) {
  const dot = document.getElementById('statusDot');
  const label = document.getElementById('statusText');
  dot.className = 'status-dot' + (cls ? ' ' + cls : '');
  label.textContent = text;
}

function setProcessing(active) {
  setStatus(active ? 'processing' : 'connected', active ? 'Processing...' : 'Ready');
  document.getElementById('urlSubmitBtn').disabled = active;
}

// ─── Log ───────────────────────────────────────────────────────────────────────
function appendLog(type, message) {
  const body = document.getElementById('logBody');
  const line = document.createElement('span');
  line.className = `log-line ${type}`;

  const prefix = { info: 'ℹ ', success: '✔ ', step: '→ ', warn: '⚠ ', error: '✖ ', dim: '  ' }[type] || '';
  line.textContent = prefix + message;

  // Remove "waiting" placeholder
  const placeholder = body.querySelector('.log-line.dim');
  if (placeholder && placeholder.textContent === 'Waiting for events...') {
    placeholder.remove();
  }

  body.appendChild(line);
  body.appendChild(document.createTextNode('\n'));
  body.scrollTop = body.scrollHeight;
}

function clearLog() {
  const body = document.getElementById('logBody');
  body.innerHTML = '<span class="log-line dim">Log cleared.</span>';
}

// ─── Agent chips ───────────────────────────────────────────────────────────────
document.querySelectorAll('.agent-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('selected');
  });
});

function getSelectedAgents(containerId) {
  const container = document.getElementById(containerId);
  const checked = container.querySelectorAll('input[type="checkbox"]:checked');
  return Array.from(checked).map((c) => c.value);
}

// ─── URL Submission ────────────────────────────────────────────────────────────
async function submitUrl() {
  const url = document.getElementById('urlInput').value.trim();
  if (!url) {
    appendLog('warn', 'Please enter a URL');
    return;
  }

  const agents = getSelectedAgents('urlAgentChips');
  setProcessing(true);
  appendLog('step', `Ingesting URL: ${url}`);
  if (agents.length > 0) appendLog('info', `  Targeting agents: ${agents.join(', ')}`);

  try {
    const res = await fetch('/api/ingest/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, agents: agents.join(',') }),
    });

    if (!res.ok) {
      const data = await res.json();
      appendLog('error', data.error || 'Request failed');
      setProcessing(false);
    } else {
      document.getElementById('urlInput').value = '';
    }
  } catch (err) {
    appendLog('error', 'Network error: ' + err.message);
    setProcessing(false);
  }
}

document.getElementById('urlInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitUrl();
});

// ─── File Drop Zone ────────────────────────────────────────────────────────────
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  uploadFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => {
  uploadFiles(fileInput.files);
  fileInput.value = '';
});

async function uploadFiles(fileList) {
  if (!fileList || fileList.length === 0) return;

  const agents = getSelectedAgents('fileAgentChips');
  const formData = new FormData();

  for (const file of fileList) {
    formData.append('files', file);
    appendLog('step', `Queuing: ${file.name}`);
  }

  if (agents.length > 0) {
    formData.append('agents', agents.join(','));
    appendLog('info', `  Targeting agents: ${agents.join(', ')}`);
  }

  setProcessing(true);

  try {
    const res = await fetch('/api/ingest/file', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      appendLog('error', data.error || 'Upload failed');
      setProcessing(false);
    }
  } catch (err) {
    appendLog('error', 'Upload error: ' + err.message);
    setProcessing(false);
  }
}

// ─── History Table ─────────────────────────────────────────────────────────────
let searchTimeout = null;

function debounceSearch(query) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => performSearch(query), 400);
}

async function performSearch(query) {
  if (!query.trim()) {
    loadHistory();
    return;
  }

  try {
    const res = await fetch(`/api/knowledge/search?q=${encodeURIComponent(query)}`);
    const { entries } = await res.json();
    renderHistory(entries || []);
  } catch (err) {
    console.error('Search error:', err);
  }
}

async function loadHistory() {
  const agent = document.getElementById('agentFilter').value;
  const url = '/api/knowledge' + (agent ? `?agent=${encodeURIComponent(agent)}` : '');

  try {
    const res = await fetch(url);
    const { entries } = await res.json();
    renderHistory(entries || []);
  } catch (err) {
    console.error('Failed to load history:', err);
  }
}

function renderHistory(entries) {
  const tbody = document.getElementById('historyBody');

  if (!entries || entries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No entries found.</td></tr>';
    return;
  }

  // Show newest first
  const sorted = [...entries].reverse();

  tbody.innerHTML = sorted.map((e) => `
    <tr>
      <td><a class="id-link" href="javascript:void(0)" title="${e.file || ''}">${e.id}</a></td>
      <td>${escHtml(e.title || '')}</td>
      <td><span class="badge badge-${e.type || 'text'}">${e.type || 'text'}</span></td>
      <td style="color:var(--text-dim); white-space:nowrap">${e.date || ''}</td>
      <td>${(e.agents || []).map((a) => `<span class="agent-tag">${a}</span>`).join('')}</td>
      <td style="color:var(--text-dim); font-size:0.78rem">${(e.tags || []).join(', ')}</td>
    </tr>
  `).join('');
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Init ──────────────────────────────────────────────────────────────────────
connectSSE();
loadHistory();
