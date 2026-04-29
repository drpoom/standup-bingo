# Standup Bingo v2.0 — Architecture

## Overview

Multiplayer bingo for standup meetings using **PeerJS** for P2P synchronization. No backend required.

## Core Features

### 1. Timer-Free Gameplay ✅
- No countdown timer
- Flexible game duration
- Elapsed time display only

### 2. Theme System ✅
- Multiple themes with unique phrase pools
- Themes: General Dev, Embedded Dev, QA/Test, Cyberpunk, Retro, Zen
- First player selects theme (stored in game state)
- Subsequent players see theme (read-only)

### 3. Avatar System ✅
- DiceBear API integration
- Deterministic avatars: same name = same avatar
- Styles: avataaars, bottts, lorelei, identicon
- Displayed on thumbnails and modals

### 4. Player Board Visibility ✅
- Sidebar with player thumbnails
- Mini 5x5 grid preview
- Click to open zoomed modal
- Shows avatar, name, bingo count

### 5. P2P Sync via PeerJS ✅
- **Host**: First player creates room ID = `TEAMCODE-YYYY-MM-DD`
- **Clients**: Late joiners connect to existing room
- **Sync**: Real-time bingo events and mark updates
- **STUN**: Google's public servers (free)

### 6. Shared Bingo Celebration ✅
- Confetti animation for all players
- Toast notification: "[Player] got BINGO!"
- Sound playback (if enabled)

## Technical Architecture

### Components

```
App.vue
├── useNetworking() — PeerJS wrapper
├── useGameState() — Local state management
├── useBingoCard() — Card generation with theme
├── GameScreen.vue
│   ├── BingoCard.vue
│   ├── PlayerBoardThumbnail.vue (sidebar)
│   ├── PlayerBoardModal.vue (zoomed view)
│   └── PlayerAvatar.vue (DiceBear)
└── ThemePicker.vue
```

### Networking Flow

```
Player 1 (Host):
1. Enter team code → ACME
2. Date: 2026-04-30
3. Room ID: ACME-2026-04-30
4. Initialize PeerJS as host
5. Listen for connections

Player 2 (Client):
1. Enter same team code → ACME
2. Same date: 2026-04-30
3. Room ID: ACME-2026-04-30
4. Initialize PeerJS as client
5. Connect to existing room
6. Send JOIN event
```

### Message Types

```js
{
  type: 'JOIN',           // New player joined
  type: 'BINGO',          // Player got bingo
  type: 'MARK_UPDATE'     // Cell toggled
}
```

### Data Structures

```js
// Player state
{
  name: string,
  grid: Cell[][],
  bingoCount: number,
  theme: string
}

// Bingo event
{
  type: 'BINGO',
  playerName: string,
  bingoType: 'row' | 'column' | 'diagonal',
  timestamp: number
}

// Mark update
{
  type: 'MARK_UPDATE',
  row: number,
  col: number,
  marked: boolean,
  timestamp: number
}
```

## Implementation Details

### PeerJS Configuration

```js
const peer = new Peer(roomId, {
  debug: 2
})

// Host listens for connections
peer.on('connection', (conn) => {
  conn.on('data', handleData)
})

// Client connects to host
const conn = peer.connect(roomId)
conn.send({ type: 'JOIN', playerName })
```

### DiceBear Avatar

```vue
<img 
  :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${playerName}`"
  :style="{ width: size + 'px', height: size + 'px' }"
/>
```

### Theme Integration

```js
// themes.js exports phrases per theme
const themePhrases = THEMES[themeId].phrases
// useBingoCard.js uses theme-specific phrases
const grid = generateCard(teamCode, playerName, dateISO, theme)
```

## Files

```
src/
├── App.vue                    # Main app with networking
├── components/
│   ├── GameScreen.vue         # Updated with sidebar
│   ├── JoinScreen.vue         # Theme picker integrated
│   ├── ThemePicker.vue        # NEW
│   ├── PlayerAvatar.vue       # NEW (DiceBear)
│   ├── PlayerBoardThumbnail.vue  # NEW
│   ├── PlayerBoardModal.vue      # NEW
│   └── ...
├── composables/
│   ├── useGameState.js        # Updated (no timer)
│   ├── useBingoCard.js        # Updated (theme support)
│   ├── useNetworking.js       # NEW (PeerJS)
│   └── ...
└── data/
    ├── themes.js              # Updated (phrases per theme)
    └── ...
```

## Build & Deploy

```bash
npm install peerjs
npm run build
# dist/ ready for deployment
```

## Notes

- **No backend**: Pure P2P via WebRTC
- **Room ID**: Deterministic from team code + date
- **Same-day games**: Players must use same date for same room
- **Offline fallback**: Single-player works without PeerJS connection
