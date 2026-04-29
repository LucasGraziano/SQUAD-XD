---
name: karpathy-wiki
description: "Build and maintain a compounding knowledge base. Use when ingesting sources into the wiki, querying accumulated knowledge, linting wiki quality. Triggers: 'ingest this', 'add to wiki', 'what do I know about', 'lint my wiki', or any mention of 'wiki' in knowledge context."
---

# Karpathy Wiki — AIOX Knowledge Compounding

Build and maintain a personal knowledge base that compounds over time. The LLM writes and maintains the wiki; you read and ask questions. Adapted for the AIOX structure.

Core principle: **"The wiki is a persistent, compounding artifact."** — Andrej Karpathy

## Architecture

Three layers, all under `C:\SQUAD XD\.aiox-core\knowledge\`:

**RAW/** — Immutable source material. LLM reads, never modifies.
- Organized by topic subdirectories: `RAW/<topic>/`
- Sources: session insights, research dumps, web articles, transcripts, campaign analyses

**WIKI/** — LLM-compiled knowledge articles. You read, LLM writes and maintains.
- Organized by topic: `WIKI/<topic>/<article>.md`
- Two special files:
  - `WIKI/index.md` — Global table of contents (auto-maintained)
  - `WIKI/log.md` — Append-only operation log

**BOOKS/** (existing) — Agent libraries. TXT format. Feeds RAW/ on ingest.

---

## Ingest

Fetch or receive a source → save to RAW/ → compile into WIKI/.

### Step 1 — Save to RAW/

Save to `RAW/<topic>/YYYY-MM-DD-descriptive-slug.md`.
- Check existing subdirectories — reuse if topic is close enough
- Include metadata header: source URL/origin, collected date, content type
- Preserve original content. Clean formatting noise only. Never rewrite.

**Provenance rule:** Tag every factual claim before it enters WIKI/:
- `[VERIFIED: source]` — confirmed via tool this session
- `[CITED: url]` — referenced from a live URL
- `[ASSUMED]` — training knowledge, not verified this session → flag for confirmation

### Step 2 — Compile to WIKI/

Determine placement:
- **Same core thesis as existing article** → Merge. Add source to metadata. Update sections.
- **New concept** → Create `WIKI/<topic>/<concept>.md`.
- **Spans multiple topics** → Place in most relevant. Add See Also cross-references.

If new source contradicts existing content: annotate the conflict with source attribution.

### Step 3 — Post-Ingest Updates

1. Update `WIKI/index.md` — add or update entries for every touched article
2. Append to `WIKI/log.md`:
```
## [YYYY-MM-DD] ingest | <primary article title>
- Updated: <cascade-updated article>
```

### Initialization

On first ingest, check if RAW/ and WIKI/ exist under `.aiox-core/knowledge/`. Create only what is missing:
- `RAW/` directory
- `WIKI/` directory
- `WIKI/index.md` — heading `# Knowledge Wiki Index`, empty body
- `WIKI/log.md` — heading `# Wiki Log`, empty body

---

## Query

Search the wiki and answer questions.

Triggers:
- "What do I know about X?"
- "Summarize everything related to Y"
- "Compare A and B based on my wiki"

### Steps

1. Read `WIKI/index.md` to locate relevant articles
2. Read those articles and synthesize an answer
3. Prefer WIKI content over training knowledge. Cite with links.
4. Output answer in conversation. Do not write files unless asked.

### Archiving a Query Answer

When user asks to "archive this answer":
1. Write as new WIKI page: `WIKI/<topic>/<query-slug>.md`
2. Update `WIKI/index.md`. Prefix Summary with `[Archived]`.
3. Append to `WIKI/log.md`:
```
## [YYYY-MM-DD] query | Archived: <page title>
```

---

## Lint

Quality checks on the wiki.

### Auto-fix (deterministic)

- File exists but missing from index → add entry
- Index entry points to nonexistent file → mark `[MISSING]`
- Broken internal links → repair if single match found
- Dead See Also links → remove

### Report only (heuristic)

- Factual contradictions across articles
- Outdated claims
- Orphan pages (no inbound links)
- Concepts frequently mentioned but lacking a dedicated page
- `[ASSUMED]` claims that were never confirmed

### Post-Lint

Append to `WIKI/log.md`:
```
## [YYYY-MM-DD] lint | <N> issues found, <M> auto-fixed
```

---

## Integration with AIOX Knowledge Layer

The Wiki complements (not replaces) the existing DNA/Dossiers/Playbooks:

| Layer | What it stores | Updated by |
|-------|---------------|-----------|
| DNA (`.aiox-core/knowledge/domains/`) | Expert cognitive models — static | `/ingest` |
| Dossiers | Cross-expert convergences — periodic | `/dossier` |
| Playbooks | Operational frameworks — periodic | `/playbook` |
| **Wiki** (`WIKI/`) | **Session insights, campaign analyses, real data — compounding** | `/wiki-ingest` |

The Wiki is the **living memory** of your operation. The DNA is the **strategic foundation**.

---

## Trigger Phrases

| What you say | What happens |
|---|---|
| `"/wiki-ingest <path or url>"` | Full ingest flow |
| `"What do I know about X?"` | Query flow |
| `"Add to wiki: <content>"` | Ingest from current conversation |
| `"/wiki-lint"` | Lint flow |
| `"Archive this answer"` | Saves query answer as wiki page |
