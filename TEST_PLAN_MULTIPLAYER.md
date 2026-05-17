# Standup Bingo v2.2.6 — Multiplayer Verification Test Plan

**Decomposed into 23 atomic test tasks, each 1–2 min, executable with 4 browser instances.**

> **Setup:** Launch 4 browser tabs/windows. One acts as Host, three as Guests. All use the same team code and date.  
> **Room ID convention:** `{TEAMCODE}-{YYYY-MM-DD}` (e.g., `TEST1-2026-05-17`)  
> **PeerJS:** Uses default PeerJS cloud broker; room = PeerJS peer ID for host.

---

## A. Connection & Lobby (6 tasks)

### Task 1 — Host creates room; guests can join with same team code
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Tab 1: Enter team code `TEST1`, name `Host1`, click **Join Room**.
  2. Wait ~1.5 s for PeerJS `open` event (host becomes available).
  3. Tab 2: Enter same team code `TEST1`, name `GuestA`, click **Join Room**.
  4. Tab 2 connects as client (`initializeAsClient`).
- **Pass:** Tab 2 shows lobby (not stuck on join form); no console errors; `connected` is true on both tabs within ~2 s.

### Task 2 — Guest joins → appears in host's player list
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Task 1 already completed (both in lobby).
  2. On Tab 1 (host), inspect the **Players in Room** section.
- **Pass:** Host's player list shows both `Host1` (with Host badge) and `GuestA`. Player count text reads "2 players in room".

### Task 3 — Multiple guests join → all visible to each other
- **Role:** Host (Tab 1) + Guest A (Tab 2) + Guest B (Tab 3) + Guest C (Tab 4)
- **Steps:**
  1. Host already in room from Task 1.
  2. Tab 3: Join as `GuestB` with team code `TEST1`.
  3. Tab 4: Join as `GuestC` with team code `TEST1`.
  4. Wait ~2 s for each connection.
  5. Check player lists on all 4 tabs.
- **Pass:** Every tab shows 4 players: Host1, GuestA, GuestB, GuestC. Player count reads "4 players in room" on every tab.

### Task 4 — Host badge shows correctly on host player card
- **Role:** Host (Tab 1) + any Guest (Tab 2)
- **Steps:**
  1. Both in lobby from prior tasks.
  2. Tab 1: Verify `Host1` card shows the **Host** badge (icon + text).
  3. Tab 2: Verify `GuestA` card does **not** show the Host badge. Verify `Host1` card on Tab 2 **does** show the Host badge.
- **Pass:** Host badge appears only on the host player card across all tabs. No guest has the badge.

### Task 5 — Ready toggle syncs (host sees guest ready state)
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Tab 2: Click **Toggle Ready** button.
  2. Tab 2: Button changes to green "You are Ready" with checkmark.
  3. Tab 1: Check GuestA's card in player list.
- **Pass:** Host sees GuestA's status change from "Not Ready" (empty checkbox) to "Ready" (green badge with checkmark). The `PLAYER_READY` event was sent and `broadcastPlayerList` propagated the state.

### Task 6 — Guest count accurate (not "0 players" when guests connected)
- **Role:** Host (Tab 1) + 3 Guests (Tabs 2–4)
- **Steps:**
  1. All 4 tabs in lobby.
  2. On each tab, read the "X players in room" text.
- **Pass:** Every tab displays "4 players in room". No tab shows "0 players" or "1 player" when others are connected. This validates `broadcastPlayerList` and `PLAYER_LIST` event handling.

---

## B. Game Start Sync (4 tasks)

### Task 7 — Host clicks Start Game → all guests transition to game screen
- **Role:** Host (Tab 1) + 3 Guests (Tabs 2–4)
- **Steps:**
  1. All in lobby. Host clicks **Start Game** (theme: default).
  2. `handleStartGame` broadcasts `GAME_START` with theme + seed.
  3. Guests receive `GAME_START` → `handleRemoteGameStart` → `startGame()`.
  4. Check all 4 tabs: phase should be `PLAYING`, showing the bingo card grid.
- **Pass:** All 4 tabs show the GameScreen (5×5 bingo grid with phrases). No tab remains on the lobby screen. No console errors.

### Task 8 — All players get same bingo card (same seed, same phrases)
- **Role:** Host (Tab 1) + 3 Guests (Tabs 2–4)
- **Steps:**
  1. After Task 7, all tabs show GameScreen.
  2. On each tab, read the 24 non-free phrases on the card (row by row, left to right, top to bottom).
  3. Compare phrase lists across all 4 tabs.
- **Pass:** All 4 cards have identical phrases in identical positions. The center cell (row 2, col 2) is "FREE" on all. This validates that `generateCard(teamCode, playerName, dateISO, theme, customPhrases, seed)` produces the same grid when given the same seed, regardless of `playerName`. *(Note: current code includes `playerName` in the seed string when no numeric seed is provided, but `handleStartGame` passes `Date.now()` as seed, which overrides this.)*

### Task 9 — Timer starts simultaneously for all players
- **Role:** Host (Tab 1) + 3 Guests (Tabs 2–4)
- **Steps:**
  1. After Task 7, note the elapsed time display on each tab.
  2. Wait 5 seconds, then compare times.
- **Pass:** All 4 tabs show approximately the same elapsed time (within ±2 s). The timer is local (`startTime = Date.now()` set during `startGame`), so they should be close since `GAME_START` is near-simultaneous. No tab shows "0:00" stuck or wildly different time.

### Task 10 — No errors in console during transition
- **Role:** All 4 tabs
- **Steps:**
  1. Open DevTools console on each tab before starting the game.
  2. Host clicks Start Game.
  3. Wait 3 seconds after all tabs transition.
  4. Check console on each tab for errors (filter: `error` level).
- **Pass:** No `PeerJS error`, `Connection error`, `Unhandled promise rejection`, or Vue warnings in any console. `console.log('Host peer opened:')` and `console.log('Client peer opened:')` messages are expected (debug level).

---

## C. Marking Sync (5 tasks)

### Task 11 — Guest marks square → host sees mark appear
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Both on GameScreen from Task 7.
  2. Tab 2 (GuestA): Click an unmarked square (e.g., row 0, col 0).
  3. `handleToggleMark` → `toggleMark` → `broadcastMarkUpdate(0, 0, true)`.
  4. Tab 1 (Host): Check the same square visually.
- **Pass:** Host sees the square at row 0, col 0 become marked (blue/highlighted) within ~1 s. The `MARK_UPDATE` event was received and `handleRemoteMarkUpdate` set `cell.marked = true`.

### Task 12 — Host marks square → all guests see mark appear
- **Role:** Host (Tab 1) + 3 Guests (Tabs 2–4)
- **Steps:**
  1. All on GameScreen.
  2. Tab 1 (Host): Click an unmarked square (e.g., row 1, col 1).
  3. `broadcastMarkUpdate` sends to all connections.
  4. Check Tabs 2, 3, 4 for the same square.
- **Pass:** All 3 guest tabs show the square at row 1, col 1 as marked within ~1 s. This validates host→client broadcast via `sendToPeers`.

### Task 13 — Marks count syncs across all players
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Both on GameScreen.
  2. Tab 2: Mark 3 different squares.
  3. Tab 1: Mark 2 different squares.
  4. Check the "X marked" counter on both tabs.
- **Pass:** Each tab's `marksCount` reflects its own marks (Tab 2 shows 3, Tab 1 shows 2). **Note:** The current code does NOT sync `marksCount` across peers — it only syncs individual cell marks. The sidebar thumbnails show other players' marks via `PlayerBoardThumbnail`, but `marksCount` in the stats bar is local. This task verifies that local marks count is correct and that remote marks appear in the sidebar thumbnails.

### Task 14 — Multiple players marking simultaneously → no conflicts
- **Role:** Host (Tab 1) + 3 Guests (Tabs 2–4)
- **Steps:**
  1. All on GameScreen.
  2. Within ~1 s, all 4 tabs click different squares simultaneously:
     - Tab 1: row 0, col 0
     - Tab 2: row 0, col 1
     - Tab 3: row 0, col 2
     - Tab 4: row 0, col 3
  3. Wait 3 seconds.
  4. Check all 4 tabs: each should show all 4 marks.
- **Pass:** All 4 tabs eventually show all 4 marks (row 0, cols 0–3). No marks are lost or duplicated. No console errors. This validates that concurrent `MARK_UPDATE` events don't conflict (last-write-wins on `cell.marked`).

### Task 15 — Unmark syncs correctly (toggle works for all)
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Both on GameScreen. Guest A marks row 0, col 0 (Task 11 already done).
  2. Tab 2: Click the same square again to unmark it.
  3. `broadcastMarkUpdate(0, 0, false)` is sent.
  4. Tab 1: Check the square.
- **Pass:** Host sees the square return to unmarked state. The `MARK_UPDATE` with `marked: false` was correctly handled by `handleRemoteMarkUpdate`, setting `cell.marked = false`.

---

## D. Bingo Detection (4 tasks)

### Task 16 — Guest gets bingo → host sees notification/toast
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Both on GameScreen.
  2. Tab 2 (GuestA): Mark all 5 squares in a row (e.g., row 0, cols 0–4).
  3. On the 5th mark, `checkBingo` detects a row win → phase becomes `WON` → `broadcastBingo('GuestA', 'row')` fires.
  4. Tab 1 (Host): Check for toast notification at bottom-right.
- **Pass:** Host sees a green toast message: "GuestA got BINGO! 🎉" that auto-dismisses after 3 seconds. The `handlePeerBingo` function sets `toastMessage` and triggers `burstConfetti()` + `playBingoSound()`.

### Task 17 — Host gets bingo → all guests see notification
- **Role:** Host (Tab 1) + 3 Guests (Tabs 2–4)
- **Steps:**
  1. All on GameScreen.
  2. Tab 1 (Host): Mark all 5 squares in a row.
  3. On the 5th mark, `broadcastBingo('Host1', 'row')` fires.
  4. Check Tabs 2, 3, 4 for toast notification.
- **Pass:** All 3 guest tabs show the toast "Host1 got BINGO! 🎉" with confetti burst and bingo sound. Each guest's `handlePeerBingo` is triggered.

### Task 18 — Win overlay shows for winner only (not all players)
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Both on GameScreen.
  2. Tab 2 (GuestA): Complete a row to get bingo.
  3. Tab 2: Phase changes to `WON` → `WinOverlay` appears.
  4. Tab 1: Phase remains `PLAYING` (host didn't win).
- **Pass:** Only Tab 2 shows the `WinOverlay` (the full-screen overlay with "BINGO!" heading, victory message, and "Keep Playing" button). Tab 1 shows only the toast notification — no overlay. The `WON` phase is local to the winning player; other players stay in `PLAYING` phase.

### Task 19 — Confetti plays for winner; others see notification only
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Both on GameScreen.
  2. Tab 2 (GuestA): Complete a row to get bingo.
  3. Tab 2: Confetti canvas activates (`showConfetti` computed = true).
  4. Tab 1: Check for confetti canvas visibility.
- **Pass:** Tab 2 shows confetti animation (canvas overlay visible). Tab 1 does **not** show confetti — it only shows the toast notification. The `burstConfetti()` call in `handlePeerBingo` triggers a brief confetti burst on the receiving tab, but the persistent confetti canvas (`v-show="showConfetti"`) only shows when `gameState.phase === 'WON'`, which is local.

---

## E. Game End + Continue (4 tasks)

### Task 20 — Host clicks End Game → all return to lobby
- **Role:** Host (Tab 1) + 3 Guests (Tabs 2–4)
- **Steps:**
  1. All on GameScreen (or some in WON state).
  2. Tab 1 (Host): Click **End Game** button in header.
  3. `handleEndGame` → `endGame()` (sets phase to `LOBBY`) + `networking.endGame()` (broadcasts `GAME_END`).
  4. Guests receive `GAME_END` → `handleRemoteGameEnd` → `endGame()`.
  5. Check all 4 tabs.
- **Pass:** All 4 tabs return to the LobbyScreen. The game grid is cleared (`grid = []`), marks count reset, timer reset. No console errors.

### Task 21 — Keep Playing → winner continues, others can still mark
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Tab 2 (GuestA): Get a bingo (complete a row). WinOverlay appears.
  2. Tab 2: Click **Keep Playing** button.
  3. `handleContinue` sets `gameState.phase = 'PLAYING'` (not `FINISHED`).
  4. Tab 2: Mark another square.
  5. Tab 1: Check if the new mark appears.
- **Pass:** After clicking "Keep Playing", Tab 2 returns to the game screen (phase = `PLAYING`). The existing marks and bingo count are preserved. New marks sync to the host. The game continues without resetting.

### Task 22 — Team code preserved after End Game (no re-enter)
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Both in lobby after Task 20.
  2. Tab 1: Check that the team code field is pre-filled with `TEST1`.
  3. Tab 2: Check that the team code field is pre-filled with `TEST1`.
  4. Verify the `inRoom` computed is true (lobby form is shown, not join form).
- **Pass:** Both tabs show the lobby (player list, ready toggle, etc.) — not the join form. `gameState.teamCode` is preserved (`'TEST1'`). The `watch` on `gameState.phase` in LobbyScreen syncs `teamCode` and `playerName` from gameState. No re-entering required.

### Task 23 — New round can start without rejoining
- **Role:** Host (Tab 1) + Guest A (Tab 2)
- **Steps:**
  1. Both in lobby after End Game (Task 20/22).
  2. Tab 1 (Host): Click **Start Game** again.
  3. Both tabs transition to GameScreen.
  4. Verify new card is generated (different phrases from previous round since seed = `Date.now()`).
  5. Mark a square on Tab 2, verify it syncs to Tab 1.
- **Pass:** Both tabs show a new game screen with a fresh bingo card. Marks sync correctly. The PeerJS connections are still active (not destroyed on `endGame`), so no reconnection is needed. The `lobbyGamePhase` resets to `'PLAYING'` on the host side.

---

## Appendix: Key Code Paths for Reference

| Event | Sender | Broadcast Method | Receiver Handler |
|-------|--------|-------------------|------------------|
| `JOIN` | Guest | `sendToPeers` | `handleJoin` → `addPlayer` + `broadcastPlayerList` |
| `PLAYER_LIST` | Host | `broadcast` → `sendToPeers` | `networkPlayers.value = data.players` |
| `PLAYER_READY` | Any | `sendToPeers` | `handlePlayerReady` → update `player.ready` |
| `GAME_START` | Host | `broadcastGameStart` | `handleRemoteGameStart` → `generateCard` + `startGame` |
| `MARK_UPDATE` | Any | `broadcastMarkUpdate` → `sendToPeers` | `handleRemoteMarkUpdate` → `cell.marked = marked` |
| `BINGO` | Winner | `broadcastBingo` → `sendToPeers` | `handlePeerBingo` → toast + confetti + sound |
| `GAME_END` | Host | `broadcastGameEnd` | `handleRemoteGameEnd` → `endGame()` |
| `HOST_TRANSFER` | Host | `broadcastHostTransfer` | `handleRemoteHostTransfer` → `setHostPeerId` |
| `CUSTOM_PHRASES` | Host | `broadcastCustomPhrases` | `handleRemoteCustomPhrases` → `setCustomPhrases` |

## Appendix: Bug Risks & Edge Cases

1. **Seed determinism:** `generateCard` uses `playerName` in seed when no numeric seed is given. With `GAME_START`, a numeric seed is broadcast, so all players get the same card. But if `playerName` differs, the host's local card (generated before broadcast) uses the seed, while guests use the same seed — this should match. ✅
2. **Race condition on join:** Guest sends `JOIN` immediately after `conn.on('open')`. Host may not have finished setup. The 1 s timeout in `handleJoin` mitigates this. ⚠️
3. **`sendToPeers` vs `broadcast`:** `broadcast` only sends if `isHost.value`. Guests use `sendToPeers` directly for `PLAYER_READY` and `BINGO`. This means guest→host messages work, but guest→guest messages go through the host (host must rebroadcast). Currently, `MARK_UPDATE` from a guest only goes to the host (since `sendToPeers` sends to all connections, which for a guest is only the host). The host does NOT rebroadcast marks. ⚠️ **Bug: Guest marks are only seen by the host, not by other guests.**
4. **`broadcastPlayerList` after `PLAYER_READY`:** When a guest toggles ready, `toggleReady` calls both `broadcastPlayerReady` and `broadcastPlayerList`. The `broadcastPlayerList` is a host-only broadcast, so it won't fire for guests. ⚠️ **Bug: Ready state may not propagate to other guests.**
5. **Connection dedup:** `setupConnection` checks for existing connections by `conn.peer` and closes duplicates. This prevents double-connections. ✅
6. **Host disconnect:** `handleHostDisconnect` auto-transfers host to the oldest remaining player. This is untested in the 23 tasks but noted. ⚠️