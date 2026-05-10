# Security Audit Skill

**Owner:** Scout (QA)
**Purpose:** Vulnerability scanning, secret detection, dependency CVE checks, code security review

---

## When to Use

- **Pre-deployment**: Run before any production release
- **After dependency updates**: Check for new CVEs
- **Code review**: Review security-critical changes (auth, payments, data access)
- **Periodic audits**: Monthly security health checks

---

## Automated Checks

### 1. Dependency Vulnerabilities
```bash
# Node.js projects
npm audit --audit-level=high
npx audit-ci --moderate

# Python projects
pip audit
safety check

# Generic (works for any project)
osv-scanner scan
```

### 2. Secret Detection
```bash
# Scan for hardcoded secrets
grep -rE "(api_key|apikey|api-key|secret|password|passwd|token|auth|credential).*[=:].{8,}" \
  --include="*.js" --include="*.ts" --include="*.py" --include="*.env" \
  src/ config/ 2>/dev/null

# Check for .env files in version control
git ls-files | grep -E "\.env|\.pem|\.key|credentials"
```

### 3. Code Security Patterns
```markdown
Check for:
- SQL injection risks (string concatenation in queries)
- XSS risks (innerHTML, dangerouslySetInnerHTML, unescaped output)
- CSRF protection (tokens on state-changing operations)
- Authentication bypass (missing auth checks on sensitive routes)
- Path traversal (user input in file paths without sanitization)
- Command injection (user input in exec/spawn calls)
```

### 4. Configuration Security
```markdown
- CORS settings (not wildcard * for production APIs)
- HTTPS enforcement (no HTTP in production)
- Security headers (CSP, HSTS, X-Frame-Options)
- Debug mode disabled in production
- Error messages don't leak stack traces
```

---

## Manual Review Triggers

🚨 **Require human review if found:**
- Hardcoded API keys or tokens
- Disabled SSL/TLS verification
- SQL queries with string interpolation
- Admin routes without authentication
- File upload without type/size validation
- Webhook endpoints without signature verification

---

## Workflow

### Pre-Deployment Audit
1. Run `npm audit` / `pip audit`
2. Scan for secrets with grep patterns
3. Check security-critical files (auth, payments, user data)
4. Verify security headers on deployed site
5. Generate report with findings

### CVE Response
1. Identify affected dependency
2. Check if vulnerable code path is used
3. Update to patched version OR apply workaround
4. Re-run audit to confirm fix
5. Document in changelog

---

## Tools to Use

- `exec`: Run security scanners, grep patterns
- `web_search`: Check CVE databases, security advisories
- `web_fetch`: Pull security bulletins from vendor sites
- `browser`: Test deployed site for security headers
- `message`: Alert user immediately if critical vulnerability found

---

## Severity Classification

| Level | Response Time | Action |
|-------|---------------|--------|
| **Critical** | Immediate | Block deployment, alert user, fix now |
| **High** | <24 hours | Fix before next deployment |
| **Medium** | <1 week | Schedule fix, document risk |
| **Low** | Next sprint | Add to backlog |

---

## Output Format

Always produce:
1. **Summary**: Pass/Fail with severity breakdown
2. **Findings**: Each issue with location, severity, fix recommendation
3. **CVE list**: Vulnerable dependencies with patched versions
4. **Action items**: What must be fixed before deployment

Example:
```markdown
## Security Audit Results

**Status:** ⚠️ FAIL - 2 High, 3 Medium issues

### Critical/High Issues (Must Fix)
1. **Hardcoded API key** in `src/config.js:15`
   - Found: `const API_KEY = "sk_live_..."`
   - Fix: Move to environment variable
   - Severity: HIGH

2. **SQL injection risk** in `src/users.js:42`
   - Found: `db.query("SELECT * FROM users WHERE id=" + userId)`
   - Fix: Use parameterized query
   - Severity: HIGH

### Dependency CVEs
- `lodash@4.17.19` → Update to `4.17.21` (Prototype Pollution)
- `axios@0.21.0` → Update to `0.21.1` (SSRF vulnerability)

### Recommendations
- Add CSP header to prevent XSS
- Enable rate limiting on API endpoints
```

---

## Integration with CI/CD

Add to Scout's pre-push checklist:
1. ✅ `npm audit` passes (or documented exceptions)
2. ✅ No hardcoded secrets detected
3. ✅ Security headers present on deployed site
4. ✅ Auth flows tested (login, logout, session expiry)

---

## ⚡ Task Decomposition Protocol (MANDATORY)

**Per AGENTS.md:** Complex tasks (≥1 min, multi-turn) MUST be decomposed into atomic 1-2 min subtasks.

### Pre-Flight Decomposition Check (MANDATORY — Added 2026-05-10)

**Decompose BEFORE executing if ANY apply:**
- ❌ Cannot complete in a **single turn** (work spans multiple responses)
- ❌ Requires **subagent spawns** (each spawn = separate turn for result)
- ❌ Has **sequential dependencies** between steps (step 2 blocked by step 1 output)
- ❌ External API calls with **failure/retry risk** (web fetches, searches)

**Can skip decomposition if:**
- ✅ All work fits in **one turn** (multiple tool calls OK)
- ✅ No subagents needed
- ✅ No step depends on previous step's output
- ✅ All tools are direct (`edit`/`read`/`write`/simple `exec`)

**Time saved:** 1-10 minutes (avoiding wasted multi-turn execution if plan is wrong)

**Example — Skip Decomposition:**
```markdown
Task: "Run security audit on 5 files"
→ 5x `read` + grep patterns, all independent
→ Completes in 1 turn (~20 seconds)
→ NO decomposition needed
```

**Example — Requires Decomposition:**
```markdown
Task: "Full pre-deployment security audit"
→ Dependency scan (npm audit, pip audit, osv-scanner)
→ Secret detection (grep across entire codebase)
→ Code review (SQL injection, XSS, CSRF patterns)
→ Config security check (CORS, HTTPS, headers)
→ Deployed site browser audit
→ Report assembly
→ Sequential: report needs all checks complete
→ 6+ turns, 5-10 min total
→ DECOMPOSITION REQUIRED
```

### Scout's Security Audit Decomposition

| Step | Subtask | Duration | Parallel OK? |
|------|---------|----------|--------------|
| 1 | **Dependency Scan** — `npm audit` / `pip audit` / `osv-scanner` | 1-2 min | No (blocks all) |
| 2 | **Secret Detection** — Grep patterns for API keys, tokens, passwords | 1-2 min | Yes (after step 1) |
| 3 | **Code Review** — SQL injection, XSS, CSRF, auth bypass patterns | 1-2 min | Yes (after step 1) |
| 4 | **Config Security** — CORS, HTTPS, security headers, debug mode | 1-2 min | Yes (after step 1) |
| 5 | **Deployed Site Check** — Browser audit for headers, HTTPS enforcement | 1-2 min | Yes (after step 1) |
| 6 | **Report Assembly** — Compile findings, severity, fix recommendations | 1-2 min | No (needs 2-5) |
| 7 | **Alert if Critical** — Message user immediately if critical/high found | <1 min | No (after step 6) |

**Rules:**
- Spawn subagents for atomic tasks (use `lightContext:true`)
- Parallelize independent checks (steps 2-5)
- Never run monolithic "scan everything" — break into targeted checks
- Critical findings → alert immediately, don't wait for full report
