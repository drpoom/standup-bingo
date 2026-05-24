# Elango Surfers Bug Analysis

**Date:** 2026-05-19  
**Version:** v5.2.27  
**Source:** `/tmp/elango-surfers-src/src/` (cloned from GitHub `main` branch)  
**Live URL:** https://www.drpoom.com/elango-surfers/

---

## Summary

The game is a 5559-line Vue 3 + Three.js single-file component (`App.vue`) with 6 composables. The monolithic structure creates significant maintenance risk. Below are bugs and issues organized by severity.

---

## P0 — Critical Bugs

### 1. Memory Leak: No WebGL Renderer Disposal on Unmount
- **File:** `App.vue:5545-5557` (`onUnmounted`)
- **Issue:** `onUnmounted` removes event listeners, disposes the composer, and stops BGM — but **never disposes the WebGL renderer** (`renderer.dispose()`, `renderer.forceContextLoss()`), never nulls `scene`, `camera`, `renderer`, or `player`. The `requestAnimationFrame` loop in `animate()` is **never cancelled** — there's no `cancelAnimationFrame(animId)` call anywhere.
- **Impact:** Every mount/unmount cycle (HMR during dev, or SPA navigation) leaks the entire WebGL context, GPU textures, and geometries. The animation loop continues running on a detached component.
- **Fix:** Store the `requestAnimationFrame` ID, call `cancelAnimationFrame` in `onUnmounted`, call `renderer.dispose()`, `renderer.forceContextRelease()`, and null out `scene`, `camera`, `renderer`, `player`.

### 2. Memory Leak: `initGame()` Creates New Scene/Renderer Without Disposing Old Ones
- **File:** `App.vue:1186-1277`
- **Issue:** `initGame()` creates `new THREE.Scene()`, `new THREE.PerspectiveCamera()`, and `new THREE.WebGLRenderer()` every time it's called. While it does dispose trees/buildings, it **never disposes the old renderer, camera, or scene**. The old WebGL context leaks.
- **Impact:** On game restart (via `startCountdown` → `restartGame` → `resetStage`), the old renderer's DOM element is orphaned but the GPU context remains.
- **Fix:** Before creating new objects, dispose the old renderer (`renderer.dispose()`, remove `renderer.domElement` from DOM), and traverse the old scene to dispose all geometries/materials.

### 3. Race Condition: Countdown Timeouts Not Fully Cleared on Reset
- **File:** `App.vue:3002-3043` (`startStageCountdown`) and `App.vue:5309-5363` (`startCountdown`)
- **Issue:** Both functions use nested `setTimeout` chains for 3-2-1-GO countdowns. `clearAllTimers()` clears `initialCountdownTimeout` and `stageCountdownTimeout`, but the inner `setTimeout(stageTick, 1000)` / `setTimeout(tick, 1000)` calls within the countdown chain are **not tracked** and can fire after a reset. If a player restarts during countdown, stale callbacks can set `countdownLocked = false` and `stageTransitioning = false` at unexpected times.
- **Impact:** Game can become unplayable — stuck in countdown, or countdown unlocks during a stage transition.
- **Fix:** Track all timeout IDs from countdown chains in an array, and clear them all in `clearAllTimers()`. Alternatively, use a single `setInterval` with a counter.

### 4. Race Condition: `invincibilityTimeout` Cleared But Shield Aura Not Removed
- **File:** `App.vue:3034`, `App.vue:3754`, `App.vue:5338`
- **Issue:** Three separate `setTimeout` calls set `invincibilityTimeout` for the 2-second grace period shield. `clearAllTimers()` clears the timeout, but the `shield-aura` mesh remains attached to the player. After reset, the player has an invisible shield with `isInvincible = false` but the visual aura still present (or vice versa).
- **Impact:** Visual glitch — green shield aura persists after game restart. Or invincibility state mismatch.
- **Fix:** In `clearAllTimers()`, also remove the shield-aura mesh: `const shield = player?.getObjectByName('shield-aura'); if (shield) player.remove(shield);`

---

## P1 — High Severity Bugs

### 5. Memory Leak: `sharedCoinGeo` and `sharedCoinMat` Never Disposed
- **File:** `App.vue:2805-2814`
- **Issue:** `sharedCoinGeo` and `sharedCoinMat` are created once and reused for all coins. They are never disposed on game reset or unmount. While this is intentional for reuse, on component unmount they leak.
- **Impact:** Minor GPU memory leak per session.
- **Fix:** Dispose in `onUnmounted`: `sharedCoinGeo?.dispose(); sharedCoinMat?.dispose();`

### 6. Memory Leak: Boss Geometries/Materials Created Inline, Never Disposed
- **File:** `App.vue:3160-3340` (`spawnBoss`)
- **Issue:** Each boss type creates multiple `new THREE.MeshPhongMaterial`, `new THREE.SphereGeometry`, `new THREE.BoxGeometry`, `new THREE.ConeGeometry`, `new THREE.CylinderGeometry`, `new THREE.BufferGeometry` (wings), etc. — all inline without references. When the boss is removed (`scene.remove(boss); boss = null`), only `scene.remove` is called — **no `.traverse()` to dispose geometries/materials**.
- **Impact:** Each boss fight leaks ~15-30 GPU objects (geometries + materials).
- **Fix:** Before `scene.remove(boss)`, call `boss.traverse(child => { if (child.geometry) child.geometry.dispose(); if (child.material) { if (Array.isArray(child.material)) child.material.forEach(m => m.dispose()); else child.material.dispose(); }})`.

### 7. Memory Leak: Boss Projectiles Not Disposed
- **File:** `App.vue:3690-3725` (boss projectile collision/removal)
- **Issue:** When boss projectiles are removed (`scene.remove(fb)`), their geometries and materials are not disposed. Fireballs create `SphereGeometry` + `MeshBasicMaterial` + glow child meshes. Metal beams create `SpriteMaterial`.
- **Impact:** Accumulating GPU memory leak during boss fights.
- **Fix:** Add `.traverse()` disposal before `scene.remove()` for each projectile.

### 8. Memory Leak: Bonus Zone Objects Not Disposed
- **File:** `App.vue:3878-3910`
- **Issue:** When entering a bonus zone, obstacles and coins are removed from the scene but **not disposed** (comment says "don't dispose — we restore them!"). However, if game over occurs during a bonus zone, `triggerGameOver` disposes obstacles but the saved `savedSubstageState` coins/obstacles were already removed from the scene arrays. The bonus zone's `bonusCoins` (40 `TorusGeometry` + `MeshToonMaterial` each) are removed but never disposed on game over.
- **Impact:** 80+ GPU objects leaked per bonus zone entry that ends in game over.
- **Fix:** In `triggerGameOver`, also dispose `bonusCoins`: `bonusCoins.forEach(bc => { bc.mesh.geometry?.dispose(); bc.mesh.material?.dispose(); scene.remove(bc.mesh); });`

### 9. Memory Leak: Nyan Cat Sprite Not Disposed
- **File:** `App.vue:3917-3923`
- **Issue:** The Nyan Cat sprite creates a `SpriteMaterial` with a loaded texture. On cleanup (`scene.remove(scene.userData.nyanCat)`), the material and texture are not disposed.
- **Impact:** Texture + material leak per bonus zone.
- **Fix:** Dispose before removal: `scene.userData.nyanCat.material?.dispose(); scene.userData.nyanCat.material?.map?.dispose();`

### 10. Memory Leak: Particle Effects Not Disposed
- **File:** `App.vue:3099` (`triggerGameOver`)
- **Issue:** `particles.forEach(p => scene.remove(p))` removes from scene but doesn't dispose geometry/material. Each particle is a `BoxGeometry` + `MeshBasicMaterial` or `SphereGeometry` + `MeshToonMaterial`.
- **Impact:** Accumulating leak during gameplay.
- **Fix:** Add traversal disposal: `particles.forEach(p => { p.geometry?.dispose(); p.material?.dispose(); scene.remove(p); });`

### 11. `useStage.js` Composable Not Used — Duplicate State
- **File:** `useStage.js` (entire file), `App.vue:296-302`
- **Issue:** `useStage.js` exports `currentStage`, `stageTime`, `stageTransitioning` as module-level refs. But `App.vue` declares its own local `const currentStage = ref(0)`, `const stageTime = ref(0)`, etc. at lines 296-302. The composable is **imported but never called** — `App.vue` manages stage state independently.
- **Impact:** Confusing codebase. If someone adds stage logic to `useStage.js`, it won't affect the game. The composable's `resetStage()` and `advanceStage()` are dead code.
- **Fix:** Either remove `useStage.js` or refactor `App.vue` to use it.

### 12. `useAudio.js` — `createMediaElementSource` Called Multiple Times
- **File:** `useAudio.js:175-177`, `useAudio.js:191-193`
- **Issue:** `audioCtx.createMediaElementSource(bgmAudio)` is called each time `startBGM()` runs, but `MediaElementAudioSourceNode` can only be created **once per audio element**. If BGM is stopped and restarted (which happens on every game restart via `stopBGM` → `startBGM`), the second call throws: `"HTMLMediaElement already connected to a different MediaElementAudioSourceNode"`.
- **Impact:** After the first game restart, BGM fails silently. The `try/catch` in `startBGM` swallows the error, but music never plays again.
- **Fix:** Create `MediaElementAudioSourceNode` once during `initAudio()` and reuse it. Check `if (!bgmSource)` before creating.

### 13. `useAudio.js` — Audio Context Suspended on iOS
- **File:** `useAudio.js:49-53`
- **Issue:** On iOS, `AudioContext` starts in a suspended state and must be resumed from a user gesture. `initAudio()` calls `audioCtx.resume()` but this is async and may fail. The `playSound()` function checks `audioCtx.state === 'suspended'` and calls `resume()` but doesn't await it, so sounds may be dropped.
- **Impact:** First few sounds on iOS may not play.
- **Fix:** Use `await audioCtx.resume()` in `playSound()` or pre-resume on first user interaction.

---

## P2 — Medium Severity Bugs

### 14. `resetStage` Sets `stageTransitioning = false` Twice
- **File:** `App.vue:5109-5260`
- **Issue:** `resetStage()` sets `stageTransitioning.value = false` at line 5135, then again at line 5158. The second assignment is redundant but not harmful. However, when called from boss defeat (`resetStage(true, nextStage)`), the subsequent `startStageCountdown()` sets `stageTransitioning.value = true` — but `resetStage` already set it to `false`, creating a brief window where the game loop runs unblocked.
- **Impact:** Potential for a few frames of uncontrolled game state during stage transition.
- **Fix:** Remove the redundant `stageTransitioning.value = false` at line 5158, or ensure `startStageCountdown` is called atomically with the reset.

### 15. `gameOverShakeInterval` Not Cleared on Restart
- **File:** `App.vue:3124-3135`
- **Issue:** `gameOverShakeInterval` is set via `setInterval` in `triggerGameOver`. While `clearAllTimers()` clears it, `restartGame()` calls `resetStage()` which calls `clearAllTimers()`. But if the player clicks restart *before* the 0.5s shake animation completes, the interval may have already been cleared by `clearAllTimers` — but the camera position was modified and never restored to the original.
- **Impact:** Camera may be offset after restart if shake was in progress.
- **Fix:** Store `originalPos` at module scope and always restore camera position in `resetStage`.

### 16. `floatingTexts` Array Cleared But Not Disposed
- **File:** `App.vue:3101`
- **Issue:** `floatingTexts.forEach(t => scene.remove(t))` removes sprites from scene but doesn't dispose their materials/textures.
- **Impact:** Minor memory leak per floating text.
- **Fix:** Add disposal: `floatingTexts.forEach(t => { t.material?.dispose(); t.material?.map?.dispose(); scene.remove(t); });`

### 17. `window._spawnStateInterval` Leaks to Global Scope
- **File:** `App.vue:4092-4094`
- **Issue:** A debug `setInterval` is stored on `window._spawnStateInterval` and only cleared in `clearAllTimers()`. This interval runs every second, calling `__spawnDebug()` which captures the entire game state. It's never conditionally enabled — it always runs.
- **Impact:** Unnecessary CPU usage and memory retention in production.
- **Fix:** Only create this interval in debug mode. Remove in production builds.

### 18. `window.__getSpawnCounts`, `window.__getSpawnDebug`, `window.__getRoadMesh` Exposed in Production
- **File:** `App.vue:630-632`
- **Issue:** Debug/test hooks are exposed on `window` unconditionally, even in production builds.
- **Impact:** Information disclosure (spawn counts, road mesh reference). Could be used for cheating.
- **Fix:** Wrap in `if (import.meta.env.DEV)` or remove for production.

### 19. Leaderboard Supabase Key Hardcoded in Source
- **File:** `useLeaderboard.js:12-13`
- **Issue:** `SUPABASE_URL` and `SUPABASE_ANON_KEY` are hardcoded. While the anon key is designed for client-side use, it allows unauthenticated reads/writes to the scores table. The `HASH_SALT` is also client-visible, making the anti-cheat hash trivially reversible.
- **Impact:** Anyone can submit fake scores or read all entries. The "anti-cheat" hash provides no real security.
- **Fix:** Use Row Level Security (RLS) policies on Supabase. Consider Edge Functions for score validation.

### 20. `useMic.js` — AudioContext Created But Never Closed
- **File:** `useMic.js:21-28`
- **Issue:** `initMic()` creates a new `AudioContext` each time, but `cleanupMic()` only stops the mic stream — it never closes the `AudioContext`. Multiple mic toggles create multiple `AudioContext` instances.
- **Impact:** Browser audio context limit (typically 6-8) can be hit, causing mic to stop working.
- **Fix:** Store the `AudioContext` reference and call `audioCtx.close()` in `cleanupMic()`.

### 21. Bonus Zone Rainbow Shader Not Disposed on Game Over
- **File:** `App.vue:3895-3915` (rainbow shader creation)
- **Issue:** When entering a bonus zone, a `THREE.ShaderMaterial` is created for the road. `triggerGameOver` checks `if (roadGO && originalRoadMaterial)` and disposes the current material, but if `originalRoadMaterial` is null (e.g., game over on first entry before it's saved), the shader material leaks.
- **Impact:** Shader material leak per bonus zone entry without proper cleanup.
- **Fix:** Always dispose the current road material in `triggerGameOver` regardless of `originalRoadMaterial` state.

### 22. `applyStageVisuals` Creates New `THREE.Color` Every Frame Call
- **File:** `App.vue:406, 447`
- **Issue:** `scene.background = new THREE.Color(0x4a5568)` and similar calls create new `Color` objects each time `applyStageVisuals` is called. While minor, this creates garbage collection pressure.
- **Impact:** Minor performance issue.
- **Fix:** Pre-create color constants and reuse: `const STAGE2_BG = new THREE.Color(0x4a5568);`

---

## P3 — Low Severity / Code Quality Issues

### 23. 5559-Line Single File Component
- **File:** `App.vue` (entire file)
- **Issue:** The entire game logic is in one 5559-line SFC. This makes debugging extremely difficult and increases bundle size.
- **Fix:** Continue extracting composables (as started with `useAudio`, `useMic`, `useLeaderboard`). Priority areas: boss logic, spawn system, collision detection, stage management.

### 24. `textureCache` Never Cleared
- **File:** `App.vue:960-970`
- **Issue:** `loadTexture()` caches textures in `textureCache` object, but this cache is never cleared on game reset or component unmount. Over multiple stage transitions, textures accumulate.
- **Impact:** Memory growth over long play sessions.
- **Fix:** Clear `textureCache` in `resetStage()` or `onUnmounted()`.

### 25. `stage3Textures` Object Never Cleared
- **File:** `App.vue:1048-1070`
- **Issue:** `stage3Textures` is loaded once (`if (Object.keys(stage3Textures).length > 0) return`) and never disposed. This is intentional for caching, but the textures are never disposed even on unmount.
- **Fix:** Dispose all `stage3Textures` entries in `onUnmounted`.

### 26. `buildingTextures` and `buildingDominantColors` Module-Level Arrays
- **File:** `App.vue:168-169`
- **Issue:** These module-level arrays are populated during building creation but never cleared on reset. They grow unbounded across game restarts.
- **Fix:** Reset `buildingTextures = []` and `buildingDominantColors = []` in `resetStage()` or `initGame()`.

### 27. No Error Boundary for Three.js WebGL Context Loss
- **File:** `App.vue` (renderer setup)
- **Issue:** No `renderer.onContextLoss` handler. If the browser loses the WebGL context (common on mobile), the game freezes silently.
- **Fix:** Add `renderer.onContextLoss = () => { /* show error, reinit */ }`.

### 28. `clock.getDelta()` Called Multiple Times Per Frame
- **File:** `App.vue:3413-3450` (animate loop)
- **Issue:** `clock.getDelta()` is called in the early-return branches (loading, paused, game over, countdown) to "consume" delta. But `getDelta()` returns time since last call — calling it multiple times per frame means subsequent calls return near-zero deltas. The main game loop then uses `delta` from a single `getDelta()` call, which is correct, but the pattern is fragile.
- **Impact:** If any code path calls `getDelta()` an extra time, the game speed drops to near-zero for one frame.
- **Fix:** Call `getDelta()` once at the top of `animate()` and store in a variable.

### 29. `isPaused` State Can Become Desynchronized
- **File:** `App.vue:5375-5395`
- **Issue:** `pauseGame()` checks `if (isPaused.value || gameOver.value || countdownActive.value || countdownLocked || stageTransitioning.value) return;` — but `resumeGame()` can clear `isPaused` without actually resuming if countdown/transition is active: `isPaused.value = false; // Clear paused state but don't adjust clock`. This can leave the game in an inconsistent state where `isPaused` is false but the clock wasn't adjusted for the pause duration.
- **Impact:** After a pause during countdown, the game clock may be offset, causing speed anomalies.
- **Fix:** Don't allow pausing during countdown/transition, and always adjust the clock on resume.

### 30. `bossDebris` Array Not Cleared on Reset
- **File:** `App.vue` (boss debris management)
- **Issue:** `bossDebris` is used for the giant meatball boss's falling debris, but `resetStage()` and `triggerGameOver()` don't clear `bossDebris`. Debris objects remain in the scene and array after game over.
- **Impact:** Leftover debris from boss fights persists after restart.
- **Fix:** Add `bossDebris.forEach(d => { d.geometry?.dispose(); d.material?.dispose(); scene.remove(d); }); bossDebris = [];` to both `resetStage` and `triggerGameOver`.

---

## Architecture Issues

### A. Duplicate Stage State Management
`useStage.js` defines `currentStage`, `stageTime`, `stageTransitioning` as module-level refs, but `App.vue` defines its own local refs with the same names. The composable is imported but never called — it's dead code. This creates confusion about where state lives.

### B. No Centralized Disposal Pattern
Three.js objects are disposed ad-hoc throughout the codebase. There's no unified `disposeScene()` or `disposeAll()` function. This leads to inconsistent cleanup (some paths dispose, others don't).

### C. Global Mutable State
~50 `let` variables at module scope (`boss`, `obstacles`, `coins`, `powerups`, `particles`, `floatingTexts`, etc.) are mutated from many functions. This makes state tracking nearly impossible and is the root cause of many bugs above.

### D. Timer Management
14 `setTimeout`/`setInterval` calls are tracked with only 7 timer IDs. The countdown chains use nested `setTimeout` without tracking intermediate IDs, creating race conditions on reset.

---

## Recommendations

1. **Immediate (P0):** Add `cancelAnimationFrame` + `renderer.dispose()` to `onUnmounted`. Track and clear all countdown timeout IDs.
2. **Short-term (P1):** Add `.traverse()` disposal for boss, projectile, particle, and bonus zone objects. Fix `createMediaElementSource` double-creation. Create a centralized `disposeAll()` function.
3. **Medium-term (P2):** Remove debug globals from production. Fix `useMic` AudioContext leak. Add WebGL context loss handler.
4. **Long-term (P3):** Refactor `App.vue` into smaller composables. Implement a proper entity-component system for Three.js objects with automatic disposal. Add unit tests for state reset paths.