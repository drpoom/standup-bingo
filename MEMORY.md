# MEMORY.md — Mickey's Long-Term Memory

## Projects

### Playing Interval — The Secret of Moo Yang
- **Live:** `https://www.drpoom.com/playing-interval/`
- **GitHub:** `https://github.com/drpoom/playing-interval`
- **Status:** 🏆 GOLD v1.32 — All 4 chapters + credits shipped. Archived.
- **Tech:** Vue 3 + Vite + Tailwind CSS 4
- **License:** CC BY-NC-ND 4.0

### Elango Surfers
- **Live:** `https://drpoom.github.io/elango-surfers/`
- **Status:** v3.7.9 — feature complete

### COBRA — COines BRidge Access
- **GitHub:** `https://github.com/drpoom/cobra`
- **PyPI:** `https://pypi.org/project/cobra-bridge/`
- **npm:** `https://www.npmjs.com/package/cobra-bridge`
- **Current version:** 0.1.2
- **Workspace:** `/home/poomk/.openclaw/workspace/cobra/`
- **Status:** Alpha — core protocol + BMM350 driver working

### Standup Roulette
- **Live:** `https://drpoom.github.io/standup-roulette/`
- **Status:** v3.4 — Dōjō theme with AI-generated Sensei sprites deployed
- **Theme:** Neo-Edo cyber-noir, Persona 5 aesthetic

## Team

### Agent Models (Updated: 2026-04-25)

| Agent | Model | Temperature | Role | Traits |
|-------|-------|-------------|------|--------|
| **Mickey** 🐕 | `qwen3.5:cloud` | **0.4** | Router/Orchestrator | Balanced, focused but personable |
| **Archie** 📐 | `glm-5.1:cloud` | **0.15** | Architect | Deep analysis, slow, thorough |
| **Byte** ⚡ | `qwen3.5:cloud` | **0.2** | Coder | Focused, precise, snappy, low creativity |
| **Sashay** 🎨 | `qwen3.5:cloud` | 0.7+ | Creative | Artistic, imaginative, high creativity |
| **Scout** 🔍 | `glm-5.1:cloud` | **0.15** | QA | Detail-oriented, thorough reviewer |
| **Warren** 🦅 | `glm-5.1:cloud` | **0.1** | Value Investing | Conservative, analytical, Buffett/Munger philosophy |

**Model Selection Rationale:**
- **Fast agents** (Mickey, Byte, Sashay): `qwen3.5:cloud` for quick responses
- **Analytical agents** (Archie, Scout): `glm-5.1:cloud` for deep thinking

**Subagent config:** maxSpawnDepth=2, maxConcurrent=8, runTimeout=300s, allowAgents=[coder, creative, qa]

**⚠️ CRITICAL RULES:**
- **Always use `lightContext: true`** when spawning subagents
- **Orchestrator rule:** Mickey = architecture + orchestration ONLY. All code → Byte. All creative → Sashay. All deploys → Scout ✅ first. **No exceptions. Violated 2026-04-17: coded resetStage refactor directly. Never again.**
- **Mickey never edits code files** (`.vue`, `.js`, `.css`, `.py`, `.ts`, `.html`). Write specs, delegate to Byte. If tempted to open an edit on a code file, STOP and spawn Byte instead.
- **Lean task prompts:** <500 chars simple, <1000 complex. Never embed file contents.

## People
- **John Poom (ลุงจอห์น)** — My human. System integration expert, tech enthusiast, investment hobbyist. Fluent Thai/German/English. Timezone: Europe/Berlin.

## Key Lessons
- Smart quotes cause build errors in Vue SFCs — use backtick template literals
- Emoji ZWJ characters cause edit tool matching failures — use `write`
- `statSnapshot` must mirror achievement conditions
- `DIALOGUE_NODES` must be `computed(() => [...])` for reactive flag references
- Deploy leak: ALWAYS commit to main BEFORE deploying to gh-pages
- Compaction can't help first-turn overflow — only prevention works (lightContext + session maintenance + lean prompts)
- Atomic task sizing: <100 lines changed per task, monolithic rewrites timeout
- **Byte model correction:** Byte is `qwen3.5:cloud` (snappy coder), NOT `glm-5.1:cloud`

## Conventions
- Version format: `pi.sprint` (e.g., `1.20`)
- Build output to `dist/` only, never delete root files

## Config Files
- **Mickey:** `~/.openclaw/agents/main/agent/config.json` → `ollama/qwen3.5:cloud`
- **Byte:** `~/.openclaw/agents/coder/agent/config.json` → `ollama/qwen3.5:cloud`
- **Archie:** `~/.openclaw/agents/archie/agent/` → `ollama/glm-5.1:cloud`
- **Scout:** `~/.openclaw/agents/qa/agent/` → `ollama/glm-5.1:cloud`
- **Sashay:** `~/.openclaw/agents/creative/agent/` → `ollama/qwen3.5:cloud`

## Complex Dev Team Upgrades (2026-05-08)

### New Skills Added
| Skill | Location | Owner | Purpose |
|-------|----------|-------|--------|
| **database-design** | `~/.openclaw/workspace/skills/database-design/SKILL.md` | Archie | Schema design, migrations, ORM optimization |
| **security-audit** | `~/.openclaw/workspace/skills/security-audit/SKILL.md` | Scout | CVE checks, secret detection, vulnerability scanning |
| **performance-profiling** | `~/.openclaw/workspace/skills/performance-profiling/SKILL.md` | Scout | Lighthouse audits, bundle analysis, Core Web Vitals |
| **coding-agent** | Built-in OpenClaw skill | Byte | Multi-file refactors, dependency analysis |
| **warren-investing** | `~/.openclaw/workspace/skills/warren-investing/SKILL.md` | Warren | **Advanced value investing: scenario analysis, position sizing, catalyst identification, thesis invalidation, peer comparison** |

### Agent Tool Upgrades
- **Byte:** Added `sessions_spawn`, `process` (can delegate large refactors)
- **Scout:** Added `browser`, `canvas`, `sessions_spawn` (Lighthouse audits, performance checks)
- **Archie:** Added `memory_search` (schema pattern lookup)
- **Warren:** Upgraded to `warren-investing` skill with portfolio management, scenario analysis, pre-mortem invalidation

### Pre-Deployment Checklist (MANDATORY - Scout's Duty)
1. ✅ Tests pass (parallel execution)
2. ✅ Security audit: `npm audit` passes, no hardcoded secrets
3. ✅ Performance budget: Bundle <500KB, Lighthouse >90
4. ✅ CVE check: No high/critical CVEs on dependencies
5. ✅ CI/CD pass: GitHub Actions shows "success"
6. ✅ Version bump: Deployed version matches expected
7. ✅ Feature verification: Features match task spec (screenshots)

**Scout has VETO power** — any failure blocks deployment.

### Warren's Investing Upgrade (2026-05-08)

**New Capabilities:**
- **Scenario Analysis:** Bull/base/bear cases with probability-weighted expected value
- **Position Sizing:** Kelly Criterion-based sizing (max 20% per position)
- **Catalyst Calendar:** What unlocks value + when (0-6mo to 5+yr)
- **Thesis Invalidation:** Pre-mortem "I'm wrong if..." criteria before investing
- **Peer Comparison:** Never analyze in isolation—matrix vs 3-5 competitors
- **Portfolio Context:** Concentration limits (single: 20%, sector: 40%, country: 60%)
- **Industry Analysis:** Porter's 5 Forces, macro sensitivity

**Output Format:** Mandatory structure with executive summary, moat analysis, scenario table, peer matrix, catalyst calendar, invalidation criteria

**Guardrails:** No price targets, no technical analysis, no leverage recommendations, long-term horizon only (5+yr)

### Analyst Task Decomposition Protocol (2026-05-10)

**Problem:** Analyst agents (Warren, Scout) were running monolithic complex tasks without atomic decomposition, violating AGENTS.md protocol.

**Fix Applied:** Added mandatory Task Decomposition Protocol sections to:
- `warren-investing/SKILL.md` — 8-step workflow (Data → Moat → Financials → Peers → Scenarios → Catalysts → Report → Delivery)
- `security-audit/SKILL.md` — 7-step workflow (Dependencies → Secrets → Code → Config → Deploy → Report → Alert)
- `performance-profiling/SKILL.md` — 8-step workflow (Build → Bundle → Lighthouse → CWV → Backend → Memory → Regression → Report)

**Rules Enforced:**
- Spawn subagents for atomic tasks (`lightContext:true`)
- Parallelize independent checks, serialize blocked steps
- Never monolithic "analyze everything" runs — they timeout
- Report progress to Mickey after decomposition

**Trigger:** SNDK 5-year coverage task revealed gap — Warren running 5min without decomposition.
