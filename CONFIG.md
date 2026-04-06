# OpenClaw Configuration - Anti-Hallucination Settings

## ✅ Enabled Features

### 1. Ollama Web Search (Always On)
- **Plugin:** `@ollama/openclaw-web-search` v0.2.2
- **Status:** ✅ Enabled
- **Tools:** `ollama_web_search`, `ollama_web_fetch`
- **Behavior:** Search for ALL factual queries by default

### 2. Critical Info Verification
- **Skill:** `/home/poomk/.openclaw/workspace/skills/verification/SKILL.md`
- **Status:** ✅ Active
- **Triggers:** Financial, legal, medical, technical, numerical claims

### 3. Source Citation
- **Requirement:** Always cite URLs and dates for verified claims
- **Format:** `[Claim] - Source: [URL](date)`

### 4. Uncertainty Flagging
- **Rule:** Never guess - admit uncertainty explicitly
- **Ratings:** ✅ Confirmed | ⚠️ Partial | ❌ Unverified | 🔄 Outdated

## 🔧 Configuration Files

- **Agent Config:** `~/.openclaw/agents/main/agent/config.json`
- **Plugin Config:** `~/.openclaw/openclaw.json` (plugins.entries.openclaw-web-search)
- **Verification Skill:** `~/.openclaw/workspace/skills/verification/SKILL.md`

## 📋 Verification Checklist

Before presenting critical information:

- [ ] Searched web for current info (ollama_web_search)
- [ ] Cross-referenced 2+ sources for important claims
- [ ] Checked dates (info not outdated)
- [ ] Noted any discrepancies between sources
- [ ] Added confidence rating (✅/⚠️/❌)
- [ ] Cited sources with URLs

## 🎯 When Verification is Required

**ALWAYS verify:**
- Stock/company information (earnings, M&A, products)
- Technical specs (hardware, software versions)
- Dates, times, deadlines
- Prices, costs, financial data
- Legal/regulatory claims
- Medical/health information
- Statistics or research findings

**OPTIONAL verification:**
- General knowledge (well-established facts)
- Opinions or recommendations
- Creative/content generation

## 🚀 Usage Example

```
User: "What's TSM's latest earnings result?"

Agent workflow:
1. Search: "TSM earnings April 2026 Q1 results"
2. Search: "TSMC revenue Q1 2026 guidance"
3. Fetch: Official investor relations page
4. Compare: Multiple news sources
5. Present: ✅ Verified facts + ⚠️ uncertainties + 📚 sources
```

## ⚙️ System Settings

```json
{
  "tools.web.search": {
    "provider": "openclaw",
    "enabled": true
  },
  "plugins.entries.openclaw-web-search": {
    "enabled": true
  },
  "behavior.verification_mode": "enabled"
}
```

---

**Last updated:** 2026-04-06  
**Purpose:** Reduce hallucination impact through mandatory web verification
