# Creative Assets Documentation

## SVG Icon Sets

### 1. Theme Category Icons (`src/assets/icons/categories/`)
Used in the Theme Picker and category labels.
- `general.svg`: Briefcase/General Dev
- `embedded.svg`: Circuit/Embedded
- `qa.svg`: Bug/QA
- `cyberpunk.svg`: Neon Eye/Cyberpunk
- `retro.svg`: Terminal/Retro
- `zen.svg`: Lotus/Zen

### 2. Theme-Specific Markers (`src/assets/markers/`)
Used as overlays for marked bingo squares.
- `default-marker.svg`: Clean checkmark circle
- `embedded-marker.svg`: Circuit node/chip
- `cyberpunk-marker.svg`: Tech glyph/diamond
- `qa-marker.svg`: Bug/check hybrid
- `zen-marker.svg`: Pebble/stone
- `retro-marker.svg`: Pixel block

### 3. UI Icon Set (`src/assets/icons/ui/`)
General application controls.
- `settings.svg`, `mute.svg`, `copy.svg`, `download.svg`, `upload.svg`, `transfer.svg`, `start.svg`, `end.svg`

### 4. How-to-Play Step Icons (`src/assets/icons/steps/`)
Visual guide for the lobby.
- `join.svg`: Door/Enter
- `wait.svg`: Clock/Timer
- `mark.svg`: Stamp/Check
- `win.svg`: Trophy/Victory

## DiceBear Avatar Recommendations

To match the theme's vibe, the following DiceBear styles are recommended:

| Theme | DiceBear Style | Vibe |
|---|---|---|
| Default | `avataaars` | Friendly, modern, standard |
| Cyberpunk | `bottts` | Robotic, futuristic, techy |
| Retro | `pixel-art` | 8-bit, nostalgic, gaming |
| Zen | `lorelei` | Artistic, soft, minimalist |
| Embedded | `identicon` | Abstract, technical, unique |
| QA/Test | `avataaars` | Professional, clear |

## Implementation Notes
- All SVGs use `currentColor` for fill/stroke to allow easy CSS theming.
- Sized at 32x32px for consistency.
- Format: Standalone SVG files for easy import in Vue.
