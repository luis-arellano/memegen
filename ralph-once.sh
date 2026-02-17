#!/bin/bash
set -e

echo "🤖 Starting Ralph-Once: Will complete exactly ONE task from plan.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

claude --dangerously-skip-permissions "First read activity.md to see what was recently accomplished.

Open plan.md and choose the single **highest priority task** where passes is false.

For tasks requiring local testing: Start the Next.js dev server with 'npm run dev' (usually localhost:3000). If port is taken, try another.

Work on exactly ONE task: implement the change.

After implementing, use Playwright to:
1. Navigate to the local server URL
2. Take a screenshot and save it as screenshots/[task-name].png

Append a dated progress entry to activity.md describing what you changed, any roadblocks and how you solved them, and the screenshot filename.

Update that task's passes in plan.md from false to true.

Make one git commit for that task only with a clear message.

Do not git init, do not change remotes, do not push.

CRITICAL: After completing ONE task and making the commit, you MUST exit immediately:
1. Do NOT look for another task
2. Do NOT continue to the next task
3. Output 'Task complete - exiting session.'
4. Use the /exit command to end the session

If ALL tasks have passes true, output <promise>COMPLETE</promise> then use /exit."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Ralph-Once finished. Check git log and activity.md for results."