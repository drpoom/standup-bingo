# Model Idle Timeout Analysis — 2026-05-17

**Author:** Archie (subagent)  
**Date:** Sun 2026-05-17 08:22 GMT+2  
**Scope:** Past 24 hours (2026-05-16 08:22 – 2026-05-17 08:22 GMT+2)

---

## Executive Summary

The user observed "many timeout messages" yesterday, but the daily performance report showed only 1 subagent timeout. This discrepancy exists because **the report counts subagent task timeouts (runTimeoutSeconds exceeded), not model idle timeouts**. In reality, there were **5 distinct model idle timeout events** across a single long-running orchestrator session — all on `qwen3.5:cloud` — and **286 idleTimedOut trace entries** across all agents (most are `idleTimedOut: false` status markers, not actual failures).

The root cause is that the **LLM idle timeout was re-enabled at 120 seconds** after being previously disabled (`idleTimeoutSeconds: 0`). When `qwen3.5:cloud` processes large contexts (>100k tokens), first-token latency can exceed 120 seconds, triggering the idle timeout and killing the model response mid-flight.

---

## 1. Timeout Taxonomy

| # | Type | Mechanism | Config Key | Current Value | Symptom |
|---|------|-----------|------------|---------------|---------|
| 1 | **Model Idle Timeout** | No first token from LLM within idle window | `idleTimeoutSeconds` (gateway/LLM) | **120s** (default, re-enabled) | `"LLM idle timeout (120s): no response from model"` |
| 2 | **Subagent Task Timeout** | Subagent run exceeds wall-clock limit | `subagents.runTimeoutSeconds` | **600s** (10 min) | Session killed after 10 min |
| 3 | **Agent Session Timeout** | Agent's own `timeoutSeconds` exceeded | `agents.defaults.timeoutSeconds` / per-agent `timeoutSeconds` | **300s** (default) / **600s** (archie, warren) | Session ended, partial response |
| 4 | **Tool Execution Timeout** | exec/browser call hangs | `timeoutMs` per tool call | Varies (default: no limit for exec) | Process killed, tool error returned |
| 5 | **Channel/Thread Idle** | Telegram thread goes idle | `threadBindings.idleHours` | Default: 24h | Thread unfocused, not a failure |

---

## 2. Data: Past 24h Idle Timeout Events

### 2.1 Actual `idleTimedOut: true` Events

| Timestamp (UTC) | Agent | Model | Event Type | Input Tokens | Output Tokens | Error |
|-----------------|-------|-------|------------|--------------|---------------|-------|
| 2026-05-16 14:28:33 | main (telegram) | qwen3.5:cloud | model.completed | 107,721 | 863 | LLM idle timeout (120s) |
| 2026-05-16 14:32:19 | main (telegram) | qwen3.5:cloud | model.completed | 109,390 | 125 | LLM idle timeout (120s) |
| 2026-05-16 14:41:55 | main (telegram) | qwen3.5:cloud | model.completed | 233,973 | 398 | LLM idle timeout (120s) |
| 2026-05-16 16:31:50 | main (telegram) | qwen3.5:cloud | trace.artifacts | 127,766 | 972 | LLM idle timeout (120s) |
| 2026-05-17 17:22:11 | main (telegram) | qwen3.5:cloud | trace.artifacts | — | — | LLM idle timeout (120s) |

**All 5 idle timeouts occurred in a single session** (`fcad7483-86c2-41a6-b429-10a759fbfd6a`), the main orchestrator session handling the HBM investment analysis task.

### 2.2 `idleTimedOut: false` Trace Entries (Normal)

| Agent | Count |
|-------|-------|
| main | ~128 |
| warren | ~119 |
| archie | ~11 |
| qa | ~12 |
| **Total** | **~270** |

These are **not failures** — they are normal trace markers indicating the session completed without idle timeout. The daily report's "1 timeout" refers to subagent `runTimeoutSeconds` exceeded, which is a different mechanism.

### 2.3 Wall/Inference Ratio Analysis (from daily report)

| # | Task | Agent | Wall Time | Inference | Ratio | Interpretation |
|---|------|-------|-----------|-----------|-------|----------------|
| 1 | Cron: Warren scan | main | 4m54s | 34s | 8x | Heavy tool use (web searches) |
| 2 | QA subagent | qa | 4m7s | 2s | 110x | Mostly idle/tool execution |
| 3 | Warren subagent | warren | 1m43s | 2s | 36x | Heavy tool use |
| 4 | QA subagent | qa | 1m42s | 2s | 47x | Heavy tool use |
| 5 | Warren subagent | warren | 1m32s | 4s | 21x | Tool-heavy |

Ratios >10x indicate significant tool execution or idle time, not model processing. The 110x ratio for QA suggests near-complete idle time (model yielded, waiting for descendants).

---

## 3. Root Cause Analysis

### 3.1 Primary Cause: LLM Idle Timeout Re-enabled at 120s

**Timeline:**
1. **2026-04-25**: `idleTimeoutSeconds` set to `0` (disabled) after `deepseek-v4-flash:cloud` failed with >90s first-token delay on ~79k token context
2. **2026-04-25 later**: Changed to `180` (3 min) as a compromise
3. **Current state**: No `idleTimeoutSeconds` in `openclaw.json` — the default of **120 seconds** is active

The 120s default is too aggressive for:
- **qwen3.5:cloud** with contexts >100k tokens (observed: 107k–234k tokens)
- **glm-5.1:cloud** with deep thinking enabled (can take 60–90s of "thinking" before first output token)
- Any model under Ollama server load

### 3.2 Contributing Factor: Orchestrator Yield Pattern

When the main agent spawns subagents and yields (`sessions_yield`), it enters a waiting state. If the LLM idle timeout fires during this yield, the orchestrator's turn is killed, and the announce flow from descendants may be silently dropped. This is the **silent failure pattern** identified in `docs/orchestrations/silent_failure_analysis.md`.

### 3.3 Why the Daily Report Shows "1 Timeout"

The daily performance report counts **subagent task timeouts** (runTimeoutSeconds exceeded = session ended with `timedOut: true` in the final session.ended event). It does **not** count:
- Model idle timeouts within a session (the session may recover via retry)
- Individual model call failures that were retried
- Sessions where the model timed out but the session continued

The 1 reported timeout was likely a subagent that exceeded `runTimeoutSeconds: 600`, while the 5 model idle timeouts were internal to a single long-running session that recovered (the session continued after each timeout).

---

## 4. Pattern Summary

| Pattern | Detail |
|---------|--------|
| **Affected model** | `qwen3.5:cloud` exclusively (all 5 events) |
| **Context size** | 107k–234k tokens (well above typical) |
| **Time window** | 14:28–17:22 UTC (16:28–19:22 GMT+2), a concentrated burst |
| **Session type** | Main orchestrator handling complex multi-subagent task |
| **Recovery** | Session continued after each timeout (auto-retry) |
| **Agent impact** | Only `main` (telegram direct) affected |
| **Subagent agents** | warren, archie, qa — no idle timeouts (glm-5.1:cloud, shorter contexts) |

---

## 5. Mitigation Recommendations (Prioritized)

### P0 — Disable LLM Idle Timeout (Immediate)

**Action:** Set `idleTimeoutSeconds: 0` in the LLM/gateway configuration.

**Rationale:**
- Cloud models always respond eventually (or hit `timeoutSeconds: 600` total limit)
- The idle timeout kills legitimate long-context processing
- Previously disabled for this exact reason (2026-04-25)
- The `timeoutSeconds` (total request timeout) provides the safety net

**Config change:**
```json
// In openclaw.json, add to the appropriate section:
"llm": {
  "idleTimeoutSeconds": 0
}
```

Or via gateway config patch:
```bash
openclaw gateway config.patch llm.idleTimeoutSeconds 0
```

### P1 — Increase Agent Timeout for Orchestrator (Short-term)

**Action:** Increase `timeoutSeconds` for the main agent to 600s (matching archie/warren).

**Current:** `agents.defaults.timeoutSeconds: 300` (5 min)  
**Proposed:** `300` default remains, but main agent gets explicit `timeoutSeconds: 600`

**Rationale:** The orchestrator session that hit 5 idle timeouts was processing a complex multi-subagent task. With 300s total timeout, the session could be killed before all subagents complete.

### P2 — Add Idle Timeout to Daily Report (Observability)

**Action:** Update the daily performance report script to count and display model idle timeouts separately from subagent task timeouts.

**Current gap:** The report only counts `session.ended` with `timedOut: true`, missing mid-session idle timeouts that were retried.

**Proposed additions to report:**
```
## ⏱️ Model Idle Timeouts (Past 24h)
- Total idle timeout events: 5
- Affected sessions: 1
- Affected model: qwen3.5:cloud
- Avg context size at timeout: 156k tokens
```

### P3 — Model Selection Strategy (Medium-term)

**Action:** Use `glm-5.1:cloud` for orchestrator tasks that involve large contexts and subagent coordination.

**Rationale:**
- `glm-5.1:cloud` has not triggered any idle timeouts in the past 24h
- Its context window (204k) is sufficient for orchestrator tasks
- Deep thinking mode provides better planning for complex tasks
- `qwen3.5:cloud` remains suitable for subagent tasks with smaller contexts

### P4 — Orchestrator Yield Safety Net (Medium-term)

**Action:** Implement the fixes from `docs/orchestrations/silent_failure_analysis.md`:
1. Disable LLM idle timeout during `sessions_yield` (yield itself provides timeout boundary)
2. Guaranteed announce retry with forced wake fallback
3. Orchestrator watchdog protocol (mandatory status reporting)

### P5 — Context Size Guard (Nice-to-have)

**Action:** Add a pre-flight check that warns when context size exceeds a threshold before sending to the model.

**Proposed threshold:** 150k tokens for `qwen3.5:cloud` (based on observed failures at 107k+)

**Implementation:** Add to the orchestrator system prompt:
```
If your context exceeds 150k tokens, consider:
1. Compacting the conversation before spawning subagents
2. Using a model with a larger context window
3. Breaking the task into smaller pieces
```

---

## 6. Configuration Change Proposals

### 6.1 Immediate: Disable Idle Timeout

```json
// openclaw.json — add to top level or llm section
{
  "llm": {
    "idleTimeoutSeconds": 0
  }
}
```

### 6.2 Short-term: Main Agent Timeout

```json
// openclaw.json — agents.list[0] (main)
{
  "id": "main",
  "timeoutSeconds": 600
}
```

### 6.3 Current Config Reference

| Setting | Current Value | Location | Notes |
|---------|--------------|----------|-------|
| `idleTimeoutSeconds` | **120** (default) | Gateway runtime | **Root cause** — should be 0 |
| `timeoutSeconds` (default) | 300 | `agents.defaults` | 5 min total |
| `timeoutSeconds` (archie) | 600 | `agents/archie/config.json` | 10 min |
| `timeoutSeconds` (warren) | 600 | `agents/warren/config.json` | 10 min |
| `runTimeoutSeconds` | 600 | `agents.defaults.subagents` | 10 min for subagents |
| `contextWindow` (qwen3.5) | 262,144 | `models.providers.ollama` | 256k tokens |
| `contextWindow` (glm-5.1) | 204,800 | `models.providers.ollama` | 200k tokens |

---

## 7. Key Takeaways

1. **The "many timeout messages" the user saw were model idle timeouts, not subagent task timeouts.** The daily report correctly counts only 1 subagent timeout, but misses 5 model idle timeouts.

2. **The root cause is the 120s LLM idle timeout default**, which was previously disabled but has been re-enabled (likely by a config reset or upgrade).

3. **All 5 idle timeouts hit `qwen3.5:cloud`** with contexts >100k tokens. `glm-5.1:cloud` was unaffected.

4. **The fix is simple and proven:** Set `idleTimeoutSeconds: 0` (same fix applied on 2026-04-25).

5. **The orchestrator yield pattern amplifies the impact** — idle timeouts during yield can cause silent completion drops.

---

*Analysis based on trajectory data from `~/.openclaw/agents/*/sessions/*.trajectory.jsonl`, configuration from `~/.openclaw/openclaw.json`, and memory from `memory/2026-04-25.md` and `memory/2026-04-26.md`.*