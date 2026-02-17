# Git/GitHub Workflow for Googlers

## Quick Reference: Google → Git/GitHub Translation

| Google (google3) | Git/GitHub | Description |
|------------------|------------|-------------|
| `g4 change` | `git commit` | Create a changelist |
| `g4 mail` | `git push` | Upload for review |
| Critique | GitHub Pull Request | Code review tool |
| LGTM | Approval on PR | Reviewer approval |
| `g4 submit` | Merge PR | Submit to codebase |
| google3 | main branch | Production code |
| Your workspace | Your local repo | Working directory |

## After Ralph Completes a Task

### Step 1: Review the Commit (locally)

```bash
# See what Ralph changed (like "g4 diff")
git show HEAD

# See the commit message
git log -1

# See which files changed
git show --stat HEAD

# See side-by-side diff (install delta for better diffs)
git show HEAD | delta  # or just git show HEAD
```

### Step 2: Test the Changes

```bash
# Run the development server
npm run dev

# Visit http://localhost:3000

# Check the screenshot Ralph took
open screenshots/[task-name].png

# Run tests if you have them
npm test
```

### Step 3: Options for Submitting

You have THREE options:

#### Option A: Direct Push (Solo Developer - Simple)
**Use this if:** You're working alone and don't need reviews

```bash
# Push directly to main (like g4 submit without review)
git push origin main
```

✅ **Pros:** Fast, simple, no friction
❌ **Cons:** No review process, all code goes straight to production

#### Option B: Pull Request Workflow (Team Collaboration)
**Use this if:** You want code review or have multiple developers

```bash
# Create a feature branch for this task
git checkout -b feature/supabase-setup

# Push the branch
git push origin feature/supabase-setup

# Create a PR (equivalent to g4 mail)
gh pr create --title "Add Supabase database setup" --body "Description of changes"

# Share PR link with reviewers
# Get approvals (LGTMs)
# Merge PR on GitHub UI (equivalent to g4 submit)
```

✅ **Pros:** Code review, discussion, team collaboration
❌ **Cons:** More overhead, slower for solo work

#### Option C: Batch and Push (Ralph Workflow - Recommended)
**Use this if:** You want Ralph to complete multiple tasks before pushing

```bash
# Let Ralph complete 3-5 tasks (each creates a commit)
./ralph-once.sh  # Task 1 - commit created
./ralph-once.sh  # Task 2 - commit created
./ralph-once.sh  # Task 3 - commit created

# Review all commits at once
git log --oneline -3
git show HEAD~2  # Review task 1
git show HEAD~1  # Review task 2
git show HEAD    # Review task 3

# Push all commits together
git push origin main
```

✅ **Pros:** Batched review, less GitHub noise
❌ **Cons:** Harder to rollback individual tasks

## Recommended Workflow for Solo Ralph Development

```bash
# 1. Run Ralph to complete a task
./ralph-once.sh

# 2. Quick review
git show HEAD
npm run dev  # Test it

# 3. If good, run next task
./ralph-once.sh

# 4. After 3-5 tasks, batch push
git log --oneline -5
git push origin main

# 5. Repeat
```

## If You Need to Fix Something Ralph Did

```bash
# Option 1: Amend the last commit (if you haven't pushed)
# Make your fixes
git add .
git commit --amend --no-edit

# Option 2: Create a new commit
# Make your fixes
git add .
git commit -m "Fix: correct the database schema"

# Option 3: Revert a commit (if already pushed)
git revert HEAD  # Creates a new commit that undoes the last one
git push origin main
```

## Understanding "Local" vs "Remote"

- **Local**: On your laptop only (like your g4 workspace)
- **Remote (origin)**: On GitHub (like google3)
- **Commits**: Local changes (like a CL before g4 mail)
- **Push**: Upload to GitHub (like g4 mail)
- **Pull**: Download from GitHub (like g4 sync)

## Key Difference from Google

At Google, every CL is reviewed before submit. With Git/GitHub on a personal project:
- You CAN push directly to main without review (faster)
- You CAN use PRs for self-review or team review (slower)
- **You choose the level of rigor**

For Ralph development, I recommend:
1. Let Ralph make 3-5 local commits
2. Review them in batch
3. Push all at once to GitHub
4. Skip PRs unless you want formal review
