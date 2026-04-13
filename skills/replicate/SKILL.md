# Replicate Image Generation Skill

Generate images using the Replicate API (Flux models).

## Setup
- API key is in TOOLS.md under "Replicate"
- Model: `black-forest-labs/flux-schnell` (fast, free tier) or `black-forest-labs/flux-pro` (higher quality, paid)

## Quick Usage

```bash
# Fast generation (Flux Schnell — ~4 seconds)
node ~/.openclaw/workspace/skills/replicate/scripts/generate.js "your prompt here"

# High quality (Flux Pro — ~10 seconds)
node ~/.openclaw/workspace/skills/replicate/scripts/generate.js "your prompt here" --model pro

# Custom output path
node ~/.openclaw/workspace/skills/replicate/scripts/generate.js "your prompt here" --output /path/to/output.png
```

## Script Details
- `scripts/generate.js` — Node.js script that calls the Replicate API
- Reads API key from `~/.openclaw/workspace/TOOLS.md` (line matching `API Key:` under Replicate section)
- Default output: `~/.openclaw/workspace/generated-assets/` (auto-created)
- Returns: local file path + temporary URL

## Prompt Guidelines for Game Assets
Use structured prompts for best results:
```
[Subject], [Style/Medium], [Lighting], [Composition], [Technical Keywords]
```

Examples:
- `"A 2D cartoon Shiba Inu robot dog, pixel art style, bright colors, game sprite, transparent background"`
- `"A Thai BBQ street stall at night, watercolor illustration, warm amber lighting, isometric view, game background asset"`
- `"A German engineer in a hotel room, cartoon adventure game style, warm lighting, close-up portrait, pixel art"`

## Important
- Flux Schnell is free-tier friendly; Flux Pro costs per run
- Generated images go to `generated-assets/` — commit them to the repo if they're final
- For game sprites, add "transparent background" or "sprite sheet" to prompts