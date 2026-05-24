# Tool Call Leak Analysis — 2026-05-17

**Analyst:** Archie 📐  
**Status:** DECOMPOSE-ONLY (no fixes applied)

---

## Executive Summary

Tool call details are appearing in the Telegram chat because of the **`visibleReplies: "message_tool"`** setting in the `messages.groupChat` config, combined with the fact that this is a **direct (1:1) chat**, not a group chat. The setting only applies to group chats, so the actual leak mechanism for DMs is different — it's the **Telegram streaming preview** (draft mode) that shows tool progress lines during agent execution.

---

## Root Cause Analysis

### Primary Cause: Telegram Streaming Preview Shows Tool Progress

**Confidence: HIGH (85%)**

When Mickey processes a message, the Telegram channel plugin uses **streaming preview (draft mode)** to show progress. This draft message is edited in-place as the agent works, and it includes **tool progress lines** that show:
- Tool names being called (e.g., `sessions_list`, `memory_search`, `read`)
- Brief descriptions of tool activity
- Status indicators

The relevant config path is:
```
channels.telegram.streaming.preview.toolProgress (default: true)
channels.telegram.streaming.progress.toolProgress (default: true)
channels.telegram.streaming.preview.commandText (default: "raw")
```

**What the user sees:** While Mickey is processing, a Telegram message appears showing lines like:
```
🔍 sessions_list...
📄 memory_search...
```
These are the "tool progress" lines in the streaming preview draft.

### Secondary Factor: `visibleReplies: "message_tool"` in groupChat

**Current config:**
```json
"messages": {
  "groupChat": {
    "visibleReplies": "message_tool"
  }
}
```

This setting means:
- **In group chats**: Agent replies are NOT automatically sent to the group. Instead, the agent must use the `message` tool with `action=send` to post visible output. This is correct behavior for groups.
- **In direct chats (DMs)**: This setting has **no effect** because DMs use a different delivery path.

The `visibleReplies` setting controls whether the agent's final text reply is automatically delivered to the chat or suppressed (requiring the `message` tool instead). It does **NOT** control tool progress visibility.

### How `sourceReplyDeliveryMode` Works

From the OpenClaw source code analysis:

```javascript
// source-reply-delivery-mode.ts
function resolveSourceReplyDeliveryMode(params) {
  if (params.requested) return params.requested;
  if (isExplicitSourceReplyCommand(params.ctx)) return "automatic";
  
  const chatType = normalizeChatType(params.ctx.ChatType);
  let mode;
  if (chatType === "group" || chatType === "channel") {
    // Group/channel: "automatic" only if explicitly set, otherwise "message_tool_only"
    mode = (params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies) === "automatic" 
      ? "automatic" : "message_tool_only";
  } else {
    // Direct chat: "message_tool_only" only if explicitly set to "message_tool"
    mode = (params.cfg.messages?.visibleReplies ?? params.defaultVisibleReplies) === "message_tool" 
      ? "message_tool_only" : "automatic";
  }
  return mode;
}
```

**For this Telegram DM:**
- `chatType` = "direct" (not group/channel)
- `cfg.messages?.visibleReplies` = `undefined` (not set at top level)
- `cfg.messages?.groupChat?.visibleReplies` = `"message_tool"` (set, but only applies to groups)
- No harness default applies (not a Codex harness)
- **Result**: `mode = "automatic"` — agent replies are automatically delivered to the DM

This means the DM delivery mode is **automatic** — the agent's full reply (including any tool progress shown in streaming) goes directly to the Telegram chat.

---

## Specific Leak Patterns

### Pattern 1: Streaming Preview Tool Progress Lines
**What leaks:** Tool names and brief status during processing  
**Where visible:** As an edited Telegram message that updates in real-time  
**Example:** User sends "Check my message about the 3 companies" → sees a Telegram message being edited showing tool calls like `sessions_list`, `memory_search`, `read` as they execute

### Pattern 2: Silent Reply Rewrite
**What leaks:** When an agent returns `NO_REPLY` or empty, OpenClaw rewrites it to a human-friendly message  
**Where visible:** As a separate Telegram message  
**Example:** "No more to report from me." — previously identified and fixed by removing dead cron jobs  
**Config path:**
```javascript
const DEFAULT_SILENT_REPLY_REWRITE = {
  direct: true,   // ← DMs get rewritten silent replies
  group: false,
  internal: false
};
```

### Pattern 3: Subagent Completion Announcements
**What leaks:** When subagents complete, their results are delivered back to the parent session, which may include tool call details in the delivery message  
**Where visible:** As part of Mickey's synthesis message in the Telegram DM

---

## Configuration Audit

### Current `openclaw.json` Settings

| Setting | Value | Effect |
|---------|-------|--------|
| `messages.groupChat.visibleReplies` | `"message_tool"` | Groups: agent must use `message` tool to post. **No effect on DMs.** |
| `messages.visibleReplies` | *(not set)* | DMs: defaults to `"automatic"` — agent replies auto-delivered |
| `channels.telegram.streaming.preview.toolProgress` | *(default: true)* | **Tool progress lines shown in streaming preview** |
| `channels.telegram.streaming.preview.commandText` | *(default: "raw")* | **Shows raw command/exec text in preview** |
| `channels.telegram.streaming.progress.toolProgress` | *(default: true)* | **Tool progress lines shown in progress draft** |
| Silent reply rewrite (direct) | *(default: true)* | Empty/NO_REPLY gets rewritten to friendly text in DMs |

### What's NOT Configured (But Should Be Considered)

| Setting | Current Default | Recommendation |
|---------|----------------|----------------|
| `channels.telegram.streaming.preview.toolProgress` | `true` | Set to `false` to hide tool progress from preview |
| `channels.telegram.streaming.preview.commandText` | `"raw"` | Set to `"status"` to show only tool labels, not full commands |
| `channels.telegram.streaming.progress.toolProgress` | `true` | Set to `false` to hide tool progress from progress draft |
| `messages.visibleReplies` | *(not set, defaults to "automatic")* | Leave as-is for DMs (automatic delivery is correct) |

---

## Recommended Fixes (NOT APPLIED)

### Fix 1: Disable Tool Progress in Streaming Preview (RECOMMENDED)
Add to `openclaw.json` under `channels.telegram`:
```json
{
  "streaming": {
    "preview": {
      "toolProgress": false
    },
    "progress": {
      "toolProgress": false
    }
  }
}
```
**Effect:** Tool progress lines will no longer appear in the Telegram draft message. The user will only see the final reply.

### Fix 2: Change Command Text to "status" Mode (MODERATE)
```json
{
  "streaming": {
    "preview": {
      "toolProgress": true,
      "commandText": "status"
    },
    "progress": {
      "toolProgress": true,
      "commandText": "status"
    }
  }
}
```
**Effect:** Tool progress still shows, but only as brief status labels (e.g., "Working..." instead of full command details).

### Fix 3: Disable Silent Reply Rewrite for DMs (OPTIONAL)
This was already partially addressed by removing dead cron jobs, but to fully prevent "No more to report" messages:
```json
{
  "channels": {
    "telegram": {
      "silentReplyRewrite": {
        "direct": false
      }
    }
  }
}
```
**Effect:** `NO_REPLY` will not be rewritten to friendly text in DMs. The user simply won't see a message.

---

## Confidence Assessment

| Finding | Confidence | Rationale |
|---------|-----------|-----------|
| Tool progress in streaming preview is the primary leak | **85%** | Source code confirms `toolProgress: true` is default; Telegram draft mode shows these lines |
| `visibleReplies: "message_tool"` does NOT affect DMs | **95%** | Source code clearly shows groupChat setting only applies to group/channel chat types |
| Silent reply rewrite causes "No more to report" messages | **90%** | Previously confirmed and partially fixed (dead cron jobs removed) |
| `commandText: "raw"` shows full command details in preview | **80%** | Likely contributes to visible tool call arguments in preview |

---

## Files Reviewed

1. `/home/poomk/.openclaw/openclaw.json` — Main config
2. `/home/poomk/.openclaw/workspace/AGENTS.md` — Agent routing rules
3. `/home/poomk/.openclaw/workspace/MEMORY.md` — Recent memory
4. `/home/poomk/.openclaw/workspace/memory/2026-05-10-team-workflow-config.md` — Silent reply rewrite history
5. OpenClaw source code:
   - `source-reply-delivery-mode-Bt1TkIjO.js` — Delivery mode resolution logic
   - `zod-schema.core-CrlgnnCI.js` — `VisibleRepliesSchema` definition
   - `dispatch-CvimgVpK.js` — Dispatch and delivery pipeline
   - `get-reply-wxuuKnTx.js` — Reply generation with `MESSAGE_TOOL_DELIVERY_HINT`
   - `silent-reply-DptYrIAH.js` — Silent reply rewrite policy
   - `harness-Ci4d1ihH.js` — Harness delivery defaults
   - `channel-streaming-BfXk-s2d.js` — Streaming preview tool progress config
   - `channel.setup-B7juNR_f.js` — Telegram channel setup with streaming config
   - `openclaw.plugin.json` (Telegram plugin) — `toolProgress` and `commandText` settings

---

*Analysis complete. No fixes applied. Report saved to `docs/diagnostics/tool-call-leak-analysis-2026-05-17.md`.*