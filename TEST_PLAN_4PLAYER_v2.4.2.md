# Standup Bingo v2.4.2 — 4-Player Test Plan Decomposition

**Purpose:** Atomic test tasks for 4-player lobby testing. Each task is 1–2 min, manually executable with 4 browser tabs.  
**Setup:** 4 browser tabs. Tab 1 = Host, Tabs 2–4 = Guests (A, B, C). All use same team code + date.  
**Room ID:** `{TEAMCODE}-{YYYY-MM-DD}` (e.g., `QA42-2026-05-20`)  
**PeerJS:** Default cloud broker. Host peer ID = room ID.

> **DO NOT execute yet** — Mickey will orchestrate after Byte's fixes are complete.

---

## Task 1 — 4 Players Join Lobby Successfully

| Field | Detail |
|-------|--------|
| **Scenario** | 4-player lobby setup |
| **Steps** | 1. Tab 1: Enter team code `QA42`, name `Host1`, click **Join Room**. Wait ~1.5s for PeerJS `open`. 2. Tab 2: Join as `GuestA` with same team code. 3. Tab 3: Join as `GuestB`. 4. Tab 4: Join as `GuestC`. 5. Wait ~2s after each join. |
| **Expected** | All 4 tabs show the lobby (not stuck on join form). No console errors. Each tab's player list shows all 4 players. |
| **Pass** | ✅ All 4 tabs display "4 players in room" with names: Host1 (Host badge), GuestA, GuestB, GuestC. No tab shows "0 players" or is stuck on join form. |
| **Fail** | ❌ Any tab stuck on join form, shows wrong player count, or has console errors. |

---

## Task 2 — Host Badge Visible Only on Host Player Card

| Field | Detail |
|-------|--------|
| **Scenario** | 4-player lobby setup |
| **Steps** | 1. All 4 tabs in lobby (from Task 1). 2. On each tab, check the player list. 3. Verify only Host1's card shows the Host badge. |
| **Expected** | Host badge (icon + text) appears on Host1's card on all 4 tabs. GuestA/B/C cards never show the badge. |
| **Pass** | ✅ Host badge appears exclusively on Host1 across all tabs. No guest card has the badge. |
| **Fail** | ❌ Host badge missing, appears on a guest, or appears on multiple players. |

---

## Task 3 — Shared Board Mode: Host Sets Seed, All See Same Board Preview

| Field | Detail |
|-------|--------|
| **Scenario** | Shared board mode |
| **Steps** | 1. All 4 tabs in lobby. 2. Tab 1 (Host): Set **Board Sharing** to **"Shared"**. 3. Tab 1: Enter a seed value (e.g., `12345`) in the seed input. 4. Tab 1: Verify the board preview updates. 5. On Tabs 2–4: Check if the board preview (or shared board indicator) reflects the same seed/board. |
| **Expected** | When board sharing = "shared" and a seed is set, all 4 players should see the same board preview. The lobby shows "(Shared board)" indicator. All players' preview cards have identical phrases in identical positions. |
| **Pass** | ✅ All 4 tabs show identical board preview (same 24 phrases, same positions). "(Shared board)" label visible. |
| **Fail** | ❌ Any player sees a different board, or shared indicator is missing/inconsistent. |

---

## Task 4 — Separate Board Mode: Each Player Sees Own Board + Can View Others

| Field | Detail |
|-------|--------|
| **Scenario** | Separate board mode |
| **Steps** | 1. All 4 tabs in lobby. 2. Tab 1 (Host): Set **Board Sharing** to **"Separate"**. 3. Verify each tab shows a different board preview (different phrases/arrangement). 4. On any tab, click another player's avatar/thumbnail to view their board. |
| **Expected** | Each of the 4 players gets a unique board (different phrase arrangement). The "Each player gets random board" subtitle is shown. Players can view other players' boards via `PlayerBoardThumbnail` → `PlayerBoardModal`. |
| **Pass** | ✅ All 4 boards are different from each other. Clicking another player's thumbnail opens a modal showing their board. "(Separate boards)" label visible. |
| **Fail** | ❌ Any two players have identical boards, or viewing another player's board fails/shows wrong board. |

---

## Task 5 — Only Host Can Start Game; Guests See No Start Button

| Field | Detail |
|-------|--------|
| **Scenario** | Host controls |
| **Steps** | 1. All 4 tabs in lobby. 2. Tab 1 (Host): Verify **Start Game** button is visible and enabled. 3. Tabs 2–4 (Guests): Verify **Start Game** button is NOT visible or is disabled. |
| **Expected** | Only the host tab shows an active Start Game button. Guest tabs either hide the button or show it disabled/grayed out. |
| **Pass** | ✅ Start Game button visible and clickable only on Tab 1. Tabs 2–4 have no active Start Game button. |
| **Fail** | ❌ Any guest can click Start Game, or host's Start Game button is missing/disabled. |

---

## Task 6 — Host Transfer Works: New Host Gets Controls

| Field | Detail |
|-------|--------|
| **Scenario** | Host controls |
| **Steps** | 1. All 4 tabs in lobby. 2. Tab 1 (Host): Click **Transfer Host** on GuestA's player card. 3. Wait ~2s for `HOST_TRANSFER` event. 4. Check Tab 2 (GuestA → now Host): Should show Host badge + Start Game button. 5. Check Tab 1 (former Host): Should now show as guest (no Host badge, no Start Game). 6. Check Tabs 3–4: Player list should reflect HostA as new host. |
| **Expected** | Host transfers to GuestA. GuestA's tab gets the Host badge and Start Game button. Former host becomes a guest. All tabs reflect the change. `HOST_TRANSFER` event propagates correctly. |
| **Pass** | ✅ GuestA now shows Host badge + Start Game. Former host shows as guest. All 4 tabs agree on who is host. |
| **Fail** | ❌ Transfer doesn't propagate, host badge is duplicated, or former host retains Start Game button. |

---

## Task 7 — All 4 Players Toggle Ready; Host Sees All Statuses

| Field | Detail |
|-------|--------|
| **Scenario** | Ready sync |
| **Steps** | 1. All 4 tabs in lobby. 2. Tab 2 (GuestA): Click **Toggle Ready**. 3. Tab 3 (GuestB): Click **Toggle Ready**. 4. Tab 4 (GuestC): Click **Toggle Ready**. 5. Tab 1 (Host): Check player list — verify GuestA/B/C show "Ready" status. 6. Tab 2: Toggle Ready again (unready). 7. Tab 1: Verify GuestA shows "Not Ready". |
| **Expected** | Each guest can toggle ready/unready. Host sees real-time ready status for all players. Ready state syncs via `PLAYER_READY` + `broadcastPlayerList`. |
| **Pass** | ✅ Host sees 3 guests as Ready after step 4. After step 6, Host sees GuestA as Not Ready, GuestB/C still Ready. All status changes propagate within ~2s. |
| **Fail** | ❌ Ready states don't sync, host sees stale/wrong statuses, or guest→guest ready state is missing. |

---

## Task 8 — Game Start: All 4 Players' Boards Generate Correctly

| Field | Detail |
|-------|--------|
| **Scenario** | Game start |
| **Steps** | 1. All 4 tabs in lobby. 2. Set board sharing to **Shared** with seed `99999`. 3. Tab 1 (Host): Click **Start Game**. 4. Wait ~2s for `GAME_START` broadcast. 5. All 4 tabs: Verify phase = `PLAYING`, 5×5 bingo grid is visible. 6. Compare all 4 boards: read 24 phrases from each. |
| **Expected** | All 4 tabs transition to GameScreen. In shared mode with same seed, all 4 boards are identical (same 24 phrases, same positions, center = FREE). Timer starts on all tabs. |
| **Pass** | ✅ All 4 tabs show GameScreen with identical boards. No tab stuck on lobby. No console errors. |
| **Fail** | ❌ Any tab doesn't transition, boards differ, or console errors appear. |

---

## Task 9 — Game Start: Separate Boards — Each Player Gets Unique Card

| Field | Detail |
|-------|--------|
| **Scenario** | Game start |
| **Steps** | 1. All 4 tabs in lobby (fresh room or after End Game). 2. Set board sharing to **Separate**. 3. Tab 1 (Host): Click **Start Game**. 4. Wait ~2s. 5. All 4 tabs: Read the 24 phrases from each board. 6. Compare: all 4 boards should be different. |
| **Expected** | All 4 tabs show GameScreen. Each player has a unique board (different phrase arrangement). In separate mode, `playerName` is part of the seed, so different names → different boards. |
| **Pass** | ✅ All 4 boards are different from each other. Each board is a valid 5×5 grid with 24 phrases + FREE center. |
| **Fail** | ❌ Any two boards are identical, or any board is invalid/empty. |

---

## Task 10 — Marking Sync: Shared Board — All Players See Same Marks

| Field | Detail |
|-------|--------|
| **Scenario** | Marking sync (shared board) |
| **Steps** | 1. All 4 tabs on GameScreen, shared board mode (from Task 8). 2. Tab 2 (GuestA): Click an unmarked square (e.g., row 0, col 0). 3. Wait ~1s. 4. Check Tabs 1, 3, 4: the same square should appear marked. 5. Tab 1 (Host): Click a different square (e.g., row 1, col 1). 6. Check Tabs 2, 3, 4: that square should appear marked. |
| **Expected** | In shared board mode, marks from any player propagate to all other players. `MARK_UPDATE` events broadcast via `sendToPeers` and host rebroadcasts. All players see the same marked squares. |
| **Pass** | ✅ All 4 tabs show both marked squares (row 0 col 0 + row 1 col 1) within ~2s. No marks are lost. |
| **Fail** | ❌ Marks only visible to host (guest→guest not rebroadcast), marks lost, or delayed >5s. |

---

## Task 11 — Marking Sync: Separate Boards — Marks Stay Local

| Field | Detail |
|-------|--------|
| **Scenario** | Marking sync (separate boards) |
| **Steps** | 1. All 4 tabs on GameScreen, separate board mode (from Task 9). 2. Tab 2 (GuestA): Click a square to mark it. 3. Check Tab 1 (Host): GuestA's mark should appear in the sidebar thumbnail (`PlayerBoardThumbnail`), NOT on the host's own board. 4. Tab 1: Click a square on own board. 5. Check Tab 2: Host's mark should appear in sidebar thumbnail, not on GuestA's board. |
| **Expected** | In separate board mode, each player's marks are local to their own board. Other players' marks are visible only via the sidebar thumbnail/modal, not overlaid on the active board. |
| **Pass** | ✅ Each player's marks appear only on their own board. Other players' marks visible in sidebar thumbnails only. No cross-contamination of marks between boards. |
| **Fail** | ❌ Marks appear on wrong player's board, or sidebar thumbnails don't update. |

---

## Task 12 — Bingo Detection: Each Player's Bingo Is Detected and Announced

| Field | Detail |
|-------|--------|
| **Scenario** | Bingo detection |
| **Steps** | 1. All 4 tabs on GameScreen (shared or separate mode). 2. Tab 2 (GuestA): Mark all 5 squares in a row (e.g., row 0, cols 0–4). 3. On 5th mark, verify: Tab 2 shows WinOverlay + confetti. 4. Check Tabs 1, 3, 4: toast notification "GuestA got BINGO! 🎉" appears. 5. Tab 1 (Host): Mark a full row. 6. Check Tabs 2, 3, 4: toast "Host1 got BINGO! 🎉". 7. Tab 1: Verify WinOverlay appears. |
| **Expected** | When any player completes a row/col/diagonal, `checkBingo` detects it. Winner sees WinOverlay + persistent confetti. All other players see toast notification + brief confetti burst. `BINGO` event broadcasts via `broadcastBingo`. |
| **Pass** | ✅ GuestA's bingo triggers WinOverlay on Tab 2 + toast on all other tabs. Host's bingo triggers WinOverlay on Tab 1 + toast on guest tabs. Confetti appears for winner. Sound plays. |
| **Fail** | ❌ Bingo not detected, toast not shown on other tabs, or WinOverlay appears on non-winning tabs. |

---

## Task 13 — Performance: No Lag With 4 Players in Lobby

| Field | Detail |
|-------|--------|
| **Scenario** | Performance |
| **Steps** | 1. All 4 tabs in lobby. 2. Rapidly toggle ready on all 4 tabs (within ~2s). 3. Observe UI responsiveness on each tab. 4. Start game. 5. Rapidly mark squares on all 4 tabs simultaneously. 6. Check for UI jank, delayed updates, or frozen state. |
| **Expected** | All UI interactions respond within 500ms. No tab freezes. Ready toggles and mark updates propagate within ~2s. No excessive CPU/memory usage. |
| **Pass** | ✅ All interactions feel smooth. Updates propagate within 2s. No console errors about PeerJS timeouts or connection drops. |
| **Fail** | ❌ Any tab freezes >2s, updates take >5s to propagate, or PeerJS connection drops. |

---

## Task 14 — Mobile Responsive: 4-Player Lobby Works on 375px Viewport

| Field | Detail |
|-------|--------|
| **Scenario** | Mobile responsive |
| **Steps** | 1. Resize all 4 tabs to 375×812 (iPhone SE viewport). 2. Tab 1: Join as Host. 3. Tabs 2–4: Join as guests. 4. Verify: join form is usable (inputs visible, buttons tappable). 5. Verify: player list is readable (cards stack vertically, names visible). 6. Verify: board sharing toggle and seed input are accessible. 7. Start game. 8. Verify: bingo card grid fits viewport, squares are tappable. |
| **Expected** | All lobby controls are accessible and readable at 375px. Player cards stack or scroll. Board sharing toggle and seed input are visible. Bingo card grid scales down but remains tappable. No horizontal overflow. |
| **Pass** | ✅ All UI elements visible and usable at 375px. No horizontal scroll. Bingo card squares are at least 44×44px (touch target). Player list readable. |
| **Fail** | ❌ Any element overflows, is clipped, or is too small to tap. Horizontal scroll appears. Text is unreadable. |

---

## Task 15 — End Game + New Round Without Rejoining

| Field | Detail |
|-------|--------|
| **Scenario** | Game start (round trip) |
| **Steps** | 1. All 4 tabs on GameScreen (from any prior task). 2. Tab 1 (Host): Click **End Game**. 3. Wait ~2s. 4. All 4 tabs: Verify return to LobbyScreen. 5. Tab 1: Click **Start Game** again. 6. All 4 tabs: Verify transition to new GameScreen with fresh board. 7. Mark a square on Tab 2, verify sync to Tab 1. |
| **Expected** | End Game broadcasts `GAME_END` → all tabs return to lobby. Team code is preserved. PeerJS connections remain active. New round starts without rejoining. New board is generated (different seed = `Date.now()`). Marks sync in new round. |
| **Pass** | ✅ All 4 tabs return to lobby after End Game. New round starts with fresh board. Marks sync. No reconnection needed. No console errors. |
| **Fail** | ❌ Any tab stuck on GameScreen, requires rejoining, or PeerJS connection drops between rounds. |

---

## Summary Matrix

| # | Test Name | Scenario Covered | Duration |
|---|-----------|-------------------|----------|
| 1 | 4 Players Join Lobby Successfully | 4-player lobby setup | ~1 min |
| 2 | Host Badge Visible Only on Host | 4-player lobby setup | ~30s |
| 3 | Shared Board: Same Seed → Same Preview | Shared board mode | ~1 min |
| 4 | Separate Board: Unique Boards + View Others | Separate board mode | ~1.5 min |
| 5 | Only Host Can Start Game | Host controls | ~30s |
| 6 | Host Transfer: New Host Gets Controls | Host controls | ~1.5 min |
| 7 | All 4 Players Toggle Ready | Ready sync | ~1 min |
| 8 | Game Start: Shared Boards Identical | Game start | ~1.5 min |
| 9 | Game Start: Separate Boards Unique | Game start | ~1.5 min |
| 10 | Marking Sync: Shared Board | Marking sync | ~1.5 min |
| 11 | Marking Sync: Separate Boards | Marking sync | ~1.5 min |
| 12 | Bingo Detection + Announcement | Bingo detection | ~2 min |
| 13 | Performance: No Lag 4 Players | Performance | ~1.5 min |
| 14 | Mobile Responsive 375px | Mobile responsive | ~2 min |
| 15 | End Game + New Round | Game start (round trip) | ~1.5 min |

**Total: 15 tasks, ~18 min estimated execution time**

---

## Known Bug Risks (from prior test plan v2.2.6)

1. **Guest→Guest mark sync:** In shared board mode, `MARK_UPDATE` from a guest only goes to the host (guest's `sendToPeers` only has 1 connection = host). Host does NOT rebroadcast marks. ⚠️ **Shared board marking may be broken for guest→guest.**
2. **Ready state guest→guest:** `broadcastPlayerList` is host-only. Guest toggling ready sends `PLAYER_READY` to host, but host may not rebroadcast to other guests. ⚠️ **Ready state may not propagate to all guests.**
3. **Race condition on join:** Guest sends `JOIN` immediately after `conn.on('open')`. Host may not have finished setup. 1s timeout mitigates but doesn't eliminate.
4. **Host disconnect:** Auto-transfer to oldest remaining player — untested in this plan (would need Tab 1 close).