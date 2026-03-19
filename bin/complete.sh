#!/usr/bin/env bash
set -euo pipefail

if [ "${1:-}" = "" ]; then
  echo "Usage: pnpm complete \"type(scope): message\" [remote] [branch]"
  exit 1
fi

commit_message="$1"
remote="${2:-origin}"
branch="${3:-$(git rev-parse --abbrev-ref HEAD)}"

echo "Running checks..."
pnpm lint --quiet
pnpm typecheck

echo "Staging changes..."
git add -A

if git diff --cached --quiet; then
  echo "No staged changes to commit."
  exit 1
fi

echo "Committing..."
git commit -m "$commit_message" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo "Pushing to ${remote}/${branch}..."
git push "$remote" "$branch"

echo "Done: committed and pushed successfully."
