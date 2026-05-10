---
name: llm-wiki
version: "1.0.0"
description: "OpenClaw LLM-Wiki core tools: compile sessions, grep-based search, budget-aware reads, AI exports"
author: "OpenClaw"
tags: [wiki, knowledge, sessions, compile]
category: "knowledge"
---

# OpenClaw LLM-Wiki Skill

Compile OpenClaw sessions into a structured wiki with grep-based search, budget-aware reads, and AI-consumable exports.

**Principle:** Markdown is the source of truth. Indexing is optional optimization.

## Commands

| Command | Params | Description |
|---------|--------|-------------|
| `compile` | `--since <date>` `--limit <N>` | Compile recent sessions → wiki pages |
| `search` | `q=<query>` `scope=<all\|sessions\|entities\|concepts>` `limit=<N>` | Grep-based search over wiki |
| `read` | `slug=<slug>` `budget=<tokens>` | Budget-aware page viewport |
| `export` | `format=<llms-txt\|jsonld>` | Generate AI-consumable exports |

---

## Implementation

```python
import json
import re
import os
from datetime import datetime
from pathlib import Path

WIKI_DIR = Path("/home/poomk/.openclaw/workspace/wiki")
SESSIONS_DIR = WIKI_DIR / "sessions"
ENTITIES_DIR = WIKI_DIR / "entities"
CONCEPTS_DIR = WIKI_DIR / "concepts"

def parse_frontmatter(content):
    """Parse YAML frontmatter from markdown."""
    if not content.startswith('---'):
        return {}, content
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        return {}, content
    
    frontmatter_str = parts[1].strip()
    body = parts[2].strip()
    
    frontmatter = {}
    for line in frontmatter_str.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            if value.startswith('[') and value.endswith(']'):
                value = value[1:-1].split(',')
                value = [v.strip() for v in value if v.strip()]
            frontmatter[key] = value
    
    return frontmatter, body

def parse_wikilinks(content):
    """Extract [[wikilinks]] from markdown content."""
    pattern = r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]'
    links = []
    for match in re.finditer(pattern, content):
        slug = match.group(1).strip()
        display = match.group(2) if match.group(2) else slug
        links.append({"slug": slug, "display": display})
    return links

def estimate_tokens(text):
    """Rough token estimate: 1 token ≈ 4 chars."""
    return len(text) // 4

def extract_snippet(content, query, max_chars=150):
    """Extract a snippet from content around the query match."""
    content_lower = content.lower()
    query_lower = query.lower()
    
    idx = content_lower.find(query_lower)
    if idx == -1:
        return content[:max_chars].replace('\n', ' ').strip()
    
    start = max(0, idx - 50)
    end = min(len(content), idx + max_chars)
    
    snippet = content[start:end]
    if start > 0:
        snippet = "..." + snippet
    if end < len(content):
        snippet = snippet + "..."
    
    return snippet.replace('\n', ' ').strip()

# ============================================================================
# WIKI SEARCH — Grep + Frontmatter Filtering
# ============================================================================

def wiki_search(query, scope="all", limit=10):
    """
    Simple grep-based search over wiki markdown files.
    
    Args:
        query: Search query string
        scope: Filter by type (sessions, entities, concepts, all)
        limit: Max results to return
    
    Returns:
        List of {path, slug, type, snippet} sorted by relevance
    """
    results = []
    
    scope_map = {
        "sessions": "sessions",
        "entities": "entities",
        "concepts": "concepts",
        "all": None
    }
    
    search_dir = scope_map.get(scope)
    
    if search_dir:
        md_files = list((WIKI_DIR / search_dir).glob("*.md"))
    else:
        md_files = list(WIKI_DIR.glob("**/*.md"))
    
    for md_file in md_files:
        try:
            content = md_file.read_text()
        except Exception:
            continue
        
        if query.lower() not in content.lower():
            continue
        
        fm, _ = parse_frontmatter(content)
        file_type = fm.get("type", "unknown")
        
        if scope != "all" and file_type != scope:
            continue
        
        results.append({
            "path": str(md_file),
            "slug": fm.get("slug", md_file.stem),
            "type": file_type,
            "snippet": extract_snippet(content, query)
        })
    
    results.sort(key=lambda x: -x["snippet"].lower().count(query.lower()))
    
    return results[:limit]

# ============================================================================
# WIKI READ — Budget-Aware Page Viewport
# ============================================================================

def wiki_read(slug, budget=2000):
    """
    Read a wiki page with token budget enforcement.
    
    Args:
        slug: Page slug to read
        budget: Max tokens to return (default 2000 ≈ 8000 chars)
    
    Returns:
        Dict with frontmatter, summary, sections, links, budget_info
    """
    for page_type in ['sessions', 'entities', 'concepts', 'syntheses', 'questions', 'comparisons', 'sources']:
        page_path = WIKI_DIR / page_type / f"{slug}.md"
        if page_path.exists():
            break
    else:
        return {"error": f"Page not found: {slug}"}
    
    with open(page_path, 'r') as f:
        content = f.read()
    
    frontmatter, body = parse_frontmatter(content)
    
    max_chars = budget * 4
    total_chars = len(body)
    
    sections = _extract_sections(body)
    
    viewport_parts = []
    chars_used = 0
    
    if sections.get('summary'):
        viewport_parts.append(f"## Summary\n\n{sections['summary']}\n")
        chars_used += len(sections['summary']) + 15
    
    truncated_sections = []
    for section_name, section_content in sections.items():
        if section_name == 'summary':
            continue
        if chars_used + len(section_content) + 50 > max_chars:
            truncated_sections.append(section_name)
            viewport_parts.append(f"## {section_name}\n\n[...truncated...]\n")
            chars_used += 50
            break
        viewport_parts.append(f"## {section_name}\n\n{section_content}\n")
        chars_used += len(section_content) + 50
    
    outgoing = parse_wikilinks(body)
    incoming = _get_backlinks(slug)
    
    tokens_used = estimate_tokens('\n'.join(viewport_parts))
    
    return {
        "slug": slug,
        "type": page_type,
        "frontmatter": frontmatter,
        "viewport": '\n'.join(viewport_parts),
        "outgoing_links": outgoing,
        "incoming_links": incoming,
        "budget_info": {
            "requested": budget,
            "used_tokens": tokens_used,
            "total_chars": total_chars,
            "truncated_sections": truncated_sections,
            "is_truncated": len(truncated_sections) > 0
        }
    }

def _extract_sections(body):
    """Extract sections from markdown body."""
    sections = {}
    current_section = 'summary'
    current_content = []
    
    for line in body.split('\n'):
        if line.startswith('## '):
            if current_content:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = line[3:].strip().lower().replace(' ', '_')
            current_content = []
        else:
            current_content.append(line)
    
    if current_content:
        sections[current_section] = '\n'.join(current_content).strip()
    
    return sections

def _get_backlinks(slug):
    """Get pages that link to this slug by scanning all markdown files."""
    backlinks = []
    
    for md_file in WIKI_DIR.glob("**/*.md"):
        try:
            content = md_file.read_text()
        except Exception:
            continue
        
        pattern = rf'\[\[{re.escape(slug)}(?:\|[^\]]+)?\]\]'
        if re.search(pattern, content):
            for line in content.split('\n'):
                if re.search(pattern, line):
                    backlinks.append({
                        "from": md_file.stem,
                        "context": line.strip()[:100]
                    })
                    break
    
    return backlinks

# ============================================================================
# WIKI EXPORT — AI-Consumable Formats
# ============================================================================

def wiki_export(format="llms-txt"):
    """
    Generate AI-consumable exports.
    
    Args:
        format: Export format (llms-txt, jsonld, llms-full, sitemap)
    
    Returns:
        Path to generated file
    """
    if format == "llms-txt":
        return _export_llms_txt()
    elif format == "jsonld":
        return _export_jsonld()
    elif format == "llms-full":
        return _export_llms_full()
    elif format == "sitemap":
        return _export_sitemap()
    else:
        raise ValueError(f"Unknown export format: {format}")

def _export_llms_txt():
    """Generate llms.txt (llmstxt.org spec) from markdown files."""
    output = ["# OpenClaw Wiki\n", "> Compounding knowledge from OpenClaw session history.\n"]
    
    pages_by_type = {}
    for page_type in ['sessions', 'entities', 'concepts']:
        type_dir = WIKI_DIR / page_type
        if type_dir.exists():
            pages_by_type[page_type] = []
            for md_file in type_dir.glob("*.md"):
                try:
                    content = md_file.read_text()
                    fm, _ = parse_frontmatter(content)
                    title = fm.get('slug', md_file.stem)
                    pages_by_type[page_type].append({
                        "slug": fm.get("slug", md_file.stem),
                        "title": title
                    })
                except Exception:
                    continue
    
    for page_type, pages in pages_by_type.items():
        if pages:
            output.append(f"\n## {page_type.title()}\n")
            for page in sorted(pages, key=lambda x: x["slug"]):
                output.append(f"- {page_type}/{page['slug']}.txt: {page['title']}\n")
    
    output_path = WIKI_DIR / "llms.txt"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        f.writelines(output)
    
    return str(output_path)

def _export_jsonld():
    """Generate graph.jsonld (Schema.org entity graph) from frontmatter."""
    graph = []
    
    for page_type in ['entities', 'concepts']:
        type_dir = WIKI_DIR / page_type
        if not type_dir.exists():
            continue
        
        for md_file in type_dir.glob("*.md"):
            try:
                content = md_file.read_text()
                fm, body = parse_frontmatter(content)
                
                entity = {
                    "@id": f"wiki:{page_type}/{fm.get('slug', md_file.stem)}",
                    "@type": "SoftwareApplication" if page_type == 'entities' else "Concept",
                    "name": fm.get('slug', md_file.stem),
                    "description": body[:500] if body else ""
                }
                
                links = parse_wikilinks(body)
                if links:
                    entity["about"] = [f"wiki:{l['slug']}" for l in links]
                
                graph.append(entity)
            except Exception:
                continue
    
    output = {
        "@context": "https://schema.org",
        "@graph": graph
    }
    
    output_path = WIKI_DIR / "graph.jsonld"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    return str(output_path)

# ============================================================================
# CLI ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: wiki-skill.py <command> [args]")
        print("Commands: compile, search, read, export")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "compile":
        since = sys.argv[2] if len(sys.argv) > 2 else None
        limit = int(sys.argv[3]) if len(sys.argv) > 3 else 5
        result = wiki_compile(since, limit)
        print(f"Compiled {len(result)} sessions: {result}")
    
    elif command == "search":
        query = sys.argv[2] if len(sys.argv) > 2 else ""
        scope = sys.argv[3] if len(sys.argv) > 3 else "all"
        limit = int(sys.argv[4]) if len(sys.argv) > 4 else 10
        results = wiki_search(query, scope, limit)
        for r in results:
            print(f"[{r['type']}/{r['slug']}] {r['snippet']}")
    
    elif command == "read":
        slug = sys.argv[2] if len(sys.argv) > 2 else ""
        budget = int(sys.argv[3]) if len(sys.argv) > 3 else 2000
        result = wiki_read(slug, budget)
        if "error" in result:
            print(result["error"])
        else:
            print(result["viewport"])
            print(f"\n--- Links: {len(result['outgoing_links'])} outgoing, {len(result['incoming_links'])} incoming ---")
    
    elif command == "export":
        format = sys.argv[2] if len(sys.argv) > 2 else "llms-txt"
        path = wiki_export(format)
        print(f"Exported to: {path}")
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
```

---

## Usage Examples

```bash
# Compile last 5 sessions
python wiki-skill.py compile

# Compile sessions from last 7 days
python wiki-skill.py compile 7d 10

# Search for "context budget"
python wiki-skill.py search "context budget" all 5

# Read a page with 2000 token budget
python wiki-skill.py read boss-spawn-bug 2000

# Export llms.txt
python wiki-skill.py export llms-txt

# Export JSON-LD graph
python wiki-skill.py export jsonld
```

---

*Follows ARCHITECTURE.md. Uses grep + frontmatter filtering for search. SQLite can be added later if 200+ pages need faster search.*
