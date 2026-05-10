---
name: illustrator
description: Generate images using Replicate API (Flux models) for game assets, illustrations, and visual content. Use when the user asks to generate, create, or draw images, artwork, game sprites, backgrounds, character art, or any visual content. Also triggers on phrases like "generate an image", "create art", "make a picture", "illustrate", "draw me".
---

# Illustrator — Image Generation via Replicate

## Setup

API key is stored in `TOOLS.md` under the Replicate section.

## Workflow

1. **Read the API key** from `TOOLS.md` (look for `Replicate` section, `API Key` field)
2. **Craft a prompt** based on the user's request. Enhance prompts with style guidance:
   - For game assets: add "colorful cartoon style, game asset, clean background, no text"
   - For realistic art: add "photorealistic, high detail"
   - For icons: add "flat icon design, simple, vibrant"
3. **Call the Replicate API** using `scripts/generate.sh`
4. **Download the result** and save to workspace
5. **Report back** with the file path and description

## Script: `scripts/generate.sh`

```bash
#!/bin/bash
# Usage: ./generate.sh <api_key> <prompt> [output_path] [model] [width] [height]
# model: flux-schnell (default, fast) or flux-pro (higher quality)
# Example: ./generate.sh r8_xxx "a cute shiba inu game character" ./output.png flux-schnell 512 512
```

Run: `bash scripts/generate.sh "$API_KEY" "$PROMPT" "$OUTPUT_PATH" "$MODEL" "$WIDTH" "$HEIGHT"`

## Models

| Model | Speed | Quality | Cost | Use For |
|-------|-------|---------|------|---------|
| `flux-schnell` | ~2s | Good | ~$0.003 | Quick iterations, game sprites |
| `flux-pro` | ~10s | Best | ~$0.05 | Final art, detailed illustrations |

## Prompt Tips

- Be specific: "a cartoon shiba inu wearing a blue cape, running pose, game character sprite, white background" > "dog"
- Add style: "pixel art", "watercolor", "3D render", "flat vector"
- Add negative context when needed: "no text, no watermark"
- For game assets, always include "transparent background" or "white background"
- For character sprites, specify the pose and angle

## Saving Results

Save generated images to: `/home/poomk/.openclaw/workspace/assets/`
Create the directory if it doesn't exist.