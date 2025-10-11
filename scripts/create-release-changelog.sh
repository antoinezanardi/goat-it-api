#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# create-release-changelog.sh
#
# Generates a release changelog using semantic-release, reformats output,
# and saves it to RELEASE.md for review or publishing.
#
# Usage:
#   ./create-release-changelog.sh
# -----------------------------------------------------------------------------

set -euo pipefail

if ! command -v gawk &>/dev/null; then
  echo "gawk is required but not installed. Please install gawk and try again."
  exit 1
fi

npx semantic-release --dry-run --no-ci | gawk '/^## [0-9]+\.[0-9]+\.[0-9]+( \(https:\/\/github\.com\/)?/ {if (found) exit; found=1} found {print}' >RELEASE.md

gawk '
  {
    sub(/^ */, "");
    sub(/ \(.+?\)$/, "");
    if (/^\* [^:]+: /) {
      $0 = gensub(/^\* ([^:]+): /, "* **\\1**: ", "g")
    }
    print
  }' RELEASE.md >temp.md && mv temp.md RELEASE.md


if [ ! -s RELEASE.md ]; then
  echo "No new release notes generated. Removing empty RELEASE.md."
  rm RELEASE.md
  exit 0
fi

sed -E -i 's/^## ([0-9]+\.[0-9]+\.[0-9]+).*/## Release v\1/' RELEASE.md
