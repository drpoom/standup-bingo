# TASKS — System Hardening

## Task 1: Fix systemd Service Permissions
- **Status:** ❌ Deferred
- **Owner:** ลุงจอห์น
- **Detail:** `openclaw gateway install --force` keeps getting SIGTERM'd from the exec tool. Byte also failed. Needs manual run from terminal.
- **Action:** ลุงจอห์น will run `openclaw gateway install --force` manually later.

## Task 2: Tune Context Compaction Thresholds
- **Status:** ⬜ Pending
- **Owner:** Archie
- **Detail:** Context overflow triggered at 07:01 during daily briefing. Current settings: `reserveTokens: 12000`, `keepRecentTokens: 16000`, `maxHistoryShare: 0.4`, `softTrimRatio: 0.7`, `hardClearRatio: 0.85`.
- **Action:** Lower `softTrimRatio` to 0.6 and `hardClearRatio` to 0.75 so compaction kicks in earlier. Reduce `keepRecentTokens` to 12000 to free headroom. Apply via `gateway config.patch`.

## Task 3: Add Session Timeout Monitoring
- **Status:** ⬜ Pending
- **Owner:** Archie
- **Detail:** "Stuck session" warning observed. Need auto-abort for sessions >5min without progress.
- **Action:** Lower `agents.defaults.timeoutSeconds` from 600 to 300. Add a cron job that checks for stuck sessions every 5 minutes using `openclaw sessions list` and kills sessions that have been running >5min with no recent activity.
