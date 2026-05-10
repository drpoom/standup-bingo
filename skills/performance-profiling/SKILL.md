# Performance Profiling Skill

**Owner:** Scout (QA)
**Purpose:** Lighthouse audits, bundle analysis, memory leak detection, performance regression tracking

---

## When to Use

- **Pre-deployment**: Verify performance budgets are met
- **After major changes**: Profile impact of new features
- **User complaints**: Investigate slowness reports
- **Periodic audits**: Weekly performance tracking

---

## Web Performance Checks

### 1. Lighthouse Audit
```bash
# CLI (if installed)
lighthouse https://your-site.com --output=json --output-path=./lighthouse.json

# Via browser tool
browser action=snapshot with performance metrics
```

**Target Scores:**
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90

### 2. Bundle Analysis
```bash
# For webpack projects
npm run build -- --stats
npx webpack-bundle-analyzer dist/stats.json

# For Vite projects
npm run build
npx vite-bundle-visualizer

# Check bundle sizes
ls -lh dist/assets/*.js dist/assets/*.css
```

**Budget Limits:**
- Initial JS: <500KB (gzipped)
- Initial CSS: <100KB (gzipped)
- Total page weight: <2MB
- Time to Interactive: <3.5s on 3G

### 3. Core Web Vitals
```markdown
Measure:
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1
- INP (Interaction to Next Paint): <200ms
```

---

## Backend Performance Checks

### 1. API Response Times
```bash
# Measure endpoint latencies
time curl -s https://api.yoursite.com/endpoint

# Load test (if ab installed)
ab -n 1000 -c 10 https://api.yoursite.com/endpoint
```

**Target Latencies:**
- Simple GET: <100ms
- Database queries: <500ms
- Complex aggregations: <2s
- File uploads: <5s (for <10MB files)

### 2. Database Query Performance
```sql
-- Enable query logging
EXPLAIN ANALYZE SELECT * FROM users WHERE email = '...';

-- Check for:
- Full table scans (missing indexes)
- N+1 query patterns
- Lock contention
- Slow queries (>1s)
```

### 3. Memory Profiling
```bash
# Node.js
node --inspect app.js
# Then use Chrome DevTools Memory tab

# Python
python -m memory_profiler script.py

# Check for leaks:
- Growing heap over time
- Unbounded caches
- Event listener accumulation
- Closure memory retention
```

---

## Performance Budget Enforcement

### Add to `package.json` or config:
```json
{
  "performance": {
    "budgets": [
      {
        "resourceType": "script",
        "maximumSize": "500 KB"
      },
      {
        "resourceType": "stylesheet",
        "maximumSize": "100 KB"
      },
      {
        "resourceType": "total",
        "maximumSize": "2 MB"
      },
      {
        "metric": "lighthouse-performance",
        "minimumScore": 90
      },
      {
        "metric": "first-contentful-paint",
        "maximum": "1.5s"
      }
    ]
  }
}
```

---

## Common Performance Issues

### Frontend
❌ **Render-blocking resources** - Defer non-critical JS/CSS
❌ **Unoptimized images** - Use WebP, lazy loading, responsive images
❌ **Excessive re-renders** - Memoize components, use React.memo
❌ **Large bundles** - Code splitting, tree shaking, dynamic imports
❌ **Layout thrashing** - Batch DOM reads/writes, avoid forced synchronous layouts

### Backend
❌ **N+1 queries** - Use eager loading, batch queries
❌ **Missing indexes** - Add indexes for WHERE/JOIN columns
❌ **Synchronous I/O** - Use async/await for file/network operations
❌ **Unbounded loops** - Add pagination, limits, timeouts
❌ **Memory leaks** - Clear timers, unsubscribe from observables, clean up listeners

---

## Tools to Use

- `exec`: Run lighthouse, bundle analyzers, load tests
- `browser`: Capture performance metrics, screenshots
- `canvas`: Snapshot rendered UI for visual performance checks
- `web_fetch`: Pull performance data from RUM services
- `sessions_spawn`: Delegate load testing to subagent

---

## Workflow

### Pre-Deployment Performance Check
1. Build production bundle
2. Measure bundle sizes vs budget
3. Deploy to staging
4. Run Lighthouse audit
5. Check Core Web Vitals
6. Compare to baseline (detect regressions)
7. Pass/Fail with report

### Performance Regression Investigation
1. Identify when regression started (git bisect)
2. Profile before/after builds
3. Identify culprit (bundle size, new dependency, query pattern)
4. Propose fix with expected improvement
5. Verify fix restores baseline

---

## Output Format

Always produce:
1. **Summary**: Pass/Fail with scores
2. **Metrics table**: Current vs Budget vs Baseline
3. **Bottlenecks**: Top 3-5 performance issues
4. **Recommendations**: Specific fixes with estimated impact
5. **Trend**: Improving/stable/regressing vs last audit

Example:
```markdown
## Performance Audit Results

**Status:** ✅ PASS - All budgets met

### Core Web Vitals
| Metric | Current | Budget | Status |
|--------|---------|--------|--------|
| LCP | 1.8s | <2.5s | ✅ |
| FID | 45ms | <100ms | ✅ |
| CLS | 0.05 | <0.1 | ✅ |
| INP | 120ms | <200ms | ✅ |

### Bundle Sizes
| Resource | Current | Budget | Status |
|----------|---------|--------|--------|
| main.js | 312 KB | <500 KB | ✅ |
| styles.css | 67 KB | <100 KB | ✅ |
| Total | 1.2 MB | <2 MB | ✅ |

### Lighthouse Scores
- Performance: 94/100 ✅
- Accessibility: 92/100 ✅
- Best Practices: 96/100 ✅
- SEO: 98/100 ✅

### Recommendations (Optional Improvements)
1. Lazy-load chart library (save ~80KB initial load)
2. Enable text compression on API responses (save ~40% bandwidth)
3. Add service worker for offline caching (improve repeat visits)
```

---

## Integration with CI/CD

Add to Scout's pre-push checklist:
1. ✅ Bundle sizes within budget
2. ✅ Lighthouse performance score ≥90
3. ✅ No performance regressions >10% vs baseline
4. ✅ Core Web Vitals pass thresholds
