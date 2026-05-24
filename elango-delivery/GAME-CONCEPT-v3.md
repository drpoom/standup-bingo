# 🚗 Elango Delivery v3 — Physics & Interaction Focus

> **Status:** v3 — Uncle John's Physics Playground Direction  
> **Date:** 2026-05-24  
> **Universe:** Elango Surfers (Vue 3 + Vite + Three.js + Tailwind CSS 4)  
> **Rating:** Family-friendly (PG — feel-good, cartoonish, no violence, no police)  
> **Platform:** Mobile browser — must hit 60 FPS  
> **Map:** Coimbingen — rural German town, woods as borders

---

## 1. Elevator Pitch

**Elango Delivery** is a feel-good physics playground where you drive a bouncy Mini Cooper through a charming rural German town, discovering delightful interactions at every turn — chickens scatter, pedestrians wave, traffic lights change — all while delivering packages at your own pace. It's not about scores or unlocks; it's about the joy of driving through a world that reacts to you with warmth and whimsy.

---

## 2. Physics & Interaction Showcase

The world is alive. Every object and NPC has personality-driven physics behaviors that make exploration rewarding.

### Interactive Objects & NPCs

| # | Element | Behavior | Physics Feel |
|---|---------|----------|-------------|
| 1 | 🐔 **Chickens** | Wander freely on roads & yards; when car approaches, they scatter in panic with wing-flapping, then slowly regroup. Different chickens have different panic speeds. | Bouncy scatter — spring-like impulse away from car, then wobble back. Squash-stretch on legs. |
| 2 | 🚶 **Pedestrians** | Walk along sidewalks, cross at crossings. Honk → they jump and wave happily. Drive close → they lean back with exaggerated cartoon dodge, then laugh (speech bubble: "Haha, Elango!"). | Spring-dodge physics. Lean-back is an eased rotation, recovery is bouncy. |
| 3 | 🚦 **Traffic Lights** | Cycle red/yellow/green on timers. Honk at a red → it turns green faster (with a happy *ding*). Green = go, red = NPCs stop and wait. | Light snaps between states with a satisfying bounce-scale animation on the housing. |
| 4 | 📦 **Packages** | Sit on porches & benches. Pick up by driving close — they hop onto the car roof with a satisfying *thwump*. Deliver by driving near the destination mailbox. | Package has weight — car dips slightly on pickup. Bounces on roof over bumps. |
| 5 | 🌳 **Trees & Bushes** | Sway in wind. Drive through bushes → they rustle and part. Hit a tree → bouncy rebound, leaves shake off in a burst. | Wind-driven sinusoidal sway. Collision = impulse shake + leaf particles. |
| 6 | 🏓 **Mailboxes** | Stand at each house. Deliver a package → flag flips up with a spring animation, mailbox does a happy wiggle. | Spring-damped rotation on flag. Mailbox body does a squash-stretch. |
| 7 | 🐕 **Dogs** | Sleep on porches. Drive close → they wake up, bark, and chase the car for a few seconds, then give up and trot back. | Sleep-to-run transition is bouncy. Chase uses spring-follow physics. Tail wags with pendulum motion. |
| 8 | 🌊 **Puddles** | Appear after rain. Drive through → satisfying splash particles, car slides slightly. | Splash = particle burst. Slight lateral drift on puddle contact. |
| 9 | 🪧 **Signs & Fences** | Drive into a wooden fence → boards fly off with spin physics. Signs on poles wobble and settle when bumped. | Rigid-body spin on fence boards. Sign = spring-damped oscillation on pole. |
| 10 | 🛒 **Market Carts** | Parked near the weekly market. Push them with the car → they roll and bump into things, scattering apples. | Rolling friction + collision cascade. Apples bounce and scatter. |
| 11 | 🐱 **Cats** | Sit on walls & windowsills. Drive close → they arch their back, hiss (cartoonish), then leap away with exaggerated arc. | Spring-arch pose → parabolic leap. Land with squash-stretch. |
| 12 | 🎪 **Bunting & Banners** | Strung between buildings in the market square. Drive through → they flutter and part around the car. | Cloth-sim lite: sinusoidal wave propagation. No full cloth sim. |
| 13 | 🍺 **Beer Garden Umbrellas** | Open/closed state. Honk near a closed one → it pops open with a spring animation. | Spring-scale open animation. Canopy sways in wind. |
| 14 | 🚲 **Bicycles** | Parked on racks. Bump the rack → bicycles wobble and one might fall over with a clang. | Chain-reaction wobble. Fall = pivot + bounce on ground. |
| 15 | 🐦 **Birds** | Perch on rooftops and lampposts. Drive fast nearby → flock scatters upward in a burst, then circles and resettles. | Burst scatter with upward impulse. Circle = smooth orbit path back. |

---

## 3. Core Loop

```
┌─────────────────────────────────────────────────┐
│                                                   │
│   🚗 DRIVE ──────► 🔍 DISCOVER ──────► 📦 DELIVER│
│                                                   │
│   Explore          Interact with         Simple   │
│   Coimbingen       chickens, lights,    drop-off  │
│   freely           pedestrians...       packages  │
│                                                   │
│        ◄──────────── LOOP ◄───────────────       │
│        More road = more discoveries = more joy    │
│                                                   │
└─────────────────────────────────────────────────┘
```

**The loop is intentionally loose:**
1. **Drive** — Pick a direction, any direction. The town is yours.
2. **Discover** — Chickens scatter! Dogs chase! Traffic lights change! Every block has something that reacts.
3. **Deliver** — See a package on a porch? Drive close to pick it up. See the destination on the minimap? Drive there. That's it. No timer, no score pressure.
4. **Explore more** — The delivery was just an excuse to drive somewhere new.

**Key difference from v2:** No mission board, no timer, no stars, no upgrades. Deliveries are ambient — packages appear on porches, you deliver them because it's fun, not because a mission told you to.

---

## 4. Coimbingen Map

A rural German town surrounded by dense woods (natural border). Compact, explorable, full of character.

```
┌──────────────────────────────────────────────────────┐
│  🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲 │
│  🌲🌲          N O R T H   W O O D S        🌲🌲 │
│  🌲🌲   🌳🌳🌳  ┌──────────────┐  🌳🌳🌳   🌲🌲 │
│  🌲🌲          │  OLD CHURCH   │              🌲🌲 │
│  🌲🌲   🐔🐔  │  ⛪ + Square  │  🐔🐔       🌲🌲 │
│  🌲🌲          └──────┬───────┘              🌲🌲 │
│  🌲🌲                 │                       🌲🌲 │
│  🌲🌲   ┌─────────────┼─────────────┐         🌲🌲 │
│  🌲🌲   │  HAUPTSTRASSE (Main St)   │         🌲🌲 │
│  🌲🌲   │  🚦    🚦    🚦    🚦    │         🌲🌲 │
│  🌲🌲   │                             │         🌲🌲 │
│  🌲🌲   ├──────┬──────────┬───────────┤         🌲🌲 │
│  🌲🌲   │BAKERY│  MARKET  │  BEER     │         🌲🌲 │
│  🌲🌲   │ 🥐   │  🛒🎪    │  GARDEN   │         🌲🌲 │
│  🌲🌲   │      │  Bunting  │  🍺☂️    │         🌲🌲 │
│  🌲🌲   └──────┴──────────┴───────────┘         🌲🌲 │
│  🌲🌲                 │                           🌲🌲 │
│  🌲🌲   ┌─────────────┼─────────────┐             🌲🌲 │
│  🌲🌲   │  RESIDENTIAL LANES        │             🌲🌲 │
│  🌲🌲   │  🏠🐕  🏠🐱  🏠📦  🏠    │             🌲🌲 │
│  🌲🌲   │  📬   📬   📬   📬       │             🌲🌲 │
│  🌲🌲   │  🚲    🚲    🚲    🚲    │             🌲🌲 │
│  🌲🌲   └─────────────┬─────────────┘             🌲🌲 │
│  🌲🌲                 │                           🌲🌲 │
│  🌲🌲   ┌─────────────┼─────────────┐             🌲🌲 │
│  🌲🌲   │  FARM FIELDS & BARN       │             🌲🌲 │
│  🌲🌲   │  🐔🐔🐔  🚜  🌾🌾         │             🌲🌲 │
│  🌲🌲   │  🐔🐔🐔  🛒   🌾🌾         │             🌲🌲 │
│  🌲🌲   └───────────────────────────┘             🌲🌲 │
│  🌲🌲                                              🌲🌲 │
│  🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲 │
└──────────────────────────────────────────────────────┘
```

### Key Landmarks & Interaction Hotspots

| Landmark | Interactions | Physics Showcase |
|----------|-------------|-----------------|
| **Church Square** (⛪) | Chickens wander, birds on roof, fountain splashes | Fountain water particles, bird scatter, chicken panic |
| **Hauptstrasse** (Main St) | 4 traffic lights, pedestrians, market stalls | Traffic light honk-to-green, pedestrian dodge, cart push |
| **Market Square** (🎪) | Bunting, market carts, umbrellas, crowds | Bunting flutter, cart cascade, umbrella spring-open |
| **Bakery** (🥐) | Package pickup, cat on windowsill, smell particles | Cat leap, package hop, steam particles from oven |
| **Beer Garden** (🍺) | Umbrellas, dogs sleeping under tables, bicycle rack | Umbrella pop, dog chase, bike wobble cascade |
| **Residential Lanes** (🏠) | Mailboxes, fences, puddles, parked bikes | Mailbox flag spring, fence board scatter, puddle splash |
| **Farm Fields** (🌾) | Many chickens, tractor, hay bales | Chicken scatter (mass panic!), hay bale bump & roll |

### Woods Border
- Dense tree line = natural boundary (can't drive through)
- A few forest paths for exploration (short dead-end trails with a bench + bird interaction)
- Visual: dark green canopy, dappled light, sense of cozy enclosure

---

## 5. Tech Stack Decision

### ✅ Three.js + Vue 3 + Vite (Same as Surfers)

**Why Three.js over pure Vue:**

| Factor | Three.js + Vue | Pure Vue (2D) | Verdict |
|--------|----------------|---------------|---------|
| 3rd person driving | ✅ Full 3D camera, depth, perspective | ❌ Top-down only, no immersion | **Three.js wins** |
| Physics interactions | ✅ 3D spring/damped physics, squash-stretch | ⚠️ 2D approximations feel flat | **Three.js wins** |
| NPC behaviors | ✅ 3D scatter, leap, dodge animations | ⚠️ 2D sprites feel limited | **Three.js wins** |
| Mobile performance | ✅ Proven in Surfers at 60 FPS | ✅ Slightly lighter | **Both viable** |
| Bundle size | ~150KB (Three.js tree-shaken) | ~0 (no 3D lib) | **Both under 500KB** |
| Code reuse | ✅ Direct reuse from Surfers | ❌ Rewrite everything | **Three.js wins** |
| Development speed | ✅ Shared composables, proven patterns | ❌ Start from scratch | **Three.js wins** |

**Decision: Three.js + Vue 3 + Vite** — Same stack as Elango Surfers, proven at 60 FPS on mobile, enables the 3D physics playground feel that makes this game special.

### Architecture Diagram (Text)

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│                                                     │
│  ┌─────────────┐    ┌──────────────────────────┐   │
│  │  Vue 3 App  │    │     Three.js Scene        │   │
│  │             │    │                            │   │
│  │ ┌─────────┐ │    │  ┌──────────────────────┐ │   │
│  │ │ HUD.vue │◄├────┤  │  Physics Engine      │ │   │
│  │ └─────────┘ │    │  │  (custom arcade)     │ │   │
│  │ ┌─────────┐ │    │  │  - springs           │ │   │
│  │ │Start.vue│ │    │  │  - collisions        │ │   │
│  │ └─────────┘ │    │  │  - impulses          │ │   │
│  │ ┌─────────┐ │    │  └──────┬───────────────┘ │   │
│  │ │ Map.vue │ │    │         │                  │   │
│  │ └─────────┘ │    │  ┌──────▼───────────────┐ │   │
│  │             │    │  │  Entity Manager      │ │   │
│  │  (DOM overlay│   │  │  - chickens           │ │   │
│  │   over 3D)  │    │  │  - pedestrians        │ │   │
│  │             │    │  │  - traffic lights     │ │   │
│  └──────┬──────┘    │  │  - packages          │ │   │
│         │           │  │  - dogs, cats, birds  │ │   │
│         │           │  │  - props (fences, etc) │ │   │
│         │           │  └──────────────────────┘ │   │
│         │           │                              │   │
│         │           │  ┌──────────────────────┐   │   │
│         │           │  │  World Renderer      │   │   │
│         │           │  │  - terrain/roads     │   │   │
│         │           │  │  - buildings         │   │   │
│         │           │  │  - trees/vegetation  │   │   │
│         │           │  │  - LOD system        │   │   │
│         │           │  └──────────────────────┘   │   │
│         │           │                              │   │
│         │           │  ┌──────────────────────┐   │   │
│         │           │  │  Player Controller   │   │   │
│         │           │  │  - car physics       │   │   │
│         │           │  │  - camera follow     │   │   │
│         │           │  │  - touch controls    │   │   │
│         │           │  └──────────────────────┘   │   │
│         │           └──────────────────────────┘   │   │
│         │                                           │   │
│         ▼                                           │   │
│  ┌─────────────┐                                    │   │
│  │ Composables │──── Shared State ──────────────────►│   │
│  │             │                                    │   │
│  │ useGameLoop │  (reactive refs bridge Vue ↔ 3D)  │   │
│  │ usePlayer   │                                    │   │
│  │ usePhysics  │                                    │   │
│  │ useEntities │                                    │   │
│  │ useMap      │                                    │   │
│  │ useAudio    │                                    │   │
│  └─────────────┘                                    │   │
│                                                     │   │
│  ┌─────────────┐                                    │   │
│  │ localStorage│  (progress: deliveries, discoveries) │   │
│  └─────────────┘                                    │   │
└─────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

1. **Custom arcade physics** (no Cannon.js/Ammo.js) — same approach as Surfers. Spring-damped systems for all interactions. Lighter, faster, more controllable.
2. **Procedural geometry only** — no .glb/.gltf model files. Everything built from Three.js primitives. Keeps bundle tiny.
3. **Object pooling** — chickens, pedestrians, particles all pooled. No GC pressure.
4. **Vue ↔ Three.js bridge** — reactive refs connect DOM HUD to 3D state. No direct DOM manipulation in the game loop.
5. **Single game loop** — `requestAnimationFrame` drives physics + render. Vue updates via `watchEffect` on reactive state.

---

## 6. Mobile Performance Plan (60 FPS Target)

### The Problem
Physics + 15 entity types + 3D rendering on mobile browsers. Must stay at 60 FPS.

### Strategy: Progressive Complexity + Aggressive Culling

| Technique | What | Impact |
|-----------|------|--------|
| **Entity Budget** | Max 40 active entities in physics at once. Chickens far away = frozen. | Keeps physics O(n) small |
| **Distance Culling** | Entities >80m from car = invisible + frozen. 40-80m = low-detail (no animation). | Reduces draw calls & physics |
| **LOD for Buildings** | Close = full geometry. Far = single box with texture. Very far = not rendered. | Reduces vertices 5-10x |
| **Instanced Rendering** | All chickens share one InstancedMesh. All trees share one. All fence boards share one. | Reduces draw calls from 100+ to ~15 |
| **No Shadows** | Flat-shaded low-poly art doesn't need shadows. Use ambient + directional light only. | Saves 30-40% GPU on mobile |
| **Particle Limits** | Max 50 particles on screen. Recycle oldest. | Caps GPU fill rate |
| **Physics Simplification** | All collisions = AABB or sphere. No mesh colliders. | Keeps collision detection <1ms |
| **Frame Budget** | Physics: 4ms, Render: 10ms, Vue update: 2ms, Headroom: 3ms | Total ≤19ms = 52+ FPS |
| **Touch Input** | Virtual joystick (left thumb) + gas/brake buttons (right thumb). No tilt. | Predictable, no gyro variance |
| **WebGL Optimizations** | Disable antialiasing on mobile. Use `powerPreference: 'high-performance'`. Request <2K textures. | Reduces GPU overhead |

### Entity Update Strategy

```
Distance from car │ Entity state
─────────────────┼──────────────────────────────
0-20m            │ Full physics + animation + particles
20-50m           │ Physics + animation (no particles)
50-80m           │ Position only (slide along path, no physics)
80m+             │ Frozen (no update, no render)
```

### Chicken-Specific Optimization (Most Numerous Entity)
- Use `InstancedMesh` for all chickens (single draw call for 20+ chickens)
- Update instance matrices from a `Float32Array` (no per-chicken Object3D)
- Only chickens within 20m get individual physics
- Scatter animation = pre-baked keyframe applied to instance matrix

---

## 7. MVP Scope — 1-Day Prototype

**Goal: Prove the physics playground is fun. One day, absolute minimum.**

### What's In

| Feature | MVP Implementation |
|---------|-------------------|
| **Map** | Small loop of road — 4 buildings, 1 intersection, 1 traffic light. Surrounded by trees (border). |
| **Car** | Box-geometry Mini Cooper (yellow). Arcade driving: accelerate, steer, brake. Chase camera. |
| **Chickens** | 5 chickens that wander and scatter when car is near. Instanced geometry. Spring physics on scatter. |
| **Traffic Light** | 1 traffic light that cycles. Honk → turns green faster. Bounce animation on state change. |
| **Pedestrians** | 3 pedestrians that walk and dodge when car is close. Spring-lean dodge. |
| **Package** | 1 package on a porch. Drive close → hops on roof. Drive to mailbox → hops off. |
| **Mailbox** | 1 mailbox. Package delivered → flag springs up. |
| **Trees** | 10 trees. Bump → leaves shake. Wind sway. |
| **Fence** | 1 fence section. Drive through → boards scatter with spin physics. |
| **Controls** | Touch joystick (mobile) + WASD (desktop). Honk button. |
| **HUD** | Speed, delivery count, "Discoveries" counter. Minimal. |
| **Audio** | Engine hum, honk, chicken cluck, package pickup sound. Procedural. |

### What's NOT In (Post-MVP)

- Dogs, cats, birds, puddles, bunting, market carts, umbrellas, bicycles
- Multiple districts (just the one small loop)
- Any progression, scoring, or unlock system
- Day/night cycle
- Minimap
- Music
- Save system

### 1-Day Build Order

| Hour | Task |
|------|------|
| **0-2h** | Three.js scene setup. Flat ground, road texture, 4 box buildings. Car (box) with arcade driving + chase camera. Touch controls. |
| **2-4h** | Custom spring physics system. Traffic light (cycle + honk-to-green + bounce). Pedestrians (walk + dodge). |
| **4-6h** | Chickens (wander + scatter + instanced mesh). Package pickup/delivery. Mailbox flag spring. |
| **6-7h** | Trees (sway + collision shake). Fence (board scatter). Particle system for leaves. |
| **7-8h** | HUD overlay (Vue). Audio (procedural). Polish: camera smoothing, squash-stretch on car suspension. |

### MVP Success Criteria
- ✅ Drive around a small town loop
- ✅ Chickens scatter satisfyingly when you approach
- ✅ Honk at traffic light → it changes
- ✅ Pedestrians dodge and react
- ✅ Pick up and deliver one package
- ✅ Fence boards fly when you crash through
- ✅ **It feels good to just drive around** — the core promise

---

## 8. What Changed from v2 → v3

| Aspect | v2 | v3 |
|--------|----|----|
| **Focus** | Mission progression, stars, unlocks | Physics playground, feel-good interactions |
| **Map** | Elangoville (4 districts, progressive unlock) | Coimbingen (single open rural German town) |
| **Police** | Cop chases on reckless driving | ❌ Removed entirely |
| **Stars/Progression** | 1-3 stars per mission, unlock districts | ❌ Removed. Discoveries tracked for fun, no gates |
| **Upgrades** | Engine, tires, suspension, nitro | ❌ Removed. Car is what it is. |
| **Unlockables** | 5 vehicles | ❌ Removed. One car, one love. |
| **Missions** | Mission board, 5 types, timers | Ambient packages on porches. No timer, no pressure. |
| **Timer** | Countdown on every delivery | ❌ Removed. Deliver at your own pace. |
| **Pedestrians** | Dodge + speech bubbles | Dodge + wave + laugh. Feel-good, not stressful. |
| **Chickens** | Not in v2 | ✅ Added! Star interaction. |
| **Traffic lights** | Obstacle (wait or risk cops) | Interactive! Honk to change. Feel-good. |
| **Tone** | Chaotic delivery rush | Cozy exploration, delightful reactions |
| **Border** | Open map edges | Dense woods (natural, cozy boundary) |

---

*Elango Delivery v3 — A physics playground, not a complex sim. Drive, discover, delight.* 🚗🐔