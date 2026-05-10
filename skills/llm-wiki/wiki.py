#!/usr/bin/env python3
"""
OpenClaw LLM-Wiki core tools: compile sessions, grep-based search, budget-aware reads, AI exports
Simplified: Markdown is the source of truth. Indexing is optional optimization.
"""

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
    
    # Simple YAML parsing
    frontmatter = {}
    for line in frontmatter_str.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            # Parse lists
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
        # Return first 150 chars if no match
        return content[:max_chars].replace('\n', ' ').strip()
    
    start = max(0, idx - 50)
    end = min(len(content), idx + max_chars)
    
    snippet = content[start:end]
    if start > 0:
        snippet = "..." + snippet
    if end < len(content):
        snippet = snippet + "..."
    
    return snippet.replace('\n', ' ').strip()


def wiki_compile(since_minutes=1440, limit=5):
    """
    Compile recent OpenClaw sessions into wiki pages.
    
    Args:
        since_minutes: Minutes ago (default 1440 = last 24h)
        limit: Max sessions to compile
    
    Returns:
        List of compiled page slugs
    """
    import subprocess
    
    # Fetch recent sessions via OpenClaw CLI
    cmd = ["openclaw", "sessions", "--json", "--active", str(since_minutes)]
    
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(WIKI_DIR.parent))
    
    if result.returncode != 0:
        print(f"Error fetching sessions: {result.stderr}")
        return []
    
    try:
        sessions_data = json.loads(result.stdout)
        sessions = sessions_data.get("sessions", [])[:limit]
    except json.JSONDecodeError:
        print(f"Error parsing sessions JSON: {result.stdout}")
        return []
    
    compiled = []
    for session in sessions:
        slug = _compile_session(session)
        if slug:
            compiled.append(slug)
    
    return compiled


def _compile_session(session):
    """Compile a single session into a wiki page."""
    session_id = session.get("sessionId", "unknown")
    session_key = session.get("key", "")
    
    # Build transcript path from session key
    # Format: agent:main:telegram:direct:425039645 → ~/.openclaw/agents/main/sessions/<sessionId>.jsonl
    parts = session_key.split(":")
    if len(parts) >= 2:
        agent_id = parts[1]  # e.g., "main"
        transcript_dir = Path.home() / ".openclaw" / "agents" / agent_id / "sessions"
        transcript_file = transcript_dir / f"{session_id}.jsonl"
    else:
        return None
    
    # Read session transcript
    if not transcript_file.exists():
        print(f"Transcript not found: {transcript_file}")
        return None
    
    with open(transcript_file, 'r') as f:
        transcript = f.read()
    
    # Extract key info (simplified extraction)
    summary = _extract_summary(transcript)
    decisions = _extract_decisions(transcript)
    errors_fixes = _extract_errors(transcript)
    entities = _extract_entities(transcript)
    concepts = _extract_concepts(transcript)
    
    # Generate slug from session date + key topic
    updated_at = session.get("updatedAt", 0)
    date_str = datetime.fromtimestamp(updated_at / 1000).strftime("%Y-%m-%d")
    topic = entities[0] if entities else "session"
    slug = f"{date_str}-{topic.lower().replace(' ', '-')}"
    
    # Build markdown content
    content = _build_page_content(slug, summary, decisions, errors_fixes, entities, concepts, session_id, date_str)
    
    # Write page
    page_path = SESSIONS_DIR / f"{slug}.md"
    page_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(page_path, 'w') as f:
        f.write(content)
    
    # Git commit
    _git_commit(f"wiki: compile {session_id} → {slug}", [str(page_path)])
    
    return slug


def _extract_summary(transcript):
    """Extract session summary from transcript."""
    # Simplified: first meaningful 500 chars
    lines = transcript.split('\n')
    summary_lines = []
    for line in lines[:50]:
        if line.strip() and not line.startswith('{') and not line.startswith('['):
            summary_lines.append(line)
    return '\n'.join(summary_lines)[:500] or "Session transcript analysis pending."


def _extract_decisions(transcript):
    """Extract key decisions from transcript."""
    decisions = []
    for line in transcript.split('\n'):
        lower = line.lower()
        if 'decided' in lower or 'decision' in lower or 'conclusion' in lower:
            decisions.append(line.strip())
    return decisions[:5] if decisions else ["No explicit decisions recorded"]


def _extract_errors(transcript):
    """Extract errors and fixes from transcript."""
    errors = []
    for line in transcript.split('\n'):
        lower = line.lower()
        if 'error' in lower or 'fix' in lower or 'bug' in lower or 'issue' in lower:
            errors.append(line.strip())
    return errors[:5] if errors else ["No errors recorded"]


def _extract_entities(transcript):
    """Extract entity mentions from transcript."""
    entities = []
    known_entities = ['openclaw', 'threejs', 'vue', 'github', 'telegram', 'ollama', 'wiki', 'llm']
    for entity in known_entities:
        if entity.lower() in transcript.lower():
            entities.append(entity)
    return list(set(entities))[:5] if entities else ["general"]


def _extract_concepts(transcript):
    """Extract abstract concepts from transcript."""
    concepts = []
    known_concepts = ['context-management', 'debugging', 'ci-pipeline', 'game-loop', 'session-analysis', 'knowledge-base']
    for concept in known_concepts:
        if concept.lower() in transcript.lower():
            concepts.append(concept)
    return list(set(concepts))[:5] if concepts else ["session-analysis"]


def _build_page_content(slug, summary, decisions, errors_fixes, entities, concepts, session_id, date_str):
    """Build markdown page with YAML frontmatter."""
    entities_list = ', '.join(entities) if entities else 'none'
    concepts_list = ', '.join(concepts) if concepts else 'none'
    
    # Build wikilinks
    entity_links = ' '.join([f"[[{e}]]" for e in entities])
    concept_links = ' '.join([f"[[{c}]]" for c in concepts])
    
    frontmatter = f"""---
slug: {slug}
type: session
date: {date_str}
session_id: {session_id}
entities: [{entities_list}]
concepts: [{concepts_list}]
confidence: 0.75
lifecycle: draft
---

# Session {date_str}

## Summary

{summary}

## Key Decisions

"""
    
    for d in decisions:
        frontmatter += f"- {d}\n"
    
    frontmatter += "\n## Errors & Fixes\n\n"
    
    for e in errors_fixes:
        frontmatter += f"- {e}\n"
    
    frontmatter += f"\n## Related\n\n"
    if entity_links:
        frontmatter += f"**Entities:** {entity_links}\n"
    if concept_links:
        frontmatter += f"**Concepts:** {concept_links}\n"
    
    return frontmatter


def _git_commit(message, files):
    """Git commit wiki changes."""
    import subprocess
    
    try:
        subprocess.run(
            ["git", "add"] + files,
            cwd=str(WIKI_DIR.parent),
            capture_output=True,
            check=True
        )
        subprocess.run(
            ["git", "commit", "-m", message, "--author=OpenClaw Wiki <wiki@openclaw.ai>"],
            cwd=str(WIKI_DIR.parent),
            capture_output=True,
            check=True
        )
    except subprocess.CalledProcessError as e:
        print(f"Git commit failed (non-fatal): {e}")


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
    
    # Map scope to directory
    scope_map = {
        "sessions": "sessions",
        "entities": "entities",
        "concepts": "concepts",
        "syntheses": "syntheses",
        "questions": "questions",
        "comparisons": "comparisons",
        "sources": "sources",
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
        
        # Case-insensitive grep
        if query.lower() not in content.lower():
            continue
        
        # Parse frontmatter for type filter
        fm, _ = parse_frontmatter(content)
        file_type = fm.get("type", "unknown")
        
        # Apply scope filter
        if scope != "all" and file_type != scope:
            continue
        
        results.append({
            "path": str(md_file),
            "slug": fm.get("slug", md_file.stem),
            "type": file_type,
            "snippet": extract_snippet(content, query)
        })
    
    # Sort by relevance (count of query matches)
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
    # Determine page type and path
    for page_type in ['sessions', 'entities', 'concepts', 'syntheses', 'questions', 'comparisons', 'sources']:
        page_path = WIKI_DIR / page_type / f"{slug}.md"
        if page_path.exists():
            break
    else:
        return {"error": f"Page not found: {slug}"}
    
    with open(page_path, 'r') as f:
        content = f.read()
    
    # Parse frontmatter
    frontmatter, body = parse_frontmatter(content)
    
    # Enforce token budget
    max_chars = budget * 4  # ~4 chars per token
    total_chars = len(body)
    
    # Extract sections
    sections = _extract_sections(body)
    
    # Build viewport within budget
    viewport_parts = []
    chars_used = 0
    
    # Always include summary
    if sections.get('summary'):
        viewport_parts.append(f"## Summary\n\n{sections['summary']}\n")
        chars_used += len(sections['summary']) + 15
    
    # Add sections until budget
    truncated_sections = []
    for section_name, section_content in sections.items():
        if section_name == 'summary':
            continue
        if chars_used + len(section_content) + 50 > max_chars:
            truncated_sections.append(section_name)
            # Add header only
            viewport_parts.append(f"## {section_name}\n\n[...truncated...]\n")
            chars_used += 50
            break
        viewport_parts.append(f"## {section_name}\n\n{section_content}\n")
        chars_used += len(section_content) + 50
    
    # Get links
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
        
        # Check if this file links to the target slug
        pattern = rf'\[\[{re.escape(slug)}(?:\|[^\]]+)?\]\]'
        if re.search(pattern, content):
            # Extract context (line containing the link)
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
    
    # Collect all markdown files grouped by type
    pages_by_type = {}
    for page_type in ['sessions', 'entities', 'concepts', 'syntheses', 'questions', 'comparisons', 'sources']:
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
    
    # Build output
    for page_type, pages in pages_by_type.items():
        if pages:
            output.append(f"\n## {page_type.title()}\n")
            for page in sorted(pages, key=lambda x: x["slug"]):
                output.append(f"- {page_type}/{page['slug']}.md: {page['title']}\n")
    
    output_path = WIKI_DIR / "llms.txt"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        f.writelines(output)
    
    return str(output_path)


def _export_jsonld():
    """Generate graph.jsonld (Schema.org entity graph) from frontmatter."""
    graph = []
    
    # Scan all page types
    for page_type in ['sessions', 'entities', 'concepts']:
        type_dir = WIKI_DIR / page_type
        if not type_dir.exists():
            continue
        
        for md_file in type_dir.glob("*.md"):
            try:
                content = md_file.read_text()
                fm, body = parse_frontmatter(content)
                
                # Determine Schema type based on page type
                if page_type == 'sessions':
                    schema_type = "SoftwareApplication"
                    description = fm.get('summary', body[:500] if body else "Session transcript")
                elif page_type == 'entities':
                    schema_type = "SoftwareApplication"
                    description = body[:500] if body else ""
                else:  # concepts
                    schema_type = "Concept"
                    description = body[:500] if body else ""
                
                entity = {
                    "@id": f"wiki:{page_type}/{fm.get('slug', md_file.stem)}",
                    "@type": schema_type,
                    "name": fm.get('slug', md_file.stem),
                    "description": description[:500]  # Truncate if needed
                }
                
                # Add entities/concepts from frontmatter as related items
                if page_type == 'sessions':
                    entities = fm.get('entities', [])
                    concepts = fm.get('concepts', [])
                    related = [f"wiki:entities/{e}" for e in entities] + [f"wiki:concepts/{c}" for c in concepts]
                    if related:
                        entity["about"] = related
                
                # Add wikilinks from body
                links = parse_wikilinks(body)
                if links:
                    existing = entity.get("about", [])
                    new_links = [f"wiki:{l['slug']}" for l in links if f"wiki:{l['slug']}" not in existing]
                    if new_links:
                        entity["about"] = existing + new_links
                
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


def _export_llms_full():
    """Generate flattened llms-full.txt (capped at ~5MB)."""
    output = []
    max_chars = 5_000_000  # 5MB cap
    total_chars = 0
    
    for page_type in ['sessions', 'entities', 'concepts', 'syntheses', 'questions', 'comparisons', 'sources']:
        type_dir = WIKI_DIR / page_type
        if not type_dir.exists():
            continue
        
        for md_file in sorted(type_dir.glob("*.md")):
            if total_chars > max_chars:
                output.append(f"\n=== TRUNCATED: more pages ===\n")
                break
            
            try:
                content = md_file.read_text()
                fm, body = parse_frontmatter(content)
                title = fm.get('slug', md_file.stem)
                
                section = f"\n=== {page_type.upper()}/{md_file.stem} ===\n"
                section += f"# {title}\n\n"
                section += body + "\n"
                
                output.append(section)
                total_chars += len(section)
            except Exception:
                continue
    
    output_path = WIKI_DIR / "llms-full.txt"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        f.writelines(output)
    
    return str(output_path)


def _export_sitemap():
    """Generate sitemap.xml from markdown files."""
    output = ['<?xml version="1.0" encoding="UTF-8"?>\n']
    output.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    
    for page_type in ['sessions', 'entities', 'concepts', 'syntheses', 'questions', 'comparisons', 'sources']:
        type_dir = WIKI_DIR / page_type
        if not type_dir.exists():
            continue
        
        for md_file in sorted(type_dir.glob("*.md")):
            try:
                content = md_file.read_text()
                fm, _ = parse_frontmatter(content)
                slug = fm.get('slug', md_file.stem)
                lastmod = fm.get('date', datetime.now().isoformat())
                
                output.append(f'  <url>\n')
                output.append(f'    <loc>wiki:{page_type}/{slug}</loc>\n')
                output.append(f'    <lastmod>{lastmod}</lastmod>\n')
                output.append(f'  </url>\n')
            except Exception:
                continue
    
    output.append('</urlset>\n')
    
    output_path = WIKI_DIR / "sitemap.xml"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        f.writelines(output)
    
    return str(output_path)


# ============================================================================
# CLI ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: wiki.py <command> [args]")
        print("Commands: compile, search, read, export")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "compile":
        since_minutes = int(sys.argv[2]) if len(sys.argv) > 2 else 1440
        limit = int(sys.argv[3]) if len(sys.argv) > 3 else 5
        result = wiki_compile(since_minutes, limit)
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
            sys.exit(1)
        else:
            print(result["viewport"])
            print(f"\n--- Budget Info ---")
            print(f"Requested: {result['budget_info']['requested']} tokens")
            print(f"Used: {result['budget_info']['used_tokens']} tokens")
            print(f"Total chars: {result['budget_info']['total_chars']}")
            print(f"Truncated sections: {result['budget_info']['truncated_sections']}")
            print(f"--- Links: {len(result['outgoing_links'])} outgoing, {len(result['incoming_links'])} incoming ---")
    
    elif command == "export":
        format = sys.argv[2] if len(sys.argv) > 2 else "llms-txt"
        # Accept both full and short names
        if format == "graph-jsonld":
            format = "jsonld"
        elif format == "llms-txt":
            format = "llms-txt"
        elif format == "llms-full-txt":
            format = "llms-full"
        path = wiki_export(format)
        print(f"Exported to: {path}")
    
    else:
        print(f"Unknown command: {command}")
        print("Supported: compile, search, read, export")
        sys.exit(1)
