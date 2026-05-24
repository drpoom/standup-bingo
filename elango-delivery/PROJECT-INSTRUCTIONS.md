# Elango Delivery — Project Instructions

> **Persistent guidelines for all future iterations.**  
> Read this before every task. These rules are non-negotiable.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Name** | Elango Delivery |
| **Repo** | `github.com/drpoom/elango-delivery` |
| **Genre** | Physics playground / casual delivery |
| **Style** | Low-poly, cartoonish, family-friendly |
| **Setting** | Coimbingen — rural German town bordered by woods |
| **Target** | Mobile browser, 60 FPS |

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| 3D Engine | **Three.js** (r170+) | Use `three` npm package |
| UI Framework | **Vue 3** (Composition API) | `<script setup>` syntax |
| Build Tool | **Vite** 6+ | HMR, tree-shaking, code-splitting |
| Styling | **Tailwind CSS 4** | `@tailwindcss/vite` plugin |
| Language | **TypeScript** | Strict mode, no `any` |
| Testing | **Playwright** | Browser-based E2E, <1 min per test |
| CI/CD | **GitHub Actions** | Tag-triggered deploy |

## 3. Architecture Principles

1. **File size cap**: No source file exceeds **1000 lines**. Split before hitting the limit.
2. **Component isolation**: Each Vue component owns its own `.vue` file; composables live in `src/composables/`.
3. **Three.js scene graph**: One `SceneManager` singleton; objects register/deregister via `SceneObject` interface.
4. **Physics**: Use a lightweight physics engine (Cannon-es or Rapier WASM). Physics runs in a fixed-timestep loop decoupled from rendering.
5. **Mobile-first**: Touch controls are primary; keyboard is fallback. All UI must work at 375×667 viewport.
6. **Performance budget**: 60 FPS on mid-range mobile. Profile with Chrome DevTools; regressions block merge.

## 4. Directory Structure

```
elango-delivery/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── public/
│   ├── models/                 # .glb low-poly models
│   ├── textures/               # .webp textures
│   ├── audio/
│   │   ├── bgm/                # Background music loops
│   │   └── sfx/                # Sound effects
│   └── favicon.ico
├── src/
│   ├── assets/                 # Static imports (icons, etc.)
│   ├── components/             # Vue 3 SFCs
│   │   ├── ui/                 # HUD, menus, buttons
│   │   └── game/               # In-game overlays
│   ├── composables/            # Vue composables
│   │   ├── useGameLoop.ts
│   │   ├── useInput.ts
│   │   └── usePhysics.ts
│   ├── config/                 # Game constants, tuning
│   │   ├── vehicles.ts
│   │   ├── physics.ts
│   │   └── map.ts
│   ├── game/                   # Core game logic
│   │   ├── SceneManager.ts
│   │   ├── PhysicsWorld.ts
│   │   ├── Vehicle.ts
│   │   └── entities/           # Chickens, pedestrians, etc.
│   ├── scenes/                 # Three.js scene definitions
│   │   └── Coimbingen/
│   │       ├── buildings.ts
│   │       ├── roads.ts
│   │       ├── woods.ts
│   │       └── index.ts
│   ├── utils/                  # Pure helpers
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── tests/
│   └── e2e/
│       ├── driving.spec.ts
│       ├── map.spec.ts
│       ├── interactions.spec.ts
│       └── performance.spec.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 5. Team Roles & Responsibilities

| Agent | Emoji | Role | Duties |
|---|---|---|---|
| **Archie** | 📐 | Architect | Task decomposition, analysis, architecture decisions |
| **Byte** | ⚡ | Implementer | Code implementation, clean & <1000 lines/file |
| **Sashay** | 🎨 | Artist | Assets: 3D models, textures, BGM, SFX |
| **Scout** | 🔍 | Tester | Playwright E2E tests, <1 min each |

### Quality Gate Flow

```
Feature request
    │
    ▼
Archie decomposes → atomic tasks
    │
    ▼
Byte implements → code
    │
    ▼
Scout tests → pass? ──yes──→ merge
    │                        │
    no                       ▼
    │                    deploy (on tag)
    ▼
Archie analyzes failure
    │
    ▼
Byte fixes → Scout retests
```

## 6. Git Conventions

- **Branch naming**: `feat/<phase>-<task-number>-<short-name>` (e.g., `feat/1-03-vehicle-physics`)
- **Commit messages**: Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `asset:`)
- **Tags**: `v0.0.1`, `v0.1.0`, etc. — tags trigger CI/CD deploy
- **PRs**: Squash-merge to `main`. All tests must pass.

## 7. Performance Targets

| Metric | Target |
|---|---|
| Frame time | ≤ 16.67 ms (60 FPS) |
| First paint | < 2 s on 4G |
| Bundle size (gzipped) | < 500 KB initial load |
| Draw calls | < 100 per frame |
| Physics step | ≤ 2 ms |

## 8. Mobile-Specific Rules

- Touch controls: virtual joystick (left) + action buttons (right)
- No hover states — all interactions are tap/hold
- Viewport: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`
- Audio: autoplay blocked on mobile; require user tap to start BGM
- Memory: dispose Three.js geometries/materials/textures when unmounted

## 9. Accessibility

- Minimum touch target: 44×44 px
- Color contrast: WCAG AA (4.5:1 for text)
- Screen reader: aria-labels on all interactive elements
- Reduced motion: respect `prefers-reduced-motion`

## 10. Iteration Protocol

Each iteration follows this cycle:

1. **Archie** decomposes the next feature into atomic tasks
2. **Byte** implements tasks in dependency order
3. **Sashay** provides assets as needed (can parallel with Byte)
4. **Scout** writes/updates tests for each completed task
5. **Scout** runs full suite — all must pass
6. If tests fail → **Archie** triages → **Byte** fixes → **Scout** retests
7. All green → tag → CI/CD deploys

---

*Last updated: 2026-05-24*