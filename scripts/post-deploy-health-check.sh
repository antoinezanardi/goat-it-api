#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# post-deploy-health-check.sh
#
# Polls a deployed liveness URL until it answers HTTP 200 or the attempt budget
# is exhausted. Exit code 0 means the API is live; 1 means it is not.
#
# Usage:
#   ./post-deploy-health-check.sh <health-check-url>
#
# Environment overrides:
#   HEALTH_CHECK_MAX_ATTEMPTS               (default 5)
#   HEALTH_CHECK_RETRY_DELAY_IN_SECONDS     (default 5)
#   HEALTH_CHECK_REQUEST_TIMEOUT_IN_SECONDS (default 3)
# -----------------------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

health_check_url="${1:-}"
max_attempts="${HEALTH_CHECK_MAX_ATTEMPTS:-5}"
retry_delay_in_seconds="${HEALTH_CHECK_RETRY_DELAY_IN_SECONDS:-5}"
request_timeout_in_seconds="${HEALTH_CHECK_REQUEST_TIMEOUT_IN_SECONDS:-3}"

if [[ -z "$health_check_url" ]]; then
  echo "::error::No health check URL provided. Usage: $0 <health-check-url>" >&2
  exit 1
fi

health_check_url=$(printf '%s' "$health_check_url" | sed -E 's#([^/:])//+#\1/#g')

for (( attempt = 1; attempt <= max_attempts; attempt++ )); do
  curl_exit_status=0
  status_code=$(curl --silent --output /dev/null --write-out "%{http_code}" --max-time "$request_timeout_in_seconds" "$health_check_url") || curl_exit_status=$?

  if [[ "$curl_exit_status" -eq 0 && "$status_code" == "200" ]]; then
    echo "Health check succeeded (attempt ${attempt}/${max_attempts}, HTTP 200): ${health_check_url}"
    exit 0
  fi

  echo "Health check attempt ${attempt}/${max_attempts} failed (HTTP ${status_code:-none}, curl exit ${curl_exit_status}): ${health_check_url}" >&2

  if (( attempt < max_attempts )); then
    sleep "$retry_delay_in_seconds"
  fi
done

attempt_noun="attempts"
if (( max_attempts == 1 )); then
  attempt_noun="attempt"
fi

echo "::error::Health check failed after ${max_attempts} ${attempt_noun}: ${health_check_url}" >&2
exit 1
