#!/bin/bash

set -e

# Only trigger in vercel environment
if [[ -n "$VERCEL_ENV" ]]; then
  if [[ -z "$TIDB_URL" ]]; then
    echo TiDB Cloud Integration not added. See https://github.com/pingcap/ossinsight-lite/blob/main/docs/setup/deploy-to-vercel.md#integrate-tidb-serverless-into-vercel-project
    exit 22
  else
    echo TiDB Cloud Integration added.
  fi
else
  echo Not a vercel build environment, skip TiDB Cloud Integration check.
fi
