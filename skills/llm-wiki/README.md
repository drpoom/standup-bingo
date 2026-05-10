# LLM Wiki Skills

Agent skills for wiki operations. Load these when agents need to query or maintain the wiki.

## Skills

| Skill | Purpose | When to Load |
|-------|---------|--------------|
| `researcher.md` | Query + traverse wiki | Answering questions from knowledge base |
| `librarian.md` | Maintenance + curation | Background quality runs |
| `auditor.md` | Quality checks | Weekly audits |
| `ingest.md` | External docs → wiki | Adding new sources |

## Usage

```bash
# Load skill for current session (TBD)
openclaw skill-load llm-wiki/researcher
```

---

*Skills are templates that prime agents to use wiki tools correctly.*
