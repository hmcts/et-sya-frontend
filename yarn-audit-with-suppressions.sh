#!/usr/bin/env bash

################################################################################
# Yarn Audit Wrapper
#
# This is a slightly adapted version of the pipeline script of the same name.
# It performs a security audit on Yarn dependencies, with the ability
# to suppress vulnerabilities that are known and have no fix. The audit results
# are output in JSON format. Any new vulnerabilities are reported to the user.
#
# Required Dependencies:
# - jq: A lightweight and flexible command-line JSON processor
# - yarn: Fast, reliable, and secure dependency management
# - prettyPrintAudit.sh: Script to pretty print the audit results
#
# Usage:
# Mostly used in the pipeline but feel free to use the script locally, should still work there:
# Execute the script in the directory containing your project and yarn-audit-known-issues file:
# ./yarn-audit-with-suppressions.sh
#
# Exit Codes:
# 0 - Success, no vulnerabilities found or only known vulnerabilities found
# 1 - Unhandled vulnerabilities were found
################################################################################


# Exit script on error
set -e

# Check for dependencies
command -v yarn >/dev/null 2>&1 || { echo >&2 "yarn is required but it's not installed. Aborting."; exit 1; }
command -v jq >/dev/null 2>&1 || { echo >&2 "jq is required but it's not installed. Aborting. Go to https://jqlang.github.io/jq/download/ to fix this."; exit 1; }

# Temporary files cleanup function
cleanup() {
rm -f new_vulnerabilities unneeded_suppressions sorted-yarn-audit-issues sorted-yarn-audit-known-issues active_suppressions unused_suppressions yarn-audit-known-issues-result

}

# Function to print guidance message in case of found vulnerabilities
print_guidance() {
cat <<EOF
  Security vulnerabilities were found that were not ignored.
  You can still push your code if desired using the following:
          git push --no-verify
  However, if nobody has made a start on fixing the vulnerability, you might as well have a bash now!
EOF

}

print_borked_known_issues() {
cat <<'EOF'
  You have an invalid yarn-audit-known-issues file.
  The command to suppress known vulnerabilities has changed.
  Please now use the following:
  `yarn npm audit --recursive --environment production --json > yarn-audit-known-issues`
EOF
}

# One advisory JSON object per line. Supports the npm audit report (an
# "advisories" map) and Yarn 4 NDJSON ({ "value", "children" } per line).
normalize_advisories() {
  input="$1"
  output="$2"
  if [[ ! -s "$input" ]]; then
    : > "$output"
    return
  fi
  if jq -e 'type == "object" and has("advisories")' "$input" >/dev/null 2>&1; then
    jq -cr '.advisories | to_entries[].value' "$input" | sort > "$output"
  else
    jq -c '.' "$input" | sort > "$output"
  fi
}

# Function to check for unneeded suppressions
check_for_unneeded_suppressions() {
  while IFS= read -r line; do
    if ! grep -Fxq "$line" sorted-yarn-audit-issues; then
      echo "$line" >> unneeded_suppressions
    fi
  done < sorted-yarn-audit-known-issues

  if [[ -s unneeded_suppressions ]]; then
    echo "WARNING: Unneeded suppressions found. You can safely delete these from the yarn-audit-known-issues file:"
    source prettyPrintAudit.sh unneeded_suppressions
  fi
}

# Perform yarn audit and process the results.
# yarn npm audit exits 1 when advisories are found. That is a report, not a crash.
audit_status=0
yarn npm audit --recursive --environment production --json > yarn-audit-result || audit_status=$?
if [[ "$audit_status" -ne 0 && ! -s yarn-audit-result ]]; then
  echo "yarn npm audit failed (exit ${audit_status}) and produced no report."
  exit 1
fi
normalize_advisories yarn-audit-result sorted-yarn-audit-issues

# Check if there were any vulnerabilities
if [[ ! -s sorted-yarn-audit-issues ]];  then
  echo "No vulnerabilities found in project dependencies."

  # Check for unneeded suppressions when no vulnerabilities are present
  if [ -f yarn-audit-known-issues ]; then
    normalize_advisories yarn-audit-known-issues sorted-yarn-audit-known-issues

    # When no vulnerabilities are found, all suppressions are unneeded
    check_for_unneeded_suppressions
  fi

  cleanup
  exit 0
fi

# Check if there are known vulnerabilities
if [ ! -f yarn-audit-known-issues ]; then
  source prettyPrintAudit.sh sorted-yarn-audit-issues
  print_guidance
  cleanup
  exit 1
else
  # Accept the npm audit report or Yarn 4 NDJSON. Anything else is unusable.
  if ! jq -e 'type == "object" and (has("advisories") or has("children"))' yarn-audit-known-issues >/dev/null 2>&1; then
    print_borked_known_issues
    exit 1
  fi

  # Handle edge case for when audit returns in different orders for the two files
  normalize_advisories yarn-audit-known-issues sorted-yarn-audit-known-issues

  # Retain old data ingestion style for cosmosDB
  if jq -e 'type == "object" and has("advisories")' yarn-audit-known-issues >/dev/null 2>&1; then
    jq -cr '.advisories| to_entries[] | {"type": "auditAdvisory", "data": { "advisory": .value }}' yarn-audit-known-issues > yarn-audit-known-issues-result
  fi

  # Check each issue in sorted-yarn-audit-result is also present in sorted-yarn-audit-known-issues
  while IFS= read -r line; do
    if ! grep -Fxq "$line" sorted-yarn-audit-known-issues; then
      echo "$line" >> new_vulnerabilities
    fi
  done < sorted-yarn-audit-issues

  # Check for unneeded suppressions
  check_for_unneeded_suppressions

  # Check if there were any new vulnerabilities
  if [[ -s new_vulnerabilities ]]; then
    echo "Unsuppressed vulnerabilities found:"
    source prettyPrintAudit.sh new_vulnerabilities
    print_guidance
    cleanup
    exit 1
  else
    echo "Active suppressed vulnerabilities:"
    while IFS= read -r line; do
        if grep -Fxq "$line" sorted-yarn-audit-issues; then
            echo "$line" >> active_suppressions
        fi
    done < sorted-yarn-audit-known-issues

    source prettyPrintAudit.sh active_suppressions
    cleanup
    exit 0
  fi
fi

