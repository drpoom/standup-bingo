# Orchestration Reliability Protocol v1.1

**Author:** Archie 📐 | **Date:** 2026-05-15 | **Updated:** 2026-05-18 | **Status:** ACTIVE — MANDATORY for all complex orchestrations

---

## 0. Problem Statement

Mickey's AI Energy research failed silently: 8 subagents spawned, synthesis timed out, zero delivery to user. Root causes:

1. **Context bloat** — accumulated subagent results pushed context past safe thresholds
2. **No completion tracking** — spawned 8 subagents, lost track of which returned
3. **No yield discipline** — spawned QA but moved on without waiting for results
4. **No delivery isolation** — synthesis ran in same bloated session instead of fresh one
5. **No recovery path** — when synthesis failed, there was no fallback, no retry, no alert

**This protocol makes silent failures IMPOSSIBLE by design.**

---

## 1. Context Window Management

### 1.1 Automatic Context Checks

| Trigger | Action |
|---------|--------|
| Every 3rd turn during orchestration | Mickey runs `session_status` and logs context size |
| Context ≥ 100k tokens | ⚠️ WARNING — Plan rotation. No new subagent spawns in current session. |
| Context ≥ 140k tokens | 🛑 HARD STOP — Spawn fresh orchestrator session IMMEDIATELY. Transfer pending work items. |
| Context ≥ 170k tokens | 🚨 CRITICAL — Should never happen. If it does, emergency rotation + incident log. |

### 1.2 Rules

- **R1:** Before ANY synthesis turn, Mickey MUST check context. If >100k → rotate first.
- **R2:** Complex tasks (≥3 subagents) MUST start in a fresh session with bounded context.
- **R3:** Subagent results MUST be saved to files BEFORE synthesis (see §4).
- **R4:** Never accumulate >3 subagent results in conversation context without persisting to disk.

### 1.3 Context Hygiene

After receiving each subagent completion:
1. Save result to `docs/orchestrations/{task-id}/{agent-name}.md`
2. Acknowledge receipt in conversation (1 line)
3. Do NOT quote full subagent output in conversation

---

## 2. Completion Event Tracking (Subagent Ledger)

### 2.1 The Ledger

Every orchestration MUST maintain a ledger file at `docs/orchestrations/{task-id}/LEDGER.md`:

```markdown
# Orchestration Ledger: {task-id}
Created: {timestamp}
Status: IN_PROGRESS | COMPLETE | FAILED

## Subagents

| # | Agent | Task | Spawned | Timeout | Status | Result File |
|---|-------|------|---------|---------|--------|-------------|
| 1 | archie | Plan research | 23:02 | 300s | ✅ COMPLETE | archie-plan.md |
| 2 | byte | Research topic A | 23:05 | 600s | ⏳ PENDING | — |
| 3 | byte | Research topic B | 23:05 | 600s | ⏳ PENDING | — |

## Completion Log
- 23:04 — archie completed, saved to archie-plan.md
- 23:08 — byte (topic A) completed, saved to byte-topic-a.md
```

### 2.2 Rules

- **R5:** Ledger created BEFORE any subagent spawn. Every spawn adds a row.
- **R6:** On subagent completion, Mickey updates Status to ✅ COMPLETE and fills Result File.
- **R7:** Before synthesis, Mickey verifies: ALL subagents marked ✅ COMPLETE. If any ⏳ PENDING → wait or declare lost (see §5).
- **R8:** Max subagent wait time: **2x the runTimeoutSeconds**. After that → declare LOST, proceed with available results, note gap.

### 2.3 Safety Net Checkpoint

After all expected completions arrive (or timeout), Mickey runs `subagents action=list` ONCE as a final checkpoint — not polling, just verification that no orphaned sessions exist.

---

## 3. Yield Discipline Enforcement

### 3.1 The Rule

**If Mickey spawns a subagent with `lightContext: true` + `runTimeoutSeconds`, Mickey MUST call `sessions_yield` in the SAME turn (or next turn if tool limits require it).**

This is non-negotiable. The pattern:

```
1. Spawn subagent(s)
2. Call sessions_yield  ← MANDATORY
3. Receive completion events
4. Update ledger
5. Continue orchestration
```

### 3.2 Pending Counter

Mickey maintains a mental counter: `pending = spawned - completed`. This counter MUST reach 0 before synthesis begins.

- If `pending > 0` and all timeouts expired → declare lost subagents (§5), set `pending = 0`
- If `pending > 0` and timeouts NOT expired → yield again, do NOT proceed to synthesis

### 3.3 Anti-Patterns (FORBIDDEN)

- ❌ Spawn subagent → immediately proceed to next task without yielding
- ❌ Spawn QA → ignore results → deliver to user anyway
- ❌ Assume subagent "probably finished" without completion event
- ❌ Poll `subagents action=list` in a loop (use yield, not polling)

---

## 4. Delivery Isolation Architecture

### 4.1 The Rule

**Any task with >3 subagents MUST synthesize in a fresh delivery session.**

### 4.2 Delivery Session Pattern

```
1. Mickey collects all subagent results (saved to files)
2. Mickey spawns FRESH session (context="isolated"):
   - Task: "Synthesize these results and deliver to user"
   - Attachments: list of result file paths
   - Token budget: 2000
3. Delivery session reads files, synthesizes, returns final output
4. Mickey delivers to user
```

### 4.3 Why Fresh Session?

- Fresh session starts with <5k context (vs 100k+ in bloated orchestrator)
- Model has full reasoning capacity for synthesis
- No risk of context timeout during the most critical step
- Delivery session is disposable — if it fails, retry is trivial

### 4.4 Thresholds

| Subagent Count | Synthesis Method |
|---------------|-----------------|
| 1-3 | Can synthesize in current session (if context < 80k) |
| 4-8 | MUST use delivery session |
| 9+ | MUST use delivery session + split into 2 synthesis passes |

---

## 5. Recovery Protocols

### 5.1 When Synthesis Fails

1. **Check ledger** — which subagents completed? Which are lost?
2. **Save what you have** — write all received results to `docs/orchestrations/{task-id}/partial-results.md`
3. **Retry synthesis in fresh session** — spawn new delivery session with available results
4. **Report gap** — tell user: "Synthesized from 6/8 sources. Missing: topic C, topic F."
5. **Offer recovery** — "Want me to re-research the missing topics?"

### 5.2 When a Subagent Is Declared LOST

1. Mark status as ❌ LOST in ledger
2. Note the task it was supposed to do
3. Continue with available results
4. If lost subagent's task was critical (not optional) → spawn replacement AFTER current synthesis
5. If lost subagent's task was optional → note in delivery, move on

### 5.3 When Context Hits Hard Stop (140k)

1. **STOP immediately** — do not attempt one more synthesis turn
2. **Save current state** — write pending work to `docs/orchestrations/{task-id}/state-transfer.md`
3. **Spawn fresh Mickey session** with task: "Continue orchestration. Read state-transfer.md and LEDGER.md."
4. **New session picks up** — reads ledger, checks subagent status, continues

### 5.4 Orphaned Subagent Recovery

After any orchestration completes (success or failure):
1. Run `subagents action=list` once
2. Any sessions still running for >15 min → kill with `subagents action=kill`
3. Log cleanup in ledger

---

## 6. Health Monitoring

### 6.1 Orchestration Heartbeat

During any active orchestration (pending > 0):

| Check | Frequency | Method |
|-------|-----------|--------|
| Context size | Every 3 turns | `session_status` |
| Subagent count | After each completion event | Ledger update |
| Time elapsed | Every 5 turns | Compare to expected total |
| Stuck detection | If no completion in 10 min | Check `subagents action=list` |

### 6.2 Stuck Detection

If Mickey receives NO completion event for 10 minutes during an active orchestration:
1. Run `subagents action=list` — are any still running?
2. If yes but past timeout → declare LOST, proceed
3. If no running sessions but ledger shows PENDING → results were lost, proceed with available data
4. If Mickey itself feels "stuck" → report to user: "Orchestration stalled. X/Y subagents completed. Proceed with partial results?"

### 6.3 Timeout Safety Net (v1.1 — Added 2026-05-18)

**Root cause of 2026-05-18 incident:** `sessions_yield` resolves on **session termination**, not success. When subagents timed out, `sessions_yield` returned "completions" that were actually timeout events. The stuck detection (§6.2) never triggered because completions *arrived* — they were just empty/failed ones. No mechanism existed to detect "all completions received but results are missing."

**Three-layer timeout safety net (MANDATORY):**

**Layer 1: Post-Yield Result Verification**
After `sessions_yield` returns, verify every expected result file exists and is non-empty:
```bash
# For each expected result:
test -f result.md && test -s result.md  # File exists + non-empty
```
If ANY result is missing/empty → report immediately (same turn), do NOT proceed with synthesis, trigger Layer 3.

**Layer 2: Mandatory Failure Notification**
If ANY subagent times out → notify user within 1 turn. Never go silent. Format:
```
⚠️ X/Y subagents timed out: [task names]
Options: (a) retry simpler, (b) proceed partial, (c) abort
```

**Layer 3: Decompose-on-Timeout**
When a task times out:
1. Split into 2 smaller subtasks (each <50% original scope)
2. Retry once at 60% of original timeout
3. If still fails → escalate to user (max 1 retry)

**Layer 4: No Indefinite Waits**
If `sessions_yield` returns but results are missing, report immediately. Do not wait for user to ask.

### 6.3 No Cron Jobs (Yet)

Current OpenClaw architecture doesn't support persistent cron. Instead:
- Mickey performs health checks as part of orchestration flow (§6.1)
- User can ask "status?" at any time — Mickey reads ledger and reports
- Future: If OpenClaw adds cron support, add automated stuck-detection job

---

## 7. Complex Task Checklist

### BEFORE Spawning

- [ ] Fresh session started (if complex: ≥3 subagents expected)
- [ ] Context < 50k (verify with `session_status`)
- [ ] Ledger file created at `docs/orchestrations/{task-id}/LEDGER.md`
- [ ] Task decomposed into atomic subtasks (DECOMPOSE-ONLY first)
- [ ] Each subagent has: clear objective, token budget, runTimeoutSeconds, result file path
- [ ] `lightContext: true` on all spawns

### DURING Orchestration

- [ ] After each spawn: call `sessions_yield` (MANDATORY)
- [ ] After each completion: update ledger, save result to file
- [ ] Every 3 turns: check context size
- [ ] If context > 100k: plan rotation
- [ ] If context > 140k: HARD STOP, rotate immediately
- [ ] Track `pending` counter: must reach 0 before synthesis
- [ ] If no completion in 10 min: run stuck detection

### AFTER All Subagents Complete

- [ ] Verify ledger: all rows ✅ COMPLETE or ❌ LOST
- [ ] Run `subagents action=list` once as safety net
- [ ] Kill any orphaned sessions
- [ ] If >3 subagents: spawn delivery session for synthesis
- [ ] If ≤3 subagents AND context < 80k: synthesize in current session
- [ ] Delivery session reads result files, synthesizes, returns output
- [ ] Mickey delivers to user
- [ ] Note any gaps: "Synthesized from N/M sources"
- [ ] Archive ledger

---

## 8. Required Updates

### 8.1 AGENTS.md Updates

Add to **Rules** section:

```markdown
10. **ORCHESTRATION RELIABILITY PROTOCOL (MANDATORY — Added 2026-05-15)**:
   - Read: docs/orchestration-reliability-protocol.md
   - Ledger: Every orchestration with ≥2 subagents MUST maintain docs/orchestrations/{task-id}/LEDGER.md
   - Yield: MUST call sessions_yield after spawning subagents
   - Delivery: Tasks with >3 subagents MUST synthesize in fresh delivery session
   - Recovery: If synthesis fails, retry in fresh session with available results
   - Context: Check every 3 turns. Hard stop at 140k. Never attempt synthesis >100k.
```

### 8.2 MEMORY.md Updates

Add to Lessons Learned table:

```markdown
| **Mickey's AI Energy research silent failure** (2026-05-15) | **8 subagents spawned, synthesis timed out, zero delivery** → **FIX: Orchestration Reliability Protocol v1.0 — mandatory ledger, yield discipline, delivery isolation, context checks, recovery protocols. See docs/orchestration-reliability-protocol.md** |
```

### 8.3 Skill Files

No skill file changes needed — this protocol is agent-level, not skill-level. The protocol document itself is the source of truth.

---

## Appendix A: Quick Reference Card

```
SPAWN → YIELD → VERIFY RESULTS → UPDATE LEDGER → REPEAT
YIELD RETURNS BUT NO RESULTS? → TIMEOUT DETECTED → NOTIFY USER
CONTEXT > 100k? → PLAN ROTATION
CONTEXT > 140k? → HARD STOP, ROTATE NOW
>3 SUBAGENTS? → DELIVERY SESSION
SYNTHESIS FAILS? → RETRY IN FRESH SESSION
SUBAGENT LOST? → MARK LOST, PROCEED, NOTE GAP
NO COMPLETION 10 MIN? → STUCK DETECTION
TASK TIMEOUT? → DECOMPOSE INTO 2 SMALLER → RETRY ONCE → ESCALATE
```

## Appendix B: Ledger Template

```markdown
# Orchestration Ledger: {task-id}
Created: {ISO timestamp}
Status: IN_PROGRESS

## Subagents

| # | Agent | Task | Spawned | Timeout | Status | Result File |
|---|-------|------|---------|---------|--------|-------------|
| 1 | | | | | ⏳ PENDING | — |

## Completion Log
- {time} — {agent} {status}

## State Transfer (if rotated)
- Pending work: ...
- Next action: ...
```

---

*Protocol v1.1 — designed by Archie, approved by system necessity. Silent failures end here. Timeout safety net added 2026-05-18.*