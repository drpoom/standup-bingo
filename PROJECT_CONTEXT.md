# Project Context

## Active Projects

### OpenClaw Workspace
- **Tech Stack**: Vue 3, Vite, Tailwind CSS 4
- **Purpose**: AI agent workspace and development environment
- **Entry Point**: `/home/poomk/.openclaw/workspace`

## Directory Structure Overview

```
~/.openclaw/
├── workspace/          # Main development workspace
│   ├── AGENT_RULES.md  # Agent coordination rules
│   └── PROJECT_CONTEXT.md  # This file
├── agents/
│   └── coder/
│       └── agent/
│           └── config.json  # Byte's configuration
├── openclaw.json       # Main OpenClaw configuration
└── skills/             # Agent skills
```

## Entry Points and Key Files

- **Main Config**: `~/.openclaw/openclaw.json`
- **Byte Config**: `~/.openclaw/agents/coder/agent/config.json`
- **Workspace**: `~/.openclaw/workspace/`
- **Skills**: `~/.openclaw/workspace/skills/`

## Recent Git Activity

```
e6e1749 📋 Added Rule 12: Build Verification Gate — MUST run npm run build before announcing completion
b2f7765 AI Mega-Analysis Complete: 67 companies, 10 layers, Top 3 Dhandho picks
eca3419 Remove TOOLS.md from git tracking (contains secrets)
b7f7baa Add TOOLS.md to .gitignore (contains API tokens)
7e9373b wiki: compile 05344d29-5b5f-45f6-8813-62270293eceb → 2026-05-06-ollama
d7536cf wiki: compile b8f0fc27-7db1-4116-b548-d387dee5d34b → 2026-05-06-vue
849f8a5 wiki: compile b22fedf5-6fbe-4a9b-9067-049ef9f8d0ce → 2026-05-06-openclaw-05
32116ec wiki: compile b22fedf5-6fbe-4a9b-9067-049ef9f8d0ce → 2026-05-06-openclaw-04
aacb43b wiki: compile 05344d29-5b5f-45f6-8813-62270293eceb → 2026-05-06-openclaw-03
97d4574 wiki: compile 05344d29-5b5f-45f6-8813-62270293eceb → 2026-05-06-openclaw-02
```

## Build Commands and Deployment Targets

- **Install**: `npm install`
- **Build**: `npm run build`
- **Dev Server**: `npm run dev`
- **Test**: `npm run test` (Playwright E2E)
- **Lint**: `npm run lint`

## Agent Configuration

- **Primary Agent**: Byte (coder) - ollama/qwen3.5:cloud
- **QA Agent**: Scout - ollama/glm-5.1:cloud
- **Orchestrator**: Mickey (main) - ollama/qwen3.5:cloud

## Skills Enabled

- coding-agent (Claude Code CLI integration)
- github (gh CLI for issues, PRs, CI)
- tmux (remote terminal sessions)
- video-frames (ffmpeg frame extraction)
- filesystem (advanced file operations)
- core (reference tools)
