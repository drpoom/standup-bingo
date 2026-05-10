-- OpenClaw LLM-Wiki: SQLite FTS5 Schema
-- BM25 search index + metadata + wikilink backlinks

-- FTS5 virtual table for full-text search (BM25 ranking)
-- tokenize='porter unicode61' provides Porter stemming + Unicode support
CREATE VIRTUAL TABLE IF NOT EXISTS wiki_pages USING fts5(
  slug,
  title,
  body,
  type,           -- session, entity, concept, source, synthesis, question, comparison
  projects,       -- comma-separated
  entities,       -- comma-separated
  concepts,       -- comma-separated
  tokenize='porter unicode61'
);

-- Metadata table (not FTS) - stores structured page info
CREATE TABLE IF NOT EXISTS wiki_meta (
  slug TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  date TEXT,
  session_id TEXT,
  projects TEXT,       -- JSON array
  entities TEXT,       -- JSON array
  concepts TEXT,       -- JSON array
  confidence REAL DEFAULT 0.5,
  lifecycle TEXT DEFAULT 'draft',  -- draft, reviewed, verified, stale, archived
  token_count INTEGER DEFAULT 0,
  last_compiled TEXT,
  git_sha TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Wikilink backlink index
CREATE TABLE IF NOT EXISTS wiki_links (
  from_slug TEXT NOT NULL,
  to_slug TEXT NOT NULL,
  context TEXT,         -- surrounding 100 chars
  link_type TEXT DEFAULT 'wikilink',  -- wikilink, section, ghost
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (from_slug, to_slug)
);

-- Index for efficient backlink queries
CREATE INDEX IF NOT EXISTS idx_wiki_links_to ON wiki_links(to_slug);
CREATE INDEX IF NOT EXISTS idx_wiki_links_from ON wiki_links(from_slug);

-- Index for lifecycle queries
CREATE INDEX IF NOT EXISTS idx_wiki_meta_lifecycle ON wiki_meta(lifecycle);
CREATE INDEX IF NOT EXISTS idx_wiki_meta_type ON wiki_meta(type);
CREATE INDEX IF NOT EXISTS idx_wiki_meta_date ON wiki_meta(date DESC);
