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
