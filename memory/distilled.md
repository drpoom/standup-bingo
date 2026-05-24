## 2026-05-12
- **Daily Performance Report Format Standardized** — Table format with: Task Outcomes (Succeeded/Timeout/Failed), Model Performance (Sessions, Tokens, Avg In/Out/Total, Wall Time, Inference, TPS), Top 10 Slowest Tasks (Wall Time, Inference, Ratio, Project), Project Activity. Cron job: 7:30 AM daily via `daily-performance-report.sh`.

## 2026-04-05
- Setup daily investment news briefings for a specific watchlist (TSM, SK Hynix, MU, GOOGL, AAPL, Hesai, Xiaomi, Trip).
- Set up cron job (7:00 AM) for these briefings.
- Researched AI business opportunities: AI System Monitoring (primary), Thai Expat AI Influencer (secondary), and Meme Investor Dog.

## 2026-04-07
- Configured "Model-Router" pipeline: Gemma 4 (Coordination), MiniMax-m2.7 (Planning), Qwen 3.5 (Coding).
- Verified Telegram/WhatsApp security restrictions (allowFrom user 425039645).
- Developed and deployed "Moon Landing" (Vue 3/Vite) and "Elango Surfers" (Vue 3/Vite/Three.js) games to GitHub Pages.
- Fixed GitHub deployment 404s/blank screens by using a manual `gh-pages` branch workflow and correcting the `base` path.
- Resolved browser audio autoplay issues using `AudioContext` resume within user gestures.
- Handled WhatsApp pairing corruption (status 499) by planning a credentials clear/re-pair.

## 2026-04-09
- Fixed corrupted `Game.vue` in Moon Landing game caused by duplicate code blocks during programmatic edits.
- Deployed Elango Surfers v2.0.0-v2.0.3: added animated characters, enhanced road graphics, fixed powerup expiry bugs, and corrected character orientation.
- Replaced broken Minotar avatars with DiceBear API in "Standup Quests" project.
- Split investment cron jobs into two runs (7:00 International, 7:05 Thai stocks).
- Identified that forced personality changes to the agent's "Mickey" persona are less effective than natural interaction.

## 2026-04-10
- Finalized Moon Landing deployment with fixed physics and body background colors.
- Reinforced critical deployment workflow: verify `npm run build` → commit to `main` → deploy to `gh-pages`.
- Established rule: verify no duplicate code blocks are created when editing Vue files programmatically.

## 2026-04-11
- **Elango Surfers v2.4.0-v2.5.8**: AI-generated sky/mountain textures via Replicate (Flux Schnell); procedural polygon character > static sprites for animation; torus coins > flat sprites; texture loading causes GPU freezes—keep count minimal
- **Elango Surfers v3.0.1-v3.4.1**: AI environment textures (buildings, trees, grass); curved earth implementation via bent mesh geometry (60 segments) + `getSurfaceY(z)` math; objects must apply curve at spawn time to avoid visual pop
- **Elango Surfers v3.4.2-v3.5.2**: Rainbow road shader, Nyan Cat sprite, WebP optimization (6.7MB→340KB, 95% reduction); black screen bugs from TDZ (const used before declaration) and variable order; performance: shadow map 2048→1024, no obstacle shadows, mobile pixel ratio capped at 1
- **Key lesson**: Sprites don't work for animated characters—use procedural polygons with AI texture overlays. Declaration order critical for JavaScript TDZ.

## 2026-04-12
- **Elango Surfers v3.1.2**: 8 obstacle types with progressive unlock (fruit, car, stone, barrier, police, bus, fire engine, wall, barrel); movement AI (police slides, bus lunges, UFO sweeps); difficulty max speed 2x→3.5x
- **Replicate pipeline**: Flux Schnell generate → Bria RMBG 2.0 background removal (~$0.006/sprite); tree sprites cleaned of white edges
- **Elango Surfers v3.2.1-v3.4.6**: Near-miss bullet-time (slow-mo 0.3x, FOV zoom); bonus zone with rainbow road + 40 coins; countdown 3-2-1-GO on start/restart; curved earth v2 rolled back then re-implemented properly with bent geometry
- **v3.4.7-v3.5.2**: Nyan Cat flies left→right, trees 20% smaller, WebP conversion; game-over/restart must cleanup bonus zone state (road material, coins, Nyan Cat, visibility); black screen #3 from `isMobile` TDZ; pre-deploy check script added to CI
- **Key lesson**: Variable declaration order matters—JavaScript TDZ throws on const/let before declaration. All exit paths (timer, game over, restart) must cleanup state.

## 2026-04-13
- **Elango Surfers v3.7.5-v3.7.9**: Fog event eased (density 5→2, duration 8→6s); tree floating fix; UI overlap fix; fog message bug (decay to 0 before cleanup); real Nyan Cat from OpenClipart; procedural chiptune BGM (Am→F→C→G, 130 BPM, 32s loop)
- **Standup Quests Visual Sprint (9 cycles, 02:51–05:00 AM)**:
  1. Animated canvas backgrounds per theme (Classic: stars+torch, Millennium: mako particles, Sci-Fi: holo grid+scanline)
  2. Score animations (floating +N, particle burst, card shake, screen flash)
  3. Circular SVG timer with urgency pulse ≤10s
  4. Transition screen with spark particles, quest preview
  5. Hall of Fame: 80-piece confetti, staggered podium reveal, crown glow
  6. Setup screen: class icons/emojis, shimmer button, 3-col layout
  7. Theme selector + music player overhaul (equalizer, track list)
  8. Custom questions with localStorage persistence
  9. CSS cleanup: -1,340 lines (removed 3x duplicated theme backgrounds)
- **Key lesson**: CSS duplication sneaks in fast—grep for duplicates. Canvas resize needs DPR handling. Confetti needs gravity + respawn logic.

## 2026-04-14
- **Sprint 1.22 Review**: 3 bugs fixed (statSnapshot, BBQStallScene props, skeleton selectedItem); Creative spec blocker persists—Tech will write chapter4_scenes.md directly for Sprint 1.23
- **Elango Surfers v4.0.0-v4.0.1**: Road curvature was broken (only incremental drift, no mesh bending); fixed with `getCurveX(z)` absolute positioning + `updateRoadCurve()` mesh vertex bending; stores original positions at creation
- **Elango Surfers v4.0.2-v4.0.5**: Boss battles (truck charges/weaves, dragon shoots 2-3 fireballs at different heights); stage transitions swap road texture (asphalt↔cobblestone), grass color, sky tint; medieval obstacle filter (no cars/buses); cobblestone scrolls with movement; road curve toggle in Settings
- **Key lesson**: When adding state that modifies scene (bonus zone, boss), ensure ALL exit paths cleanup. Boss fight: near-misses damage boss, defeat = explosion + 5s delay → next stage.

## 2026-04-15
- **Elango Surfers v4.0.8-v4.1.7**: Rainbow portal disabled during boss; dragon no spin (wings flap, tail sways); dragon fireball = instant death; debug stage selector; barrel rotates child mesh only; road curve quadratic (straight near player, sharp at distance); truck locks target X at charge start; curve front propagation (z=-80 sweeps toward player); barrel lying on side rolls around X axis
- **v4.1.8-v4.2.1**: Game restart collision bug (stale objects kill on frame 1); object positions reset on restart (buildings/trees store initX/initZ); mic sensitivity decreased; full restart state audit (45+ variables); BGM restart fix (`createMediaElementSource` can only be called once per audio element); centralized `triggerGameOver()`; pending timeout cancellation; iOS tilt permission retry; stats save before reset; README rewritten
- **Key lesson**: `createMediaElementSource` once per audio element—cache and reuse. Full state audit on restart essential. Centralize game over logic.

## 2026-04-16
- **Elango Surfers Bug Fixes (v4.4.4)**: (1) Objects don't spawn after boss—reset `lastSpawnTime` + set `gameDuration=1.5` in 5s timeout; (2) "GO!" doesn't start music—add `startBGM()` to initial countdown; (3) No countdown on restart—investigating
- **COBRA Protocol Refactor**: `core/protocol_spec.json` as single source of truth; Python loads JSON at import, JS constants generated; BMM350 register map expanded 8→23 registers; `set_odr()` takes string key ('100_HZ')
- **COBRA Dual-Backend I/O**: Transport abstraction (Serial + BLE); BLE uses Nordic UART Service (NUS) over COINES V3 packets; 20-byte GATT chunking; `CobraBridge(transport=)` injection pattern; backward compatible with `CobraBridge(port=)`
- **COBRA Monorepo**: `cobra-py/` (PyPI) + `cobra-js/` (npm); sync/async/streaming tiers; `tools/gen_constants.py` generates both; JS refactored to accept transport; dashboard with USB + BLE buttons
- **OpenClaw Config**: Compaction safeguard mode (reserveTokens 16k, maxHistoryShare 0.65, keepRecentTokens 8k); timeout 300→240s, maxTokens 8192→6000; GLM 5.1 vs Gemma 4 timeout comparison (Gemma 43% better)
- **Multi-Agent Setup**: Byte (GLM 5.1, tech), Sashay (Qwen 3.5, creative), Scout (GLM 5.1, QA veto); TASKS.md orchestrator; cron 4:45 AM review + 4:50 AM error log
- **Key lesson**: JSON is authority for protocol. Transport injection enables USB/BLE sharing same packetizer. Break QA into focused subtasks (1-2 files) not monolithic reviews.

## 2026-04-17
- **Elango Surfers Post-Boss Spawn Bug**: Objects stop spawning after boss defeat (v4.5.0-v4.5.5); static analysis failed, required dynamic Playwright debugging with god mode/cheat shortcuts; debug logs added ([SPAWN-DEBUG], [SPAWN-TRIGGERED]); root cause: array reference lost in resetStage() - fixed with .length=0 pattern instead of array reassignment; also fixed initGame() same bug; bossHealth/powerups not resetting on stage transition
- **Scout Agent QA Drill**: T04+T05 parallel (Byte audit + Sashay creative), T06 sequential (Scout QA); Scout caught VERSION bug (0.1.0→0.1.2) that Byte missed; QA adds real value beyond audit
- **Standup Roulette Dōjō Theme**: Byte audit (10 critical gaps), Sashay creative brief + Tesshin Genryū character bible; Mickey wrote audio.js + dojo-assets.css (8 pure-CSS effects); AI-generated Sensei sprites + dōjō background via Replicate (~$0.012); deployed v3.4
- **Sub-Agent Context Overflow**: Byte failed 3x with "prompt too long by 1428 tokens" on first turn—Gemma 4 31B real context smaller than declared 128K; switched Byte to GLM 5.1; prevention: lightContext:true, lean prompts (<500 chars), session maintenance (pruneAfter:7d)
- **System Prompt Optimization**: Tool deny lists per agent (Byte -3.5K tokens, Sashay -1.7K, Scout -3.9K); skill filters reduced; crons disabled (Health Check 1.27M tokens/day); daily standup 7:30 AM new ritual
- **Key lesson**: First-turn context overflow has no compaction safeguard—prevent with lightContext + lean prompts. QA agent catches bugs auditors miss. Array reassignment breaks reactive references—use .length=0 to clear.

## 2026-04-16
- **COBRA Protocol Refactor**: core/protocol_spec.json as single source of truth; Python loads JSON at import, JS constants generated; BMM350 register map expanded 8→23 registers; set_odr() takes string key ('100_HZ')
- **COBRA Dual-Backend I/O**: Transport abstraction (Serial + BLE); BLE uses Nordic UART Service (NUS) over COINES V3 packets; 20-byte GATT chunking; CobraBridge(transport=) injection pattern; backward compatible with CobraBridge(port=)
- **COBRA Monorepo**: cobra-py/ (PyPI) + cobra-js/ (npm); sync/async/streaming tiers; tools/gen_constants.py generates both; JS refactored to accept transport; dashboard with USB + BLE buttons
- **BMM350 Constants Sync**: Fixed missing BMM350_PMU_STATUS in JS; removed stale V1/V2/V4 references; synced __version__ to 0.1.0 in both packages; added VERSION export to JS; verified all Python imports
- **OpenClaw Config**: Compaction safeguard mode (reserveTokens 16k, maxHistoryShare 0.65, keepRecentTokens 8k); timeout 300→240s, maxTokens 8192→6000; GLM 5.1 vs Gemma 4 timeout comparison (Gemma 43% better)
- **Multi-Agent Setup**: Byte (GLM 5.1, tech), Sashay (Qwen 3.5, creative), Scout (GLM 5.1, QA veto); TASKS.md orchestrator; cron 4:45 AM review + 4:50 AM error log
- **Key lesson**: JSON is authority for protocol. Transport injection enables USB/BLE sharing same packetizer. Break QA into focused subtasks (1-2 files) not monolithic reviews.

## 2026-04-15
- **Elango Surfers v4.0.8-v4.2.1**: Rainbow portal disabled during boss; dragon no spin (wings flap, tail sways); dragon fireball = instant death; debug stage selector; barrel rotates child mesh only; road curve quadratic (straight near player, sharp at distance); truck locks target X at charge start; curve front propagation (z=-80 sweeps toward player); barrel lying on side rolls around X axis
- **Game Restart Bug**: Collision on frame 1 after restart (stale objects); object positions reset on restart (buildings/trees store initX/initZ); mic sensitivity decreased; full restart state audit (45+ variables); BGM restart fix (createMediaElementSource can only be called once per audio element); centralized triggerGameOver(); pending timeout cancellation; iOS tilt permission retry; stats save before reset; README rewritten
- **Tilt Calibration**: Written handler + variables, not yet integrated into startCountdown()
- **CheddaBoards Leaderboard**: Investigated free alternative to BoardQ Premium ($6.99/mo); found API endpoints (https://api.cheddaboards.com); reviewed GDScript source for endpoint paths and body format
- **Key lesson**: createMediaElementSource once per audio element—cache and reuse. Full state audit on restart essential. Centralize game over logic.

## 2026-04-07
- **Elango Surfers Deployment**: Fixed GitHub Pages 404 (build artifacts in /dist subfolder on gh-pages branch); moved index.html + assets to root; force-pushed gh-pages with essential files only
- **Feature Additions**: Character model (body + head), fruit obstacles, collectible coins (+100 points), jumping (W/Up Arrow), persistent High Score (localStorage)
- **Bug Fixes**: Wider obstacles (3x larger, radius 1.2); restart on Space/Enter (no more broken game over screen); better collision detection adjusted to larger obstacle size
- **Mobile Support Requested**: Touch screen swipe controls (left/right/up) - requested but not yet implemented in this session
- **WhatsApp Gateway**: Status 499 disconnection/reconnection observed during session
- **Key lesson**: GitHub Pages serves from branch root, not /dist. Hard refresh (Ctrl+F5) required after deploy.

## 2026-04-06
- **Telegram Channel Debug**: TUI works but Telegram doesn't; gateway starts but channels not loading; no Telegram channel logs from startup
- **Root Cause**: TELEGRAM_BOT_TOKEN environment variable not set in systemd service; config file token not sufficient
- **Fix Applied**: Added TELEGRAM_BOT_TOKEN to systemd service file; reloaded systemd daemon; restarted gateway
- **Key lesson**: Telegram channel requires env var, not just config file. Check channel loading logs on startup.

## 2026-04-05
- **AI Business Research**: Three opportunities researched—AI System Monitoring (primary), Thai Expat AI Influencer (secondary), Meme Investor Dog (tertiary); AI System Monitoring report compiled (7.2 KB); Thai Expat and Meme Investor research done but reports not compiled due to memory flush interruption
- **Time Tracking Bug**: Assistant reported false completion times; caught at 14:05 (started 13:34, claimed completion); progress log rewritten with honest timestamps
- **Memory Flush Protocol**: Pre-compaction flush restricts writes to memory/YYYY-MM-DD.md only; workspace bootstrap files (MEMORY.md, SOUL.md, TOOLS.md, AGENTS.md) are read-only; append-only to existing daily memory files
- **Session Loop Issue**: Assistant got stuck in response loop/hallucination around 16:05-16:12; required explicit reset command from user to break cycle
- **Key lesson**: Always track time honestly with active progress logging. Memory flush = single canonical file writes only. Reset agent on loop/hallucination.

## 2026-04-17
- **Scout Agent Drill**: T04+T05 parallel (Byte audit + Sashay creative), T06 sequential (Scout QA); Scout caught VERSION bug (0.1.0→0.1.2) Byte missed; QA adds real value
- **Standup Roulette Dōjō Theme**: Byte audit (10 critical gaps), Sashay creative brief + Tesshin Genryū character bible; Scout QA timed out on monolithic task—split into T14 (creative-vs-audit) + T15 (character-vs-code); Mickey wrote audio.js + dojo-assets.css (8 pure-CSS effects); merged into ClassroomTheme.vue; deployed v3.4; AI-generated Sensei sprites (3 expressions) + dōjō background via Replicate (~$0.012)
- **Sub-Agent Context Overflow**: Byte failed 3x with "prompt too long by 1428 tokens" on first turn—Gemma 4 31B real context smaller than declared 128K; switched Byte to GLM 5.1; prevention: lightContext:true, lean prompts (<500 chars), session maintenance (pruneAfter:7d)
- **Elango Surfers Post-Boss Bugs**: Objects don't spawn after boss defeat (UNFIXED, debug logs added v4.5.3); "Boss Incoming" not clearing (defensive double-clear added); game slows after transition (memory leak: boss geometries/materials never disposed); resetStage() refactor v4.5.0 with 3-2-1-GO countdown
- **System Prompt Optimization**: Tool deny lists per agent (Byte -3.5K tokens, Sashay -1.7K, Scout -3.9K); skill filters (Byte 15→5, Sashay 15→4, Scout 15→2); workspace files lean (~500 chars); crons disabled (Health Check 1.27M tokens/day, Orchestrator, Error Log); daily standup 7:30 AM new ritual
- **Elango Surfers Leaderboard**: Supabase integration (free tier 500MB/50K rows); `useLeaderboard.js` rewritten with fetchGlobal/submitGlobal, SHA-256 anti-cheat, offline queue; `game_version` column filters by version; stage transition bug (bossHealth/powerups not reset) → resetStage(preserveScore, targetStage) architecture
- **Key lesson**: First-turn context overflow has no compaction safeguard—prevent with lightContext + session maintenance + lean prompts. QA agent catches bugs auditors miss. One reset function > two code paths for 50+ state variables.
