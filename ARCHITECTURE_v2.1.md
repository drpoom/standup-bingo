# Standup Bingo v2.1 — Architecture: Host System + Custom Phrases

> **Delta spec** — builds on ARCHITECTURE_v2.md. Byte implements from this doc.

## 1. Host System State Machine

### States

```
┌─────────┐   create room    ┌─────────┐   host:start   ┌──────────┐
│  LOBBY  │ ───────────────► │  READY  │ ─────────────► │  PLAYING │
│         │                  │ (host   │                │          │
│         │                  │  only)  │                │          │
└─────────┘                  └─────────┘                └──────────┘
     ▲                                                      │
     │                    host:endGame                      │
     └──────────────────────────────────────────────────────┘
```

| State     | Who sees what                                              |
|-----------|-----------------------------------------------------------|
| `LOBBY`   | Landing page: rules, team code entry, player list, ready  |
| `READY`   | All players joined. Host sees **Start Game** button        |
| `PLAYING` | Bingo boards active. Host sees **End Game** button        |
| (reset)   | Returns to `LOBBY`; all boards cleared, players kept      |

### Host Assignment Rules

1. **First player** to successfully create the PeerJS room (i.e., `peer.on('open')` fires without error) is **host**.
2. Host identity stored in shared game state: `{ hostPeerId: string }`.
3. If host disconnects (`peer.on('close'` or connection lost for >5s), **auto-transfer** to the next-oldest player (ordered by join timestamp).
4. Host can **voluntarily transfer** via dropdown in settings panel.

### Host Transfer Protocol

```js
// Host sends transfer event
conn.send({
  type: 'HOST_TRANSFER',
  newHostPeerId: selectedPeerId,
  timestamp: Date.now()
})

// All peers update locally
gameState.hostPeerId = data.newHostPeerId
isHost = (myPeerId === data.newHostPeerId)
```

### Auto-Transfer on Disconnect

```js
// In useNetworking.js
peer.on('disconnection', (disconnectedPeerId) => {
  if (disconnectedPeerId === gameState.hostPeerId) {
    // Sort remaining players by joinTime, pick oldest
    const nextHost = players
      .filter(p => p.peerId !== disconnectedPeerId)
      .sort((a, b) => a.joinTime - b.joinTime)[0]
    if (nextHost) {
      gameState.hostPeerId = nextHost.peerId
      broadcast({ type: 'HOST_TRANSFER', newHostPeerId: nextHost.peerId })
    }
  }
})
```

---

## 2. PeerJS Message Types (v2.1 additions)

Existing v2.0 types: `JOIN`, `BINGO`, `MARK_UPDATE`

### New Message Types

```js
// ── Host-only actions (broadcast from host) ──

{ type: 'GAME_START', theme: string, seed: number, timestamp: number }
// Sent when host clicks "Start Game". All players generate boards from same seed+theme.

{ type: 'GAME_END', timestamp: number }
// Sent when host clicks "End Game". All players return to LOBBY.

{ type: 'HOST_TRANSFER', newHostPeerId: string, timestamp: number }
// Host delegates role to another player.

// ── Lobby events ──

{ type: 'PLAYER_READY', peerId: string, ready: boolean, timestamp: number }
// Player toggles their "Ready" status in lobby.

{ type: 'PLAYER_LIST', players: Array<PlayerInfo>, timestamp: number }
// Host broadcasts full player roster (on join/leave/ready change).

{ type: 'CUSTOM_PHRASES', phrases: CustomPhrasePayload, timestamp: number }
// Host broadcasts custom phrases after upload (so all players use same phrases).
```

### PlayerInfo Shape

```ts
interface PlayerInfo {
  peerId: string
  name: string
  joinTime: number      // Date.now() at join
  ready: boolean
  isHost: boolean
}
```

---

## 3. Lobby / Start Screen Flow

```
┌──────────────────────────────────────────────────┐
│                   LOBBY SCREEN                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  🎯 Standup Bingo                               │
│                                                  │
│  ┌─ HOW TO PLAY ──────────────────────────────┐  │
│  │ 1. Join a room with your team code         │  │
│  │ 2. Host starts the game                    │  │
│  │ 3. Mark squares when phrases come up       │  │
│  │ 4. Get 5 in a row → BINGO!                 │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  Team Code: [________]  Date: [2026-04-30]       │
│  Player Name: [________]                         │
│                                                  │
│  [▶ Join Room]                                   │
│                                                  │
│  ── Players in Room (4) ──────────────────────   │
│  👑 Alice  (Host)     ✅ Ready                   │
│     Bob               ⬜ Ready                   │
│     Carol             ✅ Ready                   │
│     Dave              ⬜ Ready                   │
│                                                  │
│  [Toggle Ready]                                  │
│                                                  │
│  ── Host Controls ─────────────────────────────   │
│  [🚀 Start Game]  [🛑 End Game]                  │
│  Transfer Host: [Bob ▼] [Transfer]               │
│  Upload Custom Phrases: [Choose File]            │
│  [Export Phrases]                                │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Lobby Components
`LobbyScreen.vue` → `HowToPlay`, `TeamCodeEntry`, `PlayerRoster`, `ReadyToggle`, `HostControls` (→ `HostTransfer`, `PhraseEditor`), `CustomPhrasePreview`

### Lobby Join Flow

```
1. Player enters team code + name
2. Player clicks "Join Room"
3. useNetworking() attempts peer.connect(roomId)
   ├─ SUCCESS → room exists, send JOIN event, receive PLAYER_LIST
   └─ FAIL (peer error) → create room as host, enter LOBBY
4. Player appears in roster
5. Player toggles Ready
6. Host clicks Start Game → GAME_START broadcast
7. All players transition to GameScreen
```

---

## 4. Custom Phrase System

### JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "StandupBingoCustomPhrases",
  "type": "object",
  "required": ["categories"],
  "properties": {
    "categories": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": { "type": "string", "minLength": 1 },
        "minItems": 1
      },
      "minProperties": 1
    }
  }
}
```

### Example

```json
{
  "categories": {
    "Inside Jokes": [
      "Mentioned the legacy COBOL system",
      "Coffee machine is broken again",
      "Someone said 'synergy' unironically"
    ],
    "Sprint Rituals": [
      "Sprint retro lasted over an hour",
      "Velocity chart went sideways",
      "PO changed priority mid-sprint"
    ]
  }
}
```

### Merge Logic

```js
function mergePhrases(themePhrases, customPhrases) {
  // themePhrases: string[] from selected theme
  // customPhrases: { categories: { [name]: string[] } }
  const customFlat = Object.values(customPhrases.categories).flat()
  // Deduplicate (case-insensitive)
  const seen = new Set(themePhrases.map(p => p.toLowerCase()))
  const uniqueCustom = customFlat.filter(p => !seen.has(p.toLowerCase()))
  return [...themePhrases, ...uniqueCustom]
}
```

### Storage & Transport

| Concern          | Implementation                                        |
|------------------|------------------------------------------------------|
| localStorage     | Key `standup-bingo:custom-phrases`, JSON string      |
| Upload           | `<input type="file" accept=".json">` → parse + validate |
| Export           | `Blob` → `URL.createObjectURL` → `<a download>`      |
| Broadcast        | Host uploads → `CUSTOM_PHRASES` event to all peers   |
| Validation       | Must match schema; reject with toast on error         |
| Persistence      | Loaded from localStorage on app start; overwritten on upload |

### PhraseEditor Flow
Upload → parse → validate schema → store localStorage + broadcast `CUSTOM_PHRASES`. Invalid → toast error. Export → download JSON. Non-host: read-only preview.

---

## 5. Sound Effects

### Design Principles

- **No external files** — all audio embedded as Base64 data URIs or generated via Web Audio API
- **Mute toggle** — global setting persisted in localStorage
- **Respectful** — subtle mark sound, celebratory bingo sound

### Implementation: Web Audio API (preferred)

```js
// composables/useSoundEffects.js

const audioCtx = ref(null)

function getAudioContext() {
  if (!audioCtx.value) audioCtx.value = new AudioContext()
  return audioCtx.value
}

// Mark sound: short sine blip (150ms, 880Hz, quick decay)
function playMarkSound() {
  if (isMuted.value) return
  const ctx = getAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 880
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.15)
}

// Bingo sound: ascending arpeggio (C5-E5-G5-C6, 600ms total)
function playBingoSound() {
  if (isMuted.value) return
  const ctx = getAudioContext()
  const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    const start = ctx.currentTime + i * 0.15
    gain.gain.setValueAtTime(0.2, start)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3)
    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 0.3)
  })
}
```

### Mute Toggle

```js
// localStorage key: 'standup-bingo:muted'
const isMuted = ref(localStorage.getItem('standup-bingo:muted') === 'true')

function toggleMute() {
  isMuted.value = !isMuted.value
  localStorage.setItem('standup-bingo:muted', isMuted.value)
}
```

### Where Sounds Trigger

| Event         | Sound       | Location                        |
|---------------|-------------|---------------------------------|
| Square marked | Mark blip   | `BingoCard.vue` → toggle handler |
| Bingo achieved| Arpeggio    | `useBingoCard.js` → bingo detect |
| Confetti      | (visual only)| `ConfettiCanvas.vue`           |

### Fallback: Base64 WAV
If Web Audio API unavailable, use pre-encoded data URIs in `data/sounds.js`:
`new Audio('data:audio/wav;base64,...').play()` with volume gated by `isMuted`.

---

## 6. Updated Component Tree (v2.1)

```
App.vue
├── useNetworking()       — PeerJS wrapper (updated: host logic, new events)
├── useGameState()        — State machine (LOBBY → PLAYING → LOBBY)
├── useBingoCard()        — Card generation (updated: custom phrase merge)
├── useSoundEffects()     — NEW: Web Audio sounds + mute toggle
├── LobbyScreen.vue       — NEW: pre-game lobby
│   ├── HowToPlay.vue
│   ├── TeamCodeEntry.vue
│   ├── PlayerRoster.vue
│   ├── ReadyToggle.vue
│   └── HostControls.vue
│       ├── HostTransfer.vue
│       └── PhraseEditor.vue    — NEW: upload/export custom phrases
├── GameScreen.vue
│   ├── BingoCard.vue          — Updated: mark sound on toggle
│   ├── PlayerBoardThumbnail.vue
│   ├── PlayerBoardModal.vue
│   ├── PlayerAvatar.vue
│   └── ConfettiCanvas.vue     — Existing
├── ThemePicker.vue
└── SettingsPanel.vue          — Updated: mute toggle added
```

---

## 7. Game State Shape (v2.1)

```ts
interface GameState {
  phase: 'LOBBY' | 'PLAYING'
  hostPeerId: string
  theme: string
  seed: number                    // shared board seed from host
  players: PlayerInfo[]
  customPhrases: CustomPhrases | null
  startedAt: number | null        // timestamp of GAME_START
}

interface CustomPhrases {
  categories: Record<string, string[]>
}
```

### State Transitions

```
LOBBY  ──GAME_START──► PLAYING
PLAYING ──GAME_END───► LOBBY (boards cleared, players kept, host unchanged)
```

On `GAME_START`: host generates a `seed` (e.g., `Date.now()`) and broadcasts it. All players call `generateCard(teamCode, playerName, seed, theme, customPhrases)` — deterministic board generation ensures fair play.

On `GAME_END`: all players clear their boards and return to lobby. Player list and host assignment persist.

---

## 8. Files to Update

| File                     | Change                                                  |
|--------------------------|---------------------------------------------------------|
| `useNetworking.js`       | Add HOST_TRANSFER, GAME_START, GAME_END, PLAYER_READY, PLAYER_LIST, CUSTOM_PHRASES handlers; auto-transfer logic |
| `useGameState.js`        | Add `phase` state machine, `hostPeerId`, `customPhrases`, `seed` |
| `useBingoCard.js`        | Accept `customPhrases` param, merge with theme phrases  |
| `useSoundEffects.js`    | **NEW** — Web Audio mark/bingo sounds, mute toggle      |
| `LobbyScreen.vue`        | **NEW** — full lobby UI                                 |
| `HostControls.vue`       | **NEW** — start/end/transfer UI                         |
| `PhraseEditor.vue`       | **NEW** — upload/export custom phrases                  |
| `BingoCard.vue`          | Call `playMarkSound()` on cell toggle                   |
| `SettingsPanel.vue`      | Add mute toggle switch                                  |
| `data/sounds.js`         | **NEW** — fallback Base64 WAV data URIs                 |
| `App.vue`                | Route between LobbyScreen ↔ GameScreen based on phase   |