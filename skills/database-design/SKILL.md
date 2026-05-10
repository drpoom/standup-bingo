# Database Design Skill

**Owner:** Archie (Architect)
**Purpose:** Schema design, migration planning, ORM optimization, data modeling

---

## When to Use

- Designing new database schemas
- Planning migrations for schema changes
- Optimizing queries and indexes
- Choosing between SQL vs NoSQL for new features
- Reviewing existing schemas for anti-patterns

---

## Workflow

### 1. Requirements Analysis
```markdown
- Data entities and relationships
- Read/write patterns (read-heavy vs write-heavy)
- Scale expectations (rows, QPS)
- Consistency requirements (ACID vs eventual)
```

### 2. Schema Design
```sql
-- Always include:
- Primary keys (prefer UUID for distributed, INT for simple)
- Foreign keys with ON DELETE behavior
- Indexes for common query patterns
- Timestamps (created_at, updated_at)
- Soft delete flags if needed (deleted_at)
```

### 3. Migration Planning
```markdown
- Backward compatibility strategy
- Rollback plan
- Data migration scripts (if transforming existing data)
- Downtime estimation
```

### 4. ORM Mapping
```typescript
// For TypeScript projects:
- Entity classes with proper types
- Relationship decorators (@OneToMany, @ManyToOne)
- Index decorators
- Validation rules
```

---

## Checklist

- [ ] Normalization level appropriate (3NF for OLTP, denormalize for analytics)
- [ ] Indexes match query patterns (avoid over-indexing writes)
- [ ] Foreign keys have appropriate ON DELETE behavior
- [ ] Text fields have length limits (VARCHAR vs TEXT)
- [ ] Numeric types match expected ranges (INT vs BIGINT vs DECIMAL)
- [ ] Timestamps use UTC consistently
- [ ] Sensitive data encryption plan (PII, passwords)
- [ ] Migration tested on staging with production-sized data

---

## Common Anti-Patterns to Catch

❌ **EAV (Entity-Attribute-Value)** - Use JSONB column instead
❌ **Premature sharding** - Optimize queries/indexes first
❌ **N+1 query patterns** - Use eager loading
❌ **Missing composite indexes** - For multi-column WHERE clauses
❌ **TEXT fields without limits** - Can cause memory issues
❌ **Floating point for money** - Use DECIMAL or integer cents

---

## Tools to Use

- `exec`: Run schema validation, migration tests
- `write`: Generate migration files, schema docs
- `sessions_spawn`: Delegate migration testing to subagent
- `memory_search`: Check existing schema patterns in workspace

---

## Output Format

Always produce:
1. **Schema diagram** (Mermaid or ASCII ERD)
2. **Migration SQL** (up + down scripts)
3. **ORM entity classes** (if applicable)
4. **Index justification** (which queries each index optimizes)
