#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# create-pull-request.sh
#
# Interactive script to open a pull request on GitHub. Prompts for GitHub
# username if not set, validates it, and checks for commits before opening PR.
#
# Usage:
#   ./create-pull-request.sh [base-branch]
# -----------------------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

command -v curl >/dev/null 2>&1 || { echo "❌  curl is required." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌  git is required." >&2; exit 1; }
command -v ruby >/dev/null 2>&1 || echo "⚠️ ruby not found; labels/titles won't be URL-encoded."
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "❌ Not a git repository." >&2; exit 1; }

github_user=$(git config github.user || true)

while true; do
  if [[ -z "$github_user" ]]; then
    read -r -p "Enter your GitHub username: " github_user
    git config github.user "$github_user"
  elif ! curl -s "https://api.github.com/users/$github_user" | grep -q '"login":'; then
    echo "The GitHub username \"$github_user\" does not exist or is invalid."
    read -r -p "Enter your GitHub username: " github_user
    git config github.user "$github_user"
  else
    break
  fi
done

base_branch=${1:-develop}
current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$(git rev-list --count "$base_branch".."$current_branch")" -gt 0 ]; then
  echo "Opening pull request for $current_branch against $base_branch..."
else
  echo "❌  Current branch ($current_branch) has no commits yet. Please make at least one commit."
  exit 1
fi

remote_url=$(git config --get remote.origin.url)
remote_url=${remote_url%.git}
remote_url=${remote_url%/}

if [[ "$remote_url" =~ github\.com[:/]+([^/]+)/([^/]+)$ ]]; then
  username=${BASH_REMATCH[1]}
  repository=${BASH_REMATCH[2]}
else
  echo "❌  Unable to extract username and repository from the remote URL: $remote_url"
  exit 1
fi

if [ "$current_branch" = "$base_branch" ]; then
  echo "❌  The current branch is already the same as the base branch."
  exit 1
fi

pr_url=$(curl -s "https://api.github.com/repos/$username/$repository/pulls?head=$username:$current_branch&base=$base_branch" | grep -Eo "https://github.com/$username/$repository/pull/[0-9]+" | head -n 1 || true)

if [ -n "$pr_url" ]; then
  echo "❌  A pull request already exists for $current_branch against $base_branch: $pr_url"
  exit 1
fi

git push -u origin "$current_branch"

word_map=("feat:🚀 feature" "fix:🐛 bug" "chore:🧹 chore" "docs:📖 docs" "style:🎨 style" "refactor:🔩 refactor" "perf:⚡️ perf" "test:✅ test" "ci:🔁 ci")

first_commit_message=$(git log --format=%B -n 1 "$base_branch".."$current_branch")
first_type=$(echo "$first_commit_message" | sed -E 's/^([a-zA-Z]+)(\([^)]*\))?:.*/\1/' | xargs)

label=""
for pair in "${word_map[@]}"; do
  key=${pair%%:*}
  value=${pair#*:}
  if [ "$key" = "$first_type" ]; then
    label=$value
    break
  fi
done

open_pr_url="https://github.com/$username/$repository/compare/$base_branch...$current_branch?expand=1&assignee=$github_user"
encoded_label=$(ruby -e 'require "erb"; puts ERB::Util.url_encode(ARGV[0])' "$label")
encoded_title=$(ruby -e 'require "erb"; puts ERB::Util.url_encode(ARGV[0])' "$first_commit_message")
encoded_open_pr_url="$open_pr_url&labels=$encoded_label&title=$encoded_title"
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "$encoded_open_pr_url"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open "$encoded_open_pr_url"
else
  echo "❌  Unsupported OS to automatically open the pull request creation page"
  exit 1
fi
