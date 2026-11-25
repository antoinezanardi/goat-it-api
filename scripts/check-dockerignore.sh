#!/bin/sh
# Checks that .dockerignore keeps excluding the paths and secret-file patterns
# the container build relies on, that it never excludes the known Dockerfile
# inputs through an exact, trailing-slash or ** form, and that no
# Dockerfile-specific ignore file silently shadows it.
#
# Usage: sh scripts/check-dockerignore.sh [dockerignore_file]
# Run from the repository root; the file defaults to .dockerignore.
# It exits non-zero and names every offending pattern, and prints a confirmation
# message otherwise.
set -eu

dockerignore_file="${1:-.dockerignore}"
is_failed=0

report_failure() {
  echo "❌ $1"
  is_failed=1
}

require_pattern() {
  if ! grep -Fxq -- "$1" "$dockerignore_file"; then
    report_failure "Missing mandatory pattern in $dockerignore_file: $1"
  fi
}

forbid_pattern() {
  if grep -Fxq -- "$1" "$dockerignore_file"; then
    report_failure "Forbidden pattern in $dockerignore_file: $1"
  fi
}

if [ ! -f "$dockerignore_file" ]; then
  echo "❌ Missing ignore file: $dockerignore_file"
  exit 1
fi

if [ -f Dockerfile.dockerignore ]; then
  report_failure "Dockerfile.dockerignore shadows $dockerignore_file; the checked patterns are not applied."
fi

while IFS= read -r required_pattern; do
  require_pattern "$required_pattern"
done <<'REQUIRED'
.git
node_modules
**/node_modules
dist
**/dist
tests
docs
.github
.agents
.opencode
configs/bruno
.env
.env.*
.env*
**/.env
**/.env.*
**/.env*
.npmrc
**/.npmrc
*.pem
**/*.pem
*.key
**/*.key
docker-compose*.yml
Dockerfile*
REQUIRED

while IFS= read -r forbidden_pattern; do
  forbid_pattern "$forbidden_pattern"
  forbid_pattern "$forbidden_pattern/"
  forbid_pattern "**/$forbidden_pattern"
  forbid_pattern "$forbidden_pattern/**"
done <<'FORBIDDEN'
*
**
src
public
packages
scripts
configs
configs/typescript
configs/nest
configs/swc
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
tsconfig*
*.json
*.sh
FORBIDDEN

if grep -q '^!' "$dockerignore_file"; then
  report_failure "Negation lines (starting with '!') are not allowed in $dockerignore_file."
fi

if [ "${is_failed}" -ne 0 ]; then
  exit 1
fi

echo "✅ $dockerignore_file keeps the mandatory exclusions and rejects known build-input patterns."
