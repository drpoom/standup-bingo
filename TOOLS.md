# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### Sudo

- Password: `!4qrafzv`
- **Authorized for:** Gateway restarts, OpenClaw troubleshooting, network config changes
- **No permission needed** for these operational tasks
- ⚠️ Still ask before: destructive operations, system-wide changes, external actions

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## GitHub

- **PAT:** `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`
- **Username:** drpoom
- **Repos:** elango-surfers, moonlanding

## Replicate
- **API Key:** `r8_aSwjYr3vNQBUYWpN5i0s2zoRIHpMW7K2Qwjg3`
- **Use for:** Image generation (Flux Schnell, Flux Pro)

## PyPI
- **API Token:** `pypi-AgEIcHlwaS5vcmcCJDg1YzllMDVjLWUzNmQtNDk4MS05ODA3LTA0NTA5NDAwOTUzNAACKlszLCIxMmY5MjBhNi01NGYwLTRkY2EtYjk1Mi0yY2E3ZTY2NjNmZWUiXQAABiCGmteV3pI2wJ48e3SjhoNhbzMIY0eV6bngmzQW_saXdg`
- **Use for:** Publishing `cobra-bridge` package
- ⚠️ Never commit to repo — workspace only

## npm
- **Auth Token:** `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`
- **Use for:** Publishing `cobra-bridge` package
- ⚠️ Never commit to repo — workspace only

---

Add whatever helps you do your job. This is your cheat sheet.
