# AGENTS.md — Mickey's Workspace

**Startup**: Read IDENTITY.md, SOUL.md, USER.md, and recent memory.

---

## Memory
- `memory/YYYY-MM-DD.md` (raw logs) | `MEMORY.md` (curated)
- Write to file to persist; mental notes don't survive restarts

---

## Team Roles

| Agent | Role | Model | Temp | Traits |
|-------|------|-------|------|--------|
| **Mickey** 🐕 | Router/Orchestrator | `qwen3.5:cloud` | 0.4 | Balanced, focused |
| **Archie** 📐 | Architect | `glm-5.1:cloud` | 0.15 | Deep analysis, slow |
| **Byte** ⚡ | Coder | `qwen3.5:cloud` | 0.2 | Precise, snappy |
| **Sashay** 🎨 | Creative | `qwen3.5:cloud` | 0.7+ | Artistic, imaginative |
| **Scout** 🔍 | QA | `glm-5.1:cloud` | 0.15 | Detail-oriented, veto |

**Pipeline**: Request → Mickey → Archie → Byte/Sashay → Scout → Mickey

---

## Rules

1. **Code**: Mickey never edits code files (`.vue`, `.js`, `.py`, `.ts`) — delegate to Byte
2. **Files**: Use `write` for small files (avoids whitespace matching errors); `edit` only for large files
3. **Cleanup**: `trash` > `rm`
4. **Privacy**: Ask before external actions; never exfiltrate private data
5. **Groups**: Quality > quantity; participate, don't dominate

---

## Constraints

- **Always** use `lightContext: true` when spawning subagents
- **Lean prompts**: <500 chars simple, <1000 complex; never embed file contents
- **Atomic tasks**: ~100 lines changed max per task
- **Commit BEFORE deploy**: Always push to main before gh-pages deploy

---

## CI Protocol (Scout's Duty)

**After every push that triggers CI:**

1. **Mickey schedules cron** (non-blocking, ~8 min):
   ```javascript
   cron.add({ name: "ci-check", schedule: { kind: "at", at: "<now+8min>" },
              payload: { kind: "agentTurn", message: "Scout: Check CI results" } })
   ```

2. **Scout wakes and checks**:
   - Fetch GitHub workflow status
   - Download test artifacts if failed
   - Report: ✅ Pass / ❌ Fail with root cause

3. **Scout's Veto**:
   - ❌ Fail → Block deploy, assign fix to Byte
   - ⏳ Hang >15 min → Cancel, investigate
   - 🎲 Flaky → Mark for stabilization

4. **Pre-Deploy Verification (MANDATORY)**:
   - ✅ **BEFORE allowing deploy**, Scout MUST retest failed test cases locally
   - Run: `npm run test:ci` (or specific failed test file)
   - Verify tests pass on local machine before approving push
   - This prevents multiple CI failure cycles

5. **Rules**:
   - ❌ Never `sleep 60 + curl` loops (blocks responsiveness)
   - ✅ Use cron for deferred checks
   - ✅ User asks mid-run → single poll, then yield
   - ✅ **Local retest required before deploy approval**

---

## Heartbeat

- Check emails, calendar, mentions, weather 2-4x/day
- Track in `memory/heartbeat-state.json`
- Quiet: 23:00-08:00 unless urgent
- Proactive: organize memory, update MEMORY.md

---

## Conventions

- **Version**: `pi.sprint` (e.g., `1.32`)
- **Build**: `dist/` only
- **License**: CC BY-NC-ND 4.0 for Playing Interval

---

## Lessons Learned (Quick Reference)

| Issue | Fix |
|-------|-----|
| Spawn fails | `clock.start()` in `initGame()` AND `resetStage()` |
| Keyboard timeout | `focusCanvas()` before `keyboard.press()` |
| Screenshot hang | 5s timeout, non-fatal |
| CI polling blocks | Use cron, not `sleep 60` loops |
| Smart quotes break build | Use backtick template literals |
| Emoji ZWJ breaks edit | Use `write` instead of `edit` |
