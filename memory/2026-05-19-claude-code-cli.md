# Claude Code CLI Setup — 2026-05-19

## Problem
Claude Code CLI was timing out because:
1. Environment variables not set (`ANTHROPIC_BASE_URL`, `ANTHROPIC_API_KEY`, `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`)
2. LiteLLM proxy config missing newer model name (`claude-opus-4-7`)

## Solution

### LiteLLM Proxy Configuration
- **Config file:** `~/.openclaw/litellm-config.yaml`
- **Port:** 4000
- **Model mappings:**
  - `claude-sonnet-4-6` → `ollama/glm-5.1:cloud` (analytical tasks)
  - `claude-opus-4-7` → `ollama/glm-5.1:cloud` (complex reasoning) ← **Added 2026-05-19**
  - `claude-opus-4-20250514` → `ollama/glm-5.1:cloud` (analytical tasks)
  - `claude-haiku-4-20250506` → `ollama/qwen3.5:cloud` (fast, simple tasks)

### Wrapper Script
Created `~/.openclaw/scripts/claude-code`:
- Auto-sets environment variables
- Auto-starts LiteLLM proxy if not running
- Passes all arguments to `claude` CLI

**Usage:**
```bash
~/.openclaw/scripts/claude-code --print --permission-mode bypassPermissions "<prompt>"
```

### Environment Variables
```bash
export ANTHROPIC_BASE_URL=http://localhost:4000
export ANTHROPIC_API_KEY=sk-fake-key
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```

## Management Commands

```bash
# Check proxy status
~/.openclaw/scripts/litellm-proxy.sh status

# Start proxy manually
~/.openclaw/scripts/litellm-proxy.sh start

# Stop proxy
~/.openclaw/scripts/litellm-proxy.sh stop

# View logs
tail -f /tmp/litellm.log
```

## Testing
```bash
# Test basic routing
~/.openclaw/scripts/claude-code --print --permission-mode bypassPermissions "What is 2+2? Answer with just the number."
# Expected: 4
```

## Integration with OpenClaw Team
- **Archie/Scout/Warren:** Use `glm-5.1:cloud` via Claude Code CLI for deep analytical work
- **Byte/Sashay:** Use `qwen3.5:cloud` for coding/creative tasks
- **Mickey:** Routes tasks based on complexity (Rule 11: 1-turn/1-tool-call limit)

## Lessons Learned
- Claude Code CLI model names change over time — monitor for new versions
- LiteLLM proxy must be running before Claude Code calls
- Wrapper script prevents environment variable mistakes
- `--permission-mode bypassPermissions` required for non-interactive use
