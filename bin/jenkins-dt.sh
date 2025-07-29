#!/bin/bash

# Replace YOUR_TOKEN_HERE with your actual API token
# or ensure PERF_SYNTHETIC_MONITOR_TOKEN is set in your environment
TOKEN="${PERF_SYNTHETIC_MONITOR_TOKEN}"

curl -X POST \
  'https://yrk32651.live.dynatrace.com/api/v2/synthetic/executions/batch' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Api-Token ${TOKEN}" \
  -d '{
        "monitors": [
            {
                "monitorId": "SYNTHETIC_TEST-008CAF328F244320"
            }
        ]
   }'
