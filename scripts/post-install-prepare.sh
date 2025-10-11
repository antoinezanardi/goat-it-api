#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# post-install-prepare.sh
#
#
# Usage:
#   ./post-install-prepare.sh
# -----------------------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

echo "🔆 Running post-install preparation steps..."

if ! command -v is-ci >/dev/null 2>&1; then
  echo "'is-ci' not found. Dev dependencies might not be installed."
  echo "⏭️ Exiting post-install steps."
  exit 0
fi

if is-ci; then
  echo "✅  Detected CI environment, skipping husky installation."
  exit 0
fi

husky

echo "🐶 Husky installed successfully."

echo "✅  Post-install preparation steps completed."
