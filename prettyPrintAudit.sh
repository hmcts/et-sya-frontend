#!/bin/bash
filename="$1"

while IFS= read -r line; do
    if echo "$line" | jq -e '.children.ID' >/dev/null 2>&1; then
        echo "$line" | jq -r '
            .value as $pkg |
            .children as $c |
            "├─ " + $pkg,
            "│  ├─ ID: " + ($c.ID|tostring),
            "│  ├─ Issue: " + $c.Issue,
            "│  ├─ URL: " + $c.URL,
            "│  ├─ Severity: " + $c.Severity,
            "│  ├─ Vulnerable Versions: " + $c["Vulnerable Versions"],
            "│  ├─ Tree Versions: " + ($c["Tree Versions"] | join(", ")),
            "│  └─ Dependents: " + ($c.Dependents | join(", ")),
            ""'
    else
        echo "$line" | jq -r '
            .module_name as $moduleName |
            .id as $id |
            .title as $issue |
            .url as $url |
            .severity as $severity |
            .vulnerable_versions as $vulnVers |
            .patched_versions as $patchVers |
            .recommendation as $rec |
            .findings[] |
            "├─ " + $moduleName + ": " + .version,
            "│  ├─ ID: " + ($id|tostring),
            "│  ├─ Issue: " + $issue,
            "│  ├─ URL: " + $url,
            "│  ├─ Severity: " + $severity,
            "│  ├─ Vulnerable Versions: " + $vulnVers,
            "│  ├─ Patched Versions: " + $patchVers,
            "│  ├─ Via: " + (.paths | join(", ")),
            "│  └─ Recommendation: " + $rec,
            ""'
    fi
done < "$filename"

