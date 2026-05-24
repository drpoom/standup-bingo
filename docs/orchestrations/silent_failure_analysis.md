# Root Cause Analysis: Mickey's Silent Failure Pattern

**Date:** 2026-05-16  
**Severity:** High — blocks user trust in orchestration workflows  
**Pattern:** Orchestrator (Mickey) spawns subagents, they complete, but Mickey never delivers results.

---

## Root Cause Diagnosis

**Mickey's silent failures are caused by a combination of (1) model idle timeouts killing the orchestrator's turn while it's waiting for subagent completions, and (2) the announce/completion routing logic deferring delivery when the orchestrator has pending descendant runs — creating a deadlock where Mickey yields, descendants complete, but the wake-up never reaches Mickey's turn because the model turn already timed out.**

The specific mechanism:

1. **Mickey spawns Wave 2 subagents and calls `sessions_yield`** — this correctly pauses Mickey's run and sets `pauseReason: "sessions_yield"` on the registry entry.

2. **Wave 2 subagents complete** — completion events fire and the announce flow begins.

3. **The announce flow checks `countPendingDescendantRuns`** on Mickey's session — if Mickey itself has descendant runs still pending (from Wave 1 cleanup or overlapping waves), the announce flow **returns `false` without delivering** (`shouldDeleteChildSession = false; return false;`). This is the defer-descendants path.

4. **Even when descendants settle, the wake path requires `wakeOnDescendantSettle === true`** and `childCompletionFindings` to be non-empty. If the child's own announce was already suppressed or the child session was cleaned up before findings were captured, `wakeOnDescendantSettle` may never fire.

5. **Model idle timeout kills Mickey's turn** — if Mickey's LLM call stalls (no tokens emitted while waiting), the idle timeout breaker trips after 5 consecutive idle timeouts. Mickey's turn ends with an error, and since it was already yielded, the wake message has no active run to deliver to.

6. **Result: Mickey never processes the completion events and never responds to the user.** The user sees "silent failure" — subagents completed, but no synthesis delivered.

---

## Concrete Fixes

### Fix 1: Orchestrator Heartbeat Protocol (Config + Protocol Change)

**Problem:** When Mickey calls `sessions_yield`, the model turn is suspended but the LLM connection may idle-timeout before descendants complete.

**Fix:** Add an orchestrator heartbeat to the system prompt for agents at depth ≥ 1 that spawn children:

```
After calling sessions_yield, emit a brief progress heartbeat every 60 seconds
(e.g., "Waiting for N descendants...") to keep the model turn alive.
If all expected descendants have not completed within 2x the estimated time,
report status to the user instead of waiting indefinitely.
```

Additionally, increase `model.runTimeout` for orchestrator agents (depth ≥ 1 with active children) from 600s to 1200s, and set `llmIdleTimeoutMs` to 0 (disabled) while `sessions_yield` is active — the yield mechanism itself provides the timeout boundary.

**Priority:** P0 — this is the primary cause of silent failures.

### Fix 2: Announce Delivery Guarantee with Fallback Wake (Protocol Change)

**Problem:** The `countPendingDescendantRuns` check in `runSubagentAnnounceFlow` can cause the announce to silently return `false` (defer) when the parent has overlapping descendant runs, and the `wakeOnDescendantSettle` path may not fire if findings are empty.

**Fix:** When an announce is deferred due to pending descendants, schedule a guaranteed retry with a 30-second delay. If after 3 retries the announce still can't deliver directly, force-deliver via the `wakeSubagentRunAfterDescendants` path regardless of `childCompletionFindings` — use the child's `frozenResultText` as fallback content. This ensures every completion eventually reaches the parent, even if the descendant tracking is stale.

```javascript
// In runSubagentAnnounceFlow, after the defer-descendants return:
if (pendingDescendants > 0 && announceType !== "cron job") {
  shouldDeleteChildSession = false;
  // NEW: Schedule guaranteed retry instead of silent return
  scheduleDeferredAnnounceRetry(params, { maxRetries: 3, delayMs: 30000 });
  return false;
}
```

**Priority:** P0 — without this, completions are silently dropped.

### Fix 3: Orchestrator Watchdog with User-Facing Timeout (Protocol Change)

**Problem:** Even with fixes 1 and 2, there's no safety net if Mickey's turn dies completely (model error, gateway timeout, etc.). The user sees nothing.

**Fix:** Add a watchdog timer in the orchestrator's system prompt instructions:

```
ORCHESTRATOR SAFETY PROTOCOL:
1. Before spawning any wave, estimate total wait time: max(childTimeouts) + 60s buffer
2. If you have not delivered results within 2x the estimated time, send a status update:
   "⏳ Still waiting for [N] tasks. Current status: [summary]. Will retry or report failures in [X]s."
3. If 3x the estimated time passes with no progress, deliver whatever you have with failure notes.
4. NEVER end a turn with sessions_yield without first reporting wave status to the user.
```

This makes the orchestrator self-healing — even if the announce/wake mechanism fails, the user gets visibility and partial results rather than silence.

**Priority:** P1 — defense-in-depth against future silent failures.

---

## Summary

| # | Fix | Type | Priority | Estimated Effort |
|---|-----|------|----------|-----------------|
| 1 | Disable LLM idle timeout during sessions_yield; increase runTimeout for orchestrators | Config | P0 | Low (config change) |
| 2 | Guaranteed announce retry with forced wake fallback | Protocol/Code | P0 | Medium (runtime change) |
| 3 | Orchestrator watchdog with mandatory status updates | Protocol/Prompt | P1 | Low (prompt change) |

**The core issue is that the announce system can silently drop completions when descendants overlap, and the model idle timeout kills the orchestrator's turn before wake-up arrives.** Fixes 1 and 2 address the two failure modes directly; Fix 3 adds a human-visible safety net.