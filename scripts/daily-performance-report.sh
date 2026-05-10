#!/bin/bash
# Daily Performance Report - with per-task timing breakdown (deduplicated)

python3 << 'PYTHON_SCRIPT'
import os, json
from datetime import datetime
from collections import defaultdict

sessions_dir = "/home/poomk/.openclaw/agents"
model_data = defaultdict(lambda: {'sessions': 0, 'input': 0, 'output': 0, 'total': 0, 'wall_dur': 0, 'infer_dur': 0})
task_list = []
succeeded = timeout = failed = 0
projects = defaultdict(int)
cutoff = datetime.now().timestamp() - 86400

# Collect all session files and deduplicate by base session ID
session_files = {}  # base_id -> best file path
for root, dirs, files in os.walk(sessions_dir):
    for fname in files:
        if not fname.endswith('.jsonl'): continue
        fpath = os.path.join(root, fname)
        try:
            if os.path.getmtime(fpath) < cutoff: continue
        except: continue
        
        # Extract base session ID
        base_id = fname
        if '.checkpoint.' in fname:
            base_id = fname.split('.checkpoint.')[0]
        elif '.trajectory.jsonl' in fname:
            base_id = fname.replace('.trajectory.jsonl', '')
        elif fname.endswith('.jsonl'):
            base_id = fname.replace('.jsonl', '')
        
        # Prefer trajectory > checkpoint > plain jsonl
        priority = 0
        if '.trajectory.jsonl' in fname: priority = 3
        elif '.checkpoint.' in fname: priority = 2
        else: priority = 1
        
        if base_id not in session_files or priority > session_files[base_id][1]:
            session_files[base_id] = (fpath, priority)

# Process deduplicated sessions
for base_id, (fpath, _) in session_files.items():
    try:
        with open(fpath, 'r') as f: content = f.read()
    except: continue
    if not content.strip(): continue
    
    # Extract agent name from path
    agent_name = "unknown"
    path_parts = fpath.split(os.sep)
    for i, p in enumerate(path_parts):
        if p == 'agents' and i+1 < len(path_parts):
            agent_name = path_parts[i+1]
            break
    
    model = "unknown"
    session_first_ts = None
    session_last_ts = None
    task_desc = ""
    
    for line in content.split('\n'):
        if not line.strip(): continue
        try:
            data = json.loads(line.strip())
            
            # Track session timestamps
            ts = data.get('ts') or data.get('timestamp')
            if ts:
                ts_dt = datetime.fromtimestamp(ts/1000) if isinstance(ts, (int, float)) else datetime.fromisoformat(ts.replace('Z', '+00:00'))
                if not session_first_ts: session_first_ts = ts_dt
                session_last_ts = ts_dt
            
            # Get model
            if data.get('type') in ('trace.metadata', 'model.completed'):
                if 'modelId' in data:
                    model = data['modelId']
            
            # Get task description from prompt.submitted
            if data.get('type') == 'prompt.submitted':
                prompt_data = data.get('data', {})
                text = prompt_data.get('text', '')
                if text:
                    # Clean up cron job prompts
                    if '[cron:' in text:
                        start = text.find('[cron:')
                        end = text.find(']', start)
                        if start >= 0 and end > start:
                            cron_part = text[start:end+1]
                            rest = text[end+1:].strip()
                            if rest:
                                task_desc = rest[:100]
                            else:
                                task_desc = cron_part
                    else:
                        task_desc = text[:100]
            
            # Handle model.completed traces
            if data.get('type') == 'model.completed':
                d = data.get('data', {})
                usage = d.get('usage', {})
                tot = usage.get('total', usage.get('totalTokens', 0))
                snapshot = d.get('messagesSnapshot', [])
                
                # Calculate inference time from snapshot timestamps
                infer_time = 0
                if isinstance(snapshot, list) and len(snapshot) > 0:
                    prev_user_ts = None
                    for msg in snapshot:
                        role = msg.get('role')
                        msg_ts = msg.get('timestamp')
                        if msg_ts:
                            msg_dt = datetime.fromtimestamp(msg_ts/1000) if isinstance(msg_ts, (int, float)) else datetime.fromisoformat(msg_ts.replace('Z', '+00:00'))
                            if role == 'user':
                                prev_user_ts = msg_dt
                            elif role == 'assistant' and prev_user_ts:
                                infer_time = (msg_dt - prev_user_ts).total_seconds()
                                break
                
                if tot > 0:
                    infer_time = max(1, min(infer_time, 3600))
                    wall_time = 0
                    if session_first_ts and session_last_ts:
                        wall_time = (session_last_ts - session_first_ts).total_seconds()
                        wall_time = min(wall_time, 7200)
                    
                    model_data[model]['input'] += usage.get('input', 0)
                    model_data[model]['output'] += usage.get('output', 0)
                    model_data[model]['total'] += tot
                    model_data[model]['sessions'] += 1
                    model_data[model]['infer_dur'] += infer_time
                    model_data[model]['wall_dur'] += wall_time
                    
                    # Build task description if not found
                    if not task_desc and isinstance(snapshot, list) and len(snapshot) > 0:
                        first_msg = snapshot[0]
                        if first_msg.get('role') == 'user':
                            content_list = first_msg.get('content', [])
                            if isinstance(content_list, list) and len(content_list) > 0:
                                task_desc = content_list[0].get('text', '')[:100]
                            elif isinstance(first_msg.get('content'), str):
                                task_desc = first_msg.get('content', '')[:100]
                    
                    # Clean up task description
                    if not task_desc:
                        task_desc = f"Session {base_id[:8]}"
                    task_desc = task_desc.replace('\n', ' ').strip()
                    
                    # Detect project
                    project = "workspace"
                    if isinstance(snapshot, list) and len(snapshot) > 0:
                        content_text = ''.join(json.dumps(m) for m in snapshot[:10])
                        if 'investments' in content_text or 'portfolio' in content_text or 'stock' in content_text:
                            project = "investments"
                        elif 'elango' in content_text or 'surfers' in content_text:
                            project = "elango-surfers"
                        elif 'cobra' in content_text or 'bridge' in content_text:
                            project = "cobra"
                    
                    # Add to task list (only once per session)
                    task_list.append({
                        'task': task_desc,
                        'agent': agent_name,
                        'model': model,
                        'wall_dur': wall_time,
                        'infer_dur': infer_time,
                        'ratio': wall_time / infer_time if infer_time > 0 else 0,
                        'project': project,
                        'tokens': tot
                    })
                    
                    if d.get('timedOut'): timeout += 1
                    elif d.get('finalStatus') == 'failed': failed += 1
                    elif not d.get('aborted'): succeeded += 1
                    
                    if len(snapshot) > 0:
                        content_text = ''.join(json.dumps(m) for m in snapshot[:10])
                        if 'investments' in content_text or 'portfolio' in content_text or 'stock' in content_text:
                            projects['investments'] += 1
                        elif 'elango' in content_text or 'surfers' in content_text:
                            projects['elango-surfers'] += 1
                        elif 'cobra' in content_text or 'bridge' in content_text:
                            projects['cobra'] += 1
                        else:
                            projects['workspace'] += 1
                    
                    break  # Only process first model.completed per session
        except: continue

report_date = datetime.now().strftime('%a %Y-%m-%d %H:%M GMT%z')
total_tasks = succeeded + timeout + failed
sp = succeeded*100//total_tasks if total_tasks > 0 else 0
tp = timeout*100//total_tasks if total_tasks > 0 else 0
fp = failed*100//total_tasks if total_tasks > 0 else 0

print(f"# 📊 Daily Agent Performance Report")
print(f"**{report_date}**")
print(f"**Period:** Last 24 hours")
print()
print("## 🎯 Task Outcomes")
print()
print("| Status | Count | % |")
print("|--------|-------|---|")
print(f"| ✅ Succeeded | {succeeded} | {sp}% |")
print(f"| ⏱️ Timeout | {timeout} | {tp}% |")
print(f"| 🔴 Failed | {failed} | {fp}% |")
print()
print("## ⚡ Model Performance & Token Usage")
print()
print("| Model | Sessions | Total Tokens | Avg In | Avg Out | Avg Total | Wall Time | Inference | TPS |")
print("|-------|----------|--------------|--------|---------|-----------|-----------|-----------|-----|")

models_list = []
for m, d in model_data.items():
    if d['sessions'] == 0: continue
    avg_in = d['input']/d['sessions']
    avg_out = d['output']/d['sessions']
    avg_tot = d['total']/d['sessions']
    avg_wall = d['wall_dur']/d['sessions']
    avg_infer = d['infer_dur']/d['sessions']
    tps = avg_out/avg_infer if avg_infer > 0 else 0
    models_list.append({
        'model': m, 'sessions': d['sessions'], 'total': d['total'],
        'avg_in_k': round(avg_in/1000, 1), 'avg_out_k': round(avg_out/1000, 1), 'avg_tot_k': round(avg_tot/1000, 1),
        'tps': round(tps, 2), 'wall_dur': round(avg_wall), 'infer_dur': round(avg_infer)
    })

models_list.sort(key=lambda x: -x['total'])
grand_total = sum(m['total'] for m in models_list)

for m in models_list:
    if m['total'] > 1000000:
        total_fmt = f"{m['total']/1000000:.2f}M"
    else:
        total_fmt = f"{m['total']/1000:.1f}k"
    
    wall_min = m['wall_dur'] // 60
    wall_sec = m['wall_dur'] % 60
    wall_fmt = f"{wall_min}m{wall_sec}s" if wall_min > 0 else f"{wall_sec}s"
    
    infer_min = m['infer_dur'] // 60
    infer_sec = m['infer_dur'] % 60
    infer_fmt = f"{infer_min}m{infer_sec}s" if infer_min > 0 else f"{infer_sec}s"
    
    print(f"| {m['model']} | {m['sessions']} | {total_fmt} | {m['avg_in_k']}k | {m['avg_out_k']}k | {m['avg_tot_k']}k | {wall_fmt} | {infer_fmt} | {m['tps']} |")

if grand_total > 1000000:
    grand_fmt = f"{grand_total/1000000:.2f}M"
else:
    grand_fmt = f"{grand_total/1000:.1f}k"
print()
print(f"**Total:** {grand_fmt} tokens")
print()

# Top slowest tasks section
if task_list:
    print("## ⏱️ Top 10 Slowest Tasks (by Wall Time)")
    print()
    print("| # | Task | Agent | Wall Time | Inference | Ratio | Project |")
    print("|---|------|-------|-----------|-----------|-------|---------|")
    
    # Sort by wall time descending
    task_list.sort(key=lambda x: -x['wall_dur'])
    
    for i, t in enumerate(task_list[:10], 1):
        wall_min = int(t['wall_dur']) // 60
        wall_sec = int(t['wall_dur']) % 60
        wall_fmt = f"{wall_min}m{wall_sec}s" if wall_min > 0 else f"{wall_sec}s"
        
        infer_min = int(t['infer_dur']) // 60
        infer_sec = int(t['infer_dur']) % 60
        infer_fmt = f"{infer_min}m{infer_sec}s" if infer_min > 0 else f"{infer_sec}s"
        
        ratio_fmt = f"{int(t['ratio'])}x" if t['ratio'] >= 1 else f"{t['ratio']:.1f}x"
        
        # Truncate task description
        task_short = t['task'][:50] + "..." if len(t['task']) > 50 else t['task']
        task_short = task_short.replace('|', '│')  # Avoid breaking markdown table
        
        print(f"| {i} | {task_short} | {t['agent']} | {wall_fmt} | {infer_fmt} | {ratio_fmt} | {t['project']} |")
    
    print()
    
    # Show optimization opportunities
    high_ratio_tasks = [t for t in task_list if t['ratio'] > 100]
    if high_ratio_tasks:
        print("### 🎯 Optimization Opportunities")
        print()
        print(f"**{len(high_ratio_tasks)} tasks** have wall/inference ratio >100x (heavy tool execution)")
        print()
        print("**Recommended actions:**")
        print("- Batch file operations (combine multiple `exec` calls)")
        print("- Parallelize independent tasks with subagents")
        print("- Cache repeated data fetches")
        print()

print("## 📁 Project Activity")
print()
for p, c in sorted(projects.items(), key=lambda x: -x[1]):
    if c > 0: print(f"- **{p}**: {c} sessions")
print()
print("---")
print("*Wall Time = session start to end (includes idle/tool execution)*")
print("*Inference = user→assistant timestamp delta (model processing only)*")
print("*Ratio >100x = heavy tool execution or idle time*")
print("*TPS = output tokens / inference time*")
PYTHON_SCRIPT
