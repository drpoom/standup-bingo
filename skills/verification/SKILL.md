# Verification Skill - Critical Info Fact-Checking

## Purpose

Add a verification step for critical information before presenting it as fact. This reduces hallucination impact by cross-referencing important claims.

## When to Use

Trigger verification when the query involves:

- **Financial decisions** (investments, stock recommendations, earnings)
- **Legal/compliance** matters
- **Medical/health** information
- **Technical specifications** (hardware compatibility, system requirements)
- **Time-sensitive news** (earnings reports, product launches, regulatory changes)
- **Numerical claims** (statistics, prices, dates, version numbers)
- **Quotes or citations** from specific sources

## Verification Process

### Step 1: Identify Critical Claims

Before answering, identify which claims need verification:
- Numbers (prices, dates, statistics)
- Specific company/product names
- Technical specifications
- Regulatory/legal statements
- Medical claims

### Step 2: Cross-Reference with Web Search

For each critical claim, use `ollama_web_search` to verify:

```
Search query examples:
- "[COMPANY] earnings April 2026"
- "[PRODUCT] specifications 2026"
- "[EVENT] date confirmed"
- "[STATISTIC] source verification"
```

### Step 3: Multi-Source Confirmation

For high-stakes information:
1. Search with 2-3 different query formulations
2. Fetch full content from top 2-3 sources using `ollama_web_fetch`
3. Compare claims across sources
4. Note any discrepancies

### Step 4: Confidence Rating

Rate each verified claim:

- ✅ **Confirmed** - Multiple reliable sources agree
- ⚠️ **Partial** - Sources disagree or limited confirmation
- ❌ **Unverified** - No reliable sources found
- 🔄 **Outdated** - Information may have changed

### Step 5: Present with Transparency

Format responses to show verification status:

```markdown
## Verified Information ✅

[Claim] - Source: [URL/date]

## Unverified/Uncertain ⚠️

[Claim] - Note: [why uncertain, what's missing]

## Sources

1. [Title](URL) - [date]
2. [Title](URL) - [date]
```

## Example Workflow

**User asks:** "Should I buy TSM stock after their earnings?"

**Verification steps:**

1. Search: "TSM earnings April 2026 results"
2. Search: "TSMC Q1 2026 revenue guidance"
3. Fetch: Official TSM investor relations page
4. Fetch: Reuters/Bloomberg earnings summary
5. Compare: Official guidance vs analyst expectations
6. Present: Verified facts + uncertainty + sources

## Tools Required

- `ollama_web_search` - Search for current information
- `ollama_web_fetch` - Fetch full article content
- `exec` - Optional: query APIs directly for structured data

## Configuration

Add to agent system prompt or session context:

```
VERIFICATION MODE: Enabled for critical claims
- Financial/legal/medical/technical claims require web verification
- Present confidence level for each claim
- Cite sources with URLs
- Flag unverified information clearly
```

## Limitations

- Verification adds latency (5-15 seconds per search)
- Some information may not be publicly available
- Sources may conflict - present all sides
- Cannot verify future predictions or opinions

## Integration with OpenClaw

This skill works with:
- `openclaw-web-search` plugin (already enabled)
- Ollama cloud models with tool support
- Any channel (Telegram, webchat, etc.)

---

**Remember:** Verification doesn't eliminate hallucination - it catches it before reaching the user. Always present uncertainty transparently.
