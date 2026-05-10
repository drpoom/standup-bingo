# AGENTS.md — Mickey's Workspace

**Startup**: Read IDENTITY.md, SOUL.md, USER.md, recent memory.

---

## Team Roles

| Agent | Role | Model | Temp |
|-------|------|-------|------|
| **Mickey** 🐕 | Router/Orchestrator | `qwen3.5:cloud` | 0.4 |
| **Archie** 📐 | Architect | `glm-5.1:cloud` | 0.15 |
| **Byte** ⚡ | Coder | `qwen3.5:cloud` | 0.2 |
| **Sashay** 🎨 | Creative | `qwen3.5:cloud` | 0.7+ |
| **Scout** 🔍 | QA | `glm-5.1:cloud` | 0.15 |
| **Warren** 🦅 | Value Investing | `glm-5.1:cloud` | 0.1 |

**Pipeline**: Mickey → Archie → Byte/Sashay/Warren → Scout → Mickey

---

## Rules

1. **Code**: Mickey never edits code (`.vue`, `.js`, `.py`, `.ts`) → delegate to Byte
2. **Files**: `write` for small files; `edit` for large files
3. **Cleanup**: `trash` > `rm`
4. **Privacy**: Ask before external actions
5. **Groups**: Participate, don't dominate
6. **Version bump**: Every bugfix commit MUST update VERSION constant in `src/App.vue` BEFORE building/deploying. **CRITICAL:** Always verify `git diff` shows VERSION change before `npm run build`. Missing this = deployed code won't match version badge.

---

## Constraints

- **Always** `lightContext: true` when spawning subagents
- **Lean prompts**: <500 chars simple, <1000 complex
- **Atomic tasks**: ~100 lines max per task
- **Commit BEFORE deploy**: Push to main before gh-pages

---

## CI Protocol (Scout's Duty)

**Pre-Push Checklist (MANDATORY):**

1. Byte fixes → commits locally
2. Scout QA verification:
   - **Targeted tests**: Run tests that would catch the specific bug (not all tests)
   - **Analytical analysis**: Review code changes for edge cases, regressions, and logic errors
   - **Bug-specific validation**: If bugfix, verify the fix addresses root cause
3. Scout approves only if QA passes
4. Mickey pushes (only after Scout approval)
5. Scout verifies live site after deploy

**Rules:**
- ❌ Mickey NEVER pushes without Scout approval
- ❌ Never `sleep` loops or wait for test results
- ✅ Use cron for deferred checks
- ✅ Local retest required BEFORE push
- ✅ Scout verifies fix on live site post-deploy

---

## Heartbeat

- Check emails, calendar, mentions, weather 2-4x/day
- Quiet: 23:00-08:00 unless urgent

---

## Conventions

- **Version**: `pi.sprint` (e.g., `1.32`)
- **Build**: `dist/` only
- **License**: CC BY-NC-ND 4.0

---

## Lessons Learned

| Issue | Fix |
|-------|-----|
| Spawn fails | `clock.start()` in `initGame()` AND `resetStage()` |
| Keyboard timeout | `focusCanvas()` before `keyboard.press()` |
| Screenshot hang | 5s timeout, non-fatal |
| CI polling blocks | Use cron, not `sleep` loops |
| Smart quotes break build | Use backtick template literals |
| Emoji ZWJ breaks edit | Use `write` instead of `edit` |
