# LLM Wiki — OpenClaw Knowledge Graph

> **Compounding knowledge from your OpenClaw sessions.**  
> Built on [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

## Status: Phase 1 — Foundation

- [x] Directory structure created
- [ ] Session compilation tool
- [ ] BM25 search index
- [ ] Basic wiki tools (search, read, ingest)
- [ ] AI-consumable exports

## Quick Start

```bash
# Compile sessions → wiki (TBD)
openclaw wiki-compile

# Search wiki (TBD)
openclaw wiki-search "query"

# Read page with viewport (TBD)
openclaw wiki-read "page-slug"
```

## Structure

```
wiki/
├── sessions/           # Compiled session transcripts
├── entities/           # People, projects, tools
├── concepts/           # Abstract ideas, patterns
├── sources/            # External references
├── syntheses/          # AI-generated summaries
├── comparisons/        # Model/tool comparisons
├── questions/          # Open questions from sessions
└── README.md           # This file

wiki-index/
├── manifest.json       # Hierarchical page index
├── graph.jsonld        # Entity/concept graph
└── search.idx          # BM25 index
```

## Design Principles

1. **No vector DB (initially)** — BM25 + wikilinks for controllability
2. **Budget-aware traversal** — Never dump full pages into context
3. **Git audit trail** — Every wiki write = commit with agent attribution
4. **Synthesis cache** — Query answers become first-class wiki pages
5. **OpenClaw-native** — Use existing tools (sessions_history, cron, sessions_spawn)

## Agent Team Roles

| Agent | Role | Wiki Responsibility |
|-------|------|---------------------|
| **Mickey** 🐕 | Router | Orchestrates wiki ops, never edits directly |
| **Archie** 📐 | Architect | System design, architecture specs |
| **Byte** ⚡ | Coder | Tool implementation |
| **Scout** 🔍 | QA | Quality audits, lint rules |
| **Sashay** 🎨 | Creative | Synthesis page generation |

---

*See ARCHITECTURE.md for full system design.*
