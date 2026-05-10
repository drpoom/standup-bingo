#!/bin/bash
# Daily Performance Report - Wrapper for cron job
# Runs report and sends to Telegram

set -e

REPORT_DATE=$(date '+%a %Y-%m-%d %H:%M GMT%z')
LOGFILE="/tmp/openclaw/openclaw-$(date +%Y-%m-%d).log"
REPORT=$(bash /home/poomk/.openclaw/workspace/scripts/daily-performance-report.sh 2>&1)

# Send via openclaw message tool
openclaw message send \
  --channel telegram \
  --target 425039645 \
  --message "📊 **Daily Performance Report** - $REPORT_DATE

$REPORT" 2>&1

echo "Report sent successfully"
