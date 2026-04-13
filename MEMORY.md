# MEMORY.md — Mickey's Long-Term Memory

## Projects

### Playing Interval — The Secret of Moo Yang
- **Location:** `/home/poomk/.openclaw/workspace/playing-interval/`
- **Tech:** Vue 3 + Vite + Tailwind CSS 4
- **GitHub:** `https://github.com/drpoom/playing-interval`
- **Live:** `https://www.drpoom.com/playing-interval/`
- **Current version:** 1.27 (deployed 2026-04-13)
- **Status:** Ch1–Ch4 fully implemented and deployed. Sprint 1.27: QA, lore polish, accessibility.

**Chapter progress:**
- Ch1 (Prologue): Hotel → Tuktuk → BBQ → Victory ✅
- Ch2 (Electric Bill): Electric Bill → PEA Lobby → Rooftop Solar → Victory ✅
- Ch3 (The Investigation): PEA Substation → Lek's Stall → Rooftop Chase → Inspector → Victory ✅
- Ch4 (The Final Audit): ConfrontationScene → PEAHeadquartersScene → LeksRedemptionScene → EpilogueScene → Victory ✅
  - ConfrontationScene: Somchai dialogue tree, inspector interaction, somchai-statement pickup
  - PEAHeadquartersScene: 3-field form puzzle with sequential validation
  - LeksRedemptionScene: 3-choice fate dialogue (redeemed/fled/unknown)
  - EpilogueScene: Conditional outcomes, thermal synergy display
  - Bug fixes: duplicate flag key merged, chapter4Complete uses set-flag, somchaiStatement achievement flag, Ch4 rejections, sequential form validation

**Key lessons learned:**
- Smart quotes (`'` `"` etc.) cause "Unterminated string constant" build errors in Vue SFCs — use backtick template literals
- Emoji characters in achievements.js can cause edit tool matching failures — use sed or simpler edit patterns
- App.vue refactored (Sprint 1.25): ITEM_COMBOS/EXAMINES/REJECTIONS/VALID_COMBO_TARGETS extracted to `src/data/gameData.js` (226 lines). App.vue reduced from 681 → 473 lines.
- Sprint 1.26-1.27: Dead code cleanup (auditFolder rejections removed), Ch4 achievement lore polished (7 strings updated to Hans voice), aria-labels added (5 scenes + 3 components, 27 total). Version 1.27 deployed.
- Scene skeletons work well for parallel workflow: Tech builds structure, Creative fills in dialogue/puzzles via spec doc
- **statSnapshot must mirror achievement conditions** — Any new achievement referencing `stats.X` requires `X` in the snapshot object
- **Prop naming conventions** — App.vue uses kebab-case (`selected-item-id`) → `selectedItemId` in components. Skeletons must match exactly.
- **Creative blocker escalation** — If spec doesn't arrive next sprint, Tech should write it directly
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