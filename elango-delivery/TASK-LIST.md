# Elango Delivery — Atomic Task List

> Numbered, sequential, with dependencies, estimated time (1–2 min each), and assigned agent.

---

## Phase 0: Project Scaffolding + Instructions

| # | Task | Depends On | Agent | Est. |
|---|---|---|---|---|
| 0-01 | Initialize Vite + Vue 3 + TypeScript project (`npm create vite@latest`) | — | Byte ⚡ | 1 min |
| 0-02 | Install core deps: `three`, `cannon-es`, `@tailwindcss/vite`, `tailwindcss` | 0-01 | Byte ⚡ | 1 min |
| 0-03 | Install dev deps: `playwright`, `@playwright/test`, `typescript`, `vite-plugin-glsl` | 0-01 | Byte ⚡ | 1 min |
| 0-04 | Configure `tsconfig.json` (strict mode, paths `@/*`) | 0-01 | Byte ⚡ | 1 min |
| 0-05 | Configure `vite.config.ts` (Vue plugin, Tailwind plugin, GLSL, dev server) | 0-02, 0-03 | Byte ⚡ | 1 min |
| 0-06 | Configure `tailwind.config.ts` (content paths, theme extensions for game colors) | 0-02 | Byte ⚡ | 1 min |
| 0-07 | Create directory structure per PROJECT-INSTRUCTIONS.md §4 | 0-01 | Byte ⚡ | 1 min |
| 0-08 | Create `src/main.ts` — mount Vue app, import global styles | 0-05 | Byte ⚡ | 1 min |
| 0-09 | Create `src/App.vue` — root layout with `<canvas>` container + `<RouterView>` | 0-08 | Byte ⚡ | 1 min |
| 0-10 | Create `index.html` — viewport meta for mobile, no-scroll body | 0-01 | Byte ⚡ | 1 min |
| 0-11 | Create `src/config/physics.ts` — physics constants (gravity, timestep, materials) | 0-07 | Byte ⚡ | 1 min |
| 0-12 | Create `src/config/vehicles.ts` — vehicle tuning params (speed, steering, mass) | 0-07 | Byte ⚡ | 1 min |
| 0-13 | Create `src/config/map.ts` — map dimensions, tile size, zone definitions | 0-07 | Byte ⚡ | 1 min |
| 0-14 | Create `src/style.css` — Tailwind directives + base game styles | 0-06 | Byte ⚡ | 1 min |
| 0-15 | Initialize Git repo, `.gitignore`, initial commit | 0-10 | Byte ⚡ | 1 min |
| 0-16 | Push to `github.com/drpoom/elango-delivery` | 0-15 | Byte ⚡ | 1 min |
| 0-17 | Write `README.md` — project overview, setup, run, test commands | 0-16 | Byte ⚡ | 1 min |

**Phase 0 Total: ~17 min**

---

## Phase 1: Core Driving Physics + Camera

| # | Task | Depends On | Agent | Est. |
|---|---|---|---|---|
| 1-01 | Create `src/game/PhysicsWorld.ts` — Cannon-es world, fixed-timestep loop, material table | 0-11 | Byte ⚡ | 2 min |
| 1-02 | Create `src/game/Vehicle.ts` — Raycast vehicle with Cannon-es, config from `vehicles.ts` | 1-01, 0-12 | Byte ⚡ | 2 min |
| 1-03 | Create `src/game/SceneManager.ts` — Three.js renderer, scene, clock, resize handler | 0-09 | Byte ⚡ | 2 min |
| 1-04 | Create `src/game/SceneObject.ts` — Interface for register/update/dispose lifecycle | 1-03 | Byte ⚡ | 1 min |
| 1-05 | Create `src/game/entities/VehicleMesh.ts` — Low-poly truck mesh synced to physics body | 1-02, 1-03, 1-04 | Byte ⚡ | 2 min |
| 1-06 | Create `src/composables/useGameLoop.ts` — requestAnimationFrame loop, delta time, pause/resume | 1-03 | Byte ⚡ | 1 min |
| 1-07 | Create `src/composables/useInput.ts` — Touch joystick + keyboard mapping, normalized input | 0-09 | Byte ⚡ | 2 min |
| 1-08 | Create `src/composables/usePhysics.ts` — Bridge between useGameLoop and PhysicsWorld step | 1-01, 1-06 | Byte ⚡ | 1 min |
| 1-09 | Create `src/game/CameraController.ts` — Third-person chase camera with smooth follow | 1-03, 1-05 | Byte ⚡ | 2 min |
| 1-10 | Create `src/components/game/GameCanvas.vue` — Mounts Three.js canvas, wires up game loop | 1-06, 1-08, 1-09 | Byte ⚡ | 2 min |
| 1-11 | Create `src/components/ui/TouchControls.vue` — Virtual joystick + action buttons overlay | 1-07 | Byte ⚡ | 2 min |
| 1-12 | Create `src/components/ui/HUD.vue` — Speedometer, gear indicator, minimap placeholder | 1-10 | Byte ⚡ | 1 min |
| 1-13 | Create ground plane: Three.js mesh + Cannon-es body (flat, large, green) | 1-01, 1-03 | Byte ⚡ | 1 min |
| 1-14 | Wire Vehicle → VehicleMesh → CameraController in GameCanvas | 1-05, 1-09, 1-10 | Byte ⚡ | 2 min |
| 1-15 | Add mobile viewport lock (prevent pinch-zoom, address bar resize) | 0-10 | Byte ⚡ | 1 min |
| 1-16 | Performance: throttle Three.js renderer to device pixel ratio ≤ 2 | 1-03 | Byte ⚡ | 1 min |

**Phase 1 Total: ~24 min**

---

## Phase 2: Coimbingen Map (Roads, Buildings, Woods Border)

| # | Task | Depends On | Agent | Est. |
|---|---|---|---|---|
| 2-01 | Create `src/scenes/Coimbingen/index.ts` — Scene orchestrator, loads all sub-modules | 1-03 | Byte ⚡ | 1 min |
| 2-02 | Create `src/scenes/Coimbingen/roads.ts` — Road network: main street, side streets, intersections | 2-01, 0-13 | Byte ⚡ | 2 min |
| 2-03 | Create `src/scenes/Coimbingen/buildings.ts` — Low-poly buildings: houses, shops, church, bakery | 2-01 | Byte ⚡ | 2 min |
| 2-04 | Create `src/scenes/Coimbingen/woods.ts` — Woods border: tree instances, ground texture, fog | 2-01 | Byte ⚡ | 2 min |
| 2-05 | Create `src/scenes/Coimbingen/decorations.ts` — Benches, flower boxes, street lamps, signs | 2-01 | Byte ⚡ | 1 min |
| 2-06 | Create `src/utils/geometryFactory.ts` — Reusable low-poly geometry builders (box, roof, tree) | 1-03 | Byte ⚡ | 2 min |
| 2-07 | Create `src/utils/instancedMesh.ts` — InstancedMesh helper for repeated objects (trees, fences) | 2-06 | Byte ⚡ | 1 min |
| 2-08 | Add road colliders to PhysicsWorld (static plane bodies for each road segment) | 2-02, 1-01 | Byte ⚡ | 1 min |
| 2-09 | Add building colliders to PhysicsWorld (static box bodies) | 2-03, 1-01 | Byte ⚡ | 1 min |
| 2-10 | Add woods boundary colliders (invisible walls at map edges) | 2-04, 1-01 | Byte ⚡ | 1 min |
| 2-11 | Create `src/scenes/Coimbingen/lighting.ts` — Ambient + directional light, shadow map config | 2-01 | Byte ⚡ | 1 min |
| 2-12 | Create `src/scenes/Coimbingen/skybox.ts` — Gradient sky dome or hemisphere light | 2-01 | Byte ⚡ | 1 min |
| 2-13 | Create `src/components/ui/Minimap.vue` — Top-down minimap with player dot | 2-01, 1-12 | Byte ⚡ | 2 min |
| 2-14 | Create `src/composables/useMinimap.ts` — Camera ortho-render to minimap texture | 2-13 | Byte ⚡ | 1 min |
| 2-15 | Integrate Coimbingen scene into GameCanvas, spawn vehicle at town square | 2-01, 1-14 | Byte ⚡ | 1 min |

**Phase 2 Total: ~20 min**

---

## Phase 3: Interactive Elements (Chickens, Pedestrians, Traffic Lights)

| # | Task | Depends On | Agent | Est. |
|---|---|---|---|---|
| 3-01 | Create `src/game/entities/Chicken.ts` — Physics body + wandering AI state machine | 1-01, 1-04 | Byte ⚡ | 2 min |
| 3-02 | Create `src/game/entities/ChickenMesh.ts` — Low-poly chicken mesh, walk/idle animations | 3-01, 2-06 | Byte ⚡ | 1 min |
| 3-03 | Create `src/game/entities/Pedestrian.ts` — Physics body + sidewalk pathing AI | 1-01, 1-04 | Byte ⚡ | 2 min |
| 3-04 | Create `src/game/entities/PedestrianMesh.ts` — Low-poly person mesh, walk cycle | 3-03, 2-06 | Byte ⚡ | 1 min |
| 3-05 | Create `src/game/entities/TrafficLight.ts` — State machine (red/yellow/green), timer config | 1-04 | Byte ⚡ | 1 min |
| 3-06 | Create `src/game/entities/TrafficLightMesh.ts` — 3D traffic light mesh with emissive materials | 3-05, 2-06 | Byte ⚡ | 1 min |
| 3-07 | Create `src/game/EntitySpawner.ts` — Spawns entities at defined positions, manages pool | 3-01, 3-03, 3-05 | Byte ⚡ | 2 min |
| 3-08 | Create `src/game/entities/DeliveryPackage.ts` — Collectible physics body + mesh | 1-01, 1-04 | Byte ⚡ | 1 min |
| 3-09 | Create `src/game/entities/Mailbox.ts` — Delivery target, glow effect on approach | 3-08, 1-04 | Byte ⚡ | 1 min |
| 3-10 | Create `src/composables/useDelivery.ts` — Package pickup/delivery logic, score tracking | 3-08, 3-09 | Byte ⚡ | 2 min |
| 3-11 | Create `src/components/ui/DeliveryHUD.vue` — Package count, destination arrow, score | 3-10 | Byte ⚡ | 1 min |
| 3-12 | Add chicken reaction: scatter when vehicle horn honks | 3-01, 1-07 | Byte ⚡ | 1 min |
| 3-13 | Add pedestrian reaction: dodge/yell when vehicle is close | 3-03, 1-07 | Byte ⚡ | 1 min |
| 3-14 | Add traffic light interaction: vehicle stops at red (AI check), player choice | 3-05, 1-02 | Byte ⚡ | 1 min |
| 3-15 | Create `src/game/entities/Dog.ts` — Chases vehicle briefly, barks, returns to spot | 1-01, 1-04 | Byte ⚡ | 2 min |
| 3-16 | Create `src/game/entities/DogMesh.ts` — Low-poly dog mesh | 3-15, 2-06 | Byte ⚡ | 1 min |
| 3-17 | Wire all entities into Coimbingen scene via EntitySpawner | 3-07, 2-15 | Byte ⚡ | 1 min |

**Phase 3 Total: ~22 min**

---

## Phase 4: Sashay Assets (BGM, SFX, Low-Poly Models)

| # | Task | Depends On | Agent | Est. |
|---|---|---|---|---|
| 4-01 | Create low-poly truck model (`.glb`) — delivery van, ~500 tris | 1-05 | Sashay 🎨 | 2 min |
| 4-02 | Create low-poly chicken model (`.glb`) — idle + walk poses, ~200 tris | 3-02 | Sashay 🎨 | 2 min |
| 4-03 | Create low-poly pedestrian models (`.glb`) — 3 variants, ~300 tris each | 3-04 | Sashay 🎨 | 2 min |
| 4-04 | Create low-poly traffic light model (`.glb`) — ~100 tris | 3-06 | Sashay 🎨 | 1 min |
| 4-05 | Create low-poly dog model (`.glb`) — ~250 tris | 3-16 | Sashay 🎨 | 2 min |
| 4-06 | Create low-poly package model (`.glb`) — ~50 tris | 3-08 | Sashay 🎨 | 1 min |
| 4-07 | Create low-poly mailbox model (`.glb`) — ~80 tris | 3-09 | Sashay 🎨 | 1 min |
| 4-08 | Create building textures — 4 wall types, 2 roof types (`.webp`, 256×256) | 2-03 | Sashay 🎨 | 2 min |
| 4-09 | Create ground/road textures — asphalt, cobblestone, grass, dirt (`.webp`, 256×256 tiled) | 2-02, 2-04 | Sashay 🎨 | 2 min |
| 4-10 | Create tree textures — 2 foliage types, bark (`.webp`, 128×128) | 2-04 | Sashay 🎨 | 1 min |
| 4-11 | Compose BGM loop — cheerful acoustic guitar, 30s seamless loop (`.ogg`, 128kbps) | — | Sashay 🎨 | 2 min |
| 4-12 | Create SFX: engine idle, engine rev, horn honk (`.ogg`, mono) | — | Sashay 🎨 | 1 min |
| 4-13 | Create SFX: chicken cluck, chicken scatter, dog bark (`.ogg`, mono) | 3-01, 3-15 | Sashay 🎨 | 1 min |
| 4-14 | Create SFX: pedestrian yell, package pickup, delivery ding (`.ogg`, mono) | 3-03, 3-10 | Sashay 🎨 | 1 min |
| 4-15 | Create SFX: traffic light click, ambient birds, wind (`.ogg`, mono) | 3-05 | Sashay 🎨 | 1 min |
| 4-16 | Create `src/game/AudioManager.ts` — Howler.js or Web Audio pool, BGM crossfade, SFX one-shot | 4-11 | Byte ⚡ | 2 min |
| 4-17 | Integrate `.glb` models via `src/utils/modelLoader.ts` (GLTFLoader + DRACO) | 4-01 | Byte ⚡ | 1 min |
| 4-18 | Replace all placeholder meshes with loaded `.glb` models | 4-17, 4-01..4-07 | Byte ⚡ | 2 min |
| 4-19 | Apply textures to buildings, roads, ground, trees | 4-08..4-10, 4-17 | Byte ⚡ | 2 min |
| 4-20 | Wire SFX to game events (horn, collision, pickup, delivery) | 4-12..4-15, 4-16 | Byte ⚡ | 1 min |

**Phase 4 Total: ~30 min**

---

## Phase 5: Scout Test Suite

| # | Task | Depends On | Agent | Est. |
|---|---|---|---|---|
| 5-01 | Configure Playwright: `playwright.config.ts`, base URL, mobile viewport, timeout 30s | 0-03 | Scout 🔍 | 1 min |
| 5-02 | Create `tests/e2e/smoke.spec.ts` — App loads, canvas renders, no console errors | 0-16 | Scout 🔍 | 1 min |
| 5-03 | Create `tests/e2e/driving.spec.ts` — Vehicle spawns, moves forward, turns, stops | 1-14 | Scout 🔍 | 2 min |
| 5-04 | Create `tests/e2e/driving.spec.ts` — Touch controls: joystick input moves vehicle | 1-11 | Scout 🔍 | 1 min |
| 5-05 | Create `tests/e2e/driving.spec.ts` — Camera follows vehicle, stays behind | 1-09 | Scout 🔍 | 1 min |
| 5-06 | Create `tests/e2e/map.spec.ts` — All buildings render, no missing meshes | 2-15 | Scout 🔍 | 1 min |
| 5-07 | Create `tests/e2e/map.spec.ts` — Road network is traversable end-to-end | 2-02 | Scout 🔍 | 1 min |
| 5-08 | Create `tests/e2e/map.spec.ts` — Woods border prevents vehicle escape | 2-10 | Scout 🔍 | 1 min |
| 5-09 | Create `tests/e2e/interactions.spec.ts` — Chickens scatter on horn | 3-12 | Scout 🔍 | 1 min |
| 5-10 | Create `tests/e2e/interactions.spec.ts` — Pedestrians dodge approaching vehicle | 3-13 | Scout 🔍 | 1 min |
| 5-11 | Create `tests/e2e/interactions.spec.ts` — Traffic light cycles red→yellow→green | 3-05 | Scout 🔍 | 1 min |
| 5-12 | Create `tests/e2e/interactions.spec.ts` — Package pickup adds to HUD count | 3-10 | Scout 🔍 | 1 min |
| 5-13 | Create `tests/e2e/interactions.spec.ts` — Delivery at mailbox increments score | 3-10 | Scout 🔍 | 1 min |
| 5-14 | Create `tests/e2e/performance.spec.ts` — 60 FPS for 5 seconds of driving | 1-14 | Scout 🔍 | 2 min |
| 5-15 | Create `tests/e2e/performance.spec.ts` — No memory leak: heap growth < 5 MB over 30s | 1-14 | Scout 🔍 | 2 min |
| 5-16 | Create `tests/e2e/accessibility.spec.ts` — Touch targets ≥ 44px, ARIA labels present | 1-11 | Scout 🔍 | 1 min |
| 5-17 | Create `tests/e2e/audio.spec.ts` — BGM starts on user tap, SFX plays on events | 4-16 | Scout 🔍 | 1 min |
| 5-18 | Add `npm test` script to `package.json` (runs Playwright headless) | 5-01 | Scout 🔍 | 1 min |
| 5-19 | Add `npm run test:ui` script (runs Playwright with UI mode) | 5-01 | Scout 🔍 | 1 min |

**Phase 5 Total: ~21 min**

---

## Phase 6: CI/CD + v0.0.1 Deploy

| # | Task | Depends On | Agent | Est. |
|---|---|---|---|---|
| 6-01 | Create `.github/workflows/ci.yml` — lint, type-check, build, test on push/PR | 5-18 | Byte ⚡ | 2 min |
| 6-02 | Add ESLint + Prettier config, integrate into CI | 0-01 | Byte ⚡ | 1 min |
| 6-03 | Add `npm run lint` and `npm run typecheck` scripts | 6-02 | Byte ⚡ | 1 min |
| 6-04 | Create `.github/workflows/deploy.yml` — deploy to GitHub Pages on tag `v*` | 6-01 | Byte ⚡ | 2 min |
| 6-05 | Create `vite.config.ts` base path config for GitHub Pages subpath | 6-04 | Byte ⚡ | 1 min |
| 6-06 | Create `public/CNAME` if custom domain needed | 6-04 | Byte ⚡ | 1 min |
| 6-07 | Create `404.html` redirect for SPA routing on GitHub Pages | 6-04 | Byte ⚡ | 1 min |
| 6-08 | Tag `v0.0.1` and push → verify CI green + deploy succeeds | 6-04, 5-02 | Byte ⚡ | 1 min |
| 6-09 | Create GitHub Release `v0.0.1` with changelog notes | 6-08 | Archie 📐 | 1 min |

**Phase 6 Total: ~11 min**

---

## Phase 7: Iteration Loop (Test Fail → Fix → Retest)

This phase is continuous. Each cycle follows:

| Step | Agent | Action |
|---|---|---|
| 7-01 | Scout 🔍 | Run full test suite |
| 7-02 | Scout 🔍 | Report failures with stack traces + screenshots |
| 7-03 | Archie 📐 | Analyze failure: root cause, which task/phase, dependency |
| 7-04 | Byte ⚡ | Implement fix (targeted, minimal change) |
| 7-05 | Scout 🔍 | Retest affected suite — must pass |
| 7-06 | Scout 🔍 | Run full suite — all must pass |
| 7-07 | Archie 📐 | If new feature request → decompose into new atomic tasks → back to Phase 1–4 |

**Iteration loop has no fixed time — it runs until stable.**

---

## Dependency Graph Summary

```
Phase 0 ──→ Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 5
                │            │            │            │
                └────────────┴────────────┘            │
                             │                          │
                          Phase 4 (assets) ─────────────┘
                                                      │
                                                   Phase 6 ──→ Phase 7
```

- **Phase 4** (Sashay assets) can run in parallel with Phases 2–3.
- **Phase 5** (Scout tests) starts as soon as Phase 1 features exist; grows incrementally.
- **Phase 6** requires all prior phases complete + all tests green.
- **Phase 7** is the ongoing maintenance loop.

---

## Total Estimated Time

| Phase | Tasks | Time |
|---|---|---|
| 0: Scaffolding | 17 | ~17 min |
| 1: Driving Physics | 16 | ~24 min |
| 2: Coimbingen Map | 15 | ~20 min |
| 3: Interactive Elements | 17 | ~22 min |
| 4: Sashay Assets | 20 | ~30 min |
| 5: Scout Tests | 19 | ~21 min |
| 6: CI/CD + Deploy | 9 | ~11 min |
| 7: Iteration Loop | ongoing | variable |
| **Total (Phases 0–6)** | **113** | **~145 min** |

---

*Last updated: 2026-05-24*