# 🚗 Elango Delivery — Game Concept Draft

> **Status:** Draft for Uncle John's review  
> **Date:** 2026-05-24  
> **Universe:** Elango Surfers (Vue 3 + Vite + Three.js + Tailwind CSS 4)  
> **Rating:** Family-friendly (PG — no violence, cartoonish chaos only)

---

## 1. Game Concept Overview

**Elango Delivery** is a 3rd-person cartoonish driving game where you play as Elango — everyone's favorite delivery driver — racing through the colorful town of Elangoville in a zippy Mini Cooper. Think *GTA Lite meets Crazy Taxi*, but rated PG: no running over pedestrians (they always dive out of the way with cartoonish yelps), no violence, just pure chaotic delivery fun. The core loop is **accept mission → race across town → pick up cargo → deliver before the timer expires → earn coins & stars → upgrade your ride → unlock new districts**. Each delivery is a mini-adventure through traffic, construction zones, shortcut alleys, and the occasional ramp launch over a fountain. The tone is bright, bouncy, and irreverent — the town is alive with silly NPCs, dynamic weather, and radio chatter from dispatch.

The game sits in the Elango Surfers universe but shifts from infinite-runner to open-town driving. Elango's Mini Cooper is the star — a tiny car with a big personality, bouncing over curbs, squeezing through alleys, and launching off ramps with exaggerated cartoon physics. Missions range from "deliver pizza before it gets cold" to "transport a birthday cake without toppling it" to "race a rival driver across three districts." Every mission has a time pressure element and a bonus condition (no damage, under par time, collect all bonus coins along the route).

---

## 2. Key Mechanics

### Driving
- **3rd-person chase camera** behind the Mini Cooper, with smooth follow and slight drift on turns
- **Arcade physics**: exaggerated drift, bouncy suspension, ramp launches with hang-time
- **Controls**: WASD / Arrow keys (keyboard), touch joystick (mobile), tilt steering (optional)
- **Handbrake drift**: Spacebar for tight corners and sick drifts (drift = bonus coins)
- **Horn**: Honk at pedestrians — they scatter with cartoon animations (no harm, just comedy)

### Delivery Missions
- **Mission types**:
  - 🍕 **Hot Delivery**: Time-critical, food gets cold (decreasing tip multiplier)
  - 🎂 **Fragile Cargo**: Hit too many bumps and the package degrades (3 strikes)
  - 📦 **Bulk Run**: Multiple stops, route optimization matters
  - 🏁 **Race**: Head-to-head against an AI rival driver
  - 🔥 **Emergency**: Short timer, high reward, chaotic route
- **Mission board**: Accept missions from a dispatch screen (like GTA's mission phone)
- **Star rating**: 1-3 stars per mission based on time, cargo condition, and bonus objectives

### Pickups & Power-ups
- **Coin trails**: Collect coins along routes (combo system from Surfers carries over)
- **Power-ups** (spawn on map):
  - ⚡ **Speed Boost**: Nitro burst (3 seconds)
  - 🛡️ **Package Shield**: Protects fragile cargo for 10 seconds
  - 🧲 **Coin Magnet**: Pulls nearby coins toward the car
  - 🕐 **Time Freeze**: Pauses the delivery timer for 5 seconds
  - 🗺️ **Shortcut Reveal**: Shows hidden alley routes on minimap

### Traffic & Pedestrians (Cartoonish, No Violence)
- **Traffic AI**: Cars follow lanes, stop at lights, occasionally change lanes unpredictably
- **Pedestrians**: Walk on sidewalks, cross at crossings; if you drive on sidewalk, they dive away with exaggerated animations and speech bubbles ("Watch it, Elango!")
- **No collision damage to pedestrians** — they're invincible cartoon characters
- **Car collisions**: Bouncy physics, no damage model — just speed loss and cartoon bounce
- **Police**: If you drive too recklessly (too many near-misses, running reds), a cartoon cop car chases you — getting caught = mission fail, escaping = bonus coins

### Time Pressure
- **Countdown timer** on each mission (visible, ticking)
- **Traffic lights**: Red = wait or risk cop chase; green = go
- **Rush hour events**: Periodic traffic surges that make routes harder
- **Day/night cycle**: Night = fewer cars but darker, harder to see shortcuts

---

## 3. Level/Map Design

### Elangoville — Town Layout

```
┌─────────────────────────────────────────────────┐
│                  SUBURBIA                         │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│   │House │  │House │  │House │  │House │        │
│   └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘        │
│      │  Elm St.   │  Oak Ave.   │                │
│   ───┼────────────┼────────────┼─────── MAIN ── │
│      │            │            │       HIGHWAY   │
│   ───┼────────────┼────────────┼─────────────── │
│      │  Pine Rd.  │  Cedar Ln. │                │
│   ┌──┴───┐  ┌────┴──┐  ┌──────┴──┐              │
│   │Pizza │  │  Park │  │ Bakery  │              │
│   │Shop  │  │ 🌳⛲ │  │         │              │
│   └──────┘  └───────┘  └─────────┘              │
│                                                   │
│              DOWNTOWN                             │
│   ┌──────┐ ┌──────────┐ ┌──────┐ ┌──────┐      │
│   │Mall  │ │  Town    │ │Bank  │ │Hotel │      │
│   │      │ │  Hall 🏛️ │ │      │ │      │      │
│   └──────┘ └──────────┘ └──────┘ └──────┘      │
│                                                   │
│              INDUSTRIAL                           │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│   │Ware- │ │Factory│ │Depot │ │Docks │          │
│   │house │ │  🏭   │ │  📦  │ │  ⚓  │          │
│   └──────┘ └──────┘ └──────┘ └──────┘          │
│                                                   │
│              WATERFRONT                           │
│   ~~~~~ 🌊 ~~~~~ Boardwalk ~~~~~ 🎡 ~~~~~       │
└─────────────────────────────────────────────────┘
```

### Districts (Unlocked Progressively)
| District | Unlock | Theme | Key Landmarks | Mission Flavor |
|----------|--------|-------|---------------|----------------|
| **Downtown** | Start | Colorful city center, narrow streets | Town Hall, Mall, Bank | Pizza deliveries, office packages |
| **Suburbia** | 5 stars | Wide roads, residential, parks | Park with fountain (ramp!), Bakery | Birthday cakes, fragile cargo |
| **Industrial** | 15 stars | Wide open, warehouses, train tracks | Warehouse, Factory, Train crossing | Bulk deliveries, timed runs |
| **Waterfront** | 30 stars | Boardwalk, bridges, ferries | Pier, Ferris wheel, Dock | Seafood rush, ferry shortcuts |

### Key Map Features
- **Minimap** in corner (expands on tap/click)
- **GPS route line** on roads (like Crazy Taxi arrow)
- **Hidden shortcuts**: Alleys, parking lots, park paths — discover by exploration
- **Ramps**: Park fountain, construction sites, parking garage exits
- **Dynamic elements**: Traffic lights, construction zones, events (parade, marathon)

---

## 4. Progression System

### Stars & Unlocks
- **1-3 stars per mission** (time + condition + bonus)
- **Star milestones** unlock new districts, vehicles, and cosmetics
- **Total stars displayed** on profile screen

### Vehicle Upgrades (Mini Cooper Customization)
| Upgrade | Levels | Effect |
|---------|--------|--------|
| 🏎️ **Engine** | 1→5 | Top speed +15% per level |
| 🛞 **Tires** | 1→5 | Drift control + grip |
| 🛡️ **Suspension** | 1→5 | Less cargo damage on bumps |
| ⚡ **Nitro Tank** | 1→3 | More boost charges |
| 🎨 **Paint** | Unlocks | New colors (red, blue, gold, rainbow) |
| 🎀 **Accessories** | Unlocks | Roof rack, spoiler, antenna ball, flags |

### Unlockable Vehicles (Cosmetic + Slight Stat Variations)
| Vehicle | Unlock | Trait |
|---------|--------|-------|
| 🚗 Mini Cooper | Start | Balanced |
| 🚐 Delivery Van | 10 stars | More cargo slots, slower |
| 🏍️ Scooter | 20 stars | Fast, fragile cargo penalty |
| 🚜 Farm Truck | 30 stars | Tough, off-road bonus |
| 🚀 Rocket Car | All stars | Secret endgame vehicle |

### Achievements (Extending Surfers System)
- 🏁 **First Delivery** — Complete your first mission
- ⏱️ **Speed Demon** — Complete 5 missions under par time
- 🍕 **Pizza Pro** — Deliver 20 hot deliveries
- 🎂 **Cake Boss** — Deliver 10 fragile cargos without damage
- 🌃 **Night Owl** — Complete 10 night deliveries
- 🚔 **Slippery** — Escape 5 police chases
- 🗺️ **Explorer** — Discover all hidden shortcuts
- 💰 **Millionaire** — Earn 10,000 coins total
- 🏆 **Mayor of Elangoville** — 3-star every mission

---

## 5. Technical Architecture

### Stack (Aligned with Elango Surfers)
| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Vue 3 (Composition API) | Same reactive system as Surfers |
| Build | Vite 8 | Hot reload, fast builds |
| 3D Engine | Three.js | Proven in Surfers, handles 3D driving well |
| Styling | Tailwind CSS 4 | UI overlays, menus, HUD |
| State | Vue refs + composable stores | `useGameState()`, `usePlayer()`, etc. |
| Persistence | localStorage (same as Surfers) | Progress, settings, achievements |
| Leaderboard | Supabase (optional, like Surfers) | Delivery times, star counts |

### Architecture Pattern

```
src/
├── main.js                    # Vue app bootstrap
├── App.vue                     # Root component, game loop entry
├── gameConstants.js            # All tunable constants
├── style.css                   # Global styles
│
├── components/
│   ├── GameCanvas.vue          # Three.js canvas mount
│   ├── HUD.vue                 # Speed, timer, coins, minimap
│   ├── MissionBoard.vue        # Mission selection screen
│   ├── PauseMenu.vue           # Pause/settings
│   ├── StarRating.vue          # Post-mission results
│   ├── GarageScreen.vue        # Vehicle customization
│   ├── MapOverlay.vue          # Full-screen map view
│   └── LoadingScreen.vue      # (reuse from Surfers)
│
├── composables/
│   ├── useGameLoop.js          # Main game loop (requestAnimationFrame)
│   ├── usePlayer.js            # Player car state, physics, controls
│   ├── useTraffic.js           # AI traffic spawning & behavior
│   ├── usePedestrians.js       # Pedestrian AI & scatter
│   ├── useMissions.js          # Mission generation, tracking, scoring
│   ├── useMap.js               # Town layout, roads, buildings, shortcuts
│   ├── usePhysics.js           # Arcade physics (drift, bounce, ramps)
│   ├── useCamera.js            # Chase camera follow logic
│   ├── useMinimap.js           # Minimap rendering
│   ├── useDayNight.js          # Day/night cycle
│   ├── useAudio.js             # (extend from Surfers)
│   ├── useAchievements.js      # (extend from Surfers)
│   ├── useLeaderboard.js       # (extend from Surfers)
│   └── useGameSettings.js      # (extend from Surfers)
│
├── data/
│   ├── missions.js             # Mission templates & generation rules
│   ├── vehicles.js             # Vehicle stats & unlock thresholds
│   ├── districts.js            # Map layout data (like stages.js)
│   └── upgrades.js             # Upgrade costs & effects
│
├── assets/
│   ├── models/                 # Three.js procedural model generators
│   ├── textures/               # Procedural texture generators
│   └── audio/                  # Sound effects & music
│
└── utils/
    ├── math.js                 # Vector helpers, lerp, easing
    ├── collision.js             # AABB collision detection
    └── pathfinding.js           # Simple A* for traffic AI
```

### Rendering Approach
- **Three.js for 3D world**: Car, buildings, roads, pedestrians, props
- **All models procedural** (like Surfers): No external 3D model files — everything built with Three.js primitives and `BufferGeometry`
- **DOM overlay for HUD**: Vue components positioned over the canvas (timer, speed, coins, minimap)
- **Canvas minimap**: Separate small canvas for top-down map view

### Physics Engine
- **Custom arcade physics** (no external physics lib needed):
  - Velocity-based movement with acceleration curves
  - Drift mechanics via lateral velocity damping
  - Collision via AABB + simple overlap resolution (bouncy, not realistic)
  - Ramp detection via trigger zones → parabolic arc
- **Why custom?** Surfers uses custom physics successfully; arcade driving needs even less realism. A full physics engine (Cannon.js, Ammo.js) would be overkill and hurt performance on mobile.

### Performance Targets
- 60 FPS on mid-range phones (same target as Surfers)
- Max ~200 dynamic objects on screen (traffic + pedestrians + props)
- LOD system: distant buildings = simple boxes, close = detailed
- Object pooling for traffic and pedestrians

---

## 6. Art Style Guide

### Color Palette
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Primary** | Elango Yellow | `#FFD700` | Car body, UI accents, brand |
| **Secondary** | Sky Blue | `#87CEEB` | Sky, water, UI backgrounds |
| **Road** | Asphalt Gray | `#4A4A4A` | Roads, parking lots |
| **Grass** | Park Green | `#4CAF50` | Parks, suburban lawns |
| **Warm** | Sunset Orange | `#FF8C00` | Mission markers, urgency |
| **Danger** | Soft Red | `#FF6B6B` | Timer warnings, cop lights |
| **Success** | Mint Green | `#66BB6A` | Delivery success, stars |
| **Neutral** | Cream | `#FFF8E1` | Buildings, sidewalks |
| **Dark** | Charcoal | `#2C3E50` | Night sky, UI text |

### Character Design
- **Elango**: Same character as Surfers — round head, big eyes, expressive. Now wearing a delivery cap and uniform (blue shirt, brown shorts)
- **Pedestrians**: Varied body types, colorful outfits, exaggerated walk animations. Speech bubbles when dodging ("Whoa!", "Hey!", "Watch it!")
- **Police**: Round cartoon cop, oversized hat, red/blue flashing car

### Vehicle Design
- **Mini Cooper**: Chunky, exaggerated proportions — big wheels, small body, bouncy suspension
- **All vehicles**: Bright saturated colors, no realistic damage models
- **Customization**: Paint colors, roof accessories, antenna toppers — all cosmetic, fun

### Environment Style
- **Low-poly cartoonish**: Flat-shaded buildings with colored roofs
- **Exaggerated scale**: Cars slightly too big for roads, buildings slightly too tall
- **Lively**: Animated billboards, spinning signs, bouncing mailboxes
- **Consistent with Surfers**: Same universe, same visual language, same charm

---

## 7. MVP Scope

### What's the Smallest Playable Version?

**MVP = One district, one vehicle, five missions, core driving loop.**

| Feature | MVP | Post-MVP |
|---------|-----|----------|
| Map | Downtown only (1 district) | 4 districts with unlocks |
| Vehicle | Mini Cooper only | 5 vehicles |
| Missions | 5 hot delivery missions | All 5 mission types |
| Traffic | 5-10 AI cars | Full traffic system |
| Pedestrians | 5-8 NPCs (dodge only) | Full pedestrian AI |
| Police | No chase | Cop chase mechanic |
| Upgrades | None | Full upgrade tree |
| Day/Night | Day only | Full cycle |
| Minimap | Simple overhead view | Full interactive map |
| Audio | Basic engine + honk | Full soundtrack + SFX |
| Leaderboard | Local only | Supabase integration |

### MVP Build Order (Estimated: 3-5 days)

1. **Day 1: Driving Prototype**
   - Three.js scene with flat ground + road
   - Mini Cooper (box geometry, colored) with arcade driving controls
   - Chase camera follow
   - Basic collision with buildings (bounce off walls)

2. **Day 2: Town + Missions**
   - Downtown layout (10-15 buildings, roads, intersections)
   - Mission system: accept → GPS route → pickup → deliver
   - Timer + star rating
   - Coin collection along routes

3. **Day 3: Traffic + Polish**
   - 5 AI traffic cars on loop routes
   - Pedestrian NPCs that dodge
   - HUD overlay (speed, timer, coins, minimap)
   - Sound effects (engine, honk, pickup, delivery)

4. **Day 4: Game Flow**
   - Start screen → Mission board → Drive → Results → Repeat
   - localStorage progress save
   - 5 varied missions in Downtown

5. **Day 5: Juice + Deploy**
   - Screen shake on collisions
   - Particle effects (dust, sparks)
   - Drift trail visuals
   - Deploy to GitHub Pages (like Surfers)

### Success Criteria for MVP
- ✅ Can drive the Mini Cooper around a small town
- ✅ Can accept and complete 5 delivery missions
- ✅ Timer creates urgency
- ✅ Coins are collectible along routes
- ✅ Traffic and pedestrians create challenge
- ✅ Game feels fun and cartoonish (not frustrating)
- ✅ Runs at 60 FPS on mobile
- ✅ Playable in browser with keyboard + touch

---

## Appendix: Elango Surfers Parity

This game shares DNA with Elango Surfers and should maintain consistency:

| Element | Surfers | Delivery |
|---------|---------|----------|
| Character | Elango (runner) | Elango (driver) — same design, delivery outfit |
| Coins | ✅ Combo system | ✅ Same combo system |
| Power-ups | Shield, Speed, Magnet | Shield, Speed, Magnet + Time Freeze, Shortcut |
| Achievements | ✅ localStorage | ✅ Same system, new achievements |
| Stages | Highway → Medieval → IKEA | Downtown → Suburbia → Industrial → Waterfront |
| Tech | Vue 3 + Vite + Three.js | Same stack |
| Audio | Procedural + chiptune | Same approach |
| Deployment | GitHub Pages | Same |
| Rating | PG (no violence) | PG (no violence, cartoonish only) |

---

*Draft by Archie (OpenClaw agent) — Ready for Uncle John's review! 🚗💨*