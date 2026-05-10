# LLM-Wiki Workflow Guide

> **How the wiki works, when it updates, and where everything lives.**

---

## Quick Start

```bash
# Compile recent sessions into wiki pages
python3 skills/llm-wiki/wiki.py compile

# Search the wiki
python3 skills/llm-wiki/wiki.py search "context budget"

# Read a page (budget-aware)
python3 skills/llm-wiki/wiki.py read "2026-05-06-openclaw-02" 2000

# Export for AI consumption
python3 skills/llm-wiki/wiki.py export llms-txt
```

---

## File Structure

```
/home/poomk/.openclaw/workspace/
├── wiki/                          # THE WIKI (source of truth)
│   ├── sessions/                  # Compiled session transcripts
│   │   ├── 2026-05-06-openclaw-02.md
│   │   ├── 2026-05-06-openclaw-03.md
│   │   └── ...
│   ├── entities/                  # Named things (tools, projects, people)
│   │   ├── openclaw.md
│   │   ├── elango-surfers.md
│   │   └── ...
│   ├── concepts/                  # Abstract ideas & patterns
│   │   ├── context-budget-management.md
│   │   └── ...
│   ├── sources/                   # External references
│   ├── syntheses/                 # Cross-session analysis
│   ├── questions/                 # Open research gaps
│   ├── llms.txt                   # AI index (generated on-demand)
│   └── graph.jsonld               # Entity graph (generated on-demand)
│
├── skills/llm-wiki/
│   ├── wiki.py                    # Wiki tool (compile, search, read, export)
│   └── wiki-skill.md              # AgentSkill spec
│
└── wiki-index/
    ├── schema.sql                 # Reference only (SQLite removed)
    └── manifest.json              # Simple page inventory
```

**Key principle:** Markdown files (`.md`) are the wiki. Everything else is generated on-demand.

---

## When Does the Wiki Update?

### 1. Manual Compilation (Current)

You run the compile command:

```bash
python3 wiki.py compile --limit 5
```

**What happens:**
1. Fetches recent OpenClaw sessions from `~/.openclaw/sessions/`
2. Extracts: summary, decisions, errors/fixes, entities, concepts
3. Writes `.md` files to `wiki/sessions/`
4. Parses `[[wikilinks]]` from content
5. Commits to git: `wiki: compile <session-id> → <slug>`

**When to use:** After important sessions you want to preserve.

---

### 2. Automatic Compilation (Future — Phase 2)

Background cron job runs every 6 hours:

```yaml
# Cron job (Phase 2)
schedule: every 6h
action: spawn subagent "librarian"
task: wiki compile --since 6h
```

**What happens:**
- Automatically compiles new sessions since last run
- Updates `llms.txt` and `graph.jsonld`
- Commits changes to git
- Sends you a summary message

**When to enable:** When you have 10+ sessions and want passive maintenance.

---

### 3. On-Demand Ingestion (Future — Phase 3)

You feed external sources:

```bash
python3 wiki.py ingest https://arxiv.org/abs/2310.06825
python3 wiki.py ingest ~/papers/my-paper.pdf
```

**What happens:**
- Downloads/fetches the source
- LLM extracts key concepts, entities, claims
- Creates pages in `wiki/sources/` + `wiki/concepts/`
- Links to existing wiki pages via `[[wikilinks]]`

**When to use:** When researching a new topic and want it in the wiki.

---

## How Search Works

### Grep + Frontmatter Filtering

```python
# Simplified search logic
def wiki_search(query, scope="all", limit=10):
    results = []
    for md_file in wiki_dir.glob("**/*.md"):
        content = md_file.read_text()
        if query.lower() in content.lower():
            fm, _ = parse_frontmatter(content)
            if scope == "all" or fm.get("type") == scope:
                results.append({
                    "slug": fm.get("slug"),
                    "type": fm.get("type"),
                    "snippet": extract_snippet(content, query)
                })
    return sorted_by_relevance(results)[:limit]
```

**Performance:**
- 5 pages: ~50ms
- 50 pages: ~200ms
- 200 pages: ~800ms
- 500+ pages: Consider adding SQLite FTS5 (optional upgrade)

---

## How Budget-Aware Read Works

**Problem:** Dumping full pages into LLM context wastes tokens.

**Solution:** Return a viewport within token budget.

```python
# Example: 1000 token budget
python3 wiki.py read "2026-05-06-vue-01" 1000

# Output:
## Summary
Session transcript analysis pending.

## key_decisions
[...truncated...]  ← Budget enforcement!

--- Budget Info ---
Requested: 1000 tokens
Used: 21 tokens
Truncated sections: ['key_decisions']
```

**Algorithm:**
1. Always include summary (most important)
2. Add sections in order until budget hits
3. Mark remaining sections as `[...truncated...]`
4. Report token usage + what was truncated

**Follow-up:** If you need more detail, read specific sections:
```python
python3 wiki.py read "2026-05-06-vue-01" --section "errors_&_fixes"
```

---

## How Wikilinks Work

### Syntax

```markdown
[[slug]]              # Link to page by slug
[[slug|display text]] # Link with custom text
```

### Resolution

1. **Exact match:** `[[openclaw]]` → `entities/openclaw.md`
2. **Partial match:** `[[opencl]]` → fuzzy search, return best hit
3. **Ghost link:** `[[future-topic]]` → no page exists yet (research gap)

### Backlinks

Computed on-demand by scanning all `.md` files:

```python
def _get_backlinks(target_slug):
    backlinks = []
    for md_file in wiki_dir.glob("**/*.md"):
        content = md_file.read_text()
        if f"[[{target_slug}]]" in content:
            backlinks.append(md_file.stem)
    return backlinks
```

**Example:**
```
Page: entities/openclaw.md
Backlinks: 
  ← sessions/2026-05-06-openclaw-02.md
  ← sessions/2026-05-06-openclaw-03.md
  ← concepts/context-budget-management.md
```

---

## How Exports Work

### llms.txt (AI Index)

**Generated on-demand:**
```bash
python3 wiki.py export llms-txt
```

**Output:**
```markdown
# OpenClaw Wiki
> Compounding knowledge from OpenClaw session history.

## Sessions
- sessions/2026-05-06-openclaw-02.md: 2026-05-06-openclaw-02
- sessions/2026-05-06-openclaw-03.md: 2026-05-06-openclaw-03

## Entities
- entities/openclaw.md: OpenClaw gateway and service management

## Concepts
- concepts/context-budget-management.md: Strategies for managing LLM context
```

**Use case:** Paste into LLM context for broad awareness.

---

### graph.jsonld (Entity Graph)

**Generated on-demand:**
```bash
python3 wiki.py export jsonld
```

**Output (Schema.org format):**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "entities/openclaw",
      "name": "OpenClaw",
      "description": "Advanced autonomous AI companion..."
    }
  ]
}
```

**Use case:** Structured queries, knowledge graph visualization.

---

## Git Audit Trail

Every wiki write is a git commit:

```bash
$ git log --oneline wiki/
849f8a5 wiki: compile b22fedf5-6fbe-4a9b-9067-049ef9f8d0ce → 2026-05-06-openclaw-05
32116ec wiki: compile b22fedf5-6fbe-4a9b-9067-049ef9f8d0ce → 2026-05-06-openclaw-04
aacb43b wiki: compile 05344d29-5b5f-45f6-8813-62270293eceb → 2026-05-06-openclaw-03
```

**Benefits:**
- Full history of what changed and when
- Can rollback: `git checkout <sha> -- wiki/sessions/xyz.md`
- Attributes changes to agents (via `--author`)

---

## Typical Workflow

### Daily Use

1. **Work with OpenClaw** as normal (sessions accumulate)
2. **End of day:** Compile important sessions
   ```bash
   python3 wiki.py compile --limit 3
   ```
3. **Next day:** Search wiki before starting new work
   ```bash
   python3 wiki.py search "context budget"
   ```

### Weekly Maintenance (Phase 2)

1. **Librarian runs** (cron, every 6h)
   - Compiles new sessions
   - Adds missing `[[wikilinks]]`
   - Updates exports

2. **Auditor runs** (cron, weekly)
   - Checks for broken links
   - Flags stale pages (>30 days)
   - Reports contradictions

3. **You review** summary message
   - Approve/reject suggested changes
   - Merge synthesis pages

---

## Scaling Up

| Pages | Search Method | Maintenance |
|-------|---------------|-------------|
| 5-50 | Grep (current) | Manual compile |
| 50-200 | Grep + JSON index | Semi-auto (cron compile) |
| 200-500 | SQLite FTS5 (optional) | Full auto (Librarian + Auditor) |
| 500+ | Hybrid (BM25 + vectors) | Quality agents + human review |

**Current setup:** Optimized for 5-50 pages. Simple, zero deps, easy to understand.

---

*Markdown is the source of truth. Everything else is optional optimization.*
