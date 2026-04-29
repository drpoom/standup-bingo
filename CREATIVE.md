# Standup Bingo — Creative Design & Flavor

This document defines the "fun" layer of Standup Bingo: the phrases, visual identity, progression systems, and celebration moments.

## 1. Bingo Phrase Expansion
The goal is a mix of "universal dev truths" and "relatable meeting pain."

### Categories & Examples
- **Status Updates**: The classic "I'm still on the same ticket" and "Almost done."
- **Tech Excuses**: "Works on my machine" and "It's a caching issue."
- **Meeting Classics**: "Can you see my screen?" and "Sorry, I was on mute."
- **Vague Answers**: "We're making progress" and "I'll look into it."
- **Standup Rituals**: Dog barking, background noise, and "Happy Monday!"
- **Chaos Events**: Unexpected outages and critical production bugs.

**Total Phrases**: 90+ (See `src/data/phrases.js`)

### Team Customization
Teams can add their own "inside jokes" via `team-config.json`. 
*Example: "Mentioned the legacy COBOL system" or "Someone mentions the coffee machine is broken."*

---

## 2. Visual Themes
Themes are unlockable skins that change the entire look and feel of the app.

| Theme | Vibe | Primary Colors | Font | Unlock Condition |
|-------|------|----------------|------|-------------------|
| **Corporate Clean** | Modern SaaS / Enterprise | Slate-50, Blue-500 | Inter | Default |
| **Neon Night** | Cyberpunk / Synthwave | Slate-900, Fuchsia-300 | JetBrains Mono | 3-Day Streak |
| **CRT Terminal** | 80s Mainframe / Fallout | Black, Matrix Green | Courier New | 5-Day Streak |
| **Zen Garden** | Minimalist / Organic | Warm White, Sage Green | Georgia | 7-Day Streak |

---

## 3. Celebration Effects
The "BINGO!" moment should feel like a victory.

### Visuals
- **Confetti**: High-density canvas confetti. 
  - *Default*: Multi-colored.
  - *Theme-based*: Neon colors for Cyberpunk, Green bits for Retro.
- **Winning Line Highlight**: The 5 squares that triggered the bingo pulse with a gold glow.
- **Victory Overlay**: A full-screen "BINGO!" banner with a random victory quote.

### Audio (Muteable)
- **Mark Sound**: A subtle "pop" or "click."
- **Bingo Sound**: A triumphant fanfare or a "Ding!"
- **Victory Quote**: Randomly selected from a list:
  - *"The Standup God smiles upon you!"*
  - *"Absolute Legend!"*
  - *"Meeting efficiency: 100%"*
  - *"You've conquered the standup!"*

### Team Celebration
When a player shares their "Brag Snippet" to Slack/Teams, it includes a formatted summary:
`🎉 BINGO! Alice achieved a 3-row win in 14 minutes! 🏆`

---

## 4. Unlockables & Progression
Players earn rewards based on their performance and consistency.

### Progression Path
- **Streaks**: Consecutive days played.
- **Total Bingos**: Lifetime count.
- **Achievements**: Specific milestones.

### Rewards
- **Card Backs**: 
  - *Default*: Simple blue pattern.
  - *Silver*: 10-day streak.
  - *Gold*: 50 total bingos.
  - *Holographic*: Completionist achievement.
- **Badges**: Small icons displayed next to the player's name on the results screen.
- **Themes**: Unlocked via streaks (see table above).

---

## 5. Achievements
A set of 12 fun, achievable milestones (See `src/data/achievements.js`).

- **Early Bird**: Bingo in < 5 mins.
- **Marathon**: 7-day streak.
- **Speed Demon**: Bingo in < 3 mins.
- **Completionist**: Mark all 24 squares.
- **Clutch**: Bingo in the final 60 seconds.

---

## 6. Card Back Designs
Visual styles for the back of the bingo cards.

- **Default**: Minimalist geometric pattern.
- **Silver**: Brushed metal texture.
- **Gold**: Polished gold foil.
- **Holographic**: Iridescent gradient that shifts on mouse move.
