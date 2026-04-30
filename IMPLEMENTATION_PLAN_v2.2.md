# IMPLEMENTATION_PLAN_v2.2.md

> Phased blueprint for Byte — each task targets 1–2 files, ~10 min work.
> Tasks marked with 🎨 need Sashay's custom assets before they can be completed.

---

## PHASE 1 — Gamified Lobby (High Impact)

**Goal:** Make the lobby feel like a game, not a signup form.

### Task 1.1: Add Background Pattern
- **File:** `src/styles/main.css`
- **Change:** Replace the flat `bg-slate-50` lobby background with a subtle animated gradient (e.g. `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)`) and a faint grid-dot pattern overlay. Add a `.lobby-bg` utility class.
- **Complexity:** Low
- **Done when:** Lobby page has a dark, atmospheric background instead of plain white.

### Task 1.2: Glassmorphism Cards
- **File:** `src/components/LobbyScreen.vue`
- **Change:** Replace `bg-white rounded-xl shadow-lg` on the How-to-Play, Join Form, and Lobby cards with `bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl` glassmorphism style. Add a `.glass-card` class in `main.css`.
- **Complexity:** Low
- **Done when:** All lobby cards have a frosted-glass look with blur and translucency.

### Task 1.3: Player Cards Redesign
- **File:** `src/components/LobbyScreen.vue`
- **Change:** Transform the player list (`v-for player in players`) from flat rows into styled "player cards" — each player gets a card with their `PlayerAvatar` larger (56px), name, host badge, and a prominent ready/not-ready indicator (green pulse dot ✅ or grey dot ⬜). Arrange in a 2-column grid on desktop, 1-column on mobile.
- **Complexity:** Medium
- **Done when:** Each player renders as a distinct card with avatar, name, host badge, and animated ready status.

### Task 1.4: Visual "How to Play" Steps
- **File:** `src/components/LobbyScreen.vue`
- **Change:** Replace the numbered `<ol>` with a horizontal step-by-step visual: 4 icon boxes in a row (Join → Wait → Mark → Win), each with a large emoji/icon and short label. Use `flex` layout with connecting arrows (→) between steps.
- **Complexity:** Low
- **Done when:** How to Play section shows 4 illustrated steps in a row, not a numbered text list.

### Task 1.5: Waiting Room Pulse Animation
- **File:** `src/styles/main.css`, `src/components/LobbyScreen.vue`
- **Change:** Add a pulsing "bingo ball" animation (CSS keyframes `pulse` on a 🎱 or 🟢 element) that appears in the lobby header when the player has joined and is waiting for the host to start. Show "Waiting for host…" text with the pulsing indicator.
- **Complexity:** Low
- **Done when:** After joining, lobby shows an animated waiting indicator instead of static text.

---

## PHASE 2 — Theme-Driven UI (High Impact)

**Goal:** The entire UI (not just the card) should reflect the selected theme before the game starts.

### Task 2.1: CSS Custom Properties from Theme
- **File:** `src/data/themes.js`, `src/styles/main.css`
- **Change:** Add a `cssVars` mapping to each theme object in `themes.js` that outputs CSS custom properties (e.g. `--bg`, `--card`, `--text`, `--accent`, `--marked`, `--border`, `--font`). In `main.css`, define `:root` defaults from the "default" theme. Add a `:root` override approach documented as a comment.
- **Complexity:** Low
- **Done when:** Each theme has a `cssVars` object; `main.css` has `:root` variables matching the default theme.

### Task 2.2: Apply Theme to Root Element
- **File:** `src/App.vue`
- **Change:** When a theme is selected (in lobby or game), apply its CSS custom properties to `document.documentElement.style` so all components inherit theme colors via `var(--accent)`, etc. Add a `watch` or `onMounted` that reacts to theme changes.
- **Complexity:** Medium
- **Done when:** Switching themes in the lobby immediately changes the page background, card colors, and accent colors globally.

### Task 2.3: Theme-Driven Lobby Background
- **File:** `src/components/LobbyScreen.vue`
- **Change:** Replace hardcoded `bg-slate-50` with `style="background: var(--bg)"` so the lobby background adapts to the selected theme. The glass cards (Task 1.2) will now float on the theme-colored background.
- **Complexity:** Low
- **Done when:** Selecting "Neon Night" turns the lobby dark; "Zen Garden" makes it warm pastel.

### Task 2.4: Theme-Driven Typography
- **File:** `src/App.vue`, `src/styles/main.css`
- **Change:** Set `font-family: var(--font)` on the body. Add Google Font imports for `Orbitron` (Cyberpunk), `Quicksand` (Zen), `VT323` (Retro), and `JetBrains Mono` (Embedded). Each theme's `--font` variable maps to its font stack.
- **Complexity:** Low
- **Done when:** Selecting "CRT Terminal" uses VT323 everywhere; "Zen Garden" uses Quicksand.

### Task 2.5: Theme Picker Visual Upgrade
- **File:** `src/components/ThemePicker.vue`
- **Change:** Replace the emoji icons with theme-colored preview swatches. Each theme button shows a mini color palette (3–4 dots using the theme's `accent`, `marked`, `bg` colors) alongside the name. Selected theme gets a glow border matching `var(--accent)`.
- **Complexity:** Medium
- **Done when:** Theme picker shows color swatches per theme; selected theme has a glowing accent border.

---

## PHASE 3 — Visual Juice & Feedback (Medium Impact)

**Goal:** Add satisfying micro-interactions and celebratory effects.

### Task 3.1: Mark Pop Animation
- **File:** `src/components/BingoSquare.vue`, `src/styles/main.css`
- **Change:** When a square is marked, trigger a CSS `pop` animation (scale 0 → 1.15 → 1 with a slight bounce). Add a brief `box-shadow` burst in the theme accent color. Use a `.just-marked` class toggled for 300ms.
- **Complexity:** Low
- **Done when:** Clicking an unmarked square shows a satisfying pop + shadow burst; clicking a marked square shows no animation.

### Task 3.2: Mark Sound Effect
- **File:** `src/composables/useSoundEffects.js`
- **Change:** Add a short "stamp" sound (use a free SFX or generate a tone with Web Audio API). Play it on square mark. Respect the existing mute toggle.
- **Complexity:** Medium
- **Done when:** Marking a square plays a stamp sound; muting silences it.

### Task 3.3: BINGO Celebration Upgrade
- **File:** `src/components/WinOverlay.vue`, `src/styles/main.css`
- **Change:** Add a screen-shake keyframe (`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }`) applied to the overlay container for 400ms on appear. Add a confetti burst using the existing `useConfetti` composable (trigger on mount).
- **Complexity:** Medium
- **Done when:** Winning triggers screen shake + confetti + the existing bounce-in card.

### Task 3.4: Button Hover Effects
- **File:** `src/styles/main.css`
- **Change:** Add a `.btn-game` utility class with a lift-on-hover (`transform: translateY(-2px)`) and a glow shadow matching `var(--accent)`. Apply to Join, Start Game, and Ready buttons.
- **Complexity:** Low
- **Done when:** All primary buttons lift and glow on hover.

### Task 3.5: Theme-Specific Hover Effects
- **File:** `src/styles/main.css`
- **Change:** Add theme-specific hover classes: `.theme-cyberpunk .btn-game:hover` gets a glitch effect (brief `skewX` + `clip-path`), `.theme-retro .btn-game:hover` gets a CRT scanline flash, `.theme-zen .btn-game:hover` gets a soft scale + fade.
- **Complexity:** Medium
- **Done when:** Hovering buttons in Cyberpunk theme shows a glitch; Retro shows scanlines; Zen shows a gentle pulse.

---

## PHASE 4 — Custom Icons & Assets (Medium Impact)

**Goal:** Replace emoji placeholders with cohesive SVG icons and themed markers.

### Task 4.1: SVG Icon Set for Categories
- **File:** `src/assets/icons/` (new directory), `src/components/ThemePicker.vue`
- **Change:** 🎨 Create or source a minimal SVG icon set for each theme (briefcase for General Dev, circuit board for Embedded, bug for QA, neon eye for Cyberpunk, terminal for Retro, lotus for Zen). Replace `getThemeEmoji()` with `<img :src="iconUrl">` from the assets folder.
- **Complexity:** Medium
- **Depends on:** Sashay's SVG assets 🎨
- **Done when:** Theme picker and category labels use SVG icons instead of emojis.

### Task 4.2: Themed Bingo Markers
- **File:** `src/components/BingoSquare.vue`
- **Change:** 🎨 Replace the generic `✓` checkmark with theme-specific marker overlays: neon chip (Cyberpunk), pebble/stone (Zen), pixel dot (Retro), circuit node (Embedded), stamp (Default). Use CSS `::after` with a background-image from `src/assets/markers/`.
- **Complexity:** Medium
- **Depends on:** Sashay's marker assets 🎨
- **Done when:** Marked squares show theme-appropriate markers instead of a generic checkmark.

### Task 4.3: How-to-Play Custom Icons
- **File:** `src/components/LobbyScreen.vue`
- **Change:** 🎨 Replace the step emojis (1️⃣ 2️⃣ 3️⃣ 4️⃣) from Task 1.4 with custom SVG step icons: door/enter (Join), clock (Wait), stamp (Mark), trophy (Win). Store in `src/assets/icons/steps/`.
- **Complexity:** Low
- **Depends on:** Sashay's step icons 🎨
- **Done when:** How-to-Play uses branded SVG icons for each step.

### Task 4.4: Player Avatar Theme Variants
- **File:** `src/components/PlayerAvatar.vue`
- **Change:** Map each theme to a DiceBear style variant: default → `avataaars`, cyberpunk → `bottts`, retro → `pixel-art`, zen → `lorelei`, embedded → `identicon`. Pass the current theme's avatar style so avatars match the game vibe.
- **Complexity:** Low
- **Done when:** In a Cyberpunk game, all player avatars render as bottts; in Zen, as lorelei.

---

## Dependency Map

```
Phase 1 (Lobby) → Phase 2 (Theme) → Phase 3 (Juice) → Phase 4 (Icons)
     │                  │                  │                 │
     1.1─1.5           2.1─2.5           3.1─3.5           4.1─4.4
                        │                                     │
                   2.1 must come first                    4.1, 4.2, 4.3
                   (CSS vars needed)                    need Sashay's assets 🎨
```

## Asset Blockers (🎨 needs Sashay)

| Task | Asset Needed | Fallback |
|------|-------------|----------|
| 4.1 | 5 theme SVG icons (briefcase, circuit, bug, eye, terminal, lotus) | Keep emojis temporarily |
| 4.2 | 5 marker SVGs (chip, pebble, pixel, node, stamp) | Keep ✓ checkmark temporarily |
| 4.3 | 4 step SVGs (door, clock, stamp, trophy) | Keep emoji numbers temporarily |

**Fallback strategy:** Byte can implement all CSS/animation/structural changes first using existing emojis. Swap in Sashay's SVGs when delivered — no rework needed.

---

## Quick-Start Order for Byte

1. **Task 1.1** → 1.2 → 1.3 → 1.4 → 1.5 (lobby feels alive)
2. **Task 2.1** → 2.2 → 2.3 → 2.4 → 2.5 (theme drives everything)
3. **Task 3.1** → 3.2 → 3.3 → 3.4 → 3.5 (juice & feedback)
4. **Task 4.4** (avatar variants — no asset blocker)
5. **Tasks 4.1, 4.2, 4.3** (swap SVGs when Sashay delivers)

Total: ~20 tasks, ~3.5 hours estimated. All phases can be demoed independently.