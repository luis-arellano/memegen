#!/bin/bash
# Quick script to view changes like Critique

echo "🔍 Viewing Git Changes (Critique-style)"
echo ""

# Show commit summary
echo "📝 Recent Commits:"
git log --oneline -5
echo ""

# Show files changed in last commit
echo "📁 Files Changed in Last Commit:"
git show --name-status HEAD
echo ""

# Option to view in VS Code
echo "To view changes in VS Code (like Critique):"
echo "  1. Click the Source Control icon in left sidebar (or Cmd+Shift+G)"
echo "  2. Right-click a commit and select 'View Commit'"
echo "  3. Or run: code --diff <file>@HEAD~1 <file>@HEAD"
echo ""

# Option to view on GitHub
REPO_URL=$(git config --get remote.origin.url | sed 's/\.git$//')
if [[ $REPO_URL == git@* ]]; then
    REPO_URL=$(echo $REPO_URL | sed 's/:/\//' | sed 's/git@/https:\/\//')
fi

LAST_COMMIT=$(git rev-parse HEAD)
echo "🌐 View on GitHub (like Critique):"
echo "  $REPO_URL/commit/$LAST_COMMIT"
echo ""

# Offer to open in browser
read -p "Open last commit in browser? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "$REPO_URL/commit/$LAST_COMMIT"
fi
