# Complex Software Development Team Skills

**Created:** 2026-05-08
**Purpose:** Upgrade agent team for complex software development workflows

---

## New Skills Added

### 1. **database-design** (Archie's specialty)
- **Location:** `~/.openclaw/workspace/skills/database-design/SKILL.md`
- **Owner:** Archie (Architect)
- **Use for:** Schema design, migrations, ORM optimization, data modeling
- **Triggers:** "database", "schema", "migration", "ORM", "entity", "table design"

### 2. **security-audit** (Scout's specialty)
- **Location:** `~/.openclaw/workspace/skills/security-audit/SKILL.md`
- **Owner:** Scout (QA)
- **Use for:** CVE checks, secret detection, vulnerability scanning, code security review
- **Triggers:** "security", "audit", "vulnerability", "CVE", "pre-deployment", "npm audit"
- **Mandatory:** Run before every production deployment

### 3. **performance-profiling** (Scout's specialty)
- **Location:** `~/.openclaw/workspace/skills/performance-profiling/SKILL.md`
- **Owner:** Scout (QA)
- **Use for:** Lighthouse audits, bundle analysis, memory profiling, Core Web Vitals
- **Triggers:** "performance", "slow", "lighthouse", "bundle", "optimization", "profiling"
- **Mandatory:** Run for major feature releases

### 4. **coding-agent** (Built-in OpenClaw skill)
- **Location:** `~/.npm-global/lib/node_modules/openclaw/skills/coding-agent/SKILL.md`
- **Owner:** Byte (Coder)
- **Use for:** Multi-file refactors, dependency analysis, complex codebase navigation
- **Triggers:** "refactor", "large-scale change", "dependency update", "codebase analysis"

---

## Agent Config Updates

### Byte (Coder) - Enhanced Tools
```json
"tools": {
  "allow": [
    "exec", "read", "write", "edit",
    "sessions_spawn",  // Can spawn coding-agent subagent
    "process"          // Can manage long builds/tests
  ]
}
```

### Scout (QA) - Security + Performance
```json
"tools": {
  "allow": [
    "exec", "read", "web_search", "web_fetch",
    "browser",         // Lighthouse audits
    "canvas",          // UI performance checks
    "sessions_spawn"   // Delegate load testing
  ]
}
```

### Archie (Architect) - Database Design
```json
"tools": {
  "allow": [
    "exec", "read", "write", "web_search", "web_fetch",
    "sessions_spawn",  // Delegate migration testing
    "memory_search"    // Check existing patterns
  ]
}
```

---

## Updated Development Pipeline

```
User Request
    ↓
Mickey (Router) → Analyzes complexity, assigns to specialist
    ↓
┌─────────────────────────────────────────────────────────────┐
│ Archie (Architect)                                          │
│ - Technical spec with data structures                       │
│ - Database schema + migrations (uses database-design skill) │
│ - API contracts, interface definitions                      │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ Byte (Coder) OR Sashay (Creative)                           │
│ - Byte: Backend logic, database integration, APIs           │
│ - Sashay: UI/UX, documentation, onboarding guides           │
│ - Byte can spawn coding-agent for large refactors           │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│ Scout (QA) - ENHANCED                                       │
│ - Run tests (parallel execution)                            │
│ - Security audit (uses security-audit skill) ⭐ NEW         │
│ - Performance profiling (uses performance-profiling) ⭐ NEW │
│ - Lighthouse audit on staging                               │
│ - CVE check on dependencies                                 │
│ - Veto if any checks fail                                   │
└─────────────────────────────────────────────────────────────┘
    ↓
Scout Approval → Mickey deploys to production
    ↓
Scout verifies live site (version + features + performance)
```

---

## Pre-Deployment Checklist (Scout's Duty)

**MANDATORY before any production release:**

1. ✅ **Tests Pass**: All regression tests pass (parallel execution)
2. ✅ **Security Audit**: `npm audit` passes, no hardcoded secrets
3. ✅ **Performance Budget**: Bundle <500KB, Lighthouse >90
4. ✅ **CVE Check**: No high/critical CVEs on dependencies
5. ✅ **CI/CD Pass**: GitHub Actions workflow shows "success"
6. ✅ **Version Bump**: Deployed version matches expected version
7. ✅ **Feature Verification**: Features match task spec (screenshots)

**Scout has VETO power** - any failure blocks deployment.

---

## When to Use Each Skill

| Scenario | Primary Agent | Skills Used |
|----------|---------------|-------------|
| New feature with DB changes | Archie → Byte | database-design |
| Dependency update | Byte → Scout | security-audit |
| Performance complaint | Scout | performance-profiling |
| Large refactor (10+ files) | Byte | coding-agent |
| Pre-deployment QA | Scout | security-audit + performance-profiling |
| API design | Archie | database-design |
| Security incident | Scout | security-audit |
| Slow page load | Scout | performance-profiling |

---

## Memory Updates Required

Update `MEMORY.md` with:
1. New skills and their locations
2. Updated agent tool permissions
3. Pre-deployment checklist
4. Scout's expanded QA responsibilities

---

## Technical Summary for Uncle John

**What changed:**
- Added 3 custom skills (database-design, security-audit, performance-profiling)
- Leveraged 1 built-in skill (coding-agent)
- Updated 3 agent configs (Archie, Byte, Scout)
- Added mandatory pre-deployment checks

**Why this helps complex dev:**
- **Security**: Automated CVE checks, secret detection before every deploy
- **Performance**: Lighthouse audits, bundle budgets enforced
- **Database**: Structured schema design process with migration safety
- **Scale**: Byte can delegate large refactors to coding-agent subagent

**Expected impact:**
- Catch vulnerabilities before production (not after)
- Prevent performance regressions
- Reduce database migration risks
- Handle larger codebases without timeout issues
