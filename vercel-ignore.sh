#!/bin/bash

set -e

# Ignore if git commit message start with "docs:" or branch starts with docs-
GIT_LAST_MSG=$(git log --oneline -1 --pretty=format:%s)
[[ "$GIT_LAST_MSG" =~ ^docs: ]] || [[ "$VERCEL_GIT_COMMIT_REF" =~ ^docs- ]]
