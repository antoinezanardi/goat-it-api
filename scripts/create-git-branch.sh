#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# create-git-branch.sh
#
# Interactive script to create a new git branch following conventional commit
# types and enforcing kebab-case naming. Prompts for job type and branch name.
#
# Usage:
#   ./create-git-branch.sh
# -----------------------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "❌ Not a git repository." >&2; exit 1; }

PS3="What kind of job are you starting? "
select option in "feat" "fix" "docs" "style" "refactor" "test" "perf" "build" "ci" "chore" "revert";
do
  case $option in
  feat | fix | docs | style | refactor | test | perf | build | ci | chore | revert)
    SELECTED_OPTION=$option
    break
    ;;
  *)
    echo "❌  Invalid option: \"$REPLY\". Please choose between 1 to 11."
    ;;
  esac
done

while true; do
  echo "Please provide your branch name, it must be kebab-case (like: 'my-feature'): "
  read -r FEATURE_NAME
  if [[ -z "$FEATURE_NAME" ]]; then
    echo "You must provide a branch name."
    continue
  fi
  if ! [[ "$FEATURE_NAME" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo "❌  Your branch name must be in kebab-case."
    continue
  fi
  break
done

BRANCH_NAME="$SELECTED_OPTION/$FEATURE_NAME"

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "❌ Branch '$BRANCH_NAME' already exists locally. Aborting." >&2
  exit 1
fi

if git ls-remote --exit-code --heads origin "$BRANCH_NAME" >/dev/null 2>&1; then
  echo "❌ Branch '$BRANCH_NAME' already exists on remote. Aborting." >&2
  exit 1
fi

if git checkout -b "$BRANCH_NAME"; then
  echo "✅ Branch '$BRANCH_NAME' created and checked out successfully. Let's make some great things! 🚀"
else
  echo "❌ Failed to create branch '$BRANCH_NAME'." >&2
  exit 1
fi
