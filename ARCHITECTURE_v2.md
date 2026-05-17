# Standup Bingo v2 — Multiplayer Sync Architecture

## Strategy: Manual Sync with Shareable State Blobs

**Why this over GitHub Gist polling?**

| Factor | Manual Sync | GitHub Gist |
|--------|-------------|-------------|
| Firewall-proof | ✅ Always | ⚠️ github.com may be blocked |
| Auth required | ❌ None | ✅ Personal access token per player |
| Latency | 0s (instant) | 5–10s polling delay |
| Setup friction | Copy/paste | Generate tokens, distribute, store |
| Failure modes | None infra | Rate limits, token expiry, CORS |
| Works offline | ✅ | ❌ |

Corporate firewalls routinely block GitHub API. Token distribution to non-devs is painful. A bingo event is social — the "I got it!" moment naturally triggers sharing. One copy + one paste per event is negligible effort.

---

## Sync Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        GAME HOST                            │
│  1. Creates game → generates Game ID + Board Seed           │
│  2. Shares join link: bingo.html?game=ABC123               │
│  3. Clicks "Start Game" → copies START blob to chat         │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                     ALL PLAYERS                             │
│                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                 │
│  │ Player A │    │ Player B │    │ Player C │                │
│  │ (Host)   │    │          │    │          │                │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘                │
│       │               │               │                      │
│       │  Marks cell   │               │                      │
│       │  locally      │               │                      │
│       ▼               │               │                      │
│  ┌──────────┐         │               │                      │
│  │ BINGO!   │         │               │                      │
│  └────┬─────┘         │               │                      │
│       │               │               │                      │
│       ▼               │               │                      │
│  ┌──────────────────────────────────┐                       │
│  │ "Copy Bingo Event" → clipboard   │                       │
│  │ (one click, auto-copied)         │                       │
│  └──────────────┬───────────────────┘                       │
│                 │                                          │
│       ┌─────────▼──────────┐                               │
│       │  Team Chat / Slack  │  ← paste blob                │
│       │  / Teams / Email    │                               │
│       └────┬────────┬───────┘                               │
│            │        │                                      │
│            ▼        ▼                                      │
│  ┌─────────────┐ ┌─────────────┐                           │
│  │ Player B:   │ │ Player C:   │                           │
│  │ Click "Sync"│ │ Click "Sync"│                           │
│  │ Paste blob  │ │ Paste blob  │                           │
│  │ → See bingo │ │ → See bingo │                           │
│  └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Structure

### Blob Format (Base64-encoded JSON, URL-safe)

```jsonc
// Decoded blob structure
{
  "v": 2,                          // schema version
  "gameId": "ABC123",              // shared game identifier
  "seed": 42,                      // board seed (for deterministic boards)
  "type": "bingo",                 // "start" | "bingo" | "sync" | "state"
  "player": {
    "id": "p7a8",                  // anonymous player ID (random, local)
    "name": "Alice"                // display name (optional)
  },
  "timestamp": 1714435200000,     // ms since epoch
  "payload": {
    // type="start" → empty
    // type="bingo" →
    "cells": [3, 7, 14, 21],      // 0-indexed cell positions that form the bingo
    "pattern": "row",              // "row" | "col" | "diag" | "four_corners" | "full"
    "boardHash": "a1b2c3"         // SHA-256 of board (for verification)
  }
}
```

### Encoded Blob Example

```
bingo://eyJ2IjoyLCJnYW1lSWQiOiJBQkMxMjMiLC...
```

Prefix `bingo://` makes blobs clickable in Slack/Teams. The rest is base64url-encoded JSON.

---

## Event Types

| Type | Trigger | Who Sends | Who Receives | Payload |
|------|---------|-----------|--------------|---------|
| `start` | Host clicks "Start Game" | Host | All players | gameId, seed, board config |
| `bingo` | Player gets bingo | Winner | All players | winning cells, pattern, boardHash |
| `sync` | Any player wants full state | Any player | Requester | full game state (all events) |
| `state` | Periodic full-state snapshot | Host (optional) | Any requester | all bingos so far, player list |

---

## Sync Mechanics

### Copy Flow (Sender)

```
1. Player marks cells locally → saved to localStorage immediately
2. Player hits "BINGO!" button
3. App validates: cells form a valid pattern on their board
4. App generates blob → copies to clipboard automatically
5. Toast: "Bingo event copied! Paste it in team chat."
```

### Paste Flow (Receiver)

```
1. Player sees blob in chat
2. Clicks "Sync" button in app (or pastes directly into sync input)
3. App decodes blob, validates:
   - gameId matches current game
   - boardHash matches (same seed = same board)
   - timestamp is within game window
4. App merges event into local state:
   - Adds bingo event to event log
   - Highlights winner's cells on board
   - Shows "🎉 Alice got BINGO!" notification
5. If blob is stale or invalid → shows "Sync data is from a different game"
```

### Merge Rules

```js
function mergeEvent(localState, incomingEvent) {
  // Deduplicate by player ID + type
  const existing = localState.events.find(
    e => e.player.id === incomingEvent.player.id
      && e.type === incomingEvent.type
  );

  if (existing) {
    // Keep earliest timestamp (first to claim wins)
    if (incomingEvent.timestamp < existing.timestamp) {
      Object.assign(existing, incomingEvent);
    }
    return; // no duplicate
  }

  localState.events.push(incomingEvent);
  localState.events.sort((a, b) => a.timestamp - b.timestamp);
}
```

---

## Late Joiners

```
Scenario: Player D joins 5 minutes into the game.
          Players A and B already got bingo.

1. Player D opens join link → gets same gameId + seed
2. Board is generated deterministically from seed → same board as everyone
3. Player D's app shows empty event log (no bingos visible yet)

4. SOLUTION: "Catch Up" flow
   a. Host (or any player) clicks "Export State"
   b. Generates a "state" blob containing ALL events so far
   c. Pastes in chat
   d. Player D clicks "Sync" → pastes → sees all prior bingos

5. Alternative: Player D asks in chat
   "Can someone share the current state?"
   → Any player can export + paste
```

### State Export Blob

```jsonc
{
  "v": 2,
  "gameId": "ABC123",
  "seed": 42,
  "type": "state",
  "player": { "id": "host", "name": "Game Host" },
  "timestamp": 1714435500000,
  "payload": {
    "events": [
      {
        "player": { "id": "p7a8", "name": "Alice" },
        "type": "bingo",
        "timestamp": 1714435200000,
        "cells": [3, 7, 14, 21],
        "pattern": "row"
      },
      {
        "player": { "id": "p2f1", "name": "Bob" },
        "type": "bingo",
        "timestamp": 1714435300000,
        "cells": [0, 6, 18, 24],
        "pattern": "diag"
      }
    ],
    "playerCount": 8
  }
}
```

---

## Broadcasting Bingo to All Players

Since there's no server, "broadcast" = **copy-once, paste-once**:

```
┌──────────────────────────────────────────────┐
│           BINGO BROADCAST FLOW                │
│                                              │
│  Winner's Browser                             │
│  ┌─────────────────────────────────────┐     │
│  │ 1. "BINGO!" button → auto-copy blob │     │
│  │ 2. Toast: "Paste in chat now!"      │     │
│  └──────────────┬──────────────────────┘     │
│                 │                             │
│                 ▼                             │
│         Team Chat Channel                     │
│  ┌─────────────────────────────────────┐     │
│  │ "bingo://eyJ2Ijoy..."               │     │
│  │ 🎉 Alice just got BINGO!            │     │
│  └────┬────────────┬────────────┬──────┘     │
│       │            │            │             │
│       ▼            ▼            ▼             │
│   Player B     Player C    Player D           │
│   clicks Sync  clicks Sync clicks Sync        │
│   → sees it    → sees it   → sees it          │
│                                              │
│  Total delay: ~5-15 seconds                  │
│  (time for winner to paste + others to sync) │
└──────────────────────────────────────────────┘
```

**Optimization: Auto-detect blob in clipboard**

```js
// On page focus / visibility change, check clipboard
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith('bingo://')) {
        showSyncPrompt(text); // "Bingo data detected! Import?"
      }
    } catch {
      // Clipboard API requires permission — fail silently
    }
  }
});
```

---

## Local State (per browser)

```js
// localStorage key: `bingo_${gameId}`
const localState = {
  gameId: "ABC123",
  seed: 42,
  myPlayerId: "p7a8",
  myName: "Alice",
  markedCells: [3, 7, 14, 21],     // cells I've marked
  events: [],                       // all received bingo events
  startedAt: 1714435200000,
  lastSyncAt: null                  // last time we imported a blob
};
```

---

## Verification (Anti-Cheat)

Bingo is a fun team game, not competitive esports. But basic validation prevents accidents:

1. **Board hash**: Each board is deterministic from `seed`. App recomputes hash on import.
2. **Cell validation**: Winning cells must actually form the claimed pattern on the board.
3. **Timestamp ordering**: Earlier bingo = higher rank. Can't backdate.
4. **No server = no enforcement**: Trust-based. If someone cheats at standup bingo, that's a HR issue. 😄

---

## Summary

| Concern | Solution |
|---------|----------|
| Sync mechanism | Copy blob → paste in chat → others import |
| Blob format | `bingo://` + base64url JSON |
| Latency | ~5-15s (human paste speed) |
| Late joiners | Any player exports full state blob |
| Broadcast | One copy, one paste, everyone syncs |
| Firewall | ✅ No external calls needed |
| Auth | ❌ None required |
| Offline | ✅ Works fully offline |
| Anti-cheat | Board hash + pattern validation |

**One rule: When you get bingo, paste the blob. That's it.**