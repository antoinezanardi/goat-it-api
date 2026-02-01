---
description: Create a properly named feature branch following project conventions.
agent: build
---


Quick command (interactive helper exists in scripts):

```bash
# Interactive script that helps create branches with the right prefix
pnpm run script:create-branch

# Or manually create a branch following conventions, e.g.:
git checkout -b "feat/my-feature-short-description"
```

Conventions:

- Branch name must match: `^(feat|fix|docs|style|refactor|test|perf|build|ci|chore|revert)/.+$`
- Example: `feat/add-question-theme-pagination` or `fix/validation-mongodb-id`.

Notes:

- The interactive `script:create-branch` script validates the name and applies formatting rules; prefer it for consistency.
- After creating the branch, run `pnpm run lint` and `pnpm run test:unit` locally before pushing.
