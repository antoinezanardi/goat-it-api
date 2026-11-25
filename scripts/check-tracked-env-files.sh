#!/bin/sh
# Checks that no env file other than the two intentionally tracked ones is
# tracked by Git.
#
# Usage: sh scripts/check-tracked-env-files.sh
# Only env/.env.example and env/.env.test may be tracked: every other path
# whose name starts with .env is excluded by the .env* rule in .gitignore and
# must stay untracked. The script reads the index, so it also catches a staged
# `git add -A` before the commit exists, and it runs in the CI Build workflow.
#
# The script exits non-zero when an unexpected env file is tracked or when one
# of the two allowed files is missing from the index, and prints a confirmation
# message otherwise.
set -eu

if ! repository_root="$(git rev-parse --show-toplevel 2>/dev/null)"; then
  echo "❌ Not in a Git worktree; cannot inspect tracked env files." >&2
  exit 1
fi

cd "$repository_root"

if printf '%s\n' "$(git ls-files | grep -E '(^|/)\.env' || true)" |
  grep -vxF -e "env/.env.example" -e "env/.env.test" |
  grep -q .
then
  echo "Unexpected tracked env file(s):"
  git ls-files | grep -E '(^|/)\.env' | grep -vxF -e "env/.env.example" -e "env/.env.test"
  echo "Only env/.env.example and env/.env.test may be tracked."
  exit 1
fi

for allowed_tracked_env_file in "env/.env.example" "env/.env.test"; do
  if ! git ls-files | grep -E '(^|/)\.env' | grep -qxF "$allowed_tracked_env_file"; then
    echo "$allowed_tracked_env_file is expected to be tracked but is not."
    exit 1
  fi
done

echo "Only env/.env.example and env/.env.test are tracked."
