# Standup Bingo — Architecture & Spec

## 1. Card Generation Algorithm

### Seed-Based Deterministic Generation

Every card is generated client-side from a deterministic seed — no server round-trip needed.

```
seed = hash(teamCode + dateISO + playerName)
```

- **teamCode**: short string shared by team (e.g. `ACME`)
- **dateISO**: `YYYY-MM-DD` — ensures daily rotation
- **playerName**: makes each player's card unique

### Algorithm (5×5 grid, free center)

1. Load the **daily phrase pool** (see §4) — a flat array of ~80 phrases, shuffled deterministically using a seeded PRNG (e.g. `mulberry32`).
2. Pick the first 24 phrases (center is always FREE).
3. Arrange into a 5×5 grid: rows 0-4, cols 0-4; `grid[2][2] = "FREE"` (auto-marked).
4. The shuffle order is deterministic — same seed always produces the same card.

### Fairness guarantees

- All players draw from the **same** daily pool, so every phrase is "in play" for the team.
- Different `playerName` → different shuffle offset → different 24-pick subset & arrangement.
- Over a large pool, overlap between cards is moderate (~40-60%), which is the sweet spot for shared excitement.

### Seeded PRNG

```js
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return h;
}
```

---

## 2. Game Flow

### Pre-standup: Join

1. Player opens app → enters **team code** + **player name**.
2. App generates card from seed, displays 5×5 grid.
3. Player sees a "Ready" state; a countdown or manual "Start" button begins the session.
4. URL updates to `/#/ACME?player=Alice` — shareable link for teammates.

### During standup: Mark squares

- Tap/click a square to mark it (toggle on/off).
- Marked squares get a visual stamp (✓ or 🅱️ stamp overlay).
- 20-minute timer runs in the corner (configurable).
- **Bingo detection** runs on every mark:
  - 5 in a row (horizontal, vertical, diagonal) = BINGO.

### Bingo! moment

- Confetti animation (canvas-based, lightweight).
- "BINGO!" overlay with the winning line highlighted.
- Player can dismiss and keep playing (multiple bingos possible).
- Local notification sound (optional, embedded asset).

### Post-game

- When timer ends or all players dismiss → **Results screen**.
- Shows: squares marked, bingos achieved, time to first bingo.
- Saves to LocalStorage: streak count, total bingos, games played.
- **Streaks**: consecutive days with at least one bingo.
- **Unlockables** (future): new stamp styles, card themes, rare phrase packs.

---

## 3. Firewall-Safe Multiplayer

### Principles

- **Zero runtime network**. No WebSockets, no polling, no API calls.
- Each client is a **fully independent** instance.
- "Multiplayer" is emergent: everyone plays the same daily game on the same team code.

### Room coordination

| Mechanism | How |
|-----------|-----|
| Join room | Share URL: `https://app/#/ACME?player=Alice` |
| Same daily pool | `teamCode + dateISO` ensures identical phrase pool |
| Unique cards | `+ playerName` differentiates each card |
| No sync needed | Each player marks independently; no shared state |

### Optional: Manual brag channel

- After bingo, copy a brag snippet to clipboard: *"BINGO! 🎉 3 rows in 14 min — Standup Bingo"*
- Paste into Slack/Teams manually. No API integration.

### Why this works

- The fun is **parallel play**, not competitive real-time sync.
- Everyone knows they're playing the same daily game; conversation does the rest.

---

## 4. Content System

### Phrase pool structure

Phrases are organized by **category** for balanced card generation:

```json
{
  "categories": {
    "status-updates": [
      "It worked locally",
      "I'll check the logs",
      "Still working on the same ticket",
      "Almost done, just need to test"
    ],
    "tech-excuses": [
      "It's a caching issue",
      "Works on my machine",
      "Must be a flaky test",
      "The pipeline is slow today"
    ],
    "meeting-classics": [
      "Let me share my screen",
      "Can you see my screen?",
      "Sorry, I was on mute",
      "I'll take this offline",
      "Let's circle back"
    ],
    "vague-answers": [
      "We're making progress",
      "It should be done by Friday",
      "No blockers… actually wait",
      "I'm waiting on a review"
    ],
    "standup-rituals": [
      "Someone's dog barks",
      "Background construction noise",
      "Sorry I'm late",
      "Happy Monday!",
      "Anyone else have anything?"
    ]
  }
}
```

### Daily rotation

- `dateISO` in the seed ensures the shuffle order changes daily.
- Same pool, different arrangement each day.
- If pool has 80 phrases and cards pick 24, ~3 unique days before significant overlap.

### Team customization

- A `team-config.json` can be placed alongside the app or loaded from a known URL at **build time**.
- Merge team phrases into the default pool before build.
- Format:

```json
{
  "teamCode": "ACME",
  "extraPhrases": ["Deployed to staging", "Sprint retro reference"]
}
```

- At build time, Vite plugin merges `team-config.json` into the compiled phrase pool.
- No runtime fetch needed.

---

## 5. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Vue 3 (Composition API) | Lightweight, reactive |
| Build | Vite 6 | Fast HMR, static output |
| Styling | Tailwind CSS 4 | Utility-first, tiny bundle |
| State | `reactive()` + composables | No Vuex/Pinia needed for this scope |
| Persistence | LocalStorage | Streaks, stats, settings |
| Hosting | GitHub Pages | Free, static, firewall-friendly |
| Animations | Canvas confetti (inline) | No dependency, ~2KB |
| PRNG | Inline `mulberry32` | Deterministic, no deps |

### No-backend constraint

- Build output is a single `dist/` folder — pure HTML/JS/CSS.
- Zero runtime network requests (except the initial page load from Pages CDN).
- All assets (phrases, sounds, images) are bundled at build time.

---

## 6. File Structure

```
standup-bingo/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── public/
│   └── favicon.svg
├── src/
│   ├── main.js                  # App bootstrap
│   ├── App.vue                   # Root component + router
│   ├── router.js                 # Hash-based routes
│   ├── composables/
│   │   ├── useCard.js            # Card generation (seed, PRNG, grid)
│   │   ├── useGame.js            # Game state, timer, bingo detection
│   │   ├── useStats.js           # LocalStorage stats & streaks
│   │   └── useConfetti.js        # Canvas confetti animation
│   ├── components/
│   │   ├── JoinScreen.vue        # Team code + name entry
│   │   ├── BingoCard.vue         # 5×5 grid rendering
│   │   ├── BingoSquare.vue       # Individual square (tap to mark)
│   │   ├── GameTimer.vue         # 20-min countdown
│   │   ├── BingoOverlay.vue      # "BINGO!" celebration
│   │   ├── ResultsScreen.vue     # Post-game stats
│   │   └── ConfettiCanvas.vue    # Full-screen canvas overlay
│   ├── data/
│   │   └── phrases.js            # Default phrase pool (exported array)
│   ├── utils/
│   │   ├── prng.js               # mulberry32 + hashString
│   │   └── bingoCheck.js         # Row/col/diagonal win detection
│   └── styles/
│       └── main.css              # Tailwind imports + custom stamps
├── team-config.json              # Optional team overrides (build-time)
└── ARCHITECTURE.md               # This file
```

### Key components

| Component | Responsibility |
|-----------|---------------|
| `JoinScreen` | Collect teamCode + playerName, validate, navigate to game |
| `BingoCard` | Render 5×5 grid, handle square taps, emit mark events |
| `BingoSquare` | Display phrase, show stamp when marked, animate toggle |
| `GameTimer` | Countdown from 20:00, warn at 2:00, expire at 0:00 |
| `BingoOverlay` | Show on win, highlight winning line, dismiss button |
| `ResultsScreen` | Show stats, update LocalStorage, offer "Play Again" |

---

## 7. MVP Scope

### Day 1 — Must have

- [ ] Join screen (team code + player name)
- [ ] Deterministic card generation (seeded PRNG, daily rotation)
- [ ] 5×5 bingo grid with tap-to-mark
- [ ] Bingo detection (row/col/diagonal)
- [ ] BINGO overlay with winning line highlight
- [ ] 20-minute game timer
- [ ] Default phrase pool (~60 phrases, 4 categories)
- [ ] Hash-based routing (`/#/TEAM?player=NAME`)
- [ ] Mobile-responsive layout
- [ ] Deploy to GitHub Pages

### Phase 2 — Nice to have

- [ ] Confetti animation on bingo
- [ ] LocalStorage stats (games played, bingos, streaks)
- [ ] Sound effect on mark/bingo
- [ ] Brag-to-clipboard button
- [ ] Team config merge at build time
- [ ] Dark mode toggle
- [ ] Multiple stamp styles (unlockable)

### Phase 3 — Future

- [ ] Achievement system (first bingo, 7-day streak, full card)
- [ ] Custom phrase editor (local, exportable JSON)
- [ ] Weekly leaderboard (purely local stats, no sync)
- [ ] Card themes / skins
- [ ] PWA offline support (service worker)