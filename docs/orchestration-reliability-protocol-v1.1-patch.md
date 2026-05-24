# Orchestration Reliability Protocol v1.1 — Timeout Safety Net

**Patch Date:** 2026-05-18
**Trigger:** Two silent failure incidents (11:24 + 12:17-19:51) where Mickey waited indefinitely on timed-out subagents.

---

## Root Cause

`sessions_yield` resolves on **session termination**, not success. When subagents timed out, `sessions_yield` returned "completions" that were actually timeout events. The protocol (v1.0) assumed completion = success and had **no post-yield verification step**.

**Critical gap:** No mechanism to detect "all completions received but results are missing/empty."

---

## Three-Layer Timeout Safety Net

### Layer 1: Post-Yield Result Verification

**MANDATORY:** After `sessions_yield` returns, verify every expected result file exists and is non-empty:

```bash
# For each expected result:
test -f result.md && test -s result.md  # File exists + non-empty
```

**If ANY result is missing/empty:**
- Report immediately (same turn)
- Do NOT proceed with synthesis
- Trigger Layer 3 (decompose-on-timeout)

### Layer 2: Mandatory Failure Notification

**If ANY subagent times out:**
- Notify user within 1 turn
- Never go silent
- Use this format:

```
⚠️ X/Y subagents timed out: [task names]

Options:
(a) Retry with simpler decomposition
(b) Proceed with partial results
(c) Abort and reassess
```

### Layer 3: Decompose-on-Timeout

**When a task times out:**
1. Split into 2 smaller subtasks (each <50% original scope)
2. Retry once at 60% of original timeout
3. If still fails → escalate to user (do not retry again)

**Example:**
- Original: "Fix 5 bugs" (300s) → times out
- Retry: "Fix bugs 1-2" (180s) + "Fix bugs 3-5" (180s)
- If either times out again → escalate

---

## Updated AGENTS.md Text

Replace existing "Silent failure protocol" line in Constraints section with:

```markdown
- **Timeout Safety Net (v1.1 — 2026-05-18):**
  1. **Post-yield verification:** After `sessions_yield`, verify all expected result files exist + are non-empty (`test -s`). Missing = timeout.
  2. **Mandatory notification:** If ANY subagent times out → notify user within 1 turn. Never go silent. Format: "⚠️ X/Y timed out: [tasks]. Options: (a) retry simpler, (b) proceed partial, (c) abort."
  3. **Decompose-on-timeout:** Timed-out task → split into 2 subtasks → retry once at 60% timeout → if still fails → escalate. Max 1 retry.
  4. **No indefinite waits:** If `sessions_yield` returns but results are missing, report immediately. Do not wait for user to ask.
```

Add to Lessons Learned table:

| **Mickey's silent failure pattern** (2026-05-18) | **VIOLATION:** Spawned subagents → `sessions_yield` returned timeout events → Mickey treated as success → waited 8 hours without reporting → user had to ask "Status?" → **FIX:** Orchestration Reliability Protocol v1.1 — (1) Post-yield result verification (test -f + test -s), (2) Mandatory failure notification within 1 turn, (3) Decompose-on-timeout with 1 retry max. See docs/orchestration-reliability-protocol-v1.1-patch.md |

---

## Enforcement Checklist

Before every `sessions_yield` call, Mickey must confirm:
- [ ] Expected result files documented (ledger or task list)
- [ ] Timeout budgets set (simple: 300s, complex: 600s)
- [ ] Decomposition plan ready if timeout occurs

After `sessions_yield` returns, Mickey must:
- [ ] Verify all result files exist + non-empty
- [ ] If ANY missing → report within 1 turn (Layer 2)
- [ ] If ALL present → proceed with synthesis/delivery

---

**Protocol Owner:** Mickey (Main Orchestrator)
**Compliance:** Mandatory for all orchestrations with ≥2 subagents
