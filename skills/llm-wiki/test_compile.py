#!/usr/bin/env python3
"""Test wiki compile with recent sessions."""

import sqlite3
import json
import re
import os
import subprocess
from datetime import datetime
from pathlib import Path

WIKI_DIR = Path("/home/poomk/.openclaw/workspace/wiki")
INDEX_DB = WIKI_DIR.parent / "wiki-index" / "index.db"
SESSIONS_DIR = WIKI_DIR / "sessions"
WORKSPACE_DIR = WIKI_DIR.parent

def get_db():
    """Get SQLite connection with FTS5 BM25 support."""
    conn = sqlite3.connect(str(INDEX_DB))
    conn.row_factory = sqlite3.Row
    return conn

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

def _extract_summary(transcript):
    """Extract session summary from transcript."""
    lines = transcript.split('\n')
    summary_lines = []
    for line in lines[:50]:
        if line.strip() and not line.startswith('{') and not line.startswith('['):
            summary_lines.append(line)
    return '\n'.join(summary_lines)[:500] if summary_lines else "Session transcript analysis pending."

def _extract_decisions(transcript):
    """Extract key decisions from transcript."""
    decisions = []
    for line in transcript.split('\n'):
        if 'decided' in line.lower() or 'decision' in line.lower() or 'implement' in line.lower():
            decisions.append(line.strip())
    return decisions[:5] if decisions else ["No explicit decisions recorded"]

def _extract_errors(transcript):
    """Extract errors and fixes from transcript."""
    errors = []
    for line in transcript.split('\n'):
        if 'error' in line.lower() or 'fix' in line.lower() or 'bug' in line.lower() or 'issue' in line.lower():
            errors.append(line.strip())
    return errors[:5] if errors else ["No errors recorded"]

def _extract_entities(transcript):
    """Extract entity mentions from transcript."""
    entities = []
    known_entities = ['openclaw', 'threejs', 'vue', 'github', 'telegram', 'ollama', 'sqlite', 'wiki', 'llm']
    for entity in known_entities:
        if entity.lower() in transcript.lower():
            entities.append(entity)
    return list(set(entities))[:5] if entities else ['general']

def _extract_concepts(transcript):
    """Extract abstract concepts from transcript."""
    concepts = []
    known_concepts = ['context-management', 'debugging', 'ci-pipeline', 'game-loop', 'bm25', 'fts5', 'session-compile']
    for concept in known_concepts:
        if concept.lower() in transcript.lower():
            concepts.append(concept)
    return list(set(concepts))[:5] if concepts else ['session-analysis']

def _build_page_content(summary, decisions, errors_fixes, entities, concepts, session_id, date_str, slug):
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

def _parse_frontmatter(content):
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

def _update_index(slug, page_type, content, session_id, date_str, entities, concepts, links):
    """Update SQLite FTS5 index and metadata."""
    conn = get_db()
    cursor = conn.cursor()
    
    frontmatter, body = _parse_frontmatter(content)
    title = frontmatter.get('slug', slug)
    
    cursor.execute("""
        INSERT OR REPLACE INTO wiki_pages (slug, title, body, type, entities, concepts)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (slug, title, body, page_type, ','.join(entities), ','.join(concepts)))
    
    cursor.execute("""
        INSERT OR REPLACE INTO wiki_meta (slug, type, date, session_id, entities, concepts, last_compiled)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (slug, page_type, date_str, session_id, json.dumps(entities), json.dumps(concepts), datetime.now().isoformat()))
    
    cursor.execute("DELETE FROM wiki_links WHERE from_slug = ?", (slug,))
    
    for link in links:
        cursor.execute("""
            INSERT OR IGNORE INTO wiki_links (from_slug, to_slug, context)
            VALUES (?, ?, ?)
        """, (slug, link['slug'], link['display']))
    
    conn.commit()
    conn.close()

def _git_commit(message, files):
    """Git commit wiki changes."""
    try:
        subprocess.run(
            ["git", "add"] + files,
            cwd=str(WORKSPACE_DIR),
            capture_output=True,
            check=True
        )
        subprocess.run(
            ["git", "commit", "-m", message, "--author=OpenClaw Wiki <wiki@openclaw.ai>"],
            cwd=str(WORKSPACE_DIR),
            capture_output=True,
            check=True
        )
        print(f"  ✓ Git commit: {message}")
    except subprocess.CalledProcessError as e:
        print(f"  ⚠ Git commit failed (non-fatal): {e.stderr.decode()[:100] if e.stderr else 'unknown'}")

def compile_session(session, idx):
    """Compile a single session into a wiki page."""
    session_id = session.get("sessionId", "unknown")
    # Build session file path from known location
    session_file = f"/home/poomk/.openclaw/agents/main/sessions/{session_id}.jsonl"
    
    if not os.path.exists(session_file):
        # Try trajectory file as fallback
        session_file = f"/home/poomk/.openclaw/agents/main/sessions/{session_id}.trajectory.jsonl"
        if not os.path.exists(session_file):
            print(f"  ⚠ Session file not found: {session_id}")
            return None
    
    with open(session_file, 'r') as f:
        transcript = f.read()
    
    summary = _extract_summary(transcript)
    decisions = _extract_decisions(transcript)
    errors_fixes = _extract_errors(transcript)
    entities = _extract_entities(transcript)
    concepts = _extract_concepts(transcript)
    
    updated_at = session.get("updatedAt", 0)
    date_str = datetime.fromtimestamp(updated_at / 1000).strftime("%Y-%m-%d")
    topic = entities[0] if entities else "session"
    slug = f"{date_str}-{topic.lower().replace(' ', '-')}-{idx:02d}"
    
    content = _build_page_content(summary, decisions, errors_fixes, entities, concepts, session_id, date_str, slug)
    
    page_path = SESSIONS_DIR / f"{slug}.md"
    page_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(page_path, 'w') as f:
        f.write(content)
    
    links = parse_wikilinks(content)
    _update_index(slug, "session", content, session_id, date_str, entities, concepts, links)
    
    _git_commit(f"wiki: compile {session_id} → {slug}", [str(page_path)])
    
    print(f"  ✓ Compiled: {slug}")
    return slug

def main():
    print("=" * 60)
    print("OpenClaw LLM-Wiki: Session Compile Demo")
    print("=" * 60)
    
    # Fetch recent sessions via OpenClaw CLI
    print("\n📥 Fetching recent sessions...")
    cmd = ["openclaw", "sessions", "--json", "--active", "10080"]  # Last 7 days
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(WORKSPACE_DIR))
    
    if result.returncode != 0:
        print(f"Error fetching sessions: {result.stderr}")
        return
    
    sessions_data = json.loads(result.stdout)
    sessions = sessions_data.get("sessions", [])[:5]
    
    print(f"Found {len(sessions)} recent sessions\n")
    
    # Compile sessions
    print("📝 Compiling sessions to wiki pages...")
    compiled = []
    for idx, session in enumerate(sessions, 1):
        print(f"\n[{idx}/{len(sessions)}] Session {session.get('sessionId', 'unknown')[:8]}...")
        slug = compile_session(session, idx)
        if slug:
            compiled.append(slug)
    
    # Summary
    print("\n" + "=" * 60)
    print(f"✅ Compiled {len(compiled)} sessions:")
    for slug in compiled:
        print(f"   - {slug}")
    
    # Test search
    print("\n🔍 Testing BM25 search...")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT slug, type, bm25(wiki_pages) as score FROM wiki_pages WHERE wiki_pages MATCH 'session' ORDER BY score LIMIT 3")
    results = cursor.fetchall()
    for r in results:
        print(f"   [{-r['score']:.4f}] {r['type']}/{r['slug']}")
    conn.close()
    
    # Test read
    if compiled:
        print(f"\n📖 Testing wiki read for {compiled[0]}...")
        page_path = SESSIONS_DIR / f"{compiled[0]}.md"
        if page_path.exists():
            with open(page_path, 'r') as f:
                content = f.read()
            print(f"   Page size: {len(content)} chars")
            print(f"   First 200 chars: {content[:200]}...")
    
    print("\n" + "=" * 60)
    print("✅ Wiki Phase 1 Demo Complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
