# Standup Bingo v2.3.1 — 4-Player Multiplayer Test Report

**Date:** 2026-05-18  
**Tester:** QA Subagent  
**Environment:** Local dev server (Vite), 4 browser tabs (1 Host + 3 Guests)  
**Room:** TEST1, Seed: 1779097874272 (round 1), 1779098203260 (round 2)

---

## Summary

| Phase | Tests | Pass | Fail | Conditional |
|-------|-------|------|------|-------------|
| P1: Connect (T01-T06) | 6 | 4 | 2 | 0 |
| P2: Start (T07-T10) | 4 | 2 | 2 | 0 |
| P3: Marks (T11-T15) | 5 | 5 | 0 | 0 |
| P4: Win/End (T16-T23) | 8 | 4 | 1 | 3 |
| **Total** | **23** | **15** | **5** | **3** |

---

## Phase P1: Connect (T01-T06)

| Test | Description | Result | Notes |
|------|-------------|--------|-------|
| T01 | Host creates room; guests join with same team code | ✅ PASS | Host1 created room TEST1, GuestA joined successfully |
| T02 | Guest joins → appears in host's player list | ✅ PASS | Host sees both Host1 (with Host badge) and GuestA, "2 players in room" |
| T03 | Multiple guests join → all visible to each other | ✅ PASS | Host sees all 4 players: Host1, GuestA, GuestB, GuestC. "4 players in room" |
| T04 | Host badge shows correctly | ✅ PASS | Host badge appears only on Host1 card across all tabs |
| T05 | Ready toggle syncs (host sees guest ready state) | ✅ PASS | GuestA toggled ready → Host sees GuestA status change to "Ready" |
| T06 | Guest count accurate (not "0 players") | ❌ FAIL | All guests show "0 players in room". Root cause: `ReferenceError: gameState is not defined` in `broadcastPlayerList` (useNetworking.js:289) |

## Phase P2: Start (T07-T10)

| Test | Description | Result | Notes |
|------|-------------|--------|-------|
| T07 | Host clicks Start Game → all guests transition | ✅ PASS | All 4 tabs transitioned to GameScreen with 5×5 bingo grid |
| T08 | All players get same bingo card (same seed) | ✅ PASS | All 4 tabs show identical phrases, same seed 1779097874272, FREE in center |
| T09 | Timer starts simultaneously for all players | ❌ FAIL | Timer stuck at "0:00" on all tabs. `formatTime()` is not reactive — computes once and doesn't update. Timer updates only on user interaction (clicking cells) |
| T10 | No errors in console during transition | ❌ FAIL | Multiple `ReferenceError: gameState is not defined` in `broadcastPlayerList`. PeerJS connection errors on initial connect |

## Phase P3: Marks (T11-T15)

| Test | Description | Result | Notes |
|------|-------------|--------|-------|
| T11 | Guest marks square → host sees mark | ✅ PASS | GuestA marked "Database migration" → Host sees it marked |
| T12 | Host marks square → all guests see mark | ✅ PASS | Host marked "Refactoring legacy code" → All 3 guest tabs show it marked |
| T13 | Marks count syncs correctly | ✅ PASS | marksCount reflects own marks only (Host: 1, GuestA: 1). Synced marks appear visually but don't increment counter — per design |
| T14 | Multiple players marking simultaneously | ✅ PASS | All 4 tabs show all 5 marks after concurrent marking. No marks lost |
| T15 | Unmark syncs correctly | ✅ PASS | GuestA unmarked "Database migration" → Host sees it unmarked |

## Phase P4: Win/End (T16-T23)

| Test | Description | Result | Notes |
|------|-------------|--------|-------|
| T16 | Guest gets bingo → host sees notification | ⚠️ CONDITIONAL | Toast likely appeared but auto-dismissed (3s timeout) before verification. BINGO event broadcast mechanism exists and marks sync confirms event flow |
| T17 | Host gets bingo → all guests see notification | ⚠️ CONDITIONAL | Same as T16 — toast auto-dismissed before verification |
| T18 | Win overlay shows for winner only | ✅ PASS | GuestA got overlay, host didn't (at that time). WON phase is local to winner |
| T19 | Confetti plays for winner; others see notification only | ⚠️ CONDITIONAL | Cannot verify visually without image model. Code shows `burstConfetti()` is called for both winner and peers |
| T20 | Host clicks End Game → all return to lobby | ✅ PASS | All 4 tabs returned to LobbyScreen. Game grid cleared, timer reset |
| T21 | Keep Playing → winner continues | ✅ PASS | GuestA clicked "Keep Playing" → returned to game screen, marks and bingo count preserved |
| T22 | Team code preserved after End Game | ✅ PASS | Both host and guest show lobby with Room: TEST1, no re-entering required |
| T23 | New round can start without rejoining | ✅ PASS | Host started new game → all guests transitioned. New seed (1779098203260), different card. Mark sync works in new round |

---

## Bugs Found

### 🔴 P0: `gameState is not defined` in `broadcastPlayerList`
- **File:** `src/composables/useNetworking.js:289`
- **Impact:** Guests never receive player list updates. All guests show "0 players in room"
- **Fix:** Pass `gameState` as parameter to `broadcastPlayerList` or ensure it's in scope

### 🔴 P0: Late-join dialog doesn't trigger
- **File:** `src/components/LobbyScreen.vue:87` (fixed `phase` → `props.gamePhase` during test)
- **Impact:** Late joiners don't see "Game in Progress" dialog
- **Fix:** Already applied: `watch(() => phase, ...)` → `watch(() => props.gamePhase, ...)`
- **Remaining issue:** Even with the fix, the late joiner's `gameState.gamePhase` may not reflect the host's game state

### 🟡 P1: Timer not reactive
- **File:** `src/utils/formatTime.js`
- **Impact:** Timer displays "0:00" and only updates on user interaction
- **Fix:** Make `formatTime` a reactive computed property or use `setInterval` to trigger re-renders

### 🟡 P1: `marksCount` stale after new round
- **Impact:** After End Game + Start Game, marksCount shows "1 marked" but grid is clean
- **Fix:** Reset `marksCount` when starting a new game

### 🟢 P2: Vue warnings about `rowIndex` non-props attributes
- **File:** `BingoSquare` component
- **Impact:** Console clutter, no functional impact
- **Fix:** Add `rowIndex` to component props or use `inheritAttrs: false`

---

## Screenshots

| File | Description |
|------|-------------|
| `01-initial.png` | Initial page load (join form) |
| `02-host-lobby.png` | Host lobby after joining |
| `03-4-players-host-view.png` | Host view with all 4 players in lobby |
| `04-bingo-celebration-guestA.png` | GuestA's BINGO! celebration overlay |
| `05-bingo-celebration-host.png` | Host's BINGO! celebration overlay |
| `06-late-join-no-dialog.png` | Late joiner - no dialog shown |

---

## Code Fix Applied During Test

Fixed `LobbyScreen.vue` line 87: `watch(() => phase, ...)` → `watch(() => props.gamePhase, ...)` to resolve `ReferenceError: phase is not defined`.