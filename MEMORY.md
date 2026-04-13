# MEMORY.md — Mickey's Long-Term Memory

## Projects

### Playing Interval — The Secret of Moo Yang
- **Location:** `/home/poomk/.openclaw/workspace/playing-interval/`
- **Tech:** Vue 3 + Vite + Tailwind CSS 4
- **GitHub:** `https://github.com/drpoom/playing-interval`
- **Live:** `https://www.drpoom.com/playing-interval/`
- **Current version:** 1.21 (deployed)
- **Status:** Ch1–Ch3 complete and deployed. Sprint 1.21 Phase 1 (Ch4 infrastructure) complete. Phase 2 blocked on chapter4_scenes.md.

**Chapter progress:**
- Ch1 (Prologue): Hotel → Tuktuk → BBQ → Victory ✅
- Ch2 (Electric Bill): Electric Bill → PEA Lobby → Rooftop Solar → Victory ✅
- Ch3 (The Investigation): PEA Substation → Lek's Stall → Rooftop Chase → Inspector → Victory ✅
- Ch4 (The Final Audit): Creative spec written, scene skeletons deployed. 4 scenes scaffolded (ConfrontationScene, PEAHeadquartersScene, LeksRedemptionScene, EpilogueScene). Phase 2 implementation blocked on chapter4_scenes.md detailed spec.

**Key lessons learned:**
- Smart quotes (`'` `"` etc.) cause "Unterminated string constant" build errors in Vue SFCs — use backtick template literals
- Emoji characters in achievements.js can cause edit tool matching failures — use sed or simpler edit patterns
- App.vue is getting large (~620 lines) — consider splitting ITEM_COMBOS/EXAMINES/REJECTIONS into a separate data module
- Scene skeletons work well for parallel workflow: Tech builds structure, Creative fills in dialogue/puzzles via spec doc
- `DIALOGUE_NODES` must be `computed(() => [...])` not `const [...]` for reactive flag references
- Combo `pickup` field is essential when a flag-gating item needs to be in inventory later
- Always verify bidirectional navigation — dead-ends occur when scenes only have forward transitions
- `set-flag` emit avoids component remount when only flags need updating
- RhythmMinigame: use `touchHandled` flag to prevent double-fire on mobile (touchend + synthetic click)
- InspectorScene: initialize `presentedItems` from flags on mount + watch flags for combo-path sync
- Read component data BEFORE unmounting (v-if destroys the ref)

**Deployment:** `npm run build` → copy dist/ to gh-pages branch → force push

### Elango Surfers
- **Live:** `https://drpoom.github.io/elango-surfers/`
- **Status:** v3.7.9 — feature complete, visual upgrades done
- Standup Quests: v3.7.9 with animated backgrounds, score animations, circular timer, transitions, Hall of Fame

## People
- **John Poom (ลุงจอห์น)** — My human. System integration expert, tech enthusiast, investment hobbyist. Fluent Thai/German/English. Timezone: Europe/Berlin.

## Conventions
- Version format: `pi.sprint` (e.g., `1.20`)
- CC BY-NC-ND 4.0 license for Playing Interval
- Build output to `dist/` only, never delete root files
- Sprint mode: SEQUENTIAL when creative specs done, PARALLEL when creative has work pending