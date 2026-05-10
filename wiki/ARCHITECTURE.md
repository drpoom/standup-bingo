# OpenClaw LLM-Wiki — Architecture Specification

> **Compounding knowledge from OpenClaw session history.**
> Inspired by [Pratiyush/llm-wiki](https://github.com/Pratiyush/llm-wiki) (Karpathy pattern) and [Lacuna-wiki](https://github.com/Labhund/lacuna-wiki) (single-tool MCP + DuckDB hybrid).

---

## 1. Design Principles

| # | Principle | Rationale |
|---|-----------|-----------|
| P1 | **OpenClaw-native** — use `sessions_history`, `cron`, `sessions_spawn`, `memory_search`, `exec` | No new runtime deps; leverage existing gateway |
| P2 | **Budget-aware traversal** — never dump full context; viewport reads with token budgets | Prevents the 90k/120k context bloat we've hit before |
| P3 | **Plain markdown + git** — wiki pages are `.md` files, versioned via git commits | Audit trail, diffability, no DB lock-in |
| P4 | **Grep-first search** — keyword search via grep + frontmatter filtering | No DB needed initially; SQLite can be added later if 200+ pages need faster search |
| P5 | **Wikilink graph** — `[[like-this]]` bidirectional links between pages | Enables graph traversal, backlinks, and compounding |
| P6 | **AI-consumable exports** — `llms.txt`, `graph.jsonld`, per-page `.txt` siblings | Other agents (and future OpenClaw turns) can query the wiki |
| P7 | **Background quality agents** — Librarian, Auditor, Adversary run on cron | Knowledge compounds without manual curation |

---

## 2. Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        OpenClaw Gateway                          │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────────┐  │
│  │ sessions_    │    │   cron       │    │  sessions_spawn   │  │
│  │ history      │    │  scheduler  │    │  (subagents)      │  │
│  └──────┬───────┘    └──────┬───────┘    └───────┬───────────┘  │
│         │                   │                    │               │
│         ▼                   ▼                    ▼               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Wiki Tool Layer (AgentSkill)                │    │
│  │  wiki-compile · wiki-search · wiki-read · wiki-ingest   │    │
│  │  wiki-export · wiki-audit                                │    │
│  └─────────────────────┬───────────────────────────────────┘    │
│                        │                                        │
│         ┌──────────────┼──────────────┐                        │
│         ▼              ▼              ▼                        │
│  ┌────────────┐ ┌────────────┐ ┌──────────────┐              │
│  │  Compiler  │ │  Grep      │ │  Git Writer  │              │
│  │  (session  │ │  + FM      │ │  (audit      │              │
│  │   → md)    │ │  Search    │ │   trail)     │              │
│  └─────┬──────┘ └─────┬──────┘ └──────┬───────┘              │
│        │              │               │                        │
│        ▼              ▼               ▼                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              File Store (~/workspace/wiki/)              │    │
│  │  sessions/  entities/  concepts/  syntheses/            │    │
│  │  sources/   questions/ comparisons/                     │    │
│  │  schema.sql llms.txt   graph.jsonld                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Background Quality Agents (cron)               │    │
│  │  📚 Librarian  ·  🔍 Auditor  ·  ⚔️ Adversary           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow

### 3.1 Session → Wiki Page (Compilation Pipeline)

```
sessions_history ──► Compiler (subagent) ──► wiki/sessions/*.md
                                              │
                                    ┌─────────┼─────────┐
                                    ▼         ▼         ▼
                              entities/  concepts/  sources/
                                    │         │         │
                                    └────┬────┘         │
                                         ▼              │
                                    [[wikilinks]] added  │
                                         │              │
                                         ▼              ▼
                                    Grep search ◄───────┘ git commit
```

**Step-by-step:**

1. **`wiki-compile`** reads recent sessions via `sessions_history` (or raw session files from `~/.openclaw/sessions/`)
2. **Compiler subagent** extracts: topics, entities, decisions, code patterns, errors & fixes
3. **Writes** structured markdown pages with YAML frontmatter + `[[wikilinks]]`
4. **Grep search** scans markdown files directly with frontmatter filtering
5. **Git commit** with message like `wiki: compile session <id> → <slug>`

### 3.2 Query Flow (Budget-Aware Traversal)

```
Agent asks "wiki-search q='rust async error'"
         │
         ▼
   Grep scan + frontmatter filter ──► ranked results (slug, snippet)
         │
         ▼
   Agent picks slugs ──► wiki-read (slug, budget=2000 tokens)
         │
         ▼
   Returns: frontmatter + first N paragraphs + backlinks + outgoing links
         │
         ▼
   Agent can follow [[wikilinks]] for deeper traversal
```

**Budget enforcement:**
- `wiki-read` accepts a `budget` param (default: 2000 tokens ≈ 8000 chars)
- Returns a **viewport**: frontmatter + summary + section headers + first paragraph of each
- If page exceeds budget, returns truncated view with `[[...]]` indicators for follow-up reads
- Never dumps a full page into context

---

## 4. File & Directory Layout

```
wiki/
├── ARCHITECTURE.md          # This spec
├── README.md                # Quick start
├── schema.sql               # SQLite schema (reference only, optional future use)
├── llms.txt                 # AI-consumable index (llmstxt.org spec)
├── llms-full.txt            # Flattened text export (~5MB cap)
├── graph.jsonld             # Schema.org JSON-LD entity graph
├── sitemap.xml              # Page inventory with lastmod
│
├── sessions/                # Compiled session pages
│   ├── 2026-04-17-boss-spawn-bug.md
│   ├── 2026-04-19-context-bloat-analysis.md
│   └── ...
│
├── entities/                # Named entities (tools, projects, people)
│   ├── openclaw-gateway.md
│   ├── elango-surfers.md
│   └── ...
│
├── concepts/                # Abstract topics & patterns
│   ├── context-budget-management.md
│   ├── cron-based-async-patterns.md
│   └── ...
│
├── sources/                 # External references & raw inputs
│   ├── karpathy-llm-wiki-pattern.md
│   └── ...
│
├── syntheses/               # Cross-session synthesis pages
│   ├── debugging-workflow-patterns.md
│   └── ...
│
├── questions/               # Open questions & research gaps
│   └── how-to-reduce-subagent-context.md
│
└── comparisons/             # Side-by-side analyses
    └── llm-wiki-vs-lacuna-wiki.md
```

---

## 5. Tool Definitions (AgentSkill)

### 5.1 `wiki` — Unified Wiki Tool

| Command | Params | Description | Token Budget |
|---------|--------|-------------|--------------|
| `compile` | `--since <date>` `--limit <N>` | Compile recent sessions into wiki pages | N/A (background) |
| `search` | `q=<query>` `scope=<sessions|entities|concepts|all>` `limit=<N>` | Grep-based search with frontmatter filtering, returns ranked slug+snippet list | ~500 |
| `read` | `slug=<slug>` `budget=<tokens>` `section=<name>` | Read page viewport within token budget | `budget` (default 2000) |
| `ingest` | `url=<url>` `--title <title>` | Ingest external source into wiki | N/A (background) |
| `links` | `slug=<slug>` `direction=<in|out|both>` | List backlinks and outgoing wikilinks | ~300 |
| `export` | `format=<llms-txt|llms-full|jsonld|sitemap>` | Generate AI-consumable exports | ~1000 |
| `audit` | `--fix` | Run consistency checks (orphan links, stale pages) | ~500 |
| `status` | — | Wiki stats: page counts, index health, last compile | ~200 |

---

## 6. Grep-Based Search

### 6.1 Implementation: Grep + Frontmatter Filtering

No database dependencies. Direct filesystem scanning with case-insensitive text matching.

```python
def wiki_search(query, scope="all", limit=10):
    results = []
    for md_file in WIKI_DIR.glob("**/*.md"):
        content = md_file.read_text()
        if query.lower() in content.lower():
            fm, _ = parse_frontmatter(content)
            if scope == "all" or fm.get("type") == scope:
                results.append({
                    "path": str(md_file),
                    "slug": fm.get("slug", md_file.stem),
                    "type": fm.get("type", "unknown"),
                    "snippet": extract_snippet(content, query)
                })
    return sorted(results, key=lambda x: -x["snippet"].count(query.lower()))[:limit]
```

### 6.2 Query Pattern

- **Case-insensitive**: `query.lower() in content.lower()`
- **Frontmatter filtering**: Filter by `type` field after grep match
- **Relevance sorting**: By count of query matches in snippet

### 6.3 Performance Notes

- **Fast for <200 pages**: Grep is highly optimized
- **Future optimization**: If 200+ pages need faster search, SQLite FTS5 can be added
- **Current approach**: Simplicity over premature optimization

---

## 7. Wikilink System

### 7.1 Link Syntax

- `[[slug]]` — link to page by slug
- `[[slug|display text]]` — piped link
- `# Heading` — section anchor (within page)

### 7.2 Link Resolution

1. **Exact match**: `[[boss-spawn-bug]]` → `sessions/2026-04-17-boss-spawn-bug.md`
2. **Partial match**: `[[boss-spawn]]` → fuzzy match against index, return best hit
3. **Ghost link**: `[[future-topic]]` → creates entry in `questions/` as research gap

### 7.3 Backlink Index

Maintained via grep scanning:

```python
def _get_backlinks(slug):
    backlinks = []
    for md_file in WIKI_DIR.glob("**/*.md"):
        content = md_file.read_text()
        pattern = rf'\[\[{re.escape(slug)}(?:\|[^\]]+)?\]\]'
        if re.search(pattern, content):
            # Extract context line
            ...
    return backlinks
```

Populated during read operations by parsing `[[...]]` from page bodies. Queried by `wiki links slug=X direction=in`.

---

## 8. Git Audit Trail

Every wiki write goes through the git writer:

```bash
# Pseudocode for git_commit_wiki
cd ~/.openclaw/workspace/wiki
git add -A
git commit -m "wiki: <action> <slug> [<detail>]" \
  --author="openclaw-wiki <wiki@openclaw.ai>" \
  --date="<ISO8601>"
```

---

## 9. AI-Consumable Exports

### 9.1 `llms.txt` (llmstxt.org spec)

Generated on-demand from `*.md` file list with frontmatter parsing.

### 9.2 `graph.jsonld`

Schema.org JSON-LD graph of entities, concepts, and their relationships. Generated from frontmatter parsing (no DB dependency).

---

## 10. Integration with OpenClaw Memory System

The wiki integrates with OpenClaw's existing `memory_search` / `memory_get` system:

```
memory_search (sessions + memory/)  ←  existing, for recent/recall
         │
         ▼
wiki-search (grep over compiled pages)  ←  new, for deep/structured knowledge
```

**Complementary roles:**
- **`memory_search`**: Fast recall of recent sessions, preferences, decisions (short-term)
- **`wiki-search`**: Structured, curated knowledge with confidence scores (long-term)
- **`wiki-read`**: Deep-dive into specific topics with budget control

**Bridge**: The compiler distills session insights into wiki pages, so `memory_search` handles "what happened recently" and `wiki-search` handles "what do we know about X".

**Note on indexing**: Current implementation uses grep + frontmatter filtering. SQLite can be added later if 200+ pages need faster search.

---

## 11. Phased Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Goal**: Compile sessions → markdown pages + grep search + basic read

| Task | Description | Est. |
|------|-------------|------|
| 1.1 | **Wiki skill scaffold** — Create `~/.openclaw/workspace/skills/wiki/SKILL.md` with tool definitions | 2h |
| 1.2 | **Session compiler** — `wiki compile` reads `sessions_history`, extracts topics/entities/decisions, writes structured `.md` pages | 6h |
| 1.3 | **Grep search** — `wiki search q=...` scans markdown files with frontmatter filtering | 2h |
| 1.4 | **Budget-aware read** — `wiki read slug=... budget=...` returns viewport | 3h |
| 1.5 | **Git writer** — All writes go through `git add && git commit` | 1h |
| 1.6 | **Wikilink parser** — Extract `[[links]]` from pages | 2h |

**Deliverable**: Can compile sessions, search, and read pages with budget control.

---

## 12. Key Design Decisions

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| Search engine | Grep + frontmatter | DuckDB, Elasticsearch, Whoosh, SQLite FTS5 | Zero deps, portable, fast enough for <200 pages; SQLite can be added later |
| Storage format | Markdown + YAML frontmatter | JSON, SQLite rows, HDF5 | Git-friendly, human-readable, Obsidian-compatible |
| Index storage | None (stateless grep) | Separate service, in-memory | Simplicity; no index to corrupt |
| Quality agents | Cron + sessions_spawn | Long-running daemon, MCP server | OpenClaw-native, no new infra, push-based completion |
| Link syntax | `[[wikilinks]]` | Markdown links, URI scheme | Obsidian-compatible, bidirectional, easy to parse |
| Budget control | Token-counted viewports | Full page dump, pagination | Prevents context bloat (learned from 90k/120k incident) |
| Git audit | Per-write commits | Append-only log, separate DB | Native git tooling (diff, blame, rollback) |
| Exports | Static files (llms.txt, jsonld) | API endpoints, MCP server | Zero infra, works offline, cacheable |

---

## 13. Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Context bloat from wiki reads | Agent hits context limit | Budget-aware viewports; hard cap per read; warn at 80% |
| Stale knowledge | Wrong decisions from outdated info | Confidence decay + lifecycle states + adversary agent |
| Slow search at scale | Search takes >1s for large wikis | Add SQLite FTS5 if 200+ pages; current approach is simple |
| Ghost link explosion | Hundreds of stub pages | Librarian caps ghost page creation; auto-prune after 30d |
| Cron agent runaway | Token spend on quality agents | Budget per agent run (2000 tokens); kill after timeout |

---

## 14. Comparison with Reference Projects

| Aspect | Pratiyush/llm-wiki | Lacuna-wiki | **OpenClaw Wiki (this spec)** |
|--------|--------------------|-------------|-------------------------------|
| Source | CLI session transcripts | External URLs + PDFs | **OpenClaw sessions_history** |
| Search | Client-side fuzzy | DuckDB hybrid BM25+vector | **Grep + frontmatter filtering** (SQLite optional) |
| Navigation | Static site with search | MCP `wiki()` tool | **AgentSkill `wiki` tool** |
| Quality | 16 lint rules + CI | Sweep + synthesise skills | **Cron-spawned Librarian/Auditor/Adversary** |
| Exports | llms.txt, graph.jsonld, RSS | DuckDB queries | **llms.txt, graph.jsonld, per-page siblings** |
| Integration | CLI + MCP server | MCP server (Claude/Hermes/OpenClaw) | **Native OpenClaw (sessions_spawn, cron, memory_search)** |
| Budget control | None (full page dumps) | None explicit | **Token-budgeted viewports** |
| Audit trail | Git (build artifacts) | DuckDB WAL | **Git per-write commits** |

---

*This architecture is designed to be implementable entirely within OpenClaw's existing tool ecosystem — no new servers, no new databases, no new runtime dependencies. Just grep (already available), git (already used), and the OpenClaw gateway.*

**Principle:** Markdown is the source of truth. Indexing is optional optimization.
