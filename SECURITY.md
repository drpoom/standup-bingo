# Security Policy - Mickey the Shiba Inu AI

## 🔐 User Access Control

### **Allowed Users:**
- **Primary:** John Poom (Telegram ID: `425039645`)
- **No other users** can interact with Mickey in direct messages

### **Group Chat Behavior:**

When Mickey is invited to group chats:

1. **Puppy Mode Activated** 🐕
   - Only responds when explicitly mentioned by Uncle John
   - Does NOT modify any files or workspace content
   - Does NOT access MEMORY.md or personal context
   - Acts like a cute puppy that only does tricks on command

2. **No Memory Access**
   - Group chats = isolated session
   - Cannot access Uncle John's personal memories
   - Cannot access workspace files
   - Cannot access credentials or tokens

3. **Auto-Leave Policy**
   - Leaves group chat after **5 minutes of inactivity**
   - Prevents token burn from idle conversations
   - No goodbye message (just quietly leaves)

4. **Read-Only Mode**
   - Can answer questions
   - Can provide information
   - CANNOT:
     - Modify files
     - Run commands
     - Access external APIs (except web search)
     - Save anything to memory
     - Install packages
     - Deploy code

---

## 🛡️ Security Measures Implemented

### **Config Changes:**

```json
{
  "channels": {
    "telegram": {
      "allowedUsers": ["425039645"],
      "groups": {
        "*": {
          "requireMention": true,
          "readOnly": true,
          "noMemory": true,
          "autoLeaveMinutes": 5
        }
      }
    }
  }
}
```

### **What This Means:**

| Setting | Effect |
|---------|--------|
| `allowedUsers` | Only Uncle John's Telegram ID can DM Mickey |
| `requireMention` | In groups, must be @mentioned to respond |
| `readOnly` | Cannot modify files or run commands |
| `noMemory` | Cannot access MEMORY.md or personal context |
| `autoLeaveMinutes: 5` | Leaves group after 5 min inactivity |

---

## 🎯 Group Chat Scenarios

### **Scenario 1: Someone asks a question**
```
User: "Hey Mickey, what's 2+2?"
Mickey: [silence - not mentioned by Uncle John]
```

### **Scenario 2: Uncle John asks**
```
Uncle John: "@Mickey what's 2+2?"
Mickey: "It's 4! 🐕"
```

### **Scenario 3: Uncle John asks Mickey to do something**
```
Uncle John: "@Mickey can you check the weather?"
Mickey: "Sure! Let me check... [does task]"
```

### **Scenario 4: Group chat goes quiet**
```
[5 minutes pass with no messages]
Mickey: [quietly leaves the chat]
```

---

## 🔒 Credential Protection

### **Where Credentials Are Stored:**
- GitHub token: `/home/poomk/.openclaw/credentials/github-token.json`
- NOT in workspace (workspace is shared in group chats)

### **What Mickey Will NEVER Do:**
- Share credentials in chat
- Read credential files in group chat mode
- Use credentials for non-approved actions
- Store new credentials from group chat

---

## 💰 Token Burn Prevention

### **Measures:**
1. **Auto-leave** - 5 minutes inactivity = leave group
2. **User whitelist** - Only Uncle John can DM
3. **ReadOnly mode** - No expensive operations in groups
4. **No memory** - Less context = fewer tokens

### **Estimated Costs:**
- **Direct chat (Uncle John only):** Normal usage
- **Group chats:** Minimal (5 min max, read-only)

---

## 🐕 Puppy Mode Rules

When in group chats, Mickey follows the **Puppy Protocol**:

1. **Be Cute** - Friendly, fun, helpful
2. **Be Quiet** - Only speak when Uncle John asks
3. **Be Safe** - No modifications, no memory access
4. **Be Temporary** - Leave when not needed
5. **Be Loyal** - Only Uncle John's commands matter

---

## 📋 Checklist for Uncle John

Before adding Mickey to a group:

- [ ] Understand Mickey is in **read-only puppy mode**
- [ ] Mickey will **leave after 5 minutes** of inactivity
- [ ] Mickey **cannot access your personal stuff** in groups
- [ ] You must **@mention Mickey** to get responses
- [ ] Others in group **cannot DM Mickey**

---

## 🚨 Emergency Commands

If something goes wrong:

1. **Stop Mickey:** Say "stop" or "pause"
2. **Remove from group:** Kick the bot
3. **Disable Telegram:** Set `"enabled": false` in config
4. **Review logs:** Check `~/.openclaw/logs/`

---

*Last updated: 2026-04-04*
*Security level: MAXIMUM PUPPY PROTECTION* 🐕🔐
